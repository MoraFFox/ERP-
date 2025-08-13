import express, { Express } from "express"
import cors from "cors"
import helmet from "helmet"
import morgan from "morgan"
import dotenv from "dotenv"
import { PrismaClient } from "@prisma/client"

// Import routes
import authRoutes from "./routes/auth"
import clientRoutes from "./routes/clients"
import productRoutes from "./routes/products"
import healthRoutes from "./routes/health"

// Import middleware
import { errorHandler } from "./middleware/errorHandler"
import { rateLimiter } from "./middleware/rateLimiter"

// Load environment variables
dotenv.config()

// Initialize Express app
const app: Express = express()
const PORT = process.env.PORT || 3000

// Initialize Prisma client
export const prisma = new PrismaClient()

// Middleware
app.use(helmet())
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:3001",
    credentials: true,
  }),
)
app.use(morgan("combined"))
app.use(express.json({ limit: "10mb" }))
app.use(express.urlencoded({ extended: true }))
app.use(rateLimiter)

// Routes
app.use("/api/health", healthRoutes)
app.use("/auth", authRoutes)
app.use("/api/clients", clientRoutes)
app.use("/api/products", productRoutes)

// Error handling middleware
app.use(errorHandler)

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  })
})

// Graceful shutdown
process.on("SIGINT", async () => {
  console.log("Shutting down gracefully...")
  await prisma.$disconnect()
  process.exit(0)
})

process.on("SIGTERM", async () => {
  console.log("Shutting down gracefully...")
  await prisma.$disconnect()
  process.exit(0)
})

// Start server
app.listen(PORT, () => {
  console.log(`🚀 ERP System API running on port ${PORT}`)
  console.log(`📚 Environment: ${process.env.NODE_ENV || "development"}`)
})

export default app
