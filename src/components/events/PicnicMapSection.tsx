"use client";

import { motion } from "framer-motion";
import { MapPin, Navigation, Clock, Calendar, Compass, ShieldCheck, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface PicnicMapSectionProps {
  venueName?: string;
  address?: string;
  mapEmbedUrl?: string;
  mapDirectionsUrl?: string;
  date?: string;
  time?: string;
}

export function PicnicMapSection({
  venueName = "Buddha Smriti Park",
  address = "Frazer Road, Near Patna Junction, Patna, Bihar 800001",
  mapEmbedUrl = "https://maps.google.com/maps?q=Buddha+Smriti+Park+Patna&t=&z=15&ie=UTF8&iwloc=&output=embed",
  mapDirectionsUrl = "https://www.google.com/maps/search/?api=1&query=Buddha+Smriti+Park+Patna",
  date = "Sunday, 4th October",
  time = "12:00 PM – 5:00 PM",
}: PicnicMapSectionProps) {
  return (
    <section id="venue" className="py-20 relative scroll-mt-20">
      <div className="section-divider mb-16" />

      <div className="mx-auto max-w-7xl px-6">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-gold/30 bg-gold/10 px-4 py-1 text-gold text-xs font-mono uppercase tracking-widest">
            <Compass size={14} className="text-gold" />
            <span>Venue & Navigation</span>
          </div>

          <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl text-cream">
            The Gathering Spot: <span className="text-gradient-gold">{venueName}</span>
          </h2>

          <p className="text-cream/60 text-sm sm:text-base leading-relaxed">
            Nestled in the heart of Patna right next to Patna Junction, Buddha Smriti Park offers lush open lawns, tranquil stupa ambiance, and the perfect backdrop for outdoor diplomatic debate, unmoderated caucuses, and a shared community potluck.
          </p>
        </div>

        {/* Map Grid */}
        <div className="grid lg:grid-cols-12 gap-8 items-stretch">
          {/* Venue Details & Itinerary Card */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-5 flex flex-col justify-between rounded-2xl glass-card border border-gold/20 p-6 sm:p-8 space-y-6"
          >
            <div className="space-y-6">
              <div className="flex items-center gap-3 border-b border-gold/15 pb-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gold/15 ring-1 ring-gold/30">
                  <MapPin size={24} className="text-gold" />
                </div>
                <div>
                  <h3 className="font-heading text-xl text-cream">{venueName}</h3>
                  <p className="text-xs text-gold/80 font-mono">Patna, Bihar</p>
                </div>
              </div>

              {/* Quick Logistics */}
              <div className="space-y-4 text-sm text-cream/70">
                <div className="flex items-start gap-3">
                  <Calendar size={18} className="text-gold shrink-0 mt-0.5" />
                  <div>
                    <span className="text-xs uppercase tracking-wider text-gold/60 font-mono block">Date</span>
                    <strong className="text-cream font-semibold">{date}</strong>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock size={18} className="text-gold shrink-0 mt-0.5" />
                  <div>
                    <span className="text-xs uppercase tracking-wider text-gold/60 font-mono block">Timings</span>
                    <strong className="text-cream font-semibold">{time}</strong>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Navigation size={18} className="text-gold shrink-0 mt-0.5" />
                  <div>
                    <span className="text-xs uppercase tracking-wider text-gold/60 font-mono block">Exact Location</span>
                    <span className="text-cream/80">{address}</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Sparkles size={18} className="text-gold shrink-0 mt-0.5" />
                  <div>
                    <span className="text-xs uppercase tracking-wider text-gold/60 font-mono block">Key Landmark</span>
                    <span className="text-cream/80">Opposite Patna Junction Railway Station (Walking distance)</span>
                  </div>
                </div>
              </div>

              {/* What to Expect Tag Grid */}
              <div className="rounded-xl border border-gold/15 bg-purple-dark/60 p-4 space-y-2.5">
                <span className="text-[11px] uppercase tracking-wider font-mono text-gold font-semibold block">
                  Picnic Day Highlights
                </span>
                <ul className="text-xs text-cream/75 space-y-1.5 list-disc list-inside">
                  <li>Hands-on MUN training workshop & resolution drafting</li>
                  <li>Community delegate potluck & networking lunch</li>
                  <li>Diplomacy simulation & crisis trivia games</li>
                  <li>Official delegate pass & participation recognition</li>
                </ul>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-2 flex flex-col sm:flex-row gap-3">
              <Button
                href={mapDirectionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                size="md"
                className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl"
              >
                <Navigation size={16} />
                <span>Open in Google Maps</span>
              </Button>

              <Button
                href="#register"
                size="md"
                variant="outline"
                className="w-full sm:w-auto rounded-xl"
              >
                <span>Register (₹100)</span>
              </Button>
            </div>
          </motion.div>

          {/* Interactive Google Map Embed */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="lg:col-span-7 rounded-2xl overflow-hidden border border-gold/30 shadow-2xl relative min-h-[420px] sm:min-h-[480px] bg-purple-deep flex flex-col"
          >
            {/* Top Bar above Map */}
            <div className="bg-purple-deep/95 px-5 py-3 border-b border-gold/20 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-cream font-mono font-medium">Live Pin: Buddha Smriti Park</span>
              </div>
              <span className="text-gold/70 font-mono text-[11px]">Latitude 25.6042° N, 85.1350° E</span>
            </div>

            {/* Map Frame */}
            <div className="relative flex-1 w-full h-full min-h-[380px]">
              <iframe
                title="Buddha Smriti Park Location Map"
                src={mapEmbedUrl}
                width="100%"
                height="100%"
                style={{ border: 0, minHeight: "380px" }}
                allowFullScreen={false}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="w-full h-full filter contrast-105"
              />
            </div>

            {/* Bottom info banner on Map */}
            <div className="bg-purple-deep/90 backdrop-blur-md px-5 py-2.5 border-t border-gold/15 flex items-center justify-between text-xs text-cream/70">
              <div className="flex items-center gap-1.5">
                <ShieldCheck size={14} className="text-gold" />
                <span>Entry pass required at park gate (Registration ID)</span>
              </div>
              <a
                href={mapDirectionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gold hover:text-gold-light underline text-[11px] font-mono"
              >
                Get Live Directions →
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
