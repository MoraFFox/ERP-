"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductController = void 0;
const productService_1 = require("../services/productService");
const product_1 = require("../validation/product");
class ProductController {
    static async createProduct(req, res, next) {
        const authReq = req;
        try {
            const { error, value } = product_1.createProductSchema.validate(req.body);
            if (error) {
                return res.status(400).json({
                    success: false,
                    message: "Validation error",
                    errors: error.details.map((detail) => detail.message),
                });
            }
            const product = await productService_1.ProductService.createProduct(value, authReq.user.userId);
            return res.status(201).json({
                success: true,
                message: "Product created successfully",
                data: product,
            });
        }
        catch (error) {
            return next(error);
        }
    }
    static async getProduct(req, res, next) {
        const { id } = req.params;
        try {
            const product = await productService_1.ProductService.getProductById(id);
            return res.status(200).json({
                success: true,
                data: product,
            });
        }
        catch (error) {
            return next(error);
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
            return res.status(200).json({
                success: true,
                data: result,
            });
        }
        catch (error) {
            return next(error);
        }
    }
    static async updateProduct(req, res, next) {
        const authReq = req;
        const { id } = req.params;
        try {
            const { error, value } = product_1.updateProductSchema.validate(req.body);
            if (error) {
                return res.status(400).json({
                    success: false,
                    message: "Validation error",
                    errors: error.details.map((detail) => detail.message),
                });
            }
            const product = await productService_1.ProductService.updateProduct(id, value);
            return res.status(200).json({
                success: true,
                message: "Product updated successfully",
                data: product,
            });
        }
        catch (error) {
            return next(error);
        }
    }
    static async deleteProduct(req, res, next) {
        const { id } = req.params;
        try {
            await productService_1.ProductService.deleteProduct(id);
            return res.status(200).json({
                success: true,
                message: "Product deleted successfully",
            });
        }
        catch (error) {
            return next(error);
        }
    }
}
exports.ProductController = ProductController;
//# sourceMappingURL=productController.js.map