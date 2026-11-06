export interface SponsorshipTier {
  id: string;
  name: string;
  badge: string;
  priceDisplay: string;
  minPrice: number;
  popular?: boolean;
  cumulativeFrom?: string;
  shortDesc: string;
  deliverables: string[];
}

export interface MetricHighlight {
  value: string;
  label: string;
  detail: string;
}

export const SUMMIT_SPONSOR_CONFIG = {
  eventName: "Athena Summit 2026",
  dates: "20–21 November 2026",
  location: "CNLU, Patna",
  venue: "Chanakya National Law University (CNLU)",
  venueAddress: "Nyaya Nagar, Mithapur, Patna, Bihar 800001",
  delegatesTarget: "500+",
  committeesCount: 6,
  brochureUrl: "/brochure/athena-sponsorship-brochure.pdf",
  mapDirectionsUrl:
    "https://www.google.com/maps/search/?api=1&query=Chanakya+National+Law+University+Patna",
  mapEmbedUrl:
    "https://maps.google.com/maps?q=Chanakya+National+Law+University+Patna&t=&z=15&ie=UTF8&iwloc=&output=embed",
  coOrganizers: [
    {
      name: "Startly Innovations Pvt. Ltd.",
      role: "Co-Organiser",
      note: "Award-winning biotech leader turning organic waste into eco-products (ISO Certified, 115+ partner companies).",
    },
    {
      name: "ELDR. Debate Organisation",
      role: "Academic & Logistical Partner",
      note: "Global format debate authority across WSDC, BP, and Asian Parliamentary formats.",
    },
  ],
  contacts: {
    primaryPhone: "+91 7979713472",
    secondaryPhone: "+91 7979891460",
    email: "project.athena03@gmail.com",
    instagram: "@athena.summit",
    instagramUrl: "https://instagram.com/athena.summit",
  },
};

export const SPONSOR_METRICS: MetricHighlight[] = [
  {
    value: "500+",
    label: "School & Youth Delegates",
    detail: "Class 5–12 students, school delegations, and faculty advisors across Bihar & India.",
  },
  {
    value: "142K+",
    label: "30-Day Digital Impressions",
    detail: "32K+ engaged viewers across Instagram reels, stories, and community posts.",
  },
  {
    value: "100+",
    label: "Campus Ambassadors",
    detail: "Direct on-ground student leadership network reaching schools and colleges.",
  },
  {
    value: "6",
    label: "Specialized Assemblies",
    detail: "UN organs, domestic parliaments, crisis room, and international press corps.",
  },
];

export const SPONSORSHIP_TIERS: SponsorshipTier[] = [
  {
    id: "seed",
    name: "Seed Partner",
    badge: "Foundation Tier",
    priceDisplay: "₹10,000",
    minPrice: 10000,
    shortDesc: "Essential visibility across all digital releases, social shout-outs, and venue sponsor wall.",
    deliverables: [
      "Supported-By Logo placement on posters and digital creatives",
      "Official Sponsor Wall logo presence at the venue entrance",
      "Opening Ceremony official emcee acknowledgement & mention",
      "1 Dedicated social media shout-out on @athena.summit",
    ],
  },
  {
    id: "sprout",
    name: "Sprout Partner",
    badge: "Growth Tier",
    priceDisplay: "₹20,000 – ₹30,000",
    minPrice: 20000,
    cumulativeFrom: "Seed",
    shortDesc: "Physical delegate touchpoints, venue standees, and official website backlink branding.",
    deliverables: [
      "Every Seed Partner benefit included",
      "Dedicated high-visibility venue standee in plenary pathways",
      "Physical delegate-kit insert (brochures / flyers / stickers)",
      "Official website and brochure logo placement with live link",
      "Dedicated social media spotlight feature post",
      "Closing ceremony official valedictory mention",
    ],
  },
  {
    id: "bloom",
    name: "Bloom Partner",
    badge: "Most Popular",
    popular: true,
    priceDisplay: "₹40,000 – ₹50,000",
    minPrice: 40000,
    cumulativeFrom: "Sprout",
    shortDesc: "Exclusive lunch hall branding, committee placard/ID logo, and main-stage podium announcement.",
    deliverables: [
      "Every Sprout Partner benefit included",
      "Exclusive lunch and refreshment hall dining branding",
      "2 High-visibility venue banners across committee areas",
      "2-Minute brand announcement address from the main stage",
      "Logo placement on delegate ID cards or committee placards",
      "3 Dedicated social media reel and story features",
    ],
  },
  {
    id: "catalyst",
    name: "Catalyst Partner",
    badge: "Ecosystem Leader",
    priceDisplay: "₹60,000 – ₹70,000",
    minPrice: 60000,
    cumulativeFrom: "Bloom",
    shortDesc: "Co-branded delegate kits, startup pitch finals integration, and a dedicated exhibition stall.",
    deliverables: [
      "Every Bloom Partner benefit included",
      "Co-branded delegate kits provided to all 500+ participants",
      "Official 'Featured Partner' accreditation in press releases",
      "5-Minute executive address during plenary proceedings",
      "Presence and brand role in the Startup Track pitch finals",
      "Dedicated on-ground brand exhibition stall at the summit",
      "Permanent main-stage backdrop logo prominence",
    ],
  },
  {
    id: "principal",
    name: "Principal Partner",
    badge: "Title Presenter (Exclusive)",
    priceDisplay: "₹90,000",
    minPrice: 90000,
    cumulativeFrom: "Catalyst",
    shortDesc: "Top-billing headline branding ('In association with...'), 10-minute keynote, and trophy presentation.",
    deliverables: [
      "Every Catalyst Partner benefit included",
      "Top-Billing Headline Title: 'In Association with [Your Brand]'",
      "10-Minute main-stage keynote address to all delegations",
      "Stage presence at all opening, plenary, and closing ceremonies",
      "Official prize and trophy distribution honors on stage",
      "Customized Pitch-Day activity or branded challenge track",
      "Prime high-footfall exhibition stall in central venue area",
    ],
  },
];

export const SPONSOR_WHY_US = [
  {
    title: "Reach 500+ Aspirational Students",
    desc: "Direct access across two full days of debate, networking, and workshops with students from Class 5 to 12, accompanied by teachers and school delegations.",
  },
  {
    title: "Startup & Innovation Track",
    desc: "Beyond traditional committee rooms, Athena hosts a dedicated startup track with founder workshops and a live pitch competition.",
  },
  {
    title: "Social Purpose & Community Action",
    desc: "We sponsor delegate seats for underprivileged students from partner NGOs and run a summit fundraiser to support local educational causes.",
  },
  {
    title: "End-to-End Event Management",
    desc: "From delegate affairs, venue hospitality, and logistics to live media coverage, our experienced team ensures your brand partnership runs seamlessly.",
  },
];

