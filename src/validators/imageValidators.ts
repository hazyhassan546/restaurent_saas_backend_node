import { z } from "zod";

export const allowedEntityTypes = [
  "USER",
  "PRODUCT",
  "CATEGORY",
  "BANNER",
  "STORE",
] as const;

export const createImageSchema = z
  .object({
    entity_type: z
      .enum(allowedEntityTypes)
      .transform((value) => value.toUpperCase()),
    entity_id: z.string().uuid("Entity ID must be a valid UUID"),
    image_url: z.string().trim().url("Image URL must be a valid URL").optional(),
    image_type: z.string().trim().default("IMAGE").optional(),
    alt_text: z
      .string()
      .trim()
      .max(255, "Alt text must be at most 255 characters")
      .optional(),
    display_order: z
      .number()
      .int()
      .min(0, "Display order must be non-negative")
      .optional(),
    is_primary: z.boolean().optional(),
  })
  .strict();
