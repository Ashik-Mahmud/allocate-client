"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { useSession } from "next-auth/react";
import { io, type Socket } from "socket.io-client";

import { readAuthSession } from "@/features/auth";

export type RealtimeEventEnvelope<T = unknown> = {
  event: string;
  channel: string;
  data: T;
  receivedAt: string;
  raw: unknown;
};

type RealtimeSubscriptionFilter = {
  eventName?: string | RegExp;
  channel?: string | RegExp;
  predicate?: (event: RealtimeEventEnvelope) => boolean;
};

type RealtimeListener = (event: RealtimeEventEnvelope) => void;

type RealtimeSubscription = {
  listener: RealtimeListener;
  filter?: RealtimeSubscriptionFilter;
};

type NamespaceSocketState = {
  socket: Socket;
  connected: boolean;
};

type RealtimeSocketContextValue = {
  socket: Socket | null; // legacy single socket (global)
  connected: boolean;
  connecting: boolean;
  lastEvent: RealtimeEventEnvelope | null;
  lastError: string | null;
  emit: (...args: Parameters<Socket["emit"]>) => Socket | null;
  subscribe: (listener: RealtimeListener, filter?: RealtimeSubscriptionFilter) => () => void;
  // new APIs
  getNamespaceSocket: (ns: string) => Socket;
  subscribeNamespace: (ns: string, listener: RealtimeListener) => () => void;
  getNamespaceState: (ns: string) => NamespaceSocketState | null;
};

const DEFAULT_SOCKET_BASE_URL = "http://localhost:4000";

let socketSingleton: Socket | null = null;

function getSocketBaseUrl() {
  const fromEnv = process.env.NEXT_PUBLIC_API_BASE_URL;

  if (!fromEnv) {
    return DEFAULT_SOCKET_BASE_URL;
  }

  return fromEnv.replace(/\/$/, "");
}

function getAccessToken() {
  const session = readAuthSession();
  const sessionToken = session?.accessToken?.trim() ?? "";

  if (sessionToken) {
    return sessionToken;
  }

  return null;
}

function getSocketInstance() {
  if (!socketSingleton) {
    socketSingleton = io(getSocketBaseUrl(), {
      autoConnect: false,
      transports: ["websocket", "polling"],
      withCredentials: true,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1_000,
    });
  }

  return socketSingleton;
}

