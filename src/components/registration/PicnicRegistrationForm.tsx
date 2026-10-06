"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users,
  CalendarClock,
  Copy,
  Check,
  Upload,
  Loader2,
  AlertCircle,
  MapPin,
  ArrowRight,
  Clock,
  Smartphone,
  CalendarPlus,
  ShieldCheck,
  RefreshCw,
  Sparkles,
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

const CLASS_YEAR_PILLS = [
  "School (Grade 9-10)",
  "School (Grade 11-12)",
  "1st Year College",
  "2nd Year College",
  "3rd Year College",
  "4th Year+ / Postgrad",
  "Working Professional",
];

const EXPERIENCE_PILLS = [
  { label: "First-Timer 🌿", value: "First-Timer / Beginner" },
  { label: "1–2 MUNs", value: "1-2 Conferences" },
  { label: "3–5 MUNs", value: "3-5 Conferences" },
  { label: "Veteran (6+)", value: "6+ Conferences (Veteran)" },
];

const FOOD_PILLS = [
  { label: "🥗 Veg Snacks / Dish", value: "Veg Snacks / Dish" },
  { label: "🍗 Non-Veg Snacks", value: "Non-Veg Snacks / Dish" },
  { label: "🥤 Drinks & Beverages", value: "Beverages / Cold Drinks" },
  { label: "🍰 Desserts & Sweets", value: "Desserts / Pastries / Sweets" },
  { label: "🌱 Jain / Pure Veg", value: "Jain / Pure Veg Only" },
  { label: "✨ Other Surprise Dish", value: "Other / Surprise" },
];

/**
 * Client-side Canvas Image Compressor
 * Resizes and compresses any phone screenshot (even 10MB+) down to ~200KB in milliseconds.
 */
function compressImage(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    if (file.type === "image/svg+xml" || file.size < 200 * 1024) {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
      return;
    }

    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = (event) => {
      const img = new Image();
      img.onerror = reject;
      img.onload = () => {
        const maxWidth = 1200;
        const maxHeight = 1200;
        let width = img.width;
        let height = img.height;

        if (width > maxWidth || height > maxHeight) {
          if (width / height > maxWidth / maxHeight) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          } else {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          resolve(event.target?.result as string);
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);
        // Compress as JPEG at 0.78 quality for crisp text with tiny file footprint
        const dataUrl = canvas.toDataURL("image/jpeg", 0.78);
        resolve(dataUrl);
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  });
}

