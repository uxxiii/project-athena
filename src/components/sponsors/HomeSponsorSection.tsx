"use client";

import Link from "next/link";
import { ArrowRight, Download, Award, CheckCircle2, Phone, Mail, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/Button";
import {
  SPONSOR_METRICS,
  SPONSORSHIP_TIERS,
  SUMMIT_SPONSOR_CONFIG,
} from "@/data/sponsorship";

export function HomeSponsorSection() {
  return (
    <section id="sponsors" className="py-20 lg:py-24 bg-[#0d0718] border-b-2 border-white/10 relative overflow-hidden">
      {/* Decorative ambient background */}
      <div className="absolute top-1/4 right-0 w-96 h-96 bg-gold/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-10 left-0 w-80 h-80 bg-purple-deep/40 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-gold/10 border border-gold/30 text-gold text-xs font-mono font-bold uppercase tracking-widest shadow-[2px_2px_0px_0px_#000]">
              <Sparkles size={14} className="text-gold" />
              <span>Athena Summit 2026 Sponsorship</span>
            </div>
            <h2 className="font-heading text-3xl sm:text-5xl font-black text-cream tracking-tight uppercase leading-tight">
              Put Your Brand In Front of <span className="text-gold">500+</span> Future Leaders
            </h2>
            <p className="text-cream/70 text-sm sm:text-base leading-relaxed">
              Connect directly with ambitious students from Class 5 to 12, educators, debaters, and young innovators across two high-impact days at CNLU, Patna ({SUMMIT_SPONSOR_CONFIG.dates}).
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              href={SUMMIT_SPONSOR_CONFIG.brochureUrl}
              target="_blank"
              download="Athena-Summit-Sponsorship-Brochure.pdf"
            >
              <Button
                variant="outline"
                className="font-extrabold text-xs uppercase tracking-wider gap-2 border-2 border-white/20 bg-white/5 hover:bg-white/10 text-cream shadow-[3px_3px_0px_0px_#000000]"
              >
                <Download size={14} />
                <span>Download Brochure</span>
              </Button>
            </Link>
            <Link href="/sponsors">
              <Button className="font-extrabold text-xs uppercase tracking-wider gap-2 shadow-[3px_3px_0px_0px_#000000] hover:shadow-[5px_5px_0px_0px_#000000]">
                <span>Explore Packages</span>
                <ArrowRight size={14} />
              </Button>
            </Link>
          </div>
        </div>

        {/* Numbers & Traction Strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-14">
          {SPONSOR_METRICS.map((metric, idx) => (
            <div
              key={idx}
              className="p-5 border-2 border-white/10 bg-[#140b24] shadow-[3px_3px_0px_0px_#000000] hover:border-gold/40 transition-colors"
            >
              <p className="font-heading text-3xl sm:text-4xl font-black text-gold">
                {metric.value}
              </p>
              <p className="text-xs uppercase font-mono font-bold text-cream mt-1">
                {metric.label}
              </p>
              <p className="text-[11px] text-cream/50 mt-1 line-clamp-2">
                {metric.detail}
              </p>
            </div>
          ))}
        </div>

        {/* Tiers Preview Grid */}
        <div className="space-y-4 mb-12">
          <div className="flex items-center justify-between">
            <h3 className="font-mono text-xs uppercase tracking-widest text-gold font-bold flex items-center gap-2">
              <Award size={14} />
              <span>Sponsorship Packages Overview (5 Cumulative Tiers)</span>
            </h3>
            <Link
              href="/sponsors"
              className="text-xs font-mono font-bold text-cream/70 hover:text-gold flex items-center gap-1 uppercase transition-colors"
            >
              <span>Full Matrix</span>
              <ArrowRight size={12} />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {SPONSORSHIP_TIERS.map((tier) => (
              <div
                key={tier.id}
                className={`p-5 border-2 flex flex-col justify-between transition-all duration-200 relative ${
                  tier.popular
                    ? "bg-[#1f1136] border-gold shadow-[5px_5px_0px_0px_#000000]"
                    : "bg-[#140b24] border-white/10 hover:border-white/30 shadow-[3px_3px_0px_0px_#000000]"
                }`}
              >
                {tier.popular && (
                  <span className="absolute -top-3 left-4 bg-gold text-[#0b0714] text-[9px] font-mono font-black uppercase px-2 py-0.5 border border-black shadow-[1px_1px_0px_0px_#000]">
                    {tier.badge}
                  </span>
                )}
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-cream/50 block mb-1">
                    {tier.badge}
                  </span>
                  <h4 className="font-heading text-lg font-black text-cream uppercase">
                    {tier.name}
                  </h4>
                  <p className="font-heading text-xl font-black text-gold mt-1">
                    {tier.priceDisplay}
                  </p>
                  <p className="text-xs text-cream/65 mt-2.5 leading-relaxed min-h-[48px]">
                    {tier.shortDesc}
                  </p>

                  <div className="border-t border-white/10 my-3.5 pt-3 space-y-2">
                    {tier.cumulativeFrom && (
                      <p className="text-[10px] font-mono text-gold uppercase tracking-wider font-bold">
                        Includes all {tier.cumulativeFrom} perks +
                      </p>
                    )}
                    <ul className="space-y-1.5 text-xs text-cream/80">
                      {tier.deliverables.slice(tier.cumulativeFrom ? 1 : 0, 3).map((item, i) => (
                        <li key={i} className="flex items-start gap-1.5 text-[11px] leading-snug">
                          <CheckCircle2 size={13} className="text-gold shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <Link
                  href={`/sponsors?tier=${tier.id}`}
                  className="mt-4 pt-3 border-t border-white/10 block"
                >
                  <Button
                    variant={tier.popular ? "primary" : "outline"}
                    size="sm"
                    className="w-full text-xs font-bold uppercase tracking-wider shadow-[2px_2px_0px_0px_#000000]"
                  >
                    <span>Inquire</span>
                    <ArrowRight size={12} className="ml-1" />
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* Association & Quick Contact Bar */}
        <div className="p-6 border-2 border-white/15 bg-[#120a1f] shadow-[4px_4px_0px_0px_#000000] flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-1">
            <p className="text-[11px] font-mono uppercase tracking-widest text-gold font-bold">
              Organising Partners & Reach
            </p>
            <p className="text-xs sm:text-sm text-cream/80">
              Co-organised with{" "}
              <strong className="text-cream">Startly Innovations Pvt. Ltd.</strong> (Biotech & ISO Certified) & supported by{" "}
              <strong className="text-cream">ELDR. Debate Organisation</strong>.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <a
              href={`tel:${SUMMIT_SPONSOR_CONFIG.contacts.primaryPhone}`}
              className="inline-flex items-center gap-2 px-3.5 py-2 border-2 border-white/20 bg-white/5 hover:bg-white/10 text-xs font-mono font-bold text-cream transition-colors shadow-[2px_2px_0px_0px_#000]"
            >
              <Phone size={13} className="text-gold" />
              <span>{SUMMIT_SPONSOR_CONFIG.contacts.primaryPhone}</span>
            </a>
            <a
              href={`mailto:${SUMMIT_SPONSOR_CONFIG.contacts.email}?subject=Athena%20Summit%20Sponsorship%20Inquiry`}
              className="inline-flex items-center gap-2 px-3.5 py-2 border-2 border-white/20 bg-white/5 hover:bg-white/10 text-xs font-mono font-bold text-cream transition-colors shadow-[2px_2px_0px_0px_#000]"
            >
              <Mail size={13} className="text-gold" />
              <span>{SUMMIT_SPONSOR_CONFIG.contacts.email}</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
