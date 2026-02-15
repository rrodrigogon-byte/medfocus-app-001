import { eq, sql, desc } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, userProgress, xpLog, studySessions } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// ─── XP & Progress Queries ─────────────────────────────

export async function getOrCreateProgress(userId: number) {
  const db = await getDb();
  if (!db) return null;
  
  const existing = await db.select().from(userProgress).where(eq(userProgress.userId, userId)).limit(1);
  if (existing.length > 0) return existing[0];
  
  // Create new progress record
  await db.insert(userProgress).values({ userId });
  const created = await db.select().from(userProgress).where(eq(userProgress.userId, userId)).limit(1);
  return created[0] || null;
}

export async function addXp(userId: number, action: string, xpAmount: number, description?: string) {
  const db = await getDb();
  if (!db) return null;
  
  // Log the XP event
  await db.insert(xpLog).values({ userId, action, xpEarned: xpAmount, description });
  
  // Update progress
  const progress = await getOrCreateProgress(userId);
  if (!progress) return null;
  
  const today = new Date().toISOString().split('T')[0];
  const isNewDay = progress.lastActiveDate !== today;
  let newStreak = progress.currentStreak;
  
  if (isNewDay) {
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
    newStreak = progress.lastActiveDate === yesterday ? progress.currentStreak + 1 : 1;
  }
  
  const newTotalXp = progress.totalXp + xpAmount;
  const newLevel = Math.floor(newTotalXp / 500) + 1;
  
  // Update counters based on action type
  const updates: Record<string, unknown> = {
    totalXp: newTotalXp,
    level: newLevel,
    currentStreak: newStreak,
    longestStreak: Math.max(progress.longestStreak, newStreak),
    lastActiveDate: today,
  };
  
  if (action === 'pomodoro') updates.pomodorosCompleted = progress.pomodorosCompleted + 1;
  if (action === 'quiz') updates.quizzesCompleted = progress.quizzesCompleted + 1;
  if (action === 'flashcard') updates.flashcardsReviewed = progress.flashcardsReviewed + 1;
  if (action === 'checklist') updates.checklistItemsDone = progress.checklistItemsDone + 1;
  
  await db.update(userProgress).set(updates).where(eq(userProgress.userId, userId));
  
  return { ...progress, ...updates };
}

export async function getXpHistory(userId: number, limit = 20) {
  const db = await getDb();
  if (!db) return [];
  
  return db.select().from(xpLog)
    .where(eq(xpLog.userId, userId))
    .orderBy(desc(xpLog.createdAt))
    .limit(limit);
}

export async function logStudySession(userId: number, type: 'pomodoro' | 'free_study', durationMinutes: number, subject?: string) {
  const db = await getDb();
  if (!db) return;
  
  await db.insert(studySessions).values({ userId, type, durationMinutes, subject });
  
  // Also update study minutes in progress
  const progress = await getOrCreateProgress(userId);
  if (progress) {
    await db.update(userProgress).set({
      studyMinutes: progress.studyMinutes + durationMinutes,
    }).where(eq(userProgress.userId, userId));
  }
}

export async function updateUserProfile(userId: number, universityId?: string, currentYear?: number) {
  const db = await getDb();
  if (!db) return;
  
  const updates: Record<string, unknown> = {};
  if (universityId !== undefined) updates.universityId = universityId;
  if (currentYear !== undefined) updates.currentYear = currentYear;
  
  if (Object.keys(updates).length > 0) {
    await db.update(users).set(updates).where(eq(users.id, userId));
  }
}
