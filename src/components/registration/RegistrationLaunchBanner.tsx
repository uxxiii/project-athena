"use client";

import { useEffect, useState } from "react";
import { Lock, Tag, ArrowRight, Bell, Sparkles } from "lucide-react";
import { REGISTRATION_FEE, isRegistrationLaunched, CHILDRENS_DAY_SALE_FEE } from "@/lib/pricing";
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
    const checkStatus = () => {
      const isReady = isRegistrationLaunched();
      if (isReady) {
        setLaunched(true);
        if (onLaunch) {
          onLaunch();
        }
      } else {
        setLaunched(false);
      }
    };

    checkStatus();
    // Continuous tick so it unlocks automatically at 9:00 PM IST
    const interval = setInterval(checkStatus, 1000);
    return () => clearInterval(interval);
  }, [onLaunch]);

  if (launched) return null;

  return (
    <div
      className={`bg-[#140b24] border-2 border-sky-400/50 p-6 md:p-8 shadow-[6px_6px_0px_0px_#000000] relative space-y-6 ${className}`}
    >
      {/* Header Tag */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-5">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 border border-sky-400/50 bg-[#0b0714] text-sky-300 text-xs font-mono font-bold uppercase tracking-wider shadow-[2px_2px_0px_0px_#000000]">
          <Lock className="w-3.5 h-3.5 shrink-0 text-gold" />
          <span>🎈 Children&apos;s Day Flash Sale Opens @ 9:00 PM IST</span>
        </div>
        <span className="text-xs font-mono text-gold flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5" /> 260 Seats • 6 Committees
        </span>
      </div>

      <div className="space-y-2">
        <h3 className="font-heading text-2xl md:text-3xl font-extrabold uppercase text-cream tracking-tight">
          Children&apos;s Day Flash Sale <span className="text-gold">Opens at 9:00 PM IST (₹1,100)</span>
        </h3>
        <p className="text-xs md:text-sm text-cream/75 leading-relaxed font-sans max-w-2xl">
          Registrations are briefly paused for 10 minutes (8:50 PM – 9:00 PM IST) to prepare for our{" "}
          <strong className="text-gold">Children&apos;s Day 30-Minute Flash Sale (9:00 PM – 9:30 PM IST)</strong>! Register between{" "}
          <strong className="text-sky-300">9:00 PM and 9:30 PM tonight</strong> at the special Bal Diwas rate of{" "}
          <strong className="text-gold">₹1,100 per delegate</strong> (regular ₹1,300).
        </p>
      </div>

      {/* Prominent Live Countdown Timer (Auto-Unlocks at 9:00 PM IST) */}
      <div className="p-4 bg-[#0b0714] border-2 border-sky-400/40 shadow-[4px_4px_0px_0px_#000000]">
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
            <Tag className="w-3.5 h-3.5 text-gold" /> Children&apos;s Day Flash Sale Pricing (9:00 PM – 9:30 PM)
          </span>
          <span className="text-[11px] font-mono text-sky-300 font-bold">
            🎈 Children&apos;s Day Sale: ₹1,100 Flat
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="border-2 border-gold/60 bg-[#0b0714] p-4 relative shadow-[3px_3px_0px_0px_#000000]">
            <div className="absolute -top-2.5 right-3 bg-gold text-[#0b0714] text-[9px] font-black font-mono px-2 py-0.5 uppercase tracking-wider border border-black shadow-[1px_1px_0px_0px_#000]">
              9:00 PM – 9:30 PM IST Only
            </div>
            <span className="text-xs text-sky-300 font-mono font-bold uppercase block">
              🎈 Children&apos;s Day Flash Sale Pass
            </span>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-3xl font-black text-cream font-heading">
                ₹{CHILDRENS_DAY_SALE_FEE.toLocaleString("en-IN")}
              </span>
              <span className="text-sm text-cream/40 line-through font-mono">
                ₹{REGISTRATION_FEE.toLocaleString("en-IN")}
              </span>
              <span className="text-xs text-cream/50 font-mono">/ delegate</span>
            </div>
            <p className="text-[11px] text-cream/60 mt-1 font-sans">
              Special ₹200 discount valid strictly from 9:00 PM to 9:30 PM IST tonight (14th Nov).
            </p>
          </div>

          <div className="border border-white/15 bg-[#0b0714] p-4 relative shadow-[3px_3px_0px_0px_#000000]">
            <span className="text-xs text-cream/80 font-mono font-bold uppercase block">
              Committees &amp; Caps (260 Total)
            </span>
            <div className="mt-2 grid grid-cols-2 gap-2 text-xs font-mono">
              <div>
                <span className="text-cream/50 block text-[10px]">IPL (10 Teams)</span>
                <span className="text-gold font-bold">60 Seats (All)</span>
              </div>
              <div>
                <span className="text-cream/50 block text-[10px]">Lok Sabha</span>
                <span className="text-gold font-bold">40 Seats (All)</span>
              </div>
              <div>
                <span className="text-cream/50 block text-[10px]">UNSC / JPC</span>
                <span className="text-gold font-bold">40 / 40 (School)</span>
              </div>
              <div>
                <span className="text-cream/50 block text-[10px]">IP / UNW</span>
                <span className="text-gold font-bold">40 / 40 Seats</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-[#0b0714] p-3 border border-white/10 text-[11px] text-cream/70 flex items-center justify-between font-mono">
        <span className="flex items-center gap-1.5">
          <Bell className="w-3.5 h-3.5 text-gold shrink-0" /> Registration automatically unlocks live at 9:00 PM IST with ₹1,100 pricing!
        </span>
        <ArrowRight className="w-4 h-4 text-gold shrink-0 ml-2" />
      </div>
    </div>
  );
}
