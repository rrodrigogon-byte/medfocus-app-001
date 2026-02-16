import { eq, and, sql, desc, count, avg } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, userProgress, xpLog, studySessions, classrooms, enrollments, activities, submissions } from "../drizzle/schema";
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

// ─── Classroom Queries ─────────────────────────────

function generateCode(): string {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

export async function createClassroom(data: {
  name: string; professorId: number; subject: string;
  year: number; semester: number; university: string;
  description?: string; maxStudents?: number;
}) {
  const db = await getDb();
  if (!db) return null;
  const code = generateCode();
  await db.insert(classrooms).values({ ...data, code });
  const result = await db.select().from(classrooms).where(eq(classrooms.code, code)).limit(1);
  return result[0] || null;
}

export async function getClassroomsByProfessor(professorId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(classrooms).where(eq(classrooms.professorId, professorId)).orderBy(desc(classrooms.createdAt));
}

export async function getClassroomsByStudent(studentId: number) {
  const db = await getDb();
  if (!db) return [];
  const enrolled = await db.select({ classroomId: enrollments.classroomId })
    .from(enrollments)
    .where(and(eq(enrollments.studentId, studentId), eq(enrollments.status, 'active')));
  if (enrolled.length === 0) return [];
  const ids = enrolled.map(e => e.classroomId);
  const results = await db.select().from(classrooms).where(sql`${classrooms.id} IN (${sql.join(ids.map(id => sql`${id}`), sql`, `)})`);
  return results;
}

export async function getClassroomById(id: number) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.select().from(classrooms).where(eq(classrooms.id, id)).limit(1);
  return result[0] || null;
}

export async function joinClassroom(code: string, studentId: number) {
  const db = await getDb();
  if (!db) return { error: 'Database not available' };
  const room = await db.select().from(classrooms).where(eq(classrooms.code, code)).limit(1);
  if (room.length === 0) return { error: 'Sala não encontrada' };
  const classroom = room[0];
  if (!classroom.isActive) return { error: 'Sala não está ativa' };
  // Check if already enrolled
  const existing = await db.select().from(enrollments)
    .where(and(eq(enrollments.classroomId, classroom.id), eq(enrollments.studentId, studentId))).limit(1);
  if (existing.length > 0 && existing[0].status === 'active') return { error: 'Você já está matriculado nesta sala' };
  if (existing.length > 0) {
    await db.update(enrollments).set({ status: 'active' }).where(eq(enrollments.id, existing[0].id));
  } else {
    // Check max students
    const enrolledCount = await db.select({ count: count() }).from(enrollments)
      .where(and(eq(enrollments.classroomId, classroom.id), eq(enrollments.status, 'active')));
    if (enrolledCount[0].count >= classroom.maxStudents) return { error: 'Sala lotada' };
    await db.insert(enrollments).values({ classroomId: classroom.id, studentId });
  }
  return { classroom };
}

export async function getEnrollments(classroomId: number) {
  const db = await getDb();
  if (!db) return [];
  const enrolled = await db.select()
    .from(enrollments)
    .where(and(eq(enrollments.classroomId, classroomId), eq(enrollments.status, 'active')));
  if (enrolled.length === 0) return [];
  const studentIds = enrolled.map(e => e.studentId);
  const students = await db.select({ id: users.id, name: users.name, email: users.email })
    .from(users)
    .where(sql`${users.id} IN (${sql.join(studentIds.map(id => sql`${id}`), sql`, `)})`);
  return enrolled.map(e => ({
    ...e,
    student: students.find(s => s.id === e.studentId) || { id: e.studentId, name: 'Desconhecido', email: null },
  }));
}

export async function removeEnrollment(enrollmentId: number) {
  const db = await getDb();
  if (!db) return;
  await db.update(enrollments).set({ status: 'removed' }).where(eq(enrollments.id, enrollmentId));
}

// ─── Activity Queries ─────────────────────────────

export async function createActivity(data: {
  classroomId: number; title: string;
  type: 'quiz' | 'flashcards' | 'assignment' | 'reading' | 'discussion';
  description?: string; dueDate?: Date; points?: number; content?: string;
}) {
  const db = await getDb();
  if (!db) return null;
  await db.insert(activities).values({ ...data, status: 'active' });
  const result = await db.select().from(activities)
    .where(and(eq(activities.classroomId, data.classroomId), eq(activities.title, data.title)))
    .orderBy(desc(activities.createdAt)).limit(1);
  return result[0] || null;
}

