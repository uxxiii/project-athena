"use client";

import { useEffect, useState } from "react";
import { isDiwaliSeason, isDiwaliSaleActive } from "@/lib/diwali";
import Link from "next/link";
import { Sparkles } from "lucide-react";

interface CrackerBurst {
  id: number;
  x: number;
  y: number;
  color: string;
}

export function DiwaliDecor() {
  const [active, setActive] = useState(false);
  const [saleActive, setSaleActive] = useState(false);
  const [lightsBlink, setLightsBlink] = useState(true);
  const [crackerBursts, setCrackerBursts] = useState<CrackerBurst[]>([]);

  useEffect(() => {
    setActive(isDiwaliSeason());
    setSaleActive(isDiwaliSaleActive());

    const blinkTimer = setInterval(() => {
      setLightsBlink((b) => !b);
    }, 1000);

    // Periodic celebratory cracker fireworks bursting in the background
    const crackerTimer = setInterval(() => {
      const colors = ["#f59e0b", "#e11d48", "#10b981", "#fbbf24", "#a855f7"];
      const newBurst: CrackerBurst = {
        id: Date.now() + Math.random(),
        x: 10 + Math.random() * 80, // %
        y: 15 + Math.random() * 60, // %
        color: colors[Math.floor(Math.random() * colors.length)],
      };
      setCrackerBursts((prev) => [...prev.slice(-3), newBurst]);
    }, 3500);

    return () => {
      clearInterval(blinkTimer);
      clearInterval(crackerTimer);
    };
  }, []);

  const triggerManualCracker = () => {
    const colors = ["#f59e0b", "#fbbf24", "#ef4444", "#38bdf8", "#34d399"];
    const newBurst: CrackerBurst = {
      id: Date.now(),
      x: 30 + Math.random() * 40,
      y: 20 + Math.random() * 40,
      color: colors[Math.floor(Math.random() * colors.length)],
    };
    setCrackerBursts((prev) => [...prev.slice(-4), newBurst]);
  };

  if (!active) return null;

  return (
    <>
      {/* ─── 1. TOP MARIGOLD TORAN WITH MICRO-DIYAS ─── */}
      <div
        className="pointer-events-none fixed top-0 left-0 right-0 z-40 overflow-hidden h-4 sm:h-5"
        aria-hidden="true"
      >
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-amber-600 via-yellow-400 to-amber-600 shadow-[0_0_8px_#f59e0b]" />

        <div className="flex justify-between items-start px-2 sm:px-6 w-full max-w-7xl mx-auto">
          {Array.from({ length: 32 }).map((_, i) => {
            const isDiya = i % 4 === 1;
            const isOrange = i % 2 === 0;

            return (
              <div key={i} className="flex flex-col items-center">
                <div
                  className="w-[1px] bg-amber-400/50"
                  style={{ height: `${3 + (i % 3) * 2}px` }}
                />
                {isDiya ? (
                  <div className="relative">
                    <div className="w-2.5 h-1 bg-amber-700 rounded-b-full border border-amber-500/80 shadow-[0_0_4px_#f59e0b]" />
                    <div
                      className={`absolute -top-1 left-1/2 -translate-x-1/2 w-1 h-1.5 bg-yellow-300 rounded-full blur-[0.3px] transition-transform duration-300 ${
                        lightsBlink ? "scale-110 opacity-100" : "scale-85 opacity-70"
                      }`}
                    />
                  </div>
                ) : (
                  <div
                    className={`w-1.5 h-1.5 rounded-full transition-all duration-500 ${
                      isOrange
                        ? "bg-amber-400 shadow-[0_0_4px_#f59e0b]"
                        : "bg-yellow-300 shadow-[0_0_4px_#fef08a]"
                    } ${lightsBlink ? "opacity-100" : "opacity-60"}`}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* ─── 2. CELEBRATORY CRACKERS / FIREWORKS IN BACKGROUND ─── */}
      <div
        className="pointer-events-none fixed inset-0 z-10 overflow-hidden"
        aria-hidden="true"
      >
        {crackerBursts.map((burst) => (
          <div
            key={burst.id}
            className="absolute -translate-x-1/2 -translate-y-1/2 animate-ping duration-1000"
            style={{
              left: `${burst.x}%`,
              top: `${burst.y}%`,
            }}
          >
            {/* Multi-spoke firework starburst */}
            <div className="relative w-20 h-20 sm:w-28 sm:h-28 flex items-center justify-center">
              <div
                className="absolute inset-0 rounded-full blur-md opacity-70"
                style={{ backgroundColor: burst.color }}
              />
              {Array.from({ length: 8 }).map((_, spokeIdx) => (
                <div
                  key={spokeIdx}
                  className="absolute w-full h-[1.5px] rounded-full"
                  style={{
                    backgroundColor: burst.color,
                    transform: `rotate(${spokeIdx * 22.5}deg)`,
                  }}
                />
              ))}
              <span className="text-xs">✨</span>
            </div>
          </div>
        ))}
      </div>

      {/* ─── 3. TRADITIONAL FLORAL RANGOLIS (CORNER FLOURISHES) ─── */}
      {/* Top Right Rangoli */}
      <div
        className="pointer-events-none fixed top-12 right-0 z-10 opacity-25 hidden xl:block translate-x-10 -translate-y-6"
        aria-hidden="true"
      >
        <svg width="220" height="220" viewBox="0 0 200 200" fill="none">
          <circle cx="100" cy="100" r="90" stroke="#d4af37" strokeWidth="1" strokeDasharray="3 3" />
          <circle cx="100" cy="100" r="70" stroke="#f59e0b" strokeWidth="1.5" />
          <circle cx="100" cy="100" r="45" stroke="#ef4444" strokeWidth="1" strokeDasharray="4 2" />
          <circle cx="100" cy="100" r="20" fill="#d4af37" fillOpacity="0.15" stroke="#d4af37" strokeWidth="2" />
          {/* 8 Lotus Rangoli Petals */}
          {Array.from({ length: 8 }).map((_, i) => (
            <path
              key={i}
              d="M100 35 C115 55 115 75 100 85 C85 75 85 55 100 35 Z"
              stroke="#fbbf24"
              strokeWidth="1.2"
              fill="#f59e0b"
              fillOpacity="0.1"
              transform={`rotate(${i * 45} 100 100)`}
            />
          ))}
          {/* Outer Diya Points */}
          {Array.from({ length: 8 }).map((_, i) => (
            <circle
              key={i}
              cx="100"
              cy="12"
              r="3"
              fill="#fbbf24"
              transform={`rotate(${i * 45} 100 100)`}
            />
          ))}
        </svg>
      </div>

      {/* Bottom Left Rangoli */}
      <div
        className="pointer-events-none fixed bottom-0 left-0 z-10 opacity-20 hidden xl:block -translate-x-12 translate-y-12"
        aria-hidden="true"
      >
        <svg width="260" height="260" viewBox="0 0 200 200" fill="none">
          <circle cx="100" cy="100" r="95" stroke="#d4af37" strokeWidth="1" strokeDasharray="4 4" />
          <circle cx="100" cy="100" r="65" stroke="#ea580c" strokeWidth="1.5" />
          <circle cx="100" cy="100" r="30" stroke="#d4af37" strokeWidth="1.5" />
          {Array.from({ length: 12 }).map((_, i) => (
            <path
              key={i}
              d="M100 40 C110 60 110 80 100 90 C90 80 90 60 100 40 Z"
              stroke="#fbbf24"
              strokeWidth="1"
              fill="#f59e0b"
              fillOpacity="0.08"
              transform={`rotate(${i * 30} 100 100)`}
            />
          ))}
        </svg>
      </div>

      {/* ─── 4. INTERACTIVE FESTIVE CRACKER & DIYA WIDGET ─── */}
      <aside
        aria-label="Festive Diwali Offer"
        className="fixed bottom-4 left-4 z-40 hidden sm:flex items-center gap-3 bg-[#0b0714]/95 border-2 border-gold/50 px-3.5 py-2.5 shadow-[5px_5px_0px_0px_#000000] backdrop-blur-md rounded-none text-xs font-mono"
      >
        {/* Glowing clay diya with double flame */}
        <div className="relative group cursor-pointer" onClick={triggerManualCracker} title="Click to burst crackers!">
          <div className="w-7 h-4 bg-gradient-to-r from-amber-800 via-amber-600 to-amber-900 rounded-b-full border border-amber-500 shadow-[0_0_12px_#f59e0b]" />
          {/* Flame outer */}
          <div
            className={`absolute -top-3.5 left-1/2 -translate-x-1/2 w-3.5 h-4.5 bg-gradient-to-t from-orange-500 to-yellow-300 rounded-full blur-[0.6px] transition-transform duration-300 ${
              lightsBlink ? "scale-110" : "scale-90"
            }`}
          />
          {/* Flame inner white-hot core */}
          <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-1.5 h-2.5 bg-white rounded-full blur-[0.2px]" />
        </div>

        <div>
          <div className="flex items-center gap-1.5 text-gold font-bold uppercase tracking-wider text-[11px]">
            <span>Shubh Deepavali</span>
            <button
              onClick={triggerManualCracker}
              className="text-[10px] text-amber-300 hover:text-white px-1.5 py-0.2 bg-amber-500/20 border border-amber-400/40 font-mono transition-colors cursor-pointer"
              title="Burst Phuljhadi!"
            >
              Burst Crackers 🎆
            </button>
          </div>
          <p className="text-[10px] text-cream/70 font-sans mt-0.5">
            {saleActive
              ? "Diwali Sale: ₹1,000 Early Bird Pass (Till 9 Nov Noon)"
              : "Celebrate with Athena Summit 2026"}
          </p>
        </div>

        {saleActive && (
          <Link
            href="/registration"
            className="ml-1 px-3 py-1 bg-gold text-[#0b0714] font-black text-[10px] uppercase tracking-wider hover:bg-gold/90 transition-all border border-black shadow-[2px_2px_0px_0px_#000000]"
          >
            Claim
          </Link>
        )}
      </aside>
    </>
  );
}
