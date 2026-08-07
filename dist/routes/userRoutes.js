"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const userController_1 = require("../controllers/users/userController");
const validateRequest_1 = require("../middleware/validateRequest");
const userValidators_1 = require("../validators/userValidators");
const router = (0, express_1.Router)();
router.post("/register", (0, validateRequest_1.validateRequest)(userValidators_1.registerUserSchema), userController_1.CreateUser);
exports.default = router;
//# sourceMappingURL=userRoutes.js.map