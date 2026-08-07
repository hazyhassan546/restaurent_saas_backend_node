"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyOtpSchema = exports.initLoginSchema = void 0;
const zod_1 = require("zod");
exports.initLoginSchema = zod_1.z.object({
    phone: zod_1.z
        .string()
        .trim()
        .min(1, "Phone is required")
        .regex(/^\+?[0-9]+$/, "Phone must contain only numbers and an optional leading +"),
});
exports.verifyOtpSchema = zod_1.z.object({
    phone: zod_1.z
        .string()
        .trim()
        .min(1, "Phone is required")
        .regex(/^\+?[0-9]+$/, "Phone must contain only numbers and an optional leading +"),
    otp: zod_1.z.string().trim().length(6, "OTP must be 6 digits"),
});
//# sourceMappingURL=authValidators.js.map