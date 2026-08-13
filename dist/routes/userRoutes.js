"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const userController_1 = require("../controllers/users/userController");
const validateRequest_1 = require("../middleware/validateRequest");
const userValidators_1 = require("../validators/userValidators");
const router = (0, express_1.Router)();
router.get("/profile", validateRequest_1.validateAuthorizationHeader, userController_1.getUserById);
router.patch("/profile", validateRequest_1.validateAuthorizationHeader, (0, validateRequest_1.validateRequest)(userValidators_1.updateProfileSchema, "body"), userController_1.updateUserProfile);
router.get("/addresses", validateRequest_1.validateAuthorizationHeader, userController_1.getAllUserAddresses);
router.post("/address", validateRequest_1.validateAuthorizationHeader, (0, validateRequest_1.validateRequest)(userValidators_1.addAddressSchema, "body"), userController_1.addUserAddress);
router.patch("/address/:addressId", validateRequest_1.validateAuthorizationHeader, (0, validateRequest_1.validateRequest)(userValidators_1.updateAddressSchema, "body"), userController_1.updateUserAddress);
router.delete("/address/:addressId", validateRequest_1.validateAuthorizationHeader, userController_1.deleteUserAddress);
exports.default = router;
//# sourceMappingURL=userRoutes.js.map