import { z } from "zod";

export const createCategorySchema = z.object({
  name: z.string().trim().min(2, "Category name must be at least 2 characters"),
  description: z.string().trim().optional(),
  image_url: z.string().trim().url("Image URL must be a valid URL").optional(),
  icon_url: z.string().trim().url("Icon URL must be a valid URL").optional(),
  slug: z.string().trim().optional(),
  parent_category_id: z.string().uuid("Parent category ID must be a valid UUID").optional(),
  display_order: z.number().int().min(0, "Display order must be non-negative").optional(),
  is_active: z.boolean().optional(),
});

export const updateCategorySchema = z
  .object({
    name: z.string().trim().min(2, "Category name must be at least 2 characters").optional(),
    description: z.string().trim().optional(),
    image_url: z.string().trim().url("Image URL must be a valid URL").optional(),
    icon_url: z.string().trim().url("Icon URL must be a valid URL").optional(),
    slug: z.string().trim().optional(),
    parent_category_id: z.string().uuid("Parent category ID must be a valid UUID").optional(),
    display_order: z.number().int().min(0, "Display order must be non-negative").optional(),
    is_active: z.boolean().optional(),
  })
  .refine(
    (data) => Object.keys(data).length > 0,
    "At least one field must be provided for update",
  );
