import { Router } from "express";
import { uploadImageFile } from "../config/multer";
import { uploadImage } from "../controllers/images/imageController";
import {
  validateAuthorizationHeader,
  validateRequest,
} from "../middleware/validateRequest";
import { createImageSchema } from "../validators/imageValidators";

const router = Router();

router.post(
  "/upload",
  validateAuthorizationHeader,
  uploadImageFile.single("image"),
  validateRequest(createImageSchema, "body"),
  uploadImage,
);

export default router;
