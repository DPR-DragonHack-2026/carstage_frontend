"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { cn } from "@/components/ui/cn";

const navItems = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/jobs/new", label: "Create Job" },
  { href: "/jobs/history", label: "History" },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLanding = pathname === "/";
  const isLogin = pathname === "/login";
  const isSignup = pathname === "/signup";

  if (isLanding || isLogin || isSignup) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-slate-950">
      <header className="border-b border-slate-800 bg-slate-950/95 backdrop-blur">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
          <Link href="/dashboard" className="flex items-center gap-3">
            <div className="relative h-9 w-9 overflow-hidden rounded-md border border-slate-700">
              <Image src="/logo.png" alt="CarStage AI logo" fill className="object-cover" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-100">CarStage AI</p>
              <p className="text-xs text-slate-400">Automotive Stage Generator</p>
            </div>
          </Link>
          <div className="flex items-center gap-3">
            <Link href="/login">
              <Button variant="ghost">Login</Button>
            </Link>
            <Link href="/signup">
              <Button variant="outline">Signup</Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="mx-auto grid w-full max-w-7xl gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[220px_1fr]">
        <aside className="rounded-xl border border-slate-800 bg-slate-900/90 p-3">
          <nav className="space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "block rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  pathname === item.href
                    ? "bg-cyan-400 text-slate-950"
                    : "text-slate-300 hover:bg-slate-800"
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </aside>
        <main>{children}</main>
      </div>
    </div>
  );
}
