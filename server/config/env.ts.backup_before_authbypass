import dotenv from "dotenv";

dotenv.config();

export const config = {
  port: 3000,
  nodeEnv: process.env.NODE_ENV || "development",
  jwtSecret: process.env.JWT_SECRET || "itpms_super_secret_jwt_access_token_key_2026",
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET || "itpms_super_secret_jwt_refresh_token_key_2026",
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "15m",
  jwtRefreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || "7d",
  databaseUrl: process.env.DATABASE_URL || "",
  corsOrigins: process.env.CORS_ORIGIN || "*",
  groqApiKey: process.env.GROQ_API_KEY || "",
  googleMapsPlatformKey: process.env.GOOGLE_MAPS_PLATFORM_KEY || "",
};
