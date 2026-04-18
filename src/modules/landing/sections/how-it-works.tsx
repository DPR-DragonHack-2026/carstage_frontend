import { howItWorksSteps } from "@/modules/landing/data/landing-content";
import { SectionHeading } from "@/modules/landing/sections/section-heading";

const stepIcons: Record<string, React.ReactNode> = {
  "step-upload": <UploadIcon />,
  "step-stage": <StageIcon />,
  "step-export": <ExportIcon />,
};

export function HowItWorks() {
  return (
    <section id="how-it-works" className="relative py-20 sm:py-24">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="How it works"
          title="From lot photo to launch in three steps"
          subtitle="No retouchers. No re-shoots. Just upload, pick a stage, and ship."
        />

        <ol className="mt-12 grid gap-5 md:grid-cols-3">
          {howItWorksSteps.map((step, index) => (
            <li
              key={step.id}
              className="glass-panel relative flex flex-col gap-4 rounded-2xl p-6"
            >
              <div className="flex items-center justify-between">
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-cyan-300/40 bg-cyan-300/10 text-sm font-medium text-cyan-100">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="text-orange-400/80">
                  {stepIcons[step.id]}
                </span>
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-medium text-white">{step.title}</h3>
                <p className="text-sm text-slate-300">{step.description}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

function UploadIcon() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M12 16V4" />
      <path d="M7 9l5-5 5 5" />
      <path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2" />
    </svg>
  );
}

function StageIcon() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="M3 9h18" />
      <circle cx="8" cy="14" r="1.4" />
    </svg>
  );
}

function ExportIcon() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M12 4v12" />
      <path d="M7 11l5 5 5-5" />
      <path d="M4 20h16" />
    </svg>
  );
}
