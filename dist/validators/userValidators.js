"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerUserSchema = void 0;
const zod_1 = require("zod");
exports.registerUserSchema = zod_1.z.object({
    name: zod_1.z.string().trim().min(2, "Name must be at least 2 characters"),
    phone: zod_1.z
        .string()
        .trim()
        .min(1, "Phone is required")
        .regex(/^\+?[0-9]+$/, "Phone must contain only numbers and an optional leading +"),
});
//# sourceMappingURL=userValidators.js.map