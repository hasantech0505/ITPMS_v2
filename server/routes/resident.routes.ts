import { Router } from "express";
import { ResidentController } from "../controllers/resident.controller";
import { authenticateJWT, requirePermission } from "../middleware/auth.middleware";

const router = Router();

// Statistics route (Must be declared before :id parameter route)
router.get("/statistics", authenticateJWT, requirePermission("residents.read"), ResidentController.getStatistics);

// List residents with server-side filtering, searching, pagination & sorting
router.get("/", authenticateJWT, requirePermission("residents.read"), ResidentController.getResidents);

// Get single resident by ID
router.get("/:id", authenticateJWT, requirePermission("residents.read"), ResidentController.getResidentById);

// Create new resident
router.post("/", authenticateJWT, requirePermission("residents.create"), ResidentController.createResident);

// Update status specifically
router.patch("/:id/status", authenticateJWT, requirePermission("residents.update"), ResidentController.updateResidentStatus);

// Full or partial resident updates
router.put("/:id", authenticateJWT, requirePermission("residents.update"), ResidentController.updateResident);
router.patch("/:id", authenticateJWT, requirePermission("residents.update"), ResidentController.updateResident);

// Delete resident record
router.delete("/:id", authenticateJWT, requirePermission("residents.delete"), ResidentController.deleteResident);

export default router;
