/**
 * Authentication Routes — Standalone JWT (replaces Manus OAuth).
 * Supports: register with password, login with password verification, guest mode.
 */
import { COOKIE_NAME, ONE_YEAR_MS } from "@shared/const";
import type { Express, Request, Response } from "express";
import * as db from "../db";
import { getSessionCookieOptions } from "./cookies";
import { ENV } from "./env";
import { SignJWT } from "jose";
import bcrypt from "bcryptjs";

async function createSessionToken(openId: string, name: string): Promise<string> {
  const secretKey = new TextEncoder().encode(ENV.jwtSecret);
  const expirationSeconds = Math.floor((Date.now() + ONE_YEAR_MS) / 1000);

  return new SignJWT({
    openId,
    appId: ENV.appId,
    name,
  })
    .setProtectedHeader({ alg: "HS256", typ: "JWT" })
    .setExpirationTime(expirationSeconds)
    .sign(secretKey);
}

// Helper to update passwordHash directly via raw SQL
async function updatePasswordHash(openId: string, passwordHash: string) {
  const dbInstance = await db.getDb();
  if (!dbInstance) return;
  try {
    await dbInstance.execute(
      `UPDATE users SET passwordHash = ? WHERE openId = ?`,
      [passwordHash, openId]
    );
  } catch (e) {
    console.error("[Auth] Failed to update passwordHash:", e);
  }
}

// Helper to get passwordHash
async function getPasswordHash(openId: string): Promise<string | null> {
  const dbInstance = await db.getDb();
  if (!dbInstance) return null;
  try {
    const result = await dbInstance.execute(
      `SELECT passwordHash FROM users WHERE openId = ?`,
      [openId]
    );
    const rows = result as any;
    if (rows && rows[0] && rows[0].length > 0) {
      return rows[0][0].passwordHash || null;
    }
    return null;
  } catch (e) {
    console.error("[Auth] Failed to get passwordHash:", e);
    return null;
  }
}

export function registerOAuthRoutes(app: Express) {
  // ─── Register ─────────────────────────────────────────────
  app.post("/api/auth/register", async (req: Request, res: Response) => {
    try {
      const { email, password, name } = req.body;

      if (!email || !password || !name) {
        res.status(400).json({ error: "Email, senha e nome são obrigatórios" });
        return;
      }

      if (password.length < 6) {
        res.status(400).json({ error: "A senha deve ter no mínimo 6 caracteres" });
        return;
      }

      const openId = email.toLowerCase().trim();

      // Check if user exists
      const existing = await db.getUserByOpenId(openId);
      if (existing) {
        res.status(409).json({ error: "Este e-mail já está cadastrado. Faça login." });
        return;
      }

      // Hash password
      const passwordHash = await bcrypt.hash(password, 10);

      // Determine role - admin if owner email
      const isOwner = openId === ENV.ownerEmail?.toLowerCase() || openId === ENV.ownerOpenId?.toLowerCase();
      const role = isOwner ? "admin" : "user";

      // Create user
      await db.upsertUser({
        openId,
        name: name.trim(),
        email: openId,
        loginMethod: "email",
        role: role as any,
        lastSignedIn: new Date(),
      });

      // Save password hash
      await updatePasswordHash(openId, passwordHash);

      // Create session token
      const sessionToken = await createSessionToken(openId, name.trim());
      const cookieOptions = getSessionCookieOptions(req);
      res.cookie(COOKIE_NAME, sessionToken, { ...cookieOptions, maxAge: ONE_YEAR_MS });

      res.json({
        success: true,
        user: { openId, name: name.trim(), email: openId, role },
      });
    } catch (error) {
      console.error("[Auth] Register failed:", error);
      res.status(500).json({ error: "Falha no registro. Tente novamente." });
    }
  });

  // ─── Login ────────────────────────────────────────────────
  app.post("/api/auth/login", async (req: Request, res: Response) => {
    try {
      const { email, password, guestName } = req.body;

      // Guest login
      if (guestName) {
        const guestOpenId = `guest_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
        await db.upsertUser({
          openId: guestOpenId,
          name: guestName,
          email: null,
          loginMethod: "guest",
          lastSignedIn: new Date(),
        });

        const sessionToken = await createSessionToken(guestOpenId, guestName);
        const cookieOptions = getSessionCookieOptions(req);
        res.cookie(COOKIE_NAME, sessionToken, { ...cookieOptions, maxAge: ONE_YEAR_MS });

        res.json({
          success: true,
          user: { openId: guestOpenId, name: guestName, role: "user" },
        });
        return;
      }

      if (!email) {
        res.status(400).json({ error: "Email é obrigatório" });
        return;
      }

      const openId = email.toLowerCase().trim();
      const user = await db.getUserByOpenId(openId);

      if (!user) {
        res.status(401).json({ error: "E-mail não cadastrado. Crie uma conta primeiro." });
        return;
      }

      // Verify password if user has one
      if (password) {
        const storedHash = await getPasswordHash(openId);
        if (storedHash) {
          const isValid = await bcrypt.compare(password, storedHash);
          if (!isValid) {
            res.status(401).json({ error: "Senha incorreta." });
            return;
          }
        }
        // If no stored hash (legacy user), allow login and save new hash
        if (!storedHash && password) {
          const newHash = await bcrypt.hash(password, 10);
          await updatePasswordHash(openId, newHash);
        }
      }

      // Update last sign in
      await db.upsertUser({
        openId: user.openId,
        lastSignedIn: new Date(),
      });

      const sessionToken = await createSessionToken(user.openId, user.name || "Estudante");
      const cookieOptions = getSessionCookieOptions(req);
      res.cookie(COOKIE_NAME, sessionToken, { ...cookieOptions, maxAge: ONE_YEAR_MS });

      res.json({
        success: true,
        user: {
          openId: user.openId,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      });
    } catch (error) {
      console.error("[Auth] Login failed:", error);
      res.status(500).json({ error: "Falha no login. Tente novamente." });
    }
  });

  // ─── Logout ───────────────────────────────────────────────
  app.post("/api/auth/logout", (req: Request, res: Response) => {
    const cookieOptions = getSessionCookieOptions(req);
    res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
    res.json({ success: true });
  });

  // ─── Legacy OAuth callback (redirect to login) ───────────
  app.get("/api/oauth/callback", (_req: Request, res: Response) => {
    res.redirect(302, "/");
  });
}
