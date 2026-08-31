import { Request, Response, NextFunction } from "express";
import { ResidentRepository } from "../repositories/resident.repository";
import { sendSuccess, sendError } from "../utils/response";
import { AuthenticatedRequest } from "../middleware/auth.middleware";
import { EntityRepository } from "../repositories/entity.repository";

export class ResidentController {
  static async getResidents(req: Request, res: Response, next: NextFunction) {
    try {
      const {
        search,
        status,
        district,
        industry,
        exportRange,
        staffRange,
        year,
        potentialStage,
        upcomingStage,
        page,
        limit,
        sortBy,
        sortOrder,
      } = req.query;

      const result = await ResidentRepository.getResidentsFiltered({
        search: search as string,
        status: status as string,
        district: district as string,
        industry: industry as string,
        exportRange: exportRange as string,
        staffRange: staffRange as string,
        year: year as string,
        potentialStage: potentialStage as string,
        upcomingStage: upcomingStage as string,
        page: page ? parseInt(page as string, 10) : 1,
        limit: limit ? parseInt(limit as string, 10) : 50,
        sortBy: sortBy as string,
        sortOrder: (sortOrder as "asc" | "desc") || "asc",
      });

      sendSuccess(res, result, "Residents retrieved successfully");
    } catch (error) {
      next(error);
    }
  }

  static async getResidentById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const resident = await ResidentRepository.findById(id);

      if (!resident) {
        return sendError(res, "Resident not found", 404);
      }

      sendSuccess(res, resident, "Resident details retrieved successfully");
    } catch (error) {
      next(error);
    }
  }

  static async getStatistics(req: Request, res: Response, next: NextFunction) {
    try {
      const stats = await ResidentRepository.getStatistics();
      sendSuccess(res, stats, "Resident statistics retrieved successfully");
    } catch (error) {
      next(error);
    }
  }

  static async createResident(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { companyName, director, registrationNumber, email, status } = req.body;

      if (!companyName || !companyName.trim()) {
        return sendError(res, "Company Name is required", 400);
      }
      if (!director || !director.trim()) {
        return sendError(res, "Director name is required", 400);
      }
      if (!registrationNumber || !registrationNumber.trim()) {
        return sendError(res, "Registration Number / INN is required", 400);
      }

      // Check registration number INN uniqueness
      const existing = await ResidentRepository.findByRegistrationNumber(registrationNumber.trim());
      if (existing) {
        return sendError(res, `Resident with Registration Number / INN ${registrationNumber} already exists`, 409);
      }

      const created = await ResidentRepository.createResident({
        ...req.body,
        companyName: companyName.trim(),
        director: director.trim(),
        registrationNumber: registrationNumber.trim(),
        email: email ? email.trim() : undefined,
      });

      // Audit Log
      const userContext = req.user
        ? { id: req.user.userId, name: req.user.name || req.user.email, role: req.user.role }
        : { id: "u-1", name: "System Admin", role: "SUPER_ADMIN" };

      EntityRepository.appendActivityLog({
        id: `act-${Date.now()}`,
        userId: userContext.id,
        userName: userContext.name,
        userRole: userContext.role,
        action: "CREATE_RESIDENT",
        entity: "residents",
        entityId: created.id,
        timestamp: new Date().toISOString(),
        details: `Registered new resident '${created.companyName}' (INN: ${created.registrationNumber})`,
      }).catch(() => {});

      sendSuccess(res, created, "Resident registered successfully", 201);
    } catch (error) {
      next(error);
    }
  }

  static async updateResident(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const resident = await ResidentRepository.findById(id);

      if (!resident) {
        return sendError(res, "Resident not found", 404);
      }

      // If updating registration number, check uniqueness
      if (req.body.registrationNumber && req.body.registrationNumber !== resident.registrationNumber) {
        const existing = await ResidentRepository.findByRegistrationNumber(req.body.registrationNumber.trim());
        if (existing && existing.id !== id) {
          return sendError(res, `Resident with INN ${req.body.registrationNumber} already exists`, 409);
        }
      }

      const updated = await ResidentRepository.updateResident(id, req.body);

      // Audit Log
      const userContext = req.user
        ? { id: req.user.userId, name: req.user.name || req.user.email, role: req.user.role }
        : { id: "u-1", name: "System Admin", role: "SUPER_ADMIN" };

      EntityRepository.appendActivityLog({
        id: `act-${Date.now()}`,
        userId: userContext.id,
        userName: userContext.name,
        userRole: userContext.role,
        action: "UPDATE_RESIDENT",
        entity: "residents",
        entityId: id,
        timestamp: new Date().toISOString(),
        details: `Updated resident record '${updated?.companyName || id}'`,
      }).catch(() => {});

      sendSuccess(res, updated, "Resident updated successfully");
    } catch (error) {
      next(error);
    }
  }

  static async updateResidentStatus(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { status, reason } = req.body;

      if (!status) {
        return sendError(res, "Status is required", 400);
      }

      const resident = await ResidentRepository.findById(id);
      if (!resident) {
        return sendError(res, "Resident not found", 404);
      }

      const updates: any = { status };
      if (status === "REMOVED") {
        updates.removedDate = new Date().toISOString().split("T")[0];
        if (reason) updates.removedReason = reason;
      } else if (status === "ACTIVE") {
        if (!resident.approvedAt) {
          updates.approvedAt = new Date().toISOString().split("T")[0];
        }
      }

      const updated = await ResidentRepository.updateResident(id, updates);

      // Audit Log
      const userContext = req.user
        ? { id: req.user.userId, name: req.user.name || req.user.email, role: req.user.role }
        : { id: "u-1", name: "System Admin", role: "SUPER_ADMIN" };

      EntityRepository.appendActivityLog({
        id: `act-${Date.now()}`,
        userId: userContext.id,
        userName: userContext.name,
        userRole: userContext.role,
        action: "UPDATE_RESIDENT_STATUS",
        entity: "residents",
        entityId: id,
        timestamp: new Date().toISOString(),
        details: `Changed status of resident '${resident.companyName}' from ${resident.status} to ${status}`,
      }).catch(() => {});

      sendSuccess(res, updated, `Resident status updated to ${status}`);
    } catch (error) {
      next(error);
    }
  }

  static async deleteResident(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const resident = await ResidentRepository.findById(id);

      if (!resident) {
        return sendError(res, "Resident not found", 404);
      }

      await ResidentRepository.deleteResident(id);

      // Audit Log
      const userContext = req.user
        ? { id: req.user.userId, name: req.user.name || req.user.email, role: req.user.role }
        : { id: "u-1", name: "System Admin", role: "SUPER_ADMIN" };

      EntityRepository.appendActivityLog({
        id: `act-${Date.now()}`,
        userId: userContext.id,
        userName: userContext.name,
        userRole: userContext.role,
        action: "DELETE_RESIDENT",
        entity: "residents",
        entityId: id,
        timestamp: new Date().toISOString(),
        details: `Deleted resident record '${resident.companyName}' (INN: ${resident.registrationNumber})`,
      }).catch(() => {});

      sendSuccess(res, null, "Resident deleted successfully");
    } catch (error) {
      next(error);
    }
  }
}
