import { Request, Response, NextFunction } from "express";
import { UserRepository, UserRecord } from "../repositories/user.repository";
import { hashPassword } from "../utils/password";
import { sendSuccess } from "../utils/response";
import { AuthenticatedRequest } from "../middleware/auth.middleware";
import { EntityRepository } from "../repositories/entity.repository";

export class UserController {
  static async getUsers(req: Request, res: Response, next: NextFunction) {
    try {
      const { search, role, department, active, page, limit } = req.query;

      const result = await UserRepository.getUsersFiltered({
        search: search as string,
        role: role as string,
        department: department as string,
        active: active as string,
        page: page ? parseInt(page as string, 10) : 1,
        limit: limit ? parseInt(limit as string, 10) : 50,
      });

      sendSuccess(res, result, "Users retrieved successfully");
    } catch (error) {
      next(error);
    }
  }

  static async getUserById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const user = await UserRepository.findByIdWithoutPassword(id);
      if (!user) {
        return res.status(404).json({ success: false, message: "User not found" });
      }
      sendSuccess(res, user, "User retrieved successfully");
    } catch (error) {
      next(error);
    }
  }

  static async createUser(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { email, password, name, role, department, avatarUrl, active } = req.body;

      if (!email || !name || !role) {
        return res.status(400).json({ success: false, message: "Name, email, and role are required fields" });
      }

      const existing = await UserRepository.findByEmail(email);
      if (existing) {
        return res.status(400).json({ success: false, message: "A user with this email address already exists" });
      }

      const rawPassword = password || "password123";
      const hashedPassword = await hashPassword(rawPassword);

      const newUser: UserRecord = {
        id: `u-${Date.now()}`,
        email: email.trim().toLowerCase(),
        password: hashedPassword,
        name: name.trim(),
        role: role.toUpperCase(),
        department: department || "IT Park General",
        avatarUrl: avatarUrl || `https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop`,
        active: active !== undefined ? Boolean(active) : true,
      };

      const createdUser = await UserRepository.createUser(newUser);

      // Audit Log
      EntityRepository.appendActivityLog({
        id: `act-${Date.now()}`,
        userId: req.user?.userId || "system",
        userName: req.user?.name || "System Admin",
        userRole: req.user?.role || "MANAGER",
        action: "CREATE_USER",
        entity: "users",
        entityId: createdUser.id,
        timestamp: new Date().toISOString(),
        details: `Created new user account: ${createdUser.email} (${createdUser.role})`,
      }).catch(() => {});

      sendSuccess(res, createdUser, "User created successfully", 201);
    } catch (error) {
      next(error);
    }
  }

  static async updateUser(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { email, password, name, role, department, avatarUrl, active } = req.body;

      const existingUser = await UserRepository.findById(id);
      if (!existingUser) {
        return res.status(404).json({ success: false, message: "User not found" });
      }

      const updates: Partial<UserRecord> = {};
      if (name !== undefined) updates.name = name.trim();
      if (email !== undefined) updates.email = email.trim().toLowerCase();
      if (role !== undefined) updates.role = role.toUpperCase();
      if (department !== undefined) updates.department = department;
      if (avatarUrl !== undefined) updates.avatarUrl = avatarUrl;
      if (active !== undefined) updates.active = Boolean(active);

      if (password && password.trim()) {
        updates.password = await hashPassword(password.trim());
      }

      const updatedUser = await UserRepository.updateUser(id, updates);

      // Audit Log
      EntityRepository.appendActivityLog({
        id: `act-${Date.now()}`,
        userId: req.user?.userId || "system",
        userName: req.user?.name || "System Admin",
        userRole: req.user?.role || "MANAGER",
        action: "UPDATE_USER",
        entity: "users",
        entityId: id,
        timestamp: new Date().toISOString(),
        details: `Updated user account ${id}: ${JSON.stringify(Object.keys(updates))}`,
      }).catch(() => {});

      sendSuccess(res, updatedUser, "User updated successfully");
    } catch (error) {
      next(error);
    }
  }

  static async toggleUserStatus(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const existingUser = await UserRepository.findById(id);
      if (!existingUser) {
        return res.status(404).json({ success: false, message: "User not found" });
      }

      const newStatus = req.body.active !== undefined ? Boolean(req.body.active) : !existingUser.active;
      const updatedUser = await UserRepository.updateUser(id, { active: newStatus });

      // Audit Log
      EntityRepository.appendActivityLog({
        id: `act-${Date.now()}`,
        userId: req.user?.userId || "system",
        userName: req.user?.name || "System Admin",
        userRole: req.user?.role || "MANAGER",
        action: newStatus ? "ACTIVATE_USER" : "DEACTIVATE_USER",
        entity: "users",
        entityId: id,
        timestamp: new Date().toISOString(),
        details: `${newStatus ? "Activated" : "Deactivated"} user account ${existingUser.email}`,
      }).catch(() => {});

      sendSuccess(res, updatedUser, `User status updated to ${newStatus ? "ACTIVE" : "INACTIVE"}`);
    } catch (error) {
      next(error);
    }
  }

  static async deleteUser(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const existingUser = await UserRepository.findById(id);
      if (!existingUser) {
        return res.status(404).json({ success: false, message: "User not found" });
      }

      await UserRepository.deleteUser(id);

      // Audit Log
      EntityRepository.appendActivityLog({
        id: `act-${Date.now()}`,
        userId: req.user?.userId || "system",
        userName: req.user?.name || "System Admin",
        userRole: req.user?.role || "MANAGER",
        action: "DELETE_USER",
        entity: "users",
        entityId: id,
        timestamp: new Date().toISOString(),
        details: `Deleted user account ${existingUser.email} (${id})`,
      }).catch(() => {});

      sendSuccess(res, { id }, "User deleted successfully");
    } catch (error) {
      next(error);
    }
  }
}
