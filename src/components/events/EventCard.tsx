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
      className="group relative overflow-hidden rounded-xl"
    >
      <Link href={`/events/${event.slug}`} className="block">
        {/* Background with logo image */}
        <div className="relative">
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
          <div className="absolute inset-0 z-20 rounded-xl ring-1 ring-inset ring-white/8 group-hover:ring-gold/20 transition-all duration-500" />
          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gold/40 to-transparent z-20 opacity-60" />

          <div className="relative z-20 p-8 md:p-10 space-y-6">
            <div className="flex items-start justify-between">
              <Badge variant={event.registrationOpen ? "success" : "warning"}>
                {event.registrationOpen ? "Registration Open" : "Opening Sep 5 @ 5 PM"}
              </Badge>
              <span className="font-heading text-5xl text-gold/8 group-hover:text-gold/15 transition-colors duration-500">
                {String(index + 1).padStart(2, "0")}
              </span>
            </div>

            <div>
              <h3 className="font-heading text-3xl md:text-4xl text-cream group-hover:text-gold transition-colors duration-300">
                {event.title}
              </h3>
              <p className="mt-1.5 text-sm text-gold/60 tracking-wide font-heading">
                {event.subtitle}
              </p>
            </div>

            <p className="text-cream/50 text-sm leading-relaxed line-clamp-3 max-w-xl">
              {event.description}
            </p>

            <div className="flex flex-wrap gap-6 text-sm text-cream/45">
              <span className="flex items-center gap-2">
                <Calendar size={14} className="text-gold" />
                {event.date}
              </span>
              <span className="flex items-center gap-2">
                <MapPin size={14} className="text-gold" />
                {event.location}
              </span>
            </div>

            <div className="flex items-center gap-2 text-sm text-gold group-hover:text-gold-light transition-colors">
              <span>View Details & Register</span>
              <ArrowRight size={14} className="group-hover:translate-x-1.5 transition-transform duration-300" />
            </div>
          </div>
        </div>
      </Link>
    </motion.article>
  );
}
