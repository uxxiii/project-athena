"use client";

import { useEffect, useState } from "react";
import { Tag, Flame, Check, ArrowRight } from "lucide-react";
import { PRICING_CONFIG, isEarlyBirdActive } from "@/lib/pricing";
import { EarlyBirdTimer } from "./EarlyBirdTimer";

interface PaymentPricingBannerProps {
  isUnscRegistration: boolean;
}

export function PaymentPricingBanner({ isUnscRegistration }: PaymentPricingBannerProps) {
  const [isEarly, setIsEarly] = useState(true);

  useEffect(() => {
    setIsEarly(isEarlyBirdActive());
  }, []);

  const currentSelection = isUnscRegistration ? PRICING_CONFIG.unsc : PRICING_CONFIG.normal;
  const otherSelection = isUnscRegistration ? PRICING_CONFIG.normal : PRICING_CONFIG.unsc;

  return (
    <div className="rounded-2xl border border-amber-500/30 bg-linear-to-b from-purple-dark via-[#130b24] to-purple-deep p-5 md:p-6 shadow-2xl relative overflow-hidden space-y-5">
      {/* Decorative background glow */}
      <div className="absolute -top-12 -right-12 w-44 h-44 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-12 -left-12 w-44 h-44 bg-purple-mid/20 rounded-full blur-3xl pointer-events-none" />

      {/* Offer Header Tag */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-amber-500/20 pb-4">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-linear-to-r from-amber-500 to-yellow-500 text-purple-dark text-xs font-bold uppercase tracking-wider font-mono shadow-md">
            <Flame className="w-3.5 h-3.5 fill-purple-dark" />
            {isEarly ? "Early Bird Special Sale" : "Standard Registration Rate"}
          </span>
          {isEarly && (
            <span className="text-xs text-amber-300 font-mono font-medium flex items-center gap-1">
              <Tag className="w-3 h-3" /> Save up to 25%
            </span>
          )}
        </div>
      </div>

      {/* Countdown Timer Widget */}
      <EarlyBirdTimer />

      {/* E-Commerce Pricing Highlight Cards Grid */}
      <div className="grid gap-3 md:grid-cols-2 pt-1">
        {/* Active Selected Tier Card */}
        <div className="rounded-xl border-2 border-amber-400/80 bg-amber-500/10 p-4 relative shadow-lg">
          <div className="absolute -top-2.5 right-3 bg-amber-400 text-purple-dark text-[9px] font-bold font-mono px-2 py-0.5 rounded-md uppercase tracking-wider">
            Selected Tier
          </div>

          <div className="flex items-center gap-2 text-amber-300 text-xs font-mono font-bold uppercase tracking-wider">
            <Check className="w-4 h-4 text-emerald-400" />
            <span>{currentSelection.label}</span>
          </div>

          <div className="mt-3 flex items-baseline gap-3">
            {isEarly ? (
              <>
                <span className="text-3xl font-extrabold text-cream font-heading tracking-tight">
                  ₹{currentSelection.earlyBirdPrice.toLocaleString("en-IN")}
                </span>
                <span className="text-sm font-semibold text-rose-400/80 line-through decoration-rose-500/80 decoration-2 font-mono">
                  ₹{currentSelection.normalPrice.toLocaleString("en-IN")}
                </span>
                <span className="ml-auto text-[10px] font-bold font-mono px-2 py-1 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  SAVE ₹{currentSelection.discountAmount} ({currentSelection.discountPercent}% OFF)
                </span>
              </>
            ) : (
              <span className="text-3xl font-extrabold text-cream font-heading tracking-tight">
                ₹{currentSelection.normalPrice.toLocaleString("en-IN")}
              </span>
            )}
          </div>

          <p className="text-[11px] text-cream/60 mt-2 font-sans">
            {isUnscRegistration
              ? "Covers registration fee for both delegates (Double Delegation)."
              : "Covers single delegate registration & delegate kit."}
          </p>
        </div>

        {/* Alternative Tier Card (For transparency / comparison) */}
        <div className="rounded-xl border border-gold/15 bg-purple-deep/40 p-4 opacity-80 hover:opacity-100 transition-opacity">
          <div className="text-cream/50 text-xs font-mono font-medium uppercase tracking-wider">
            {otherSelection.label}
          </div>

          <div className="mt-3 flex items-baseline gap-3">
            {isEarly ? (
              <>
                <span className="text-2xl font-bold text-cream/90 font-heading">
                  ₹{otherSelection.earlyBirdPrice.toLocaleString("en-IN")}
                </span>
                <span className="text-xs text-cream/40 line-through decoration-cream/40 font-mono">
                  ₹{otherSelection.normalPrice.toLocaleString("en-IN")}
                </span>
                <span className="ml-auto text-[9px] font-mono px-1.5 py-0.5 rounded bg-gold/10 text-gold/80 border border-gold/20">
                  SAVE ₹{otherSelection.discountAmount}
                </span>
              </>
            ) : (
              <span className="text-2xl font-bold text-cream/90 font-heading">
                ₹{otherSelection.normalPrice.toLocaleString("en-IN")}
              </span>
            )}
          </div>

          <p className="text-[11px] text-cream/40 mt-2 font-sans">
            {isUnscRegistration ? "Single delegate rate for normal committees" : "Rate for UNSC Double Delegation"}
          </p>
        </div>
      </div>

      {/* Total Amount Notice Banner */}
      <div className="rounded-xl bg-linear-to-r from-amber-500/20 via-gold/15 to-amber-500/20 p-3.5 border border-amber-500/30 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <ArrowRight className="w-4 h-4 text-amber-400 shrink-0" />
          <span className="text-cream/80">
            Total Payable Amount:{" "}
            <strong className="text-amber-300 font-mono font-bold text-sm">
              ₹{(isEarly ? currentSelection.earlyBirdPrice : currentSelection.normalPrice).toLocaleString("en-IN")}
            </strong>
          </span>
        </div>
        {isEarly && (
          <span className="hidden sm:inline-block text-[10px] font-mono uppercase tracking-wider text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/20">
            Early Bird Price Applied
          </span>
        )}
      </div>
    </div>
  );
}
