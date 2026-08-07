import { z } from "zod";

export const initLoginSchema = z.object({
  phone: z
    .string()
    .trim()
    .min(1, "Phone is required")
    .regex(/^\+?[0-9]+$/, "Phone must contain only numbers and an optional leading +"),
});

export const verifyOtpSchema = z.object({
  phone: z
    .string()
    .trim()
    .min(1, "Phone is required")
    .regex(/^\+?[0-9]+$/, "Phone must contain only numbers and an optional leading +"),
  otp: z.string().trim().length(6, "OTP must be 6 digits"),
});
