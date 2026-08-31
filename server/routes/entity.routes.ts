import { Router } from "express";
import { EntityController } from "../controllers/entity.controller";
import { authenticateJWT, checkEntityPermission } from "../middleware/auth.middleware";

const router = Router();

// Full database state (Used by initial app boot)
router.get("/db", authenticateJWT, EntityController.getFullState);

// Collection listing
router.get("/:entity", authenticateJWT, checkEntityPermission("read"), EntityController.getCollection);

// Single record lookup
router.get("/:entity/:id", authenticateJWT, checkEntityPermission("read"), EntityController.getItemById);

// Protected mutation routes with fine-grained RBAC checks
router.post("/:entity", authenticateJWT, checkEntityPermission("create"), EntityController.createItem);
router.put("/:entity/:id", authenticateJWT, checkEntityPermission("update"), EntityController.updateItem);
router.delete("/:entity/:id", authenticateJWT, checkEntityPermission("delete"), EntityController.deleteItem);

export default router;

