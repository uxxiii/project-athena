"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, X } from "lucide-react";

interface KajuKatliModalProps {
  isOpen: boolean;
  onClose: () => void;
  delegateName?: string;
  registrationId?: string;
}

export function KajuKatliModal({
  isOpen,
  onClose,
  delegateName,
  registrationId,
}: KajuKatliModalProps) {
  const [showShimmer, setShowShimmer] = useState(true);

  useEffect(() => {
    if (!isOpen) return;
    const interval = setInterval(() => {
      setShowShimmer((s) => !s);
    }, 1800);
    return () => clearInterval(interval);
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300"
    >
      <div className="relative w-full max-w-lg bg-[#0b0714] border-2 border-gold p-6 md:p-8 shadow-[8px_8px_0px_0px_#d4af37] text-center space-y-6 overflow-hidden">
        {/* Background Chhath Sunrise Glow */}
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-orange-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-amber-500/20 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-cream/60 hover:text-gold transition-colors p-1"
          aria-label="Close Thekua Prasad modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Chhath Mahaparv Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1 bg-amber-500/15 border border-amber-400/50 text-amber-300 text-xs font-mono font-bold uppercase tracking-widest shadow-[2px_2px_0px_0px_#000]">
          <span>☀️ जय छठी मईया • छठ महापर्व का महाप्रसाद!</span>
        </div>

        {/* Traditional Bihari Thekua on Sacred Bamboo Soop Showcase */}
        <div className="relative py-3 flex items-center justify-center">
          {/* Left Sugarcane & Diya */}
          <div className="absolute left-3 sm:left-6 flex flex-col items-center">
            <span className="text-xl animate-bounce">🎋</span>
            <div className="text-2xl animate-pulse mt-1" role="img" aria-label="Diya">
              🪔
            </div>
            <span className="text-[10px] font-mono text-amber-300 font-bold uppercase mt-1">
              अर्घ्य
            </span>
          </div>

          {/* Right Sugarcane & Diya */}
          <div
            className="absolute right-3 sm:right-6 flex flex-col items-center"
            style={{ animationDelay: "0.4s" }}
          >
            <span className="text-xl animate-bounce">🎋</span>
            <div className="text-2xl animate-pulse mt-1" role="img" aria-label="Diya">
              🪔
            </div>
            <span className="text-[10px] font-mono text-amber-300 font-bold uppercase mt-1">
              महाप्रसाद
            </span>
          </div>

          {/* Golden Surya Halo Ring Underneath */}
          <div
            className="absolute w-44 h-44 rounded-full border border-amber-500/35 opacity-50 animate-spin"
            style={{ animationDuration: "28s" }}
          >
            <div className="absolute inset-2 rounded-full border border-dashed border-orange-400/40" />
          </div>

          {/* Authentic Bihari Thekua & Bamboo Soop SVG Art */}
          <div
            className="relative group cursor-pointer z-10"
            onClick={() => setShowShimmer((s) => !s)}
            title="Authentic Gur & Desi Ghee Bihari Thekua Prasad"
          >
            {/* Warm Gur & Ghee Golden Glow */}
            <div
              className={`absolute inset-0 bg-amber-500/35 blur-xl rounded-full transition-transform duration-700 ${
                showShimmer ? "scale-115 opacity-95" : "scale-100 opacity-65"
              }`}
            />

            <svg
              width="156"
              height="144"
              viewBox="0 0 180 165"
              fill="none"
              className="relative transition-transform duration-500 hover:scale-105 drop-shadow-[0_6px_16px_rgba(217,119,6,0.45)]"
            >
              <defs>
                {/* Bamboo Soop Gradient */}
                <linearGradient id="soopBase" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#eab308" />
                  <stop offset="50%" stopColor="#ca8a04" />
                  <stop offset="100%" stopColor="#854d0e" />
                </linearGradient>

                {/* Crispy Fried Gur Thekua Gradient */}
                <radialGradient id="thekuaCrust" cx="45%" cy="40%" r="55%">
                  <stop offset="0%" stopColor="#d97706" />
                  <stop offset="55%" stopColor="#92400e" />
                  <stop offset="90%" stopColor="#78350f" />
                  <stop offset="100%" stopColor="#451a03" />
                </radialGradient>

                <radialGradient id="thekuaSecond" cx="50%" cy="45%" r="55%">
                  <stop offset="0%" stopColor="#b45309" />
                  <stop offset="65%" stopColor="#78350f" />
                  <stop offset="100%" stopColor="#451a03" />
                </radialGradient>
              </defs>

              {/* ── Sacred Bamboo Soop (सूप) Tray ── */}
              <path
                d="M 22 38 L 158 38 L 146 136 C 144 152 36 152 34 136 Z"
                fill="url(#soopBase)"
                stroke="#fde047"
                strokeWidth="3"
              />
              {/* Bamboo Weave Texture */}
              <line x1="30" y1="65" x2="150" y2="65" stroke="#713f12" strokeWidth="1" strokeDasharray="5 3" strokeOpacity="0.55" />
              <line x1="33" y1="95" x2="147" y2="95" stroke="#713f12" strokeWidth="1" strokeDasharray="5 3" strokeOpacity="0.55" />
              <line x1="36" y1="125" x2="144" y2="125" stroke="#713f12" strokeWidth="1" strokeDasharray="5 3" strokeOpacity="0.55" />

              {/* Auspicious Red Sindoor (सिंदूर) Tikka Stripes on Soop Rim */}
              <line x1="45" y1="36" x2="45" y2="50" stroke="#ef4444" strokeWidth="4" strokeLinecap="round" />
              <line x1="90" y1="35" x2="90" y2="51" stroke="#ef4444" strokeWidth="4.5" strokeLinecap="round" />
              <line x1="135" y1="36" x2="135" y2="50" stroke="#ef4444" strokeWidth="4" strokeLinecap="round" />

              {/* ── Back Left & Right Companion Thekuas ── */}
              <g transform="translate(56, 76) rotate(-18)">
                <ellipse
                  cx="0"
                  cy="0"
                  rx="30"
                  ry="22"
                  fill="url(#thekuaSecond)"
                  stroke="#f59e0b"
                  strokeWidth="1.5"
                />
                <line x1="-18" y1="0" x2="18" y2="0" stroke="#fbbf24" strokeWidth="1.2" strokeOpacity="0.6" />
                <line x1="-8" y1="-9" x2="0" y2="0" stroke="#fbbf24" strokeWidth="1" strokeOpacity="0.5" />
                <line x1="-8" y1="9" x2="0" y2="0" stroke="#fbbf24" strokeWidth="1" strokeOpacity="0.5" />
              </g>

              <g transform="translate(124, 78) rotate(18)">
                <ellipse
                  cx="0"
                  cy="0"
                  rx="30"
                  ry="22"
                  fill="url(#thekuaSecond)"
                  stroke="#f59e0b"
                  strokeWidth="1.5"
                />
                <line x1="-18" y1="0" x2="18" y2="0" stroke="#fbbf24" strokeWidth="1.2" strokeOpacity="0.6" />
                <line x1="8" y1="-9" x2="0" y2="0" stroke="#fbbf24" strokeWidth="1" strokeOpacity="0.5" />
                <line x1="8" y1="9" x2="0" y2="0" stroke="#fbbf24" strokeWidth="1" strokeOpacity="0.5" />
              </g>

              {/* ── Centerpiece Hero Leaf-Shaped Sancha Thekua (ठेकुआ) ── */}
              <g transform="translate(90, 98)">
                {/* Scalloped / braided crispy edge of traditional Bihari Thekua */}
                <path
                  d="M -46 0 C -44 -22 -22 -34 0 -34 C 22 -34 44 -22 46 0 C 44 22 22 34 0 34 C -22 34 -44 22 -46 0 Z"
                  fill="url(#thekuaCrust)"
                  stroke="#fbbf24"
                  strokeWidth="2.2"
                />
                {/* Inner Sancha (Wooden Mould) Leaf & Floral Emboss Pattern */}
                <ellipse
                  cx="0"
                  cy="0"
                  rx="37"
                  ry="25"
                  fill="none"
                  stroke="#f59e0b"
                  strokeWidth="1"
                  strokeDasharray="4 2"
                  strokeOpacity="0.7"
                />
                {/* Central Leaf Stem Imprint */}
                <line x1="-28" y1="0" x2="28" y2="0" stroke="#fde047" strokeWidth="1.8" strokeLinecap="round" strokeOpacity="0.85" />
                {/* Leaf Veins (Sancha Pattern) */}
                <line x1="-14" y1="0" x2="-22" y2="-12" stroke="#fde047" strokeWidth="1.4" strokeLinecap="round" strokeOpacity="0.75" />
                <line x1="-14" y1="0" x2="-22" y2="12" stroke="#fde047" strokeWidth="1.4" strokeLinecap="round" strokeOpacity="0.75" />
                <line x1="0" y1="0" x2="-8" y2="-15" stroke="#fde047" strokeWidth="1.4" strokeLinecap="round" strokeOpacity="0.75" />
                <line x1="0" y1="0" x2="-8" y2="15" stroke="#fde047" strokeWidth="1.4" strokeLinecap="round" strokeOpacity="0.75" />
                <line x1="14" y1="0" x2="6" y2="-12" stroke="#fde047" strokeWidth="1.4" strokeLinecap="round" strokeOpacity="0.75" />
                <line x1="14" y1="0" x2="6" y2="12" stroke="#fde047" strokeWidth="1.4" strokeLinecap="round" strokeOpacity="0.75" />

                {/* White Coconut & Fennel (Saunf) Specks */}
                <circle cx="-18" cy="-5" r="1.5" fill="#fef9c3" fillOpacity="0.85" />
                <circle cx="10" cy="-7" r="1.3" fill="#fef9c3" fillOpacity="0.85" />
                <circle cx="19" cy="5" r="1.5" fill="#fef9c3" fillOpacity="0.85" />
                <circle cx="-6" cy="8" r="1.4" fill="#fef9c3" fillOpacity="0.85" />
              </g>
            </svg>
          </div>
        </div>

        {/* Celebration Title & Copy */}
        <div className="space-y-2">
          <h3 className="text-2xl sm:text-3xl font-heading font-black uppercase text-cream tracking-tight">
            Here&apos;s Your <span className="text-gold">Thekua Prasad</span>!
          </h3>
          <p className="text-[11px] font-mono text-amber-300/90 uppercase tracking-wider">
            खरना एवं छठ पूजा का शुद्ध गुड़-घी ठेकुआ महाप्रसाद 🥮🌾
          </p>
          <p className="text-xs sm:text-sm text-cream/80 font-sans max-w-sm mx-auto leading-relaxed pt-1">
            {delegateName ? `Congratulations ${delegateName}! ` : "Congratulations! "}
            Your registration submission has been safely recorded under ID{" "}
            <span className="font-mono font-bold text-gold">
              {registrationId || "ATHENA-REG"}
            </span>
            .
          </p>
        </div>

        {/* Verification Protocol Notice */}
        <div className="bg-[#140b24] border border-gold/30 p-3.5 text-left space-y-1.5 shadow-[2px_2px_0px_0px_#000]">
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-cream uppercase tracking-wide">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Allocation Notification Process</span>
          </div>
          <p className="text-[11px] text-cream/70 leading-normal font-sans">
            To ensure fair and impartial delegate assignment, your committee and portfolio are{" "}
            <strong>not shown on this public screen</strong>. The Secretariat is currently reviewing your payment screenshot. Once approved, your official Committee &amp; Portfolio allocation along with background guides will be emailed to you directly.
          </p>
        </div>

        {/* Dismiss Button */}
        <div>
          <button
            onClick={onClose}
            className="w-full py-3 bg-gold text-[#0b0714] font-mono font-bold uppercase tracking-wider text-xs border border-black shadow-[4px_4px_0px_0px_#000000] hover:bg-gold/90 transition-all hover:translate-x-0.5 hover:translate-y-0.5 cursor-pointer"
          >
            ठेकुआ प्रसाद स्वीकार करें &amp; View Pass Summary →
          </button>
        </div>
      </div>
    </div>
  );
}
