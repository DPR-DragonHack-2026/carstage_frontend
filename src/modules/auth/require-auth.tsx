"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/modules/auth/auth-context";

const PUBLIC_ROUTES = ["/login"];

export function RequireAuth({ children }: { children: React.ReactNode }) {
  const { user, isReady } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isReady) {
      return;
    }
    if (!user && !PUBLIC_ROUTES.includes(pathname)) {
      router.replace("/login");
      return;
    }
    if (user && pathname === "/login") {
      router.replace("/dashboard");
    }
  }, [isReady, pathname, router, user]);

  if (!isReady) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950">
        <p className="text-sm font-medium text-slate-200">Preparing CarStage AI...</p>
      </div>
    );
  }

  return <>{children}</>;
}
