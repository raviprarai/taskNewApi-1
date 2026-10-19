import http from "http";
import dotenv from "dotenv";
import chalk from "chalk";
import figlet from "figlet";
import gradient from "gradient-string";
import ora from "ora";

dotenv.config();

import app from "../core/app";
import config from "../config/config";
import logger from "./logger";
import { connectDB } from "../config/db";

const port = config.PORT || 5000;

const startServer = async () => {
    const spinner = ora("🚀 Starting Task backend...").start();
    try {
        spinner.text = "📡 Connecting to MongoDB...";
        await connectDB(config.MONGO_URI, config.MONGO_DB_NAME);
        spinner.succeed("✅ MongoDB connected");
        spinner.text = "⚡ Initializing HTTP server...";
        const server = app.listen(port, () => {
            spinner.succeed(`🎉 Server running at http://localhost:${port}`);

            // Fancy banner
            console.log(
                gradient.pastel.multiline(figlet.textSync("TASK🚀", { horizontalLayout: "fitted" }))
            );
            console.log(chalk.green.bold("✨ Server Started Successfully ✨"));
            console.log(chalk.blue.bold(`🌐 URL: http://localhost:${port}`));
            console.log(chalk.magenta(`📡 Environment: ${config.NODE_ENV || "development"}`));
            console.log(chalk.yellow("💾 Database: MongoDB Connected ✅"));
            console.log(chalk.cyan("-------------------------------------------------------"));
        });

        // shutdown
        const shutdown = async (signal: any) => {
            spinner.warn(`⚠️ Shutdown signal received: ${signal}`);
            try {
                server.close(() => logger.info("HTTP server closed"));
                process.exit(0);
            } catch (err) {
                logger.fatal({ err }, "Error during shutdown");
                process.exit(1);
            }
        };

        process.on("SIGINT", () => shutdown("SIGINT"));
        process.on("SIGTERM", () => shutdown("SIGTERM"));
    } catch (err) {
        spinner.fail("❌ Startup failed");
        logger.fatal({ err }, "Startup failed");
        process.exit(1);
    }
};

startServer();
