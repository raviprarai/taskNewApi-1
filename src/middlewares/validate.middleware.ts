import { Request, Response, NextFunction } from "express";
import Joi from "joi";
import { sendErrorResponse } from "../core/responses/response";
import { StatusCodes } from "http-status-codes";

export const validate = (
  schemaOrFactory:
    | Joi.ObjectSchema
    | ((req: Request) => Joi.ObjectSchema)
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const schema =
      typeof schemaOrFactory === "function"
        ? schemaOrFactory(req)
        : schemaOrFactory;

    const { error } = schema.validate(req.body, {
      abortEarly: false,
    });

    if (error) {
      const message = error.details
        .map((detail) => detail.message)
        .join(", ");

      return sendErrorResponse(
        res,
        message,
        StatusCodes.BAD_REQUEST,
        null
      );
    }

    next();
  };
};
