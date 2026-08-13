"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const compression_1 = __importDefault(require("compression"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const logger_1 = require("./utils/logger");
const request_id_middleware_1 = require("./middleware/request_id_middleware");
const routes_1 = require("./routes");
const app = (0, express_1.default)();
app.use(request_id_middleware_1.requestIdMiddleware);
app.use(logger_1.requestLogger);
app.use((0, cors_1.default)());
app.use((0, helmet_1.default)());
app.use((0, compression_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use(logger_1.responseLogger);
app.use((0, cookie_parser_1.default)());
app.get("/", (_, res) => {
    res.json({
        success: true,
        message: "Server Running",
    });
});
app.use("/api/v1/user", routes_1.userRoutes);
app.use("/api/v1/auth", routes_1.authRoutes);
app.use("/api/v1/products", routes_1.productRoutes);
app.use("/api/v1/categories", routes_1.categoryRoutes);
exports.default = app;
//# sourceMappingURL=app.js.map