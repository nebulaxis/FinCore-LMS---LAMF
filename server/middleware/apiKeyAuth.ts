import { Request, Response, NextFunction } from "express";
import { API_KEYS } from "../config/apiKeys";

export function apiKeyAuth(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const apiKey = req.headers["x-api-key"] as string;

  if (!apiKey || !API_KEYS[apiKey]) {
    return res.status(401).json({
      success: false,
      error: "Invalid or missing API key",
    });
  }

  (req as any).user = API_KEYS[apiKey];
  next();
}
