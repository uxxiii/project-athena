"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { TeamSection } from "@/components/events/TeamSection";
import { getLatestUpcomingEvent } from "@/data/events";
import { Compass, ArrowRight, Mail, GraduationCap, Calendar } from "lucide-react";

export default function TeamsPage() {
  const event = getLatestUpcomingEvent();

  return (
    <div className="pt-32 sm:pt-40 pb-24 relative overflow-hidden neo-grid-bg">
      {/* Corner Architectural Brackets */}
      <div className="absolute top-0 left-0 w-32 sm:w-44 h-32 sm:h-44 border-l-2 border-t-2 border-white/15 pointer-events-none" />
      <div className="absolute top-0 right-0 w-32 sm:w-44 h-32 sm:h-44 border-r-2 border-t-2 border-white/15 pointer-events-none" />

      <div className="mx-auto max-w-7xl px-6 relative z-10">
        
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-14 space-y-4 max-w-3xl mx-auto"
        >
          <div className="inline-block transform -rotate-1">
            <div className="px-5 py-2 bg-gold border-2 border-black text-[#0b0714] font-black text-xs uppercase tracking-wider shadow-[3px_3px_0px_0px_#000000]">
              Leadership & Secretariat • 2026
            </div>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold uppercase tracking-tight text-cream">
            The Team Behind <span className="text-gold">Project Athena</span>
          </h1>

          <p className="text-cream/75 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed font-normal pt-1">
            A collective of collegiate organizers, debaters, and advisors dedicated to procedural excellence, substantive debate, and a transformative summit experience.
          </p>

          {/* Metric Indicators with Solid Borders */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-3 text-xs font-mono font-bold">
            <span className="inline-flex items-center gap-1.5 bg-[#140b24] px-4 py-2 border-2 border-white/15 shadow-[3px_3px_0px_0px_#000000] text-cream/90">
              <GraduationCap size={14} className="text-gold" />
              <span>Collegiate Leadership</span>
            </span>
            <span className="inline-flex items-center gap-1.5 bg-[#140b24] px-4 py-2 border-2 border-white/15 shadow-[3px_3px_0px_0px_#000000] text-cream/90">
              <Compass size={14} className="text-gold" />
              <span>13 Committees</span>
            </span>
            <span className="inline-flex items-center gap-1.5 bg-[#140b24] px-4 py-2 border-2 border-white/15 shadow-[3px_3px_0px_0px_#000000] text-cream/90">
              <Calendar size={14} className="text-gold" />
              <span>November 2026</span>
            </span>
          </div>
        </motion.div>

        {/* Team Showcase */}
        {event ? <TeamSection team={event.team} /> : null}

        {/* Closing Callout Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mt-20 max-w-4xl mx-auto bg-[#140b24] border-2 border-white/20 p-8 sm:p-12 text-center shadow-[6px_6px_0px_0px_#000000] relative"
        >
          <div className="max-w-2xl mx-auto space-y-4">
            <div className="inline-block transform -rotate-1">
              <span className="px-4 py-1.5 bg-gold border border-black text-[#0b0714] font-black text-xs uppercase tracking-wider shadow-[2px_2px_0px_0px_#000]">
                Direct Secretariat Communication
              </span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-extrabold uppercase text-cream tracking-tight">
              Connect With the Secretariat
            </h2>

            <p className="text-xs sm:text-sm text-cream/70 leading-relaxed font-sans max-w-lg mx-auto">
              Have questions about delegation registrations, institutional partnerships, or committee study guides? Our Secretariat is always accessible.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
              <a href="mailto:project.athena03@gmail.com">
                <button className="px-7 py-3.5 bg-gold text-[#0b0714] font-extrabold text-xs uppercase tracking-wider border-2 border-black shadow-[4px_4px_0px_0px_#000000] hover:shadow-[6px_6px_0px_0px_#000000] hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 transition-all inline-flex items-center gap-2 cursor-pointer">
                  <Mail size={14} />
                  <span>Write to Secretariat</span>
                </button>
              </a>

              <Link href="/events/athena-summit#committees">
                <button className="px-7 py-3.5 bg-[#0b0714] text-cream font-bold text-xs uppercase tracking-wider border-2 border-white/25 shadow-[4px_4px_0px_0px_#000000] hover:shadow-[6px_6px_0px_0px_#000000] hover:border-white hover:text-white hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 transition-all inline-flex items-center gap-2 cursor-pointer">
                  <span>View All Committees</span>
                  <ArrowRight size={14} />
                </button>
              </Link>
            </div>
          </div>
        </motion.div>

      </div>
    </div>
  );
}
