import { Request, Response, NextFunction } from "express";
import { EntityService } from "../services/entity.service";
import { AuthenticatedRequest } from "../middleware/auth.middleware";

export class EntityController {
  static async getFullState(req: Request, res: Response, next: NextFunction) {
    try {
      const db = await EntityService.getFullState();
      res.json(db);
    } catch (error) {
      next(error);
    }
  }

  static async getCollection(req: Request, res: Response, next: NextFunction) {
    try {
      const { entity } = req.params;
      const data = await EntityService.getCollection(entity);
      res.json(data);
    } catch (error) {
      next(error);
    }
  }

  static async getItemById(req: Request, res: Response, next: NextFunction) {
    try {
      const { entity, id } = req.params;
      const item = await EntityService.getItemById(entity, id);
      if (!item) {
        return res.status(404).json({ success: false, message: "Item not found" });
      }
      res.json(item);
    } catch (error) {
      next(error);
    }
  }

  static async createItem(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { entity } = req.params;
      const userContext = req.user
        ? { id: req.user.userId, name: req.user.name || req.user.email, role: req.user.role }
        : undefined;

      const created = await EntityService.createItem(entity, req.body, userContext);
      res.status(201).json(created);
    } catch (error) {
      next(error);
    }
  }

  static async updateItem(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { entity, id } = req.params;
      const userContext = req.user
        ? { id: req.user.userId, name: req.user.name || req.user.email, role: req.user.role }
        : undefined;

      const updated = await EntityService.updateItem(entity, id, req.body, userContext);
      res.json(updated);
    } catch (error) {
      next(error);
    }
  }

  static async deleteItem(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { entity, id } = req.params;
      const userContext = req.user
        ? { id: req.user.userId, name: req.user.name || req.user.email, role: req.user.role }
        : undefined;

      const result = await EntityService.deleteItem(entity, id, userContext);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }
}
