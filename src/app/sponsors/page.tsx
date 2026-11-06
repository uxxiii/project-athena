"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  Download,
  CheckCircle2,
  Phone,
  Mail,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Send,
  Building2,
  Users2,
  Calendar,
  MapPin,
  ExternalLink,
  MessageSquare,
} from "lucide-react";
import { Button } from "@/components/ui/Button";

function InstagramIcon({ size = 18, className = "" }: { size?: number; className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}
import {
  SUMMIT_SPONSOR_CONFIG,
  SPONSOR_METRICS,
  SPONSORSHIP_TIERS,
  SPONSOR_WHY_US,
} from "@/data/sponsorship";

function SponsorsPageContent() {
  const searchParams = useSearchParams();
  const initialTier = searchParams.get("tier") || "bloom";

  const [selectedTierId, setSelectedTierId] = useState<string>(initialTier);
  const [formData, setFormData] = useState({
    companyName: "",
    contactPerson: "",
    email: "",
    phone: "",
    tier: initialTier,
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const tierFromUrl = searchParams.get("tier");
    if (tierFromUrl && SPONSORSHIP_TIERS.some((t) => t.id === tierFromUrl)) {
      setSelectedTierId(tierFromUrl);
      setFormData((prev) => ({ ...prev, tier: tierFromUrl }));
    }
  }, [searchParams]);

  const activeTier =
    SPONSORSHIP_TIERS.find((t) => t.id === selectedTierId) || SPONSORSHIP_TIERS[2];

  const handleTierSelect = (id: string) => {
    setSelectedTierId(id);
    setFormData((prev) => ({ ...prev, tier: id }));
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (name === "tier") {
      setSelectedTierId(value);
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    // Prepare WhatsApp message url as fallback / direct connection
    const textMsg = encodeURIComponent(
      `Hello Athena Team! I am interested in partnering with Athena Summit 2026.\n\n` +
      `🏢 Organization: ${formData.companyName}\n` +
      `👤 Contact Person: ${formData.contactPerson}\n` +
      `📞 Phone: ${formData.phone}\n` +
      `✉️ Email: ${formData.email}\n` +
      `🏷️ Preferred Tier: ${activeTier.name} (${activeTier.priceDisplay})\n` +
      `💬 Message: ${formData.message || "Looking forward to receiving the sponsorship details."}`
    );

    // Simulated short delay for crisp UX
    await new Promise((r) => setTimeout(r, 600));
    setSubmitting(false);
    setSubmitted(true);

    // Open WhatsApp link in new tab for direct communication
    const cleanPhone = SUMMIT_SPONSOR_CONFIG.contacts.primaryPhone.replace(/\D/g, "");
    window.open(`https://wa.me/${cleanPhone}?text=${textMsg}`, "_blank");
  };

  return (
    <div className="min-h-screen bg-[#0b0714] text-cream">
      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          HERO SECTION
         ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section className="relative pt-32 sm:pt-40 pb-20 border-b-2 border-white/10 overflow-hidden neo-grid-bg">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-purple-deep/50 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-gold/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="max-w-3xl space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-gold/10 border-2 border-gold/40 text-gold text-xs font-mono font-bold uppercase tracking-widest shadow-[3px_3px_0px_0px_#000]">
              <Sparkles size={14} className="text-gold" />
              <span>Sponsorship & Brand Partnership Deck</span>
            </div>

            <h1 className="font-heading text-4xl sm:text-6xl font-black text-cream tracking-tight uppercase leading-[1.08]">
              Put Your Brand In Front of <span className="text-gold">500+</span> Future Leaders
            </h1>

            <p className="text-cream/80 text-base sm:text-lg leading-relaxed">
              Partner with <strong className="text-white font-bold">{SUMMIT_SPONSOR_CONFIG.eventName}</strong> — 
              a 2-day summit bringing together students from Class 5 to 12 across Bihar and beyond for diplomacy, entrepreneurship, and public discourse.
            </p>

            {/* Quick Summit Badges */}
            <div className="flex flex-wrap items-center gap-3 pt-2 text-xs font-mono font-bold text-cream/90">
              <span className="flex items-center gap-1.5 px-3 py-1.5 bg-[#170e28] border-2 border-white/15 shadow-[2px_2px_0px_0px_#000]">
                <Calendar size={14} className="text-gold" />
                <span>{SUMMIT_SPONSOR_CONFIG.dates}</span>
              </span>
              <span className="flex items-center gap-1.5 px-3 py-1.5 bg-[#170e28] border-2 border-white/15 shadow-[2px_2px_0px_0px_#000]">
                <MapPin size={14} className="text-gold" />
                <span>{SUMMIT_SPONSOR_CONFIG.location}</span>
              </span>
              <span className="flex items-center gap-1.5 px-3 py-1.5 bg-[#170e28] border-2 border-white/15 shadow-[2px_2px_0px_0px_#000]">
                <Users2 size={14} className="text-gold" />
                <span>{SUMMIT_SPONSOR_CONFIG.delegatesTarget} Delegates</span>
              </span>
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-4 pt-4">
              <a
                href={SUMMIT_SPONSOR_CONFIG.brochureUrl}
                download="Athena-Summit-Sponsorship-Brochure.pdf"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button className="font-extrabold text-xs uppercase tracking-wider px-6 py-3.5 gap-2 shadow-[4px_4px_0px_0px_#000000] hover:shadow-[6px_6px_0px_0px_#000000]">
                  <Download size={15} />
                  <span>Download Sponsorship Deck</span>
                </Button>
              </a>

              <a href="#packages">
                <Button
                  variant="outline"
                  className="font-extrabold text-xs uppercase tracking-wider px-6 py-3.5 gap-2 border-2 border-white/20 bg-white/5 hover:bg-white/10 text-cream shadow-[3px_3px_0px_0px_#000000]"
                >
                  <span>Compare Packages</span>
                  <ArrowRight size={15} />
                </Button>
              </a>

              <a href="#inquiry">
                <Button
                  variant="outline"
                  className="font-extrabold text-xs uppercase tracking-wider px-6 py-3.5 gap-2 border-2 border-gold/40 bg-gold/10 hover:bg-gold/20 text-gold shadow-[3px_3px_0px_0px_#000000]"
                >
                  <MessageSquare size={15} />
                  <span>Quick Inquiry</span>
                </Button>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          TRACTION & METRICS STRIP
         ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section className="py-12 border-b-2 border-white/10 bg-[#120a1f]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
            {SPONSOR_METRICS.map((metric, i) => (
              <div
                key={i}
                className="p-6 border-2 border-white/15 bg-[#170e28] shadow-[4px_4px_0px_0px_#000000]"
              >
                <p className="font-heading text-4xl sm:text-5xl font-black text-gold">
                  {metric.value}
                </p>
                <p className="text-xs uppercase font-mono font-bold text-cream mt-2 tracking-wider">
                  {metric.label}
                </p>
                <p className="text-xs text-cream/60 mt-1 leading-relaxed">
                  {metric.detail}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          WHY SPONSOR ATHENA?
         ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section className="py-20 lg:py-24 border-b-2 border-white/10 bg-[#0d0718]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-2xl mb-14 space-y-3">
            <span className="text-xs font-mono font-bold text-gold uppercase tracking-widest block">
              Value Proposition
            </span>
            <h2 className="font-heading text-3xl sm:text-4xl font-black text-cream uppercase">
              Why Partner With Project Athena?
            </h2>
            <p className="text-cream/70 text-sm sm:text-base leading-relaxed">
              Athena offers purpose-aligned partnerships built around education, youth enterprise, and tangible social impact.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {SPONSOR_WHY_US.map((item, idx) => (
              <div
                key={idx}
                className="p-8 border-2 border-white/15 bg-[#140b24] shadow-[4px_4px_0px_0px_#000000] space-y-3 hover:border-gold/40 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="font-mono text-sm font-black text-gold bg-gold/10 px-2.5 py-1 border border-gold/30">
                    0{idx + 1}
                  </span>
                  <h3 className="font-heading text-xl font-black text-cream uppercase">
                    {item.title}
                  </h3>
                </div>
                <p className="text-xs sm:text-sm text-cream/75 leading-relaxed pl-1">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>

          {/* Co-Organisers Callout */}
          <div className="mt-12 p-6 sm:p-8 border-2 border-white/20 bg-[#160d2a] shadow-[5px_5px_0px_0px_#000000]">
            <h3 className="font-mono text-xs uppercase tracking-widest text-gold font-bold mb-4 flex items-center gap-2">
              <ShieldCheck size={16} />
              <span>Academic & Logistical Credentials</span>
            </h3>
            <div className="grid sm:grid-cols-2 gap-6">
              {SUMMIT_SPONSOR_CONFIG.coOrganizers.map((org, i) => (
                <div key={i} className="space-y-1.5 border-l-2 border-gold/40 pl-4">
                  <span className="text-[10px] font-mono uppercase text-gold font-bold">
                    {org.role}
                  </span>
                  <h4 className="font-heading text-lg font-black text-cream">
                    {org.name}
                  </h4>
                  <p className="text-xs text-cream/70 leading-relaxed">
                    {org.note}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          INTERACTIVE PACKAGES & TIERS MATRIX
         ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section id="packages" className="py-20 lg:py-24 border-b-2 border-white/10 bg-[#0b0714] neo-grid-bg">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div className="space-y-3 max-w-2xl">
              <span className="text-xs font-mono font-bold text-gold uppercase tracking-widest block">
                Sponsorship Packages
              </span>
              <h2 className="font-heading text-3xl sm:text-5xl font-black text-cream uppercase">
                Five Cumulative Tiers
              </h2>
              <p className="text-cream/70 text-sm sm:text-base leading-relaxed">
                Starting at ₹10,000 up to ₹90,000. Each higher tier includes every single benefit of the tiers below it, plus premium on-ground, digital, and stage privileges.
              </p>
            </div>

            <div className="shrink-0">
              <a
                href={SUMMIT_SPONSOR_CONFIG.brochureUrl}
                download="Athena-Summit-Sponsorship-Brochure.pdf"
                className="inline-flex items-center gap-2 px-4 py-2 border-2 border-white/20 bg-white/5 hover:bg-white/10 text-xs font-mono font-bold uppercase text-cream transition-colors shadow-[2px_2px_0px_0px_#000]"
              >
                <Download size={14} className="text-gold" />
                <span>Download PDF Deck</span>
              </a>
            </div>
          </div>

          {/* Tier Selection Buttons */}
          <div className="flex flex-wrap gap-2.5 mb-8">
            {SPONSORSHIP_TIERS.map((tier) => {
              const isSelected = tier.id === selectedTierId;
              return (
                <button
                  key={tier.id}
                  onClick={() => handleTierSelect(tier.id)}
                  className={`px-4 py-2.5 text-xs font-mono font-black uppercase tracking-wider border-2 transition-all duration-150 flex items-center gap-2 ${
                    isSelected
                      ? "bg-gold text-[#0b0714] border-black shadow-[3px_3px_0px_0px_#000000]"
                      : "bg-[#140b24] text-cream/80 border-white/20 hover:border-white/40 shadow-[2px_2px_0px_0px_#000000]"
                  }`}
                >
                  <span>{tier.name}</span>
                  <span className={`text-[10px] ${isSelected ? "text-black/80" : "text-gold"}`}>
                    ({tier.priceDisplay})
                  </span>
                </button>
              );
            })}
          </div>

          {/* Detailed Active Tier Feature Showcase */}
          <div className="p-8 sm:p-10 border-2 border-gold bg-[#150c26] shadow-[6px_6px_0px_0px_#000000] mb-12 relative overflow-hidden">
            <div className="absolute top-0 right-0 px-4 py-1.5 bg-gold text-[#0b0714] font-mono text-xs font-black uppercase border-b-2 border-l-2 border-black">
              {activeTier.badge}
            </div>

            <div className="grid lg:grid-cols-12 gap-8 items-start">
              <div className="lg:col-span-5 space-y-4">
                <span className="text-xs font-mono uppercase tracking-wider text-cream/50">
                  Selected Package
                </span>
                <h3 className="font-heading text-3xl sm:text-4xl font-black text-cream uppercase">
                  {activeTier.name}
                </h3>
                <div className="inline-block px-4 py-2 bg-black/40 border-2 border-gold/40">
                  <p className="font-heading text-3xl sm:text-4xl font-black text-gold">
                    {activeTier.priceDisplay}
                  </p>
                </div>
                <p className="text-sm text-cream/80 leading-relaxed pt-1">
                  {activeTier.shortDesc}
                </p>

                {activeTier.cumulativeFrom && (
                  <div className="p-3 bg-gold/10 border-l-2 border-gold text-xs font-mono text-gold-light">
                    Includes all perks from{" "}
                    <strong className="text-gold font-bold">
                      {activeTier.cumulativeFrom} Partner
                    </strong>{" "}
                    and earlier tiers.
                  </div>
                )}

                <div className="pt-2">
                  <a href="#inquiry">
                    <Button
                      onClick={() => setFormData((prev) => ({ ...prev, tier: activeTier.id }))}
                      className="w-full sm:w-auto font-extrabold text-xs uppercase tracking-wider px-6 py-3 shadow-[3px_3px_0px_0px_#000]"
                    >
                      <span>Inquire For {activeTier.name}</span>
                      <ArrowRight size={14} className="ml-1" />
                    </Button>
                  </a>
                </div>
              </div>

              <div className="lg:col-span-7 bg-[#10081d] border-2 border-white/10 p-6 space-y-4">
                <h4 className="font-mono text-xs uppercase tracking-widest text-gold font-bold flex items-center gap-2">
                  <CheckCircle2 size={15} />
                  <span>Deliverables & Brand Entitlements</span>
                </h4>

                <div className="grid sm:grid-cols-2 gap-3.5">
                  {activeTier.deliverables.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-3 border border-white/10 bg-[#160c26] flex items-start gap-2.5"
                    >
                      <CheckCircle2 size={16} className="text-gold shrink-0 mt-0.5" />
                      <span className="text-xs text-cream/90 font-medium leading-snug">
                        {item}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* All 5 Tiers Grid for Side-by-Side Reference */}
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {SPONSORSHIP_TIERS.map((tier) => {
              const isSelected = tier.id === selectedTierId;
              return (
                <div
                  key={tier.id}
                  onClick={() => handleTierSelect(tier.id)}
                  className={`p-5 border-2 flex flex-col justify-between cursor-pointer transition-all duration-150 ${
                    isSelected
                      ? "bg-[#211239] border-gold shadow-[4px_4px_0px_0px_#000000] scale-[1.01]"
                      : "bg-[#140b24] border-white/10 hover:border-white/30 shadow-[2px_2px_0px_0px_#000000]"
                  }`}
                >
                  <div>
                    <span className="text-[10px] font-mono uppercase text-cream/50 block mb-1">
                      {tier.badge}
                    </span>
                    <h4 className="font-heading text-lg font-black text-cream uppercase">
                      {tier.name}
                    </h4>
                    <p className="font-heading text-xl font-black text-gold mt-1">
                      {tier.priceDisplay}
                    </p>
                    <p className="text-xs text-cream/70 mt-2 line-clamp-3">
                      {tier.shortDesc}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-white/10">
                    <span className="text-[11px] font-mono text-gold font-bold flex items-center gap-1">
                      <span>{isSelected ? "Selected" : "Click to view"}</span>
                      <ArrowRight size={12} />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          SPONSOR INQUIRY FORM & DIRECT CONTACT
         ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section id="inquiry" className="py-20 lg:py-24 border-b-2 border-white/10 bg-[#0d0718]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-12 gap-12">
            {/* Form Column */}
            <div className="lg:col-span-7 space-y-6">
              <div className="space-y-2">
                <span className="text-xs font-mono font-bold text-gold uppercase tracking-widest block">
                  Get In Touch
                </span>
                <h2 className="font-heading text-3xl sm:text-4xl font-black text-cream uppercase">
                  Sponsorship Inquiry
                </h2>
                <p className="text-cream/70 text-sm">
                  Fill in your details below. Our sponsorship team will connect with you directly with partnership options and customized deliverables.
                </p>
              </div>

              {submitted ? (
                <div className="p-8 border-2 border-gold bg-[#190f30] shadow-[5px_5px_0px_0px_#000000] space-y-4">
                  <div className="inline-flex items-center gap-2 text-gold font-mono text-xs uppercase font-bold bg-gold/10 px-3 py-1 border border-gold/30">
                    <CheckCircle2 size={15} />
                    <span>Inquiry Ready</span>
                  </div>
                  <h3 className="font-heading text-2xl font-black text-cream uppercase">
                    Thank You, {formData.contactPerson || "Partner"}!
                  </h3>
                  <p className="text-xs sm:text-sm text-cream/80 leading-relaxed">
                    Your inquiry for <strong className="text-gold">{activeTier.name}</strong> ({activeTier.priceDisplay}) has been logged. We have also opened WhatsApp to allow you to instantly connect with our lead organizers.
                  </p>
                  <div className="pt-2 flex flex-wrap gap-3">
                    <Button
                      onClick={() => setSubmitted(false)}
                      variant="outline"
                      size="sm"
                      className="text-xs uppercase font-bold"
                    >
                      Submit Another Inquiry
                    </Button>
                    <a
                      href={`mailto:${SUMMIT_SPONSOR_CONFIG.contacts.email}?subject=Sponsorship%20Proposal%20-${encodeURIComponent(formData.companyName)}`}
                    >
                      <Button size="sm" className="text-xs uppercase font-bold gap-1.5">
                        <Mail size={13} />
                        <span>Send Official Email</span>
                      </Button>
                    </a>
                  </div>
                </div>
              ) : (
                <form
                  onSubmit={handleFormSubmit}
                  className="p-8 border-2 border-white/20 bg-[#140b24] shadow-[6px_6px_0px_0px_#000000] space-y-5"
                >
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-mono uppercase font-bold text-cream/80 block">
                        Organization / Brand Name *
                      </label>
                      <input
                        type="text"
                        name="companyName"
                        required
                        value={formData.companyName}
                        onChange={handleInputChange}
                        placeholder="e.g. Acme Corp / TechStart"
                        className="w-full px-3.5 py-2.5 bg-[#0b0714] border-2 border-white/20 text-cream text-xs font-mono focus:border-gold outline-none shadow-[2px_2px_0px_0px_#000]"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-mono uppercase font-bold text-cream/80 block">
                        Contact Person *
                      </label>
                      <input
                        type="text"
                        name="contactPerson"
                        required
                        value={formData.contactPerson}
                        onChange={handleInputChange}
                        placeholder="Full Name / Designation"
                        className="w-full px-3.5 py-2.5 bg-[#0b0714] border-2 border-white/20 text-cream text-xs font-mono focus:border-gold outline-none shadow-[2px_2px_0px_0px_#000]"
                      />
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-mono uppercase font-bold text-cream/80 block">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="partner@company.com"
                        className="w-full px-3.5 py-2.5 bg-[#0b0714] border-2 border-white/20 text-cream text-xs font-mono focus:border-gold outline-none shadow-[2px_2px_0px_0px_#000]"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-mono uppercase font-bold text-cream/80 block">
                        Phone / WhatsApp *
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        required
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="+91 98765 43210"
                        className="w-full px-3.5 py-2.5 bg-[#0b0714] border-2 border-white/20 text-cream text-xs font-mono focus:border-gold outline-none shadow-[2px_2px_0px_0px_#000]"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-mono uppercase font-bold text-cream/80 block">
                      Preferred Partnership Tier *
                    </label>
                    <select
                      name="tier"
                      value={formData.tier}
                      onChange={handleInputChange}
                      className="w-full px-3.5 py-2.5 bg-[#0b0714] border-2 border-white/20 text-cream text-xs font-mono focus:border-gold outline-none shadow-[2px_2px_0px_0px_#000]"
                    >
                      {SPONSORSHIP_TIERS.map((t) => (
                        <option key={t.id} value={t.id} className="bg-[#140b24]">
                          {t.name} ({t.priceDisplay}) — {t.badge}
                        </option>
                      ))}
                      <option value="custom" className="bg-[#140b24]">
                        Custom Partnership / In-Kind Sponsorship
                      </option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-mono uppercase font-bold text-cream/80 block">
                      Notes or Specific Objectives
                    </label>
                    <textarea
                      name="message"
                      rows={3}
                      value={formData.message}
                      onChange={handleInputChange}
                      placeholder="Tell us about your brand goals, target audience preferences, or specific collateral requirements..."
                      className="w-full px-3.5 py-2.5 bg-[#0b0714] border-2 border-white/20 text-cream text-xs font-mono focus:border-gold outline-none shadow-[2px_2px_0px_0px_#000]"
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={submitting}
                    className="w-full font-black text-xs uppercase tracking-wider py-3.5 shadow-[4px_4px_0px_0px_#000000] hover:shadow-[6px_6px_0px_0px_#000000]"
                  >
                    <Send size={14} className="mr-1.5" />
                    <span>{submitting ? "Processing..." : "Submit Inquiry & Connect"}</span>
                  </Button>
                </form>
              )}
            </div>

            {/* Direct Contact & Details Column */}
            <div className="lg:col-span-5 space-y-6">
              <div className="p-8 border-2 border-white/15 bg-[#140b24] shadow-[5px_5px_0px_0px_#000000] space-y-6">
                <div className="space-y-2">
                  <span className="text-xs font-mono font-bold text-gold uppercase tracking-widest block">
                    Immediate Assistance
                  </span>
                  <h3 className="font-heading text-2xl font-black text-cream uppercase">
                    Connect Directly With Organizers
                  </h3>
                  <p className="text-xs text-cream/70 leading-relaxed">
                    Have tailored branding proposals, institutional approvals, or CSR sponsorship requirements? Reach our secretariat leadership directly.
                  </p>
                </div>

                <div className="space-y-4 pt-2">
                  <a
                    href={`tel:${SUMMIT_SPONSOR_CONFIG.contacts.primaryPhone}`}
                    className="flex items-center gap-3 p-3.5 border-2 border-white/10 bg-[#1a0e30] hover:border-gold/40 transition-colors shadow-[2px_2px_0px_0px_#000]"
                  >
                    <Phone size={18} className="text-gold shrink-0" />
                    <div>
                      <p className="text-[10px] font-mono text-cream/50 uppercase font-bold">
                        Primary Secretariat Line
                      </p>
                      <p className="text-xs font-mono font-bold text-cream">
                        {SUMMIT_SPONSOR_CONFIG.contacts.primaryPhone}
                      </p>
                    </div>
                  </a>

                  <a
                    href={`tel:${SUMMIT_SPONSOR_CONFIG.contacts.secondaryPhone}`}
                    className="flex items-center gap-3 p-3.5 border-2 border-white/10 bg-[#1a0e30] hover:border-gold/40 transition-colors shadow-[2px_2px_0px_0px_#000]"
                  >
                    <Phone size={18} className="text-gold shrink-0" />
                    <div>
                      <p className="text-[10px] font-mono text-cream/50 uppercase font-bold">
                        Secondary Inquiries
                      </p>
                      <p className="text-xs font-mono font-bold text-cream">
                        {SUMMIT_SPONSOR_CONFIG.contacts.secondaryPhone}
                      </p>
                    </div>
                  </a>

                  <a
                    href={`mailto:${SUMMIT_SPONSOR_CONFIG.contacts.email}?subject=Athena%20Summit%20Sponsorship`}
                    className="flex items-center gap-3 p-3.5 border-2 border-white/10 bg-[#1a0e30] hover:border-gold/40 transition-colors shadow-[2px_2px_0px_0px_#000]"
                  >
                    <Mail size={18} className="text-gold shrink-0" />
                    <div>
                      <p className="text-[10px] font-mono text-cream/50 uppercase font-bold">
                        Official Secretariat Email
                      </p>
                      <p className="text-xs font-mono font-bold text-cream">
                        {SUMMIT_SPONSOR_CONFIG.contacts.email}
                      </p>
                    </div>
                  </a>

                  <a
                    href={SUMMIT_SPONSOR_CONFIG.contacts.instagramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3.5 border-2 border-white/10 bg-[#1a0e30] hover:border-gold/40 transition-colors shadow-[2px_2px_0px_0px_#000]"
                  >
                    <InstagramIcon size={18} className="text-gold shrink-0" />
                    <div>
                      <p className="text-[10px] font-mono text-cream/50 uppercase font-bold">
                        Instagram Coverage
                      </p>
                      <p className="text-xs font-mono font-bold text-cream">
                        {SUMMIT_SPONSOR_CONFIG.contacts.instagram}
                      </p>
                    </div>
                  </a>
                </div>

                <div className="pt-4 border-t border-white/10 text-[11px] text-cream/60">
                  <p>
                    📍 Official Venue: <strong>{SUMMIT_SPONSOR_CONFIG.venue}</strong> ({SUMMIT_SPONSOR_CONFIG.location}) <br />
                    📅 Dates: <strong>{SUMMIT_SPONSOR_CONFIG.dates}</strong>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default function SponsorsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#0b0714] flex items-center justify-center text-cream font-mono text-xs">
          Loading sponsorship portal...
        </div>
      }
    >
      <SponsorsPageContent />
    </Suspense>
  );
}
