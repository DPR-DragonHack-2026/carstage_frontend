export interface BeforeAfterExample {
  id: string;
  label: string;
  caption: string;
  beforeUrl: string;
  afterUrl: string;
}

export interface StageScene {
  id: string;
  name: string;
  location: string;
  imageUrl: string;
}

export interface PricingTier {
  id: string;
  name: string;
  price: string;
  cadence: string;
  blurb: string;
  features: string[];
  ctaLabel: string;
  ctaHref: string;
  highlighted?: boolean;
  featuredBadge?: string;
  customPill?: string;
}

export interface RoiStat {
  id: string;
  value: string;
  label: string;
  description: string;
}

export interface HowItWorksStep {
  id: string;
  title: string;
  description: string;
}

export const trustLogos: string[] = [
  "Auto Forge",
  "Velocity Motors",
  "North Ridge Auto",
  "Lumen Cars",
  "Stage One Group",
];

export const beforeAfterExamples: BeforeAfterExample[] = [
  {
    id: "ba-sport",
    label: "Sports",
    caption: "Driveway shot to magazine cover in 12s",
    beforeUrl: "/porsche_raw.jpg",
    afterUrl: "/porsche_overlay.jpg",
  },
  {
    id: "ba-sedan",
    label: "Sedan",
    caption: "Lot photo to studio render in 12s",
    beforeUrl: "/bmw_raw.jpg",
    afterUrl: "/bmw_overlay.jpg",
  },
  {
    id: "ba-suv",
    label: "SUV",
    caption: "Phone snap to neon showroom in seconds",
    beforeUrl: "/volvo_raw.jpg",
    afterUrl: "/volvo_overlay.jpg",
  },
];

export const howItWorksSteps: HowItWorksStep[] = [
  {
    id: "step-upload",
    title: "Upload a raw car photo",
    description: "Drag in lot or phone shots. Multiple angles welcome.",
  },
  {
    id: "step-stage",
    title: "Pick a stage or scene",
    description: "Showroom, neon street, mountain road, sunset highway.",
  },
  {
    id: "step-export",
    title: "Download branded images",
    description: "Watermark, color-correct, and export ready-to-publish files.",
  },
];

export const stageScenes: StageScene[] = [
  {
    id: "scene-lucid-showroom",
    name: "Modern Showroom",
    location: "Lucid Air",
    imageUrl: "/combos/lucid_showroom.jpg",
  },
  {
    id: "scene-bmw-neon-garage",
    name: "Neon Garage",
    location: "BMW",
    imageUrl: "/combos/bmw_neon_garage.jpg",
  },
  {
    id: "scene-benz-city-sunset",
    name: "City Sunset",
    location: "Mercedes-Benz",
    imageUrl: "/combos/benz_city_sunset.jpg",
  },
  {
    id: "scene-polestar-warehouse",
    name: "Industrial Warehouse",
    location: "Polestar",
    imageUrl: "/combos/polestar_industrial_warehouse.jpg",
  },
  {
    id: "scene-aston-garage",
    name: "Private Garage",
    location: "Aston Martin",
    imageUrl: "/combos/aston_garage.jpg",
  },
  {
    id: "scene-taycan-mountain",
    name: "Snowy Mountain Road",
    location: "Porsche Taycan",
    imageUrl: "/combos/taycan_snowy_mountain_road.jpg",
  },
];

export const roiStats: RoiStat[] = [
  {
    id: "roi-cost",
    value: "$0",
    label: "Photographer fees",
    description: "Skip the studio rental and editing back-and-forth.",
  },
  {
    id: "roi-speed",
    value: "12s",
    label: "Per render",
    description: "Down from a 2-hour shoot per vehicle.",
  },
  {
    id: "roi-ctr",
    value: "+30%",
    label: "Listing CTR",
    description: "Average lift seen across pilot dealerships.",
  },
];

export const pricingTiers: PricingTier[] = [
  {
    id: "tier-free",
    name: "Free",
    price: "$0",
    cadence: "",
    blurb: "Kick the tires. No credit card required.",
    features: [
      "5 free renders",
      "Standard export quality",
      "Watermark + logo overlay",
      "Pick from 10 stage presets",
    ],
    ctaLabel: "Start free",
    ctaHref: "/signup",
  },
  {
    id: "tier-credits",
    name: "Pay as you go",
    price: "$2",
    cadence: "/credit",
    blurb: "For solo sellers who render on demand.",
    features: [
      "1 credit = 1 render",
      "Volume discounts past 50 credits",
      "Full stage library",
      "HD exports + social presets",
      "No monthly commitment",
    ],
    ctaLabel: "Buy credits",
    ctaHref: "/signup",
  },
  {
    id: "tier-dealership",
    name: "Dealership",
    price: "Custom",
    cadence: "",
    blurb: "For multi-location groups and auction houses.",
    features: [
      "Unlimited renders",
      "Multi-brand workspaces",
      "API access + integrations",
      "Dedicated success manager",
      "SLA + SSO",
    ],
    ctaLabel: "Talk to sales",
    ctaHref: "/signup",
    highlighted: true,
    featuredBadge: "Premium",
  },
];
