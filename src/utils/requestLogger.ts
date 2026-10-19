import { Request, Response, NextFunction } from "express";

export const requestLogger = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const start = Date.now();
  console.log("========== API HIT ==========");
  console.log("Time        :", new Date().toISOString());
  console.log("Method:", req.method);
  console.log("URL:", req.originalUrl);
  console.log("IP:", req.ip);
  console.log(`⏱ Api Duration   : ${Date.now() - start} ms`);
  console.log("================================");
  next();
};