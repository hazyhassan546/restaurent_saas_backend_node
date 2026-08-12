import { Router } from "express";
import {
  getUserById,
  updateUserProfile,
  addUserAddress,
  updateUserAddress,
  getAllUserAddresses,
  deleteUserAddress,
} from "../controllers/users/userController";
import {
  validateAuthorizationHeader,
  validateRequest,
} from "../middleware/validateRequest";
import {
  registerUserSchema,
  updateProfileSchema,
  addAddressSchema,
  updateAddressSchema,
} from "../validators/userValidators";

const router = Router();

router.get("/profile", validateAuthorizationHeader, getUserById);

router.patch(
  "/profile",
  validateAuthorizationHeader,
  validateRequest(updateProfileSchema, "body"),
  updateUserProfile,
);

router.get(
  "/addresses",
  validateAuthorizationHeader,
  getAllUserAddresses,
);

router.post(
  "/address",
  validateAuthorizationHeader,
  validateRequest(addAddressSchema, "body"),
  addUserAddress,
);

router.patch(
  "/address/:addressId",
  validateAuthorizationHeader,
  validateRequest(updateAddressSchema, "body"),
  updateUserAddress,
);

router.delete(
  "/address/:addressId",
  validateAuthorizationHeader,
  deleteUserAddress,
);

export default router;
