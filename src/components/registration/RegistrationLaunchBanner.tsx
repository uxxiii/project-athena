"use client";

import { useEffect, useState } from "react";
import { Lock, Flame, Tag, ArrowRight } from "lucide-react";
import { PRICING_CONFIG, isRegistrationLaunched } from "@/lib/pricing";
import { RegistrationLaunchTimer } from "./RegistrationLaunchTimer";

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
      className={`rounded-3xl border-2 border-amber-500/40 bg-linear-to-b from-[#180e29] via-[#120822] to-purple-deep p-6 md:p-8 shadow-2xl relative overflow-hidden space-y-6 ${className}`}
    >
      {/* Glow Orbs */}
      <div className="absolute -top-16 -right-16 w-56 h-56 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-16 -left-16 w-56 h-56 bg-purple-mid/25 rounded-full blur-3xl pointer-events-none" />

      {/* Header Tag */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-amber-500/20 pb-5">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-linear-to-r from-amber-500 to-yellow-500 text-purple-dark text-xs font-extrabold uppercase tracking-wider font-mono shadow-lg">
          <Lock className="w-3.5 h-3.5 shrink-0" />
          <span>Registration Opening Sep 5th @ 5:00 PM IST</span>
        </div>
        <span className="text-xs text-amber-300 font-mono flex items-center gap-1.5">
          <Flame className="w-3.5 h-3.5 text-amber-400" />
          Early Bird Rates Locked In
        </span>
      </div>

      <div className="space-y-2">
        <h3 className="font-heading text-2xl md:text-3xl text-cream">
          Delegate Registrations <span className="text-gradient-gold">Launch Soon</span>
        </h3>
        <p className="text-xs md:text-sm text-cream/70 leading-relaxed font-sans max-w-xl">
          Portal opens officially on <strong className="text-amber-300">September 5, 2026 at 5:00 PM IST</strong>. Delegate portfolios will be allocated on a first-come, first-served basis upon launch.
        </p>
      </div>

      {/* Countdown Timer */}
      <RegistrationLaunchTimer onLaunch={onLaunch} />

      {/* Early Bird Price Teaser Cards */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono uppercase tracking-widest text-amber-400/90 flex items-center gap-1.5">
            <Tag className="w-3.5 h-3.5" /> Early Bird Special Rates (Starting Sep 5)
          </span>
          <span className="text-[10px] font-mono text-cream/40">Valid till Sep 10th</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Normal Committee Pricing */}
          <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 relative shadow-md">
            <span className="text-xs text-amber-300 font-mono font-semibold block">
              {PRICING_CONFIG.normal.label}
            </span>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl font-extrabold text-cream font-heading">
                ₹{PRICING_CONFIG.normal.earlyBirdPrice.toLocaleString("en-IN")}
              </span>
              <span className="text-xs text-rose-400/80 line-through decoration-rose-500 decoration-2 font-mono">
                ₹{PRICING_CONFIG.normal.normalPrice.toLocaleString("en-IN")}
              </span>
              <span className="ml-auto text-[9px] font-bold font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                SAVE ₹400 (25% OFF)
              </span>
            </div>
          </div>

          {/* UNSC Pricing */}
          <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 relative shadow-md">
            <span className="text-xs text-amber-300 font-mono font-semibold block">
              {PRICING_CONFIG.unsc.label}
            </span>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl font-extrabold text-cream font-heading">
                ₹{PRICING_CONFIG.unsc.earlyBirdPrice.toLocaleString("en-IN")}
              </span>
              <span className="text-xs text-rose-400/80 line-through decoration-rose-500 decoration-2 font-mono">
                ₹{PRICING_CONFIG.unsc.normalPrice.toLocaleString("en-IN")}
              </span>
              <span className="ml-auto text-[9px] font-bold font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                SAVE ₹600 (19% OFF)
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-xl bg-purple-deep/70 p-3 border border-amber-500/20 text-[11px] text-cream/60 flex items-center justify-between">
        <span>⏰ Be ready at 5:00 PM IST on Sep 5th to lock your preferred committee & portfolio.</span>
        <ArrowRight className="w-4 h-4 text-amber-400 shrink-0 ml-2" />
      </div>
    </div>
  );
}
