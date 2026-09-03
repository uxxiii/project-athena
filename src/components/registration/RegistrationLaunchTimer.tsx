"use client";

import { useEffect, useState } from "react";
import { Clock, Calendar, BadgeCheck } from "lucide-react";
import { calculateRegistrationLaunchTimeRemaining } from "@/lib/pricing";

interface RegistrationLaunchTimerProps {
  compact?: boolean;
  className?: string;
  onLaunch?: () => void;
}

export function RegistrationLaunchTimer({
  compact = false,
  className = "",
  onLaunch,
}: RegistrationLaunchTimerProps) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isLaunched: false,
  });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const initial = calculateRegistrationLaunchTimeRemaining();
    setTimeLeft(initial);
    if (initial.isLaunched && onLaunch) {
      onLaunch();
    }

    const timer = setInterval(() => {
      const updated = calculateRegistrationLaunchTimeRemaining();
      setTimeLeft(updated);
      if (updated.isLaunched && onLaunch) {
        onLaunch();
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [onLaunch]);

  if (!mounted) {
    return (
      <div className={`flex items-center gap-2 text-xs text-gold/60 font-mono ${className}`}>
        <Clock className="w-3.5 h-3.5 animate-spin text-gold" />
        <span>Loading launch countdown...</span>
      </div>
    );
  }

  if (timeLeft.isLaunched) {
    return (
      <div
        className={`inline-flex items-center gap-2 rounded-full border border-emerald-500/40 bg-emerald-500/10 px-4 py-1.5 text-xs text-emerald-400 font-mono shadow-lg shadow-emerald-500/10 ${className}`}
      >
        <BadgeCheck className="w-4 h-4 text-emerald-400" />
        <span className="font-bold">REGISTRATION IS NOW LIVE!</span>
      </div>
    );
  }

  if (compact) {
    return (
      <div
        className={`inline-flex items-center gap-2 rounded-full border border-amber-500/40 bg-linear-to-r from-amber-500/15 via-gold/15 to-amber-500/15 px-4 py-1.5 text-xs text-amber-300 font-mono shadow-md shadow-amber-500/10 backdrop-blur-md ${className}`}
      >
        <Calendar className="w-4 h-4 text-amber-400 animate-bounce" />
        <span>Registration Opens Sep 5, 5 PM IST: </span>
        <span className="font-bold text-cream">
          {timeLeft.days}d {String(timeLeft.hours).padStart(2, "0")}h {String(timeLeft.minutes).padStart(2, "0")}m {String(timeLeft.seconds).padStart(2, "0")}s
        </span>
      </div>
    );
  }

  return (
    <div className={`space-y-3 ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-amber-400 font-mono text-xs uppercase tracking-widest">
          <Calendar className="w-4 h-4 text-amber-400 animate-pulse" />
          <span>Registration Opens Sep 5th @ 5:00 PM IST</span>
        </div>
        <span className="text-[10px] text-amber-400/80 font-mono bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/20">
          Official Launch
        </span>
      </div>

      <div className="grid grid-cols-4 gap-2.5 text-center">
        {[
          { label: "DAYS", val: timeLeft.days },
          { label: "HOURS", val: timeLeft.hours },
          { label: "MINS", val: timeLeft.minutes },
          { label: "SECS", val: timeLeft.seconds },
        ].map((item, idx) => (
          <div
            key={idx}
            className="rounded-xl border border-amber-500/40 bg-linear-to-b from-[#1c1230] to-purple-deep p-3 shadow-xl relative overflow-hidden backdrop-blur-md group hover:border-amber-400 transition-all"
          >
            <div className="absolute inset-0 bg-amber-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
            <span className="font-mono text-2xl md:text-3xl font-extrabold text-cream block tracking-tight">
              {String(item.val).padStart(2, "0")}
            </span>
            <span className="text-[9px] uppercase tracking-widest text-amber-300 font-mono block mt-1">
              {item.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
