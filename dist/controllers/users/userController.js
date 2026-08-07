"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserByPhone = exports.CreateUser = void 0;
const prisma_1 = __importDefault(require("../../utils/prisma"));
const CreateUser = async (req, res) => {
    try {
        const { name, phone } = req.body;
        const normalizedPhone = phone.trim();
        const existingUser = await prisma_1.default.users.findUnique({
            where: { phone: normalizedPhone },
        });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }
        const newUser = await prisma_1.default.users.create({
            data: {
                full_name: name,
                phone: normalizedPhone,
                status: "INACTIVE",
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
const getUserByPhone = async (req, res) => {
    try {
        const { name, phone } = req.body;
        const normalizedPhone = phone.trim();
        // Check if the user already exists
        const existingUser = await prisma_1.default.users.findUnique({
            where: { phone: normalizedPhone },
        });
        if (existingUser) {
            return existingUser;
        }
        // Create a new user
        const newUser = await prisma_1.default.users.create({
            data: {
                full_name: name,
                phone: normalizedPhone,
                status: "INACTIVE",
            },
        });
        return newUser;
    }
    catch (error) {
        console.error("Error creating user:", error);
        return null;
    }
};
exports.getUserByPhone = getUserByPhone;
//# sourceMappingURL=userController.js.map