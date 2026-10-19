import express from "express";
import mongoose from "mongoose";

const router = express.Router();

router.get("/healthz", (req, res) => {
    res.json({ status: "ok", uptime: process.uptime() });
});

router.get("/readyz", async (req, res) => {
    try {
        const db = mongoose.connection.db;

        if (!db) {
            return res.status(503).json({
                status: "unready",
                error: "Database not connected",
            });
        }

        await db.admin().ping();

        res.json({ status: "ready" });
    } catch (err) {
        const message = err instanceof Error ? err.message : "Unknown error";

        res.status(503).json({
            status: "unready",
            error: message,
        });
    }
});

export default router;
