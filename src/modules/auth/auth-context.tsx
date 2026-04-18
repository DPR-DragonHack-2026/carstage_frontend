"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import {
  getSession,
  loginWithAnyCredentials,
  logout,
  type SessionUser,
} from "@/lib/api/auth";

interface AuthContextValue {
  user: SessionUser | null;
  isReady: boolean;
  login: (email: string, password: string) => Promise<void>;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<SessionUser | null>(() => getSession());
  const [isReady] = useState(true);

  const login = useCallback(async (email: string, password: string) => {
    const session = await loginWithAnyCredentials(email, password);
    setUser(session);
  }, []);

  const signOut = useCallback(() => {
    logout();
    setUser(null);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isReady,
      login,
      signOut,
    }),
    [isReady, login, signOut, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider.");
  }
  return context;
}
