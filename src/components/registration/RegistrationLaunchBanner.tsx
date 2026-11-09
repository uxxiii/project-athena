"use client";

import { useEffect, useState } from "react";
import { Lock, Tag, ArrowRight, Bell, Sparkles } from "lucide-react";
import { REGISTRATION_FEE, isRegistrationLaunched, isDiwaliSaleActive } from "@/lib/pricing";
import { DIWALI_PRICING } from "@/lib/diwali";
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
  const isDiwaliOffer = isDiwaliSaleActive();

  useEffect(() => {
    const checkStatus = () => {
      const isReady = isRegistrationLaunched();
      if (isReady) {
        setLaunched(true);
        if (onLaunch) {
          onLaunch();
        }
      }
    };

    checkStatus();
    // Continuous tick so it unlocks automatically at 6:00 PM IST
    const interval = setInterval(checkStatus, 1000);
    return () => clearInterval(interval);
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
          <span>Registration Opening Today @ 6:00 PM IST</span>
        </div>
        <span className="text-xs font-mono text-gold flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5" /> 500+ Expected Delegates • 6 Committees
        </span>
      </div>

      <div className="space-y-2">
        <h3 className="font-heading text-2xl md:text-3xl font-extrabold uppercase text-cream tracking-tight">
          Delegate Registrations <span className="text-gold">Opening Today at 6:00 PM</span>
        </h3>
        <p className="text-xs md:text-sm text-cream/70 leading-relaxed font-sans max-w-xl">
          Delegate registrations go live today! Portfolios across IPL (Indian Premier League), Lok Sabha, JPC, UNSC, UNW, and International Press will be allocated on a strict first-come, first-served basis upon launch.
        </p>
      </div>

      {/* Prominent Live Countdown Timer (Auto-Unlocks at 6:00 PM IST) */}
      <div className="p-4 bg-[#0b0714] border-2 border-amber-500/40 shadow-[4px_4px_0px_0px_#000000]">
        <RegistrationLaunchTimer
          onLaunch={() => {
            setLaunched(true);
            if (onLaunch) onLaunch();
          }}
        />
      </div>

      {/* Standard Price Teaser Cards */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono uppercase tracking-widest text-cream/70 font-bold flex items-center gap-1.5">
            <Tag className="w-3.5 h-3.5 text-gold" /> Registration Pricing
          </span>
          {isDiwaliOffer && (
            <span className="text-[11px] font-mono text-amber-300 font-bold">
              🪔 Diwali Sale: ₹1,000 Flat
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="border-2 border-gold/40 bg-[#0b0714] p-4 relative shadow-[3px_3px_0px_0px_#000000]">
            <div className="absolute -top-2.5 right-3 bg-gold text-[#0b0714] text-[9px] font-black font-mono px-2 py-0.5 uppercase tracking-wider border border-black shadow-[1px_1px_0px_0px_#000]">
              {isDiwaliOffer ? "Festive Early Bird" : "Official Delegate Fee"}
            </div>
            <span className="text-xs text-gold/90 font-mono font-bold uppercase block">
              {isDiwaliOffer ? "Diwali Festive Offer" : "Standard Delegate Pass"}
            </span>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-3xl font-black text-cream font-heading">
                ₹{(isDiwaliOffer ? DIWALI_PRICING.SALE_FEE : REGISTRATION_FEE).toLocaleString("en-IN")}
              </span>
              {isDiwaliOffer && (
                <span className="text-sm text-cream/40 line-through font-mono">
                  ₹{REGISTRATION_FEE.toLocaleString("en-IN")}
                </span>
              )}
              <span className="text-xs text-cream/50 font-mono">/ delegate</span>
            </div>
            <p className="text-[11px] text-cream/60 mt-1 font-sans">
              {isDiwaliOffer
                ? "Diwali Dhamaka offer valid till 9th November 12:00 PM (Noon) IST."
                : "Uniform flat rate across all 6 committees."}
            </p>
          </div>

          <div className="border border-white/15 bg-[#0b0714] p-4 relative shadow-[3px_3px_0px_0px_#000000]">
            <span className="text-xs text-cream/80 font-mono font-bold uppercase block">
              Committees & Caps
            </span>
            <div className="mt-2 grid grid-cols-2 gap-2 text-xs font-mono">
              <div>
                <span className="text-cream/50 block text-[10px]">Lok Sabha</span>
                <span className="text-gold font-bold">100 Seats (All)</span>
              </div>
              <div>
                <span className="text-cream/50 block text-[10px]">IPL (10 Teams)</span>
                <span className="text-gold font-bold">60 Seats (All)</span>
              </div>
              <div>
                <span className="text-cream/50 block text-[10px]">UNSC / JPC</span>
                <span className="text-gold font-bold">60 / 60 (School)</span>
              </div>
              <div>
                <span className="text-cream/50 block text-[10px]">IP / UNW</span>
                <span className="text-gold font-bold">80 / 60 Seats</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-[#0b0714] p-3 border border-white/10 text-[11px] text-cream/60 flex items-center justify-between font-mono">
        <span className="flex items-center gap-1.5"><Bell className="w-3.5 h-3.5 text-gold shrink-0" /> Registration automatically unlocks live at 6:00 PM IST!</span>
        <ArrowRight className="w-4 h-4 text-gold shrink-0 ml-2" />
      </div>
    </div>
  );
}
