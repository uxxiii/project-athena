import { z } from "zod";

const unscDelegateSchema = z
  .object({
    name: z.string().min(2),
    phone: z.string().min(10),
    email: z.string().email(),
    classYear: z.string().min(1),
    institution: z.string().min(2),
  })
  .nullable()
  .optional();

export const registrationApiSchema = z.object({
  eventSlug: z.string(),
  name: z.string().min(2),
  phone: z.string().min(10),
  email: z.string().email(),
  classYear: z.string().min(1),
  institution: z.string().min(2),
  committeePreferences: z
    .tuple([z.string(), z.string(), z.string()])
    .optional(),
  portfolioPreferences: z
    .record(z.string(), z.tuple([z.string(), z.string(), z.string()]))
    .optional()
    .default({}),
  munExperience: z.string().min(1),
  reference: z.string().min(1),
  paymentScreenshot: z.string().optional(),
  isUnscRegistration: z.boolean().default(false),
  unscDelegate: unscDelegateSchema,
  unscDelegatePortfolioPreferences: z
    .tuple([z.string(), z.string(), z.string()])
    .optional(),
  foodPreference: z.string().optional(),
  notes: z.string().optional(),
});
