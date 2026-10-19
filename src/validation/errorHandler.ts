import { Request, Response, NextFunction } from "express";
import BugsModel from "../models/bugs.model";
import logger from "../core/logger";
import { getMessages } from "../utils/getMessages";

interface AppError extends Error {
  status?: number;
  code?: string;
}

export const errorHandler = (
  err: AppError,
  req: Request,
  res: Response,
  next: NextFunction
): Response => {
  const msg = getMessages(req);
  const status = err.status ?? 500;
  const code = err.code ?? msg.ERR_GENERIC;
  const message = err.message ?? msg.Internal;

  BugsModel.create({
    error: message,
    status,
    code,
    meta: {
      stack: err.stack,
    },
    request: {
      method: req.method,
      url: req.originalUrl,
      headers: {
        "user-agent": req.headers["user-agent"],
        authorization: req.headers["authorization"],
      },
      body: req.body,
    },
  }).catch((dbErr: Error) => {
    logger.error({ dbErr }, "Failed to persist error log");
  });

  logger.error(
    {
      err,
      status,
      code,
      url: req.originalUrl,
    },
    "Unhandled error"
  );

  return res.status(status).json({
    success: false,
    status,
    code,
    message:
      process.env.NODE_ENV === "production" && status === 500
        ? msg.Internal
        : message,
    data: {},
  });
};