"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authController_1 = require("../controllers/auth/authController");
const validateRequest_1 = require("../middleware/validateRequest");
const authValidators_1 = require("../validators/authValidators");
const router = (0, express_1.Router)();
router.post("/init-login", (0, validateRequest_1.validateRequest)(authValidators_1.initLoginSchema), authController_1.initializeUserLogin);
router.post("/verify-otp", (0, validateRequest_1.validateRequest)(authValidators_1.verifyOtpSchema), authController_1.verifyOTP);
router.post("/refresh-token", validateRequest_1.validateAuthorizationHeader, authController_1.refreshToken);
exports.default = router;
//# sourceMappingURL=authRoutes.js.map