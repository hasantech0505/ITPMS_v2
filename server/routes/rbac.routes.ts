import { Router } from "express";
import { RbacController } from "../controllers/rbac.controller";
import { authenticateToken, requirePermission, requireRole } from "../middleware/auth.middleware";

const router = Router();

router.get("/roles", authenticateToken, RbacController.getRoles);
router.get("/permissions", authenticateToken, RbacController.getPermissions);
router.get("/me/permissions", authenticateToken, RbacController.getUserPermissions);
router.post("/assign-role", authenticateToken, requireRole(["SUPER_ADMIN"]), RbacController.assignRole);

export default router;
