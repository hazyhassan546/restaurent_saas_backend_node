import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import cookieParser from "cookie-parser";
import { requestLogger, responseLogger } from "./utils/logger";
import { requestIdMiddleware } from "./middleware/request_id_middleware";
import { authRoutes, userRoutes } from "./routes";

const app = express();

app.use(requestIdMiddleware);
app.use(requestLogger);
app.use(cors());

app.use(helmet());
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
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

export default app;
