import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

import {
  sendErrorResponse,
  sendSuccessResponse,
} from "../responses/response";
import * as authService from "../services/auth";

export const createAccount = async (
  req: Request,
  res: Response
) => {
  try {
    const result = await authService.createAccount(req);

    if (result.status === 0) {
      return sendErrorResponse(
        res,
        result.message,
        StatusCodes.BAD_REQUEST
      );
    }

    if (result.status === -1) {
      return sendErrorResponse(
        res,
        result.message,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }

    return sendSuccessResponse(
      res,
      result.data,
      result.message,
      StatusCodes.OK
    );
  } catch (error: any) {
    console.error("Upload   Error:", error);

    return sendErrorResponse(
      res,
      error?.message || "Internal server error",
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  }
};

export const getUserSessions = async (
  req: Request,
  res: Response
) => {
  try {
    const result = await authService.getUserSessions(req);

    if (result.status === 0) {
      return sendErrorResponse(
        res,
        result.message,
        StatusCodes.BAD_REQUEST
      );
    }
    if (result.status === 2) {
      return sendErrorResponse(
        res,
        result.message,
        StatusCodes.NOT_FOUND
      );
    }

    if (result.status === -1) {
      return sendErrorResponse(
        res,
        result.message,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }

    return sendSuccessResponse(
      res,
      result.data,
      result.message,
      StatusCodes.OK
    );
  } catch (error: any) {
    console.error("Upload   Error:", error);

    return sendErrorResponse(
      res,
      error?.message || "Internal server error",
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  }
};


