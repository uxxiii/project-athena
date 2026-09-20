"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Calendar, MapPin, ArrowDown, Lock, BadgeCheck } from "lucide-react";
import type { SummitEvent } from "@/lib/types";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { isRegistrationLaunched, PRICING_CONFIG } from "@/lib/pricing";

interface EventHeroProps {
  event: SummitEvent;
}

export function EventHero({ event }: EventHeroProps) {
  const [isLaunched, setIsLaunched] = useState(false);

  useEffect(() => {
    setIsLaunched(isRegistrationLaunched());
  }, []);

  return (
    <section className="relative overflow-hidden min-h-[90vh] flex items-center pt-28 pb-16">
      {/* Background image with overlay */}
      <div className="absolute inset-0">
        <Image
          src="/full-logo.jpeg"
          alt=""
          fill
          className="object-cover object-center opacity-20"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/85 to-background/40" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/60 to-transparent" />
      </div>

      {/* Purple glow effects */}
      <div className="absolute top-20 right-0 w-[500px] h-[500px] bg-purple-mid/15 rounded-full blur-[120px]" />
      <div className="absolute bottom-0 left-1/4 w-64 h-64 bg-gold/5 rounded-full blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-6 w-full">
        <div className="grid lg:grid-cols-12 gap-10 items-center">
          {/* Main Hero Info */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="lg:col-span-7 space-y-6 text-left"
          >
            {/* Top Announcement Bar */}
            <div className="flex flex-wrap items-center gap-3">
              {event.registrationOpen ? (
                <Badge variant="success">Registration Open</Badge>
              ) : isLaunched ? (
                <Badge variant="success">Registration Open</Badge>
              ) : (
                <div className="inline-flex items-center gap-2 rounded-full border border-gold/30 bg-purple-dark/80 px-4 py-1.5 text-xs text-gold-light font-mono shadow-md">
                  <Lock className="w-3.5 h-3.5 text-gold" />
                  <span>REGISTRATION OPENING SOON</span>
                </div>
              )}
              {event.capacity && (
                <div className="inline-flex items-center gap-1.5 rounded-full border border-gold/20 bg-gold/5 px-3 py-1 text-xs text-gold font-mono">
                  <span>Cap: {event.capacity} Seats</span>
                </div>
              )}
            </div>

            <h1 className="font-heading text-5xl sm:text-6xl md:text-7xl lg:text-8xl text-cream leading-[1.05]">
              {event.title.split(" ").map((word, i) => (
                <span key={i}>
                  {i > 0 && " "}
                  {i === event.title.split(" ").length - 1 ? (
                    <span className="text-gradient-gold">{word}</span>
                  ) : (
                    word
                  )}
                </span>
              ))}
            </h1>

            <p className="text-xl text-gold/70 font-heading tracking-wide">
              {event.subtitle}
            </p>

            <div className="flex flex-wrap gap-6 text-cream/60 text-sm font-sans">
              <span className="flex items-center gap-2">
                <Calendar size={16} className="text-gold" />
                {event.date}
              </span>
              {event.time && (
                <span className="flex items-center gap-2 font-mono text-gold/80">
                  <BadgeCheck size={16} className="text-gold" />
                  {event.time}
                </span>
              )}
              <span className="flex items-center gap-2">
                <MapPin size={16} className="text-gold" />
                {event.location}
              </span>
              {event.price !== undefined ? (
                <span className="flex items-center gap-2 text-gold font-mono font-bold">
                  <span>Fee:</span>
                  <span className="text-cream">₹{event.price} / person</span>
                </span>
              ) : (
                <span className="flex items-center gap-2 text-gold/80 font-mono">
                  <span className="text-gold font-medium">Rates:</span> Normal:{" "}
                  <strong className="text-cream font-semibold">₹{PRICING_CONFIG.normal.normalPrice}</strong> | UNSC:{" "}
                  <strong className="text-cream font-semibold">₹{PRICING_CONFIG.unsc.normalPrice}</strong>
                </span>
              )}
            </div>

            <div className="flex flex-wrap gap-4 pt-2">
              <Button
                href="#register"
                size="lg"
                className="bg-gold text-purple-deep font-semibold hover:bg-gold-light"
              >
                <span>{event.registrationOpen ? "Register Now" : "Registration Opening Soon"}</span>
                <ArrowDown size={16} />
              </Button>
              {event.slug === "mun-picnic" ? (
                <Button href="#venue" size="lg" variant="outline">
                  View Venue & Map
                </Button>
              ) : (
                <Button href="#committees" size="lg" variant="outline">
                  View Committees
                </Button>
              )}
            </div>
          </motion.div>

          {/* Right Hero Banner Widget */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="lg:col-span-5"
          >
            <div className="rounded-3xl glass-card p-6 shadow-2xl space-y-5 relative overflow-hidden">
              <div className="absolute -top-12 -right-12 w-40 h-40 bg-gold/10 rounded-full blur-2xl pointer-events-none" />

              <div className="flex items-center justify-between border-b border-gold/15 pb-3">
                <div className="flex items-center gap-2">
                  <BadgeCheck className="w-4.5 h-4.5 text-gold" />
                  <span className="font-heading text-lg text-cream">
                    {event.slug === "mun-picnic" ? "Official Picnic Pass" : "Official Registration Portal"}
                  </span>
                </div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-gold/70 bg-gold/5 px-2 py-0.5 rounded border border-gold/15">
                  {event.registrationOpen ? "Open Now" : "Opening Soon"}
                </span>
              </div>

              <div className="space-y-1">
                <p className="text-xs text-cream/70 font-sans">
                  {event.slug === "mun-picnic"
                    ? "Registrations are live for the Athena MUN Picnic at Buddha Smriti Park! Limited to 100 seats."
                    : "Delegate registrations are opening soon! Portfolios will be allocated on a first-come basis upon launch."}
                </p>
              </div>

              {/* Pricing Information */}
              <div className="rounded-xl border border-gold/15 bg-purple-deep/60 p-3.5 space-y-2">
                <span className="text-[11px] uppercase tracking-wider font-mono text-gold/80 block font-semibold">
                  {event.slug === "mun-picnic" ? "Delegate Registration Fee" : "Standard Registration Rates"}
                </span>
                {event.slug === "mun-picnic" ? (
                  <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                    <div className="bg-purple-dark/60 p-2.5 rounded border border-gold/15 text-center">
                      <span className="text-cream/50 text-[10px] block font-sans">Entry & Workshop</span>
                      <span className="text-gold font-bold text-base">₹100</span>
                    </div>
                    <div className="bg-purple-dark/60 p-2.5 rounded border border-gold/15 text-center">
                      <span className="text-cream/50 text-[10px] block font-sans">Capacity Cap</span>
                      <span className="text-cream font-bold text-base">100 Seats</span>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                    <div className="bg-purple-dark/60 p-2 rounded border border-gold/15">
                      <span className="text-cream/50 text-[10px] block font-sans">Normal Committees</span>
                      <span className="text-cream font-bold text-sm">₹{PRICING_CONFIG.normal.normalPrice}</span>
                    </div>
                    <div className="bg-purple-dark/60 p-2 rounded border border-gold/15">
                      <span className="text-cream/50 text-[10px] block font-sans">UNSC Double Del.</span>
                      <span className="text-cream font-bold text-sm">₹{PRICING_CONFIG.unsc.normalPrice}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