export async function getActivitiesByClassroom(classroomId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(activities).where(eq(activities.classroomId, classroomId)).orderBy(desc(activities.createdAt));
}

export async function updateActivity(id: number, data: Partial<{ title: string; description: string; dueDate: Date; points: number; status: string; content: string }>) {
  const db = await getDb();
  if (!db) return;
  await db.update(activities).set(data as any).where(eq(activities.id, id));
}

// ─── Submission Queries ─────────────────────────────

export async function submitActivity(activityId: number, studentId: number, response: string) {
  const db = await getDb();
  if (!db) return null;
  // Check if already submitted
  const existing = await db.select().from(submissions)
    .where(and(eq(submissions.activityId, activityId), eq(submissions.studentId, studentId))).limit(1);
  if (existing.length > 0) {
    await db.update(submissions).set({ response, status: 'submitted', submittedAt: new Date() }).where(eq(submissions.id, existing[0].id));
    return { ...existing[0], response, status: 'submitted' };
  }
  await db.insert(submissions).values({ activityId, studentId, response, status: 'submitted', submittedAt: new Date() });
  const result = await db.select().from(submissions)
    .where(and(eq(submissions.activityId, activityId), eq(submissions.studentId, studentId))).limit(1);
  return result[0] || null;
}

export async function gradeSubmission(submissionId: number, score: number, feedback?: string) {
  const db = await getDb();
  if (!db) return;
  await db.update(submissions).set({ score, feedback, status: 'graded', gradedAt: new Date() }).where(eq(submissions.id, submissionId));
}

export async function getSubmissionsByActivity(activityId: number) {
  const db = await getDb();
  if (!db) return [];
  const subs = await db.select().from(submissions).where(eq(submissions.activityId, activityId));
  if (subs.length === 0) return [];
  const studentIds = Array.from(new Set(subs.map(s => s.studentId)));
  const students = await db.select({ id: users.id, name: users.name, email: users.email })
    .from(users)
    .where(sql`${users.id} IN (${sql.join(studentIds.map(id => sql`${id}`), sql`, `)})`);
  return subs.map(s => ({
    ...s,
    student: students.find(st => st.id === s.studentId) || { id: s.studentId, name: 'Desconhecido', email: null },
  }));
}

export async function getStudentSubmissions(studentId: number, classroomId: number) {
  const db = await getDb();
  if (!db) return [];
  const acts = await db.select({ id: activities.id }).from(activities).where(eq(activities.classroomId, classroomId));
  if (acts.length === 0) return [];
  const actIds = acts.map(a => a.id);
  return db.select().from(submissions)
    .where(and(
      eq(submissions.studentId, studentId),
      sql`${submissions.activityId} IN (${sql.join(actIds.map(id => sql`${id}`), sql`, `)})`
    ));
}

// ─── Analytics Queries ─────────────────────────────

