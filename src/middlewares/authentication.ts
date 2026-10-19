
import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";

import UserModel, { IUser } from "../models/auth.model";
import { verifyJwtToken } from "../utils/jwt";
import { sendErrorResponse } from "../core/responses/response";
import { getMessages } from "../utils/getMessages";

export interface JwtPayload {
    _id?: string;
    email?: string;
    iat?: number;
    exp?: number;
}

declare global {
    namespace Express {
        interface Request {
            userData?: IUser;
            tokenData?: JwtPayload;
        }
    }
}

const extractToken = (req: Request): string | undefined => {
    const authorization = req.headers.authorization;

    if (typeof authorization === "string") {
        const [type, token] = authorization.split(" ");

        if (type?.toLowerCase() === "bearer" && token) {
            return token;
        }
    }

    if (typeof req.headers.accesstoken === "string") {
        return req.headers.accesstoken;
    }

    if (typeof req.headers["x-access-token"] === "string") {
        return req.headers["x-access-token"];
    }

    return undefined;
};

export const verifyUserToken = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    const msg = getMessages(req);

    try {
        const token = extractToken(req);

        if (!token) {
            sendErrorResponse(
                res,
                msg.token,
                StatusCodes.UNAUTHORIZED,
                null
            );
            return;
        }

        const decoded = verifyJwtToken(token) as JwtPayload;

        if (!decoded?._id) {
            sendErrorResponse(
                res,
                msg.InvalidToken,
                StatusCodes.UNAUTHORIZED,
                null
            );
            return;
        }

        const user = await UserModel.findById(decoded._id);

        if (!user) {
            sendErrorResponse(
                res,
                msg.userNotFounded,
                StatusCodes.UNAUTHORIZED,
                null
            );
            return;
        }

        req.userData = user;
        req.tokenData = decoded;

        next();
    } catch (error: unknown) {
        sendErrorResponse(
            res,
            error instanceof Error
                ? error.message
                : "Invalid or expired token",
            StatusCodes.UNAUTHORIZED,
            null
        );
    }
};

// Verify token only, without checking the user in the database
export const verifyUserTokens = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    const msg = getMessages(req);

    try {
        const token = extractToken(req);

        if (!token) {
            sendErrorResponse(
                res,
                msg.token,
                StatusCodes.UNAUTHORIZED,
                null
            );
            return;
        }

        const decoded = verifyJwtToken(token) as JwtPayload;

        if (!decoded?._id) {
            sendErrorResponse(
                res,
                msg.InvalidToken,
                StatusCodes.UNAUTHORIZED,
                null
            );
            return;
        }

        req.tokenData = decoded;

        next();
    } catch (error: unknown) {
        sendErrorResponse(
            res,
            error instanceof Error
                ? error.message
                : "Session expired. Please login again.",
            StatusCodes.UNAUTHORIZED,
            null
        );
    }
};
