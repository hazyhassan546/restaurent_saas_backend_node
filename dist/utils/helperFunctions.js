"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isValidPhone = exports.isValidOtpFormat = void 0;
const isValidOtpFormat = (otp) => {
    const otpRegex = /^\d{6}$/; // Regular expression to match a 6-digit number
    return otpRegex.test(otp);
};
exports.isValidOtpFormat = isValidOtpFormat;
const isValidPhone = (value) => {
    return typeof value === "string" && /^\+?[0-9]+$/.test(value.trim());
};
exports.isValidPhone = isValidPhone;
//# sourceMappingURL=helperFunctions.js.map