import { Request, Response, NextFunction } from "express";
import { RbacRepository } from "../repositories/rbac.repository";
import { UserRepository } from "../repositories/user.repository";
import { sendSuccess } from "../utils/response";
import { AuthenticatedRequest } from "../middleware/auth.middleware";

export class RbacController {
  static async getRoles(req: Request, res: Response, next: NextFunction) {
    try {
      const roles = await RbacRepository.getAllRoles();
      const rolesWithPermissions = await Promise.all(
        roles.map(async (role) => {
          const permissions = await RbacRepository.getPermissionsForRole(role.name);
          return {
            ...role,
            permissions,
          };
        })
      );
      sendSuccess(res, rolesWithPermissions, "Roles retrieved successfully");
    } catch (error) {
      next(error);
    }
  }

  static async getPermissions(req: Request, res: Response, next: NextFunction) {
    try {
      const permissions = await RbacRepository.getAllPermissions();
      sendSuccess(res, permissions, "Permissions retrieved successfully");
    } catch (error) {
      next(error);
    }
  }

  static async getUserPermissions(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const userRole = req.user?.role || "MANAGER";
      const permissions = await RbacRepository.getPermissionsForRole(userRole);
      sendSuccess(res, { role: userRole, permissions }, "User permissions retrieved successfully");
    } catch (error) {
      next(error);
    }
  }

  static async assignRole(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { userId, role } = req.body;
      if (!userId || !role) {
        return res.status(400).json({ success: false, message: "userId and role are required" });
      }

      const user = await UserRepository.findById(userId);
      if (!user) {
        return res.status(404).json({ success: false, message: "User not found" });
      }

      const updatedUser = await UserRepository.updateUser(userId, { role });
      sendSuccess(res, updatedUser, `Role '${role}' assigned to user '${userId}' successfully`);
    } catch (error) {
      next(error);
    }
  }
}
