"use client";

import { useEffect, useState } from "react";
import { Lock, Tag, ArrowRight } from "lucide-react";
import { PRICING_CONFIG, isRegistrationLaunched } from "@/lib/pricing";

interface RegistrationLaunchBannerProps {
  className?: string;
  onLaunch?: () => void;
}

export function RegistrationLaunchBanner({
  className = "",
  onLaunch,
}: RegistrationLaunchBannerProps) {
  const [launched, setLaunched] = useState(false);

  useEffect(() => {
    const isReady = isRegistrationLaunched();
    setLaunched(isReady);
    if (isReady && onLaunch) {
      onLaunch();
    }
  }, [onLaunch]);

  if (launched) return null;

  return (
    <div
      className={`rounded-3xl glass-card p-6 md:p-8 shadow-2xl relative overflow-hidden space-y-6 ${className}`}
    >
      {/* Glow Orbs */}
      <div className="absolute -top-16 -right-16 w-56 h-56 bg-gold/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-16 -left-16 w-56 h-56 bg-purple-mid/25 rounded-full blur-3xl pointer-events-none" />

      {/* Header Tag */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gold/15 pb-5">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-gold/30 bg-purple-dark/80 text-gold-light text-xs font-semibold uppercase tracking-wider font-mono shadow-md">
          <Lock className="w-3.5 h-3.5 shrink-0 text-gold" />
          <span>Registration Opening Soon</span>
        </div>
      </div>

      <div className="space-y-2">
        <h3 className="font-heading text-2xl md:text-3xl text-cream">
          Delegate Registrations <span className="text-gradient-gold">Opening Soon</span>
        </h3>
        <p className="text-xs md:text-sm text-cream/70 leading-relaxed font-sans max-w-xl">
          Delegate registrations are opening soon! Portfolios will be allocated on a first-come, first-served basis once registrations launch.
        </p>
      </div>

      {/* Standard Price Teaser Cards */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono uppercase tracking-widest text-gold/80 flex items-center gap-1.5">
            <Tag className="w-3.5 h-3.5" /> Registration Rates
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Normal Committee Pricing */}
          <div className="rounded-xl border border-gold/20 bg-purple-dark/60 p-4 relative shadow-md">
            <span className="text-xs text-gold font-mono font-semibold block">
              {PRICING_CONFIG.normal.label}
            </span>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl font-extrabold text-cream font-heading">
                ₹{PRICING_CONFIG.normal.normalPrice.toLocaleString("en-IN")}
              </span>
            </div>
          </div>

          {/* UNSC Pricing */}
          <div className="rounded-xl border border-gold/20 bg-purple-dark/60 p-4 relative shadow-md">
            <span className="text-xs text-gold font-mono font-semibold block">
              {PRICING_CONFIG.unsc.label}
            </span>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl font-extrabold text-cream font-heading">
                ₹{PRICING_CONFIG.unsc.normalPrice.toLocaleString("en-IN")}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-xl bg-purple-deep/80 p-3 border border-gold/15 text-[11px] text-cream/60 flex items-center justify-between">
        <span>⏰ Stay tuned for the official registration opening announcements.</span>
        <ArrowRight className="w-4 h-4 text-gold shrink-0 ml-2" />
      </div>
    </div>
  );
}
