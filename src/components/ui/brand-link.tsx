"use client";

import Link from "next/link";

export function BrandLink() {
  const handleClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    if (window.location.pathname === "/") {
      event.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <Link href="/" onClick={handleClick} className="flex items-center gap-2">
      <img src="/logo.png" alt="CarStage AI logo" className="h-10 w-auto" />
      <span className="text-base font-bold tracking-wide text-slate-100">
        CarStage<span className="text-orange-400">AI</span>
      </span>
    </Link>
  );
}
