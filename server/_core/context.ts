/**
 * tRPC Context — Standalone JWT authentication (no Manus SDK).
 * Reads session cookie or Authorization header and resolves user from DB.
 */
import type { CreateExpressContextOptions } from "@trpc/server/adapters/express";
import type { User } from "../../drizzle/schema";
import { COOKIE_NAME } from "@shared/const";
import { parse as parseCookieHeader } from "cookie";
import { jwtVerify } from "jose";
import { ENV } from "./env";
import * as db from "../db";

export type TrpcContext = {
  req: CreateExpressContextOptions["req"];
  res: CreateExpressContextOptions["res"];
  user: User | null;
};

async function resolveUser(req: CreateExpressContextOptions["req"]): Promise<User | null> {
  try {
    // Try cookie first
    const cookies = req.headers.cookie ? parseCookieHeader(req.headers.cookie) : {};
    let token = cookies[COOKIE_NAME];

    // Fallback to Authorization header
    if (!token) {
      const authHeader = req.headers.authorization;
      if (authHeader?.startsWith("Bearer ")) {
        token = authHeader.slice(7);
      }
    }

    if (!token) return null;

    const secretKey = new TextEncoder().encode(ENV.jwtSecret);
    const { payload } = await jwtVerify(token, secretKey, { algorithms: ["HS256"] });

    const openId = payload.openId as string | undefined;
    const userId = payload.id as string | undefined;

    if (openId) {
      const user = await db.getUserByOpenId(openId);
      return user ?? null;
    }

    if (userId) {
      // Support numeric user IDs from JWT auth
      const user = await db.getUserByOpenId(userId);
      return user ?? null;
    }

    return null;
  } catch (error) {
    // Authentication is optional for public procedures.
    return null;
  }
}

export async function createContext(
  opts: CreateExpressContextOptions
): Promise<TrpcContext> {
  const user = await resolveUser(opts.req);

  return {
    req: opts.req,
    res: opts.res,
    user,
  };
}
