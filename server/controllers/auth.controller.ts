import { Request, Response, NextFunction } from "express";
import { AuthService } from "../services/auth.service";
import { AuthenticatedRequest } from "../middleware/auth.middleware";
import { sendSuccess, sendError } from "../utils/response";

export class AuthController {
  static async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;
      const result = await AuthService.login(email, password);
      sendSuccess(res, result, "Login successful");
    } catch (error) {
      next(error);
    }
  }

  static async register(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await AuthService.register(req.body);
      sendSuccess(res, result, "User registered successfully", 201);
    } catch (error) {
      next(error);
    }
  }

  static async refreshToken(req: Request, res: Response, next: NextFunction) {
    try {
      const { refreshToken } = req.body;
      const result = await AuthService.refreshToken(refreshToken);
      sendSuccess(res, result, "Tokens refreshed successfully");
    } catch (error) {
      next(error);
    }
  }

  static async logout(req: Request, res: Response, next: NextFunction) {
    try {
      const { refreshToken } = req.body || {};
      const result = await AuthService.logout(refreshToken);
      sendSuccess(res, result, "Logged out successfully");
    } catch (error) {
      next(error);
    }
  }

  static async getMe(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user?.userId) {
        return sendError(res, "Unauthenticated", 401);
      }
      const user = await AuthService.getProfile(req.user.userId);
      sendSuccess(res, { user });
    } catch (error) {
      next(error);
    }
  }
}
