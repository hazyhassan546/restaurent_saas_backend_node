"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateOTP = exports.sendOTP = exports.generateOTP = void 0;
const helperFunctions_1 = require("../utils/helperFunctions");
const prisma_1 = __importDefault(require("../utils/prisma"));
const generateOTP = () => {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    return otp;
};
exports.generateOTP = generateOTP;
const sendOTP = async (userId, phone) => {
    try {
        const otp = (0, exports.generateOTP)();
        console.log("Phone", phone);
        await prisma_1.default.otps.create({
            data: {
                user_id: userId,
                otp_hash: otp,
                otp_type: "LOGIN",
                expires_at: new Date(Date.now() + 1 * 60 * 1000), // OTP expires in 1 minutes
                destination: phone,
            },
        });
        return true;
    }
    catch (error) {
        console.error("Error sending OTP:", error);
        throw new Error("Failed to send OTP");
    }
};
exports.sendOTP = sendOTP;
const validateOTP = async (phone, otp) => {
    try {
        // get the phone number from the request body
        // Validate the phone number format
        const normalizedOtp = otp.trim();
        const normalizedPhone = phone.trim();
        if (!(0, helperFunctions_1.isValidPhone)(normalizedPhone)) {
            return {
                success: false,
                message: "Phone must contain only numbers and an optional leading +",
                user: null,
            };
        }
        if (!(0, helperFunctions_1.isValidOtpFormat)(normalizedOtp)) {
            return {
                success: false,
                message: "Invalid OTP format. Please enter a 6-digit number.",
                user: null,
            };
        }
        // here will first find otp record and then check if the otp is valid and not expired
        // Check if the user exists in the database
        const existingUser = await prisma_1.default.users.findUnique({
            where: { phone: normalizedPhone },
        });
        if (!existingUser) {
            return {
                success: false,
                message: "User not found",
                user: null,
            };
        }
        // lets find latest otp for the user and check if it is valid and not expired
        const latestOtpRecord = await prisma_1.default.otps.findFirst({
            where: {
                user_id: existingUser.id,
                destination: normalizedPhone,
            },
            orderBy: {
                created_at: "desc",
            },
        });
        if (!latestOtpRecord) {
            return {
                success: false,
                message: "No OTP found for this user",
                user: null,
            };
        }
        if (latestOtpRecord.attempts >= 5) {
            return {
                success: false,
                message: "Too many failed attempts. Please request a new OTP.",
                user: null,
            };
        }
        await prisma_1.default.otps.update({
            where: { id: latestOtpRecord.id },
            data: {
                attempts: {
                    increment: 1,
                },
            },
        });
        // Check if the OTP is expired
        if (latestOtpRecord.expires_at < new Date()) {
            return {
                success: false,
                message: "OTP has expired",
                user: null,
            };
        }
        // check if the provided OTP matches the stored OTP
        if (latestOtpRecord.otp_hash !== normalizedOtp ||
            latestOtpRecord.verified_at) {
            return {
                success: false,
                message: "Invalid OTP",
                user: null,
            };
        }
        // update the OTP record to mark it as verified
        await prisma_1.default.otps.update({
            where: { id: latestOtpRecord.id },
            data: {
                verified_at: new Date(),
            },
        });
        // update the user record to mark the phone as verified
        const updatedUser = await prisma_1.default.users.update({
            where: { id: existingUser.id },
            data: {
                is_phone_verified: true,
                status: "ACTIVE",
            },
        });
        return {
            success: true,
            message: "OTP verified successfully",
            user: updatedUser,
        };
    }
    catch (error) {
        console.error("Error verifying OTP:", error);
        return {
            success: false,
            message: "Failed to verify OTP",
            user: null,
        };
    }
};
exports.validateOTP = validateOTP;
//# sourceMappingURL=otpService.js.map