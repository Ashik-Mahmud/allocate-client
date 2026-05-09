# Realtime (Socket) — Usage & Design

This document explains the client-side realtime system implemented at `features/realtime/socket-provider.tsx` and how to consume the sockets (including the `notifications` namespace) from the app.

Summary
- Single app-wide provider: `RealtimeSocketProvider` is mounted in the root providers tree so the app has a single place managing realtime connections.
- Normalized envelope: all incoming events are converted to a `RealtimeEventEnvelope` with { event, channel, data, receivedAt, raw } so consumers can use a single shape across namespaces.
- Namespaces supported: you can create/obtain namespace sockets (e.g. `/notifications`) without duplicating logic.
- Convenience hooks: `useRealtimeEvent`, `useRealtimeManager`, `useNamespaceSocket`, `useNotificationSocket`, and the provider itself.

Why this design
- Keep a single entry point for socket lifecycle and auth handling.
- Normalize event payloads so UI code doesn't need to care about server-side payload shapes.
- Support named namespaces so different domains (notifications, chat, presence) can be colocated and managed independently.

Files
- `features/realtime/socket-provider.tsx` — main provider, normalization, namespace manager and hooks.
- `features/realtime/index.ts` — exports.
- `features/notifications/notification-realtime-sync.tsx` — example bridge that subscribes the notifications namespace and invalidates the React Query cache for notifications.

Core concepts

- RealtimeEventEnvelope

```ts
type RealtimeEventEnvelope<T = unknown> = {
  event: string;       // normalized event name
  channel: string;     // inferred channel/namespace (eg. "notifications")
  data: T;             // event payload
  receivedAt: string;  // ISO timestamp when client received the event
  raw: unknown;        // original args from socket
};
```

- Namespaces

The provider exposes a manager that can get a namespace socket: `manager.getNamespaceSocket('notifications')` or via hooks `useNamespaceSocket('notifications')` / `useNotificationSocket()`.

The namespace socket is a proper socket.io endpoint connected at `${API_BASE_URL}/notifications` (the `notifications` path is prefixed with `/`).

Mounting

The provider is already mounted app-wide in `components/shared/providers.tsx` so you don't need to add it manually. It uses the same access token the HTTP layer saves to local storage / NextAuth session.

How to listen

1) Global normalized listeners (all namespaces/events):

```tsx
import { useRealtimeEvent } from '@/features/realtime';

useRealtimeEvent((envelope) => {
  // envelope.event, envelope.channel, envelope.data
  console.log('any realtime event', envelope);
}, {
  // optional filter: eventName / channel / predicate
  channel: 'notifications',
});
```

2) Namespace-specific subscription (recommended for scoped logic):

```tsx
import { useNotificationSocket } from '@/features/realtime';

function NotificationsWidget() {
  const { socket, connected } = useNotificationSocket();

  useEffect(() => {
    if (!socket) return;

    const handler = (eventName: string, payload: any) => {
      console.log('ns event', eventName, payload);
    };

    socket.onAny(handler);
    return () => socket.offAny(handler);
  }, [socket]);

  return <div>{connected ? 'Live' : 'Disconnected'}</div>;
}
```

3) Manager-level subscription helpers

```tsx
import { useRealtimeManager } from '@/features/realtime';

const manager = useRealtimeManager();

// subscribe to namespace from manager
useEffect(() => {
  const unsub = manager.subscribeNamespace('notifications', (envelope) => {
    // envelope already normalized
  });

  return () => unsub();
}, [manager]);
```

Emitting events

You can emit from any socket returned by `getNamespaceSocket` or the global `socket`:

```ts
const { socket } = useNamespaceSocket('notifications');
socket?.emit('my:event', { data: 'x' });
```

Auth

The provider reads your saved access token (the same one used by the HTTP client) and sends it as `auth.token` to the server. The provider also refreshes the token on reconnect attempts by re-reading storage so you don't get stuck with a stale token after an HTTP refresh.

Server (example) — how to emit to user room

Given your backend `handleConnection` excerpt (where you join `userRoom(payload.userId)`), the server should emit the normalized envelope to the user room. Example (Node/Socket.io server):

```js
// server-side
io.to(userRoom(userId)).emit('notification:created', {
  event: 'notification:created',
  channel: 'notifications',
  data: {
    id: '...',
    title: 'New booking',
    message: 'Your booking was confirmed',
  },
  meta: { source: 'booking-service' }
});
```

Notes: the client normalization will accept payloads where the first arg is an object and will prefer `payload.event` or `payload.type` (or fall back to the socket event name). If you include `channel` or `type` on the server payload that helps the client infer routing.

Practical example: notify a single user

```js
// after you create a notification in DB
const envelope = {
  event: 'notification:created',
  type: 'BOOKING_CONFIRMED',
  data: { id, title, message, createdAt: new Date() }
};

io.to(userRoom(userId)).emit('notification', envelope);
// or emit on namespace
io.of('/notifications').to(userRoom(userId)).emit('notification', envelope);
```

Testing locally

1. Make sure `NEXT_PUBLIC_API_BASE_URL` points to your API server (default is `http://localhost:4000`).
2. Start the frontend `pnpm dev` and backend server.
3. Authenticate (so `accessToken` is present) and open the dashboard.
4. Use a server-side script to emit to the user room and observe the UI updating (or inspect console logs).

FAQ / tips
- If you see no events: confirm the client is connected (use `useRealtimeManager().socket` and check `connected`) and that the server is emitting to the same room/namespace.
- To add a new domain namespace (e.g. `chat`) use `manager.getNamespaceSocket('chat')` and subscribe; the provider will manage lifecycle.
- Keep server payloads predictable: including `event` or `type` and `data` fields makes client normalization more accurate.

If you'd like, I can:
- Add a tiny debug page in `app/` that shows connection state and last envelopes received.
- Add a server-side example file to this repo showing how to emit from the backend (if backend code is available in this workspace).

---
Generated by the realtime refactor — placed in `features/realtime/README.md`.
