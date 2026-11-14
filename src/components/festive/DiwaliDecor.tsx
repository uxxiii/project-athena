"use client";

import { useEffect, useState } from "react";
import { isDiwaliSeason, getMsUntilChildrensDayEnd } from "@/lib/diwali";

/**
 * Children's Day (Bal Diwas — 14th November) Site-Wide Festive Revamp:
 * 1. Top Neo-Brutalist Colorful Paper Bunting Garland with Stars & Soaring Paper Airplanes
 * 2. Subtle Desktop Side Floating Trails (Paper Airplanes, Balloons, Stars & Young Diplomat Badges)
 * 3. Bottom Young Leaders & Children's Day Vector Illustration (Floating Balloons, Paper Airplanes,
 *    Open Books of Diplomacy, Young Leaders' Podium with Gavel & Trophy, and Chacha Nehru's Red Rose)
 * 4. Automatically unmounts at 12:00 midnight tonight (2026-11-14T23:59:59+05:30).
 */
export function DiwaliDecor() {
  const [active, setActive] = useState(false);

  useEffect(() => {
    const isNowActive = isDiwaliSeason();
    setActive(isNowActive);
    if (!isNowActive) return;

    const msRemaining = getMsUntilChildrensDayEnd();
    if (msRemaining <= 0) {
      setActive(false);
      return;
    }

    const expiryTimer = setTimeout(() => {
      setActive(false);
    }, msRemaining + 250);

    return () => clearTimeout(expiryTimer);
  }, []);

  if (!active) return null;

  const buntingColors = [
    "#38bdf8", // Sky Blue
    "#facc15", // Sunshine Gold
    "#fb7185", // Coral Rose
    "#34d399", // Emerald Mint
    "#a855f7", // Royal Purple
    "#fb923c", // Tangerine
  ];

  return (
    <div
      className="pointer-events-none fixed inset-0 z-40 overflow-hidden select-none"
      aria-hidden="true"
    >
      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          1. TOP CHILDREN'S DAY COLORFUL BUNTING GARLAND & PAPER AIRPLANES
         ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <div className="absolute top-0 left-0 right-0 flex justify-around items-start">
        {Array.from({ length: 18 }).map((_, i) => {
          const color = buntingColors[i % buntingColors.length];
          return (
            <div
              key={i}
              className="flex flex-col items-center"
              style={{
                animation: `gentleSway ${2.8 + (i % 4) * 0.4}s ease-in-out infinite alternate`,
              }}
            >
              {/* Pennant Triangle Flag */}
              <svg
                width="34"
                height="30"
                viewBox="0 0 34 30"
                className="drop-shadow-[2px_2px_0px_rgba(0,0,0,0.85)]"
              >
                <line x1="0" y1="1" x2="34" y2="1" stroke="#facc15" strokeWidth="2" />
                <polygon
                  points="3,2 31,2 17,27"
                  fill={color}
                  stroke="#0b0714"
                  strokeWidth="2"
                />
                <circle cx="17" cy="10" r="2.2" fill="#ffffff" opacity="0.85" />
              </svg>
              {/* Alternating hanging Star or Paper Plane charm */}
              {i % 3 === 0 && (
                <div className="-mt-1 text-[11px] drop-shadow-[0_2px_4px_rgba(250,204,21,0.65)] animate-pulse">
                  ⭐
                </div>
              )}
              {i % 5 === 2 && (
                <div className="-mt-1 text-[11px] drop-shadow-[0_2px_4px_rgba(56,189,248,0.65)]">
                  🎈
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          2. DESKTOP SIDE TRAILS (Paper Airplanes, Balloons & Stars)
         ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <div className="hidden xl:flex fixed left-3 top-1/3 flex-col items-center gap-6 opacity-75">
        <div
          className="w-8 h-8 rounded-none bg-[#140b24]/90 border-2 border-[#38bdf8] shadow-[2px_2px_0px_0px_#000] flex items-center justify-center text-sm"
          style={{ animation: "floatUpDown 3.5s ease-in-out infinite alternate" }}
        >
          🎈
        </div>
        <div className="w-[1px] h-10 bg-gradient-to-b from-[#38bdf8]/60 to-[#facc15]/60" />
        <div
          className="w-8 h-8 rounded-none bg-[#140b24]/90 border-2 border-[#facc15] shadow-[2px_2px_0px_0px_#000] flex items-center justify-center text-sm"
          style={{ animation: "floatUpDown 4.2s ease-in-out infinite alternate-reverse" }}
        >
          🚀
        </div>
        <div className="w-[1px] h-10 bg-gradient-to-b from-[#facc15]/60 to-[#fb7185]/60" />
        <div
          className="w-8 h-8 rounded-none bg-[#140b24]/90 border-2 border-[#fb7185] shadow-[2px_2px_0px_0px_#000] flex items-center justify-center text-sm"
          style={{ animation: "floatUpDown 3.8s ease-in-out infinite alternate" }}
        >
          🌹
        </div>
      </div>

      <div className="hidden xl:flex fixed right-3 top-1/3 flex-col items-center gap-6 opacity-75">
        <div
          className="w-8 h-8 rounded-none bg-[#140b24]/90 border-2 border-[#facc15] shadow-[2px_2px_0px_0px_#000] flex items-center justify-center text-sm"
          style={{ animation: "floatUpDown 3.9s ease-in-out infinite alternate" }}
        >
          🏆
        </div>
        <div className="w-[1px] h-10 bg-gradient-to-b from-[#facc15]/60 to-[#34d399]/60" />
        <div
          className="w-8 h-8 rounded-none bg-[#140b24]/90 border-2 border-[#34d399] shadow-[2px_2px_0px_0px_#000] flex items-center justify-center text-sm"
          style={{ animation: "floatUpDown 4.4s ease-in-out infinite alternate-reverse" }}
        >
          📚
        </div>
        <div className="w-[1px] h-10 bg-gradient-to-b from-[#34d399]/60 to-[#38bdf8]/60" />
        <div
          className="w-8 h-8 rounded-none bg-[#140b24]/90 border-2 border-[#38bdf8] shadow-[2px_2px_0px_0px_#000] flex items-center justify-center text-sm"
          style={{ animation: "floatUpDown 3.6s ease-in-out infinite alternate" }}
        >
          🎈
        </div>
      </div>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          3. BOTTOM CHILDREN'S DAY / YOUNG DIPLOMATS SKYLINE ILLUSTRATION
         ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <div className="fixed bottom-0 left-0 right-0 h-24 sm:h-28 pointer-events-none flex flex-col justify-end">
        <svg
          viewBox="0 0 1440 130"
          className="w-full h-full preserve-3d"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="cdBottomGlow" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#38bdf8" stopOpacity="0" />
              <stop offset="55%" stopColor="#a855f7" stopOpacity="0.12" />
              <stop offset="100%" stopColor="#0b0714" stopOpacity="0.92" />
            </linearGradient>
            <linearGradient id="goldRibbon" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#38bdf8" />
              <stop offset="25%" stopColor="#facc15" />
              <stop offset="50%" stopColor="#fb7185" />
              <stop offset="75%" stopColor="#34d399" />
              <stop offset="100%" stopColor="#a855f7" />
            </linearGradient>
          </defs>

          {/* Soft ambient base glow */}
          <rect x="0" y="20" width="1440" height="110" fill="url(#cdBottomGlow)" />

          {/* Dashed Paper-Airplane Flight Trajectory Across Screen */}
          <path
            d="M40,105 Q360,35 720,75 T1390,45"
            fill="none"
            stroke="#facc15"
            strokeWidth="1.5"
            strokeDasharray="6 6"
            opacity="0.45"
          />

          {/* Paper Airplane #1 (Left-Center Soaring) */}
          <g transform="translate(250, 56) rotate(-14)">
            <polygon
              points="0,12 34,0 18,16 14,24"
              fill="#38bdf8"
              stroke="#0b0714"
              strokeWidth="1.5"
            />
            <polygon points="0,12 34,0 14,13" fill="#bae6fd" />
          </g>

          {/* Paper Airplane #2 (Right-Center Soaring) */}
          <g transform="translate(1140, 48) rotate(-18)">
            <polygon
              points="0,12 34,0 18,16 14,24"
              fill="#facc15"
              stroke="#0b0714"
              strokeWidth="1.5"
            />
            <polygon points="0,12 34,0 14,13" fill="#fef08a" />
          </g>

          {/* Left Cluster: Colorful Floating Balloons & Open Book */}
          <g transform="translate(85, 38)">
            {/* Strings */}
            <path d="M12,34 Q15,55 22,78" stroke="#e2e8f0" strokeWidth="1.2" fill="none" opacity="0.7" />
            <path d="M36,28 Q32,52 24,78" stroke="#e2e8f0" strokeWidth="1.2" fill="none" opacity="0.7" />
            <path d="M58,38 Q45,58 26,78" stroke="#e2e8f0" strokeWidth="1.2" fill="none" opacity="0.7" />
            {/* Coral Balloon */}
            <ellipse cx="12" cy="20" rx="11" ry="14" fill="#fb7185" stroke="#0b0714" strokeWidth="1.5" />
            <ellipse cx="8" cy="15" rx="2.5" ry="4" fill="#ffe4e6" opacity="0.7" />
            {/* Gold Balloon */}
            <ellipse cx="36" cy="14" rx="12" ry="15" fill="#facc15" stroke="#0b0714" strokeWidth="1.5" />
            <ellipse cx="32" cy="9" rx="2.5" ry="4" fill="#fef9c3" opacity="0.8" />
            {/* Sky Balloon */}
            <ellipse cx="58" cy="24" rx="11" ry="14" fill="#38bdf8" stroke="#0b0714" strokeWidth="1.5" />
            <ellipse cx="54" cy="19" rx="2.5" ry="4" fill="#e0f2fe" opacity="0.75" />
          </g>

          {/* Center Emblem: Young Leaders' Diplomacy Podium, Red Rose & Star Crest */}
          <g transform="translate(650, 44)">
            {/* Radiant Glow Behind Podium */}
            <circle cx="70" cy="48" r="46" fill="#facc15" opacity="0.14" />
            {/* Open Book Base */}
            <path
              d="M25,74 Q48,65 70,74 Q92,65 115,74 L115,82 Q92,73 70,82 Q48,73 25,82 Z"
              fill="#f8fafc"
              stroke="#0b0714"
              strokeWidth="2"
            />
            {/* Golden Star Trophy / Gavel Crest */}
            <polygon
              points="70,18 75,32 90,32 78,41 82,55 70,46 58,55 62,41 50,32 65,32"
              fill="#facc15"
              stroke="#0b0714"
              strokeWidth="2"
            />
            {/* Twinkling Side Stars */}
            <circle cx="32" cy="36" r="3" fill="#38bdf8" />
            <circle cx="108" cy="36" r="3" fill="#fb7185" />
          </g>

          {/* Right Cluster: Floating Balloons & Graduation Stars */}
          <g transform="translate(1275, 38)">
            <path d="M14,36 Q20,56 28,78" stroke="#e2e8f0" strokeWidth="1.2" fill="none" opacity="0.7" />
            <path d="M38,26 Q35,52 30,78" stroke="#e2e8f0" strokeWidth="1.2" fill="none" opacity="0.7" />
            <path d="M60,34 Q48,56 32,78" stroke="#e2e8f0" strokeWidth="1.2" fill="none" opacity="0.7" />
            {/* Mint Balloon */}
            <ellipse cx="14" cy="22" rx="11" ry="14" fill="#34d399" stroke="#0b0714" strokeWidth="1.5" />
            <ellipse cx="10" cy="17" rx="2.5" ry="4" fill="#d1fae5" opacity="0.75" />
            {/* Purple Balloon */}
            <ellipse cx="38" cy="13" rx="12" ry="15" fill="#a855f7" stroke="#0b0714" strokeWidth="1.5" />
            <ellipse cx="34" cy="8" rx="2.5" ry="4" fill="#f3e8ff" opacity="0.75" />
            {/* Rose Balloon */}
            <ellipse cx="60" cy="21" rx="11" ry="14" fill="#fb7185" stroke="#0b0714" strokeWidth="1.5" />
            <ellipse cx="56" cy="16" rx="2.5" ry="4" fill="#ffe4e6" opacity="0.75" />
          </g>

          {/* Bottom Rainbow Neo-Brutalist Trim Bar */}
          <rect x="0" y="124" width="1440" height="6" fill="url(#goldRibbon)" />
        </svg>
      </div>

      <style jsx>{`
        @keyframes gentleSway {
          0% {
            transform: rotate(-3deg);
          }
          100% {
            transform: rotate(3deg);
          }
        }
        @keyframes floatUpDown {
          0% {
            transform: translateY(-4px);
          }
          100% {
            transform: translateY(5px);
          }
        }
      `}</style>
    </div>
  );
}
