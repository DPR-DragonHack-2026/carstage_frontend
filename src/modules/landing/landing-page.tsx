import { HeroLanding } from "@/modules/landing/hero-landing";
import { BeforeAfter } from "@/modules/landing/sections/before-after";
import { HowItWorks } from "@/modules/landing/sections/how-it-works";
import { StageGallery } from "@/modules/landing/sections/stage-gallery";
import { Roi } from "@/modules/landing/sections/roi";
import { Pricing } from "@/modules/landing/sections/pricing";
import { FinalCta } from "@/modules/landing/sections/final-cta";

export function LandingPage() {
  return (
    <div className="bg-slate-950">
      <HeroLanding />
      <BeforeAfter />
      <HowItWorks />
      <StageGallery />
      <Roi />
      <Pricing />
      <FinalCta />
    </div>
  );
}
