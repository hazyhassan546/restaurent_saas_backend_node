import { Router } from "express";
import {
  initializeUserLogin,
  verifyOTP,
} from "../controllers/auth/authController";

const router = Router();

router.post("/init-login", initializeUserLogin);
router.post("/verify-otp", verifyOTP);

export default router;
