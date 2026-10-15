"use client";

import { useEffect, useState } from "react";
import { Lock, Tag, ArrowRight, Bell } from "lucide-react";
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
      className={`bg-[#140b24] border-2 border-white/20 p-6 md:p-8 shadow-[6px_6px_0px_0px_#000000] relative space-y-6 ${className}`}
    >
      {/* Header Tag */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-5">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 border border-white/20 bg-[#0b0714] text-cream text-xs font-mono font-bold uppercase tracking-wider shadow-[2px_2px_0px_0px_#000000]">
          <Lock className="w-3.5 h-3.5 shrink-0 text-gold" />
          <span>Registration Opening Soon</span>
        </div>
      </div>

      <div className="space-y-2">
        <h3 className="font-heading text-2xl md:text-3xl font-extrabold uppercase text-cream tracking-tight">
          Delegate Registrations <span className="text-gold">Opening Soon</span>
        </h3>
        <p className="text-xs md:text-sm text-cream/70 leading-relaxed font-sans max-w-xl">
          Delegate registrations are opening soon! Portfolios will be allocated on a first-come, first-served basis once registrations launch.
        </p>
      </div>

      {/* Standard Price Teaser Cards */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono uppercase tracking-widest text-cream/70 font-bold flex items-center gap-1.5">
            <Tag className="w-3.5 h-3.5 text-gold" /> Registration Rates
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Normal Committee Pricing */}
          <div className="border border-white/15 bg-[#0b0714] p-4 relative shadow-[3px_3px_0px_0px_#000000]">
            <span className="text-xs text-gold/90 font-mono font-bold uppercase block">
              {PRICING_CONFIG.normal.label}
            </span>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl font-black text-cream font-heading">
                ₹{PRICING_CONFIG.normal.normalPrice.toLocaleString("en-IN")}
              </span>
            </div>
          </div>

          {/* UNSC Pricing */}
          <div className="border border-white/15 bg-[#0b0714] p-4 relative shadow-[3px_3px_0px_0px_#000000]">
            <span className="text-xs text-gold/90 font-mono font-bold uppercase block">
              {PRICING_CONFIG.unsc.label}
            </span>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl font-black text-cream font-heading">
                ₹{PRICING_CONFIG.unsc.normalPrice.toLocaleString("en-IN")}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-[#0b0714] p-3 border border-white/10 text-[11px] text-cream/60 flex items-center justify-between font-mono">
        <span className="flex items-center gap-1.5"><Bell className="w-3.5 h-3.5 text-gold shrink-0" /> Stay tuned for official registration announcements.</span>
        <ArrowRight className="w-4 h-4 text-gold shrink-0 ml-2" />
      </div>
    </div>
  );
}
