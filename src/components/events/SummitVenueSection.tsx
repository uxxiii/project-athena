"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  MapPin,
  Navigation,
  Clock,
  Calendar,
  Compass,
  Building2,
  Train,
  Plane,
  ShieldCheck,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/Button";

interface SummitVenueSectionProps {
  venueName?: string;
  subName?: string;
  address?: string;
  mapEmbedUrl?: string;
  mapDirectionsUrl?: string;
  date?: string;
}

const SUMMIT_VENUES = [
  {
    day: "Day 1 • 20 November 2026",
    shortLabel: "Day 1: Bishop Scott Girls' School",
    venueName: "Bishop Scott Senior Secondary Girls' School",
    subName: "Chanakya Vihar Colony, Jaganpura, Nayachak, Patna",
    address:
      "Chanakya Vihar Colony, SRJ Rajeev Chauhan Rd, near Road Number 3, Aadarsh Colony, Jaganpura, Nayachak, Patna, Bihar 800027",
    coordinates: "25.5788° N, 85.1589° E",
    pinLabel: "Live Pin: Bishop Scott Sr. Sec. Girls' School, Patna (Day 1)",
    mapEmbedUrl:
      "https://maps.google.com/maps?q=Bishop+Scott+Senior+Secondary+Girls+School+Chanakya+Vihar+Colony+Jaganpura+Patna+800027&t=&z=15&ie=UTF8&iwloc=&output=embed",
    mapDirectionsUrl:
      "https://www.google.com/maps/search/?api=1&query=Bishop+Scott+Senior+Secondary+Girls+School+Chanakya+Vihar+Colony+Jaganpura+Patna+800027",
    commuteRail: "~15m from Patna Jnn.",
    commuteAir: "~20m from Airport",
  },
  {
    day: "Day 2 • 21 November 2026",
    shortLabel: "Day 2: CNLU, Patna",
    venueName: "Chanakya National Law University (CNLU)",
    subName: "Nyaya Nagar, Mithapur, Patna",
    address: "Nyaya Nagar, Mithapur, Patna, Bihar 800001",
    coordinates: "25.5941° N, 85.1276° E",
    pinLabel: "Live Pin: CNLU Campus, Patna (Day 2)",
    mapEmbedUrl:
      "https://maps.google.com/maps?q=Chanakya+National+Law+University+Patna&t=&z=15&ie=UTF8&iwloc=&output=embed",
    mapDirectionsUrl:
      "https://www.google.com/maps/search/?api=1&query=Chanakya+National+Law+University+Patna",
    commuteRail: "~10m from Patna Jnn.",
    commuteAir: "~15m from Airport",
  },
] as const;

