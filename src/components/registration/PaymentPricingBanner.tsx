"use client";

import { Check, ArrowRight } from "lucide-react";
import { PRICING_CONFIG } from "@/lib/pricing";

interface PaymentPricingBannerProps {
  isUnscRegistration: boolean;
}

export function PaymentPricingBanner({ isUnscRegistration }: PaymentPricingBannerProps) {
  const currentSelection = isUnscRegistration ? PRICING_CONFIG.unsc : PRICING_CONFIG.normal;
  const otherSelection = isUnscRegistration ? PRICING_CONFIG.normal : PRICING_CONFIG.unsc;

  return (
    <div className="rounded-2xl glass-card p-5 md:p-6 shadow-2xl relative overflow-hidden space-y-5">
      {/* Decorative background glow */}
      <div className="absolute -top-12 -right-12 w-44 h-44 bg-gold/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-12 -left-12 w-44 h-44 bg-purple-mid/20 rounded-full blur-3xl pointer-events-none" />

      {/* Offer Header Tag */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gold/15 pb-4">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-gold/30 bg-purple-dark/80 text-gold-light text-xs font-medium uppercase tracking-wider font-mono shadow-sm">
            Standard Registration Rate
          </span>
        </div>
      </div>

      {/* E-Commerce Pricing Highlight Cards Grid */}
      <div className="grid gap-3 md:grid-cols-2 pt-1">
        {/* Active Selected Tier Card */}
        <div className="rounded-xl border border-gold/40 bg-purple-dark/70 p-4 relative shadow-lg">
          <div className="absolute -top-2.5 right-3 bg-gold text-purple-deep text-[9px] font-bold font-mono px-2 py-0.5 rounded-md uppercase tracking-wider">
            Selected Tier
          </div>

          <div className="flex items-center gap-2 text-gold text-xs font-mono font-bold uppercase tracking-wider">
            <Check className="w-4 h-4 text-emerald-400" />
            <span>{currentSelection.label}</span>
          </div>

          <div className="mt-3 flex items-baseline gap-3">
            <span className="text-3xl font-extrabold text-cream font-heading tracking-tight">
              ₹{currentSelection.normalPrice.toLocaleString("en-IN")}
            </span>
          </div>

          <p className="text-[11px] text-cream/60 mt-2 font-sans">
            {isUnscRegistration
              ? "Covers registration fee for both delegates (Double Delegation)."
              : "Covers single delegate registration & delegate kit."}
          </p>
        </div>

        {/* Alternative Tier Card */}
        <div className="rounded-xl border border-gold/15 bg-purple-deep/40 p-4 opacity-80 hover:opacity-100 transition-opacity">
          <div className="text-cream/50 text-xs font-mono font-medium uppercase tracking-wider">
            {otherSelection.label}
          </div>

          <div className="mt-3 flex items-baseline gap-3">
            <span className="text-2xl font-bold text-cream/90 font-heading">
              ₹{otherSelection.normalPrice.toLocaleString("en-IN")}
            </span>
          </div>

          <p className="text-[11px] text-cream/40 mt-2 font-sans">
            {isUnscRegistration ? "Single delegate rate for normal committees" : "Rate for UNSC Double Delegation"}
          </p>
        </div>
      </div>

      {/* Total Amount Notice Banner */}
      <div className="rounded-xl bg-purple-deep/70 p-3.5 border border-gold/20 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <ArrowRight className="w-4 h-4 text-gold shrink-0" />
          <span className="text-cream/80">
            Total Payable Amount:{" "}
            <strong className="text-gold font-mono font-bold text-sm">
              ₹{currentSelection.normalPrice.toLocaleString("en-IN")}
            </strong>
          </span>
        </div>
      </div>
    </div>
  );
}
