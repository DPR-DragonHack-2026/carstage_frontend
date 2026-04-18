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
    id: "ba-sedan",
    label: "Sedan",
    caption: "Lot photo to studio render in 12s",
    beforeUrl:
      "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?auto=format&fit=crop&w=1400&q=60&sat=-100&blur=2",
    afterUrl:
      "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?auto=format&fit=crop&w=1400&q=85",
  },
  {
    id: "ba-suv",
    label: "SUV",
    caption: "Phone snap to neon showroom in seconds",
    beforeUrl:
      "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?auto=format&fit=crop&w=1400&q=60&sat=-100",
    afterUrl:
      "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?auto=format&fit=crop&w=1400&q=85",
  },
  {
    id: "ba-sport",
    label: "Sports",
    caption: "Driveway shot to magazine cover",
    beforeUrl:
      "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1400&q=60&sat=-100",
    afterUrl:
      "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1400&q=85",
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
    id: "scene-showroom",
    name: "Modern Showroom",
    location: "Los Angeles",
    imageUrl:
      "https://images.unsplash.com/photo-1583267746897-2cf415887172?auto=format&fit=crop&w=1280&q=80",
  },
  {
    id: "scene-night",
    name: "Night Stage Lights",
    location: "Chicago",
    imageUrl:
      "https://images.unsplash.com/photo-1493238792000-8113da705763?auto=format&fit=crop&w=1280&q=80",
  },
  {
    id: "scene-sunset",
    name: "City Sunset",
    location: "Miami",
    imageUrl:
      "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1280&q=80",
  },
  {
    id: "scene-warehouse",
    name: "Industrial Warehouse",
    location: "Dallas",
    imageUrl:
      "https://images.unsplash.com/photo-1616422285623-13ff0162193c?auto=format&fit=crop&w=1280&q=80",
  },
  {
    id: "scene-neon",
    name: "Neon Garage",
    location: "Tokyo",
    imageUrl:
      "https://images.unsplash.com/photo-1542362567-b07e54358753?auto=format&fit=crop&w=1280&q=80",
  },
  {
    id: "scene-mountain",
    name: "Snowy Mountain Road",
    location: "Aspen",
    imageUrl:
      "https://images.unsplash.com/photo-1517524008697-84bbe3c3fd98?auto=format&fit=crop&w=1280&q=80",
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
    id: "tier-starter",
    name: "Starter",
    price: "$29",
    cadence: "/month",
    blurb: "For solo dealers getting started.",
    features: [
      "50 renders / month",
      "10 stage presets",
      "Watermark + logo overlay",
      "Standard export quality",
    ],
    ctaLabel: "Start free",
    ctaHref: "/signup",
  },
  {
    id: "tier-pro",
    name: "Pro",
    price: "$99",
    cadence: "/month",
    blurb: "For growing dealerships running daily inventory.",
    features: [
      "500 renders / month",
      "Full stage library",
      "Bulk processing",
      "HD exports + social presets",
      "Priority rendering queue",
    ],
    ctaLabel: "Start Pro trial",
    ctaHref: "/signup",
    highlighted: true,
  },
  {
    id: "tier-group",
    name: "Dealership Group",
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
    ctaLabel: "Contact sales",
    ctaHref: "/signup",
    customPill: "Custom",
  },
];
