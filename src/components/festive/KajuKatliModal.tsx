"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, X } from "lucide-react";
import { isDiwaliSeason, getMsUntilChildrensDayEnd } from "@/lib/diwali";

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
  const [isChildrensDayActive, setIsChildrensDayActive] = useState(false);

  useEffect(() => {
    const active = isDiwaliSeason();
    setIsChildrensDayActive(active);
    if (!active) return;
    const msRemaining = getMsUntilChildrensDayEnd();
    if (msRemaining <= 0) {
      setIsChildrensDayActive(false);
      return;
    }
    const timer = setTimeout(() => setIsChildrensDayActive(false), msRemaining + 250);
    return () => clearTimeout(timer);
  }, []);

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
        {/* Background Festive Glow */}
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-sky-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-gold/20 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-cream/60 hover:text-gold transition-colors p-1"
          aria-label="Close celebration modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Top Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1 bg-sky-500/15 border border-sky-400/50 text-sky-300 text-xs font-mono font-bold uppercase tracking-widest shadow-[2px_2px_0px_0px_#000]">
          <span>
            {isChildrensDayActive
              ? "🎈 Happy Children's Day • Young Diplomat Honour!"
              : "🏛️ Project Athena • Official Delegate Welcome!"}
          </span>
        </div>

        {/* Center Illustration */}
        <div className="relative py-3 flex items-center justify-center">
          {/* Left Floating Motif */}
          <div className="absolute left-3 sm:left-6 flex flex-col items-center">
            <span className="text-xl animate-bounce">
              {isChildrensDayActive ? "🎈" : "🏛️"}
            </span>
            <div className="text-2xl animate-pulse mt-1" role="img" aria-label="Rose">
              {isChildrensDayActive ? "🌹" : "⚖️"}
            </div>
            <span className="text-[10px] font-mono text-sky-300 font-bold uppercase mt-1">
              {isChildrensDayActive ? "Bal Diwas" : "Debate"}
            </span>
          </div>

          {/* Right Floating Motif */}
          <div
            className="absolute right-3 sm:right-6 flex flex-col items-center"
            style={{ animationDelay: "0.4s" }}
          >
            <span className="text-xl animate-bounce">
              {isChildrensDayActive ? "🚀" : "✨"}
            </span>
            <div className="text-2xl animate-pulse mt-1" role="img" aria-label="Trophy">
              🏆
            </div>
            <span className="text-[10px] font-mono text-gold font-bold uppercase mt-1">
              {isChildrensDayActive ? "Leader" : "Lead"}
            </span>
          </div>

          {/* Golden Halo Ring Underneath */}
          <div
            className="absolute w-44 h-44 rounded-full border border-sky-400/35 opacity-50 animate-spin"
            style={{ animationDuration: "28s" }}
          >
            <div className="absolute inset-2 rounded-full border border-dashed border-gold/40" />
          </div>

          {/* Young Diplomat Trophy, Paper Plane & Sweet Treat SVG */}
          <div className="relative z-10 transform hover:scale-105 transition-transform duration-300">
            <svg
              width="165"
              height="165"
              viewBox="0 0 200 200"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="drop-shadow-[0_12px_28px_rgba(56,189,248,0.35)]"
            >
              <defs>
                <radialGradient id="crestBg" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#1e1b4b" />
                  <stop offset="70%" stopColor="#120a1f" />
                  <stop offset="100%" stopColor="#0b0714" />
                </radialGradient>
                <linearGradient id="trophyGold" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#fef08a" />
                  <stop offset="50%" stopColor="#facc15" />
                  <stop offset="100%" stopColor="#ca8a04" />
                </linearGradient>
              </defs>

              {/* Outer Neo-Brutalist Badge Shield */}
              <circle
                cx="100"
                cy="100"
                r="76"
                fill="url(#crestBg)"
                stroke="#38bdf8"
                strokeWidth="4"
              />
              <circle
                cx="100"
                cy="100"
                r="68"
                fill="none"
                stroke="#facc15"
                strokeWidth="1.5"
                strokeDasharray="5 4"
              />

              {/* Open Book of Diplomacy Base */}
              <path
                d="M52,135 Q76,124 100,135 Q124,124 148,135 L148,145 Q124,134 100,145 Q76,134 52,145 Z"
                fill="#f8fafc"
                stroke="#0b0714"
                strokeWidth="2.5"
              />

              {/* Golden Young Leader Star Trophy */}
              <polygon
                points="100,48 110,74 138,74 115,90 124,117 100,101 76,117 85,90 62,74 90,74"
                fill="url(#trophyGold)"
                stroke="#0b0714"
                strokeWidth="2.5"
              />

              {/* Soaring Paper Airplane */}
              <g transform="translate(122, 42) rotate(-15)">
                <polygon
                  points="0,12 30,0 16,15 12,22"
                  fill="#38bdf8"
                  stroke="#0b0714"
                  strokeWidth="1.8"
                />
              </g>

              {/* Sparkles */}
              <circle
                cx="56"
                cy="62"
                r={showShimmer ? "4" : "2.5"}
                fill="#fb7185"
                className="transition-all duration-700"
              />
              <circle
                cx="144"
                cy="106"
                r={!showShimmer ? "4" : "2.5"}
                fill="#34d399"
                className="transition-all duration-700"
              />
            </svg>
          </div>
        </div>

        {/* Message */}
        <div className="space-y-2">
          <h3 className="text-2xl md:text-3xl font-heading font-bold text-gold">
            {isChildrensDayActive
              ? "Happy Children's Day, Young Leader! 🎈"
              : "Welcome to Athena Summit! 🏛️"}
          </h3>
          <p className="text-sm text-cream/85 font-sans max-w-md mx-auto leading-relaxed">
            {delegateName ? (
              <>
                Congratulations <span className="text-gold font-bold">{delegateName}</span>!{" "}
              </>
            ) : (
              "Congratulations! "
            )}
            Your registration for <span className="text-gold font-semibold">Athena Summit 2026</span> is confirmed.{" "}
            {isChildrensDayActive
              ? "On this special Bal Diwas (14th November), we celebrate your voice, courage, and leadership at the podium!"
              : "We look forward to welcoming you to the committee floor at CNLU, Patna!"}
          </p>
        </div>

        {/* Registration ID Box */}
        {registrationId && (
          <div className="bg-purple-dark/80 border border-gold/40 p-3 max-w-xs mx-auto">
            <div className="text-[10px] font-mono uppercase tracking-widest text-cream/50">
              Registration Reference ID
            </div>
            <div className="text-sm font-mono font-bold text-gold mt-0.5 select-all">
              {registrationId}
            </div>
          </div>
        )}

        {/* Action Button */}
        <div className="pt-2">
          <button
            onClick={onClose}
            className="w-full py-3 px-6 bg-gold hover:bg-gold-light text-[#0b0714] font-mono font-bold text-xs uppercase tracking-widest border-2 border-black shadow-[4px_4px_0px_0px_#000000] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[2px_2px_0px_0px_#000000] transition-all inline-flex items-center justify-center gap-2 cursor-pointer"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>
              {isChildrensDayActive
                ? "Accept Young Diplomat Honour 🎈"
                : "Continue to Dashboard"}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
