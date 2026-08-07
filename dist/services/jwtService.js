"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateRefreshToken = exports.generateAuthToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const generateAuthToken = (user) => {
    try {
        const token = jsonwebtoken_1.default.sign({
            id: user.id,
            phone: user.phone,
        }, process.env.JWT_SECRET, {
            algorithm: "HS256",
            expiresIn: "5d",
            issuer: "my-api",
            audience: "my-web-app",
            jwtid: crypto.randomUUID(),
        });
        return token;
    }
    catch (error) {
        throw new Error("Error generating auth token");
    }
};
exports.generateAuthToken = generateAuthToken;
const generateRefreshToken = (user) => {
    try {
        const refresh_token = jsonwebtoken_1.default.sign({
            id: user.id,
        }, process.env.JWT_REFRESH_SECRET, {
            algorithm: "HS256",
            expiresIn: "5d",
            issuer: "my-api",
            audience: "my-web-app",
            jwtid: crypto.randomUUID(),
        });
        return refresh_token;
    }
    catch (error) {
        throw new Error("Error generating refresh token");
    }
};
exports.generateRefreshToken = generateRefreshToken;
//# sourceMappingURL=jwtService.js.map