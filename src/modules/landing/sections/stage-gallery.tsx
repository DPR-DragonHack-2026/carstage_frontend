import Image from "next/image";
import { stageScenes } from "@/modules/landing/data/landing-content";
import { SectionHeading } from "@/modules/landing/sections/section-heading";

export function StageGallery() {
  return (
    <section id="stage-gallery" className="relative py-20 sm:py-24">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Stage library"
          title="Drop your car into any scene"
          subtitle="Showroom floors, neon garages, sunset highways, snowy mountain passes."
        />

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {stageScenes.map((scene) => (
            <figure
              key={scene.id}
              className="group relative overflow-hidden rounded-2xl border border-white/10 bg-slate-950 transition-all duration-150 ease-out will-change-transform hover:-translate-y-0.5 hover:scale-[1.03] hover:border-orange-400/60 hover:shadow-[0_8px_28px_rgba(0,0,0,0.45)] active:scale-[0.99]"
            >
              <div className="relative aspect-[4/3] w-full overflow-hidden">
                <Image
                  src={scene.imageUrl}
                  alt={scene.name}
                  fill
                  sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                  className="object-cover transition-transform duration-200 ease-out group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/30 to-transparent" />
              </div>
              <figcaption className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-4">
                <div>
                  <p className="text-sm font-medium text-white">{scene.name}</p>
                  <p className="text-xs text-slate-300/80">{scene.location}</p>
                </div>
                <span className="rounded-full border border-white/15 bg-slate-950/60 px-2.5 py-1 text-[10px] font-medium uppercase tracking-wider text-slate-200 backdrop-blur-sm">
                  Scene
                </span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
