import { z } from "zod";

export const registerUserSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters"),
  phone: z
    .string()
    .trim()
    .min(1, "Phone is required")
    .regex(/^\+?[0-9]+$/, "Phone must contain only numbers and an optional leading +"),
});

export const updateProfileSchema = z.object({
  full_name: z.string().trim().min(2, "Name must be at least 2 characters").optional(),
  profile_image: z.string().trim().url("Profile image must be a valid URL").optional(),
  gender: z.enum(["MALE", "FEMALE", "OTHER"], { message: "Gender must be MALE, FEMALE, or OTHER" }).optional(),
}).refine((data) => Object.keys(data).length > 0, "At least one field must be provided for update");
