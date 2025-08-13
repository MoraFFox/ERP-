import { Router, type Request, type Response } from "express"
import { prisma } from "../server"

const router: Router = Router()

/**
 * @route   GET /api/health
 * @desc    Health check endpoint
 * @access  Public
 */
router.get("/", async (req: Request, res: Response) => {
  try {
    // Check database connection
    await prisma.$queryRaw`SELECT 1`

    res.status(200).json({
      success: true,
      message: "ERP System API is healthy",
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || "development",
    })
  } catch (error) {
    res.status(503).json({
      success: false,
      message: "Service unavailable - database connection failed",
      timestamp: new Date().toISOString(),
    })
  }
})

/**
 * @route   GET /api/health/db
 * @desc    Database health check
 * @access  Public
 */
router.get("/db", async (req: Request, res: Response) => {
  try {
    const startTime = Date.now()
    await prisma.$queryRaw`SELECT 1`
    const responseTime = Date.now() - startTime

    res.status(200).json({
      success: true,
      message: "Database connection is healthy",
      responseTime: `${responseTime}ms`,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    res.status(503).json({
      success: false,
      message: "Database connection failed",
      error: error instanceof Error ? error.message : "Unknown error",
      timestamp: new Date().toISOString(),
    })
  }
})

export default router
