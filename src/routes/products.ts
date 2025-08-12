import { Router } from "express"
import { ProductController } from "../controllers/productController"
import { authenticateToken } from "../middleware/auth"

const router = Router()

// Apply authentication to all product routes
router.use(authenticateToken)

/**
 * @route   POST /api/products
 * @desc    Create a new product
 * @access  Private
 */
router.post("/", ProductController.createProduct)

/**
 * @route   GET /api/products
 * @desc    Get all products with pagination and filtering
 * @access  Private
 */
router.get("/", ProductController.getProducts)

/**
 * @route   GET /api/products/:id
 * @desc    Get product by ID
 * @access  Private
 */
router.get("/:id", ProductController.getProduct)

/**
 * @route   PUT /api/products/:id
 * @desc    Update product by ID
 * @access  Private
 */
router.put("/:id", ProductController.updateProduct)

/**
 * @route   DELETE /api/products/:id
 * @desc    Delete product by ID
 * @access  Private
 */
router.delete("/:id", ProductController.deleteProduct)

export default router
