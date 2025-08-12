"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const server_1 = require("../server");
const router = (0, express_1.Router)();
router.get("/", async (req, res) => {
    try {
        await server_1.prisma.$queryRaw `SELECT 1`;
        res.status(200).json({
            success: true,
            message: "ERP System API is healthy",
            timestamp: new Date().toISOString(),
            uptime: process.uptime(),
            environment: process.env.NODE_ENV || "development",
        });
    }
    catch (error) {
        res.status(503).json({
            success: false,
            message: "Service unavailable - database connection failed",
            timestamp: new Date().toISOString(),
        });
    }
});
router.get("/db", async (req, res) => {
    try {
        const startTime = Date.now();
        await server_1.prisma.$queryRaw `SELECT 1`;
        const responseTime = Date.now() - startTime;
        res.status(200).json({
            success: true,
            message: "Database connection is healthy",
            responseTime: `${responseTime}ms`,
            timestamp: new Date().toISOString(),
        });
    }
    catch (error) {
        res.status(503).json({
            success: false,
            message: "Database connection failed",
            error: error instanceof Error ? error.message : "Unknown error",
            timestamp: new Date().toISOString(),
        });
    }
});
exports.default = router;
//# sourceMappingURL=health.js.map