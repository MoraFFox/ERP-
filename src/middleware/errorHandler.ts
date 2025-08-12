import type { Request, Response, NextFunction } from "express"
import { Prisma } from "@prisma/client"

export interface AppError extends Error {
  statusCode?: number
  isOperational?: boolean
}

export const errorHandler = (error: AppError, req: Request, res: Response, next: NextFunction) => {
  let statusCode = error.statusCode || 500
  let message = error.message || "Internal Server Error"

  // Handle Prisma errors
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    switch (error.code) {
      case "P2002":
        statusCode = 409
        message = "A record with this information already exists"
        break
      case "P2025":
        statusCode = 404
        message = "Record not found"
        break
      case "P2003":
        statusCode = 400
        message = "Invalid reference to related record"
        break
      default:
        statusCode = 400
        message = "Database operation failed"
    }
  }

  // Handle Prisma validation errors
  if (error instanceof Prisma.PrismaClientValidationError) {
    statusCode = 400
    message = "Invalid data provided"
  }

  // Log error for debugging (in production, use proper logging service)
  if (process.env.NODE_ENV === "development") {
    console.error("Error:", error)
  }

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === "development" && { stack: error.stack }),
  })
}

export const createError = (message: string, statusCode = 500): AppError => {
  const error: AppError = new Error(message)
  error.statusCode = statusCode
  error.isOperational = true
  return error
}
