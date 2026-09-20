"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Calendar, MapPin, ArrowRight } from "lucide-react";
import type { SummitEvent } from "@/lib/types";
import { Badge } from "@/components/ui/Badge";

interface EventCardProps {
  event: SummitEvent;
  index?: number;
}

export function EventCard({ event, index = 0 }: EventCardProps) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group relative overflow-hidden rounded-2xl h-full flex flex-col"
    >
      <Link href={`/events/${event.slug}`} className="block h-full flex-1 flex flex-col">
        {/* Background with logo image */}
        <div className="relative h-full flex-1 flex flex-col justify-between">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-dark/90 to-purple-deep/95 z-10" />
          <div className="absolute inset-0 opacity-10 group-hover:opacity-15 transition-opacity duration-700">
            <Image
              src="/logo.jpeg"
              alt=""
              fill
              className="object-cover"
            />
          </div>

          {/* Border effects */}
          <div className="absolute inset-0 z-20 rounded-2xl ring-1 ring-inset ring-white/8 group-hover:ring-gold/30 transition-all duration-500" />
          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gold/40 to-transparent z-20 opacity-60" />

          <div className="relative z-20 p-7 sm:p-8 flex-1 flex flex-col justify-between space-y-6">
            {/* Top section: Badge, Index, Title, Subtitle, Description */}
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <Badge variant={event.registrationOpen ? "success" : "warning"}>
                  {event.registrationOpen ? "Registration Open" : "Opening Soon"}
                </Badge>
                <span className="font-heading text-4xl sm:text-5xl text-gold/10 group-hover:text-gold/20 transition-colors duration-500">
                  {String(index + 1).padStart(2, "0")}
                </span>
              </div>

              <div>
                <h3 className="font-heading text-2xl sm:text-3xl text-cream group-hover:text-gold transition-colors duration-300">
                  {event.title}
                </h3>
                <p className="mt-1 text-xs sm:text-sm text-gold/70 tracking-wide font-heading">
                  {event.subtitle}
                </p>
              </div>

              <p className="text-cream/55 text-xs sm:text-sm leading-relaxed line-clamp-3">
                {event.description}
              </p>
            </div>

            {/* Bottom section: Meta details & CTA action */}
            <div className="space-y-4 pt-4 border-t border-gold/15 mt-auto">
              <div className="flex flex-wrap gap-3 text-xs text-cream/50">
                <span className="flex items-center gap-1.5">
                  <Calendar size={13} className="text-gold shrink-0" />
                  {event.date}
                </span>
                {event.time && (
                  <span className="flex items-center gap-1.5 font-mono text-gold/90">
                    <span className="text-[11px]">⏰</span>
                    {event.time}
                  </span>
                )}
                <span className="flex items-center gap-1.5">
                  <MapPin size={13} className="text-gold shrink-0" />
                  {event.location}
                </span>
                {event.price !== undefined && (
                  <span className="flex items-center gap-1 font-mono text-gold font-semibold">
                    <span>Fee:</span>
                    <span className="text-cream font-bold">₹{event.price}</span>
                  </span>
                )}
                {event.capacity && (
                  <span className="flex items-center gap-1 font-mono text-cream/70">
                    <span className="text-gold">•</span>
                    <span>Cap: {event.capacity}</span>
                  </span>
                )}
              </div>

              <div className="flex items-center justify-between text-xs sm:text-sm text-gold font-medium group-hover:text-gold-light transition-colors pt-1">
                <span>View Details & Register</span>
                <ArrowRight size={15} className="group-hover:translate-x-1.5 transition-transform duration-300" />
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.article>
  );
}
