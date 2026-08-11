"use client";

import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { events } from "@/data/events";
import { EventCard } from "@/components/events/EventCard";

export default function EventsPage() {
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
              Upcoming & Past
            </span>
          </div>

          <h1 className="font-heading text-5xl md:text-6xl text-cream">
            Our <span className="text-gradient-gold">Events</span>
          </h1>
          <div className="h-px w-24 bg-gradient-to-r from-transparent via-gold to-transparent mx-auto" />
          <p className="text-cream/45 max-w-xl mx-auto">
            Discover upcoming summits and register to be part of the diplomatic
            experience.
          </p>
        </motion.div>

        <div className="grid gap-8 max-w-3xl mx-auto">
          {events.map((event, i) => (
            <EventCard key={event.slug} event={event} index={i} />
          ))}
        </div>
      </div>
    </div>
  );
}
