"use client";

import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import * as auth from "@/lib/authClient";

type AuthState = {
  accessToken: string | null;
  user: any | null;
  loading: boolean;
  error: string | null;
  doLogin: (email: string, password: string) => Promise<void>;
  doRegister: (email: string, password: string) => Promise<void>;
  doLogout: () => Promise<void>;
  refreshMe: () => Promise<void>;
};

const Ctx = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function refreshMe() {
    setError(null);
    // try /auth/me first if we already have token
    try {
      if (accessToken) {
        const u = await auth.me(accessToken);
        setUser(u);
        return;
      }
    } catch {
      // fallthrough -> refresh
    }

    // page reload case: use refresh cookie to get new access token
    const newAT = await auth.refresh();
    setAccessToken(newAT);
    const u = await auth.me(newAT);
    setUser(u);
  }

  useEffect(() => {
    (async () => {
      try {
        await refreshMe();
      } catch (e: any) {
        // Not logged in is OK
        setUser(null);
        setAccessToken(null);
        setError(e?.message ?? "not authenticated");
      } finally {
        setLoading(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function doLogin(email: string, password: string) {
    setError(null);
    const at = await auth.login(email, password);
    setAccessToken(at);
    const u = await auth.me(at);
    setUser(u);
  }

  async function doRegister(email: string, password: string) {
    setError(null);
    const at = await auth.register(email, password);
    setAccessToken(at);
    const u = await auth.me(at);
    setUser(u);
  }

  async function doLogout() {
    setError(null);
    try {
      if (accessToken) await auth.logout(accessToken);
      else await auth.logout();
    } finally {
      setAccessToken(null);
      setUser(null);
    }
  }

  const value = useMemo<AuthState>(
    () => ({ accessToken, user, loading, error, doLogin, doRegister, doLogout, refreshMe }),
    [accessToken, user, loading, error]
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useAuth() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useAuth must be used inside AuthProvider");
  return v;
}
