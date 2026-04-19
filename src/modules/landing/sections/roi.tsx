import { CountUpNumber } from "@/components/ui/count-up-number";
import { roiStats } from "@/modules/landing/data/landing-content";
import { SectionHeading } from "@/modules/landing/sections/section-heading";

export function Roi() {
  return (
    <section id="roi" className="relative py-20 sm:py-24">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="ROI"
          title="The numbers your CFO will like"
          subtitle="What dealerships save when they swap studio shoots for CarStage AI."
        />

        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {roiStats.map((stat) => (
            <article key={stat.id} className="glass-panel rounded-2xl p-6">
              <CountUpNumber
                value={stat.value}
                className="block text-5xl font-medium tabular-nums text-white sm:text-6xl"
              />
              <p className="mt-3 text-sm font-medium uppercase tracking-wider text-cyan-200">
                {stat.label}
              </p>
              <p className="mt-2 text-sm text-slate-300">{stat.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
