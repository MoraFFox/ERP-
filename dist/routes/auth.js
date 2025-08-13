"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authController_1 = require("../controllers/authController");
const rateLimiter_1 = require("../middleware/rateLimiter");
const router = (0, express_1.Router)();
router.use(rateLimiter_1.authLimiter);
router.post("/register", authController_1.AuthController.register);
router.post("/login", authController_1.AuthController.login);
router.post("/refresh", authController_1.AuthController.refreshToken);
exports.default = router;
//# sourceMappingURL=auth.js.map