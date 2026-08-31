import { Router } from "express";
import { AuthController } from "../controllers/auth.controller";
import { validateRequest } from "../middleware/validate.middleware";
import { LoginSchema, RegisterSchema, RefreshTokenSchema } from "../schemas/auth.schema";
import { authenticateToken } from "../middleware/auth.middleware";

const router = Router();

router.post("/login", validateRequest(LoginSchema), AuthController.login);
router.post("/register", validateRequest(RegisterSchema), AuthController.register);
router.post("/refresh", validateRequest(RefreshTokenSchema), AuthController.refreshToken);
router.post("/logout", AuthController.logout);
router.get("/me", authenticateToken, AuthController.getMe);

export default router;
