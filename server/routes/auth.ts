/**
 * Authentication Routes
 * Handles user registration, login, and password management
 */
import { Router } from "express";
import bcrypt from "bcryptjs";
import { nanoid } from "nanoid";
import { getDatabase } from "../services/database.js";
import { generateToken, AuthRequest, authenticateToken } from "../middleware/auth.js";
import { createError } from "../middleware/errorHandler.js";

export const authRouter = Router();

/**
 * POST /api/auth/register
 * Register a new user
 */
authRouter.post("/register", async (req, res, next) => {
  try {
    const { email, password, name, role = "student", universityId, department, specialties } = req.body;

    if (!email || !password || !name) {
      throw createError("Email, password, and name are required", 400);
    }

    const db = getDatabase();

    // Check if user already exists
    const existingUser = db.prepare("SELECT id FROM users WHERE email = ?").get(email);
    
    if (existingUser) {
      throw createError("Email already registered", 409);
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Create user
    const userId = nanoid();
    
    db.prepare(`
      INSERT INTO users (id, email, password_hash, name, role, university_id, department, specialties)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      userId,
      email.toLowerCase(),
      passwordHash,
      name,
      role,
      universityId || null,
      department || null,
      specialties ? JSON.stringify(specialties) : null
    );

    // Generate token
    const token = generateToken({
      id: userId,
      email: email.toLowerCase(),
      role,
      universityId,
    });

    res.status(201).json({
      success: true,
      token,
      user: {
        id: userId,
        email: email.toLowerCase(),
        name,
        role,
        universityId,
        department,
        specialties,
      },
    });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/auth/login
 * Login user
 */
authRouter.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      throw createError("Email and password are required", 400);
    }

    const db = getDatabase();

    // Find user
    const user = db.prepare(`
      SELECT id, email, password_hash, name, role, university_id, department, specialties, verified_credentials
      FROM users
      WHERE email = ?
    `).get(email.toLowerCase()) as any;

    if (!user) {
      throw createError("Invalid email or password", 401);
    }

    // Verify password
    const validPassword = await bcrypt.compare(password, user.password_hash);

    if (!validPassword) {
      throw createError("Invalid email or password", 401);
    }

    // Update last login
    db.prepare("UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = ?").run(user.id);

    // Generate token
    const token = generateToken({
      id: user.id,
      email: user.email,
      role: user.role,
      universityId: user.university_id,
    });

    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        universityId: user.university_id,
        department: user.department,
        specialties: user.specialties ? JSON.parse(user.specialties) : [],
        verifiedCredentials: Boolean(user.verified_credentials),
      },
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/auth/me
 * Get current user profile
 */
authRouter.get("/me", authenticateToken, async (req: AuthRequest, res, next) => {
  try {
    const db = getDatabase();

    const user = db.prepare(`
      SELECT id, email, name, role, university_id, department, specialties, 
             verified_credentials, lattes_url, orcid, google_scholar, created_at
      FROM users
      WHERE id = ?
    `).get(req.user!.id) as any;

    if (!user) {
      throw createError("User not found", 404);
    }

    res.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        universityId: user.university_id,
        department: user.department,
        specialties: user.specialties ? JSON.parse(user.specialties) : [],
        verifiedCredentials: Boolean(user.verified_credentials),
        lattesUrl: user.lattes_url,
        orcid: user.orcid,
        googleScholar: user.google_scholar,
        createdAt: user.created_at,
      },
    });
  } catch (error) {
    next(error);
  }
});

/**
 * PATCH /api/auth/profile
 * Update user profile
 */
authRouter.patch("/profile", authenticateToken, async (req: AuthRequest, res, next) => {
  try {
    const { name, department, specialties, lattesUrl, orcid, googleScholar } = req.body;
    const db = getDatabase();

    const updates: string[] = [];
    const values: any[] = [];

    if (name !== undefined) {
      updates.push("name = ?");
      values.push(name);
    }
    if (department !== undefined) {
      updates.push("department = ?");
      values.push(department);
    }
    if (specialties !== undefined) {
      updates.push("specialties = ?");
      values.push(JSON.stringify(specialties));
    }
    if (lattesUrl !== undefined) {
      updates.push("lattes_url = ?");
      values.push(lattesUrl);
    }
    if (orcid !== undefined) {
      updates.push("orcid = ?");
      values.push(orcid);
    }
    if (googleScholar !== undefined) {
      updates.push("google_scholar = ?");
      values.push(googleScholar);
    }

    if (updates.length === 0) {
      throw createError("No fields to update", 400);
    }

    updates.push("updated_at = CURRENT_TIMESTAMP");
    values.push(req.user!.id);

    db.prepare(`
      UPDATE users
      SET ${updates.join(", ")}
      WHERE id = ?
    `).run(...values);

    res.json({
      success: true,
      message: "Profile updated successfully",
    });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/auth/change-password
 * Change user password
 */
authRouter.post("/change-password", authenticateToken, async (req: AuthRequest, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      throw createError("Current password and new password are required", 400);
    }

    if (newPassword.length < 6) {
      throw createError("New password must be at least 6 characters", 400);
    }

    const db = getDatabase();

    // Get current password hash
    const user = db.prepare("SELECT password_hash FROM users WHERE id = ?").get(req.user!.id) as any;

    // Verify current password
    const validPassword = await bcrypt.compare(currentPassword, user.password_hash);

    if (!validPassword) {
      throw createError("Current password is incorrect", 401);
    }

    // Hash new password
    const newPasswordHash = await bcrypt.hash(newPassword, 10);

    // Update password
    db.prepare(`
      UPDATE users 
      SET password_hash = ?, updated_at = CURRENT_TIMESTAMP 
      WHERE id = ?
    `).run(newPasswordHash, req.user!.id);

    res.json({
      success: true,
      message: "Password changed successfully",
    });
  } catch (error) {
    next(error);
  }
});
