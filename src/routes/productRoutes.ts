import { Router } from "express";
import {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
} from "../controllers/products/productController";
import {
  validateAuthorizationHeader,
  validateRequest,
} from "../middleware/validateRequest";
import {
  createProductSchema,
  updateProductSchema,
} from "../validators/productValidators";

const router = Router();

router.get("/", getAllProducts);

router.post(
  "/",
  validateAuthorizationHeader,
  validateRequest(createProductSchema, "body"),
  createProduct,
);

router.get("/:productId", getProductById);

router.patch(
  "/:productId",
  validateAuthorizationHeader,
  validateRequest(updateProductSchema, "body"),
  updateProduct,
);

export default router;
