"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const productController_1 = require("../controllers/productController");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
router.use(auth_1.authenticateToken);
router.post("/", productController_1.ProductController.createProduct);
router.get("/", productController_1.ProductController.getProducts);
router.get("/:id", productController_1.ProductController.getProduct);
router.put("/:id", productController_1.ProductController.updateProduct);
router.delete("/:id", productController_1.ProductController.deleteProduct);
exports.default = router;
//# sourceMappingURL=products.js.map