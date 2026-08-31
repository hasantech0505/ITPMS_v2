import jwt from "jsonwebtoken";
import { config } from "../config/env";

export interface TokenPayload {
  userId: string;
  email: string;
  role: string;
  name?: string;
}

function parseExpiresIn(val: any, fallback: string | number): string | number {
  if (!val) return fallback;
  if (typeof val === "number") return val;
  if (typeof val === "string") {
    const trimmed = val.trim();
    if (!trimmed) return fallback;
    if (/^\d+$/.test(trimmed)) {
      const num = parseInt(trimmed, 10);
      return isNaN(num) ? fallback : num;
    }
    if (/^\d+[smhdw]$/i.test(trimmed)) {
      return trimmed;
    }
    return fallback;
  }
  return fallback;
}

export function generateAccessToken(payload: TokenPayload): string {
  const expiresIn = parseExpiresIn(config.jwtExpiresIn, "15m");
  return jwt.sign(payload, config.jwtSecret, {
    expiresIn: expiresIn as any,
  });
}

export function generateRefreshToken(payload: TokenPayload): string {
  const expiresIn = parseExpiresIn(config.jwtRefreshExpiresIn, "7d");
  return jwt.sign(payload, config.jwtRefreshSecret, {
    expiresIn: expiresIn as any,
  });
}

export function verifyAccessToken(token: string): TokenPayload | null {
  try {
    return jwt.verify(token, config.jwtSecret) as TokenPayload;
  } catch (err) {
    return null;
  }
}

export function verifyRefreshToken(token: string): TokenPayload | null {
  try {
    return jwt.verify(token, config.jwtRefreshSecret) as TokenPayload;
  } catch (err) {
    return null;
  }
}

