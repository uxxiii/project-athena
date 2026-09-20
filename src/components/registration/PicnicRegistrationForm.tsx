"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users,
  Sparkles,
  Copy,
  Check,
  Upload,
  Loader2,
  AlertCircle,
  MapPin,
  ArrowRight,
  PartyPopper,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import type { Registration } from "@/lib/types";

interface PicnicStats {
  totalCapacity: number;
  registeredCount: number;
  seatsRemaining: number;
  isFull: boolean;
  registrationOpen: boolean;
  date: string;
  time: string;
  location: string;
  price: number;
}

export function PicnicRegistrationForm() {
  const [stats, setStats] = useState<PicnicStats>({
    totalCapacity: 100,
    registeredCount: 0,
    seatsRemaining: 100,
    isFull: false,
    registrationOpen: true,
    date: "27th September",
    time: "12:00 PM – 5:00 PM",
    location: "Buddha Smriti Park, Patna",
    price: 100,
  });

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    institution: "",
    classYear: "1st Year College",
    munExperience: "First-Timer / Beginner",
    foodPreference: "Veg Snacks / Dish",
    potluckNote: "",
    reference: "Instagram",
    paymentScreenshot: "",
  });

  const [copiedUpi, setCopiedUpi] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [confirmedRegistration, setConfirmedRegistration] = useState<Registration | null>(null);
  const [uploadMessage, setUploadMessage] = useState<string | null>(null);

  const fetchStats = useCallback(async () => {
    try {
      const res = await fetch("/api/events/mun-picnic/stats", { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      }
    } catch (err) {
      console.error("Failed to load picnic stats:", err);
    }
  }, []);

  useEffect(() => {
    fetchStats();
    const interval = setInterval(() => {
      if (typeof document !== "undefined" && !document.hidden) {
        fetchStats();
      }
    }, 30000);
    return () => clearInterval(interval);
  }, [fetchStats]);

  const handleCopyUpi = () => {
    navigator.clipboard.writeText("6202910742@fam");
    setCopiedUpi(true);
    setTimeout(() => setCopiedUpi(false), 2500);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setUploadMessage("File size exceeds 5MB. Please upload a smaller image.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setFormData((prev) => ({
        ...prev,
        paymentScreenshot: reader.result as string,
      }));
      setUploadMessage("Payment screenshot attached successfully!");
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (stats.isFull) {
      setErrorMsg("Registrations are closed! The 100-seat capacity has been reached.");
      return;
    }

    if (!formData.name.trim() || !formData.phone.trim() || !formData.email.trim()) {
      setErrorMsg("Please fill in your name, phone number, and email address.");
      return;
    }

    if (!formData.paymentScreenshot) {
      setErrorMsg("Please upload your ₹100 UPI payment verification screenshot.");
      return;
    }

    setSubmitting(true);

    try {
      const combinedFoodInfo = formData.potluckNote.trim()
        ? `${formData.foodPreference} (${formData.potluckNote.trim()})`
        : formData.foodPreference;

      const res = await fetch("/api/registrations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eventSlug: "mun-picnic",
          name: formData.name.trim(),
          phone: formData.phone.trim(),
          email: formData.email.trim(),
          institution: formData.institution.trim() || "Independent Delegate",
          classYear: formData.classYear,
          munExperience: formData.munExperience,
          reference: formData.reference,
          foodPreference: combinedFoodInfo,
          paymentScreenshot: formData.paymentScreenshot,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Registration failed. Please try again.");
      }

      setConfirmedRegistration(data.registration);
      fetchStats();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Something went wrong.";
      setErrorMsg(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const percentageFilled = Math.min(
    100,
    Math.round((stats.registeredCount / stats.totalCapacity) * 100)
  );

  return (
    <section id="register" className="py-20 relative scroll-mt-20">
      <div className="section-divider mb-16" />

      <div className="mx-auto max-w-5xl px-6">
        {/* Section Title */}
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-gold/30 bg-gold/10 px-4 py-1 text-gold text-xs font-mono uppercase tracking-widest">
            <Sparkles size={14} className="text-gold" />
            <span>Secure Your Pass</span>
          </div>

          <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl text-cream">
            Register for <span className="text-gradient-gold">MUN Picnic</span>
          </h2>

          <p className="text-cream/60 text-sm sm:text-base leading-relaxed">
            Training workshop, diplomacy games, and a community potluck. All included for just ₹100.
          </p>
        </div>

        {/* 100 Seats Live Capacity Tracker Banner */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="rounded-2xl glass-card border border-gold/30 p-6 sm:p-8 mb-10 shadow-2xl relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-gold/5 rounded-full blur-3xl pointer-events-none" />

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gold/15 text-gold ring-1 ring-gold/30">
                <Users size={20} />
              </div>
              <div>
                <span className="text-[11px] font-mono text-gold tracking-widest uppercase block">
                  Capacity Monitor
                </span>
                <h3 className="font-heading text-lg sm:text-xl text-cream">
                  Strict Limit: <span className="text-gradient-gold">100 Seats Only</span>
                </h3>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {stats.isFull ? (
                <Badge variant="danger">Housefull (100/100 Filled)</Badge>
              ) : (
                <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-1 text-emerald-400 text-xs font-mono">
                  <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>{stats.seatsRemaining} Seats Remaining</span>
                </div>
              )}
            </div>
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-mono text-cream/60">
              <span>{stats.registeredCount} Delegates Registered</span>
              <span>100 Max Capacity</span>
            </div>
            <div className="h-3 w-full bg-purple-dark/80 rounded-full overflow-hidden p-0.5 border border-gold/20">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${percentageFilled}%` }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className={`h-full rounded-full ${
                  stats.isFull
                    ? "bg-red-500"
                    : "bg-gradient-to-r from-gold/80 via-gold to-amber-300 shadow-[0_0_12px_rgba(212,175,55,0.5)]"
                }`}
              />
            </div>
          </div>
        </motion.div>

        {/* Confirmation Modal / Pass Display */}
        <AnimatePresence>
          {confirmedRegistration && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="rounded-2xl border-2 border-gold/50 bg-gradient-to-br from-purple-dark to-purple-deep p-8 text-center space-y-6 shadow-2xl mb-12"
            >
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gold/20 text-gold ring-2 ring-gold/40">
                <PartyPopper size={32} />
              </div>

              <div className="space-y-2">
                <Badge variant="success">Registration Received!</Badge>
                <h3 className="font-heading text-3xl text-cream">
                  Welcome to the <span className="text-gradient-gold">Athena MUN Picnic</span>!
                </h3>
                <p className="text-sm text-cream/70 max-w-md mx-auto">
                  Thank you, <strong>{confirmedRegistration.name}</strong>! Your registration and ₹100 payment receipt have been logged.
                </p>
              </div>

              <div className="max-w-md mx-auto rounded-xl border border-gold/20 bg-purple-deep/70 p-5 text-left text-xs space-y-2.5 font-mono text-cream/80">
                <div className="flex justify-between border-b border-gold/15 pb-2">
                  <span className="text-gold">Pass ID:</span>
                  <span className="text-cream font-bold">{confirmedRegistration.id}</span>
                </div>
                <div className="flex justify-between border-b border-gold/15 pb-2">
                  <span className="text-gold">Date & Time:</span>
                  <span>27th September | 12:00 PM – 5:00 PM</span>
                </div>
                <div className="flex justify-between border-b border-gold/15 pb-2">
                  <span className="text-gold">Venue:</span>
                  <span>Buddha Smriti Park, Patna</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gold">Payment Verification:</span>
                  <span className="text-amber-400 font-semibold">Under Review (Pass via Email)</span>
                </div>
              </div>

              <p className="text-xs text-cream/50 max-w-md mx-auto">
                Our Secretariat team is verifying your payment screenshot. Once approved, you will receive your official entry pass with gate instructions via email at <strong>{confirmedRegistration.email}</strong>.
              </p>

              <div className="pt-2 flex justify-center gap-4">
                <Button
                  href="https://maps.google.com/?q=Buddha+Smriti+Park+Patna"
                  target="_blank"
                  rel="noopener noreferrer"
                  size="md"
                >
                  <MapPin size={16} />
                  <span>View Park Location</span>
                </Button>
                <Button
                  variant="outline"
                  size="md"
                  onClick={() => setConfirmedRegistration(null)}
                >
                  Register Another Delegate
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* The Registration Form */}
        {!confirmedRegistration && (
          <form onSubmit={handleSubmit} className="space-y-8" suppressHydrationWarning>
            <div className="grid lg:grid-cols-12 gap-8 items-start">
              {/* Left Column: Delegate Details */}
              <div className="lg:col-span-7 rounded-2xl glass-card border border-gold/20 p-6 sm:p-8 space-y-6">
                <div className="border-b border-gold/15 pb-4">
                  <span className="text-[10px] font-mono text-gold uppercase tracking-widest block">
                    Step 1 of 2
                  </span>
                  <h3 className="font-heading text-2xl text-cream">Delegate Information</h3>
                  <p className="text-xs text-cream/50 mt-1">
                    Provide your contact details so we can issue your delegate pass.
                  </p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-cream/70 mb-1.5 font-sans">
                      Full Name *
                    </label>
                    <Input
                      placeholder="e.g. Aarav Sharma"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, name: e.target.value }))
                      }
                      required
                    />
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs uppercase tracking-wider text-cream/70 mb-1.5 font-sans">
                        WhatsApp / Phone *
                      </label>
                      <Input
                        type="tel"
                        placeholder="e.g. 9876543210"
                        value={formData.phone}
                        onChange={(e) =>
                          setFormData((prev) => ({ ...prev, phone: e.target.value }))
                        }
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs uppercase tracking-wider text-cream/70 mb-1.5 font-sans">
                        Email Address *
                      </label>
                      <Input
                        type="email"
                        placeholder="e.g. delegate@gmail.com"
                        value={formData.email}
                        onChange={(e) =>
                          setFormData((prev) => ({ ...prev, email: e.target.value }))
                        }
                        required
                      />
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs uppercase tracking-wider text-cream/70 mb-1.5 font-sans">
                        College / School / Institution *
                      </label>
                      <Input
                        placeholder="e.g. Patna University"
                        value={formData.institution}
                        onChange={(e) =>
                          setFormData((prev) => ({ ...prev, institution: e.target.value }))
                        }
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs uppercase tracking-wider text-cream/70 mb-1.5 font-sans">
                        Year / Grade
                      </label>
                      <select
                        suppressHydrationWarning
                        value={formData.classYear}
                        onChange={(e) =>
                          setFormData((prev) => ({ ...prev, classYear: e.target.value }))
                        }
                        className="w-full rounded-sm border border-white/10 bg-navy-light/50 px-4 py-2.5 text-cream outline-none transition-colors focus:border-gold/50 focus:ring-1 focus:ring-gold/30 cursor-pointer text-xs"
                      >
                        <option value="School (Grade 9-10)" className="bg-navy text-cream">School (Grade 9-10)</option>
                        <option value="School (Grade 11-12)" className="bg-navy text-cream">School (Grade 11-12)</option>
                        <option value="1st Year College" className="bg-navy text-cream">1st Year College</option>
                        <option value="2nd Year College" className="bg-navy text-cream">2nd Year College</option>
                        <option value="3rd Year College" className="bg-navy text-cream">3rd Year College</option>
                        <option value="4th Year+ / Postgrad" className="bg-navy text-cream">4th Year+ / Postgrad</option>
                        <option value="Working Professional" className="bg-navy text-cream">Working Professional</option>
                      </select>
                    </div>
                  </div>

                  {/* MUN Experience & Potluck Contribution */}
                  <div className="grid sm:grid-cols-2 gap-4 pt-2">
                    <div>
                      <label className="block text-xs uppercase tracking-wider text-cream/70 mb-1.5 font-sans">
                        Prior MUN Experience
                      </label>
                      <select
                        suppressHydrationWarning
                        value={formData.munExperience}
                        onChange={(e) =>
                          setFormData((prev) => ({ ...prev, munExperience: e.target.value }))
                        }
                        className="w-full rounded-sm border border-white/10 bg-navy-light/50 px-4 py-2.5 text-cream outline-none transition-colors focus:border-gold/50 focus:ring-1 focus:ring-gold/30 cursor-pointer text-xs"
                      >
                        <option value="First-Timer / Beginner" className="bg-navy text-cream">First-Timer (Here to learn!)</option>
                        <option value="1-2 Conferences" className="bg-navy text-cream">1–2 Conferences</option>
                        <option value="3-5 Conferences" className="bg-navy text-cream">3–5 Conferences</option>
                        <option value="6+ Conferences (Veteran)" className="bg-navy text-cream">6+ Conferences (Veteran)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs uppercase tracking-wider text-cream/70 mb-1.5 font-sans">
                        Potluck Contribution / Food
                      </label>
                      <select
                        suppressHydrationWarning
                        value={formData.foodPreference}
                        onChange={(e) =>
                          setFormData((prev) => ({ ...prev, foodPreference: e.target.value }))
                        }
                        className="w-full rounded-sm border border-white/10 bg-navy-light/50 px-4 py-2.5 text-cream outline-none transition-colors focus:border-gold/50 focus:ring-1 focus:ring-gold/30 cursor-pointer text-xs"
                      >
                        <option value="Veg Snacks / Dish" className="bg-navy text-cream">Veg Snacks / Dish</option>
                        <option value="Non-Veg Snacks / Dish" className="bg-navy text-cream">Non-Veg Snacks / Dish</option>
                        <option value="Beverages / Cold Drinks" className="bg-navy text-cream">Beverages / Cold Drinks</option>
                        <option value="Desserts / Pastries / Sweets" className="bg-navy text-cream">Desserts / Pastries / Sweets</option>
                        <option value="Jain / Pure Veg Only" className="bg-navy text-cream">Jain / Pure Veg Only</option>
                        <option value="Other / Surprise" className="bg-navy text-cream">Other Surprise Dish!</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-wider text-cream/70 mb-1.5 font-sans">
                      What are you bringing for the Potluck? (Optional)
                    </label>
                    <Input
                      placeholder="e.g. Samosas, homemade sandwiches, cookies, chips, etc."
                      value={formData.potluckNote}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, potluckNote: e.target.value }))
                      }
                    />
                  </div>
                </div>
              </div>

              {/* Right Column: UPI Payment & QR Code */}
              <div className="lg:col-span-5 rounded-2xl glass-card border border-gold/20 p-6 sm:p-8 space-y-6">
                <div className="border-b border-gold/15 pb-4">
                  <span className="text-[10px] font-mono text-gold uppercase tracking-widest block">
                    Step 2 of 2
                  </span>
                  <h3 className="font-heading text-2xl text-cream">Payment Verification</h3>
                  <div className="flex items-center justify-between mt-1">
                    <p className="text-xs text-cream/50">Fee per delegate:</p>
                    <span className="font-heading text-xl text-gold font-bold">₹100</span>
                  </div>
                </div>

                {/* UPI QR Code Container */}
                <div className="rounded-2xl border border-gold/30 bg-purple-dark/80 p-5 text-center space-y-4 shadow-xl">
                  <div className="mx-auto w-44 h-44 rounded-xl bg-white p-3 shadow-inner flex items-center justify-center">
                    <img
                      src="/upi-qr.png"
                      alt="Athena MUN Picnic UPI QR Code"
                      className="w-full h-full object-contain"
                    />
                  </div>

                  <div className="space-y-1">
                    <div className="inline-flex items-center gap-2 rounded-lg bg-gold/10 px-3 py-1.5 border border-gold/25 text-xs font-mono text-cream">
                      <span>UPI: <strong className="text-gold">6202910742@fam</strong></span>
                      <button
                        type="button"
                        suppressHydrationWarning
                        onClick={handleCopyUpi}
                        className="text-gold hover:text-gold-light transition-colors ml-1"
                        title="Copy UPI ID"
                      >
                        {copiedUpi ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                      </button>
                    </div>
                    {copiedUpi && (
                      <p className="text-[11px] text-emerald-400 font-mono">UPI ID copied to clipboard!</p>
                    )}
                    <p className="text-[11px] text-cream/45">
                      Pay ₹100 via Google Pay, PhonePe, Paytm, or BHIM
                    </p>
                  </div>
                </div>

                {/* Screenshot Upload */}
                <div className="space-y-2">
                  <label className="block text-xs uppercase tracking-wider text-cream/70 font-sans">
                    Upload Payment Screenshot *
                  </label>

                  {formData.paymentScreenshot ? (
                    <div className="rounded-xl border border-emerald-500/40 bg-emerald-500/10 p-3 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <img
                          src={formData.paymentScreenshot}
                          alt="Screenshot preview"
                          className="h-12 w-12 rounded object-cover border border-emerald-500/40"
                        />
                        <div className="text-left">
                          <p className="text-xs text-cream font-medium">Receipt Attached</p>
                          <p className="text-[10px] text-emerald-400 font-mono">Ready for verification</p>
                        </div>
                      </div>
                      <button
                        type="button"
                        suppressHydrationWarning
                        onClick={() =>
                          setFormData((prev) => ({ ...prev, paymentScreenshot: "" }))
                        }
                        className="text-xs text-red-400 hover:underline"
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <label className="flex flex-col items-center justify-center w-full h-28 rounded-xl border-2 border-dashed border-gold/30 hover:border-gold transition-all cursor-pointer bg-purple-deep/40 hover:bg-purple-deep/70 group">
                      <div className="flex flex-col items-center justify-center p-4 text-center">
                        <Upload size={20} className="text-gold/60 group-hover:text-gold transition-colors mb-1.5" />
                        <p className="text-xs text-cream/80 font-medium">
                          Click to upload payment screenshot
                        </p>
                        <p className="text-[10px] text-cream/40 font-mono mt-0.5">
                          PNG, JPG or WebP (Max 5MB)
                        </p>
                      </div>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileUpload}
                        className="hidden"
                        suppressHydrationWarning
                      />
                    </label>
                  )}

                  {uploadMessage && !formData.paymentScreenshot && (
                    <p className="text-xs text-red-400">{uploadMessage}</p>
                  )}
                </div>

                {/* Error Banner */}
                {errorMsg && (
                  <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-3.5 flex items-start gap-2 text-xs text-red-300">
                    <AlertCircle size={16} className="text-red-400 shrink-0 mt-0.5" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                {/* Submit Action */}
                <Button
                  type="submit"
                  disabled={submitting || stats.isFull}
                  size="lg"
                  className="w-full py-3.5 rounded-xl font-semibold uppercase tracking-wider text-xs shadow-xl shadow-gold/20 flex items-center justify-center gap-2"
                >
                  {submitting ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      <span>Confirming Registration...</span>
                    </>
                  ) : stats.isFull ? (
                    <span>Housefull (100/100 Seats Claimed)</span>
                  ) : (
                    <>
                      <span>Complete Registration (₹100)</span>
                      <ArrowRight size={16} />
                    </>
                  )}
                </Button>
              </div>
            </div>
          </form>
        )}
      </div>
    </section>
  );
}
