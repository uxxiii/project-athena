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
  QrCode,
  Sparkles,
  AlertCircle,
  Award,
} from "lucide-react";
import { committees, getCommitteeById } from "@/data/committees";
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
  const [availability, setAvailability] = useState<AvailabilitySnapshot | null>(
    null
  );
  const [availabilityError, setAvailabilityError] = useState<string | null>(
    null
  );
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [result, setResult] = useState<Registration | null>(null);
  const [uploadMessage, setUploadMessage] = useState<string | null>(null);
  const [iplTeamSelections, setIplTeamSelections] = useState<Record<string, string>>({});

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
      unscDelegate: undefined,
      unscDelegatePortfolioPreferences: ["", "", ""] as [string, string, string],
    },
    mode: "onChange",
  });

  const { register, watch, setValue, trigger, getValues, formState: { errors } } = form;
  const committeePrefs = watch("committeePreferences");
  const portfolioPrefs = watch("portfolioPreferences");
  const unscDelegatePortfolioPrefs = watch("unscDelegatePortfolioPreferences");
  const screenshotValue = watch("paymentScreenshot");
  const isUnscRegistration = Boolean(watch("isUnscRegistration"));

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
      const personalValid = await trigger([
        "name",
        "phone",
        "email",
        "classYear",
        "institution",
      ]);
      if (!personalValid) return false;

      if (!isUnscRegistration) return true;

      return trigger([
        "unscDelegate.name",
        "unscDelegate.phone",
        "unscDelegate.email",
        "unscDelegate.classYear",
        "unscDelegate.institution",
      ]);
    }

    if (step === 2 && isUnscRegistration) {
      setValue(
        "committeePreferences",
        ["unsc", "unsc", "unsc"] as [string, string, string],
        { shouldValidate: true }
      );
      return true;
    }

    if (step === 3 && isUnscRegistration) {
      return trigger(["unscDelegatePortfolioPreferences"]);
    }

    if (step === 5) {
      const screenshot = getValues("paymentScreenshot");
      if (screenshot?.trim()) {
        return true;
      }
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

    setUploadMessage("Receipt uploaded successfully. We’ll review it shortly.");

    const reader = new FileReader();
    reader.onload = () => {
      setValue("paymentScreenshot", reader.result as string, {
        shouldValidate: true,
      });
      setUploadMessage("Receipt uploaded successfully. We’ll review it shortly.");
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
        isUnscRegistration: Boolean(isUnscRegistration),
        unscDelegate: isUnscRegistration ? data.unscDelegate ?? null : null,
        unscDelegatePortfolioPreferences: isUnscRegistration
          ? data.unscDelegatePortfolioPreferences
          : undefined,
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
      fetchAvailability();
    } catch {
      setSubmitError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const getCommitteeOptions = (exclude: string[] = []) =>
    committees
      .filter((c) => (isUnscRegistration ? c.id === "unsc" : c.id !== "unsc"))
      .map((c) => {
        const avail = availability?.committees[c.id];
        const isFull = avail?.isFull ?? false;
        const isUnlimited = c.maxDelegates === Number.MAX_SAFE_INTEGER;
        const availabilityText = isUnlimited
          ? "Unlimited seats available"
          : `${avail?.available ?? c.maxDelegates} seats available`;
        return {
          value: c.id,
          label: `${c.name}${isFull ? " — [FULL]" : ` (${availabilityText})`}`,
          disabled: isFull || exclude.includes(c.id),
        };
      });

  const getPortfolioOptions = (
    committeeId: string,
    exclude: string[] = [],
    singleTeam?: string
  ) => {
    const committee = getCommitteeById(committeeId);
    if (!committee) return [];

    const filtered =
      committee.id === "ipl" && singleTeam
        ? committee.portfolios.filter((p) => p.team === singleTeam)
        : committee.portfolios;

    return filtered.map((p) => {
      const taken =
        availability?.portfolios[committeeId]?.[p.id]?.taken ?? false;
      return {
        value: p.id,
        label: `${p.name}${taken ? " — [TAKEN / ASSIGNED]" : ""}`,
        disabled: taken || exclude.includes(p.id),
      };
    });
  };

  const updateCommitteePref = (index: number, value: string) => {
    const current = [...committeePrefs] as [string, string, string];
    current[index] = value;
    setValue("committeePreferences", current, { shouldValidate: true });

    const newPortfolioPrefs = { ...portfolioPrefs };
    for (const key of Object.keys(newPortfolioPrefs)) {
      if (!current.includes(key)) {
        delete newPortfolioPrefs[key];
      }
    }
    if (value && !newPortfolioPrefs[value]) {
      newPortfolioPrefs[value] = ["", "", ""] as [string, string, string];
    }
    setValue("portfolioPreferences", newPortfolioPrefs);
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

  const updateUnscDelegatePortfolioPref = (index: number, value: string) => {
    const current = [
      ...(unscDelegatePortfolioPrefs ?? ["", "", ""]),
    ] as [string, string, string];
    current[index] = value;
    setValue("unscDelegatePortfolioPreferences", current, {
      shouldValidate: true,
    });
  };

  const selectedCommittees = isUnscRegistration
    ? ["unsc"]
    : committeePrefs.filter(Boolean);

  const toggleUnscRegistration = (checked: boolean) => {
    setValue("isUnscRegistration", checked, { shouldValidate: true });

    if (checked) {
      setValue(
        "committeePreferences",
        ["unsc", "unsc", "unsc"] as [string, string, string],
        { shouldValidate: true }
      );
      setValue(
        "unscDelegatePortfolioPreferences",
        ["", "", ""] as [string, string, string],
        { shouldValidate: true }
      );
    } else {
      setValue("committeePreferences", ["", "", ""] as [string, string, string], {
        shouldValidate: true,
      });
      setValue("unscDelegate", undefined, { shouldValidate: true });
      setValue("unscDelegatePortfolioPreferences", undefined, {
        shouldValidate: true,
      });
    }
  };

  return (
    <section id="register" className="py-20 scroll-mt-24 relative">
      <div className="filigree-divider mb-16" />

      <div className="mx-auto max-w-3xl px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12 space-y-3"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-gold/30 bg-purple-deep/80 px-4 py-1.5 backdrop-blur-md">
            <Sparkles size={14} className="text-gold" />
            <span className="text-gold text-xs font-heading tracking-[0.25em] uppercase">
              Athena Summit 2026 Registration Dossier
            </span>
          </div>
          <h2 className="font-heading text-4xl sm:text-5xl text-cream">
            Delegate <span className="text-gradient-gold italic font-normal">Registration</span>
          </h2>
          <p className="text-cream/50 text-sm max-w-md mx-auto font-sans font-light">
            Complete the 5 registration steps to submit your portfolio preferences and obtain immediate allocation.
          </p>
        </motion.div>

        {/* Step indicator */}
        <div className="mb-12 relative px-2">
          <div className="flex items-center justify-between relative">
            <div className="absolute top-4 left-6 right-6 h-0.5 bg-gold/15 -z-10" />
            {STEPS.map((label, i) => {
              const stepNum = i + 1;
              const isActive = step === stepNum;
              const isComplete = step > stepNum;
              return (
                <div key={label} className="flex flex-col items-center flex-1">
                  <div
                    className={`flex h-9 w-9 items-center justify-center rounded-full text-xs font-medium transition-all duration-500 font-mono ${
                      isComplete
                        ? "bg-gold text-purple-deep shadow-lg shadow-gold/25"
                        : isActive
                          ? "bg-purple-light text-cream ring-2 ring-gold shadow-lg shadow-gold/15"
                          : "bg-purple-deep border border-white/10 text-cream/30"
                    }`}
                  >
                    {isComplete ? <Check size={14} /> : stepNum}
                  </div>
                  <span className={`mt-2.5 hidden sm:block text-[10px] tracking-wider text-center uppercase font-sans transition-colors ${
                    isActive ? "text-gold font-semibold" : "text-cream/35"
                  }`}>
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
          className="velvet-card rounded-2xl p-6 sm:p-10 shadow-2xl relative border border-gold/30"
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
                <div className="border-b border-gold/15 pb-4 mb-2">
                  <span className="text-[10px] uppercase tracking-[0.25em] text-gold font-mono block">Step 01 / 05</span>
                  <h3 className="font-heading text-2xl text-cream">Personal Credentials</h3>
                  <p className="text-xs text-cream/40 mt-0.5">Enter your verified contact and institutional information</p>
                </div>

                <Input label="Full Name" {...register("name")} error={errors.name?.message} placeholder="e.g. Rahul Sharma" />
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

                <div className="rounded-2xl border border-gold/25 bg-gold/5 p-5 mt-6">
                  <label className="flex items-start justify-between gap-4 mb-4 cursor-pointer">
                    <div>
                      <span className="text-[10px] uppercase tracking-[0.24em] text-gold font-mono">UNSC Double Delegation</span>
                      <h4 className="font-heading text-xl text-cream mt-1">This is a UNSC double-delegation registration</h4>
                    </div>
                    <input
                      type="checkbox"
                      checked={Boolean(isUnscRegistration)}
                      onChange={(e) => toggleUnscRegistration(e.target.checked)}
                      className="mt-1 h-5 w-5 rounded border-gold/30 bg-transparent text-gold focus:ring-gold"
                    />
                  </label>
                  <p className="text-[11px] text-cream/45 mb-4">
                    UNSC requires both delegates to be registered together. When enabled, the form will lock to UNSC and require the second delegate’s profile and portfolios.
                  </p>

                  {isUnscRegistration && (
                    <div className="grid gap-4 sm:grid-cols-2">
                      <Input
                        label="Partner Delegate Full Name"
                        {...register("unscDelegate.name")}
                        error={errors.unscDelegate?.name?.message}
                        placeholder="e.g. Rhea Sen"
                      />
                      <Input
                        label="Partner WhatsApp Number"
                        {...register("unscDelegate.phone")}
                        error={errors.unscDelegate?.phone?.message}
                        placeholder="+91 XXXXX XXXXX"
                      />
                      <Input
                        label="Partner Email Address"
                        type="email"
                        {...register("unscDelegate.email")}
                        error={errors.unscDelegate?.email?.message}
                        placeholder="partner@example.com"
                      />
                      <Input
                        label="Partner Class / Year of Study"
                        {...register("unscDelegate.classYear")}
                        error={errors.unscDelegate?.classYear?.message}
                        placeholder="e.g. 1st Year B.Com."
                      />
                      <div className="sm:col-span-2">
                        <Input
                          label="Partner Institution / School / College"
                          {...register("unscDelegate.institution")}
                          error={errors.unscDelegate?.institution?.message}
                          placeholder="e.g. Delhi University"
                        />
                      </div>
                    </div>
                  )}
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
                  <span className="text-[10px] uppercase tracking-[0.25em] text-gold font-mono block">Step 02 / 05</span>
                  <h3 className="font-heading text-2xl text-cream">Committee Preferences</h3>
                  <p className="text-xs text-cream/40 mt-0.5">Select your top 3 preferred committees in order of priority</p>
                </div>

                {isUnscRegistration ? (
                  <div className="rounded-2xl border border-gold/30 bg-gold/10 p-6 space-y-3">
                    <span className="text-[10px] uppercase tracking-[0.28em] text-gold font-mono">UNSC Allocation Lock</span>
                    <h4 className="font-heading text-2xl text-cream">UNSC is selected automatically</h4>
                    <p className="text-sm text-cream/55">
                      Because the UNSC partner delegate profile is present, this registration will proceed through the UNSC double-delegation pathway and will not ask for a generic committee selection.
                    </p>
                    <div className="flex items-center gap-2 text-xs text-gold">
                      <Sparkles size={13} />
                      <span>Committee preference override: UNSC</span>
                    </div>
                  </div>
                ) : (
                  [0, 1, 2].map((i) => (
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
                  ))
                )}
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
                  <span className="text-[10px] uppercase tracking-[0.25em] text-gold font-mono block">Step 03 / 05</span>
                  <h3 className="font-heading text-2xl text-cream">Portfolio Preferences</h3>
                  <p className="text-xs text-cream/40 mt-0.5">Select 3 portfolio choices for each of your selected committees</p>
                </div>

                {selectedCommittees.length === 0 ? (
                  <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-6 text-center text-sm text-amber-300">
                    Please go back to Step 2 and select committee preferences first.
                  </div>
                ) : (
                  <>
                    {isUnscRegistration ? (
                      <div className="glass-card rounded-xl p-5 space-y-4">
                        <div className="border-b border-gold/15 pb-3">
                          <h4 className="font-heading text-xl text-gold">
                            UNSC — <span className="text-cream/70 text-sm font-sans font-light">United Nations Security Council</span>
                          </h4>
                          <p className="text-xs text-cream/40 mt-1">
                            Both delegates will share the same UNSC portfolio preference set.
                          </p>
                        </div>

                        {[0, 1, 2].map((i) => (
                          <Select
                            key={i}
                            label={`${i === 0 ? "1st" : i === 1 ? "2nd" : "3rd"} Shared Portfolio`}
                            value={unscDelegatePortfolioPrefs?.[i] ?? ""}
                            onChange={(e) =>
                              updateUnscDelegatePortfolioPref(i, e.target.value)
                            }
                            options={getPortfolioOptions("unsc")}
                          />
                        ))}
                      </div>
                    ) : (
                      selectedCommittees.map((committeeId) => {
                        const committee = getCommitteeById(committeeId);
                        if (!committee) return null;
                        const prefs = portfolioPrefs[committeeId] ?? ["", "", ""];

                        const teamOptions =
                          committee.id === "ipl"
                            ? Array.from(
                                new Set(
                                  committee.portfolios
                                    .map((p) => p.team)
                                    .filter((team): team is string => Boolean(team))
                                )
                              ).map((team) => ({ value: team, label: team }))
                            : [];

                        const selectedIplTeam = iplTeamSelections[committeeId] ?? teamOptions[0]?.value ?? "";

                        return (
                          <div key={committeeId} className="glass-card rounded-xl p-5 space-y-4">
                            <div className="border-b border-gold/15 pb-3">
                              <h4 className="font-heading text-xl text-gold">
                                {committee.name} — <span className="text-cream/70 text-sm font-sans font-light">{committee.fullName}</span>
                              </h4>
                            </div>

                            {committee.id === "ipl" && (
                              <Select
                                label="Team"
                                value={selectedIplTeam}
                                onChange={(e) => {
                                  const nextTeam = e.target.value;
                                  setIplTeamSelections((prev) => ({
                                    ...prev,
                                    [committeeId]: nextTeam,
                                  }));
                                }}
                                options={teamOptions}
                              />
                            )}

                            {[0, 1, 2].map((i) => (
                              <Select
                                key={i}
                                label={`${i === 0 ? "1st Choice" : i === 1 ? "2nd Choice" : "3rd Choice"} Portfolio`}
                                value={prefs[i] ?? ""}
                                onChange={(e) =>
                                  updatePortfolioPref(committeeId, i, e.target.value)
                                }
                                options={getPortfolioOptions(
                                  committeeId,
                                  prefs.filter((_, idx) => idx !== i),
                                  committee.id === "ipl" ? selectedIplTeam : undefined
                                )}
                              />
                            ))}
                          </div>
                        );
                      })
                    )}
                  </>
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
                  <span className="text-[10px] uppercase tracking-[0.25em] text-gold font-mono block">Step 04 / 05</span>
                  <h3 className="font-heading text-2xl text-cream">Summit Experience & Reference</h3>
                  <p className="text-xs text-cream/40 mt-0.5">Help the Secretariat understand your background and achievements</p>
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
                  <span className="text-[10px] uppercase tracking-[0.25em] text-gold font-mono block">Step 05 / 05</span>
                  <h3 className="font-heading text-2xl text-cream">Payment & Screenshot Upload</h3>
                  <p className="text-xs text-cream/40 mt-0.5">
                    {isUnscRegistration
                      ? "Please upload two payment receipts for the double-delegation UNSC registration and complete the combined payment transfer."
                      : "Scan the official QR code to complete registration fee payment"}
                  </p>
                </div>

                <div className="rounded-2xl border border-gold/30 bg-linear-to-b from-purple-dark to-purple-deep p-6 text-center space-y-4 shadow-xl">
                  <div className="mx-auto w-48 h-48 rounded-xl bg-white p-3 shadow-2xl flex items-center justify-center">
                    <div className="w-full h-full border-2 border-dashed border-purple-deep/40 rounded-lg flex flex-col items-center justify-center text-purple-deep text-center p-2">
                      <QrCode size={44} className="text-purple-deep mb-1" />
                      <span className="text-[10px] font-bold tracking-widest font-heading">ATHENA SUMMIT</span>
                      <span className="text-[9px] text-purple-deep/70 font-mono">UPI PAYMENT QR</span>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <p className="text-sm font-medium text-cream">Official UPI ID: <span className="text-gold font-mono font-bold">athena@upi</span></p>
                    <p className="text-xs text-cream/50">
                      {isUnscRegistration
                        ? "Please pay once for the combined UNSC double-delegation registration and upload both receipts for verification."
                        : "Accepted via Google Pay, PhonePe, Paytm, BHIM"}
                    </p>
                  </div>
                </div>

                <div className="rounded-2xl border border-gold/20 bg-gold/5 p-4">
                  <p className="text-[11px] uppercase tracking-[0.24em] text-gold font-mono">
                    {isUnscRegistration ? "UNSC payment requirement" : "Payment note"}
                  </p>
                  <p className="mt-2 text-sm text-cream/70">
                    {isUnscRegistration
                      ? "Upload two separate receipt screenshots, one for each delegate’s portion of the joint payment, and ensure the payment is made for the combined registration amount."
                      : "Upload a single payment screenshot for the registration fee."}
                  </p>
                </div>

                <div>
                  <label className="block text-xs text-cream/70 uppercase tracking-wider mb-2">
                    {isUnscRegistration ? "Upload Both Payment Screenshots (Max 5MB each)" : "Upload Payment Screenshot (Max 5MB)"}
                  </label>
                  <label className="flex flex-col items-center justify-center w-full h-36 rounded-xl border-2 border-dashed border-gold/30 hover:border-gold transition-all cursor-pointer bg-purple-deep/40 hover:bg-purple-deep/70 group">
                    {screenshotValue ? (
                      <div className="flex items-center gap-4 p-2">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={screenshotValue}
                          alt="Payment Receipt Preview"
                          className="h-24 w-24 object-cover rounded-lg border border-gold"
                        />
                        <div className="text-left">
                          <p className="text-xs text-emerald-400 font-medium flex items-center gap-1 font-mono">
                            <Check size={14} /> SCREENSHOT UPLOADED
                          </p>
                          <p className="text-[10px] text-cream/40 mt-1">Click box to re-select image</p>
                        </div>
                      </div>
                    ) : (
                      <>
                        <Upload size={28} className="text-gold/50 group-hover:text-gold transition-colors mb-2" />
                        <span className="text-xs text-cream/60 group-hover:text-cream transition-colors">
                          Click to select payment receipt screenshot
                        </span>
                        <span className="text-[10px] text-cream/30 mt-1">PNG, JPG, JPEG accepted</span>
                      </>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleFileUpload}
                    />
                  </label>
                  {errors.paymentScreenshot && (
                    <p className="mt-1.5 text-xs text-red-400 flex items-center gap-1">
                      <AlertCircle size={12} /> {errors.paymentScreenshot.message}
                    </p>
                  )}
                  {uploadMessage && !errors.paymentScreenshot && (
                    <p className="mt-1.5 text-xs text-emerald-400 flex items-center gap-1">
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
                  <span className="text-[10px] tracking-[0.3em] uppercase text-gold font-mono">Registration Confirmed</span>
                  <h3 className="font-heading text-4xl text-cream">
                    Delegate <span className="text-gradient-gold italic font-normal">Allocation Issued</span>
                  </h3>
                  <p className="text-xs text-cream/50 max-w-md mx-auto font-sans font-light">
                    Your allocation has been locked. An official email with study guidelines will follow payment verification.
                  </p>
                </div>

                {/* Handcrafted Credential Card */}
                <div className="rounded-xl border border-gold/40 bg-linear-to-b from-purple-dark via-purple-deep to-[#0b0714] p-6 text-left space-y-4 shadow-2xl relative overflow-hidden">
                  <div className="flex items-center justify-between border-b border-gold/20 pb-3">
                    <div>
                      <span className="font-heading text-xl text-gold block">ATHENA SUMMIT CREDENTIAL</span>
                      <span className="text-[9px] uppercase tracking-widest text-cream/40">Official Delegate Dossier</span>
                    </div>
                    <Badge variant="warning">Pending Payment Review</Badge>
                  </div>

                  <div className="grid gap-3 text-xs">
                    <div className="flex justify-between items-center py-1.5 border-b border-white/5">
                      <span className="text-cream/40">Delegate Name:</span>
                      <span className="text-cream font-medium font-heading text-base">{result.name}</span>
                    </div>
                    <div className="flex justify-between items-center py-1.5 border-b border-white/5">
                      <span className="text-cream/40">Assigned Committee:</span>
                      <span className="text-gold font-medium font-heading text-lg">
                        {getCommitteeById(result.assignedCommittee ?? "")?.name ?? result.assignedCommittee}
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-1.5 border-b border-white/5">
                      <span className="text-cream/40">Assigned Portfolio:</span>
                      <span className="text-cream font-medium">
                        {getCommitteeById(result.assignedCommittee ?? "")
                          ?.portfolios.find((p) => p.id === result.assignedPortfolio)?.name ?? result.assignedPortfolio}
                      </span>
                    </div>
                    <div className="pt-2">
                      <span className="text-cream/40 text-xs block mb-1">Committee Agenda:</span>
                      <p className="text-cream/80 text-xs leading-relaxed bg-purple-deep/80 p-3 rounded.lg border border-gold/15">
                        {result.assignedAgenda}
                      </p>
                    </div>
                  </div>
                </div>

                <p className="text-[11px] text-cream/40 font-mono tracking-wider">
                  Dossier ID: {result.id}
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {availabilityError && (
            <div className="mt-4 rounded-xl border border-amber-500/30 bg-amber-500/10 p-3 text-xs text-amber-300 text-center flex items-center justify-center gap-2 font-sans">
              <AlertCircle size={14} />
              {availabilityError}
            </div>
          )}

          {submitError && (
            <div className="mt-4 rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-xs text-red-400 text-center flex items-center justify-center gap-2 font-sans">
              <AlertCircle size={14} />
              {submitError}
            </div>
          )}

          {/* Buttons */}
          {step < 6 && (
            <div className="mt-10 flex justify-between items-center pt-4 border-t border-gold/15">
              <Button
                type="button"
                variant="ghost"
                onClick={prevStep}
                disabled={step === 1}
                className="text-xs uppercase tracking-wider text-cream/70 hover:text-gold"
              >
                <ChevronLeft size={16} />
                Previous Step
              </Button>

              {step < 5 ? (
                <Button type="button" onClick={nextStep} className="rounded-full px-6 text-xs uppercase tracking-wider font-semibold">
                  <span>Continue Step</span>
                  <ChevronRight size={16} />
                </Button>
              ) : (
                <Button type="submit" disabled={loading} className="rounded-full px-8 text-xs uppercase tracking-wider font-bold shadow-xl shadow-gold/20">
                  {loading ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      Allocating Delegate...
                    </>
                  ) : (
                    <>
                      <span>Submit Registration Dossier</span>
                      <Sparkles size={16} />
                    </>
                  )}
                </Button>
              )}
            </div>
          )}
        </form>
      </div>
    </section>
  );
}
