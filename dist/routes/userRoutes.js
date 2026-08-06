"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const userController_1 = require("../controllers/users/userController");
const router = (0, express_1.Router)();
router.post("/register", userController_1.CreateUser);
exports.default = router;
//# sourceMappingURL=userRoutes.js.map