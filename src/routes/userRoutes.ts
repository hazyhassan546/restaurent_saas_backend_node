import { Router } from "express";
import {
  getUserById,
  updateUserProfile,
} from "../controllers/users/userController";
import {
  validateAuthorizationHeader,
  validateRequest,
} from "../middleware/validateRequest";
import {
  registerUserSchema,
  updateProfileSchema,
} from "../validators/userValidators";

const router = Router();

router.get("/profile", validateAuthorizationHeader, getUserById);

router.patch(
  "/profile",
  validateAuthorizationHeader,
  validateRequest(updateProfileSchema, "body"),
  updateUserProfile,
);

export default router;
