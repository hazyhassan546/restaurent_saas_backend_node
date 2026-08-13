"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.imageRoutes = exports.categoryRoutes = exports.productRoutes = exports.authRoutes = exports.userRoutes = void 0;
const userRoutes_1 = __importDefault(require("./userRoutes"));
exports.userRoutes = userRoutes_1.default;
const authRoutes_1 = __importDefault(require("./authRoutes"));
exports.authRoutes = authRoutes_1.default;
const productRoutes_1 = __importDefault(require("./productRoutes"));
exports.productRoutes = productRoutes_1.default;
const categoryRoutes_1 = __importDefault(require("./categoryRoutes"));
exports.categoryRoutes = categoryRoutes_1.default;
const imageRoutes_1 = __importDefault(require("./imageRoutes"));
exports.imageRoutes = imageRoutes_1.default;
//# sourceMappingURL=index.js.map