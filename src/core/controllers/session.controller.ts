import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

import {
  sendErrorResponse,
  sendSuccessResponse,
} from "../responses/response";
import * as sessionService from "../services/session.service";

export const createSession = async (
  req: Request,
  res: Response
) => {
  try {
    const result = await sessionService.createSession(req);

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

export const getAvailableSessions = async (
  req: Request,
  res: Response
) => {
  try {
    const result = await sessionService.getAvailableSessions(req);

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

export const bookSession = async (
  req: Request,
  res: Response
) => {
  try {
    const result = await sessionService.bookSession(req);

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

export const completeSession = async (
  req: Request,
  res: Response
) => {
  try {
    const result = await sessionService.completeSession(req);

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

