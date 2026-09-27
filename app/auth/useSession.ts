"use client";

import { useEffect, useState } from "react";
import {
  getSavedUser,
  getToken,
  sessionChangeEvent,
  type User,
} from "../../lib/api";

export function useSession() {
  const [session, setSession] = useState<{
    ready: boolean;
    user: User | null;
  }>({ ready: false, user: null });

  useEffect(() => {
    const refresh = () => {
      const user = getToken() ? getSavedUser() : null;
      setSession({ ready: true, user });
    };
    const timer = window.setTimeout(refresh, 0);
    window.addEventListener(sessionChangeEvent, refresh);
    window.addEventListener("storage", refresh);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener(sessionChangeEvent, refresh);
      window.removeEventListener("storage", refresh);
    };
  }, []);

  return session;
}
