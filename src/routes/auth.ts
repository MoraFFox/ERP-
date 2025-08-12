import { Router } from "express"
import { AuthController } from "../controllers/authController"
import { authLimiter } from "../middleware/rateLimiter"

const router = Router()

// Apply rate limiting to all auth routes
router.use(authLimiter)

/**
 * @route   POST /auth/register
 * @desc    Register a new user
 * @access  Public
 */
router.post("/register", AuthController.register)

/**
 * @route   POST /auth/login
 * @desc    Login user
 * @access  Public
 */
router.post("/login", AuthController.login)

/**
 * @route   POST /auth/refresh
 * @desc    Refresh access token
 * @access  Public
 */
router.post("/refresh", AuthController.refreshToken)

export default router
