import { Router } from "express";
import { CreateUser } from "../controllers/users/userController";

const router = Router();

router.post("/register", CreateUser);

export default router;
