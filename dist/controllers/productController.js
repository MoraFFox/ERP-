"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductController = void 0;
const productService_1 = require("../services/productService");
const product_1 = require("../validation/product");
class ProductController {
    static async createProduct(req, res, next) {
        try {
            const { error, value } = product_1.createProductSchema.validate(req.body);
            if (error) {
                return res.status(400).json({
                    success: false,
                    message: "Validation error",
                    errors: error.details.map((detail) => detail.message),
                });
            }
            const product = await productService_1.ProductService.createProduct(value, req.user.userId);
            res.status(201).json({
                success: true,
                message: "Product created successfully",
                data: product,
            });
        }
        catch (error) {
            next(error);
        }
    }
    static async getProduct(req, res, next) {
        try {
            const { id } = req.params;
            const product = await productService_1.ProductService.getProductById(id);
            res.status(200).json({
                success: true,
                data: product,
            });
        }
        catch (error) {
            next(error);
        }
    }
    static async getProducts(req, res, next) {
        try {
            const { error, value } = product_1.productQuerySchema.validate(req.query);
            if (error) {
                return res.status(400).json({
                    success: false,
                    message: "Validation error",
                    errors: error.details.map((detail) => detail.message),
                });
            }
            const result = await productService_1.ProductService.getProducts(value);
            res.status(200).json({
                success: true,
                data: result,
            });
        }
        catch (error) {
            next(error);
        }
    }
    static async updateProduct(req, res, next) {
        try {
            const { id } = req.params;
            const { error, value } = product_1.updateProductSchema.validate(req.body);
            if (error) {
                return res.status(400).json({
                    success: false,
                    message: "Validation error",
                    errors: error.details.map((detail) => detail.message),
                });
            }
            const product = await productService_1.ProductService.updateProduct(id, value);
            res.status(200).json({
                success: true,
                message: "Product updated successfully",
                data: product,
            });
        }
        catch (error) {
            next(error);
        }
    }
    static async deleteProduct(req, res, next) {
        try {
            const { id } = req.params;
            await productService_1.ProductService.deleteProduct(id);
            res.status(200).json({
                success: true,
                message: "Product deleted successfully",
            });
        }
        catch (error) {
            next(error);
        }
    }
}
exports.ProductController = ProductController;
//# sourceMappingURL=productController.js.map