"use client";

import { useEffect } from "react";

import { useSignOut } from "./hooks";

const AUTH_SESSION_EXPIRED_EVENT = "auth:session-expired";

export function AuthProfileSync() {
  const signOut = useSignOut();

  useEffect(() => {
    function handleSessionExpired() {
      void signOut();
    }

    window.addEventListener(AUTH_SESSION_EXPIRED_EVENT, handleSessionExpired);

    return () => {
      window.removeEventListener(AUTH_SESSION_EXPIRED_EVENT, handleSessionExpired);
    };
  }, [signOut]);

  return null;
}
