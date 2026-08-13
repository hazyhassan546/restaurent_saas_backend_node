import { Router } from "express";
import {
  getAllCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../controllers/categories/categoryController";
import {
  validateAuthorizationHeader,
  validateRequest,
} from "../middleware/validateRequest";
import {
  createCategorySchema,
  updateCategorySchema,
} from "../validators/categoryValidators";

const router = Router();

router.get("/", getAllCategories);

router.post(
  "/",
  validateAuthorizationHeader,
  validateRequest(createCategorySchema, "body"),
  createCategory,
);

router.patch(
  "/:categoryId",
  validateAuthorizationHeader,
  validateRequest(updateCategorySchema, "body"),
  updateCategory,
);

router.delete(
  "/:categoryId",
  validateAuthorizationHeader,
  deleteCategory,
);

export default router;
