import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { TypewriterText } from "@/components/ui/typewriter-text";
import { BrandLink } from "@/components/ui/brand-link";
import { TypewriterWithProgress } from "@/components/ui/typewriter-with-progress";

const heroDescription =
  "Build professional automotive stage photos from raw car images with neon-grade lighting, premium scenes, and branded outputs.";

const heroTagline =
  "Turn lot snapshots into showroom-quality listings in seconds — no photographer, no studio, no editing skills required.";
export function HeroLanding() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950">
      <div className="pointer-events-none absolute -left-32 top-20 h-96 w-96 rounded-full bg-orange-500/25 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 top-16 h-96 w-96 rounded-full bg-cyan-400/20 blur-3xl" />
      <div className="pointer-events-none absolute bottom-10 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-indigo-500/20 blur-3xl" />

      <div className="relative mx-auto flex w-full max-w-7xl flex-col px-4 pb-10 pt-8 sm:px-6 lg:px-8">
        <header className="mb-8 flex items-center justify-between rounded-2xl border border-white/5 bg-slate-950/25 px-4 py-3 backdrop-blur-sm">
          <BrandLink />
          <div className="flex items-center gap-6">
            <NavLinks />
            <div className="flex items-center gap-2">
              <Link href="/login">
                <Button variant="accentOutline">Login</Button>
              </Link>
              <Link href="/signup">
                <Button variant="accentSolid">Signup</Button>
              </Link>
            </div>
          </div>
        </header>

        <section className="glass-panel relative overflow-hidden rounded-3xl shadow-2xl shadow-black/40">
          <div className="relative h-[560px] w-full">
            <Image
              src="/variation_4.jpg"
              alt="Premium sports car"
              fill
              priority
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black via-black/75 to-slate-950/35" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(249,115,22,0.35),transparent_35%),radial-gradient(circle_at_78%_28%,rgba(34,211,238,0.35),transparent_38%)]" />

            <div className="absolute inset-0 flex flex-col justify-between p-8 sm:p-12">
              <div className="max-w-2xl space-y-5">
                <p className="inline-flex rounded-full border border-cyan-300/40 bg-cyan-300/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-cyan-200">
                  Next-gen dealer visuals
                </p>
                <h1 className="text-4xl font-black uppercase leading-tight text-white sm:text-5xl">
                  Dealer-ready car photos
                  <br />
                  without studio shoots
                </h1>
                <div className="inline-block w-full max-w-xl rounded-xl border border-white/5 bg-slate-950/25 px-4 py-3 backdrop-blur-sm">
                  <TypewriterWithProgress
                    text={heroDescription}
                    textClassName="text-xs text-slate-100 sm:text-sm"
                    speedMs={22}
                    startDelayMs={150}
                  />
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex flex-wrap items-center gap-3">
                  <Link href="/jobs/new">
                    <Button>Start Creating</Button>
                  </Link>
                  <Link href="/dashboard">
                    <Button variant="outline">Open Dashboard</Button>
                  </Link>
                </div>
                <TrustStrip />
              </div>
            </div>

          </div>
        </section>
      </div>
    </div>
  );
}

const navLinks = [
  { label: "Features", href: "#" },
  { label: "Pricing", href: "#" },
  { label: "Contact", href: "#" },
];

function NavLinks() {
  return (
    <nav className="hidden items-center gap-5 md:flex">
      {navLinks.map((link) => (
        <Link
          key={link.label}
          href={link.href}
          className="text-sm font-medium text-slate-300 transition-colors hover:text-white"
        >
          {link.label}
        </Link>
      ))}
    </nav>
  );
}

function TrustStrip() {
  return (
    <div className="rounded-xl border border-white/10 bg-slate-950/40 px-4 py-3 backdrop-blur-sm">
      <TypewriterText
        text={heroTagline}
        className="text-sm text-slate-200"
        speedMs={22}
        startDelayMs={250}
      />
    </div>
  );
}
