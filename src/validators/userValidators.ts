import { z } from "zod";

export const registerUserSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters"),
  phone: z
    .string()
    .trim()
    .min(1, "Phone is required")
    .regex(/^\+?[0-9]+$/, "Phone must contain only numbers and an optional leading +"),
});