export async function getClassroomAnalytics(classroomId: number) {
  const db = await getDb();
  if (!db) return null;
  
  const enrolledCount = await db.select({ count: count() }).from(enrollments)
    .where(and(eq(enrollments.classroomId, classroomId), eq(enrollments.status, 'active')));
  
  const acts = await db.select().from(activities).where(eq(activities.classroomId, classroomId));
  const actIds = acts.map(a => a.id);
  
  let totalSubmissions = 0;
  let gradedSubmissions = 0;
  let avgScore = 0;
  let atRiskStudents: { id: number; name: string | null; email: string | null; avgScore: number }[] = [];
  
  if (actIds.length > 0) {
    const allSubs = await db.select().from(submissions)
      .where(sql`${submissions.activityId} IN (${sql.join(actIds.map(id => sql`${id}`), sql`, `)})`);
    totalSubmissions = allSubs.length;
    const graded = allSubs.filter(s => s.status === 'graded');
    gradedSubmissions = graded.length;
    avgScore = graded.length > 0 ? graded.reduce((sum, s) => sum + (s.score || 0), 0) / graded.length : 0;
    
    // Find at-risk students (avg score < 60)
    const studentScores: Record<number, number[]> = {};
    graded.forEach(s => {
      if (!studentScores[s.studentId]) studentScores[s.studentId] = [];
      studentScores[s.studentId].push(s.score || 0);
    });
    
    const atRiskIds = Object.entries(studentScores)
      .filter(([, scores]) => scores.reduce((a, b) => a + b, 0) / scores.length < 60)
      .map(([id]) => Number(id));
    
    if (atRiskIds.length > 0) {
      const students = await db.select({ id: users.id, name: users.name, email: users.email })
        .from(users)
        .where(sql`${users.id} IN (${sql.join(atRiskIds.map(id => sql`${id}`), sql`, `)})`);
      atRiskStudents = students.map(s => ({
        ...s,
        avgScore: studentScores[s.id] ? studentScores[s.id].reduce((a, b) => a + b, 0) / studentScores[s.id].length : 0,
      }));
    }
  }
  
  return {
    enrolledStudents: enrolledCount[0].count,
    totalActivities: acts.length,
    activeActivities: acts.filter(a => a.status === 'active').length,
    totalSubmissions,
    gradedSubmissions,
    avgScore: Math.round(avgScore * 10) / 10,
    completionRate: totalSubmissions > 0 && enrolledCount[0].count > 0 && acts.length > 0
      ? Math.round((totalSubmissions / (enrolledCount[0].count * acts.length)) * 100)
      : 0,
    atRiskStudents,
  };
}

// ─── Generated Materials (AI Content History) ─────────────────────────────

import { generatedMaterials } from "../drizzle/schema";

export async function findGeneratedMaterial(userId: number, universityId: string, subject: string, year: number, contentType: string = 'full') {
  const db = await getDb();
  if (!db) return null;
  const result = await db.select().from(generatedMaterials)
    .where(and(
      eq(generatedMaterials.userId, userId),
      eq(generatedMaterials.universityId, universityId),
      eq(generatedMaterials.subject, subject),
      eq(generatedMaterials.year, year),
      eq(generatedMaterials.contentType, contentType as any),
    ))
    .orderBy(desc(generatedMaterials.createdAt))
    .limit(1);
  if (result.length === 0) return null;
  // Update access count and last accessed
  await db.update(generatedMaterials).set({
    accessCount: result[0].accessCount + 1,
    lastAccessedAt: new Date(),
  }).where(eq(generatedMaterials.id, result[0].id));
  return result[0];
}

export async function saveGeneratedMaterial(data: {
  userId: number;
  universityId: string;
  universityName: string;
  subject: string;
  year: number;
  contentType?: string;
  content: string;
  research?: string;
}) {
  const db = await getDb();
  if (!db) return null;
  await db.insert(generatedMaterials).values({
    userId: data.userId,
    universityId: data.universityId,
    universityName: data.universityName,
    subject: data.subject,
    year: data.year,
    contentType: (data.contentType || 'full') as any,
    content: data.content,
    research: data.research || null,
  });
  return true;
}

export async function getUserMaterialHistory(userId: number, limit = 50) {
  const db = await getDb();
  if (!db) return [];
  return db.select({
    id: generatedMaterials.id,
    universityId: generatedMaterials.universityId,
    universityName: generatedMaterials.universityName,
    subject: generatedMaterials.subject,
    year: generatedMaterials.year,
    contentType: generatedMaterials.contentType,
    accessCount: generatedMaterials.accessCount,
    lastAccessedAt: generatedMaterials.lastAccessedAt,
    createdAt: generatedMaterials.createdAt,
  }).from(generatedMaterials)
    .where(eq(generatedMaterials.userId, userId))
    .orderBy(desc(generatedMaterials.lastAccessedAt))
    .limit(limit);
}

export async function getGeneratedMaterialById(id: number) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.select().from(generatedMaterials).where(eq(generatedMaterials.id, id)).limit(1);
  return result[0] || null;
}

export async function rateMaterial(id: number, qualityScore: number) {
  const db = await getDb();
  if (!db) return;
  await db.update(generatedMaterials).set({ qualityScore }).where(eq(generatedMaterials.id, id));
}

// ─── Library Materials (AI-Curated Academic References) ─────────────────────────────

import { libraryMaterials, userSavedMaterials } from "../drizzle/schema";

