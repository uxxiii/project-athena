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
    .tuple([
      z.string().min(1, "Select 1st preference"),
      z.string().min(1, "Select 2nd preference"),
      z.string().min(1, "Select 3rd preference"),
    ])
    .refine(
      (prefs) => new Set(prefs).size === 3,
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
      name: z.string().optional(),
      phone: z.string().optional(),
      email: z.string().optional(),
      classYear: z.string().optional(),
      institution: z.string().optional(),
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
  .merge(unscDelegateSchema);

export type RegistrationFormData = z.infer<typeof registrationSchema>;

export const STEP_FIELDS: Record<number, (keyof RegistrationFormData)[]> = {
  1: ["name", "phone", "email", "classYear", "institution"],
  2: ["committeePreferences"],
  3: ["portfolioPreferences"],
  4: ["munExperience", "reference"],
  5: ["paymentScreenshot"],
};
