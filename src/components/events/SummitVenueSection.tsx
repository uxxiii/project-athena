"use client";

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

export function SummitVenueSection({
  venueName = "Chanakya National Law University (CNLU)",
  subName = "Mithapur, Patna",
  address = "Nyaya Nagar, Mithapur, Patna, Bihar 800001",
  mapEmbedUrl = "https://maps.google.com/maps?q=Chanakya+National+Law+University+Patna&t=&z=15&ie=UTF8&iwloc=&output=embed",
  mapDirectionsUrl = "https://www.google.com/maps/search/?api=1&query=Chanakya+National+Law+University+Patna",
  date = "20–21 November 2026",
}: SummitVenueSectionProps) {
  return (
    <section id="venue" className="py-20 lg:py-24 bg-[#0b0714] border-b-2 border-white/10 relative overflow-hidden neo-grid-bg scroll-mt-20">
      {/* Subtle ambient lighting */}
      <div className="absolute top-1/3 left-0 w-80 h-80 bg-purple-deep/60 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-10 right-0 w-96 h-96 bg-gold/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Section Header with Neo-Brutalist Sticker */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-block transform -rotate-1">
            <div className="px-5 py-2 bg-gold border-2 border-black text-[#0b0714] font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-[3px_3px_0px_0px_#000000]">
              <Compass size={14} />
              <span>Official Summit Venue Confirmed</span>
            </div>
          </div>

          <h2 className="font-heading text-3xl sm:text-5xl font-black text-cream uppercase tracking-tight leading-tight">
            The Convening Grounds: <br className="hidden sm:inline" />
            <span className="text-gold">CNLU College, Patna</span>
          </h2>

          <p className="text-cream/70 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto font-normal">
            Project Athena convenes at <strong className="text-white font-semibold">Chanakya National Law University (CNLU)</strong> — Bihar’s premier national legal institution. Featuring state-of-the-art parliamentary moot courts, expansive auditoriums, and dedicated committee deliberation halls.
          </p>
        </div>

        {/* Venue Information & Interactive Map Grid */}
        <div className="grid lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Left Column: Venue Dossier & Logistics */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
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
                    Institutional Host Campus
                  </span>
                  <h3 className="font-heading text-xl font-extrabold text-cream uppercase">
                    {venueName}
                  </h3>
                  <p className="text-xs text-cream/60 font-mono mt-0.5">
                    {subName}
                  </p>
                </div>
              </div>

              {/* Quick Logistics List */}
              <div className="space-y-4 text-xs sm:text-sm text-cream/75">
                <div className="flex items-start gap-3">
                  <Calendar size={18} className="text-gold shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-gold font-mono font-bold block">
                      Summit Schedule
                    </span>
                    <strong className="text-cream font-bold">{date}</strong>
                    <span className="text-cream/50 text-[11px] block font-mono mt-0.5">Two Full Days of Deliberation</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MapPin size={18} className="text-gold shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-gold font-mono font-bold block">
                      Full Postal Address
                    </span>
                    <span className="text-cream/90 font-medium leading-relaxed">
                      {address}
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
                      <span>~10m from Patna Jnn.</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Plane size={13} className="text-gold/80 shrink-0" />
                      <span>~15m from Airport</span>
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
                href={mapDirectionsUrl}
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
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="lg:col-span-7 bg-[#140b24] border-2 border-gold shadow-[6px_6px_0px_0px_#000000] overflow-hidden flex flex-col relative min-h-[460px] sm:min-h-[520px]"
          >
            {/* Top Bar above Map */}
            <div className="bg-[#120a1f] px-5 py-3 border-b-2 border-white/15 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2.5">
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-cream font-mono font-bold text-xs uppercase">
                  Live Pin: CNLU Campus, Patna
                </span>
              </div>
              <span className="text-gold font-mono text-[11px] font-bold">
                25.5941° N, 85.1276° E
              </span>
            </div>

            {/* Map Frame */}
            <div className="relative flex-1 w-full h-full min-h-[400px]">
              <iframe
                title="Chanakya National Law University Location Map"
                src={mapEmbedUrl}
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
                href={mapDirectionsUrl}
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

