"use client";

import { motion } from "framer-motion";
import { events } from "@/data/events";
import { EventCard } from "@/components/events/EventCard";
import { Calendar } from "lucide-react";

export default function EventsPage() {
  return (
    <div className="pt-32 sm:pt-40 pb-24 neo-grid-bg relative overflow-hidden">
      {/* Corner Architectural Brackets */}
      <div className="absolute top-0 left-0 w-32 sm:w-44 h-32 sm:h-44 border-l-2 border-t-2 border-white/15 pointer-events-none" />
      <div className="absolute top-0 right-0 w-32 sm:w-44 h-32 sm:h-44 border-r-2 border-t-2 border-white/15 pointer-events-none" />

      <div className="mx-auto max-w-7xl px-6 relative z-10">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16 space-y-4 max-w-2xl mx-auto"
        >
          <div className="inline-block transform -rotate-1">
            <div className="px-5 py-2 bg-gold border-2 border-black text-[#0b0714] font-black text-xs uppercase tracking-wider shadow-[3px_3px_0px_0px_#000000] flex items-center gap-2">
              <Calendar size={14} />
              <span>Conferences & Assemblies</span>
            </div>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold uppercase tracking-tight text-cream">
            Our <span className="text-gold">Events</span>
          </h1>

          <p className="text-cream/75 text-sm sm:text-base font-normal leading-relaxed">
            Athena Summit is our marquee flagship conference. Explore the November collegiate diplomacy convening and revisit our archive.
          </p>
        </motion.div>

        {/* Event Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto items-stretch">
          {events.map((event, i) => (
            <EventCard key={event.slug} event={event} index={i} />
          ))}
        </div>

      </div>
    </div>
  );
}
