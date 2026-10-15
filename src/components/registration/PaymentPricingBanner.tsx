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
    <div className="bg-[#140b24] border-2 border-white/20 p-5 md:p-6 shadow-[4px_4px_0px_0px_#000000] relative space-y-5">
      {/* Offer Header Tag */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 border border-white/20 bg-[#0b0714] text-cream text-xs font-mono font-bold uppercase tracking-wider shadow-[2px_2px_0px_0px_#000000]">
            Standard Registration Rate
          </span>
        </div>
      </div>

      {/* E-Commerce Pricing Highlight Cards Grid */}
      <div className="grid gap-3 md:grid-cols-2 pt-1">
        {/* Active Selected Tier Card */}
        <div className="border-2 border-white/20 bg-[#0b0714] p-4 relative shadow-[3px_3px_0px_0px_#000000]">
          <div className="absolute -top-2.5 right-3 bg-gold text-[#0b0714] text-[9px] font-black font-mono px-2 py-0.5 uppercase tracking-wider border border-black shadow-[1px_1px_0px_0px_#000]">
            Selected Tier
          </div>

          <div className="flex items-center gap-2 text-cream text-xs font-mono font-bold uppercase tracking-wider">
            <Check className="w-4 h-4 text-emerald-400" />
            <span>{currentSelection.label}</span>
          </div>

          <div className="mt-3 flex items-baseline gap-3">
            <span className="text-3xl font-black text-cream font-heading tracking-tight">
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
        <div className="border border-white/15 bg-[#0b0714]/60 p-4 opacity-75 hover:opacity-100 transition-opacity">
          <div className="text-cream/50 text-xs font-mono font-bold uppercase tracking-wider">
            {otherSelection.label}
          </div>

          <div className="mt-3 flex items-baseline gap-3">
            <span className="text-2xl font-extrabold text-cream/80 font-heading">
              ₹{otherSelection.normalPrice.toLocaleString("en-IN")}
            </span>
          </div>

          <p className="text-[11px] text-cream/40 mt-2 font-sans">
            {isUnscRegistration ? "Single delegate rate for normal committees" : "Rate for UNSC Double Delegation"}
          </p>
        </div>
      </div>

      {/* Total Amount Notice Banner */}
      <div className="bg-[#0b0714] p-3.5 border border-white/10 flex items-center justify-between text-xs">
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
