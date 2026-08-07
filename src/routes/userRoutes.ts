import { Router } from "express";
import { CreateUser } from "../controllers/users/userController";
import { validateRequest } from "../middleware/validateRequest";
import { registerUserSchema } from "../validators/userValidators";

const router = Router();

router.post("/register", validateRequest(registerUserSchema), CreateUser);

export default router;