export function PicnicRegistrationForm() {
  const [stats, setStats] = useState<PicnicStats>({
    totalCapacity: 100,
    registeredCount: 0,
    seatsRemaining: 100,
    isFull: false,
    registrationOpen: true,
    date: "11th October",
    time: "12:00 PM – 5:00 PM",
    location: "Energy Park, Patna",
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

  const [utrNumber, setUtrNumber] = useState("");
  const [copiedUpi, setCopiedUpi] = useState(false);
  const [compressing, setCompressing] = useState(false);
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

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setCompressing(true);
    setUploadMessage("Optimizing screenshot...");

    try {
      const compressedDataUrl = await compressImage(file);
      setFormData((prev) => ({
        ...prev,
        paymentScreenshot: compressedDataUrl,
      }));
      setUploadMessage(null);
    } catch (err) {
      console.error("Image compression error:", err);
      setUploadMessage("Could not process image. Please try another image file.");
    } finally {
      setCompressing(false);
    }
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
      setErrorMsg("Please attach your ₹100 payment receipt screenshot.");
      return;
    }

    setSubmitting(true);

    try {
      const combinedFoodInfo = formData.potluckNote.trim()
        ? `${formData.foodPreference} (${formData.potluckNote.trim()})`
        : formData.foodPreference;

      const notesPayload = utrNumber.trim()
        ? `UPI UTR: ${utrNumber.trim()}`
        : undefined;

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
          notes: notesPayload,
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

  const upiIntentUrl = "upi://pay?pa=6202910742@fam&pn=Project%20Athena&am=100&cu=INR&tn=Athena%20Picnic";

  return (
    <section id="register" className="py-20 relative scroll-mt-20">
      <div className="section-divider mb-16" />

      <div className="mx-auto max-w-5xl px-6">
        {/* Section Title */}
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-1 text-emerald-300 text-xs font-mono uppercase tracking-widest">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Official Notice • Registration Live 🌿</span>
          </div>

          <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl text-cream">
            Register for <span className="text-gradient-gold">MUN Picnic</span>
          </h2>

          <p className="text-cream/70 text-sm sm:text-base leading-relaxed">
            Official notice: we&apos;re touching grass. 🌿 Training by Eldr Education, potluck, games & networking. All 4 clauses included for just ₹100.
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

        {/* Confirmation State: Application Received & Verification Pending */}
        <AnimatePresence>
          {confirmedRegistration && (
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              className="rounded-3xl border-2 border-gold/40 bg-gradient-to-br from-purple-dark via-purple-deep to-navy p-8 sm:p-10 text-center space-y-6 shadow-2xl mb-12 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-gold/10 rounded-full blur-3xl pointer-events-none" />

              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gold/15 text-gold ring-1 ring-gold/30">
                <Clock size={32} className="text-gold" />
              </div>

              <div className="space-y-2">
                <div className="inline-flex items-center gap-2 rounded-full border border-amber-400/30 bg-amber-400/10 px-3.5 py-1 text-amber-300 text-xs font-mono uppercase tracking-widest">
                  <span className="h-2 w-2 rounded-full bg-amber-400 animate-pulse" />
                  <span>Application Logged • Under Verification</span>
                </div>
                <h3 className="font-heading text-2xl sm:text-3xl text-cream">
                  Registration Received for <span className="text-gradient-gold">MUN Picnic</span>!
                </h3>
                <p className="text-xs sm:text-sm text-cream/70 max-w-md mx-auto leading-relaxed">
                  Thank you, <strong>{confirmedRegistration.name}</strong>! Your application and payment screenshot have been submitted to the Secretariat.
                </p>
              </div>

              <div className="max-w-md mx-auto rounded-2xl border border-gold/25 bg-purple-deep/80 p-5 text-left text-xs space-y-3 font-mono text-cream/80 shadow-inner">
                <div className="flex justify-between border-b border-gold/15 pb-2.5">
                  <span className="text-gold">Application ID:</span>
                  <span className="text-cream font-bold">{confirmedRegistration.id}</span>
                </div>
                <div className="flex justify-between border-b border-gold/15 pb-2.5">
                  <span className="text-gold">Verification Status:</span>
                  <span className="text-amber-300 font-semibold flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-amber-400 animate-pulse" />
                    Secretariat Review
                  </span>
                </div>
                <div className="flex justify-between border-b border-gold/15 pb-2.5">
                  <span className="text-gold">Event Date & Time:</span>
                  <span>11th Oct 2026 • 12 PM – 5 PM</span>
                </div>
                <div className="flex justify-between border-b border-gold/15 pb-2.5">
                  <span className="text-gold">Venue:</span>
                  <span>Energy Park, Patna</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gold">Next Step:</span>
                  <span className="text-emerald-400">Official Pass emailed upon approval</span>
                </div>
              </div>

              <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-4 max-w-md mx-auto text-xs text-cream/80 space-y-1">
                <p className="font-medium text-emerald-300 flex items-center justify-center gap-1.5">
                  <ShieldCheck size={16} /> Official Entry Pass Delivery
                </p>
                <p className="text-[11px] text-cream/60 leading-relaxed">
                  Once our team verifies your ₹100 payment receipt against the UPI bank record, your official delegate entry pass with gate entry details and potluck coordination will be dispatched to <strong>{confirmedRegistration.email}</strong>.
                </p>
              </div>

              <div className="pt-2 flex flex-wrap justify-center gap-3">
                <Button
                  href="https://calendar.google.com/calendar/render?action=TEMPLATE&text=Athena+MUN+Picnic&dates=20261011T063000Z/20261011T113000Z&details=Training+Workshop+by+Eldr+Education,+Community+Potluck,+Diplomatic+Games+at+Energy+Park,+Patna&location=Energy+Park,+Patna"
                  target="_blank"
                  rel="noopener noreferrer"
                  size="md"
                  variant="primary"
                >
                  <CalendarPlus size={16} />
                  <span>Add to Google Calendar</span>
                </Button>
                <Button
                  href="https://maps.google.com/?q=Energy+Park+Patna"
                  target="_blank"
                  rel="noopener noreferrer"
                  variant="outline"
                  size="md"
                >
                  <MapPin size={16} />
                  <span>Park Directions</span>
                </Button>
                <Button
                  variant="ghost"
                  size="md"
                  onClick={() => {
                    setConfirmedRegistration(null);
                    setFormData({
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
                    setUtrNumber("");
                  }}
                >
                  <RefreshCw size={14} />
                  <span>Register Another Delegate</span>
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Coming Soon if Closed */}
        {!confirmedRegistration && !stats.registrationOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="rounded-2xl glass-card border border-gold/30 p-8 sm:p-12 text-center space-y-6 shadow-2xl relative overflow-hidden"
          >
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gold/15 text-gold ring-2 ring-gold/30">
              <CalendarClock size={30} />
            </div>

            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 rounded-full border border-gold/30 bg-gold/10 px-4 py-1 text-gold text-xs font-mono uppercase tracking-widest">
                <span className="h-2 w-2 rounded-full bg-gold animate-pulse" />
                <span>Opening Soon</span>
              </div>
              <h3 className="font-heading text-2xl sm:text-3xl text-cream">
                Registrations Will Open <span className="text-gradient-gold">Shortly</span>
              </h3>
              <p className="text-sm text-cream/60 max-w-md mx-auto leading-relaxed">
                We&apos;re preparing the registration portal for the Athena MUN Picnic. Stay tuned — registrations will be live very soon!
              </p>
            </div>
          </motion.div>
        )}

        {/* The Frictionless Registration Form */}
        {!confirmedRegistration && stats.registrationOpen && (
          <form onSubmit={handleSubmit} className="space-y-8" suppressHydrationWarning>
            <div className="grid lg:grid-cols-12 gap-8 items-start">
              {/* Left Column: Delegate Information */}
              <div className="lg:col-span-7 rounded-2xl glass-card border border-gold/20 p-6 sm:p-8 space-y-6">
                <div className="border-b border-gold/15 pb-4 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-mono text-gold uppercase tracking-widest block">
                      Step 1 of 2
                    </span>
                    <h3 className="font-heading text-2xl text-cream">Delegate Profile</h3>
                    <p className="text-xs text-cream/50 mt-0.5">
                      Enter your details to generate your delegate verification record.
                    </p>
                  </div>
                  <div className="hidden sm:flex items-center gap-1.5 text-[11px] font-mono text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                    <Sparkles size={13} />
                    <span>Quick Fill Enabled</span>
                  </div>
                </div>

                <div className="space-y-5">
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-cream/70 mb-1.5 font-sans">
                      Full Name *
                    </label>
                    <Input
                      name="name"
                      autoComplete="name"
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
                        name="tel"
                        type="tel"
                        autoComplete="tel"
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
                        name="email"
                        type="email"
                        autoComplete="email"
                        placeholder="e.g. delegate@gmail.com"
                        value={formData.email}
                        onChange={(e) =>
                          setFormData((prev) => ({ ...prev, email: e.target.value }))
                        }
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-wider text-cream/70 mb-1.5 font-sans">
                      College / School / Institution
                    </label>
                    <Input
                      name="organization"
                      autoComplete="organization"
                      placeholder="e.g. Patna University, St. Xavier's, or Independent"
                      value={formData.institution}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, institution: e.target.value }))
                      }
                    />
                  </div>

                  {/* Year / Grade Tap Pills */}
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-cream/70 mb-2 font-sans">
                      Grade / Year
                    </label>
                    <div className="flex flex-wrap gap-2" suppressHydrationWarning>
                      {CLASS_YEAR_PILLS.map((option) => {
                        const isSelected = formData.classYear === option;
                        return (
                          <button
                            key={option}
                            type="button"
                            suppressHydrationWarning
                            onClick={() =>
                              setFormData((prev) => ({ ...prev, classYear: option }))
                            }
                            className={`text-xs px-3 py-1.5 rounded-lg border transition-all cursor-pointer font-sans ${
                              isSelected
                                ? "bg-gold text-purple-deep border-gold font-semibold shadow-md shadow-gold/20"
                                : "bg-purple-deep/40 text-cream/70 border-white/10 hover:border-gold/40 hover:text-cream"
                            }`}
                          >
                            {option}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Prior Experience Tap Pills */}
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-cream/70 mb-2 font-sans">
                      Prior MUN Experience
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2" suppressHydrationWarning>
                      {EXPERIENCE_PILLS.map((exp) => {
                        const isSelected = formData.munExperience === exp.value;
                        return (
                          <button
                            key={exp.value}
                            type="button"
                            suppressHydrationWarning
                            onClick={() =>
                              setFormData((prev) => ({ ...prev, munExperience: exp.value }))
                            }
                            className={`text-xs px-2.5 py-2 rounded-lg border text-center transition-all cursor-pointer font-sans ${
                              isSelected
                                ? "bg-gold text-purple-deep border-gold font-semibold shadow-md shadow-gold/20"
                                : "bg-purple-deep/40 text-cream/70 border-white/10 hover:border-gold/40 hover:text-cream"
                            }`}
                          >
                            {exp.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Potluck Food Contribution Tap Pills */}
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-cream/70 mb-2 font-sans">
                      Clause 1: Potluck Food Contribution
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2" suppressHydrationWarning>
                      {FOOD_PILLS.map((food) => {
                        const isSelected = formData.foodPreference === food.value;
                        return (
                          <button
                            key={food.value}
                            type="button"
                            suppressHydrationWarning
                            onClick={() =>
                              setFormData((prev) => ({ ...prev, foodPreference: food.value }))
                            }
                            className={`text-xs px-3 py-2 rounded-lg border text-left transition-all cursor-pointer font-sans ${
                              isSelected
                                ? "bg-gold text-purple-deep border-gold font-semibold shadow-md shadow-gold/20"
                                : "bg-purple-deep/40 text-cream/70 border-white/10 hover:border-gold/40 hover:text-cream"
                            }`}
                          >
                            {food.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-wider text-cream/70 mb-1.5 font-sans">
                      Specific Dish / Snack (Optional)
                    </label>
                    <Input
                      placeholder="e.g. Samosas, sandwiches, homemade cookies, chips, etc."
                      value={formData.potluckNote}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, potluckNote: e.target.value }))
                      }
                    />
                  </div>
                </div>
              </div>

              {/* Right Column: 1-Tap UPI Payment & Screenshot */}
              <div className="lg:col-span-5 rounded-2xl glass-card border border-gold/20 p-6 sm:p-8 space-y-6">
                <div className="border-b border-gold/15 pb-4">
                  <span className="text-[10px] font-mono text-gold uppercase tracking-widest block">
                    Step 2 of 2
                  </span>
                  <h3 className="font-heading text-2xl text-cream">Payment & Receipt</h3>
                  <div className="flex items-center justify-between mt-1">
                    <p className="text-xs text-cream/50">Delegate Fee:</p>
                    <span className="font-heading text-xl text-gold font-bold">₹100</span>
                  </div>
                </div>

                {/* 1-Tap Mobile UPI Intent Button */}
                <div className="space-y-2">
                  <a
                    href={upiIntentUrl}
                    className="w-full flex items-center justify-center gap-2.5 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 px-4 py-3.5 text-xs font-semibold text-white shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 hover:scale-[1.01] active:scale-[0.99] transition-all text-center group"
                  >
                    <Smartphone size={16} className="text-emerald-100 group-hover:rotate-12 transition-transform" />
                    <span>Pay ₹100 via UPI App (GPay / PhonePe / Paytm)</span>
                  </a>
                  <p className="text-[10px] text-cream/45 text-center leading-relaxed">
                    On mobile, tapping opens your UPI app with ₹100 pre-filled. Pay, take a screenshot, and attach it below!
                  </p>
                </div>

                {/* UPI QR Code Container for Desktop / Manual */}
                <div className="rounded-2xl border border-gold/30 bg-purple-dark/80 p-5 text-center space-y-4 shadow-xl">
                  <div className="mx-auto w-40 h-40 rounded-xl bg-white p-2.5 shadow-inner flex items-center justify-center">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
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
                        className="text-gold hover:text-gold-light transition-colors ml-1 cursor-pointer"
                        title="Copy UPI ID"
                      >
                        {copiedUpi ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                      </button>
                    </div>
                    {copiedUpi && (
                      <p className="text-[11px] text-emerald-400 font-mono">UPI ID copied to clipboard!</p>
                    )}
                    <p className="text-[11px] text-cream/45">
                      Supports Google Pay, PhonePe, Paytm, BHIM, and CRED
                    </p>
                  </div>
                </div>

                {/* Screenshot Upload with Instant Client Auto-Compression */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs uppercase tracking-wider text-cream/70 font-sans">
                    <span>Payment Screenshot *</span>
                    {formData.paymentScreenshot && (
                      <span className="text-[10px] text-emerald-400 font-mono flex items-center gap-1 lowercase">
                        <Check size={12} /> ready
                      </span>
                    )}
                  </div>

                  {formData.paymentScreenshot ? (
                    <div className="rounded-xl border border-emerald-500/40 bg-emerald-500/10 p-3 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={formData.paymentScreenshot}
                          alt="Screenshot preview"
                          className="h-12 w-12 rounded object-cover border border-emerald-500/40"
                        />
                        <div className="text-left">
                          <p className="text-xs text-cream font-medium">Receipt Attached</p>
                          <p className="text-[10px] text-emerald-400 font-mono">Optimized for fast verification</p>
                        </div>
                      </div>
                      <button
                        type="button"
                        suppressHydrationWarning
                        onClick={() =>
                          setFormData((prev) => ({ ...prev, paymentScreenshot: "" }))
                        }
                        className="text-xs text-red-400 hover:underline cursor-pointer"
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <label className="flex flex-col items-center justify-center w-full h-28 rounded-xl border-2 border-dashed border-gold/30 hover:border-gold transition-all cursor-pointer bg-purple-deep/40 hover:bg-purple-deep/70 group">
                      <div className="flex flex-col items-center justify-center p-4 text-center">
                        {compressing ? (
                          <>
                            <Loader2 size={22} className="text-gold animate-spin mb-1.5" />
                            <p className="text-xs text-cream/80 font-medium">Optimizing receipt...</p>
                          </>
                        ) : (
                          <>
                            <Upload size={20} className="text-gold/60 group-hover:text-gold transition-colors mb-1.5" />
                            <p className="text-xs text-cream/80 font-medium">
                              Click or tap to upload receipt
                            </p>
                            <p className="text-[10px] text-cream/40 font-mono mt-0.5">
                              Any screenshot accepted (auto-compressed)
                            </p>
                          </>
                        )}
                      </div>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileUpload}
                        className="hidden"
                        suppressHydrationWarning
                        disabled={compressing}
                      />
                    </label>
                  )}

                  {uploadMessage && !formData.paymentScreenshot && (
                    <p className="text-xs text-amber-300 font-mono">{uploadMessage}</p>
                  )}
                </div>

                {/* Optional UPI Ref / UTR Number */}
                <div className="space-y-1">
                  <label className="block text-xs uppercase tracking-wider text-cream/70 font-sans">
                    UPI Reference / UTR Number <span className="text-cream/40 lowercase font-normal">(optional)</span>
                  </label>
                  <Input
                    placeholder="e.g. 428190382910"
                    value={utrNumber}
                    onChange={(e) => setUtrNumber(e.target.value.replace(/[^0-9a-zA-Z]/g, ""))}
                    maxLength={16}
                    className="font-mono text-xs"
                  />
                  <p className="text-[10px] text-cream/40 leading-relaxed">
                    Optional 12-digit reference number to help Secretariat speed up bank cross-matching.
                  </p>
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
                  disabled={submitting || stats.isFull || compressing}
                  size="lg"
                  className="w-full py-3.5 rounded-xl font-semibold uppercase tracking-wider text-xs shadow-xl shadow-gold/20 flex items-center justify-center gap-2"
                >
                  {submitting ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      <span>Submitting Registration...</span>
                    </>
                  ) : stats.isFull ? (
                    <span>Housefull (100/100 Seats Claimed)</span>
                  ) : (
                    <>
                      <span>Submit Registration (₹100)</span>
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
