"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateUser = void 0;
const prisma_1 = __importDefault(require("../../utils/prisma"));
const isValidPhone = (value) => {
    return typeof value === "string" && /^\+?[0-9]+$/.test(value.trim());
};
const CreateUser = async (req, res) => {
    try {
        const { name, phone } = req.body;
        if (!isValidPhone(phone)) {
            return res.status(400).json({
                message: "Phone must contain only numbers and an optional leading +",
            });
        }
        const normalizedPhone = phone.trim();
        // Check if the user already exists
        const existingUser = await prisma_1.default.users.findUnique({
            where: { phone: normalizedPhone },
        });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }
        // Create a new user
        const newUser = await prisma_1.default.users.create({
            data: {
                full_name: name,
                phone: normalizedPhone,
            },
        });
        return res.status(201).json(newUser);
    }
    catch (error) {
        console.error("Error creating user:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};
exports.CreateUser = CreateUser;
//# sourceMappingURL=userController.js.map