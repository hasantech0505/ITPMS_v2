import { Router } from "express";
import { UserController } from "../controllers/user.controller";
import { authenticateJWT, requirePermission } from "../middleware/auth.middleware";

const router = Router();

router.use(authenticateJWT);

router.get("/", requirePermission("users.read"), UserController.getUsers);
router.get("/:id", requirePermission("users.read"), UserController.getUserById);
router.post("/", requirePermission("users.create"), UserController.createUser);
router.patch("/:id/status", requirePermission("users.update"), UserController.toggleUserStatus);
router.put("/:id", requirePermission("users.update"), UserController.updateUser);
router.patch("/:id", requirePermission("users.update"), UserController.updateUser);
router.delete("/:id", requirePermission("users.delete"), UserController.deleteUser);

export default router;
