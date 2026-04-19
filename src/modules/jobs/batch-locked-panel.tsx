import Link from "next/link";
import { Button } from "@/components/ui/button";

const features = [
  "Process dozens of cars in a single submission",
  "Multi-brand workspaces with shared presets",
  "API access + integrations",
  "Dedicated success manager and SLA",
];

export function BatchLockedPanel() {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-slate-950/60 p-8">
      <div className="pointer-events-none absolute -right-20 -top-16 h-56 w-56 rounded-full bg-orange-500/15 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-20 -left-16 h-56 w-56 rounded-full bg-cyan-400/10 blur-3xl" />

      <div className="relative flex flex-col items-start gap-5">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-full border border-orange-400/60 bg-orange-500/10 text-orange-300">
            <LockIcon />
          </span>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-orange-300">
              Dealership plan
            </p>
            <h3 className="text-xl font-medium text-white">
              Batch generation is a Dealership feature
            </h3>
          </div>
        </div>

        <p className="max-w-xl text-sm text-slate-300">
          Upload a folder of vehicles and stage them all in one go. Built for
          multi-location groups and auction houses that need to push hundreds of
          listings live each week.
        </p>

        <ul className="grid w-full gap-2 sm:grid-cols-2">
          {features.map((feature) => (
            <li
              key={feature}
              className="flex items-start gap-2 text-sm text-slate-200"
            >
              <CheckIcon />
              <span>{feature}</span>
            </li>
          ))}
        </ul>

        <Link href="/signup" className="mt-2">
          <Button>Talk to sales</Button>
        </Link>
      </div>
    </div>
  );
}

function LockIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="4" y="11" width="16" height="10" rx="2" />
      <path d="M8 11V7a4 4 0 0 1 8 0v4" />
    </svg>
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
