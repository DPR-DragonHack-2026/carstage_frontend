"use client";

import { AuthProvider } from "@/modules/auth/auth-context";

export function AppProviders({ children }: { children: React.ReactNode }) {
  return <AuthProvider>{children}</AuthProvider>;
}
