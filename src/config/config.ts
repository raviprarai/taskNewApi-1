import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const schema = z.object({
    NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
    PORT: z.coerce.number().default(5002),

    MONGO_URI: z.string().min(10, "MONGO_URI is required"),
    MONGO_DB_NAME: z.string().min(1, "MONGO_DB_NAME is required"),

    JWT_SECRET: z.string().min(10).optional(),
    JWT_EXPIRY: z.string().default("1h"),

    SMTP_HOST: z.string().optional(),
    SMTP_PORT: z.coerce.number().optional(),
    SMTP_USER: z.string().optional(),
    SMTP_PASS: z.string().optional(),
});

const parsed = schema.safeParse(process.env);

if (!parsed.success) {
    console.error("❌ Invalid environment configuration:", parsed.error.format());
    process.exit(1);
}

const config = parsed.data;

export default config;
