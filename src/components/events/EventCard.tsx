"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Calendar, Clock, MapPin, ArrowRight } from "lucide-react";
import type { SummitEvent } from "@/lib/types";

interface EventCardProps {
  event: SummitEvent;
  index?: number;
}

export function EventCard({ event, index = 0 }: EventCardProps) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 25 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
      className="group relative bg-[#140b24] border-2 border-white/15 hover:border-gold/60 shadow-[4px_4px_0px_0px_#000000] hover:shadow-[6px_6px_0px_0px_#000000] hover:-translate-y-1 transition-all flex flex-col justify-between"
    >
      <Link href={`/events/${event.slug}`} className="block h-full flex-1 flex flex-col p-7 sm:p-8 justify-between">
        <div className="space-y-5">
          {/* Top Status & Index */}
          <div className="flex items-start justify-between">
            <span
              className={`px-3 py-1 font-mono font-bold text-xs uppercase tracking-wider border shadow-[2px_2px_0px_0px_#000000] ${
                event.registrationOpen
                  ? "bg-emerald-400 text-[#0b0714] border-black"
                  : event.slug === "mun-picnic"
                  ? "bg-rose-500 text-white border-black"
                  : "bg-gold text-[#0b0714] border-black"
              }`}
            >
              {event.registrationOpen
                ? "Registration Open"
                : event.slug === "mun-picnic"
                ? "Registration Closed"
                : "Opening Soon"}
            </span>

            <span className="font-heading text-4xl sm:text-5xl font-black text-white/20 group-hover:text-gold transition-colors">
              {String(index + 1).padStart(2, "0")}
            </span>
          </div>

          {/* Title & Subtitle */}
          <div>
            <h3 className="font-heading text-3xl font-extrabold uppercase tracking-tight text-cream group-hover:text-gold transition-colors">
              {event.title}
            </h3>
            <p className="mt-1 text-xs sm:text-sm text-cream/70 font-mono font-bold tracking-wide uppercase">
              {event.subtitle}
            </p>
          </div>

          <p className="text-cream/75 text-xs sm:text-sm leading-relaxed font-sans line-clamp-3">
            {event.description}
          </p>
        </div>

        {/* Meta details & Action */}
        <div className="space-y-4 pt-6 border-t border-white/10 mt-6">
          <div className="flex flex-wrap gap-2.5 text-xs text-cream/70 font-mono">
            <span className="flex items-center gap-1.5 bg-[#0b0714] px-2.5 py-1 border border-white/15">
              <Calendar size={13} className="text-cream/50 shrink-0" />
              {event.date}
            </span>
            {event.time && (
              <span className="flex items-center gap-1.5 bg-[#0b0714] px-2.5 py-1 border border-white/15">
                <Clock size={13} className="text-cream/50 shrink-0" />
                {event.time}
              </span>
            )}
            <span className="flex items-center gap-1.5 bg-[#0b0714] px-2.5 py-1 border border-white/15">
              <MapPin size={13} className="text-cream/50 shrink-0" />
              {event.location}
            </span>
            {event.price !== undefined && (
              <span className="flex items-center gap-1 bg-[#0b0714] px-2.5 py-1 border border-white/15 text-gold font-bold">
                Fee: ₹{event.price}
              </span>
            )}
          </div>

          <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-gold group-hover:text-cream transition-colors pt-1">
            <span>{event.slug === "mun-picnic" ? "View Archive" : "View Details & Register"}</span>
            <ArrowRight size={15} className="group-hover:translate-x-1.5 transition-transform" />
          </div>
        </div>
      </Link>
    </motion.article>
  );
}
