"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  Heart,
  BookOpen,
  ShieldCheck,
  QrCode,
  Copy,
  Check,
  Sparkles,
  Upload,
  ExternalLink,
  Maximize2,
  X,
  CheckCircle2,
  HandHeart,
  ArrowDown,
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

const OFFICIAL_UPI_ID = "6202910742@fam";

export default function DonatePage() {
  const [selectedAmount, setSelectedAmount] = useState<number | null>(500);
  const [customAmount, setCustomAmount] = useState<string>("");
  const [copiedUpi, setCopiedUpi] = useState(false);
  const [showPosterModal, setShowPosterModal] = useState(false);

  const [donorName, setDonorName] = useState("");
  const [donorEmail, setDonorEmail] = useState("");
  const [donorPhone, setDonorPhone] = useState("");
  const [transactionRef, setTransactionRef] = useState("");
  const [message, setMessage] = useState("");
  const [screenshotPreview, setScreenshotPreview] = useState<string | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const currentAmountValue =
    selectedAmount !== null
      ? selectedAmount
      : customAmount
      ? parseInt(customAmount, 10) || 0
      : 0;

  const handleCopyUpi = () => {
    navigator.clipboard.writeText(OFFICIAL_UPI_ID);
    setCopiedUpi(true);
    setTimeout(() => setCopiedUpi(false), 2500);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      alert("File size exceeds 5MB limit.");
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => setScreenshotPreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleSubmitProof = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    if (!donorName.trim() || !donorEmail.trim() || !transactionRef.trim()) {
      setErrorMessage("Please fill out your Name, Email, and UPI Transaction Ref ID.");
      return;
    }
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/donations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          donorName, donorEmail, donorPhone, amount: currentAmountValue,
          transactionRef, message, screenshot: screenshotPreview,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Submission failed");
      setSubmittedSuccess(true);
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-screen text-cream overflow-hidden">

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          SECTION 1 — HERO
         ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section className="relative flex items-center overflow-hidden pt-32 pb-24 lg:pt-40 lg:pb-32">
        {/* Full-bleed hero artwork, held behind the copy with a readable left-side wash. */}
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
          {/* Gold ambient orb */}
        </div>

        <div className="relative z-10 mx-auto max-w-7xl px-6 w-full">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-2xl lg:max-w-xl space-y-6"
          >
            {/* Top Pills */}
            <div className="flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center gap-2 rounded-full border border-gold/30 bg-purple-dark/80 px-4 py-1.5 text-xs text-gold font-mono backdrop-blur-md">
                <Heart size={14} className="text-gold fill-gold/20" />
                SOCIETAL MISSION
              </span>
              <span className="text-[10px] text-gold/90 font-mono tracking-widest uppercase bg-gold/10 px-3.5 py-1.5 rounded-full border border-gold/25 backdrop-blur-md">
                DRIVE STARTS ON MONDAY • 07 SEPT. 2026
              </span>
            </div>

            {/* Heading */}
            <h1 className="font-heading text-5xl sm:text-6xl md:text-7xl text-cream leading-[.95] tracking-tight">
              A Step Taken <br />
              <span className="text-gradient-gold italic font-normal">Together</span>
            </h1>

            {/* Subtitle — uses poster content verbatim */}
            <p className="text-cream/80 text-base sm:text-lg leading-relaxed font-sans font-light max-w-2xl">
              This year, we&apos;re putting that belief into action. Alongside our summit, we&apos;re running a fundraiser for local NGOs working on two fronts we genuinely care about — <strong className="text-gold font-medium">giving underprivileged children access to education and opportunity</strong>, and <strong className="text-gold font-medium">supporting marginalized women, including survivors of abuse, through rehabilitation and empowerment programs.</strong>
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-3">
              <a href="#donate-now">
                <Button size="lg" className="rounded-lg px-7 py-3.5 text-xs font-bold uppercase tracking-wider shadow-lg shadow-gold/15">
                  <HandHeart size={16} />
                  <span>Donate Now</span>
                </Button>
              </a>
              <button
                onClick={() => setShowPosterModal(true)}
                className="text-xs text-cream/80 hover:text-gold font-mono uppercase tracking-wider flex items-center gap-2 px-4 py-3 rounded-lg border border-gold/30 hover:border-gold/60 backdrop-blur-md transition-all"
              >
                <Maximize2 size={14} className="text-gold" /> View Official Poster
              </button>
            </div>

            {/* Scroll hint */}
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="pt-6"
            >
              <ArrowDown size={20} className="text-gold/40" />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          SECTION 2 — DUAL PILLARS
         ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section className="py-20 lg:py-24 relative">
        <div className="filigree-divider mb-16" />
        <div className="mx-auto max-w-7xl px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-2xl space-y-3 mb-12"
          >
            <span className="text-xs uppercase tracking-[0.3em] text-gold font-mono">TWO VITAL FRONTS</span>
            <h2 className="font-heading text-4xl sm:text-5xl text-cream">
              Our Core <span className="text-gradient-gold italic font-normal">Societal Pillars</span>
            </h2>
            <p className="text-cream/60 text-sm font-sans font-light">
              Bridging student diplomacy with tangible grassroots empowerment across India.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-5">
            {/* Front 01 */}
            <motion.div
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="glass-card rounded-2xl p-7 sm:p-8 border-gold/20 group relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-gold/10 rounded-full blur-3xl group-hover:bg-gold/15 transition-all" />
              <div className="relative space-y-5">
                <div className="flex items-center justify-between">
                  <span className="text-xs uppercase tracking-[0.25em] text-gold font-mono font-bold">FRONT 01 / EDUCATION</span>
                  <div className="h-10 w-10 rounded-lg bg-gold/10 border border-gold/30 flex items-center justify-center group-hover:bg-gold/20 transition-colors">
                    <BookOpen size={20} className="text-gold" />
                  </div>
                </div>
                <h3 className="font-heading text-3xl text-cream group-hover:text-gold transition-colors">
                  Childhood Access to Education & Opportunity
                </h3>
                <p className="text-cream/70 text-sm leading-relaxed font-sans font-light">
                  Giving underprivileged children access to education, learning supplies, school uniforms, textbooks, and after-school tuition—breaking cycle barriers and opening real opportunities.
                </p>
                <div className="space-y-2.5 border-t border-white/10 pt-4 text-xs font-sans text-cream/80">
                  {["Free textbooks, uniforms, school bags, and stationery",
                    "After-school academic tutoring & mentorship",
                    "Scholarship grants for promising young scholars"].map((item) => (
                    <div key={item} className="flex items-center gap-2">
                      <CheckCircle2 size={14} className="text-gold shrink-0" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
                <div className="pt-4 border-t border-gold/15 flex items-center justify-between text-xs text-gold font-mono">
                  <span>100% Direct Learning Aid</span>
                  <Sparkles size={14} />
                </div>
              </div>
            </motion.div>

            {/* Front 02 */}
            <motion.div
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="glass-card rounded-2xl p-7 sm:p-8 border-gold/20 group relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-purple-glow/15 rounded-full blur-3xl group-hover:bg-purple-glow/20 transition-all" />
              <div className="relative space-y-5">
                <div className="flex items-center justify-between">
                  <span className="text-xs uppercase tracking-[0.25em] text-gold font-mono font-bold">FRONT 02 / REHABILITATION</span>
                  <div className="h-10 w-10 rounded-lg bg-gold/10 border border-gold/30 flex items-center justify-center group-hover:bg-gold/20 transition-colors">
                    <Heart size={20} className="text-gold" />
                  </div>
                </div>
                <h3 className="font-heading text-3xl text-cream group-hover:text-gold transition-colors">
                  Women&apos;s Empowerment & Abuse Recovery
                </h3>
                <p className="text-cream/70 text-sm leading-relaxed font-sans font-light">
                  Supporting marginalized women, including survivors of domestic abuse and social hardship, through rehabilitation programs, vocational skill-building, and financial independence toolkits.
                </p>
                <div className="space-y-2.5 border-t border-white/10 pt-4 text-xs font-sans text-cream/80">
                  {["Vocational tailoring & craft artisan equipment",
                    "Trauma counseling & psychological healing support",
                    "Legal aid and micro-entrepreneurship startup support"].map((item) => (
                    <div key={item} className="flex items-center gap-2">
                      <CheckCircle2 size={14} className="text-gold shrink-0" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
                <div className="pt-4 border-t border-gold/15 flex items-center justify-between text-xs text-gold font-mono">
                  <span>Sustainable Self-Reliance</span>
                  <Sparkles size={14} />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          SECTION 3 — DONATION HUB (UPI Card Elevated Alongside Amount Picker)
         ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section className="py-20 lg:py-24 relative" id="donate-now">
        <div className="filigree-divider mb-16" />
        <div className="mx-auto max-w-7xl px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-xl space-y-3 mb-10"
          >
            <span className="text-xs uppercase tracking-[0.3em] text-gold font-mono">EVERY RUPEE BRINGS HOPE</span>
            <h2 className="font-heading text-4xl sm:text-5xl text-cream">
              Choose Your <span className="text-gradient-gold italic font-normal">Contribution</span>
            </h2>
            <p className="text-cream/65 text-sm font-sans font-light">
              100% of your voluntary contribution reaches partner NGOs directly via our official UPI address.
            </p>
          </motion.div>

          {/* Top Row: UPI Card + Amount Selector Side-by-Side */}
          <div className="grid lg:grid-cols-[minmax(0,1.35fr)_minmax(19rem,.8fr)] gap-5 lg:gap-7 items-start mb-10">
            {/* UPI Payment Card — Compact & Prominent */}
            <div className="order-2 rounded-2xl border border-gold/35 bg-gradient-to-b from-purple-mid/45 to-purple-deep p-6 sm:p-7 shadow-2xl shadow-black/30 space-y-5 text-center lg:sticky lg:top-28">
              <div className="inline-flex items-center gap-2 rounded-full border border-gold/30 bg-gold/10 px-3.5 py-1 text-gold text-xs font-mono">
                <QrCode size={14} /> SCAN TO CONTRIBUTE
              </div>

              <div className="relative group mx-auto w-48 h-48 rounded-2xl bg-white p-3 shadow-xl shadow-black/30 flex items-center justify-center border-2 border-gold/30">
                <Image src="/upi-qr.png" alt="Official UPI QR Code" width={180} height={180} className="w-full h-full object-contain" />
              </div>

              <p className="text-[11px] text-cream/50">GPay • PhonePe • Paytm • BHIM • Any UPI App</p>

              {/* UPI ID + Copy */}
              <div className="rounded-xl bg-black/20 border border-gold/25 p-3 space-y-1.5">
                <span className="text-[9px] uppercase tracking-[0.2em] text-gold/60 block font-mono">OFFICIAL UPI ID</span>
                <div className="flex items-center justify-between gap-2 bg-purple-deep/80 px-3 py-2.5 rounded-lg border border-gold/20">
                  <span className="font-mono text-sm font-bold text-gold tracking-wide select-all">{OFFICIAL_UPI_ID}</span>
                  <button onClick={handleCopyUpi} className="p-1 rounded-md text-cream/70 hover:text-gold hover:bg-gold/10 transition-colors shrink-0" title="Copy">
                    {copiedUpi ? <Check size={16} className="text-emerald-400" /> : <Copy size={16} />}
                  </button>
                </div>
                {copiedUpi && <p className="text-[10px] text-emerald-400 font-mono">✓ Copied!</p>}
              </div>

              {/* Direct UPI Link */}
              <a
                href={`upi://pay?pa=${OFFICIAL_UPI_ID}&pn=Athena%20Summit%20Fundraiser&tn=NGO%20Societal%20Fundraiser&cu=INR`}
                className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-gold to-gold-dark text-purple-deep font-bold text-xs uppercase tracking-wider py-3 shadow-lg shadow-gold/15 hover:brightness-110 transition-all"
              >
                Open UPI App <ExternalLink size={13} />
              </a>

              <div className="border-t border-gold/15 pt-3 text-left text-[11px] text-cream/50 space-y-1">
                <div className="flex items-center gap-1.5 text-gold font-mono font-medium text-xs">
                  <ShieldCheck size={14} /> 100% Direct NGO Remittance
                </div>
                <p>All donations are audited and remitted in full to partner NGOs.</p>
              </div>
            </div>

            {/* Amount Selector + Impact Story */}
            <div className="order-1 space-y-5">
              {/* Amount Grid */}
              <div className="rounded-2xl border border-gold/25 bg-purple-dark/55 p-6 sm:p-8 shadow-xl shadow-black/15">
                <label className="block text-xs uppercase tracking-wider text-gold font-mono mb-4">Select Donation Amount (₹ INR)</label>
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
                  {PRESET_AMOUNTS.map((amt) => (
                    <button
                      key={amt}
                      onClick={() => { setSelectedAmount(amt); setCustomAmount(""); }}
                      className={`py-3.5 px-2 rounded-lg text-sm font-mono font-bold transition-all border ${
                        selectedAmount === amt
                          ? "bg-gold text-purple-deep border-gold shadow-lg shadow-gold/25 -translate-y-0.5"
                          : "bg-purple-deep/70 text-cream/80 border-gold/20 hover:border-gold/50 hover:bg-purple-deep/90 hover:-translate-y-0.5"
                      }`}
                    >
                      ₹{amt.toLocaleString("en-IN")}
                    </button>
                  ))}
                </div>
                <div className="mt-4">
                  <Input
                    placeholder="Or enter custom amount in ₹ INR"
                    type="number"
                    value={customAmount}
                    onChange={(e) => { setCustomAmount(e.target.value); setSelectedAmount(null); }}
                    className="font-mono text-sm"
                  />
                </div>
              </div>

              {/* Impact Breakdown */}
              <motion.div
                key={currentAmountValue}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-xl border border-gold/25 bg-gold/5 p-5 sm:p-6 space-y-2"
              >
                <div className="flex items-center gap-2 text-gold text-xs font-mono uppercase tracking-wider">
                  <Sparkles size={16} />
                  <span>Tangible Impact of ₹{currentAmountValue.toLocaleString("en-IN")}</span>
                </div>
                <p className="text-cream/90 text-sm font-sans font-medium leading-relaxed">
                  {IMPACT_TIERS[currentAmountValue] ||
                    (currentAmountValue > 0
                      ? `Your generous gift of ₹${currentAmountValue.toLocaleString("en-IN")} directly accelerates educational kits and rehabilitation aid for local families.`
                      : "Select or enter an amount to view direct impact breakdown.")}
                </p>
              </motion.div>
            </div>
          </div>

          {/* ── Donor Proof / Receipt Form ──────────────────────────────── */}
          <div className="velvet-card max-w-3xl rounded-2xl p-6 sm:p-8 border border-gold/20 shadow-xl lg:-mt-64">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-6">
              <div>
                <h3 className="font-heading text-2xl text-gold">Log Contribution Details</h3>
                <p className="text-xs text-cream/50 mt-0.5">Submit your transaction reference for an official donor thank-you certificate.</p>
              </div>
              <span className="text-[11px] text-cream/30 font-mono">Optional Verification</span>
            </div>

            {submittedSuccess ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="rounded-2xl border border-emerald-500/40 bg-emerald-950/30 p-8 text-center space-y-3"
              >
                <CheckCircle2 size={40} className="text-emerald-400 mx-auto" />
                <h4 className="font-heading text-2xl text-emerald-300">Thank You For Your Generosity!</h4>
                <p className="text-xs text-cream/80 font-sans leading-relaxed max-w-md mx-auto">
                  Your contribution receipt has been logged successfully. The Secretariat and our NGO partners express deepest gratitude.
                </p>
                <Button size="sm" variant="outline" onClick={() => setSubmittedSuccess(false)} className="mt-2 text-xs">
                  Submit Another Contribution
                </Button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmitProof} className="space-y-5">
                {errorMessage && (
                  <div className="text-xs text-rose-300 bg-rose-950/40 border border-rose-500/30 p-3 rounded-lg">{errorMessage}</div>
                )}

                <div className="grid sm:grid-cols-2 gap-4">
                  <Input label="Full Name *" placeholder="Your Name" value={donorName} onChange={(e) => setDonorName(e.target.value)} required />
                  <Input label="Email Address *" type="email" placeholder="your@email.com" value={donorEmail} onChange={(e) => setDonorEmail(e.target.value)} required />
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <Input label="Phone Number (Optional)" placeholder="+91 98765 43210" value={donorPhone} onChange={(e) => setDonorPhone(e.target.value)} />
                  <Input label="UPI Transaction Ref / UTR ID *" placeholder="e.g. 324156789012" value={transactionRef} onChange={(e) => setTransactionRef(e.target.value)} required />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-cream/70 mb-1">Attach Receipt Screenshot (Optional, Max 5MB)</label>
                  <label className="flex items-center justify-center p-4 border border-dashed border-gold/30 rounded-xl bg-purple-deep/40 hover:border-gold cursor-pointer transition-colors">
                    {screenshotPreview ? (
                      <div className="flex items-center gap-3">
                        <Image src={screenshotPreview} alt="Receipt" width={40} height={40} className="rounded border border-gold object-cover" />
                        <span className="text-xs text-emerald-400 font-mono flex items-center gap-1"><Check size={14} /> Uploaded</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-xs text-cream/60">
                        <Upload size={16} className="text-gold" /> Click to upload payment screenshot
                      </div>
                    )}
                    <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                  </label>
                </div>

                <Textarea label="Message of Encouragement (Optional)" placeholder="Leave a message for the children and women supported by this drive..." value={message} onChange={(e) => setMessage(e.target.value)} />

                <Button type="submit" disabled={isSubmitting} className="w-full rounded-xl py-3 font-semibold uppercase tracking-wider text-xs shadow-lg shadow-gold/20">
                  {isSubmitting ? "Logging Contribution..." : "Submit Contribution Receipt"}
                </Button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* ━━━ Poster Modal ━━━ */}
      <AnimatePresence>
        {showPosterModal && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
            onClick={() => setShowPosterModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}
              className="relative max-w-xl w-full bg-purple-deep border border-gold/40 p-4 rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <button onClick={() => setShowPosterModal(false)} className="absolute top-4 right-4 p-2 rounded-full bg-black/60 text-cream/80 hover:text-gold transition-colors z-10">
                <X size={20} />
              </button>
              <Image src="/ngo-poster.jpeg" alt="A Step Taken Together Poster" width={800} height={1040} className="rounded-xl w-full h-auto object-contain" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
