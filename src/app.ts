import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import cookieParser from "cookie-parser";

const app = express();

app.use(cors());

app.use(helmet());

app.use(compression());

app.use(express.json());

app.use(cookieParser());

app.get("/", (_, res) => {
    res.json({
        success: true,
        message: "Server Running"
    });
});

export default app;