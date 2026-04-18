import Link from "next/link";
import { Button } from "@/components/ui/button";

export function FinalCta() {
  return (
    <section id="final-cta" className="relative py-20 sm:py-24">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="glass-panel relative overflow-hidden rounded-3xl p-10 sm:p-14">
          <div className="pointer-events-none absolute -left-24 top-0 h-72 w-72 rounded-full bg-orange-500/25 blur-3xl" />
          <div className="pointer-events-none absolute -right-16 bottom-0 h-72 w-72 rounded-full bg-cyan-400/20 blur-3xl" />

          <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="max-w-2xl space-y-3">
              <p className="inline-flex rounded-full border border-cyan-300/40 bg-cyan-300/10 px-3 py-1 text-xs font-medium uppercase tracking-wide text-cyan-200">
                Get started
              </p>
              <h2 className="text-3xl font-medium uppercase leading-tight text-white sm:text-4xl">
                Stop paying for studio shoots.
                <br />
                Start in 2 minutes.
              </h2>
              <p className="text-sm text-slate-300">
                Your first 5 renders are on us. No credit card required.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link href="/jobs/new">
                <Button>Start Creating</Button>
              </Link>
              <Link href="/signup">
                <Button variant="outline">Create account</Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
