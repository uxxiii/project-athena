"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  Globe,
  Users,
  Award,
  Gavel,
  Quote,
  ChevronRight,
  X,
  Calendar,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { committees as committeeData } from "@/data/committees";

function InstagramIcon({ size = 15, className = "" }: { size?: number; className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

const featuredCommittees = committeeData.map((committee) => ({
  name: committee.name,
  full: committee.fullName,
  seats:
    committee.maxDelegates === Number.MAX_SAFE_INTEGER
      ? "No Limit"
      : `${committee.maxDelegates} Seats`,
  category:
    committee.name === "UNSC"
      ? "Double Delegation"
      : committee.name === "IP"
      ? "Press Corps"
      : committee.name === "IPL"
      ? "Sports Crisis"
      : committee.name === "HCC"
      ? "Historical Crisis"
      : committee.name === "UNCSW"
      ? "Human Rights"
      : committee.name === "UNHRC"
      ? "International Law"
      : committee.name === "UNGA-DISEC" || committee.name === "DISEC"
      ? "Security Affairs"
      : committee.name === "AIPPM"
      ? "Indian Governance"
      : committee.name === "BLA"
      ? "State Governance"
      : committee.name === "Lok Sabha"
      ? "Indian Parliament"
      : committee.name === "JPC"
      ? "Parliamentary Committee"
      : committee.name === "UNW"
      ? "Gender & Tech"
      : "Transnational Crime",
}));

const pillars = [
  {
    number: "01",
    icon: Globe,
    title: `${committeeData.length} Specialized Assemblies`,
    desc: "From sovereign UN organs to dynamic crisis rooms and domestic Indian parliaments, structured for high-octane diplomatic debate.",
  },
  {
    number: "02",
    icon: Users,
    title: "Premier Delegation Cohort",
    desc: "Gathering elite delegates, seasoned scholars, and articulate debaters from premier universities and institutions across India.",
  },
  {
    number: "03",
    icon: Award,
    title: "Editorial & Procedural Rigour",
    desc: "Bespoke Rules of Procedure (RoPs), exhaustive background study guides, and an algorithmic real-time allocation matrix.",
  },
  {
    number: "04",
    icon: Gavel,
    title: "Direct Action Directives",
    desc: "Resolution drafting, dynamic crisis communiqués, and realistic procedural voting replicating actual international diplomacy.",
  },
];

const IMPACT_SLIDES = [
  {
    tag: "Childhood Education",
    title: "Breaking Barriers Through Learning Kits",
    desc: "Direct supply of school bags, textbooks, uniforms, and after-school academic tuition for underprivileged children in local shelters.",
    stat: "100%",
    statLabel: "Event Profits To NGOs",
    badges: ["School Supplies", "After-School Tuition", "Scholarships"],
  },
  {
    tag: "Rehabilitation",
    title: "Women's Empowerment & Self-Reliance",
    desc: "Supporting survivors of domestic hardship and marginalized women with vocational tailoring equipment, psychological counseling, and startup toolkits.",
    stat: "₹0",
    statLabel: "Intermediary Overhead",
    badges: ["Vocational Toolkits", "Trauma Counseling", "Micro-Enterprise"],
  },
  {
    tag: "Grassroots Voice",
    title: "Diplomacy Connected to Real World Impact",
    desc: "Every delegate speech and resolution at Athena Summit translates directly into funded grassroots intervention across verified partner NGO chapters.",
    stat: "500+",
    statLabel: "Lives Impacted Direct",
    badges: ["Audited Remittance", "Grassroots Outreach", "Verified Impact"],
  },
];

export default function HomePage() {
  const [selectedCommittee, setSelectedCommittee] = useState<
    (typeof committeeData)[number] | null
  >(null);
  const [delegationCount, setDelegationCount] = useState(0);
  const [activeCategory, setActiveCategory] = useState("All");
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused || !isPlaying) {
      videoRef.current.muted = false;
      videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  useEffect(() => {
    let ignore = false;
    async function loadRegistrationCount() {
      try {
        const response = await fetch("/api/admin/registrations");
        if (!response.ok) throw new Error("Unable to fetch");
        const payload = await response.json();
        const count = Array.isArray(payload.registrations)
          ? payload.registrations.length
          : 0;
        if (!ignore) setDelegationCount(count);
      } catch {
        if (!ignore) setDelegationCount(0);
      }
    }
    loadRegistrationCount();
    return () => {
      ignore = true;
    };
  }, []);

  const categories = [
    "All",
    "Security Affairs",
    "Indian Governance",
    "Human Rights",
    "Crisis & Sports",
  ];

  const filteredCommittees = committeeData.filter((c) => {
    if (activeCategory === "All") return true;
    const cat = featuredCommittees.find((fc) => fc.name === c.name)?.category;
    if (activeCategory === "Security Affairs") {
      return (
        cat === "Security Affairs" ||
        cat === "Double Delegation" ||
        c.name === "UNSC" ||
        c.name.includes("DISEC")
      );
    }
    if (activeCategory === "Indian Governance") {
      return (
        cat === "Indian Governance" ||
        cat === "Indian Parliament" ||
        cat === "State Governance" ||
        cat === "Parliamentary Committee"
      );
    }
    if (activeCategory === "Human Rights") {
      return (
        cat === "Human Rights" ||
        cat === "International Law" ||
        cat === "Gender & Tech"
      );
    }
    if (activeCategory === "Crisis & Sports") {
      return (
        cat === "Sports Crisis" ||
        cat === "Historical Crisis" ||
        cat === "Press Corps"
      );
    }
    return true;
  });

  return (
    <div className="relative min-h-screen text-cream overflow-hidden">
      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          SECTION 1 — BEHES-INSPIRED HERO (Calibrated Palette & Typography)
         ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section className="relative flex items-center justify-center pt-28 sm:pt-36 pb-20 sm:pb-28 border-b-2 border-white/10 bg-[#0b0714] overflow-hidden min-h-[90vh] neo-grid-bg">
        {/* Subtle Architectural Corner Brackets */}
        <div className="absolute top-0 left-0 w-32 sm:w-44 h-32 sm:h-44 border-l-2 border-t-2 border-white/15 pointer-events-none" />
        <div className="absolute top-0 right-0 w-32 sm:w-44 h-32 sm:h-44 border-r-2 border-t-2 border-white/15 pointer-events-none" />

        {/* Ambient background curves (subtle, low contrast) */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-10">
          <svg className="w-full h-full" viewBox="0 0 1200 600" fill="none">
            <path
              d="M-50 120 Q50 60 150 120 T350 120 Q450 60 550 120"
              stroke="#d4af37"
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
            />
            <path
              d="M700 80 Q800 20 900 80 T1100 80"
              stroke="#ffffff"
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
            />
            <circle cx="300" cy="480" r="3" fill="#d4af37" />
            <circle cx="950" cy="100" r="3" fill="#ffffff" />
          </svg>
        </div>

        <div className="relative max-w-7xl mx-auto px-6 w-full z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 sm:gap-12 items-center">
            
            {/* Left Column Copy */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center lg:text-left space-y-8"
            >
              {/* Intentional Punchy Sticker (Hero Focal Point) */}
              <div className="inline-block transform -rotate-1">
                <div className="px-5 py-2 bg-gold border-2 border-black text-[#0b0714] font-black text-xs sm:text-sm uppercase tracking-wider shadow-[3px_3px_0px_0px_#000000]">
                  Diplomacy For All!
                </div>
              </div>

              {/* Bold Outfit Display Headline */}
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.04] text-cream">
                Project Athena – <br className="hidden sm:inline" />
                <span className="text-gold">
                  Diplomacy For All!
                </span>
              </h1>

              {/* Readable, Comfortable Body Sizing */}
              <p className="text-base sm:text-lg lg:text-xl text-cream/75 max-w-2xl mx-auto lg:mx-0 font-normal leading-relaxed">
                Project Athena shapes the Indian collegiate diplomacy circuit by empowering students to master the art of persuasion, craft sovereign directives, and champion grassroots change. 13 specialized assemblies across the country — all roads leading to Athena Summit 2026!
              </p>

              {/* Grounded Motto */}
              <p className="text-lg sm:text-xl text-cream/90 font-bold italic">
                &ldquo;We debate, therefore we lead.&rdquo;
              </p>

              {/* Tactile Buttons with Clean Black Shadows */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 sm:gap-5 pt-2">
                <a href="/events/athena-summit#register" className="w-full sm:w-auto">
                  <button className="w-full sm:w-auto px-9 py-4 text-sm sm:text-base font-extrabold uppercase tracking-wider bg-gold text-[#0b0714] border-2 border-black shadow-[4px_4px_0px_0px_#000000] hover:shadow-[6px_6px_0px_0px_#000000] hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 transition-all inline-flex items-center justify-center gap-2 cursor-pointer">
                    <span>Register Now</span>
                    <ArrowRight size={18} />
                  </button>
                </a>

                <a href="#events" className="w-full sm:w-auto">
                  <button className="w-full sm:w-auto px-9 py-4 text-sm sm:text-base font-bold uppercase tracking-wider bg-[#140b24] text-cream border-2 border-white/25 shadow-[4px_4px_0px_0px_#000000] hover:shadow-[6px_6px_0px_0px_#000000] hover:border-white hover:text-white hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 transition-all inline-flex items-center justify-center gap-2 cursor-pointer">
                    <span>View Committees</span>
                  </button>
                </a>
              </div>
            </motion.div>

            {/* Right Column: Platform Showcase (Behes aspect-video Inline Player) */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="flex justify-center items-center w-full"
            >
              <div className="w-full aspect-video bg-black border-4 border-black shadow-[6px_6px_0px_0px_#000000] sm:shadow-[8px_8px_0px_0px_#000000] overflow-hidden relative group">
                {/* Native MP4 Video - Plays directly in place */}
                <video
                  ref={videoRef}
                  src="/summit-reel.mp4"
                  autoPlay
                  loop
                  muted={!isPlaying}
                  controls={isPlaying}
                  playsInline
                  onPause={() => setIsPlaying(false)}
                  onPlay={() => setIsPlaying(true)}
                  className="w-full h-full object-cover"
                />

                {/* Overlay - Shown before user clicks play */}
                {!isPlaying && (
                  <div
                    onClick={togglePlay}
                    className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-black/40 flex flex-col justify-between p-4 sm:p-5 cursor-pointer transition-opacity duration-300"
                  >
                    {/* Top Right Channel Badge */}
                    <div className="flex items-center justify-end w-full">
                      <a
                        href="https://www.instagram.com/athena.summit/"
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="bg-white hover:bg-gold text-black border-2 border-black px-2.5 py-1 font-mono font-bold text-[10px] sm:text-xs shadow-[2px_2px_0px_0px_#000000] flex items-center gap-1.5 transition-colors"
                      >
                        <InstagramIcon size={12} />
                        <span>@athena.summit</span>
                      </a>
                    </div>

                    {/* Centered Large Circular Play Button (exact Behes styling) */}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <div
                        className="w-20 h-20 sm:w-24 sm:h-24 bg-white/95 group-hover:bg-gold border-4 border-black rounded-full flex items-center justify-center text-black transition-all shadow-[4px_4px_0px_0px_#000000] group-hover:scale-110 active:scale-95"
                      >
                        <svg className="w-8 h-8 sm:w-10 sm:h-10 ml-1 text-black" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                        </svg>
                      </div>
                    </div>

                    {/* Bottom Left Sticker (exact Behes "Summit Showcase" styling) */}
                    <div className="flex items-center justify-between w-full pointer-events-none">
                      <div className="bg-white border-2 border-black px-3 py-1.5 text-black font-extrabold uppercase text-xs sm:text-sm shadow-[2px_2px_0px_0px_#000000]">
                        Summit Showcase
                      </div>
                      <div className="bg-black/90 border border-white/20 px-2.5 py-1 text-gold font-mono font-bold text-[10px] uppercase shadow-[2px_2px_0px_0px_#000000] flex items-center gap-1">
                        <span>Click to Play</span>
                        <ArrowRight size={12} />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>

          </div>
        </div>

        {/* Crisp Sawtooth Border Bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-3 bg-white/10 pointer-events-none neo-sawtooth" />
      </section>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          SECTION 2 — STATS STRIP (Clean & Grounded Neo-Brutalist)
         ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section className="py-10 border-b-2 border-white/10 bg-[#120a1f] relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5 text-center">
            <div className="p-4 border-2 border-white/10 bg-[#180e29] shadow-[3px_3px_0px_0px_#000000]">
              <p className="font-heading text-4xl sm:text-5xl font-black text-gold">
                {committeeData.length}
              </p>
              <p className="text-xs uppercase tracking-wider font-mono font-bold text-cream/70 mt-1">
                Assemblies
              </p>
            </div>

            <div className="p-4 border-2 border-white/10 bg-[#180e29] shadow-[3px_3px_0px_0px_#000000]">
              <p className="font-heading text-4xl sm:text-5xl font-black text-cream">
                {delegationCount > 0 ? `${delegationCount}+` : "500+"}
              </p>
              <p className="text-xs uppercase tracking-wider font-mono font-bold text-cream/70 mt-1">
                Delegations
              </p>
            </div>

            <div className="p-4 border-2 border-white/10 bg-[#180e29] shadow-[3px_3px_0px_0px_#000000]">
              <p className="font-heading text-4xl sm:text-5xl font-black text-gold">
                100%
              </p>
              <p className="text-xs uppercase tracking-wider font-mono font-bold text-cream/70 mt-1">
                NGO Remittance
              </p>
            </div>

            <div className="p-4 border-2 border-white/10 bg-[#180e29] shadow-[3px_3px_0px_0px_#000000]">
              <p className="font-heading text-4xl sm:text-5xl font-black text-cream">
                Nov 2026
              </p>
              <p className="text-xs uppercase tracking-wider font-mono font-bold text-cream/70 mt-1">
                Summit Date
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          SECTION 3 — EVENTS & COMMITTEES (Behes Tournaments Grid Style)
         ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section id="events" className="py-20 lg:py-24 bg-[#0b0714] relative border-b-2 border-white/10 neo-grid-bg">
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          
          {/* Section Header with Sticker */}
          <div className="text-center mb-12 space-y-3">
            <div className="inline-block transform -rotate-1">
              <div className="px-5 py-2 bg-gold border-2 border-black text-[#0b0714] font-black text-xs uppercase tracking-wider flex items-center gap-2 shadow-[3px_3px_0px_0px_#000000]">
                <Calendar size={14} />
                <span>Events & Assemblies</span>
              </div>
            </div>

            <h2 className="text-3xl sm:text-5xl font-extrabold uppercase tracking-tight text-cream">
              Tournaments & <span className="text-gold">Committees</span>
            </h2>

            <p className="text-sm sm:text-base text-cream/70 max-w-2xl mx-auto font-normal">
              Discover and allocate for specialized parliamentary committees happening across the summit. Filter by category to find your preferred diplomatic forum.
            </p>
          </div>

          {/* Clean Category Filter Bar */}
          <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-3 mb-10">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 text-xs font-bold uppercase tracking-wider transition-all border-2 cursor-pointer ${
                  activeCategory === cat
                    ? "bg-gold text-[#0b0714] border-black shadow-[3px_3px_0px_0px_#000000] -translate-y-0.5"
                    : "bg-[#140b24] text-cream/80 border-white/15 hover:border-white/40 hover:text-white shadow-[2px_2px_0px_0px_#000000]"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Committee Cards Grid (Clean Black Shadows, No Yellow Saturation) */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCommittees.map((c) => {
              const meta = featuredCommittees.find((item) => item.name === c.name);
              return (
                <div
                  key={c.name}
                  onClick={() => setSelectedCommittee(c)}
                  className="bg-[#140b24] border-2 border-white/15 hover:border-gold/60 p-6 shadow-[4px_4px_0px_0px_#000000] hover:shadow-[6px_6px_0px_0px_#000000] hover:-translate-y-1 transition-all cursor-pointer flex flex-col justify-between group"
                >
                  <div className="space-y-4">
                    {/* Top pill badges */}
                    <div className="flex items-start justify-between gap-2">
                      <span className="px-2.5 py-0.5 bg-purple-dark text-gold text-[10px] font-mono font-bold uppercase tracking-wider border border-gold/30">
                        {meta?.category}
                      </span>
                      <span className="px-2 py-0.5 bg-[#0b0714] border border-white/15 text-cream/70 font-mono text-[11px]">
                        {meta?.seats}
                      </span>
                    </div>

                    {/* Committee Title */}
                    <div>
                      <h3 className="text-2xl font-extrabold text-cream group-hover:text-gold transition-colors uppercase tracking-tight">
                        {c.name}
                      </h3>
                      <p className="text-xs text-cream/65 font-sans mt-1 line-clamp-2 leading-relaxed">
                        {c.fullName}
                      </p>
                    </div>

                    {/* Agenda Snippet */}
                    <div className="p-3 bg-[#0b0714] border border-white/10 text-[11px] text-cream/65 leading-relaxed font-sans">
                      <span className="text-gold font-bold block mb-0.5">AGENDA TOPIC:</span>
                      <span className="line-clamp-2">{c.agenda}</span>
                    </div>
                  </div>

                  {/* Action Link */}
                  <div className="mt-5 pt-3 border-t border-white/10 flex items-center justify-between text-xs font-bold uppercase tracking-wider text-gold/80 group-hover:text-gold transition-colors">
                    <span>Inspect Agenda Matrix</span>
                    <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Matrix CTA Button */}
          <div className="mt-12 text-center">
            <Link href="/events/athena-summit#committees">
              <Button size="md" className="shadow-[4px_4px_0px_0px_#000000] text-xs font-extrabold uppercase px-8 py-3.5">
                <span>View Full Seat Matrix & Details</span>
                <ChevronRight size={16} />
              </Button>
            </Link>
          </div>

        </div>
      </section>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          SECTION 4 — STORIES OF IMPACT (Behes Full-Bleed Section)
         ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section className="py-20 lg:py-24 bg-[#120a1f] relative overflow-hidden border-b-2 border-white/10">
        {/* Subtle Backdrop Wash */}
        <div className="absolute inset-0 pointer-events-none opacity-30">
          <Image
            src="/girl-illustration.png"
            alt=""
            fill
            className="object-cover object-[70%_center]"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#120a1f] via-[#120a1f]/90 50% to-[#120a1f]/50" />
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            
            {/* Left Column: Impact Content */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-block transform -rotate-1">
                <div className="px-6 py-2.5 bg-gold border-2 border-black text-[#0b0714] font-black text-xs sm:text-sm uppercase tracking-wider shadow-[3px_3px_0px_0px_#000000]">
                  Stories of Impact
                </div>
              </div>

              <div className="space-y-3">
                <span className="text-xs uppercase font-mono tracking-[0.2em] text-gold font-bold block">
                  {IMPACT_SLIDES[currentSlide].tag}
                </span>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-cream leading-tight">
                  {IMPACT_SLIDES[currentSlide].title}
                </h2>
                <p className="text-base text-cream/75 leading-relaxed font-normal max-w-xl">
                  {IMPACT_SLIDES[currentSlide].desc}
                </p>
              </div>

              {/* Tag Chips with Subtle Neutral Borders */}
              <div className="flex flex-wrap gap-2 pt-1">
                {IMPACT_SLIDES[currentSlide].badges.map((b) => (
                  <div
                    key={b}
                    className="px-3 py-1.5 bg-[#140b24] border border-white/20 text-cream/80 text-xs font-mono font-bold uppercase tracking-wider shadow-[2px_2px_0px_0px_#000000]"
                  >
                    {b}
                  </div>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Link href="/donate">
                  <Button size="md" className="shadow-[3px_3px_0px_0px_#000000] text-xs font-bold uppercase">
                    <span>Societal Mission & Waitlist</span>
                    <ArrowRight size={14} />
                  </Button>
                </Link>
                <span className="text-xs text-cream/60 font-mono font-bold uppercase bg-white/5 px-3 py-2 border border-white/10">
                  100% Direct Remittance
                </span>
              </div>
            </div>

            {/* Right Column: Giant Counter Display */}
            <div className="lg:col-span-5 text-center lg:text-right space-y-3">
              <div className="p-8 border-2 border-white/20 bg-[#0b0714] shadow-[6px_6px_0px_0px_#000000] inline-block w-full">
                <div className="text-7xl sm:text-8xl lg:text-[7.5rem] font-black text-gold font-heading leading-none drop-shadow-lg">
                  {IMPACT_SLIDES[currentSlide].stat}
                </div>
                <div className="text-base sm:text-lg font-bold text-cream uppercase tracking-wider font-sans mt-2">
                  {IMPACT_SLIDES[currentSlide].statLabel}
                </div>
                <div className="text-xs text-cream/50 font-mono mt-1">
                  Verified Local NGO Beneficiary Chapters
                </div>
              </div>
            </div>

          </div>

          {/* Interactive Slide Control Bar (Behes Slide Bar Style) */}
          <div className="mt-12 pt-6 border-t border-white/10">
            <div className="relative h-2.5 bg-[#0b0714] border border-white/20 mb-3">
              <div
                className="absolute top-0 bottom-0 bg-gold transition-all duration-200"
                style={{
                  left: `${(currentSlide / IMPACT_SLIDES.length) * 100}%`,
                  width: `${100 / IMPACT_SLIDES.length}%`,
                }}
              />
              <div className="absolute inset-0 flex">
                {IMPACT_SLIDES.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentSlide(idx)}
                    className="flex-1 h-full cursor-pointer"
                    aria-label={`Go to slide ${idx + 1}`}
                  />
                ))}
              </div>
            </div>

            <div className="flex justify-between items-center text-xs font-mono font-bold text-cream/60 uppercase tracking-wider">
              <span>
                {currentSlide + 1} / {IMPACT_SLIDES.length}
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() =>
                    setCurrentSlide((prev) =>
                      prev === 0 ? IMPACT_SLIDES.length - 1 : prev - 1
                    )
                  }
                  className="px-2.5 py-1 bg-[#140b24] border border-white/20 hover:border-gold hover:text-gold transition-colors"
                >
                  PREV
                </button>
                <button
                  onClick={() =>
                    setCurrentSlide((prev) =>
                      prev === IMPACT_SLIDES.length - 1 ? 0 : prev + 1
                    )
                  }
                  className="px-2.5 py-1 bg-[#140b24] border border-white/20 hover:border-gold hover:text-gold transition-colors"
                >
                  NEXT
                </button>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          SECTION 5 — PILLARS OF EXCELLENCE (Behes 4-Column Feature Blocks)
         ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section className="py-20 lg:py-24 bg-[#0b0714] relative border-b-2 border-white/10 neo-grid-bg">
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          
          <div className="text-center mb-14 space-y-3">
            <div className="inline-block transform -rotate-1">
              <div className="px-5 py-2 bg-gold border-2 border-black text-[#0b0714] font-black text-xs uppercase tracking-wider shadow-[3px_3px_0px_0px_#000000]">
                Pillars of Excellence
              </div>
            </div>

            <h2 className="text-3xl sm:text-5xl font-extrabold uppercase tracking-tight text-cream">
              Engineered for <span className="text-gold">Collegiate Rigour</span>
            </h2>

            <p className="text-sm sm:text-base text-cream/70 max-w-xl mx-auto font-normal">
              Every assembly, background guide, and protocol is crafted to deliver the benchmark diplomatic convening experience.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {pillars.map((item) => (
              <div
                key={item.title}
                className="bg-[#140b24] border-2 border-white/15 hover:border-gold/60 p-6 shadow-[4px_4px_0px_0px_#000000] hover:shadow-[6px_6px_0px_0px_#000000] hover:-translate-y-1 transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <span className="px-2.5 py-1 bg-gold text-[#0b0714] border border-black font-black text-xs shadow-[1px_1px_0px_0px_#000]">
                      {item.number}
                    </span>
                    <div className="h-9 w-9 bg-purple-dark border border-white/20 flex items-center justify-center text-gold group-hover:border-gold transition-all">
                      <item.icon size={18} />
                    </div>
                  </div>

                  <h3 className="text-lg font-extrabold text-cream group-hover:text-gold transition-colors uppercase tracking-tight mb-2">
                    {item.title}
                  </h3>

                  <p className="text-xs text-cream/65 leading-relaxed font-sans font-light">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          SECTION 6 — EDITORIAL MOTTO
         ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section className="py-16 bg-[#120a1f] border-b-2 border-white/10 relative">
        <div className="max-w-4xl mx-auto px-6 text-center space-y-3">
          <Quote size={32} className="mx-auto text-gold/80" />
          <blockquote className="font-heading text-xl sm:text-2xl text-cream font-bold italic leading-relaxed">
            &ldquo;Diplomacy is not merely the resolution of conflict; it is the art of giving shape to human destiny.&rdquo;
          </blockquote>
          <p className="text-xs font-mono font-bold uppercase tracking-[0.2em] text-cream/50">
            Project Athena Secretariat • Collegiate Diplomacy Circuit
          </p>
        </div>
      </section>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          SECTION 7 — GRAND CTA FINALE
         ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section className="py-20 lg:py-24 bg-[#0b0714] relative neo-grid-bg">
        <div className="max-w-4xl mx-auto px-6">
          <div className="bg-[#140b24] border-2 border-white/20 p-8 sm:p-14 text-center shadow-[6px_6px_0px_0px_#000000] relative overflow-hidden">
            <div className="relative z-10 space-y-5 max-w-xl mx-auto">
              <div className="inline-block transform -rotate-1">
                <span className="px-4 py-1.5 bg-gold border border-black text-[#0b0714] font-black text-xs uppercase tracking-wider shadow-[2px_2px_0px_0px_#000]">
                  Official Convening
                </span>
              </div>

              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tight text-cream leading-tight">
                Athena Summit <br />
                <span className="text-gold">November 2026</span>
              </h2>

              <p className="text-cream/70 text-sm font-normal max-w-md mx-auto">
                Registrations and committee allocations open on a first-come, first-served portfolio preference basis.
              </p>

              <div className="pt-2">
                <a href="/events/athena-summit#register">
                  <button className="px-9 py-4 bg-gold text-[#0b0714] border-2 border-black font-extrabold text-sm uppercase tracking-wider shadow-[4px_4px_0px_0px_#000000] hover:shadow-[6px_6px_0px_0px_#000000] hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 transition-all inline-flex items-center gap-2 cursor-pointer">
                    <span>Enter Summit Registry</span>
                    <ArrowRight size={16} />
                  </button>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ━━━ Committee Agenda Details Modal ━━━ */}
      <AnimatePresence>
        {selectedCommittee && (
          <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-2xl bg-[#140b24] border-2 border-white/20 p-6 sm:p-8 shadow-[8px_8px_0px_0px_#000000] max-h-[90vh] overflow-y-auto"
            >
              <button
                onClick={() => setSelectedCommittee(null)}
                className="absolute top-4 right-4 p-2 bg-purple-dark border border-white/20 text-cream hover:text-white transition-all shadow-[2px_2px_0px_0px_#000]"
                aria-label="Close agenda details"
              >
                <X size={18} />
              </button>

              <div className="space-y-4 pr-6">
                <div className="inline-block">
                  <span className="px-2.5 py-0.5 bg-purple-dark text-gold font-bold text-[10px] uppercase tracking-wider border border-gold/30">
                    {featuredCommittees.find(
                      (item) => item.name === selectedCommittee.name
                    )?.category}
                  </span>
                </div>

                <h3 className="text-3xl font-extrabold text-cream uppercase tracking-tight">
                  {selectedCommittee.name}
                </h3>
                <p className="text-xs text-cream/60 font-mono">
                  {selectedCommittee.fullName}
                </p>

                <div className="p-4 bg-[#0b0714] border border-white/10 text-xs sm:text-sm leading-relaxed text-cream/80 font-sans mt-4">
                  <span className="text-gold font-bold block mb-1 font-mono uppercase">
                    Official Committee Agenda:
                  </span>
                  {selectedCommittee.agenda}
                </div>

                <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-white/10">
                  <span className="text-xs text-cream/50 font-mono">
                    Seats:{" "}
                    {selectedCommittee.maxDelegates === Number.MAX_SAFE_INTEGER
                      ? "Unlimited"
                      : `${selectedCommittee.maxDelegates} Delegates`}
                  </span>

                  <Link
                    href={`/events/athena-summit#register`}
                    onClick={() => setSelectedCommittee(null)}
                  >
                    <Button size="sm" className="shadow-[3px_3px_0px_0px_#000000] text-xs font-bold uppercase">
                      Register For This Committee
                    </Button>
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
