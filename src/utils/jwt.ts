import jwt, { JwtPayload, SignOptions } from "jsonwebtoken";
import UserModel from "../models/auth.model";

interface JwtResponse {
  status: number;
  token?: string;
  error?: string;
}


export const generateJwtToken = (
  data: Record<string, any>,
  expiresIn?: string
): JwtResponse => {
  try {
    const secretKey = process.env.JWT_SECRET;

    if (!secretKey) {
      throw new Error("JWT_SECRET is not defined");
    }
    const payload = { ...data };
    delete payload.exp;

    const options: SignOptions = expiresIn
  ? { expiresIn: expiresIn as jwt.SignOptions["expiresIn"] }
  : {};

    const token = jwt.sign(payload, secretKey, options);

    return {
      status: 1,
      token,
    };
  } catch (error: any) {
    return {
      status: 0,
      error: error.message || "JWT generation failed",
    };
  }
};


export const verifyJwtToken = (
  token: string
): JwtPayload | string => {
  const secretKey = process.env.JWT_SECRET;

  if (!secretKey) {
    throw new Error("JWT_SECRET is not defined");
  }

  return jwt.verify(token, secretKey);
};
