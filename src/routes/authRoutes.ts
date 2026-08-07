import { Router } from "express";
import {
  initializeUserLogin,
  refreshToken,
  verifyOTP,
} from "../controllers/auth/authController";

const router = Router();

router.post("/init-login", initializeUserLogin);
router.post("/verify-otp", verifyOTP);
router.post("/refresh-token", refreshToken);

export default router;
