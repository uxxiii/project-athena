"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { TeamSection } from "@/components/events/TeamSection";
import { getLatestUpcomingEvent } from "@/data/events";
import {
  Compass,
  ArrowRight,
  Mail,
  GraduationCap,
  Calendar,
} from "lucide-react";

export default function TeamsPage() {
  const event = getLatestUpcomingEvent();

  return (
    <div className="pt-32 pb-24 relative overflow-hidden">
      {/* Subtle Warm Ambient Background Aura */}
      <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[850px] h-[450px] bg-gradient-to-b from-purple-light/10 via-gold/5 to-transparent rounded-full blur-3xl pointer-events-none" />

      <div className="mx-auto max-w-7xl px-6 relative z-10">
        {/* Editorial Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-center mb-14 space-y-4 max-w-3xl mx-auto"
        >
          {/* Subtle Editorial Kicker */}
          <div className="inline-flex items-center gap-2 rounded-full border border-gold/25 bg-gold/5 px-4 py-1.5 shadow-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-gold" />
            <span className="text-gold text-[11px] tracking-[0.25em] uppercase font-mono">
              Leadership & Secretariat • 2026
            </span>
          </div>

          <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl text-cream tracking-tight font-normal">
            The People Behind <span className="text-gradient-gold">Project Athena</span>
          </h1>

          <p className="text-cream/70 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed font-sans pt-1">
            A collective of collegiate organizers, debaters, and advisors dedicated to procedural excellence, substantive debate, and creating a transformative diplomatic forum in Patna.
          </p>

          {/* Clean Metric Indicators */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-3 text-xs font-mono text-cream/60">
            <span className="inline-flex items-center gap-1.5 bg-purple-deep/70 px-3.5 py-1.5 rounded-full border border-white/10">
              <GraduationCap size={13} className="text-gold" />
              <span>Collegiate Leadership</span>
            </span>
            <span className="inline-flex items-center gap-1.5 bg-purple-deep/70 px-3.5 py-1.5 rounded-full border border-white/10">
              <Compass size={13} className="text-emerald-400" />
              <span>13 Committees</span>
            </span>
            <span className="inline-flex items-center gap-1.5 bg-purple-deep/70 px-3.5 py-1.5 rounded-full border border-white/10">
              <Calendar size={13} className="text-purple-300" />
              <span>October 2026</span>
            </span>
          </div>
        </motion.div>

        {/* Editorial Team Showcase with Department Tabs */}
        {event ? <TeamSection team={event.team} /> : null}

        {/* Closing Editorial Callout */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-20 max-w-4xl mx-auto rounded-3xl p-8 sm:p-10 border border-gold/20 bg-gradient-to-br from-purple-dark/80 via-purple-deep/90 to-background/90 text-center relative overflow-hidden shadow-2xl backdrop-blur-xl"
        >
          {/* Subtle Ambient Glow */}
          <div className="absolute top-0 right-1/4 w-60 h-60 bg-gold/5 rounded-full blur-3xl pointer-events-none" />

          <div className="max-w-2xl mx-auto space-y-4 relative z-10">
            <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-gold font-semibold block">
              Get In Touch
            </span>
            <h2 className="font-heading text-2xl sm:text-3xl md:text-4xl text-cream font-medium">
              Connect With the Secretariat
            </h2>
            <p className="text-xs sm:text-sm text-cream/70 leading-relaxed">
              Have questions about delegation registrations, institutional partnerships, or conference agendas? Our Secretariat is always accessible to delegates and faculty advisors.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4 pt-3">
              <a
                href="mailto:official@projectathena.site"
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-gradient-to-r from-gold to-amber-400 text-purple-deep font-semibold text-xs font-mono uppercase tracking-wider shadow-md hover:brightness-110 transition-all duration-300"
              >
                <Mail size={14} />
                <span>Write to Secretariat</span>
              </a>

              <Link
                href="/events/athena-summit#committees"
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full border border-gold/30 bg-purple-deep/60 hover:bg-gold/10 text-cream text-xs font-mono uppercase tracking-wider transition-all duration-300"
              >
                <span>View All 13 Committees</span>
                <ArrowRight size={14} className="text-gold" />
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
