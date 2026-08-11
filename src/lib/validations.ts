import { z } from "zod";

export const personalInfoSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  phone: z
    .string()
    .min(10, "Enter a valid WhatsApp number")
    .regex(/^[\d\s+\-()]+$/, "Enter a valid phone number"),
  email: z.string().email("Enter a valid email address"),
  classYear: z.string().min(1, "Class/Year is required"),
  institution: z.string().min(2, "Institution name is required"),
});

export const committeePreferencesSchema = z.object({
  committeePreferences: z
    .tuple([z.string().min(1), z.string().min(1), z.string().min(1)])
    .refine(
      (prefs) => new Set(prefs).size === 3 || prefs.every((p) => p === "unsc"),
      "Please select three different committees"
    ),
});

export const portfolioPreferencesSchema = z.object({
  portfolioPreferences: z.record(
    z.string(),
    z.tuple([z.string().min(1), z.string().min(1), z.string().min(1)])
  ),
});

export const experienceSchema = z.object({
  munExperience: z.string().min(10, "Please describe your summit experience"),
  reference: z.string().min(2, "Reference is required"),
});

export const paymentSchema = z.object({
  paymentScreenshot: z.string().min(1, "Payment screenshot is required"),
});

export const unscDelegateSchema = z.object({
  isUnscRegistration: z.boolean().default(false),
  unscDelegate: z
    .object({
      name: z.string().min(2, "Partner delegate name is required"),
      phone: z
        .string()
        .min(10, "Enter a valid partner WhatsApp number")
        .regex(/^[\d\s+\-()]+$/, "Enter a valid phone number"),
      email: z.string().email("Enter a valid partner email address"),
      classYear: z.string().min(1, "Partner class/year is required"),
      institution: z.string().min(2, "Partner institution is required"),
    })
    .nullable()
    .optional(),
  unscDelegatePortfolioPreferences: z
    .tuple([z.string(), z.string(), z.string()])
    .optional(),
});

export const registrationSchema = personalInfoSchema
  .merge(committeePreferencesSchema)
  .merge(portfolioPreferencesSchema)
  .merge(experienceSchema)
  .merge(paymentSchema)
  .merge(unscDelegateSchema)
  .superRefine((data, ctx) => {
    if (!data.isUnscRegistration) return;

    const partnerDelegate = data.unscDelegate;
    if (!partnerDelegate?.name?.trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["unscDelegate", "name"],
        message: "Partner delegate name is required for UNSC",
      });
    }

    if (!partnerDelegate?.phone?.trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["unscDelegate", "phone"],
        message: "Partner delegate WhatsApp number is required for UNSC",
      });
    }

    if (!partnerDelegate?.email?.trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["unscDelegate", "email"],
        message: "Partner delegate email is required for UNSC",
      });
    }

    if (!partnerDelegate?.classYear?.trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["unscDelegate", "classYear"],
        message: "Partner delegate class/year is required for UNSC",
      });
    }

    if (!partnerDelegate?.institution?.trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["unscDelegate", "institution"],
        message: "Partner delegate institution is required for UNSC",
      });
    }

    const sharedPreferences = data.unscDelegatePortfolioPreferences ?? ["", "", ""];
    if (sharedPreferences.some((pref) => !pref.trim())) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["unscDelegatePortfolioPreferences"],
        message: "Please choose three shared UNSC portfolio preferences",
      });
    }
  });

export type RegistrationFormData = z.infer<typeof registrationSchema>;

export const STEP_FIELDS: Record<number, (keyof RegistrationFormData)[]> = {
  1: ["name", "phone", "email", "classYear", "institution"],
  2: ["committeePreferences"],
  3: ["portfolioPreferences"],
  4: ["munExperience", "reference"],
  5: ["paymentScreenshot"],
};
