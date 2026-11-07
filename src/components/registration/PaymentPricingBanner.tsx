"use client";

import { Check, ArrowRight, ShieldCheck, Sparkles } from "lucide-react";
import { REGISTRATION_FEE, isDiwaliSaleActive } from "@/lib/pricing";
import { DIWALI_PRICING } from "@/lib/diwali";

interface PaymentPricingBannerProps {
  isUnscRegistration?: boolean;
}

export function PaymentPricingBanner({}: PaymentPricingBannerProps = {}) {
  const isDiwaliOffer = isDiwaliSaleActive();
  const effectiveFee = isDiwaliOffer ? DIWALI_PRICING.SALE_FEE : REGISTRATION_FEE;

  return (
    <div className="bg-[#140b24] border-2 border-white/20 p-5 md:p-6 shadow-[4px_4px_0px_0px_#000000] relative space-y-5">
      {/* Offer Header Tag */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
        <div className="flex items-center gap-2">
          {isDiwaliOffer ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 border border-gold/40 bg-gradient-to-r from-amber-500/20 via-gold/30 to-amber-500/20 text-cream text-xs font-mono font-bold uppercase tracking-wider shadow-[2px_2px_0px_0px_#000000] animate-pulse">
              🪔 Diwali Dhamaka Early Bird Offer
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 border border-white/20 bg-[#0b0714] text-cream text-xs font-mono font-bold uppercase tracking-wider shadow-[2px_2px_0px_0px_#000000]">
              <Sparkles className="w-3.5 h-3.5 text-gold" />
              Official Athena Summit Delegate Pass
            </span>
          )}
        </div>
        <span className="text-xs font-mono text-gold/80">
          {isDiwaliOffer ? "Special ₹1,000 Flat Rate (Till 9 Nov Noon)" : "Flat Rate • All 6 Committees"}
        </span>
      </div>

      {/* Pricing Highlight Card */}
      <div className="grid gap-3 sm:grid-cols-2 pt-1">
        <div className="border-2 border-gold/40 bg-[#0b0714] p-4 relative shadow-[3px_3px_0px_0px_#000000]">
          <div className="absolute -top-2.5 right-3 bg-gold text-[#0b0714] text-[9px] font-black font-mono px-2 py-0.5 uppercase tracking-wider border border-black shadow-[1px_1px_0px_0px_#000]">
            {isDiwaliOffer ? "Festive Pricing" : "Registration Fee"}
          </div>

          <div className="flex items-center gap-2 text-cream text-xs font-mono font-bold uppercase tracking-wider">
            <Check className="w-4 h-4 text-emerald-400" />
            <span>Delegate Pass</span>
          </div>

          <div className="mt-3 flex items-baseline gap-3">
            <span className="text-3xl font-black text-cream font-heading tracking-tight">
              ₹{effectiveFee.toLocaleString("en-IN")}
            </span>
            {isDiwaliOffer && (
              <span className="text-sm text-cream/40 line-through font-mono">
                ₹{REGISTRATION_FEE.toLocaleString("en-IN")}
              </span>
            )}
            <span className="text-xs text-cream/50 font-mono">/ delegate</span>
          </div>

          {isDiwaliOffer ? (
            <p className="text-[11px] text-amber-300/90 mt-2 font-sans font-medium">
              ✨ Flat ₹300 discount active during the Diwali festive window (valid until 9th Nov, 12:00 PM IST).
            </p>
          ) : (
            <p className="text-[11px] text-cream/60 mt-2 font-sans">
              Covers comprehensive committee entry, background guides, delegate credentials, and official kits.
            </p>
          )}
        </div>

        <div className="border border-white/15 bg-[#0b0714]/60 p-4 flex flex-col justify-between">
          <div className="flex items-center gap-2 text-gold text-xs font-mono font-bold uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4 text-gold" />
            <span>All 6 Committees Covered</span>
          </div>

          <div className="text-xs text-cream/70 space-y-1.5 my-3 font-mono">
            <div className="flex items-center justify-between">
              <span>Lok Sabha / IP (Press)</span>
              <span className="text-gold font-bold">100 / 80 Cap</span>
            </div>
            <div className="flex items-center justify-between">
              <span>IPL / JPC</span>
              <span className="text-gold font-bold">60 / 60 Cap</span>
            </div>
            <div className="flex items-center justify-between">
              <span>UNSC / UNW</span>
              <span className="text-gold font-bold">60 / 60 Cap</span>
            </div>
          </div>

          <p className="text-[10px] text-cream/40 font-mono">
            Direct first-come allocation upon payment review.
          </p>
        </div>
      </div>

      {/* Total Amount Notice Banner */}
      <div className="bg-[#0b0714] p-3.5 border border-white/10 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <ArrowRight className="w-4 h-4 text-gold shrink-0" />
          <span className="text-cream/80">
            Total Payable Amount:{" "}
            <strong className="text-gold font-mono font-bold text-base">
              ₹{effectiveFee.toLocaleString("en-IN")}
            </strong>
          </span>
        </div>
        {isDiwaliOffer && (
          <span className="text-[10px] text-amber-300 font-mono font-bold uppercase bg-amber-500/10 px-2 py-0.5 border border-amber-500/20">
            Diwali Sale Active
          </span>
        )}
      </div>
    </div>
  );
}
