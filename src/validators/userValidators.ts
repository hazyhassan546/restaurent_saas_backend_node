import { z } from "zod";

export const registerUserSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters"),
  phone: z
    .string()
    .trim()
    .min(1, "Phone is required")
    .regex(
      /^\+?[0-9]+$/,
      "Phone must contain only numbers and an optional leading +",
    ),
});

export const updateProfileSchema = z
  .object({
    full_name: z
      .string()
      .trim()
      .min(2, "Name must be at least 2 characters")
      .optional(),
    profile_image: z
      .string()
      .trim()
      .url("Profile image must be a valid URL")
      .optional(),
    gender: z
      .enum(["MALE", "FEMALE", "OTHER"], {
        message: "Gender must be MALE, FEMALE, or OTHER",
      })
      .optional(),
  })
  .refine(
    (data) => Object.keys(data).length > 0,
    "At least one field must be provided for update",
  );

export const addAddressSchema = z.object({
  address_type: z.enum(["HOME", "OFFICE", "OTHER"], {
    message: "Address type must be HOME, OFFICE, or OTHER",
  }),
  address_line_1: z
    .string()
    .trim()
    .min(5, "Address line 1 must be at least 5 characters"),
  address_line_2: z.string().trim().optional().or(z.literal("")),
  latitude: z
    .number()
    .min(-90)
    .max(90, "Latitude must be between -90 and 90")
    .optional(),
  longitude: z
    .number()
    .min(-180)
    .max(180, "Longitude must be between -180 and 180")
    .optional(),
  is_default: z.boolean().optional(),
});

export const updateAddressSchema = z
  .object({
    address_type: z
      .enum(["HOME", "OFFICE", "OTHER"], {
        message: "Address type must be HOME, OFFICE, or OTHER",
      })
      .optional(),
    address_line_1: z
      .string()
      .trim()
      .min(5, "Address line 1 must be at least 5 characters")
      .optional(),
    address_line_2: z.string().trim().optional().or(z.literal("")),
    latitude: z
      .number()
      .min(-90)
      .max(90, "Latitude must be between -90 and 90")
      .optional(),
    longitude: z
      .number()
      .min(-180)
      .max(180, "Longitude must be between -180 and 180")
      .optional(),
    is_default: z.boolean().optional(),
  })
  .refine(
    (data) => Object.keys(data).length > 0,
    "At least one field must be provided for update",
  );
