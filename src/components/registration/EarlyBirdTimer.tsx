"use client";

import { useEffect, useState } from "react";
import { Clock, Zap } from "lucide-react";
import { calculateTimeRemaining } from "@/lib/pricing";

interface EarlyBirdTimerProps {
  compact?: boolean;
  className?: string;
}

export function EarlyBirdTimer({ compact = false, className = "" }: EarlyBirdTimerProps) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isExpired: false,
  });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setTimeLeft(calculateTimeRemaining());

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeRemaining());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  if (!mounted) {
    return (
      <div className={`flex items-center gap-2 text-xs text-gold/60 font-mono ${className}`}>
        <Clock className="w-3.5 h-3.5 animate-spin" />
        <span>Calculating offer time...</span>
      </div>
    );
  }

  if (timeLeft.isExpired) {
    return (
      <div className={`inline-flex items-center gap-2 rounded-lg border border-gold/30 bg-gold/10 px-3 py-1.5 text-xs text-gold font-mono ${className}`}>
        <Clock className="w-3.5 h-3.5" />
        <span>Standard Pricing Active (Early Bird Ended)</span>
      </div>
    );
  }

  if (compact) {
    return (
      <div className={`inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3.5 py-1 text-xs text-amber-300 font-mono shadow-sm shadow-amber-500/10 ${className}`}>
        <Zap className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
        <span>Early Bird Ends: </span>
        <span className="font-bold text-cream">
          {timeLeft.days}d {String(timeLeft.hours).padStart(2, "0")}h {String(timeLeft.minutes).padStart(2, "0")}m {String(timeLeft.seconds).padStart(2, "0")}s
        </span>
      </div>
    );
  }

  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-amber-400 font-mono text-xs uppercase tracking-wider">
          <Zap className="w-4 h-4 text-amber-400 animate-bounce" />
          <span>Early Bird Discount Ends On Sept 10th</span>
        </div>
        <span className="text-[10px] text-cream/40 font-mono">Limited Time Offer</span>
      </div>

      <div className="grid grid-cols-4 gap-2 text-center">
        {[
          { label: "DAYS", val: timeLeft.days },
          { label: "HOURS", val: timeLeft.hours },
          { label: "MINS", val: timeLeft.minutes },
          { label: "SECS", val: timeLeft.seconds },
        ].map((item, idx) => (
          <div
            key={idx}
            className="rounded-xl border border-amber-500/30 bg-linear-to-b from-purple-dark/90 to-purple-deep/90 p-2.5 shadow-lg relative overflow-hidden backdrop-blur-sm group hover:border-amber-400/60 transition-all"
          >
            <div className="absolute inset-0 bg-amber-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
            <span className="font-mono text-xl md:text-2xl font-bold text-cream block tracking-tight">
              {String(item.val).padStart(2, "0")}
            </span>
            <span className="text-[9px] uppercase tracking-widest text-amber-300/70 font-mono block mt-0.5">
              {item.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