export function SummitVenueSection({
  date = "20–21 November 2026",
}: SummitVenueSectionProps) {
  const [selectedDayIdx, setSelectedDayIdx] = useState<0 | 1>(0);
  const activeVenue = SUMMIT_VENUES[selectedDayIdx];

  return (
    <section id="venue" className="py-20 lg:py-24 bg-[#0b0714] border-b-2 border-white/10 relative overflow-hidden neo-grid-bg scroll-mt-20">
      {/* Subtle ambient lighting */}
      <div className="absolute top-1/3 left-0 w-80 h-80 bg-purple-deep/60 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-10 right-0 w-96 h-96 bg-gold/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Section Header with Neo-Brutalist Sticker */}
        <div className="text-center max-w-4xl mx-auto mb-12 space-y-4">
          <div className="inline-block transform -rotate-1">
            <div className="px-5 py-2 bg-gold border-2 border-black text-[#0b0714] font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-[3px_3px_0px_0px_#000000]">
              <Compass size={14} />
              <span>Official Summit Venues Confirmed</span>
            </div>
          </div>

          <h2 className="font-heading text-3xl sm:text-5xl font-black text-cream uppercase tracking-tight leading-tight">
            The Convening Grounds: <br className="hidden sm:inline" />
            <span className="text-gold">Day 1: Bishop Scott Senior Secondary Girls&apos; School</span>
            <span className="block text-xl sm:text-3xl text-cream/85 mt-2">
              Day 2: Chanakya National Law University (CNLU), Patna
            </span>
          </h2>

          <p className="text-cream/70 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto font-normal">
            Athena Summit 2026 convenes on <strong className="text-gold font-semibold">Day 1 (20 Nov)</strong> at <strong className="text-white font-semibold">Bishop Scott Senior Secondary Girls&apos; School, Patna</strong> and culminates on <strong className="text-gold font-semibold">Day 2 (21 Nov)</strong> at <strong className="text-white font-semibold">Chanakya National Law University (CNLU), Patna</strong>.
          </p>

          {/* Interactive Day 1 / Day 2 Venue Switcher */}
          <div className="pt-3 flex flex-wrap items-center justify-center gap-3">
            {SUMMIT_VENUES.map((v, idx) => {
              const isSelected = selectedDayIdx === idx;
              return (
                <button
                  key={v.day}
                  type="button"
                  onClick={() => setSelectedDayIdx(idx as 0 | 1)}
                  className={`px-5 py-2.5 text-xs sm:text-sm font-mono font-bold uppercase tracking-wider border-2 transition-all cursor-pointer ${
                    isSelected
                      ? "bg-gold text-[#0b0714] border-black shadow-[4px_4px_0px_0px_#000000] -translate-y-0.5"
                      : "bg-[#140b24] text-cream/80 border-white/20 hover:border-gold/50 hover:text-gold shadow-[2px_2px_0px_0px_#000000]"
                  }`}
                >
                  {v.shortLabel}
                </button>
              );
            })}
          </div>
        </div>

        {/* Two-Day Venue Schedule Banner Cards */}
        <div className="grid md:grid-cols-2 gap-5 mb-10">
          {SUMMIT_VENUES.map((v, idx) => {
            const isSelected = selectedDayIdx === idx;
            return (
              <div
                key={v.day}
                onClick={() => setSelectedDayIdx(idx as 0 | 1)}
                className={`p-5 border-2 transition-all cursor-pointer ${
                  isSelected
                    ? "bg-[#190f30] border-gold shadow-[5px_5px_0px_0px_#000000]"
                    : "bg-[#140b24] border-white/15 hover:border-gold/40 shadow-[3px_3px_0px_0px_#000000]"
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="px-2.5 py-0.5 bg-gold text-[#0b0714] font-mono font-black text-[10px] uppercase tracking-wider border border-black">
                    {v.day}
                  </span>
                  <span className="text-[11px] font-mono text-gold/80">
                    {isSelected ? "● Viewing on Map" : "Click to View Map →"}
                  </span>
                </div>
                <h3 className="font-heading text-lg sm:text-xl font-extrabold text-cream uppercase">
                  {v.venueName}
                </h3>
                <p className="text-xs text-cream/65 font-mono mt-1">
                  {v.address}
                </p>
              </div>
            );
          })}
        </div>

        {/* Venue Information & Interactive Map Grid */}
        <div className="grid lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Left Column: Venue Dossier & Logistics */}
          <motion.div
            key={activeVenue.venueName}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
            className="lg:col-span-5 flex flex-col justify-between bg-[#140b24] border-2 border-white/15 p-6 sm:p-8 shadow-[6px_6px_0px_0px_#000000] relative space-y-6"
          >
            <div className="space-y-6">
              {/* Institution Identity Card */}
              <div className="flex items-start gap-3.5 border-b border-white/10 pb-5">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center bg-[#1f1238] border-2 border-gold/40 text-gold shadow-[2px_2px_0px_0px_#000]">
                  <Building2 size={24} />
                </div>
                <div>
                  <span className="text-[10px] font-mono text-gold font-bold uppercase tracking-widest block">
                    {activeVenue.day} • Official Host Campus
                  </span>
                  <h3 className="font-heading text-xl font-extrabold text-cream uppercase">
                    {activeVenue.venueName}
                  </h3>
                  <p className="text-xs text-cream/60 font-mono mt-0.5">
                    {activeVenue.subName}
                  </p>
                </div>
              </div>

              {/* Quick Logistics List */}
              <div className="space-y-4 text-xs sm:text-sm text-cream/75">
                <div className="flex items-start gap-3">
                  <Calendar size={18} className="text-gold shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-gold font-mono font-bold block">
                      Summit Schedule ({date})
                    </span>
                    <strong className="text-cream font-bold block">
                      Day 1 (20 Nov): Bishop Scott Senior Secondary Girls&apos; School
                    </strong>
                    <strong className="text-cream/90 font-semibold block mt-0.5">
                      Day 2 (21 Nov): Chanakya National Law University (CNLU)
                    </strong>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MapPin size={18} className="text-gold shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-gold font-mono font-bold block">
                      Full Postal Address ({selectedDayIdx === 0 ? "Day 1" : "Day 2"})
                    </span>
                    <span className="text-cream/90 font-medium leading-relaxed">
                      {activeVenue.address}
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock size={18} className="text-gold shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-gold font-mono font-bold block">
                      Delegate Reporting Time
                    </span>
                    <span className="text-cream/90 font-medium">
                      8:30 AM IST (Registration Dossier Verification)
                    </span>
                  </div>
                </div>

                {/* Transit & Commute Connectivity */}
                <div className="p-3.5 bg-[#0b0714] border border-white/10 space-y-2 text-xs">
                  <span className="text-[10px] uppercase tracking-wider text-gold font-mono font-bold block flex items-center gap-1.5">
                    <Navigation size={13} className="text-gold" />
                    <span>Commute & Connectivity</span>
                  </span>
                  <div className="grid grid-cols-2 gap-2 text-[11px] font-mono text-cream/80">
                    <div className="flex items-center gap-1.5">
                      <Train size={13} className="text-gold/80 shrink-0" />
                      <span>{activeVenue.commuteRail}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Plane size={13} className="text-gold/80 shrink-0" />
                      <span>{activeVenue.commuteAir}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Campus Infrastructure Highlights */}
              <div className="border border-white/10 bg-[#190f30] p-4 space-y-2">
                <span className="text-[10px] uppercase tracking-wider font-mono text-gold font-bold block">
                  Campus Facilities For Delegates
                </span>
                <ul className="text-xs text-cream/80 space-y-1.5">
                  <li className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 bg-gold rounded-full shrink-0" />
                    <span>6 Independent Parliamentary Committee Chambers</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 bg-gold rounded-full shrink-0" />
                    <span>Air-conditioned Plenary Auditorium for Keynotes</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 bg-gold rounded-full shrink-0" />
                    <span>Startup Pitch Arena & Open Networking Lawns</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 bg-gold rounded-full shrink-0" />
                    <span>Delegate Dining & Refreshment Zone</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-2 flex flex-col sm:flex-row gap-3">
              <a
                href={activeVenue.mapDirectionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto"
              >
                <Button
                  size="md"
                  className="w-full sm:w-auto text-xs font-black uppercase tracking-wider gap-2 shadow-[3px_3px_0px_0px_#000000]"
                >
                  <Navigation size={15} />
                  <span>Navigate in Google Maps</span>
                </Button>
              </a>

              <a href="#committees" className="w-full sm:w-auto">
                <Button
                  size="md"
                  variant="outline"
                  className="w-full sm:w-auto text-xs font-bold uppercase tracking-wider border-2 border-white/20 bg-white/5 hover:bg-white/10 text-cream shadow-[2px_2px_0px_0px_#000000]"
                >
                  <span>View Committees</span>
                </Button>
              </a>
            </div>
          </motion.div>

          {/* Right Column: Interactive Google Map Embed Frame */}
          <motion.div
            key={activeVenue.mapEmbedUrl}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
            className="lg:col-span-7 bg-[#140b24] border-2 border-gold shadow-[6px_6px_0px_0px_#000000] overflow-hidden flex flex-col relative min-h-[460px] sm:min-h-[520px]"
          >
            {/* Top Bar above Map */}
            <div className="bg-[#120a1f] px-5 py-3 border-b-2 border-white/15 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2.5">
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-cream font-mono font-bold text-xs uppercase">
                  {activeVenue.pinLabel}
                </span>
              </div>
              <span className="text-gold font-mono text-[11px] font-bold">
                {activeVenue.coordinates}
              </span>
            </div>

            {/* Map Frame */}
            <div className="relative flex-1 w-full h-full min-h-[400px]">
              <iframe
                title={`${activeVenue.venueName} Location Map`}
                src={activeVenue.mapEmbedUrl}
                width="100%"
                height="100%"
                style={{ border: 0, minHeight: "400px" }}
                allowFullScreen={false}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="w-full h-full filter contrast-105 opacity-90 hover:opacity-100 transition-opacity"
              />
            </div>

            {/* Bottom info banner on Map */}
            <div className="bg-[#120a1f] px-5 py-3 border-t-2 border-white/15 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-cream/70">
              <div className="flex items-center gap-2">
                <ShieldCheck size={15} className="text-gold shrink-0" />
                <span className="font-mono text-[11px] text-cream/90">
                  Entry gate access with official Athena Summit Registration Dossier
                </span>
              </div>
              <a
                href={activeVenue.mapDirectionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gold hover:underline font-mono font-bold text-xs inline-flex items-center gap-1 self-start sm:self-auto"
              >
                <span>Full Map Directions</span>
                <ExternalLink size={12} />
              </a>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
