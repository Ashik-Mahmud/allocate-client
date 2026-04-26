"use client";

import { useEffect } from "react";

import { useAuthProfileQuery, useSignOut } from "./hooks";

const AUTH_SESSION_EXPIRED_EVENT = "auth:session-expired";

export function AuthProfileSync() {
  const signOut = useSignOut();

  // Keep auth profile fresh in the background and sync it to shared session state.
  useAuthProfileQuery();

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
