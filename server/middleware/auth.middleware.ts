import { Request, Response, NextFunction } from "express";
import { verifyAccessToken, TokenPayload } from "../utils/jwt";
import { RbacRepository } from "../repositories/rbac.repository";

export interface AuthenticatedRequest extends Request {
  user?: TokenPayload;
}

export function authenticateJWT(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({
      success: false,
      error: "Authentication required",
      message: "Authorization header missing or invalid",
    });
  }

  const token = authHeader.startsWith("Bearer ") ? authHeader.substring(7).trim() : authHeader.trim();
  if (!token) {
    return res.status(401).json({
      success: false,
      error: "Authentication required",
      message: "Bearer token missing",
    });
  }

  const payload = verifyAccessToken(token);
  if (!payload) {
    return res.status(401).json({
      success: false,
      error: "Invalid or expired token",
      message: "Token verification failed or token has expired",
    });
  }

  // Authoritative identity and role strictly from verified JWT payload
  req.user = {
    userId: payload.userId,
    email: payload.email,
    role: payload.role,
    name: payload.name,
  };

  return next();
}

export const authenticateToken = authenticateJWT;
export const requireAuth = authenticateJWT;

export function requireRole(allowedRoles: string[]) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ success: false, error: "Authentication required", message: "Authentication required" });
    }

    const role = req.user.role?.toUpperCase();
    if (role === "SUPER_ADMIN" || allowedRoles.map((r) => r.toUpperCase()).includes(role)) {
      return next();
    }

    return res.status(403).json({
      success: false,
      error: `Forbidden: Insufficient role permissions for role '${req.user.role}'`,
      message: `Forbidden: Insufficient role permissions for role '${req.user.role}'`,
    });
  };
}

export function requirePermission(permission: string) {
  return async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ success: false, error: "Authentication required", message: "Authentication required" });
    }

    const userRole = req.user.role || "MANAGER";
    const hasPerm = await RbacRepository.userHasPermission(userRole, permission);

    if (!hasPerm) {
      return res.status(403).json({
        success: false,
        error: `Forbidden: Role '${userRole}' lacks permission '${permission}'`,
        message: `Forbidden: Role '${userRole}' lacks permission '${permission}'`,
      });
    }

    next();
  };
}

export function checkEntityPermission(action: "read" | "create" | "update" | "delete") {
  return async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ success: false, error: "Authentication required", message: "Authentication required" });
    }

    const userRole = req.user.role || "MANAGER";

    // SUPER_ADMIN bypasses all entity permission checks
    if (userRole.toUpperCase() === "SUPER_ADMIN") {
      return next();
    }

    const entity = (req.params.entity || "").toLowerCase();
    let requiredPerm = "";

    switch (entity) {
      case "users":
        requiredPerm = `users.${action}`;
        break;
      case "residents":
        requiredPerm = `residents.${action}`;
        break;
      case "startups":
        requiredPerm = `startups.${action}`;
        break;
      case "events":
      case "itevent":
        requiredPerm = action === "read" ? "events.read" : "events.manage";
        break;
      case "contacts":
      case "companies":
      case "meetings":
      case "tasks":
      case "campaigns":
        requiredPerm = action === "read" ? "crm.read" : "crm.manage";
        break;
      case "activitylogs":
        requiredPerm = "audit.read";
        break;
      case "kpitargets":
        requiredPerm = action === "read" ? "analytics.read" : "analytics.manage";
        break;
      case "planningitems":
        requiredPerm = action === "read" ? "planning.read" : "planning.manage";
        break;
      case "comments":
        // All authenticated users can read, post comments, boost, and reply
        return next();
      default:
        requiredPerm = action === "read" ? "infrastructure.read" : "infrastructure.manage";
        break;
    }

    const hasPerm = await RbacRepository.userHasPermission(userRole, requiredPerm);
    if (!hasPerm) {
      return res.status(403).json({
        success: false,
        error: `Forbidden: Role '${userRole}' lacks required permission '${requiredPerm}' for entity '${entity}'`,
        message: `Forbidden: Role '${userRole}' lacks required permission '${requiredPerm}' for entity '${entity}'`,
      });
    }

    next();
  };
}


