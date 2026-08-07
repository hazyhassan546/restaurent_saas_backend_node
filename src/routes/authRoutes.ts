import { Router } from "express";
import {
  initializeUserLogin,
  refreshToken,
  verifyOTP,
} from "../controllers/auth/authController";
import { validateRequest, validateAuthorizationHeader } from "../middleware/validateRequest";
import { initLoginSchema, verifyOtpSchema } from "../validators/authValidators";

const router = Router();

router.post("/init-login", validateRequest(initLoginSchema), initializeUserLogin);
router.post("/verify-otp", validateRequest(verifyOtpSchema), verifyOTP);
router.post("/refresh-token", validateAuthorizationHeader, refreshToken);

export default router;
