import path from "path";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import cookieParser from "cookie-parser";
import { requestLogger, responseLogger } from "./utils/logger";
import { requestIdMiddleware } from "./middleware/request_id_middleware";
import {
  authRoutes,
  productRoutes,
  userRoutes,
  categoryRoutes,
  imageRoutes,
} from "./routes";

const app = express();

app.use(requestIdMiddleware);
app.use(requestLogger);
app.use(cors());

app.use(helmet());
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));
app.use(responseLogger);
app.use(cookieParser());

app.get("/", (_, res) => {
  res.json({
    success: true,
    message: "Server Running",
  });
});
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/products", productRoutes);
app.use("/api/v1/categories", categoryRoutes);
app.use("/api/v1/images", imageRoutes);

export default app;
