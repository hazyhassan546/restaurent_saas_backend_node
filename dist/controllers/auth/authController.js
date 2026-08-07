"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.refreshToken = exports.verifyOTP = exports.initializeUserLogin = void 0;
const jwtService_1 = require("../../services/jwtService");
const otpService_1 = require("../../services/otpService");
const prisma_1 = __importDefault(require("../../utils/prisma"));
const userController_1 = require("../users/userController");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const initializeUserLogin = async (req, res) => {
    try {
        const { phone } = req.body;
        const normalizedPhone = phone.trim();
        const existingUser = await (0, userController_1.getUserByPhone)(req, res);
        const userId = existingUser?.id || "";
        await (0, otpService_1.sendOTP)(userId, normalizedPhone);
        return res.status(200).json({
            message: "OTP sent successfully",
        });
    }
    catch (error) {
        console.error("Error logging in user:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};
exports.initializeUserLogin = initializeUserLogin;
const verifyOTP = async (req, res) => {
    try {
        const { phone, otp } = req.body;
        const normalizedPhone = phone.trim();
        const normalizedOtp = otp.trim();
        const result = await (0, otpService_1.validateOTP)(normalizedPhone, normalizedOtp);
        if (!result.success) {
            return res.status(400).json(result);
        }
        if (!result.user) {
            return res.status(404).json({
                message: "User not found",
            });
        }
        const token = (0, jwtService_1.generateAuthToken)(result.user);
        const refresh_token = (0, jwtService_1.generateRefreshToken)(result.user);
        return res.status(200).json({
            message: "OTP verified successfully",
            user: {
                id: result.user.id,
                name: result.user?.full_name,
                phone: result.user.phone,
            },
            access_token: token,
            refresh_token: refresh_token,
        });
    }
    catch (error) {
        console.error("Error logging in user:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};
exports.verifyOTP = verifyOTP;
const refreshToken = async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        const old_token = authHeader?.split(" ")[1];
        if (!old_token) {
            return res.status(401).json({
                message: "Unauthorized",
            });
        }
        const decoded = jsonwebtoken_1.default.verify(old_token, process.env.JWT_REFRESH_SECRET);
        const userId = decoded.id;
        const user = await prisma_1.default.users.findUnique({
            where: { id: userId },
        });
        if (!user) {
            throw new Error("Invalid or expired token");
        }
        // Generate JWT
        const token = (0, jwtService_1.generateAuthToken)(user);
        const refresh_token = (0, jwtService_1.generateRefreshToken)(user);
        res.send({
            message: "Login successful",
            user: {
                id: user.id,
                name: user.full_name,
                phone: user.phone,
            },
            access_token: token,
            refresh_token: refresh_token,
        });
    }
    catch (error) {
        return res.status(401).json({
            message: "Invalid or expired token",
        });
    }
};
exports.refreshToken = refreshToken;
//# sourceMappingURL=authController.js.map