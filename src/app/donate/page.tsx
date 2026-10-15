"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  Heart,
  BookOpen,
  ShieldCheck,
  Maximize2,
  X,
  CheckCircle2,
  Clock,
  Bell,
  Sparkles,
  ShieldAlert,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";

const PRESET_AMOUNTS = [250, 500, 1000, 2500, 5000];

const IMPACT_TIERS: Record<number, string> = {
  250: "Provides essential textbooks, notebooks, and writing supplies for 1 child.",
  500: "Funds 1 month of after-school tutoring & learning kits for an underprivileged student.",
  1000: "Covers 1 week of vocational tailoring materials & skill workshops for women in rehabilitation.",
  2500: "Sponsors complete educational support & wellness supplies for 2 children across a full term.",
  5000: "Provides emergency shelter, counseling, and self-reliance toolkit for an abuse survivor.",
};

const CAUSE_OPTIONS = [
  { id: "both", label: "Both Initiatives" },
  { id: "education", label: "Childhood Education" },
  { id: "women", label: "Women's Empowerment" },
];

export default function DonatePage() {
  const [selectedAmount, setSelectedAmount] = useState<number | null>(500);
  const [customAmount, setCustomAmount] = useState<string>("");
  const [showPosterModal, setShowPosterModal] = useState(false);

  // Waitlist form state
  const [donorName, setDonorName] = useState("");
  const [donorEmail, setDonorEmail] = useState("");
  const [donorPhone, setDonorPhone] = useState("");
  const [causeInterest, setCauseInterest] = useState("both");
  const [message, setMessage] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const currentAmountValue =
    selectedAmount !== null
      ? selectedAmount
      : customAmount
      ? parseInt(customAmount, 10) || 0
      : 0;

  const handleJoinWaitlist = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (!donorName.trim() || !donorEmail.trim()) {
      setErrorMessage("Please enter both your full name and email address.");
      return;
    }

    setIsSubmitting(true);
    try {
      const selectedCauseLabel =
        CAUSE_OPTIONS.find((c) => c.id === causeInterest)?.label || "Both Initiatives";

      const res = await fetch("/api/donations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          donorName,
          donorEmail,
          donorPhone,
          amount: currentAmountValue,
          isWaitlist: true,
          causeInterest: selectedCauseLabel,
          message,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to join waitlist");
      setSubmittedSuccess(true);
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetForm = () => {
    setSubmittedSuccess(false);
    setDonorName("");
    setDonorEmail("");
    setDonorPhone("");
    setMessage("");
    setErrorMessage("");
  };

  return (
    <div className="relative min-h-screen text-cream overflow-hidden neo-grid-bg">
      {/* Corner Architectural Brackets */}
      <div className="absolute top-0 left-0 w-32 sm:w-44 h-32 sm:h-44 border-l-2 border-t-2 border-white/15 pointer-events-none" />
      <div className="absolute top-0 right-0 w-32 sm:w-44 h-32 sm:h-44 border-r-2 border-t-2 border-white/15 pointer-events-none" />

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          SECTION 1 — HERO
         ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section className="relative flex items-center overflow-hidden pt-32 pb-24 lg:pt-40 lg:pb-32 border-b-2 border-white/10">
        {/* Full-bleed hero artwork */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <Image
            src="/girl-illustration.png"
            alt=""
            fill
            className="object-cover object-[68%_center] scale-105 opacity-70"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/70 via-background/10 to-background" />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/85 44% to-background/10 75%" />
        </div>

        <div className="relative z-10 mx-auto max-w-7xl px-6 w-full">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="max-w-2xl lg:max-w-xl space-y-6"
          >
            {/* Top Neo-Brutalist Sticker Pills */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="inline-block transform -rotate-1">
                <span className="px-4 py-1.5 bg-gold border-2 border-black text-[#0b0714] font-black text-xs uppercase tracking-wider shadow-[3px_3px_0px_0px_#000000]">
                  Societal Mission
                </span>
              </div>
              <span className="inline-flex items-center gap-1.5 text-xs text-amber-300 font-mono font-bold uppercase bg-[#140b24] px-3.5 py-1.5 border border-amber-400/50 shadow-[2px_2px_0px_0px_#000000]">
                <Clock size={12} className="text-amber-400" />
                Forms Paused • Waitlist Open
              </span>
            </div>

            {/* Heading */}
            <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold uppercase text-cream leading-[.98] tracking-tight">
              A Step Taken <br />
              <span className="text-gold">Together</span>
            </h1>

            {/* Subtitle */}
            <p className="text-cream/75 text-base sm:text-lg leading-relaxed font-normal max-w-2xl">
              This year, we&apos;re putting that belief into action. Alongside our summit, we&apos;re running a fundraiser for local NGOs working on two fronts we genuinely care about — <strong className="text-cream font-bold">giving underprivileged children access to education</strong>, and <strong className="text-cream font-bold">supporting marginalized women through rehabilitation and self-reliance programs.</strong>
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-3">
              <a href="#waitlist">
                <button className="px-8 py-4 bg-gold text-[#0b0714] font-extrabold text-xs uppercase tracking-wider border-2 border-black shadow-[4px_4px_0px_0px_#000000] hover:shadow-[6px_6px_0px_0px_#000000] hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 transition-all inline-flex items-center gap-2 cursor-pointer">
                  <Bell size={16} />
                  <span>Join the Waitlist</span>
                </button>
              </a>
              <button
                onClick={() => setShowPosterModal(true)}
                className="px-6 py-4 bg-[#140b24] text-cream font-bold text-xs uppercase tracking-wider border-2 border-white/20 shadow-[4px_4px_0px_0px_#000000] hover:shadow-[6px_6px_0px_0px_#000000] hover:border-white hover:text-white hover:-translate-y-0.5 transition-all inline-flex items-center gap-2 cursor-pointer"
              >
                <Maximize2 size={14} /> View Official Poster
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          SECTION 2 — DUAL PILLARS
         ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section className="py-20 lg:py-24 relative border-b-2 border-white/10 bg-[#0b0714]">
        <div className="mx-auto max-w-7xl px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-2xl space-y-3 mb-12"
          >
            <div className="inline-block transform -rotate-1">
              <span className="px-4 py-1.5 bg-gold border-2 border-black text-[#0b0714] font-black text-xs uppercase tracking-wider shadow-[3px_3px_0px_0px_#000000]">
                Two Vital Fronts
              </span>
            </div>
            <h2 className="text-4xl sm:text-5xl font-extrabold uppercase tracking-tight text-cream">
              Our Core <span className="text-gold">Societal Pillars</span>
            </h2>
            <p className="text-cream/70 text-sm font-normal">
              Bridging student diplomacy with tangible grassroots empowerment across India.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-6">
            {/* Front 01 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-[#140b24] border-2 border-white/15 hover:border-gold/60 p-7 sm:p-8 shadow-[4px_4px_0px_0px_#000000] hover:shadow-[6px_6px_0px_0px_#000000] hover:-translate-y-1 transition-all space-y-5"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase tracking-[0.15em] text-gold/90 font-mono font-bold">FRONT 01 / EDUCATION</span>
                <div className="h-10 w-10 bg-[#1f1238] border border-white/20 flex items-center justify-center text-gold shadow-[2px_2px_0px_0px_#000000]">
                  <BookOpen size={18} />
                </div>
              </div>
              <h3 className="text-2xl sm:text-3xl font-extrabold uppercase text-cream tracking-tight">
                Childhood Access to Education & Opportunity
              </h3>
              <p className="text-cream/75 text-sm leading-relaxed font-sans font-light">
                Giving underprivileged children access to education, learning supplies, school uniforms, textbooks, and after-school tuition—breaking cycle barriers and opening real opportunities.
              </p>
              <div className="space-y-2.5 border-t border-white/10 pt-4 text-xs font-sans text-cream/75 font-normal">
                {["Free textbooks, uniforms, school bags, and stationery",
                  "After-school academic tutoring & mentorship",
                  "Scholarship grants for promising young scholars"].map((item) => (
                  <div key={item} className="flex items-center gap-2">
                    <CheckCircle2 size={14} className="text-gold shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
              <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs text-gold/80 font-mono font-bold uppercase">
                <span>100% Direct Learning Aid</span>
                <BookOpen size={14} />
              </div>
            </motion.div>

            {/* Front 02 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-[#140b24] border-2 border-white/15 hover:border-gold/60 p-7 sm:p-8 shadow-[4px_4px_0px_0px_#000000] hover:shadow-[6px_6px_0px_0px_#000000] hover:-translate-y-1 transition-all space-y-5"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase tracking-[0.15em] text-gold/90 font-mono font-bold">FRONT 02 / REHABILITATION</span>
                <div className="h-10 w-10 bg-[#1f1238] border border-white/20 flex items-center justify-center text-gold shadow-[2px_2px_0px_0px_#000000]">
                  <Heart size={18} />
                </div>
              </div>
              <h3 className="text-2xl sm:text-3xl font-extrabold uppercase text-cream tracking-tight">
                Women&apos;s Empowerment & Abuse Recovery
              </h3>
              <p className="text-cream/75 text-sm leading-relaxed font-sans font-light">
                Supporting marginalized women, including survivors of domestic abuse and social hardship, through rehabilitation programs, vocational skill-building, and financial independence toolkits.
              </p>
              <div className="space-y-2.5 border-t border-white/10 pt-4 text-xs font-sans text-cream/75 font-normal">
                {["Vocational tailoring & craft artisan equipment",
                  "Trauma counseling & psychological healing support",
                  "Legal aid and micro-entrepreneurship startup support"].map((item) => (
                  <div key={item} className="flex items-center gap-2">
                    <CheckCircle2 size={14} className="text-gold shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
              <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs text-gold/80 font-mono font-bold uppercase">
                <span>Sustainable Self-Reliance</span>
                <Sparkles size={14} />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          SECTION 3 — WAITLIST HUB
         ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section className="py-20 lg:py-24 relative neo-grid-bg" id="waitlist">
        <div id="donate-now" className="scroll-mt-24" />
        <div className="mx-auto max-w-7xl px-6">

          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-2xl space-y-3 mb-10"
          >
            <div className="inline-block transform -rotate-1">
              <span className="px-5 py-2 bg-gold border-2 border-black text-[#0b0714] font-black text-xs uppercase tracking-wider shadow-[3px_3px_0px_0px_#000000]">
                Early Supporter Access
              </span>
            </div>
            <h2 className="text-4xl sm:text-5xl font-extrabold uppercase tracking-tight text-cream">
              Join the Contribution <span className="text-gold">Waitlist</span>
            </h2>
            <p className="text-cream/75 text-sm font-normal">
              Direct donation forms are temporarily paused while our team coordinates ground logistics and beneficiary allocation. Join the priority waitlist to be alerted first when donations reopen.
            </p>
          </motion.div>

          {/* Paused Notice Banner */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-[#140b24] border-2 border-amber-400/40 p-6 sm:p-7 mb-10 shadow-[4px_4px_0px_0px_#000000]"
          >
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="h-11 w-11 bg-amber-500/20 border border-amber-400/60 flex items-center justify-center shrink-0 text-amber-400 shadow-[2px_2px_0px_0px_#000000]">
                <Clock size={22} />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-[#0b0714] font-black bg-amber-400 px-2 py-0.5 border border-black shadow-[1px_1px_0px_0px_#000]">
                    STATUS: COLLECTION PAUSED
                  </span>
                  <span className="text-xs text-cream/60 font-mono font-bold">• Reopening Soon</span>
                </div>
                <h3 className="text-xl font-extrabold uppercase text-cream tracking-tight">
                  Online Donation Submissions Are Temporarily Closed
                </h3>
                <p className="text-xs sm:text-sm text-cream/70 font-sans font-light leading-relaxed">
                  We are currently auditing initial allocations and aligning distributions with our verified NGO partners. By registering below, you will receive guaranteed first notification and priority donor credentials when the portal reopens.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Grid: Waitlist Form + Information Sidebar */}
          <div className="grid lg:grid-cols-[minmax(0,1.35fr)_minmax(19rem,.8fr)] gap-8 items-start">

            {/* Left: Waitlist Registration Form */}
            <div className="bg-[#140b24] border-2 border-white/20 p-6 sm:p-8 shadow-[6px_6px_0px_0px_#000000] relative">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-6 border-b border-white/10 pb-4">
                <div>
                  <h3 className="text-2xl font-extrabold uppercase text-cream tracking-tight">Priority Supporter Registry</h3>
                  <p className="text-xs text-cream/60 mt-0.5">
                    Leave your contact details and intended pledge to be prioritized.
                  </p>
                </div>
                <span className="text-[10px] font-mono font-bold uppercase bg-[#0b0714] text-cream/80 px-2.5 py-1 border border-white/20 shadow-[2px_2px_0px_0px_#000000]">
                  Phase II Waitlist
                </span>
              </div>

              {submittedSuccess ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="rounded-2xl border border-emerald-500/40 bg-emerald-950/30 p-8 sm:p-10 text-center space-y-4"
                >
                  <div className="h-16 w-16 mx-auto rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center">
                    <CheckCircle2 size={36} className="text-emerald-400" />
                  </div>
                  <h4 className="font-heading text-2xl sm:text-3xl text-emerald-300">
                    You&apos;re On The Priority Waitlist!
                  </h4>
                  <p className="text-xs sm:text-sm text-cream/80 font-sans leading-relaxed max-w-md mx-auto">
                    Thank you, <strong className="text-gold font-medium">{donorName || "friend"}</strong>. Your pledge of interest has been safely recorded. You will be among the first to receive direct communication as soon as donation forms and UPI channels reopen.
                  </p>

                  <div className="pt-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={handleResetForm}
                      className="text-xs font-mono uppercase tracking-wider"
                    >
                      Add Another Email
                    </Button>
                  </div>
                </motion.div>
              ) : (
                <form onSubmit={handleJoinWaitlist} className="space-y-6">
                  {errorMessage && (
                    <div className="text-xs text-rose-300 bg-rose-950/40 border border-rose-500/30 p-3.5 rounded-lg">
                      {errorMessage}
                    </div>
                  )}

                  {/* Personal Info */}
                  <div className="grid sm:grid-cols-2 gap-4">
                    <Input
                      label="Full Name *"
                      placeholder="e.g. Priyanshu Sharma"
                      value={donorName}
                      onChange={(e) => setDonorName(e.target.value)}
                      required
                    />
                    <Input
                      label="Email Address *"
                      type="email"
                      placeholder="your.email@example.com"
                      value={donorEmail}
                      onChange={(e) => setDonorEmail(e.target.value)}
                      required
                    />
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <Input
                      label="Phone / WhatsApp (Optional)"
                      placeholder="+91 98765 43210"
                      value={donorPhone}
                      onChange={(e) => setDonorPhone(e.target.value)}
                    />

                    {/* Cause Selection */}
                    <div>
                      <label className="block text-xs uppercase tracking-wider text-cream/70 mb-2">
                        Preferred Cause
                      </label>
                      <div className="grid grid-cols-3 gap-2">
                        {CAUSE_OPTIONS.map((c) => (
                          <button
                            key={c.id}
                            type="button"
                            onClick={() => setCauseInterest(c.id)}
                            className={`py-2 px-2 rounded-lg text-[11px] font-sans font-medium text-center transition-all border ${
                              causeInterest === c.id
                                ? "bg-gold text-purple-deep border-gold font-bold shadow-md shadow-gold/20"
                                : "bg-purple-deep/70 text-cream/70 border-gold/20 hover:border-gold/40 hover:text-cream"
                            }`}
                          >
                            {c.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Pledged Amount (Optional) */}
                  <div className="rounded-xl border border-white/10 bg-[#0b0714] p-4 sm:p-5 space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="text-xs uppercase tracking-wider text-cream/80 font-mono block">
                        Intended / Pledged Contribution (Optional)
                      </label>
                      <span className="text-[10px] text-cream/40 font-mono">No payment required now</span>
                    </div>

                    <div className="grid grid-cols-3 sm:grid-cols-5 gap-2.5">
                      {PRESET_AMOUNTS.map((amt) => (
                        <button
                          key={amt}
                          type="button"
                          onClick={() => {
                            setSelectedAmount(amt);
                            setCustomAmount("");
                          }}
                          className={`py-2.5 px-1.5 text-xs font-mono font-bold transition-all border-2 cursor-pointer ${
                            selectedAmount === amt
                              ? "bg-gold text-[#0b0714] border-black shadow-[2px_2px_0px_0px_#000000] -translate-y-0.5"
                              : "bg-[#140b24] text-cream/80 border-white/15 hover:border-white/30"
                          }`}
                        >
                          ₹{amt.toLocaleString("en-IN")}
                        </button>
                      ))}
                    </div>

                    <div className="pt-1">
                      <Input
                        placeholder="Or specify custom intended amount in ₹ INR"
                        type="number"
                        value={customAmount}
                        onChange={(e) => {
                          setCustomAmount(e.target.value);
                          setSelectedAmount(null);
                        }}
                        className="font-mono text-xs"
                      />
                    </div>

                    {/* Impact preview */}
                    <div className="text-[11px] text-cream/60 font-sans italic pt-1 border-t border-white/10">
                      💡 {IMPACT_TIERS[currentAmountValue] || "Your pledge will directly aid education and rehabilitation kits."}
                    </div>
                  </div>

                  {/* Encouragement message */}
                  <Textarea
                    label="Message of Support or Inquiry (Optional)"
                    placeholder="Share any thoughts, suggestions, or questions for our NGO partners..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                  />

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 bg-gold text-[#0b0714] border-2 border-black font-extrabold uppercase tracking-wider text-xs shadow-[4px_4px_0px_0px_#000000] hover:shadow-[6px_6px_0px_0px_#000000] hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center justify-center gap-2">
                        <Clock className="w-4 h-4 animate-spin" /> Adding to Waitlist...
                      </span>
                    ) : (
                      <span className="flex items-center justify-center gap-2">
                        <Bell size={15} /> Join Contribution Waitlist
                      </span>
                    )}
                  </button>
                </form>
              )}
            </div>

            {/* Right: Sidebar Status & Assurance */}
            <div className="space-y-6">

              {/* Status Card */}
              <div className="border-2 border-white/15 bg-[#140b24] p-6 sm:p-7 shadow-[4px_4px_0px_0px_#000000] space-y-4">
                <div className="inline-flex items-center gap-2 border border-white/20 bg-[#0b0714] px-3.5 py-1 text-cream/80 text-xs font-mono">
                  <Clock size={13} className="text-amber-400" /> DRIVE LIFECYCLE
                </div>

                <div className="space-y-2">
                  <h4 className="font-heading text-xl font-extrabold uppercase text-cream">Next Disbursement Cycle</h4>
                  <p className="text-xs text-cream/70 leading-relaxed font-sans font-light">
                    Online forms will reopen as soon as field verifications with partner NGOs conclude. Waitlist members will get direct links and early access before public announcements.
                  </p>
                </div>

                <div className="border-t border-white/10 pt-4 space-y-3 text-xs font-sans text-cream/80">
                  <div className="flex items-start gap-2.5">
                    <CheckCircle2 size={15} className="text-gold shrink-0 mt-0.5" />
                    <span>Priority email & WhatsApp notification</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <CheckCircle2 size={15} className="text-gold shrink-0 mt-0.5" />
                    <span>Official Donor Thank-You Certificate reservation</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <CheckCircle2 size={15} className="text-gold shrink-0 mt-0.5" />
                    <span>Post-drive transparency audit report sent directly</span>
                  </div>
                </div>
              </div>

              {/* Payments Paused Notice */}
              <div className="border-2 border-white/15 bg-[#140b24] p-6 space-y-3 shadow-[4px_4px_0px_0px_#000000]">
                <div className="flex items-center gap-2 text-cream font-mono text-xs uppercase tracking-wider font-bold">
                  <ShieldAlert size={16} className="text-amber-400" />
                  <span>Direct Payments Inactive</span>
                </div>
                <p className="text-xs text-cream/65 leading-relaxed font-sans font-light">
                  Direct UPI and QR payments are paused to protect donors from unverified submissions while the portal is undergoing maintenance. Please do not initiate payments until the form reopens.
                </p>
                <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[11px] text-cream/40 font-mono">
                  <span>Audited Remittance</span>
                  <ShieldCheck size={14} className="text-gold" />
                </div>
              </div>

              {/* Poster Preview Button */}
              <button
                type="button"
                onClick={() => setShowPosterModal(true)}
                className="w-full text-center text-xs text-cream font-mono font-bold uppercase tracking-wider py-3.5 px-4 border-2 border-white/20 bg-[#140b24] hover:border-gold hover:text-gold shadow-[3px_3px_0px_0px_#000000] transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Maximize2 size={14} /> View Official Campaign Poster
              </button>

            </div>

          </div>

        </div>
      </section>

      {/* ━━━ Poster Modal ━━━ */}
      <AnimatePresence>
        {showPosterModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
            onClick={() => setShowPosterModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="relative max-w-xl w-full bg-purple-deep border border-gold/40 p-4 rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setShowPosterModal(false)}
                className="absolute top-4 right-4 p-2 rounded-full bg-black/60 text-cream/80 hover:text-gold transition-colors z-10"
              >
                <X size={20} />
              </button>
              <Image
                src="/ngo-poster.jpeg"
                alt="A Step Taken Together Poster"
                width={800}
                height={1040}
                className="rounded-xl w-full h-auto object-contain"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
