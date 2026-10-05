"use client";

import { motion } from "framer-motion";
import { TeamSection } from "@/components/events/TeamSection";
import { getLatestUpcomingEvent } from "@/data/events";
import { Crown, Shield, Award, Users } from "lucide-react";

export default function TeamsPage() {
  const event = getLatestUpcomingEvent();

  return (
    <div className="pt-32 pb-24 relative overflow-hidden">
      {/* Ambient background glow rings */}
      <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-gradient-to-b from-purple-glow/10 via-gold/5 to-transparent rounded-full blur-3xl pointer-events-none" />

      <div className="mx-auto max-w-7xl px-6 relative z-10">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 space-y-5 max-w-3xl mx-auto"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-gold/30 bg-gold/10 px-4 py-1.5 shadow-sm">
            <Crown size={14} className="text-gold" />
            <span className="text-gold text-xs tracking-[0.25em] uppercase font-mono">
              The High Table Secretariat
            </span>
          </div>

          <h1 className="font-heading text-5xl sm:text-6xl md:text-7xl text-cream tracking-tight">
            High Table <span className="text-gradient-gold">Leadership</span>
          </h1>

          <div className="h-px w-28 bg-gradient-to-r from-transparent via-gold to-transparent mx-auto" />

          <p className="text-cream/65 max-w-xl mx-auto text-sm sm:text-base leading-relaxed">
            The founding visionaries, executive secretariat, and advisory council orchestrating Project Athena&apos;s diplomatic conferences and academic excellence.
          </p>

          {/* Quick Pillars Ribbon */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-3 text-xs font-mono text-gold/80">
            <span className="inline-flex items-center gap-1.5 bg-purple-deep/80 px-3 py-1 rounded-full border border-gold/20">
              <Crown size={12} className="text-gold" />
              <span>Apex Founder</span>
            </span>
            <span className="inline-flex items-center gap-1.5 bg-purple-deep/80 px-3 py-1 rounded-full border border-gold/20">
              <Shield size={12} className="text-purple-300" />
              <span>Executive Secretariat</span>
            </span>
            <span className="inline-flex items-center gap-1.5 bg-purple-deep/80 px-3 py-1 rounded-full border border-gold/20">
              <Award size={12} className="text-emerald-400" />
              <span>Advisory Council</span>
            </span>
          </div>
        </motion.div>

        {/* Team Section Hierarchy & Grid */}
        {event ? <TeamSection team={event.team} /> : null}
      </div>
    </div>
  );
}
