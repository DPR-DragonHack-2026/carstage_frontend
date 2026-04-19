import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/components/ui/cn";
import {
  pricingTiers,
  type PricingTier,
} from "@/modules/landing/data/landing-content";
import { SectionHeading } from "@/modules/landing/sections/section-heading";

export function Pricing() {
  return (
    <section id="pricing" className="relative py-20 sm:py-24">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Pricing"
          title="Built to scale with your inventory"
          subtitle="Start solo, grow into a fleet. Cancel anytime."
          align="center"
        />

        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {pricingTiers.map((tier) => (
            <PricingCard key={tier.id} tier={tier} />
          ))}
        </div>
      </div>
    </section>
  );
}

function PricingCard({ tier }: { tier: PricingTier }) {
  const highlighted = Boolean(tier.highlighted);
  return (
    <article
      className={cn(
        "relative flex h-full flex-col rounded-2xl border bg-slate-950/60 p-6 backdrop-blur",
        highlighted
          ? "border-orange-400/70 shadow-[0_0_0_1px_rgba(249,115,22,0.35)]"
          : "border-white/10"
      )}
    >
      {highlighted && (
        <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full border border-orange-400/60 bg-orange-500 px-3 py-1 text-[10px] font-medium uppercase tracking-wider text-slate-950">
          {tier.featuredBadge ?? "Most popular"}
        </span>
      )}

      <header className="space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium text-white">{tier.name}</h3>
          {tier.customPill && (
            <span className="rounded-full border border-cyan-300/40 bg-cyan-300/10 px-2.5 py-1 text-[10px] font-medium uppercase tracking-wider text-cyan-200">
              {tier.customPill}
            </span>
          )}
        </div>
        <p className="text-sm text-slate-300">{tier.blurb}</p>
      </header>

      <div className="mt-5 flex items-baseline gap-1">
        <span className="text-4xl font-medium text-white">{tier.price}</span>
        {tier.cadence && (
          <span className="text-sm text-slate-400">{tier.cadence}</span>
        )}
      </div>

      <ul className="mt-6 flex-1 space-y-3">
        {tier.features.map((feature) => (
          <li
            key={feature}
            className="flex items-start gap-2 text-sm text-slate-200"
          >
            <CheckIcon />
            <span>{feature}</span>
          </li>
        ))}
      </ul>

      <Link href={tier.ctaHref} className="mt-8">
        <Button
          variant={highlighted ? "primary" : "outline"}
          className="w-full"
        >
          {tier.ctaLabel}
        </Button>
      </Link>
    </article>
  );
}

function CheckIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="mt-0.5 shrink-0 text-cyan-300"
      aria-hidden="true"
    >
      <path d="M5 12l5 5 9-11" />
    </svg>
  );
}
