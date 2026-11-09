"use client";

import { useState, useCallback } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  Heart,
  BookOpen,
  ShieldCheck,
  QrCode,
  Copy,
  Check,
  Upload,
  Maximize2,
  X,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Phone,
  Smartphone,
} from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";

const PRESET_AMOUNTS = [250, 500, 1000, 2500, 5000];

const OFFICIAL_UPI_ID = "startly@ybl";
const UPI_DEEP_LINK = `upi://pay?pa=${OFFICIAL_UPI_ID}&pn=Startly%20Innovations&cu=INR`;

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
  const [copiedUpi, setCopiedUpi] = useState(false);

  const handleCopyUpi = useCallback(() => {
    navigator.clipboard?.writeText(OFFICIAL_UPI_ID).then(() => {
      setCopiedUpi(true);
      setTimeout(() => setCopiedUpi(false), 2000);
    });
  }, []);

  // Contribution form state
  const [donorName, setDonorName] = useState("");
  const [donorEmail, setDonorEmail] = useState("");
  const [donorPhone, setDonorPhone] = useState("");
  const [causeInterest, setCauseInterest] = useState("both");
  const [transactionRef, setTransactionRef] = useState("");
  const [screenshotPreview, setScreenshotPreview] = useState<string | null>(null);
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

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      setErrorMessage("File size exceeds 5MB limit. Please choose a smaller image.");
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      setScreenshotPreview(reader.result as string);
      setErrorMessage("");
    };
    reader.readAsDataURL(file);
  };

  const handleSubmitContribution = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (!donorName.trim() || !donorEmail.trim()) {
      setErrorMessage("Please enter both your full name and email address.");
      return;
    }

    if (!transactionRef.trim()) {
      setErrorMessage("Please enter the UPI Transaction Reference / UTR ID from your payment.");
      return;
    }

    if (currentAmountValue <= 0) {
      setErrorMessage("Please select or enter a valid contribution amount.");
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
          transactionRef,
          screenshot: screenshotPreview,
          isWaitlist: false,
          status: "pending",
          causeInterest: selectedCauseLabel,
          message,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to submit donation receipt");
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
    setTransactionRef("");
    setScreenshotPreview(null);
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
              <span className="inline-flex items-center gap-1.5 text-xs text-emerald-400 font-mono font-bold uppercase bg-[#140b24] px-3.5 py-1.5 border border-emerald-500/50 shadow-[2px_2px_0px_0px_#000000]">
                <Heart size={12} className="text-emerald-400 fill-emerald-400" />
                Fundraiser Live • Contributions Open
              </span>
            </div>

            {/* Heading */}
            <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold uppercase text-cream leading-[.98] tracking-tight">
              A Step Taken <br />
              <span className="text-gold">Together</span>
            </h1>

            {/* Subtitle */}
            <p className="text-cream/75 text-base sm:text-lg leading-relaxed font-normal max-w-2xl">
              Alongside the Athena Summit, we are spearheading an active community fundraiser supporting verified ground NGOs on two vital fronts: <strong className="text-cream font-bold">providing underprivileged children with schooling kits &amp; education</strong>, and <strong className="text-cream font-bold">empowering marginalized women &amp; abuse survivors through vocational self-reliance.</strong>
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-3">
              <a href="#contribute">
                <button className="px-8 py-4 bg-gold text-[#0b0714] font-extrabold text-xs uppercase tracking-wider border-2 border-black shadow-[4px_4px_0px_0px_#000000] hover:shadow-[6px_6px_0px_0px_#000000] hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 transition-all inline-flex items-center gap-2 cursor-pointer">
                  <Heart size={16} className="fill-current" />
                  <span>Donate Now →</span>
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
                Childhood Access to Education &amp; Opportunity
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
                Women&apos;s Empowerment &amp; Abuse Recovery
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
          SECTION 3 — ACTIVE FUNDRAISER CONTRIBUTION HUB
         ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section className="py-20 lg:py-24 relative neo-grid-bg" id="contribute">
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
                Direct Community Aid
              </span>
            </div>
            <h2 className="text-4xl sm:text-5xl font-extrabold uppercase tracking-tight text-cream">
              Make a <span className="text-gold">Contribution</span>
            </h2>
            <p className="text-cream/75 text-sm font-normal">
              100% of your contributions go straight toward educational supplies for underprivileged children and self-reliance vocational toolkits for women survivors.
            </p>
          </motion.div>

          {/* Grid: Form + Startly QR Box */}
          <div className="grid lg:grid-cols-[minmax(0,1.3fr)_minmax(19rem,.9fr)] gap-8 items-start">

            {/* Left Column: Contribution Details & Receipt Form */}
            <div className="bg-[#140b24] border-2 border-white/20 p-6 sm:p-8 shadow-[6px_6px_0px_0px_#000000] relative">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-6 border-b border-white/10 pb-4">
                <div>
                  <h3 className="text-2xl font-extrabold uppercase text-cream tracking-tight">Step 2: Log Contribution Receipt</h3>
                  <p className="text-xs text-cream/60 mt-0.5">
                    Scan the QR on the right, pay via any UPI app, then submit your details below:
                  </p>
                </div>
                <span className="text-[10px] font-mono font-bold uppercase bg-emerald-500/10 text-emerald-400 px-2.5 py-1 border border-emerald-500/30 shadow-[2px_2px_0px_0px_#000000]">
                  Live Channel
                </span>
              </div>

              {submittedSuccess ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="rounded-none border-2 border-emerald-500/40 bg-emerald-950/30 p-8 sm:p-10 text-center space-y-4 shadow-[4px_4px_0px_0px_#000]"
                >
                  <div className="h-16 w-16 mx-auto rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center">
                    <CheckCircle2 size={36} className="text-emerald-400" />
                  </div>
                  <h4 className="font-heading text-2xl sm:text-3xl text-emerald-300">
                    Thank You For Your Generosity!
                  </h4>
                  <p className="text-xs sm:text-sm text-cream/80 font-sans leading-relaxed max-w-md mx-auto">
                    Thank you, <strong className="text-gold font-medium">{donorName || "Supporter"}</strong>. Your contribution of <strong className="text-gold font-bold">₹{currentAmountValue.toLocaleString("en-IN")}</strong> has been successfully logged. The Athena Secretariat and our NGO partners express our heartfelt gratitude.
                  </p>

                  <div className="pt-2">
                    <button
                      onClick={handleResetForm}
                      className="px-6 py-2.5 bg-gold text-[#0b0714] text-xs font-mono font-bold uppercase tracking-wider border-2 border-black shadow-[3px_3px_0px_0px_#000]"
                    >
                      Make Another Contribution
                    </button>
                  </div>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmitContribution} className="space-y-6">
                  {errorMessage && (
                    <div className="text-xs text-rose-300 bg-rose-950/40 border border-rose-500/30 p-3.5 shadow-[2px_2px_0px_0px_#000]">
                      {errorMessage}
                    </div>
                  )}

                  {/* 1. Contribution Amount Preset */}
                  <div className="border border-white/10 bg-[#0b0714] p-4 sm:p-5 space-y-3 shadow-[2px_2px_0px_0px_#000]">
                    <div className="flex items-center justify-between">
                      <label className="text-xs uppercase tracking-wider text-cream/80 font-mono block font-bold">
                        1. Select Contribution Amount *
                      </label>
                      <span className="text-[10px] text-gold font-mono font-bold">
                        ₹{currentAmountValue.toLocaleString("en-IN")}
                      </span>
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
                        placeholder="Or enter custom amount in ₹ INR"
                        type="number"
                        min="1"
                        value={customAmount}
                        onChange={(e) => {
                          setCustomAmount(e.target.value);
                          setSelectedAmount(null);
                        }}
                        className="font-mono text-xs"
                      />
                    </div>

                    {/* Impact preview */}
                    <div className="text-[11px] text-cream/70 font-sans italic pt-1 border-t border-white/10">
                      💡 {IMPACT_TIERS[currentAmountValue] || "Your contribution will directly fund educational supplies and women's rehabilitation toolkits."}
                    </div>
                  </div>

                  {/* 2. Cause Selection */}
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-cream/70 mb-2 font-mono">
                      2. Direct Aid Toward
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {CAUSE_OPTIONS.map((c) => (
                        <button
                          key={c.id}
                          type="button"
                          onClick={() => setCauseInterest(c.id)}
                          className={`py-2 px-2 text-[11px] font-sans font-medium text-center transition-all border-2 cursor-pointer ${
                            causeInterest === c.id
                              ? "bg-gold text-[#0b0714] border-black font-bold shadow-[2px_2px_0px_0px_#000]"
                              : "bg-[#0b0714] text-cream/70 border-white/15 hover:border-white/40 hover:text-cream"
                          }`}
                        >
                          {c.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* 3. Personal Info */}
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
                    <Input
                      label="UPI Transaction Ref / UTR ID *"
                      placeholder="e.g. 431256789012"
                      value={transactionRef}
                      onChange={(e) => setTransactionRef(e.target.value)}
                      required
                    />
                  </div>

                  {/* 4. Payment Screenshot Upload */}
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-cream/70 mb-2 font-mono">
                      Upload Payment Screenshot (Optional, Max 5MB)
                    </label>
                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-white/20 hover:border-gold/60 transition-all cursor-pointer bg-[#0b0714] group shadow-[2px_2px_0px_0px_#000000]">
                      {screenshotPreview ? (
                        <div className="flex items-center gap-4 p-2">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={screenshotPreview}
                            alt="Receipt Preview"
                            className="h-20 w-20 object-cover border border-white/30"
                          />
                          <div className="text-left">
                            <p className="text-xs text-emerald-400 font-medium flex items-center gap-1 font-mono">
                              <Check size={14} /> SCREENSHOT ATTACHED
                            </p>
                            <p className="text-[10px] text-cream/40 mt-1 font-mono">
                              Click box to re-select image
                            </p>
                          </div>
                        </div>
                      ) : (
                        <>
                          <Upload
                            size={24}
                            className="text-cream/40 group-hover:text-gold transition-colors mb-2"
                          />
                          <span className="text-xs text-cream/70 group-hover:text-cream transition-colors font-mono">
                            Click to attach UPI payment receipt screenshot
                          </span>
                          <span className="text-[10px] text-cream/40 mt-1 font-mono">
                            PNG, JPG, JPEG accepted (up to 5MB)
                          </span>
                        </>
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                    </label>
                  </div>

                  {/* 5. Encouragement message */}
                  <Textarea
                    label="Message of Encouragement (Optional)"
                    placeholder="Leave a message for the children and women supported by this drive..."
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
                        Submitting Contribution Receipt...
                      </span>
                    ) : (
                      <span className="flex items-center justify-center gap-2">
                        <Heart size={15} className="fill-current" /> Submit Contribution Receipt (₹{currentAmountValue.toLocaleString("en-IN")})
                      </span>
                    )}
                  </button>
                </form>
              )}
            </div>

            {/* Right Column: Startly QR Box & UPI Details */}
            <div className="space-y-6">

              {/* Startly QR Payment Box */}
              <div className="border-2 border-white/20 bg-[#140b24] p-6 sm:p-7 shadow-[6px_6px_0px_0px_#000000] space-y-4">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <div className="inline-flex items-center gap-2 text-xs font-mono font-bold uppercase text-gold">
                    <QrCode size={14} /> STEP 1: SCAN &amp; PAY
                  </div>
                  <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 font-bold">
                    Startly Innovations
                  </span>
                </div>

                {/* QR Code Container */}
                <div className="mx-auto w-72 h-72 sm:w-80 sm:h-80 max-w-full border-2 border-white/20 bg-white p-3 shadow-[4px_4px_0px_0px_#000000] flex items-center justify-center">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/upi-qr.png"
                    alt="Startly Innovations UPI Payment QR Code — PhonePe"
                    className="w-full h-full object-contain"
                  />
                </div>

                <div className="space-y-2 text-center">
                  <p className="text-sm font-bold text-cream">
                    Pay via PhonePe to{" "}
                    <span className="text-gold font-mono font-black">
                      Startly Innovations
                    </span>
                  </p>
                  <p className="text-xs text-cream/60 font-sans">
                    Scan QR using PhonePe · also accepted via Google Pay, Paytm, BHIM &amp; any UPI app
                  </p>
                </div>

                {/* UPI ID row with copy button */}
                <div className="flex items-center justify-between gap-3 bg-[#0b0714] border border-white/15 px-4 py-2.5 rounded-none shadow-[2px_2px_0px_0px_#000000]">
                  <div>
                    <span className="text-[9px] text-cream/40 font-mono uppercase tracking-widest block">UPI ID</span>
                    <span className="text-sm font-mono font-bold text-gold">{OFFICIAL_UPI_ID}</span>
                  </div>
                  <button
                    type="button"
                    onClick={handleCopyUpi}
                    title="Copy UPI ID"
                    className="shrink-0 p-2 border border-white/20 hover:border-gold hover:text-gold text-cream/60 transition-colors"
                  >
                    {copiedUpi ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                  </button>
                </div>

                {/* Open UPI App button */}
                <a
                  href={UPI_DEEP_LINK}
                  className="flex items-center justify-center gap-2 w-full py-3 px-4 text-xs font-bold uppercase tracking-wider text-white border-2 border-black shadow-[3px_3px_0px_0px_#000000] hover:shadow-[5px_5px_0px_0px_#000000] hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 transition-all"
                  style={{ background: "#5f259f" }}
                >
                  <Smartphone size={15} />
                  Open UPI App to Pay
                </a>

                <div className="border-t border-white/10 pt-3 space-y-2 text-xs font-sans text-cream/80">
                  <div className="flex items-start gap-2">
                    <CheckCircle2 size={14} className="text-gold shrink-0 mt-0.5" />
                    <span>Copy transaction UTR number after payment</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 size={14} className="text-gold shrink-0 mt-0.5" />
                    <span>Paste in the form &amp; upload receipt screenshot</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 size={14} className="text-gold shrink-0 mt-0.5" />
                    <span>100% of proceeds go to grassroots beneficiaries</span>
                  </div>
                </div>
              </div>

              {/* Inquiry Helpline Card */}
              <div className="border-2 border-gold/30 bg-[#0b0714] p-5 shadow-[4px_4px_0px_0px_#000000] space-y-2">
                <div className="flex items-center gap-2 text-xs font-mono font-bold text-gold uppercase tracking-wider">
                  <Phone size={13} />
                  <span>Contribution Support</span>
                </div>
                <p className="text-xs text-cream/70 font-sans leading-relaxed">
                  Have an inquiry or corporate matching donation? Reach out directly via WhatsApp:
                </p>
                <div className="flex flex-wrap gap-2 pt-1 font-mono text-xs">
                  <a href="https://wa.me/918797228078" target="_blank" rel="noreferrer" className="text-gold hover:text-white underline">Anushka</a>
                  <span>•</span>
                  <a href="https://wa.me/919311679175" target="_blank" rel="noreferrer" className="text-gold hover:text-white underline">Sarthak</a>
                  <span>•</span>
                  <a href="https://wa.me/919214972080" target="_blank" rel="noreferrer" className="text-gold hover:text-white underline">Rigved</a>
                  <span>•</span>
                  <a href="https://wa.me/919942203720" target="_blank" rel="noreferrer" className="text-gold hover:text-white underline">Saanvi</a>
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
              className="relative max-w-xl w-full bg-[#140b24] border-2 border-gold/40 p-4 shadow-2xl max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setShowPosterModal(false)}
                className="absolute top-4 right-4 p-2 bg-black/60 text-cream/80 hover:text-gold transition-colors z-10 border border-white/20 cursor-pointer"
              >
                <X size={20} />
              </button>
              <Image
                src="/ngo-poster.jpeg"
                alt="A Step Taken Together Poster"
                width={800}
                height={1040}
                className="w-full h-auto object-contain border border-white/20"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