export async function searchLibraryMaterials(query: string, filters?: { subject?: string; year?: number; type?: string; language?: string }, limit = 20) {
  const db = await getDb();
  if (!db) return [];
  const conditions: any[] = [];
  if (filters?.subject) conditions.push(sql`${libraryMaterials.subject} LIKE ${`%${filters.subject}%`}`);
  if (filters?.year) conditions.push(eq(libraryMaterials.year, filters.year));
  if (filters?.type) conditions.push(eq(libraryMaterials.type, filters.type as any));
  if (filters?.language) conditions.push(eq(libraryMaterials.language, filters.language));
  if (query) {
    conditions.push(sql`(${libraryMaterials.title} LIKE ${`%${query}%`} OR ${libraryMaterials.description} LIKE ${`%${query}%`} OR ${libraryMaterials.authorName} LIKE ${`%${query}%`} OR ${libraryMaterials.tags} LIKE ${`%${query}%`})`);
  }
  const where = conditions.length > 0 ? and(...conditions) : undefined;
  return db.select().from(libraryMaterials).where(where).orderBy(desc(libraryMaterials.relevanceScore)).limit(limit);
}

export async function saveLibraryMaterial(data: {
  title: string; description: string; type: string; subject: string; specialty?: string; year?: number;
  authorName: string; authorTitle?: string; authorInstitution?: string; authorCountry?: string;
  source?: string; doi?: string; externalUrl?: string; publishedYear?: number; impactFactor?: string;
  relevanceScore?: number; searchQuery?: string; language?: string; tags?: string;
}) {
  const db = await getDb();
  if (!db) return null;
  // Check if already exists by title + authorName
  const existing = await db.select({ id: libraryMaterials.id }).from(libraryMaterials)
    .where(and(eq(libraryMaterials.title, data.title), eq(libraryMaterials.authorName, data.authorName)))
    .limit(1);
  if (existing.length > 0) return existing[0].id;
  await db.insert(libraryMaterials).values(data as any);
  const result = await db.select({ id: libraryMaterials.id }).from(libraryMaterials)
    .where(and(eq(libraryMaterials.title, data.title), eq(libraryMaterials.authorName, data.authorName)))
    .limit(1);
  return result[0]?.id || null;
}

export async function getLibraryMaterialById(id: number) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.select().from(libraryMaterials).where(eq(libraryMaterials.id, id)).limit(1);
  if (result.length > 0) {
    await db.update(libraryMaterials).set({ views: (result[0].views || 0) + 1 }).where(eq(libraryMaterials.id, id));
  }
  return result[0] || null;
}

export async function toggleSaveMaterial(userId: number, materialId: number) {
  const db = await getDb();
  if (!db) return false;
  const existing = await db.select().from(userSavedMaterials)
    .where(and(eq(userSavedMaterials.userId, userId), eq(userSavedMaterials.materialId, materialId)))
    .limit(1);
  if (existing.length > 0) {
    await db.delete(userSavedMaterials).where(eq(userSavedMaterials.id, existing[0].id));
    await db.update(libraryMaterials).set({ saves: sql`GREATEST(${libraryMaterials.saves} - 1, 0)` }).where(eq(libraryMaterials.id, materialId));
    return false; // unsaved
  }
  await db.insert(userSavedMaterials).values({ userId, materialId });
  await db.update(libraryMaterials).set({ saves: sql`${libraryMaterials.saves} + 1` }).where(eq(libraryMaterials.id, materialId));
  return true; // saved
}

export async function getUserSavedMaterialIds(userId: number) {
  const db = await getDb();
  if (!db) return [];
  const saved = await db.select({ materialId: userSavedMaterials.materialId }).from(userSavedMaterials)
    .where(eq(userSavedMaterials.userId, userId));
  return saved.map(s => s.materialId);
}

export async function getUserSavedMaterialsFull(userId: number) {
  const db = await getDb();
  if (!db) return [];
  const saved = await db.select({ materialId: userSavedMaterials.materialId }).from(userSavedMaterials)
    .where(eq(userSavedMaterials.userId, userId));
  if (saved.length === 0) return [];
  const ids = saved.map(s => s.materialId);
  return db.select().from(libraryMaterials)
    .where(sql`${libraryMaterials.id} IN (${sql.join(ids.map(id => sql`${id}`), sql`, `)})`);
}

export async function getPopularLibraryMaterials(limit = 20) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(libraryMaterials).orderBy(desc(libraryMaterials.views)).limit(limit);
}
