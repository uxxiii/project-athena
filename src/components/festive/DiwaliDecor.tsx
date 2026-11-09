"use client";

import { useEffect, useState } from "react";
import { isDiwaliSeason, isDiwaliSaleActive } from "@/lib/diwali";
import Link from "next/link";
import { Sun, Sparkles, Check, Heart } from "lucide-react";

interface FloatingPrasad {
  id: number;
  x: number;
  y: number;
  type: "thekua" | "diya" | "flower" | "sun";
  size: number;
  rotate: number;
}

export function DiwaliDecor() {
  const [active, setActive] = useState(false);
  const [saleActive, setSaleActive] = useState(false);
  const [lightsBlink, setLightsBlink] = useState(true);
  const [floatingPrasad, setFloatingPrasad] = useState<FloatingPrasad[]>([]);
  const [blessingToast, setBlessingToast] = useState<string | null>(null);
  const [arghyaSurge, setArghyaSurge] = useState(false);

  useEffect(() => {
    setActive(isDiwaliSeason());
    setSaleActive(isDiwaliSaleActive());

    const blinkTimer = setInterval(() => {
      setLightsBlink((b) => !b);
    }, 1200);

    return () => clearInterval(blinkTimer);
  }, []);

  const triggerThekuaPrasad = () => {
    const types: ("thekua" | "flower" | "diya")[] = ["thekua", "thekua", "flower", "diya"];
    const newItems: FloatingPrasad[] = Array.from({ length: 12 }).map((_, i) => ({
      id: Date.now() + i,
      x: 20 + Math.random() * 60,
      y: 70 + Math.random() * 20,
      type: types[Math.floor(Math.random() * types.length)],
      size: 24 + Math.random() * 16,
      rotate: Math.floor(Math.random() * 360),
    }));

    setFloatingPrasad((prev) => [...prev.slice(-18), ...newItems]);
    setBlessingToast("ठेकुआ प्रसाद एवं खरना की असीम शुभकामनाएं! 🥮✨ (Pure Gur & Ghee Prasad Accepted)");

    setTimeout(() => {
      setBlessingToast((curr) =>
        curr?.includes("ठेकुआ") ? null : curr
      );
    }, 4500);
  };

  const triggerArghya = () => {
    setArghyaSurge(true);
    const sunItems: FloatingPrasad[] = Array.from({ length: 8 }).map((_, i) => ({
      id: Date.now() + i,
      x: 15 + Math.random() * 70,
      y: 50 + Math.random() * 30,
      type: "sun",
      size: 28 + Math.random() * 20,
      rotate: Math.floor(Math.random() * 360),
    }));

    setFloatingPrasad((prev) => [...prev.slice(-15), ...sunItems]);
    setBlessingToast("ॐ सूर्याय नमः · Pehla & Dusra Arghya Blessings! ☀️🌾 May Lord Surya illuminate your path!");

    setTimeout(() => setArghyaSurge(false), 2000);
    setTimeout(() => {
      setBlessingToast((curr) =>
        curr?.includes("सूर्याय") ? null : curr
      );
    }, 5000);
  };

  if (!active) return null;

  return (
    <>
      {/* ─── 1. TOP GANGA GHAT SUGARCANE & MARIGOLD TORAN ─── */}
      <div
        className="pointer-events-none fixed top-0 left-0 right-0 z-40 overflow-hidden h-6 sm:h-7"
        aria-hidden="true"
      >
        {/* Divine Sunrise Ribbon */}
        <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-amber-700 via-orange-500 via-yellow-400 to-amber-700 shadow-[0_0_12px_#f97316]" />

        <div className="flex justify-between items-start px-2 sm:px-6 w-full max-w-7xl mx-auto">
          {Array.from({ length: 32 }).map((_, i) => {
            const isCenter = i === 15 || i === 16;
            const isSugarcaneLeaf = i % 5 === 0;
            const isHolyDiya = i % 4 === 2;

            if (isCenter) {
              return (
                <div key={i} className="flex flex-col items-center">
                  <div className="w-[1.5px] h-2 bg-gradient-to-b from-amber-500 to-yellow-300" />
                  <span className="text-xs -mt-1 drop-shadow-[0_0_6px_#f59e0b] scale-110">
                    ☀️
                  </span>
                </div>
              );
            }

            return (
              <div key={i} className="flex flex-col items-center">
                <div
                  className="w-[1px] bg-amber-600/40"
                  style={{ height: `${3 + (i % 3) * 2.5}px` }}
                />
                {isHolyDiya ? (
                  <div className="relative">
                    <div className="w-2.5 h-1.5 bg-gradient-to-r from-amber-800 to-orange-950 rounded-b-full border border-amber-500/80 shadow-[0_0_5px_#f97316]" />
                    <div
                      className={`absolute -top-1.5 left-1/2 -translate-x-1/2 w-1.5 h-2 bg-yellow-300 rounded-full blur-[0.4px] transition-transform duration-300 ${
                        lightsBlink ? "scale-125 opacity-100" : "scale-85 opacity-70"
                      }`}
                    />
                  </div>
                ) : isSugarcaneLeaf ? (
                  <div className="w-2 h-2 text-emerald-500/80 text-[10px] -mt-0.5">
                    🎋
                  </div>
                ) : (
                  <div
                    className={`w-2 h-2 rounded-full transition-all duration-500 ${
                      i % 2 === 0
                        ? "bg-gradient-to-br from-amber-400 to-orange-500 shadow-[0_0_5px_#f97316]"
                        : "bg-yellow-300 shadow-[0_0_4px_#fef08a]"
                    } ${lightsBlink ? "opacity-100 scale-105" : "opacity-75 scale-90"}`}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* ─── 2. ARGYA SURGE / SUNRISE GOLDEN FLASH (TRIGGERED ON ACTION) ─── */}
      <div
        className={`pointer-events-none fixed inset-0 z-30 transition-opacity duration-1000 ${
          arghyaSurge ? "opacity-25" : "opacity-0"
        } bg-gradient-to-t from-orange-600/40 via-amber-500/20 to-transparent`}
        aria-hidden="true"
      />

      {/* ─── 3. FLOATING THEKUA, DIYAS & MARIGOLD FLOWERS ─── */}
      <div
        className="pointer-events-none fixed inset-0 z-20 overflow-hidden"
        aria-hidden="true"
      >
        {floatingPrasad.map((item) => (
          <div
            key={item.id}
            className="absolute -translate-x-1/2 -translate-y-1/2 animate-bounce transition-all duration-1000"
            style={{
              left: `${item.x}%`,
              top: `${item.y}%`,
              transform: `rotate(${item.rotate}deg)`,
            }}
          >
            {item.type === "thekua" && (
              <div
                className="relative flex items-center justify-center rounded-full bg-gradient-to-br from-[#b45309] via-[#92400e] to-[#78350f] border-2 border-[#d97706] shadow-[0_0_12px_#d97706]"
                style={{ width: `${item.size}px`, height: `${item.size * 0.75}px` }}
                title="Traditional Bihari Thekua Prasad"
              >
                {/* Authentic Thekua Leaf Sancha Vein Mark */}
                <div className="w-[60%] h-[1.5px] bg-[#fbbf24]/70" />
                <div className="absolute w-[40%] h-[1px] bg-[#fbbf24]/50 rotate-45" />
                <div className="absolute w-[40%] h-[1px] bg-[#fbbf24]/50 -rotate-45" />
              </div>
            )}

            {item.type === "sun" && (
              <div className="text-2xl animate-spin duration-3000 drop-shadow-[0_0_14px_#f59e0b]">
                ☀️
              </div>
            )}

            {item.type === "diya" && (
              <div className="text-xl drop-shadow-[0_0_10px_#f97316]">
                🪔
              </div>
            )}

            {item.type === "flower" && (
              <div className="text-lg drop-shadow-[0_0_8px_#f59e0b]">
                🌼
              </div>
            )}
          </div>
        ))}
      </div>

      {/* ─── 4. CORNER MOTIFS: BAMBOO SOOP (सूप), SUGARCANE & THEKUA ─── */}
      {/* Top Right: Sacred Chhath Soop with Thekua & Coconut */}
      <div
        className="pointer-events-none fixed top-14 right-2 z-10 opacity-25 hidden xl:block"
        aria-hidden="true"
      >
        <svg width="170" height="170" viewBox="0 0 200 200" fill="none">
          {/* Bamboo Soop Basket Base */}
          <path
            d="M40 70 L160 70 L145 160 C145 175 55 175 55 160 Z"
            fill="#d97706"
            fillOpacity="0.25"
            stroke="#f59e0b"
            strokeWidth="2.5"
          />
          {/* Soop Bamboo Weave Lines */}
          <line x1="50" y1="100" x2="150" y2="100" stroke="#fbbf24" strokeWidth="1" strokeDasharray="3 3" />
          <line x1="60" y1="130" x2="140" y2="130" stroke="#fbbf24" strokeWidth="1" strokeDasharray="3 3" />
          {/* Traditional Red/Orange Vermillion (Pila/Lal Sindoor) Stripe */}
          <path d="M100 65 L100 165" stroke="#ef4444" strokeWidth="4" strokeLinecap="round" />

          {/* Fresh Coconut (श्रीफल) */}
          <circle cx="100" cy="90" r="18" fill="#78350f" stroke="#fbbf24" strokeWidth="2" />
          <circle cx="100" cy="85" r="5" fill="#fef08a" />

          {/* Thekua Pieces in Soop */}
          <ellipse cx="75" cy="110" rx="14" ry="9" fill="#92400e" stroke="#f59e0b" strokeWidth="1.5" transform="rotate(-15 75 110)" />
          <ellipse cx="125" cy="110" rx="14" ry="9" fill="#92400e" stroke="#f59e0b" strokeWidth="1.5" transform="rotate(15 125 110)" />
          
          {/* Sugarcane stalks rising behind */}
          <path d="M25 180 L75 25" stroke="#16a34a" strokeWidth="3" strokeLinecap="round" />
          <path d="M175 180 L125 25" stroke="#16a34a" strokeWidth="3" strokeLinecap="round" />

          {/* Golden Sun rising in backdrop */}
          <circle cx="100" cy="40" r="16" fill="#f59e0b" fillOpacity="0.4" stroke="#fbbf24" strokeWidth="1.5" />
        </svg>
      </div>

      {/* Bottom Left: River Ganga Ghat with Floating Diya */}
      <div
        className="pointer-events-none fixed bottom-4 left-4 z-10 opacity-20 hidden xl:block"
        aria-hidden="true"
      >
        <div className="flex items-center gap-3">
          <span className="text-2xl animate-pulse">☀️</span>
          <div className="font-mono text-xs text-amber-300">
            <span className="block font-bold">छठ महापर्व · पटना</span>
            <span className="text-[10px] text-cream/70">CNLU Campus · Bihar</span>
          </div>
        </div>
      </div>

      {/* ─── 5. INTERACTIVE KHARNA & CHHATH MAHAPARV WIDGET (BOTTOM-RIGHT) ─── */}
      <aside
        aria-label="Chhath Mahaparv & Kharna Celebration"
        className="fixed bottom-5 right-5 z-40 hidden sm:flex flex-col items-end gap-2 select-none"
      >
        {/* Blessing Toast Popup */}
        {blessingToast && (
          <div className="bg-[#120722] border-2 border-amber-500/80 px-4 py-2.5 text-xs font-mono text-cream shadow-[4px_4px_0px_0px_#000000] max-w-xs animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="flex items-start gap-2">
              <Sun className="w-4 h-4 text-amber-400 shrink-0 mt-0.5 animate-spin" />
              <p className="leading-snug text-cream">{blessingToast}</p>
            </div>
          </div>
        )}

        {/* Sale pill — if still active */}
        {saleActive && (
          <Link
            href="/registration"
            className="flex items-center gap-2 px-3 py-1.5 bg-gold text-[#0b0714] font-black text-[10px] uppercase tracking-wider hover:bg-gold/90 transition-all border-2 border-black shadow-[3px_3px_0px_0px_#000000] whitespace-nowrap"
          >
            ☀️ Festive Sale · ₹1,000 — Claim Now →
          </Link>
        )}

        {/* Kharna & Chhath Mahaparv Main Card */}
        <div className="flex flex-col bg-[#0d0718]/95 border-2 border-amber-500/70 p-3 shadow-[5px_5px_0px_0px_#000000] backdrop-blur-md font-mono min-w-[260px]">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-white/10 pb-2 mb-2">
            <div className="flex items-center gap-2">
              <div
                className="w-7 h-7 rounded-none bg-gradient-to-tr from-amber-600 to-yellow-400 flex items-center justify-center border border-yellow-200 shadow-[0_0_8px_#f59e0b] cursor-pointer hover:scale-105 transition-transform"
                onClick={triggerArghya}
                title="Click to offer Surya Arghya!"
              >
                <Sun className="w-4 h-4 text-[#0b0714]" />
              </div>
              <div>
                <div className="text-amber-400 font-bold uppercase tracking-wider text-[11px] flex items-center gap-1">
                  <span>जय छठी मईया</span>
                  <span className="text-xs">☀️</span>
                </div>
                <div className="text-[9px] text-cream/60">
                  छठ महापर्व · खरना स्पेशल
                </div>
              </div>
            </div>

            <span className="text-[9px] text-amber-300/80 bg-amber-500/10 border border-amber-500/30 px-1.5 py-0.5">
              Patna, Bihar
            </span>
          </div>

          {/* Interactive Prasad & Arghya Action Buttons */}
          <div className="grid grid-cols-2 gap-1.5 mt-1">
            <button
              onClick={triggerThekuaPrasad}
              className="flex items-center justify-center gap-1.5 px-2 py-1.5 bg-amber-500/20 hover:bg-amber-500/30 border border-amber-400/50 text-amber-200 text-[10px] font-bold uppercase tracking-wider transition-colors cursor-pointer"
              title="Click to receive authentic Thekua Prasad"
            >
              <span>ठेकुआ लें</span>
              <span className="text-xs">🥮</span>
            </button>

            <button
              onClick={triggerArghya}
              className="flex items-center justify-center gap-1.5 px-2 py-1.5 bg-orange-600/20 hover:bg-orange-600/30 border border-orange-500/50 text-orange-200 text-[10px] font-bold uppercase tracking-wider transition-colors cursor-pointer"
              title="Click to offer Surya Arghya"
            >
              <span>अर्घ्य दें</span>
              <span className="text-xs">☀️</span>
            </button>
          </div>

          <div className="text-[9px] text-cream/50 text-center mt-2 italic">
            Ganga Ghat · CNLU Patna
          </div>
        </div>
      </aside>
    </>
  );
}
