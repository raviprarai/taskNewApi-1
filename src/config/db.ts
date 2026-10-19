import mongoose from "mongoose";
import logger from "../core/logger";

let isConnected = false;

export async function connectDB(
    uri: string,
    dbName: string
): Promise<void> {
    try {
        await mongoose.connect(uri, {
            dbName,
            autoIndex: false,
            maxPoolSize: 10,
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
            family: 4,
        });

        isConnected = true;
        logger.info({ dbName }, "MongoDB connected");
    } catch (err: unknown) {
        isConnected = false;
        logger.error({ err }, "MongoDB connection failed");
        throw err;
    }
}

export async function disconnectDB() {
    try {
        await mongoose.disconnect();
        isConnected = false;
        logger.info("MongoDB disconnected");
    } catch (err: unknown) {
        logger.error({ err }, "Error disconnecting MongoDB");
        throw err;
    }
}

export function mongoStatus() {
    // mongoose.connection.readyState: 0 = disconnected, 1 = connected, 2 = connecting, 3 = disconnecting
    return isConnected && mongoose.connection.readyState === 1;
}

// global event listeners
mongoose.connection.on("error", (err: any) => {
    logger.error({ err }, "MongoDB connection error (event)");
    isConnected = false;
});
mongoose.connection.on("disconnected", () => {
    logger.warn("MongoDB disconnected (event)");
    isConnected = false;
});
