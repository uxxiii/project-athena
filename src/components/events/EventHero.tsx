"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Calendar, MapPin, ArrowDown, Lock, BadgeCheck, Flame, ArrowRight } from "lucide-react";
import type { SummitEvent } from "@/lib/types";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { EarlyBirdTimer } from "@/components/registration/EarlyBirdTimer";
import { RegistrationLaunchTimer } from "@/components/registration/RegistrationLaunchTimer";
import { isRegistrationLaunched, PRICING_CONFIG } from "@/lib/pricing";

interface EventHeroProps {
  event: SummitEvent;
}

export function EventHero({ event }: EventHeroProps) {
  const [isLaunched, setIsLaunched] = useState(false);

  useEffect(() => {
    setIsLaunched(isRegistrationLaunched());
  }, []);

  const handleLaunch = () => {
    setIsLaunched(true);
  };

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
              {isLaunched ? (
                <>
                  <Badge variant="success">Registration Open</Badge>
                  <EarlyBirdTimer compact />
                </>
              ) : (
                <>
                  <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/40 bg-amber-500/10 px-4 py-1.5 text-xs text-amber-300 font-mono shadow-lg">
                    <Lock className="w-3.5 h-3.5 text-amber-400" />
                    <span>REGISTRATION LAUNCH: SEP 5 @ 5:00 PM IST</span>
                  </div>
                  <div className="inline-flex items-center gap-1.5 rounded-full border border-gold/20 bg-gold/5 px-3 py-1 text-xs text-gold/80 font-mono">
                    <Flame className="w-3.5 h-3.5 text-gold" />
                    <span>Early Bird Discount Ready</span>
                  </div>
                </>
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
              <span className="flex items-center gap-2">
                <MapPin size={16} className="text-gold" />
                {event.location}
              </span>
              <span className="flex items-center gap-2 text-amber-300 font-mono">
                <span className="text-amber-400 font-bold">Early Bird:</span> Normal:{" "}
                <span className="line-through text-cream/40 text-xs">₹1600</span>{" "}
                <strong className="text-cream">₹1200</strong> | UNSC:{" "}
                <span className="line-through text-cream/40 text-xs">₹3200</span>{" "}
                <strong className="text-cream">₹2600</strong>
              </span>
            </div>

            <div className="flex flex-wrap gap-4 pt-2">
              {isLaunched ? (
                <Button href="#register" size="lg">
                  Register Now
                  <ArrowDown size={16} />
                </Button>
              ) : (
                <Button href="#register" size="lg" className="bg-linear-to-r from-amber-500 to-gold text-purple-dark font-bold hover:brightness-110">
                  <span>Registration Countdown</span>
                  <ArrowDown size={16} />
                </Button>
              )}
              <Button href="#committees" size="lg" variant="outline">
                View Committees
              </Button>
            </div>
          </motion.div>

          {/* Right Hero Banner Widget (Launch Timer & Early Bird Cards) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="lg:col-span-5"
          >
            {!isLaunched ? (
              <div className="rounded-3xl border-2 border-amber-500/40 bg-linear-to-b from-[#1c1033]/90 via-[#130926]/90 to-purple-deep/95 p-6 shadow-2xl backdrop-blur-xl space-y-5 relative overflow-hidden">
                <div className="absolute -top-12 -right-12 w-40 h-40 bg-amber-500/15 rounded-full blur-2xl pointer-events-none" />

                <div className="flex items-center justify-between border-b border-amber-500/20 pb-3">
                  <div className="flex items-center gap-2">
                    <BadgeCheck className="w-4.5 h-4.5 text-amber-400" />
                    <span className="font-heading text-lg text-cream">Official Registration Portal</span>
                  </div>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/20">
                    Sep 5 @ 5 PM
                  </span>
                </div>

                <div className="space-y-1">
                  <p className="text-xs text-cream/70 font-sans">
                    Portal opens on <strong className="text-amber-300 font-mono">September 5, 2026 at 5:00 PM IST</strong>. Lock your delegate preferences early!
                  </p>
                </div>

                {/* Countdown Timer */}
                <RegistrationLaunchTimer onLaunch={handleLaunch} />

                {/* Pricing Teaser */}
                <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-3.5 space-y-2">
                  <span className="text-[11px] uppercase tracking-wider font-mono text-amber-400 block font-semibold">
                    ⚡ Early Bird Discount Offer (Sep 5 – Sep 10)
                  </span>
                  <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                    <div className="bg-purple-deep/60 p-2 rounded border border-amber-500/20">
                      <span className="text-cream/50 text-[10px] block font-sans">Normal Committees</span>
                      <span className="text-cream font-bold text-sm">₹{PRICING_CONFIG.normal.earlyBirdPrice}</span>
                      <span className="text-rose-400/70 text-[10px] line-through ml-1">₹{PRICING_CONFIG.normal.normalPrice}</span>
                    </div>
                    <div className="bg-purple-deep/60 p-2 rounded border border-amber-500/20">
                      <span className="text-cream/50 text-[10px] block font-sans">UNSC Double Del.</span>
                      <span className="text-cream font-bold text-sm">₹{PRICING_CONFIG.unsc.earlyBirdPrice}</span>
                      <span className="text-rose-400/70 text-[10px] line-through ml-1">₹{PRICING_CONFIG.unsc.normalPrice}</span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="rounded-3xl border border-amber-500/30 bg-linear-to-b from-purple-dark/80 to-purple-deep/90 p-6 shadow-2xl backdrop-blur-xl space-y-4">
                <div className="flex items-center justify-between border-b border-amber-500/20 pb-3">
                  <span className="font-heading text-xl text-cream">Registration Active</span>
                  <span className="text-xs text-emerald-400 font-mono flex items-center gap-1 font-bold">
                    ● PORTAL LIVE
                  </span>
                </div>
                <EarlyBirdTimer />
                <Button href="#register" size="lg" className="w-full justify-center">
                  <span>Start Delegate Registration</span>
                  <ArrowRight size={16} />
                </Button>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
