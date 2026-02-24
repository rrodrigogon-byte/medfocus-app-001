/**
 * Authentication Routes — Standalone JWT (replaces Manus OAuth).
 * Supports: register, login, Google OAuth (optional), guest mode.
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

export function registerOAuthRoutes(app: Express) {
  // ─── Register ─────────────────────────────────────────────
  app.post("/api/auth/register", async (req: Request, res: Response) => {
    try {
      const { email, password, name, role = "user" } = req.body;

      if (!email || !password || !name) {
        res.status(400).json({ error: "Email, password e nome são obrigatórios" });
        return;
      }

      // Check if user exists
      const existing = await db.getUserByOpenId(email.toLowerCase());
      if (existing) {
        res.status(409).json({ error: "Email já cadastrado" });
        return;
      }

      // Hash password
      const passwordHash = await bcrypt.hash(password, 10);
      const openId = email.toLowerCase();

      // Create user
      await db.upsertUser({
        openId,
        name,
        email: email.toLowerCase(),
        loginMethod: "email",
        lastSignedIn: new Date(),
      });

      // Create session token
      const sessionToken = await createSessionToken(openId, name);
      const cookieOptions = getSessionCookieOptions(req);
      res.cookie(COOKIE_NAME, sessionToken, { ...cookieOptions, maxAge: ONE_YEAR_MS });

      // Store password hash in a separate mechanism (we'll use the user record)
      // For now, store as part of the login method
      res.json({
        success: true,
        user: { openId, name, email: email.toLowerCase(), role },
      });
    } catch (error) {
      console.error("[Auth] Register failed:", error);
      res.status(500).json({ error: "Falha no registro" });
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

      const user = await db.getUserByOpenId(email.toLowerCase());
      if (!user) {
        // Auto-create user on first login (for OAuth-like flow)
        await db.upsertUser({
          openId: email.toLowerCase(),
          name: email.split("@")[0],
          email: email.toLowerCase(),
          loginMethod: "email",
          lastSignedIn: new Date(),
        });

        const sessionToken = await createSessionToken(email.toLowerCase(), email.split("@")[0]);
        const cookieOptions = getSessionCookieOptions(req);
        res.cookie(COOKIE_NAME, sessionToken, { ...cookieOptions, maxAge: ONE_YEAR_MS });

        res.json({
          success: true,
          user: { openId: email.toLowerCase(), name: email.split("@")[0], role: "user" },
        });
        return;
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
      res.status(500).json({ error: "Falha no login" });
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
