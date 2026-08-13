"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateAddressSchema = exports.addAddressSchema = exports.updateProfileSchema = exports.registerUserSchema = void 0;
const zod_1 = require("zod");
exports.registerUserSchema = zod_1.z.object({
    name: zod_1.z.string().trim().min(2, "Name must be at least 2 characters"),
    phone: zod_1.z
        .string()
        .trim()
        .min(1, "Phone is required")
        .regex(/^\+?[0-9]+$/, "Phone must contain only numbers and an optional leading +"),
});
exports.updateProfileSchema = zod_1.z
    .object({
    full_name: zod_1.z
        .string()
        .trim()
        .min(2, "Name must be at least 2 characters")
        .optional(),
    profile_image: zod_1.z
        .string()
        .trim()
        .url("Profile image must be a valid URL")
        .optional(),
    gender: zod_1.z
        .enum(["MALE", "FEMALE", "OTHER"], {
        message: "Gender must be MALE, FEMALE, or OTHER",
    })
        .optional(),
})
    .refine((data) => Object.keys(data).length > 0, "At least one field must be provided for update");
exports.addAddressSchema = zod_1.z.object({
    address_type: zod_1.z.enum(["HOME", "OFFICE", "OTHER"], {
        message: "Address type must be HOME, OFFICE, or OTHER",
    }),
    address_line_1: zod_1.z
        .string()
        .trim()
        .min(5, "Address line 1 must be at least 5 characters"),
    address_line_2: zod_1.z.string().trim().optional().or(zod_1.z.literal("")),
    latitude: zod_1.z
        .number()
        .min(-90)
        .max(90, "Latitude must be between -90 and 90")
        .optional(),
    longitude: zod_1.z
        .number()
        .min(-180)
        .max(180, "Longitude must be between -180 and 180")
        .optional(),
    is_default: zod_1.z.boolean().optional(),
});
exports.updateAddressSchema = zod_1.z
    .object({
    address_type: zod_1.z
        .enum(["HOME", "OFFICE", "OTHER"], {
        message: "Address type must be HOME, OFFICE, or OTHER",
    })
        .optional(),
    address_line_1: zod_1.z
        .string()
        .trim()
        .min(5, "Address line 1 must be at least 5 characters")
        .optional(),
    address_line_2: zod_1.z.string().trim().optional().or(zod_1.z.literal("")),
    latitude: zod_1.z
        .number()
        .min(-90)
        .max(90, "Latitude must be between -90 and 90")
        .optional(),
    longitude: zod_1.z
        .number()
        .min(-180)
        .max(180, "Longitude must be between -180 and 180")
        .optional(),
    is_default: zod_1.z.boolean().optional(),
})
    .refine((data) => Object.keys(data).length > 0, "At least one field must be provided for update");
//# sourceMappingURL=userValidators.js.map