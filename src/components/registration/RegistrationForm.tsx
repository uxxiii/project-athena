"use client";

import { useCallback, useEffect, useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  Check,
  Upload,
  Loader2,
  AlertCircle,
  Award,
} from "lucide-react";
import { committees, getCommitteeById, IPL_TEAMS } from "@/data/committees";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Select } from "@/components/ui/Select";
import { Badge } from "@/components/ui/Badge";
import {
  registrationSchema,
  type RegistrationFormData,
  STEP_FIELDS,
} from "@/lib/validations";
import type { AvailabilitySnapshot, Registration } from "@/lib/types";

import { PaymentPricingBanner } from "./PaymentPricingBanner";
import { RegistrationLaunchBanner } from "./RegistrationLaunchBanner";
import { isRegistrationLaunched } from "@/lib/pricing";
import { getCurrentRegistrationFee, isDiwaliSaleActive } from "@/lib/diwali";
import { KajuKatliModal } from "@/components/festive/KajuKatliModal";

const STEPS = [
  "Personal Credentials",
  "Committee Choices",
  "Portfolio Preferences",
  "Summit Experience",
  "Payment Verification",
  "Allocation Confirmation",
];

interface RegistrationFormProps {
  eventSlug: string;
}

export function RegistrationForm({ eventSlug }: RegistrationFormProps) {
  const [step, setStep] = useState(1);
  const [isFormLaunched, setIsFormLaunched] = useState(false);
  const [availability, setAvailability] = useState<AvailabilitySnapshot | null>(null);
  const [, setAvailabilityError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [result, setResult] = useState<Registration | null>(null);
  const [uploadMessage, setUploadMessage] = useState<string | null>(null);
  const [showKajuKatli, setShowKajuKatli] = useState(false);
  const [selectedIplTeam, setSelectedIplTeam] = useState<string>("Chennai Super Kings");

  const effectiveFee = getCurrentRegistrationFee();
  const isDiwaliActive = isDiwaliSaleActive();

  useEffect(() => {
    setIsFormLaunched(isRegistrationLaunched());
  }, []);

  const form = useForm<RegistrationFormData>({
    resolver: zodResolver(registrationSchema) as never,
    defaultValues: {
      name: "",
      phone: "",
      email: "",
      classYear: "",
      institution: "",
      committeePreferences: ["", "", ""] as [string, string, string],
      portfolioPreferences: {},
      munExperience: "",
      reference: "",
      paymentScreenshot: "",
      isUnscRegistration: false,
    },
    mode: "onChange",
  });

  const {
    register,
    watch,
    setValue,
    trigger,
    getValues,
    formState: { errors },
  } = form;

  const committeePrefs = watch("committeePreferences");
  const portfolioPrefs = watch("portfolioPreferences");
  const screenshotValue = watch("paymentScreenshot");

  const fetchAvailability = useCallback(async () => {
    try {
      const res = await fetch("/api/availability", {
        cache: "no-store",
      });

      if (!res.ok) {
        throw new Error(`Availability request failed with ${res.status}`);
      }

      const contentType = res.headers.get("content-type") ?? "";
      if (!contentType.includes("application/json")) {
        throw new Error("Availability endpoint returned a non-JSON response");
      }

      const data = (await res.json()) as AvailabilitySnapshot;
      setAvailability(data);
      setAvailabilityError(null);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error";
      setAvailabilityError(`Failed to fetch availability: ${message}`);
    }
  }, []);

  useEffect(() => {
    fetchAvailability();
    const interval = setInterval(fetchAvailability, 10000);
    return () => clearInterval(interval);
  }, [fetchAvailability]);

  const validateStep = async () => {
    const fields = STEP_FIELDS[step];

    if (step === 1) {
      return trigger([
        "name",
        "phone",
        "email",
        "classYear",
        "institution",
      ]);
    }

    if (step === 2) {
      return trigger(["committeePreferences"]);
    }

    if (step === 3) {
      // Validate that each chosen committee has 3 portfolios selected
      const selected = committeePrefs.filter(Boolean);
      for (const cid of selected) {
        const prefs = portfolioPrefs[cid] ?? ["", "", ""];
        if (!prefs[0] || !prefs[1] || !prefs[2]) {
          setSubmitError(`Please select all 3 portfolio choices for ${cid.toUpperCase()}`);
          return false;
        }
      }
      setSubmitError(null);
      return true;
    }

    if (step === 5) {
      const screenshot = getValues("paymentScreenshot");
      if (screenshot?.trim()) {
        return true;
      }
      return trigger(["paymentScreenshot"]);
    }

    if (!fields) return true;
    return trigger(fields as (keyof RegistrationFormData)[]);
  };

  const nextStep = async () => {
    const valid = await validateStep();
    if (valid && step < 6) setStep(step + 1);
  };

  const prevStep = () => {
    if (step > 1) setStep(step - 1);
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
      setValue("paymentScreenshot", reader.result as string, {
        shouldValidate: true,
      });
      setUploadMessage("Payment receipt uploaded successfully.");
    };
    reader.readAsDataURL(file);
  };

  const onSubmit: SubmitHandler<RegistrationFormData> = async (data) => {
    const finalScreenshot = data.paymentScreenshot?.trim();
    if (!finalScreenshot) {
      setSubmitError("Please upload a payment screenshot before submitting.");
      return;
    }

    setLoading(true);
    setSubmitError(null);

    try {
      const normalizedData = {
        ...data,
        eventSlug,
        isUnscRegistration: false,
      };

      const res = await fetch("/api/registrations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(normalizedData),
      });

      const json = await res.json();

      if (!res.ok) {
        setSubmitError(json.error ?? "Registration failed");
        return;
      }

      setResult(json.registration);
      setStep(6);
      setShowKajuKatli(true);
      fetchAvailability();
    } catch {
      setSubmitError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const getCommitteeOptions = (exclude: string[] = []) =>
    committees.map((c) => {
      const avail = availability?.committees[c.id];
      const isFull = avail?.isFull ?? false;
      const availabilityText = `${avail?.available ?? c.maxDelegates} seats left`;
      const elig = c.eligibility === "school_only" ? " [School Only]" : " [School & College]";
      return {
        value: c.id,
        label: `${c.name} — ${c.fullName}${elig}${isFull ? " [FULL]" : ` (${availabilityText})`}`,
        disabled: isFull || exclude.includes(c.id),
      };
    });

  const getPortfolioOptions = (
    committeeId: string,
    exclude: string[] = []
  ) => {
    const committee = getCommitteeById(committeeId);
    if (!committee) return [];

    if (committeeId === "ipl") {
      return committee.portfolios
        .filter((p) => p.team === selectedIplTeam)
        .map((p) => {
          const isTaken = availability?.portfolios[committeeId]?.[p.id]?.taken ?? false;
          return {
            value: p.id,
            label: `${p.role ?? p.name}${isTaken ? " [TAKEN]" : ""}`,
            disabled: isTaken || exclude.includes(p.id),
          };
        });
    }

    return committee.portfolios.map((p) => {
      const isTaken = availability?.portfolios[committeeId]?.[p.id]?.taken ?? false;
      const groupLabel = p.team ? ` [${p.team}]` : p.group ? ` [${p.group}]` : "";
      return {
        value: p.id,
        label: `${p.name}${groupLabel}${isTaken ? " [TAKEN]" : ""}`,
        disabled: isTaken || exclude.includes(p.id),
      };
    });
  };

  const updateCommitteePref = (index: number, value: string) => {
    const current = [...committeePrefs] as [string, string, string];
    current[index] = value;
    setValue("committeePreferences", current, { shouldValidate: true });

    if (value && !portfolioPrefs[value]) {
      if (value === "ipl") {
        const teamSlug = selectedIplTeam.toLowerCase().replace(/[^a-z0-9]+/g, "-");
        setValue(
          "portfolioPreferences",
          {
            ...portfolioPrefs,
            ipl: [
              `${teamSlug}-owner`,
              `${teamSlug}-co-owner`,
              `${teamSlug}-head-coach`,
            ],
          },
          { shouldValidate: true }
        );
      } else {
        setValue(
          "portfolioPreferences",
          {
            ...portfolioPrefs,
            [value]: ["", "", ""],
          },
          { shouldValidate: true }
        );
      }
    }
  };

  const updatePortfolioPref = (
    committeeId: string,
    index: number,
    value: string
  ) => {
    const current = {
      ...portfolioPrefs,
      [committeeId]: [
        ...(portfolioPrefs[committeeId] ?? ["", "", ""]),
      ] as [string, string, string],
    };
    current[committeeId][index] = value;
    setValue("portfolioPreferences", current, { shouldValidate: true });
  };

  const selectedCommittees = committeePrefs.filter(Boolean);

  return (
    <section id="register" className="py-20 scroll-mt-24 relative">
      <div className="filigree-divider mb-16" />

      <div className="mx-auto max-w-3xl px-6">
        {!isFormLaunched ? (
          <RegistrationLaunchBanner onLaunch={() => setIsFormLaunched(true)} />
        ) : (
          <>
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12 space-y-3"
            >
              <div className="inline-block transform -rotate-1">
                <span className="px-4 py-1.5 bg-gold border-2 border-black text-[#0b0714] font-black text-xs uppercase tracking-wider shadow-[3px_3px_0px_0px_#000000]">
                  Athena Summit 2026 Registration Dossier
                </span>
              </div>
              <h2 className="font-heading text-4xl sm:text-5xl font-extrabold uppercase tracking-tight text-cream">
                Delegate <span className="text-gold">Registration</span>
              </h2>
              <p className="text-cream/70 text-sm max-w-md mx-auto font-sans font-normal">
                Complete the 5 registration steps to submit your portfolio preferences and obtain immediate allocation.
              </p>
            </motion.div>

            {/* Step indicator */}
            <div className="mb-12 relative px-2">
              <div className="flex items-center justify-between relative">
                <div className="absolute top-4 left-6 right-6 h-0.5 bg-white/10 -z-10" />
                {STEPS.map((label, i) => {
                  const stepNum = i + 1;
                  const isActive = step === stepNum;
                  const isComplete = step > stepNum;
                  return (
                    <div key={label} className="flex flex-col items-center flex-1">
                      <div
                        className={`flex h-9 w-9 items-center justify-center text-xs font-mono font-bold transition-all border-2 ${
                          isComplete
                            ? "bg-gold text-[#0b0714] border-black shadow-[2px_2px_0px_0px_#000000]"
                            : isActive
                              ? "bg-purple-light text-cream border-gold shadow-[2px_2px_0px_0px_#000000]"
                              : "bg-[#0b0714] border-white/20 text-cream/40"
                        }`}
                      >
                        {isComplete ? <Check size={14} /> : stepNum}
                      </div>
                      <span
                        className={`mt-2.5 hidden sm:block text-[10px] tracking-wider text-center uppercase font-mono font-bold transition-colors ${
                          isActive ? "text-gold" : "text-cream/40"
                        }`}
                      >
                        {label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Form Container */}
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="bg-[#140b24] border-2 border-white/20 p-6 sm:p-10 shadow-[6px_6px_0px_0px_#000000] relative"
            >
              <AnimatePresence mode="wait">
                {/* STEP 1: PERSONAL INFO */}
                {step === 1 && (
                  <motion.div
                    key="step1"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-5"
                  >
                    <div className="border-b border-white/10 pb-4 mb-2">
                      <span className="text-[10px] uppercase tracking-[0.2em] text-gold/90 font-mono font-bold block">
                        Step 01 / 05
                      </span>
                      <h3 className="font-heading text-2xl font-extrabold uppercase text-cream tracking-tight">
                        Personal Credentials
                      </h3>
                      <p className="text-xs text-cream/50 mt-0.5">
                        Enter your verified contact and institutional information
                      </p>
                    </div>

                    <Input
                      label="Full Name"
                      {...register("name")}
                      error={errors.name?.message}
                      placeholder="e.g. Rahul Sharma"
                    />
                    <Input
                      label="WhatsApp Number (for Secretariat coordination)"
                      {...register("phone")}
                      error={errors.phone?.message}
                      placeholder="+91 XXXXX XXXXX"
                    />
                    <Input
                      label="Email Address (All updates & guidelines sent here)"
                      type="email"
                      {...register("email")}
                      error={errors.email?.message}
                      placeholder="rahul@example.com"
                    />
                    <div className="grid sm:grid-cols-2 gap-4">
                      <Input
                        label="Class / Year of Study"
                        {...register("classYear")}
                        error={errors.classYear?.message}
                        placeholder="e.g. 12th Standard / 2nd Year B.A."
                      />
                      <Input
                        label="Institution / School / College"
                        {...register("institution")}
                        error={errors.institution?.message}
                        placeholder="e.g. St. Xavier's College"
                      />
                    </div>
                  </motion.div>
                )}

                {/* STEP 2: COMMITTEE PREFERENCES */}
                {step === 2 && (
                  <motion.div
                    key="step2"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-5"
                  >
                    <div className="border-b border-gold/15 pb-4 mb-2">
                      <span className="text-[10px] uppercase tracking-[0.25em] text-gold font-mono block">
                        Step 02 / 05
                      </span>
                      <h3 className="font-heading text-2xl text-cream">
                        Committee Preferences
                      </h3>
                      <p className="text-xs text-cream/40 mt-0.5">
                        Select your top 3 preferred committees in order of priority (6 committees available)
                      </p>
                    </div>

                    {/* Eligibility Advisory Notice */}
                    <div className="bg-[#0b0714] border border-gold/30 p-4 shadow-[2px_2px_0px_0px_#000] space-y-1.5">
                      <div className="flex items-center gap-2">
                        <span className="text-amber-400 font-mono font-bold text-xs uppercase tracking-wider">
                          ⚠️ Committee Eligibility Guidelines
                        </span>
                      </div>
                      <p className="text-xs text-cream/70 font-sans leading-relaxed">
                        • <strong className="text-cream">UNSC & JPC (Joint Parliamentary Committee):</strong> Restricted exclusively to <strong>School Students Only</strong>.<br />
                        • <strong className="text-cream">Lok Sabha, IPL, International Press (IP), & UN Women:</strong> Open to both <strong>School & College Students</strong>.
                      </p>
                    </div>

                    {[0, 1, 2].map((i) => (
                      <Select
                        key={i}
                        label={`${i === 0 ? "1st" : i === 1 ? "2nd" : "3rd"} Committee Preference`}
                        value={committeePrefs[i] ?? ""}
                        onChange={(e) => updateCommitteePref(i, e.target.value)}
                        options={getCommitteeOptions(
                          committeePrefs.filter((_, idx) => idx !== i)
                        )}
                        error={
                          errors.committeePreferences?.message ??
                          (errors.committeePreferences as unknown as { [key: number]: { message: string } })?.[i]?.message
                        }
                      />
                    ))}
                  </motion.div>
                )}

                {/* STEP 3: PORTFOLIO PREFERENCES */}
                {step === 3 && (
                  <motion.div
                    key="step3"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-8"
                  >
                    <div className="border-b border-gold/15 pb-4 mb-2">
                      <span className="text-[10px] uppercase tracking-[0.25em] text-gold font-mono block">
                        Step 03 / 05
                      </span>
                      <h3 className="font-heading text-2xl text-cream">
                        Portfolio Preferences
                      </h3>
                      <p className="text-xs text-cream/40 mt-0.5">
                        Select 3 portfolio choices for each of your selected committees
                      </p>
                    </div>

                    {selectedCommittees.length === 0 ? (
                      <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-6 text-center text-sm text-amber-300">
                        Please go back to Step 2 and select committee preferences first.
                      </div>
                    ) : (
                      selectedCommittees.map((committeeId) => {
                        const committee = getCommitteeById(committeeId);
                        if (!committee) return null;
                        const prefs = portfolioPrefs[committeeId] ?? ["", "", ""];

                        return (
                          <div key={committeeId} className="glass-card rounded-xl p-5 space-y-4">
                            <div className="border-b border-gold/15 pb-3">
                              <h4 className="font-heading text-xl text-gold">
                                {committee.name} :{" "}
                                <span className="text-cream/70 text-sm font-sans font-light">
                                  {committee.fullName} ({committee.maxDelegates} Seats)
                                </span>
                              </h4>
                            </div>

                            {/* Specialized Team Selector for IPL */}
                            {committeeId === "ipl" && (
                              <div className="bg-[#0b0714] border border-gold/30 p-4 space-y-2 mb-4 shadow-[2px_2px_0px_0px_#000]">
                                <div className="flex items-center justify-between">
                                  <label className="text-xs font-mono font-bold text-gold uppercase tracking-wider">
                                    🏏 Select IPL Franchise (12 Teams)
                                  </label>
                                  <span className="text-[10px] font-mono text-cream/50">5 Roles / Team</span>
                                </div>
                                <Select
                                  value={selectedIplTeam}
                                  onChange={(e) => {
                                    const team = e.target.value;
                                    setSelectedIplTeam(team);
                                    const teamSlug = team.toLowerCase().replace(/[^a-z0-9]+/g, "-");
                                    updatePortfolioPref(committeeId, 0, `${teamSlug}-owner`);
                                    updatePortfolioPref(committeeId, 1, `${teamSlug}-co-owner`);
                                    updatePortfolioPref(committeeId, 2, `${teamSlug}-head-coach`);
                                  }}
                                  options={IPL_TEAMS.map((t) => ({ value: t, label: t }))}
                                />
                                <p className="text-[11px] text-cream/60 font-sans">
                                  Selected: <strong className="text-cream">{selectedIplTeam}</strong>. Please choose your top 3 preferred roles for this franchise:
                                </p>
                              </div>
                            )}

                            {[0, 1, 2].map((i) => (
                              <Select
                                key={i}
                                label={`${i === 0 ? "1st Choice" : i === 1 ? "2nd Choice" : "3rd Choice"} ${committeeId === "ipl" ? "Role" : "Portfolio"}`}
                                value={prefs[i] ?? ""}
                                onChange={(e) =>
                                  updatePortfolioPref(committeeId, i, e.target.value)
                                }
                                options={getPortfolioOptions(
                                  committeeId,
                                  prefs.filter((_, idx) => idx !== i)
                                )}
                              />
                            ))}
                          </div>
                        );
                      })
                    )}
                  </motion.div>
                )}

                {/* STEP 4: EXPERIENCE & REFERENCE */}
                {step === 4 && (
                  <motion.div
                    key="step4"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-5"
                  >
                    <div className="border-b border-gold/15 pb-4 mb-2">
                      <span className="text-[10px] uppercase tracking-[0.25em] text-gold font-mono block">
                        Step 04 / 05
                      </span>
                      <h3 className="font-heading text-2xl text-cream">
                        Summit Experience & Reference
                      </h3>
                      <p className="text-xs text-cream/40 mt-0.5">
                        Help the Secretariat understand your background and achievements
                      </p>
                    </div>

                    <Textarea
                      label="Prior Summit Experience & Awards"
                      {...register("munExperience")}
                      error={errors.munExperience?.message}
                      placeholder="Detail your previous delegation experience, awards (Best Delegate, High Commendation, etc.), executive board roles, or state if first-timer..."
                      className="min-h-32.5"
                    />
                    <Input
                      label="Reference Contact / Vouching Senior"
                      {...register("reference")}
                      error={errors.reference?.message}
                      placeholder="Name and contact of teacher, senior delegate, or institution coordinator"
                    />
                  </motion.div>
                )}

                {/* STEP 5: PAYMENT */}
                {step === 5 && (
                  <motion.div
                    key="step5"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    <div className="border-b border-gold/15 pb-4 mb-2">
                      <span className="text-[10px] uppercase tracking-[0.25em] text-gold font-mono block">
                        Step 05 / 05
                      </span>
                      <h3 className="font-heading text-2xl text-cream">
                        Payment & Screenshot Upload
                      </h3>
                      <p className="text-xs text-cream/40 mt-0.5">
                        Scan the official QR code to complete registration fee payment (₹{effectiveFee.toLocaleString("en-IN")})
                      </p>
                    </div>

                    <PaymentPricingBanner />

                    <div className="border-2 border-white/15 bg-[#0b0714] p-6 text-center space-y-4 shadow-[4px_4px_0px_0px_#000000]">
                      <div className="mx-auto w-48 h-48 border-2 border-white/20 bg-white p-3 shadow-[3px_3px_0px_0px_#000000] flex items-center justify-center">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src="/upi-qr.png"
                          alt="Athena Summit UPI payment QR code"
                          className="w-full h-full object-contain"
                        />
                      </div>

                      <div className="space-y-1">
                        <p className="text-sm font-medium text-cream">
                          Official UPI ID:{" "}
                          <span className="text-gold font-mono font-bold">
                            arnav86011-2@okaxis
                          </span>
                        </p>
                        <p className="text-xs text-cream/50">
                          Accepted via Google Pay, PhonePe, Paytm, BHIM, and all UPI apps
                        </p>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs text-cream/70 uppercase tracking-wider mb-2 font-mono">
                        Upload Payment Screenshot (Max 5MB)
                      </label>
                      <label className="flex flex-col items-center justify-center w-full h-36 border-2 border-dashed border-white/20 hover:border-gold/60 transition-all cursor-pointer bg-[#0b0714] group shadow-[2px_2px_0px_0px_#000000]">
                        {screenshotValue ? (
                          <div className="flex items-center gap-4 p-2">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={screenshotValue}
                              alt="Payment Receipt Preview"
                              className="h-24 w-24 object-cover border border-white/30"
                            />
                            <div className="text-left">
                              <p className="text-xs text-emerald-400 font-medium flex items-center gap-1 font-mono">
                                <Check size={14} /> SCREENSHOT UPLOADED
                              </p>
                              <p className="text-[10px] text-cream/40 mt-1 font-mono">
                                Click box to re-select image
                              </p>
                            </div>
                          </div>
                        ) : (
                          <>
                            <Upload
                              size={28}
                              className="text-cream/40 group-hover:text-gold transition-colors mb-2"
                            />
                            <span className="text-xs text-cream/70 group-hover:text-cream transition-colors font-mono">
                              Click to select payment receipt screenshot
                            </span>
                            <span className="text-[10px] text-cream/40 mt-1 font-mono">
                              PNG, JPG, JPEG accepted
                            </span>
                          </>
                        )}
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          suppressHydrationWarning
                          onChange={handleFileUpload}
                        />
                      </label>
                      {errors.paymentScreenshot && (
                        <p className="mt-1.5 text-xs text-red-400 flex items-center gap-1 font-mono">
                          <AlertCircle size={12} /> {errors.paymentScreenshot.message}
                        </p>
                      )}
                      {uploadMessage && !errors.paymentScreenshot && (
                        <p className="mt-1.5 text-xs text-emerald-400 flex items-center gap-1 font-mono">
                          <Check size={12} /> {uploadMessage}
                        </p>
                      )}
                    </div>
                  </motion.div>
                )}

                {/* STEP 6: CONFIRMATION CERTIFICATE */}
                {step === 6 && result && (
                  <motion.div
                    key="step6"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="space-y-6 text-center py-4"
                  >
                    <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gold/15 ring-2 ring-gold shadow-xl shadow-gold/20">
                      <Award size={40} className="text-gold" />
                    </div>

                    <div className="space-y-2">
                      <span className="text-[10px] tracking-[0.3em] uppercase text-gold font-mono">
                        Registration Confirmed
                      </span>
                      <h3 className="font-heading text-3xl sm:text-4xl text-cream uppercase">
                        Application <span className="text-gold italic font-normal">Under Verification</span>
                      </h3>
                      <p className="text-xs text-cream/70 max-w-md mx-auto font-sans font-light">
                        Your registration has been logged under ID <strong className="font-mono text-gold">{result.id}</strong>. In accordance with conference policy, your committee and portfolio will be dispatched to your email once payment is confirmed.
                      </p>
                    </div>

                    {/* Handcrafted Credential Card */}
                    <div className="rounded-none border-2 border-gold/40 bg-[#0b0714] p-6 text-left space-y-4 shadow-[6px_6px_0px_0px_#000000] relative overflow-hidden">
                      <div className="flex items-center justify-between border-b border-gold/20 pb-3">
                        <div>
                          <span className="font-heading text-lg sm:text-xl text-gold block uppercase font-bold tracking-tight">
                            ATHENA SUMMIT CREDENTIAL PASS
                          </span>
                          <span className="text-[9px] uppercase tracking-widest text-cream/40 font-mono">
                            Chanakya National Law University (CNLU), Patna
                          </span>
                        </div>
                        <Badge variant="warning">Payment Verification in Progress</Badge>
                      </div>

                      <div className="grid gap-3 text-xs font-mono">
                        <div className="flex justify-between py-1 border-b border-white/5">
                          <span className="text-cream/50">DELEGATE ID:</span>
                          <span className="text-gold font-bold">{result.id}</span>
                        </div>
                        <div className="flex justify-between py-1 border-b border-white/5">
                          <span className="text-cream/50">CANDIDATE:</span>
                          <span className="text-cream font-medium">{result.name}</span>
                        </div>
                        <div className="flex justify-between py-1 border-b border-white/5">
                          <span className="text-cream/50">INSTITUTION:</span>
                          <span className="text-cream/80">{result.institution}</span>
                        </div>
                        <div className="flex justify-between py-1 border-b border-white/5">
                          <span className="text-cream/50">CLASS / YEAR:</span>
                          <span className="text-cream/80">{result.classYear}</span>
                        </div>
                        <div className="flex justify-between py-1 border-b border-white/5">
                          <span className="text-cream/50">PREFERENCES SUBMITTED:</span>
                          <span className="text-gold font-bold">
                            {result.committeePreferences
                              ?.map((cId) => getCommitteeById(cId)?.name ?? cId.toUpperCase())
                              .join(" • ")}
                          </span>
                        </div>
                        <div className="flex justify-between py-1">
                          <span className="text-cream/50">REGISTRATION FEE:</span>
                          <span className="text-emerald-400 font-bold">
                            ₹{effectiveFee.toLocaleString("en-IN")} {isDiwaliActive ? "(Diwali Dhamaka Offer)" : ""}{" "}
                            (UPI Receipt Uploaded)
                          </span>
                        </div>
                      </div>

                      {/* Explicit notice about portfolio secrecy until payment is verified */}
                      <div className="bg-[#140b24] border border-gold/30 p-3.5 mt-2 space-y-1">
                        <div className="flex items-center gap-1.5 text-gold text-xs font-mono font-bold uppercase">
                          <span>✉️ Allocation Delivery via Email</span>
                        </div>
                        <p className="text-[11px] text-cream/75 font-sans leading-relaxed">
                          To guarantee fair and uncompromised delegate allotment, your assigned committee and portfolio are <strong>not disclosed on this preliminary screen</strong>. The Executive Secretariat is currently reviewing your payment receipt. Once approved, your official Committee & Portfolio Allocation along with the study background guides will be emailed directly to <strong className="text-cream">{result.email}</strong>.
                        </p>
                      </div>
                    </div>

                    <div className="pt-2 flex flex-wrap justify-center gap-3">
                      <Button
                        type="button"
                        onClick={() => setShowKajuKatli(true)}
                        className="text-xs bg-gold text-[#0b0714] font-bold shadow-[2px_2px_0px_0px_#000]"
                      >
                        🪔 View Diwali Mithai (Kaju Katli)
                      </Button>
                      <Button
                        href="/"
                        variant="outline"
                        className="text-xs border-white/20 text-cream/80"
                      >
                        Return to Athena Homepage
                      </Button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Navigation Controls */}
              {step < 6 && (
                <div className="flex items-center justify-between pt-8 border-t border-white/10 mt-8">
                  {step > 1 ? (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={prevStep}
                      disabled={loading}
                      className="text-xs"
                    >
                      <ChevronLeft size={16} /> Back
                    </Button>
                  ) : (
                    <div />
                  )}

                  {submitError && (
                    <span className="text-xs text-rose-400 font-mono">
                      {submitError}
                    </span>
                  )}

                  {step < 5 ? (
                    <Button
                      type="button"
                      onClick={nextStep}
                      className="text-xs bg-gold text-purple-deep hover:bg-gold-light font-bold"
                    >
                      Next Step <ChevronRight size={16} />
                    </Button>
                  ) : (
                    <Button
                      type="submit"
                      disabled={loading}
                      className="text-xs bg-gold text-purple-deep hover:bg-gold-light font-bold"
                    >
                      {loading ? (
                        <>
                          <Loader2 size={14} className="animate-spin" />
                          Submitting...
                        </>
                      ) : (
                        <>
                          Submit Registration <Check size={14} />
                        </>
                      )}
                    </Button>
                  )}
                </div>
              )}
            </form>
          </>
        )}
      </div>

      <KajuKatliModal
        isOpen={showKajuKatli}
        onClose={() => setShowKajuKatli(false)}
        delegateName={result?.name}
        registrationId={result?.id}
      />
    </section>
  );
}
