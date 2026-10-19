import { Response } from "express";
import { StatusCodes } from "http-status-codes";


export const sendSuccessResponse = <T>(
  res: Response,
  data: T,
  message: string,
  statusCode: number = StatusCodes.OK
): Response => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
};
export const sendSuccessResponses = <T>(
  res: Response,
  data: T,
  creditLimit: T,
  message: string,
  statusCode: number = StatusCodes.OK
): Response => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
    creditLimit
  });
};

export const sendErrorResponse = (
  res: Response,
  message: string,
  statusCode: number = StatusCodes.FORBIDDEN,
  data: unknown = null
): Response => {
  return res.status(statusCode).json({
    success: false,
    message,
    data,
  });
};