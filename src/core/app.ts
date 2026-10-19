import express from "express";
import cors from "cors";
import helmet from "helmet";
import routes from "./routes/index";
import { errorHandler } from "../validation/errorHandler";
import { requestLogger } from "../utils/requestLogger";

const app = express();
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

app.use(helmet());
app.use(cors());
app.use(requestLogger);

app.use((req, res, next) => {
  console.log("Request URL:", req.method, req.url);
  next();
});
app.get("/task", (req, res) => {
  res.send("🚀 Task Backend is Running!");
});
app.use("/api/v1", routes);
app.use(errorHandler);
export default app;
