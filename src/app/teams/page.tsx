"use client";

import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { TeamSection } from "@/components/events/TeamSection";
import { getLatestUpcomingEvent } from "@/data/events";

export default function TeamsPage() {
  const event = getLatestUpcomingEvent();

  return (
    <div className="pt-32 pb-20">
      <div className="mx-auto max-w-7xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16 space-y-6"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-gold/20 bg-gold/5 px-4 py-1.5">
            <Sparkles size={14} className="text-gold" />
            <span className="text-gold/80 text-xs tracking-[0.2em] uppercase">
              Meet the Team
            </span>
          </div>

          <h1 className="font-heading text-5xl md:text-6xl text-cream">
            High Table <span className="text-gradient-gold">Leadership</span>
          </h1>
          <div className="h-px w-24 bg-gradient-to-r from-transparent via-gold to-transparent mx-auto" />
          <p className="text-cream/45 max-w-xl mx-auto">
            Explore the executive team behind Athena Summit, with professional portraits and role biographies.
          </p>
        </motion.div>

        {event ? <TeamSection team={event.team} /> : null}
      </div>
    </div>
  );
}
