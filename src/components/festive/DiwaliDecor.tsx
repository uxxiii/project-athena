"use client";

import { useEffect, useRef, useState } from "react";
import { isDiwaliSeason } from "@/lib/diwali";

export function DiwaliDecor() {
  const [active, setActive] = useState(false);
  const [flameFlicker, setFlameFlicker] = useState(true);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const seasonActive = isDiwaliSeason();
    setActive(seasonActive);

    const flickerInterval = setInterval(() => {
      setFlameFlicker((f) => !f);
    }, 1100);

    return () => clearInterval(flickerInterval);
  }, []);

  // Background Chhath song playback at soft volume (no UI)
  useEffect(() => {
    if (!active) return;

    const audio = audioRef.current;
    if (!audio) return;

    audio.volume = 0.2; // Low, peaceful ambient volume

    const tryPlay = () => {
      if (!audio) return;
      audio.volume = 0.2;
      audio
        .play()
        .then(() => {
          removeInteractionListeners();
        })
        .catch(() => {
          // Autoplay blocked until first user interaction; listeners below will trigger it
        });
    };

    const events = ["click", "touchstart", "keydown", "pointerdown", "scroll"];

    const removeInteractionListeners = () => {
      events.forEach((evt) =>
        window.removeEventListener(evt, tryPlay, { capture: true })
      );
    };

    events.forEach((evt) =>
      window.addEventListener(evt, tryPlay, { capture: true, passive: true })
    );

    // Attempt immediate playback on site load
    tryPlay();

    return () => {
      removeInteractionListeners();
    };
  }, [active]);

  if (!active) return null;

  return (
    <>
      {/* Hidden Background Chhath Geet Audio (No UI, Low Volume) */}
      <audio
        ref={audioRef}
        src="/chhath-song.mp3"
        loop
        preload="auto"
        className="hidden"
        aria-hidden="true"
      />

      {/* ─── 1. TOP CHHATH GHAT TORAN: SUGARCANE, MANGO LEAVES, MARIGOLD & DIYAS ─── */}
      <div
        className="pointer-events-none fixed top-0 left-0 right-0 z-40 overflow-hidden h-8 sm:h-10"
        aria-hidden="true"
      >
        {/* Top Surya Arghya Golden-Saffron Line */}
        <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-amber-700 via-orange-500 via-yellow-400 to-amber-700 shadow-[0_0_14px_#f97316]" />

        {/* Hanging Marigold Scallop & Mango Leaf Garland SVG */}
        <svg
          className="w-full h-8 sm:h-10"
          viewBox="0 0 1440 44"
          preserveAspectRatio="none"
          fill="none"
        >
          <defs>
            <linearGradient id="marigoldGrad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#ea580c" />
              <stop offset="50%" stopColor="#facc15" />
              <stop offset="100%" stopColor="#ea580c" />
            </linearGradient>
          </defs>

          {/* Repeating Scalloped Marigold Garlands */}
          {Array.from({ length: 12 }).map((_, idx) => {
            const xStart = idx * 120;
            const xMid = xStart + 60;
            const xEnd = xStart + 120;
            return (
              <g key={idx}>
                {/* Garland Swag */}
                <path
                  d={`M ${xStart} 2 Q ${xMid} 30 ${xEnd} 2`}
                  stroke="url(#marigoldGrad)"
                  strokeWidth="3.5"
                  strokeDasharray="6 3"
                  fill="none"
                  opacity="0.85"
                />
                {/* Mango Leaf (Aam Pallav) at each knot */}
                <path
                  d={`M ${xStart} 2 L ${xStart - 4} 14 L ${xStart} 19 L ${xStart + 4} 14 Z`}
                  fill="#15803d"
                  stroke="#22c55e"
                  strokeWidth="0.7"
                />
                {/* Hanging Diya at center of every second swag */}
                {idx % 2 === 0 && (
                  <g transform={`translate(${xMid}, 18)`}>
                    <line x1="0" y1="-8" x2="0" y2="2" stroke="#f59e0b" strokeWidth="1" />
                    {/* Clay Diya Bowl */}
                    <path
                      d="M -7 3 Q 0 10 7 3 Z"
                      fill="#9a3412"
                      stroke="#f59e0b"
                      strokeWidth="1"
                    />
                    {/* Diya Flame */}
                    <ellipse
                      cx="0"
                      cy={flameFlicker ? "0" : "0.5"}
                      rx={flameFlicker ? "2.3" : "1.8"}
                      ry={flameFlicker ? "4" : "3.2"}
                      fill="#fde047"
                    />
                  </g>
                )}
              </g>
            );
          })}
        </svg>
      </div>

      {/* ─── 2. SIDE MARIGOLD LADI (VERTICAL GARLANDS ON DESKTOP EDGES) ─── */}
      <div
        className="pointer-events-none fixed top-10 left-2 bottom-24 z-20 hidden xl:flex flex-col items-center justify-between opacity-35"
        aria-hidden="true"
      >
        {Array.from({ length: 14 }).map((_, i) => (
          <div key={i} className="flex flex-col items-center">
            <div
              className={`w-2.5 h-2.5 rounded-full ${
                i % 2 === 0
                  ? "bg-orange-500 shadow-[0_0_6px_#f97316]"
                  : "bg-yellow-400 shadow-[0_0_5px_#facc15]"
              }`}
            />
            <div className="w-[1px] h-4 bg-amber-500/40" />
          </div>
        ))}
      </div>

      <div
        className="pointer-events-none fixed top-10 right-2 bottom-24 z-20 hidden xl:flex flex-col items-center justify-between opacity-35"
        aria-hidden="true"
      >
        {Array.from({ length: 14 }).map((_, i) => (
          <div key={i} className="flex flex-col items-center">
            <div
              className={`w-2.5 h-2.5 rounded-full ${
                i % 2 === 0
                  ? "bg-yellow-400 shadow-[0_0_5px_#facc15]"
                  : "bg-orange-500 shadow-[0_0_6px_#f97316]"
              }`}
            />
            <div className="w-[1px] h-4 bg-amber-500/40" />
          </div>
        ))}
      </div>

      {/* ─── 3. BOTTOM PATNA CHHATH GHAT SCENE (GANGA RIVER, STEPS, SUGARCANE, SOOP & FLOATING DIYAS) ─── */}
      <div
        className="pointer-events-none fixed bottom-0 left-0 right-0 z-30 overflow-hidden h-20 sm:h-28"
        aria-hidden="true"
      >
        {/* Warm Sunset/Sunrise Horizon Glow */}
        <div className="absolute inset-x-0 bottom-0 h-full bg-gradient-to-t from-[#1a0a2a]/90 via-orange-950/25 to-transparent" />

        <svg
          className="w-full h-full"
          viewBox="0 0 1440 120"
          preserveAspectRatio="none"
          fill="none"
        >
          <defs>
            {/* Surya Dev Arghya Sun Gradient */}
            <radialGradient id="suryaGlow" cx="50%" cy="100%" r="60%">
              <stop offset="0%" stopColor="#fde047" stopOpacity="0.85" />
              <stop offset="45%" stopColor="#f97316" stopOpacity="0.55" />
              <stop offset="100%" stopColor="#ea580c" stopOpacity="0" />
            </radialGradient>

            {/* River Ganga Water Gradient */}
            <linearGradient id="gangaWater" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#1e1b4b" stopOpacity="0.75" />
              <stop offset="100%" stopColor="#090514" stopOpacity="0.95" />
            </linearGradient>

            {/* Ghat Steps Gradient */}
            <linearGradient id="ghatStone" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#78350f" stopOpacity="0.85" />
              <stop offset="100%" stopColor="#451a03" stopOpacity="0.95" />
            </linearGradient>
          </defs>

          {/* ── Rising/Setting Arghya Surya Dev at Center Horizon ── */}
          <circle cx="720" cy="88" r="56" fill="url(#suryaGlow)" />
          <circle
            cx="720"
            cy="88"
            r="26"
            fill="#f59e0b"
            fillOpacity="0.7"
            stroke="#fde047"
            strokeWidth="1.5"
          />

          {/* ── Left Patna Ganga Ghat Steps (घाट की सीढ़ियाँ) ── */}
          <g>
            <polygon points="0,42 150,42 170,58 0,58" fill="url(#ghatStone)" stroke="#d97706" strokeWidth="0.8" strokeOpacity="0.5" />
            <polygon points="0,58 195,58 215,74 0,74" fill="url(#ghatStone)" stroke="#d97706" strokeWidth="0.8" strokeOpacity="0.5" />
            <polygon points="0,74 240,74 265,90 0,90" fill="url(#ghatStone)" stroke="#d97706" strokeWidth="0.8" strokeOpacity="0.5" />
            <polygon points="0,90 290,90 315,108 0,108" fill="url(#ghatStone)" stroke="#d97706" strokeWidth="0.8" strokeOpacity="0.5" />

            {/* Left Sugarcane Canopy (ईख का मंडप) */}
            <g transform="translate(55, 8)">
              <line x1="0" y1="75" x2="22" y2="5" stroke="#15803d" strokeWidth="3" strokeLinecap="round" />
              <line x1="12" y1="75" x2="25" y2="5" stroke="#16a34a" strokeWidth="2.8" strokeLinecap="round" />
              <line x1="44" y1="75" x2="22" y2="5" stroke="#15803d" strokeWidth="3" strokeLinecap="round" />
              <line x1="32" y1="75" x2="20" y2="5" stroke="#16a34a" strokeWidth="2.8" strokeLinecap="round" />
              {/* Sugarcane Leaves */}
              <path d="M 22 8 Q 5 -2 -8 10" stroke="#22c55e" strokeWidth="2" fill="none" />
              <path d="M 24 8 Q 42 -2 55 10" stroke="#22c55e" strokeWidth="2" fill="none" />
              <path d="M 22 14 Q 8 6 -4 18" stroke="#16a34a" strokeWidth="1.8" fill="none" />
              <path d="M 24 14 Q 38 6 50 18" stroke="#16a34a" strokeWidth="1.8" fill="none" />
              {/* Red Cloth Tie at Top */}
              <circle cx="23" cy="10" r="3.5" fill="#dc2626" />
            </g>

            {/* Left Bamboo Soop (सूप) with Thekua, Coconut & Fruits on Ghat Step */}
            <g transform="translate(145, 56)">
              {/* Bamboo Soop Base */}
              <path
                d="M 0 12 L 48 12 L 42 26 C 40 30 8 30 6 26 Z"
                fill="#b45309"
                stroke="#f59e0b"
                strokeWidth="1.5"
              />
              {/* Sindoor Markings on Soop */}
              <line x1="16" y1="13" x2="16" y2="26" stroke="#ef4444" strokeWidth="2" />
              <line x1="32" y1="13" x2="32" y2="26" stroke="#ef4444" strokeWidth="2" />
              {/* Coconut (नारियल) */}
              <circle cx="24" cy="12" r="7" fill="#78350f" stroke="#fbbf24" strokeWidth="1" />
              <circle cx="24" cy="10" r="2" fill="#ef4444" />
              {/* Thekua Prasad Stack */}
              <ellipse cx="11" cy="14" rx="6" ry="4" fill="#92400e" stroke="#fbbf24" strokeWidth="0.9" />
              <ellipse cx="13" cy="11" rx="5.5" ry="3.5" fill="#78350f" stroke="#f59e0b" strokeWidth="0.9" />
              <ellipse cx="37" cy="14" rx="6" ry="4" fill="#92400e" stroke="#fbbf24" strokeWidth="0.9" />
              {/* Lit Diya on Soop Corner */}
              <circle cx="44" cy="10" r="3" fill="#fde047" />
            </g>
          </g>

          {/* ── Right Patna Ganga Ghat Steps (घाट की सीढ़ियाँ) ── */}
          <g>
            <polygon points="1440,42 1290,42 1270,58 1440,58" fill="url(#ghatStone)" stroke="#d97706" strokeWidth="0.8" strokeOpacity="0.5" />
            <polygon points="1440,58 1245,58 1225,74 1440,74" fill="url(#ghatStone)" stroke="#d97706" strokeWidth="0.8" strokeOpacity="0.5" />
            <polygon points="1440,74 1200,74 1175,90 1440,90" fill="url(#ghatStone)" stroke="#d97706" strokeWidth="0.8" strokeOpacity="0.5" />
            <polygon points="1440,90 1150,90 1125,108 1440,108" fill="url(#ghatStone)" stroke="#d97706" strokeWidth="0.8" strokeOpacity="0.5" />

            {/* Right Sugarcane Canopy (ईख का मंडप) */}
            <g transform="translate(1335, 8)">
              <line x1="0" y1="75" x2="22" y2="5" stroke="#15803d" strokeWidth="3" strokeLinecap="round" />
              <line x1="12" y1="75" x2="25" y2="5" stroke="#16a34a" strokeWidth="2.8" strokeLinecap="round" />
              <line x1="44" y1="75" x2="22" y2="5" stroke="#15803d" strokeWidth="3" strokeLinecap="round" />
              <line x1="32" y1="75" x2="20" y2="5" stroke="#16a34a" strokeWidth="2.8" strokeLinecap="round" />
              {/* Sugarcane Leaves */}
              <path d="M 22 8 Q 5 -2 -8 10" stroke="#22c55e" strokeWidth="2" fill="none" />
              <path d="M 24 8 Q 42 -2 55 10" stroke="#22c55e" strokeWidth="2" fill="none" />
              <path d="M 22 14 Q 8 6 -4 18" stroke="#16a34a" strokeWidth="1.8" fill="none" />
              <path d="M 24 14 Q 38 6 50 18" stroke="#16a34a" strokeWidth="1.8" fill="none" />
              <circle cx="23" cy="10" r="3.5" fill="#dc2626" />
            </g>

            {/* Right Bamboo Daura & Soop with Thekua & Banana Cluster */}
            <g transform="translate(1240, 56)">
              <path
                d="M 0 12 L 48 12 L 42 26 C 40 30 8 30 6 26 Z"
                fill="#b45309"
                stroke="#f59e0b"
                strokeWidth="1.5"
              />
              <line x1="16" y1="13" x2="16" y2="26" stroke="#ef4444" strokeWidth="2" />
              <line x1="32" y1="13" x2="32" y2="26" stroke="#ef4444" strokeWidth="2" />
              <circle cx="24" cy="12" r="7" fill="#78350f" stroke="#fbbf24" strokeWidth="1" />
              <circle cx="24" cy="10" r="2" fill="#ef4444" />
              <ellipse cx="11" cy="14" rx="6" ry="4" fill="#92400e" stroke="#fbbf24" strokeWidth="0.9" />
              <ellipse cx="37" cy="14" rx="6" ry="4" fill="#92400e" stroke="#fbbf24" strokeWidth="0.9" />
              <ellipse cx="35" cy="11" rx="5.5" ry="3.5" fill="#78350f" stroke="#f59e0b" strokeWidth="0.9" />
              <circle cx="4" cy="10" r="3" fill="#fde047" />
            </g>
          </g>

          {/* ── River Ganga Flowing Water & Golden Reflections ── */}
          <path
            d="M 0 88 Q 360 82 720 88 T 1440 88 L 1440 120 L 0 120 Z"
            fill="url(#gangaWater)"
          />

          {/* Shimmering Surya Reflection Ripples on Ganga */}
          <ellipse cx="720" cy="96" rx="65" ry="2.5" fill="#fde047" fillOpacity="0.45" />
          <ellipse cx="720" cy="104" rx="48" ry="2" fill="#f97316" fillOpacity="0.4" />
          <ellipse cx="720" cy="112" rx="30" ry="1.5" fill="#fde047" fillOpacity="0.35" />

          {/* Gentle River Wave Lines */}
          <path
            d="M 180 98 Q 260 94 340 98 T 500 98"
            stroke="#fbbf24"
            strokeWidth="1"
            strokeOpacity="0.3"
            fill="none"
          />
          <path
            d="M 940 100 Q 1020 96 1100 100 T 1260 100"
            stroke="#fbbf24"
            strokeWidth="1"
            strokeOpacity="0.3"
            fill="none"
          />

          {/* ── Floating Diyas (दीपदान) on River Ganga ── */}
          {[
            { x: 250, y: 97, scale: 0.9 },
            { x: 390, y: 105, scale: 1.05 },
            { x: 540, y: 96, scale: 0.85 },
            { x: 645, y: 107, scale: 1.1 },
            { x: 795, y: 106, scale: 1.1 },
            { x: 910, y: 96, scale: 0.85 },
            { x: 1055, y: 105, scale: 1.05 },
            { x: 1190, y: 97, scale: 0.9 },
          ].map((diya, i) => (
            <g
              key={i}
              transform={`translate(${diya.x}, ${diya.y}) scale(${diya.scale})`}
            >
              {/* Water Glow Reflection under Diya */}
              <ellipse
                cx="0"
                cy="6"
                rx="11"
                ry="2.5"
                fill="#f59e0b"
                fillOpacity={flameFlicker ? "0.45" : "0.25"}
              />
              {/* Earthen Clay Diya Boat */}
              <path
                d="M -9 0 Q 0 8 9 0 Z"
                fill="#9a3412"
                stroke="#f59e0b"
                strokeWidth="1"
              />
              {/* Glowing Flame */}
              <path
                d="M 0 -9 C 3 -5 3 -1 0 0 C -3 -1 -3 -5 0 -9 Z"
                fill="#fde047"
              />
              <circle
                cx="0"
                cy="-3"
                r={flameFlicker ? "2" : "1.4"}
                fill="#ffffff"
              />
            </g>
          ))}
        </svg>
      </div>
    </>
  );
}
