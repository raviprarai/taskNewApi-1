import { Request } from "express";
import { enMessages } from "../core/message/english";
import { arMessages } from "../core/message/arabic";

export type SupportedLanguage = "en" | "ar";

export const getMessages = (
  req: Request
) => {
  const language =
    (req.headers.language as SupportedLanguage)?.toLowerCase() ||
    "en";

  return language === "ar"
    ? arMessages
    : enMessages;
};