function createNamespaceSocket(ns: string, token?: string) {
  const base = getSocketBaseUrl();
  const path = ns.startsWith("/") ? ns : `/${ns}`;

  const s = io(`${base}${path}`, {
    autoConnect: false,
    transports: ["websocket", "polling"],
    withCredentials: true,
    auth: token ? { token } : undefined,
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
  });

  return s;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function inferChannel(eventName: string, payload: Record<string, unknown>) {
  const explicitChannel = payload.channel;

  if (typeof explicitChannel === "string" && explicitChannel.trim().length > 0) {
    return explicitChannel.trim();
  }

  if (eventName.includes(":")) {
    return eventName.split(":")[0] ?? eventName;
  }

  const typedEvent = payload.type;

  if (typeof typedEvent === "string" && typedEvent.toLowerCase().includes("notification")) {
    return "notifications";
  }

  if (eventName.toLowerCase().includes("notification")) {
    return "notifications";
  }

  return "global";
}

function normalizeRealtimeEvent(eventName: string, args: unknown[]): RealtimeEventEnvelope {
  const firstArg = args[0];
  const receivedAt = new Date().toISOString();

  if (isRecord(firstArg)) {
    const payload = firstArg;
    const resolvedEvent =
      typeof payload.event === "string" && payload.event.trim().length > 0
        ? payload.event.trim()
        : typeof payload.type === "string" && payload.type.trim().length > 0
          ? payload.type.trim()
          : eventName;

    const resolvedData =
      Object.prototype.hasOwnProperty.call(payload, "data")
        ? payload.data
        : Object.prototype.hasOwnProperty.call(payload, "payload")
          ? payload.payload
          : payload;

    return {
      event: resolvedEvent,
      channel: inferChannel(resolvedEvent, payload),
      data: resolvedData,
      receivedAt,
      raw: args.length <= 1 ? payload : args,
    };
  }

  return {
    event: eventName,
    channel: eventName.toLowerCase().includes("notification") ? "notifications" : "global",
    data: args.length <= 1 ? firstArg ?? null : args,
    receivedAt,
    raw: args,
  };
}

function matchesFilter(event: RealtimeEventEnvelope, filter?: RealtimeSubscriptionFilter) {
  if (!filter) {
    return true;
  }

  if (filter.eventName) {
    const matchesEventName =
      typeof filter.eventName === "string"
        ? event.event === filter.eventName
        : filter.eventName.test(event.event);

    if (!matchesEventName) {
      return false;
    }
  }

  if (filter.channel) {
    const matchesChannel =
      typeof filter.channel === "string"
        ? event.channel === filter.channel
        : filter.channel.test(event.channel);

    if (!matchesChannel) {
      return false;
    }
  }

  if (filter.predicate && !filter.predicate(event)) {
    return false;
  }

  return true;
}

const RealtimeSocketContext = createContext<RealtimeSocketContextValue | null>(null);

export function RealtimeSocketProvider({ children }: { children: React.ReactNode }) {
  const session = useSession();
  const [connected, setConnected] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [lastEvent, setLastEvent] = useState<RealtimeEventEnvelope | null>(null);
  const [lastError, setLastError] = useState<string | null>(null);
  const subscriptionsRef = useRef<Set<RealtimeSubscription>>(new Set());
  const socketRef = useRef<Socket | null>(null);
  const namespaceMap = useRef<Map<string, { socket: Socket; connected: boolean }>>(new Map());
  const isMounted = useRef(false);
  const accessToken = useMemo(() => {
    const sessionToken = session.data?.accessToken?.trim() ?? "";

    if (sessionToken) {
      return sessionToken;
    }

    return getAccessToken();
  }, [session.data?.accessToken]);

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, [])

  useEffect(() => {
    const socket = getSocketInstance();
    socketRef.current = socket;

    if (!accessToken || session.status !== "authenticated") {
      socket.disconnect();
      setConnected(false);
      setConnecting(false);
      return;
    }

    socket.auth = { token: accessToken };

    const syncSocketAuth = () => {
      const nextToken = getAccessToken() ?? accessToken;

      if (nextToken) {
        socket.auth = { token: nextToken };
      }
    };

    const handleConnect = () => {
      setConnected(true);
      setConnecting(false);
      setLastError(null);
    };

    const handleDisconnect = () => {
      setConnected(false);
      setConnecting(false);
    };

    const handleConnectError = (error: Error) => {
      setLastError(error.message);
      setConnecting(false);
    };

    const handleAnyEvent = (eventName: string, ...args: unknown[]) => {
      const envelope = normalizeRealtimeEvent(eventName, args);
      setLastEvent(envelope);

      for (const subscription of subscriptionsRef.current) {
        if (matchesFilter(envelope, subscription.filter)) {
          subscription.listener(envelope);
        }
      }
    };

    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);
    socket.on("connect_error", handleConnectError);
    socket.on("reconnect_attempt", syncSocketAuth);
    socket.onAny(handleAnyEvent);

    if (!socket.connected) {
      syncSocketAuth();
      setConnecting(true);
      socket.connect();
    } else {
      handleConnect();
    }

    return () => {
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
      socket.off("connect_error", handleConnectError);
      socket.off("reconnect_attempt", syncSocketAuth);
      socket.offAny(handleAnyEvent);
    };
  }, [accessToken, session.status]);

  // Namespace management helpers
  const getNamespaceSocket = useCallback(
    (ns: string) => {
      const key = ns.replace(/^\//, "");

      const existing = namespaceMap.current.get(key);
      if (existing) return existing.socket;

      const token = getAccessToken();
      const s = createNamespaceSocket(key, token ?? undefined);

      // attach basic listeners to keep state
      const onConnect = () => {
        const prev = namespaceMap.current.get(key) ?? { socket: s, connected: false };
        namespaceMap.current.set(key, { ...prev, connected: true });
      };

      const onDisconnect = () => {
        const prev = namespaceMap.current.get(key) ?? { socket: s, connected: false };
        namespaceMap.current.set(key, { ...prev, connected: false });
      };

      s.on("connect", onConnect);
      s.on("disconnect", onDisconnect);

      // forward all events into the global subscriptions as normalized envelopes
      s.onAny((ename, ...args) => {
        const envelope = normalizeRealtimeEvent(ename, args as unknown[]);
        if (isMounted.current) {
          setLastEvent(envelope);
        }
        for (const subscription of subscriptionsRef.current) {
          if (matchesFilter(envelope, subscription.filter)) {
            subscription.listener(envelope);
          }
        }
      });

      namespaceMap.current.set(key, { socket: s, connected: false });
      // connect immediately if we have a token and authenticated
      if (accessToken && session.status === "authenticated") {
        s.auth = { token: accessToken };
        s.connect();
      }

      return s;
    },
    [accessToken, session.status]
  );

  const subscribeNamespace = useCallback((ns: string, listener: RealtimeListener) => {
    const s = getNamespaceSocket(ns);
    const wrapper = (ename: string, ...args: unknown[]) => {
      const envelope = normalizeRealtimeEvent(ename, args as unknown[]);
      listener(envelope);
    };

    s.onAny(wrapper);

    return () => {
      s.offAny(wrapper);
    };
  }, [getNamespaceSocket]);

  const getNamespaceState = useCallback((ns: string) => {
    const key = ns.replace(/^\//, "");
    const val = namespaceMap.current.get(key);
    return val ? { socket: val.socket, connected: val.connected } : null;
  }, []);

  useEffect(() => {
    return () => {
      socketRef.current?.disconnect();
      socketRef.current = null;
      subscriptionsRef.current.clear();
    };
  }, []);

  const subscribe = useCallback(
    (listener: RealtimeListener, filter?: RealtimeSubscriptionFilter) => {
      const subscription: RealtimeSubscription = { listener, filter };
      subscriptionsRef.current.add(subscription);

      return () => {
        subscriptionsRef.current.delete(subscription);
      };
    },
    []
  );

  const emit = useCallback<RealtimeSocketContextValue["emit"]>((...args) => {
    if (!socketRef.current) {
      return null;
    }

    return socketRef.current.emit(...args);
  }, []);

  const value = useMemo<RealtimeSocketContextValue>(() => {
    return {
      socket: socketRef.current,
      connected,
      connecting,
      lastEvent,
      lastError,
      emit,
      subscribe,
      getNamespaceSocket,
      subscribeNamespace,
      getNamespaceState,
    };
  }, [connected, connecting, emit, lastError, lastEvent, subscribe, getNamespaceSocket, subscribeNamespace, getNamespaceState]);

  return <RealtimeSocketContext.Provider value={value}>{children}</RealtimeSocketContext.Provider>;
}

export function useRealtimeSocket() {
  const context = useContext(RealtimeSocketContext);

  if (!context) {
    throw new Error("useRealtimeSocket must be used within RealtimeSocketProvider");
  }

  return context;
}

export function useRealtimeEvent(
  listener: RealtimeListener,
  filter?: RealtimeSubscriptionFilter
) {
  const { subscribe } = useRealtimeSocket();
  const listenerRef = useRef(listener);

  useEffect(() => {
    listenerRef.current = listener;
  }, [listener]);

  useEffect(() => {
    return subscribe((event) => {
      listenerRef.current(event);
    }, filter);
  }, [filter, subscribe]);
}

// Convenience: access full manager
export function useRealtimeManager() {
  return useRealtimeSocket();
}

// Hook to get a namespace socket and its connected state
export function useNamespaceSocket(ns: string) {
  const manager = useRealtimeSocket();

  const socket = useMemo(() => {
    try {
      return manager.getNamespaceSocket(ns);
    } catch {
      return null;
    }
  }, [manager, ns]);

  const state = useMemo(() => manager.getNamespaceState(ns), [manager, ns]);

  return {
    socket,
    connected: state?.connected ?? false,
  };
}
