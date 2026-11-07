"use client";

import { useEffect, useState } from "react";
import { Sparkles, CheckCircle2, X } from "lucide-react";

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
    }, 2000);
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
        {/* Background festive glow */}
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-amber-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-gold/20 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-cream/60 hover:text-gold transition-colors p-1"
          aria-label="Close mithai pop-up"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Festive Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/10 border border-amber-400/40 text-amber-300 text-xs font-mono font-bold uppercase tracking-widest shadow-[2px_2px_0px_0px_#000]">
          <span>🪔 Shubh Deepavali • Muh Meetha Kijiye!</span>
        </div>

        {/* Kaju Katli Visual Showcase with Phuljhadi & Crackers */}
        <div className="relative py-4 flex items-center justify-center">
          {/* Diyas & Sparking Phuljhadi flanking the mithai */}
          <div className="absolute left-4 sm:left-8 flex flex-col items-center">
            <span className="text-xl animate-bounce">🎇</span>
            <div className="text-2xl animate-pulse mt-1" role="img" aria-label="Diya">
              🪔
            </div>
            <span className="text-[10px] font-mono text-amber-300 font-bold uppercase mt-1">Shubh</span>
          </div>

          <div
            className="absolute right-4 sm:right-8 flex flex-col items-center"
            style={{ animationDelay: "0.4s" }}
          >
            <span className="text-xl animate-bounce">🎆</span>
            <div className="text-2xl animate-pulse mt-1" role="img" aria-label="Diya">
              🪔
            </div>
            <span className="text-[10px] font-mono text-amber-300 font-bold uppercase mt-1">Laabh</span>
          </div>

          {/* Rangoli base ring underneath Kaju Katli */}
          <div className="absolute w-44 h-44 rounded-full border border-gold/30 opacity-40 animate-spin" style={{ animationDuration: "25s" }}>
            <div className="absolute inset-2 rounded-full border border-dashed border-amber-400/40" />
          </div>

          {/* Diamond Kaju Katli Card */}
          <div className="relative group cursor-pointer z-10" onClick={() => setShowShimmer((s) => !s)}>
            {/* Soft outer golden glow */}
            <div className="absolute inset-0 bg-gold/40 blur-xl rounded-full scale-110 animate-pulse" />

            {/* The Signature Diamond (Kaju Katli) Shape */}
            <div
              className="relative w-28 h-28 sm:w-32 sm:h-32 transform rotate-45 border-2 border-amber-200/80 shadow-[4px_4px_16px_rgba(212,175,55,0.4)] transition-transform duration-500 hover:scale-105"
              style={{
                backgroundColor: "#e8dcbe", // cashew fudge hue
                backgroundImage:
                  "radial-gradient(circle at 30% 30%, #fdfcf7 0%, #e2d3b0 70%, #c9b48c 100%)",
              }}
            >
              {/* Chandi Ka Vark (Silver Foil) Overlay */}
              <div
                className={`absolute inset-2 border border-white/60 bg-gradient-to-tr from-transparent via-white/40 to-transparent transition-opacity duration-1000 ${
                  showShimmer ? "opacity-90" : "opacity-40"
                }`}
                style={{
                  clipPath: "polygon(10% 0, 100% 20%, 90% 100%, 0% 80%)",
                }}
              />

              {/* Sparkle icon at top center of diamond */}
              <div className="absolute inset-0 flex items-center justify-center -rotate-45">
                <Sparkles className="w-7 h-7 text-amber-700/70" />
              </div>
            </div>
          </div>
        </div>

        {/* Celebration Title & Copy */}
        <div className="space-y-2">
          <h3 className="text-2xl sm:text-3xl font-heading font-black uppercase text-cream tracking-tight">
            Here&apos;s Your <span className="text-gold">Kaju Katli</span>!
          </h3>
          <p className="text-xs sm:text-sm text-cream/80 font-sans max-w-sm mx-auto leading-relaxed">
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
            To ensure fair and impartial delegate assignment, your committee and portfolio are <strong>not shown on this public screen</strong>. The Secretariat is currently reviewing your payment screenshot. Once approved, your official Committee & Portfolio allocation along with background guides will be emailed to you directly.
          </p>
        </div>

        {/* Dismiss Button */}
        <div>
          <button
            onClick={onClose}
            className="w-full py-3 bg-gold text-[#0b0714] font-mono font-bold uppercase tracking-wider text-xs border border-black shadow-[4px_4px_0px_0px_#000000] hover:bg-gold/90 transition-all hover:translate-x-0.5 hover:translate-y-0.5"
          >
            Mithai Sweekar Karein & View Pass Summary →
          </button>
        </div>
      </div>
    </div>
  );
}

