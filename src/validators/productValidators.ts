import { z } from "zod";

export const createProductSchema = z.object({
  category_id: z.string().uuid("Category ID must be a valid UUID"),
  name: z.string().trim().min(2, "Product name must be at least 2 characters"),
  description: z.string().trim().optional(),
  sku: z.string().trim().optional(),
  barcode: z.string().trim().optional(),
  price: z.number().positive("Price must be greater than 0"),
  compare_at_price: z.number().positive("Compare at price must be greater than 0").optional(),
  cost_price: z.number().positive("Cost price must be greater than 0").optional(),
  tax_percentage: z.number().min(0).max(100, "Tax percentage must be between 0 and 100").optional(),
  stock_quantity: z.number().int().min(0, "Stock quantity must be non-negative").optional(),
  track_inventory: z.boolean().optional(),
  is_available: z.boolean().optional(),
  is_featured: z.boolean().optional(),
  sort_order: z.number().int().min(0, "Sort order must be non-negative").optional(),
});

export const updateProductSchema = z
  .object({
    category_id: z.string().uuid("Category ID must be a valid UUID").optional(),
    name: z.string().trim().min(2, "Product name must be at least 2 characters").optional(),
    description: z.string().trim().optional(),
    sku: z.string().trim().optional(),
    barcode: z.string().trim().optional(),
    price: z.number().positive("Price must be greater than 0").optional(),
    compare_at_price: z.number().positive("Compare at price must be greater than 0").optional(),
    cost_price: z.number().positive("Cost price must be greater than 0").optional(),
    tax_percentage: z.number().min(0).max(100, "Tax percentage must be between 0 and 100").optional(),
    stock_quantity: z.number().int().min(0, "Stock quantity must be non-negative").optional(),
    track_inventory: z.boolean().optional(),
    is_available: z.boolean().optional(),
    is_featured: z.boolean().optional(),
    sort_order: z.number().int().min(0, "Sort order must be non-negative").optional(),
  })
  .refine(
    (data) => Object.keys(data).length > 0,
    "At least one field must be provided for update",
  );
