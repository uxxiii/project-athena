"use client";

import { useEffect, useState } from "react";
import { Lock, Tag, ArrowRight, Bell, Sparkles } from "lucide-react";
import { REGISTRATION_FEE, isRegistrationLaunched } from "@/lib/pricing";

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
      className={`bg-[#140b24] border-2 border-white/20 p-6 md:p-8 shadow-[6px_6px_0px_0px_#000000] relative space-y-6 ${className}`}
    >
      {/* Header Tag */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-5">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 border border-white/20 bg-[#0b0714] text-cream text-xs font-mono font-bold uppercase tracking-wider shadow-[2px_2px_0px_0px_#000000]">
          <Lock className="w-3.5 h-3.5 shrink-0 text-gold" />
          <span>Registration Opening Soon</span>
        </div>
        <span className="text-xs font-mono text-gold flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5" /> 500+ Seats Across 6 Committees
        </span>
      </div>

      <div className="space-y-2">
        <h3 className="font-heading text-2xl md:text-3xl font-extrabold uppercase text-cream tracking-tight">
          Delegate Registrations <span className="text-gold">Opening Soon</span>
        </h3>
        <p className="text-xs md:text-sm text-cream/70 leading-relaxed font-sans max-w-xl">
          Delegate registrations open soon! Portfolios across UNHRC, UNW, UNSC, Lok Sabha, BLA, and International Press will be allocated on a strict first-come, first-served basis upon launch.
        </p>
      </div>

      {/* Standard Price Teaser Cards */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono uppercase tracking-widest text-cream/70 font-bold flex items-center gap-1.5">
            <Tag className="w-3.5 h-3.5 text-gold" /> Delegate Registration Rate
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="border-2 border-gold/40 bg-[#0b0714] p-4 relative shadow-[3px_3px_0px_0px_#000000]">
            <span className="text-xs text-gold/90 font-mono font-bold uppercase block">
              Official Delegate Fee
            </span>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-3xl font-black text-cream font-heading">
                ₹{REGISTRATION_FEE.toLocaleString("en-IN")}
              </span>
              <span className="text-xs text-cream/50 font-mono">/ delegate</span>
            </div>
            <p className="text-[11px] text-cream/60 mt-1 font-sans">
              Uniform flat rate across all 6 committees.
            </p>
          </div>

          <div className="border border-white/15 bg-[#0b0714] p-4 relative shadow-[3px_3px_0px_0px_#000000]">
            <span className="text-xs text-cream/80 font-mono font-bold uppercase block">
              Committee Caps
            </span>
            <div className="mt-2 grid grid-cols-2 gap-2 text-xs font-mono">
              <div>
                <span className="text-cream/50 block text-[10px]">Lok Sabha</span>
                <span className="text-gold font-bold">100 Seats</span>
              </div>
              <div>
                <span className="text-cream/50 block text-[10px]">IP (Press)</span>
                <span className="text-gold font-bold">80 Seats</span>
              </div>
              <div>
                <span className="text-cream/50 block text-[10px]">UNHRC / UNW</span>
                <span className="text-gold font-bold">60 / 60 Seats</span>
              </div>
              <div>
                <span className="text-cream/50 block text-[10px]">UNSC / BLA</span>
                <span className="text-gold font-bold">60 / 60 Seats</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-[#0b0714] p-3 border border-white/10 text-[11px] text-cream/60 flex items-center justify-between font-mono">
        <span className="flex items-center gap-1.5"><Bell className="w-3.5 h-3.5 text-gold shrink-0" /> Stay tuned: registration opens soon!</span>
        <ArrowRight className="w-4 h-4 text-gold shrink-0 ml-2" />
      </div>
    </div>
  );
}
