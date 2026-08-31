import { UserRepository, UserRecord } from "../repositories/user.repository";
import { RefreshTokenRepository } from "../repositories/refresh_token.repository";
import { comparePassword, hashPassword } from "../utils/password";
import { generateAccessToken, generateRefreshToken, verifyRefreshToken, TokenPayload } from "../utils/jwt";
import { EntityRepository } from "../repositories/entity.repository";

export class AuthService {
  static async login(email: string, pass: string) {
    const cleanEmail = (email || "").trim().toLowerCase();
    const cleanPass = (pass || "").trim();

    if (!cleanEmail) {
      throw { statusCode: 400, message: "Email is required" };
    }

    let user = await UserRepository.findByEmail(cleanEmail);
    if (!user) {
      // If user does not exist in seed/database, return 401 for bad credentials
      throw { statusCode: 401, message: "Invalid email or password" };
    }

    if (user.active === false) {
      throw { statusCode: 403, message: "Account is disabled. Contact system administrator." };
    }

    if (!user.password) {
      throw { statusCode: 401, message: "Invalid email or password" };
    }

    const isValidPassword = await comparePassword(cleanPass, user.password);
    if (!isValidPassword) {
      throw { statusCode: 401, message: "Invalid email or password" };
    }

    const payload: TokenPayload = {
      userId: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
    };

    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    // Persist refresh token securely (expires in 7 days)
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    await RefreshTokenRepository.createToken(user.id, refreshToken, expiresAt);

    // Audit log login event
    EntityRepository.appendActivityLog({
      id: `act-${Date.now()}`,
      userId: user.id,
      userName: user.name,
      userRole: user.role,
      action: "USER_LOGIN",
      entity: "auth",
      entityId: user.id,
      timestamp: new Date().toISOString(),
      details: `User ${user.email} authenticated successfully via JWT`,
    }).catch(() => {});

    const { password, ...userWithoutPassword } = user;

    return {
      user: userWithoutPassword,
      accessToken,
      refreshToken,
    };
  }

  static async register(data: {
    email: string;
    password: string;
    name: string;
    role: string;
    department?: string;
    avatarUrl?: string;
  }) {
    const existingUser = await UserRepository.findByEmail(data.email);
    if (existingUser) {
      throw { statusCode: 400, message: "User with this email already exists" };
    }

    const hashedPassword = await hashPassword(data.password);
    const newUser: UserRecord = {
      id: `usr-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      email: data.email,
      password: hashedPassword,
      name: data.name,
      role: data.role || "MANAGER",
      department: data.department || "General",
      avatarUrl: data.avatarUrl || `https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150`,
      active: true,
    };

    const created = await UserRepository.createUser(newUser);

    const payload: TokenPayload = {
      userId: created.id,
      email: created.email,
      role: created.role,
      name: created.name,
    };

    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    await RefreshTokenRepository.createToken(created.id, refreshToken, expiresAt);

    const userWithoutPassword = created;

    return {
      user: userWithoutPassword,
      accessToken,
      refreshToken,
    };
  }

  static async refreshToken(token: string) {
    if (!token) {
      throw { statusCode: 400, message: "Refresh token is required" };
    }

    const payload = verifyRefreshToken(token);
    if (!payload) {
      throw { statusCode: 401, message: "Invalid or expired refresh token" };
    }

    // Check database / persistent store for refresh token revocation
    const storedToken = await RefreshTokenRepository.findToken(token);
    if (storedToken && storedToken.revoked) {
      throw { statusCode: 401, message: "Refresh token has been revoked" };
    }

    const user = await UserRepository.findById(payload.userId);
    if (!user || user.active === false) {
      throw { statusCode: 401, message: "User account no longer active" };
    }

    // Revoke old refresh token (token rotation)
    await RefreshTokenRepository.revokeToken(token);

    const newPayload: TokenPayload = {
      userId: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
    };

    const newAccessToken = generateAccessToken(newPayload);
    const newRefreshToken = generateRefreshToken(newPayload);

    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    await RefreshTokenRepository.createToken(user.id, newRefreshToken, expiresAt);

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    };
  }

  static async logout(refreshToken?: string) {
    if (refreshToken) {
      await RefreshTokenRepository.revokeToken(refreshToken);
    }
    return { success: true, message: "Logged out successfully" };
  }

  static async getProfile(userId: string) {
    const user = await UserRepository.findById(userId);
    if (!user) {
      throw { statusCode: 404, message: "User not found" };
    }
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }
}
