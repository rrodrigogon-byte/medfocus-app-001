import { eq, and, sql, desc, count, avg } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, userProgress, xpLog, studySessions, classrooms, enrollments, activities, submissions, generatedMaterials, libraryMaterials, userSavedMaterials, materialReviews, pubmedArticles, userStudyHistory, sharedTemplates, studyTemplates, studyRooms, studyRoomParticipants, studyRoomMessages, sharedNotes, calendarEvents, revisionSuggestions, simulados, simuladoQuestions, subjectSubscriptions, materialNotifications, weeklyGoals, userXP, xpActivities } from "../drizzle/schema";
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


// ─── PubMed/SciELO Cached Articles ─────────────────────────────

export async function searchPubmedCache(query: string, source?: string, limit = 20) {
  const db = await getDb();
  if (!db) return [];
  const conditions = [];
  if (query) {
    conditions.push(sql`(${pubmedArticles.title} LIKE ${'%' + query + '%'} OR ${pubmedArticles.abstractText} LIKE ${'%' + query + '%'})`);
  }
  if (source) {
    conditions.push(eq(pubmedArticles.source, source as any));
  }
  const where = conditions.length > 0 ? and(...conditions) : undefined;
  return db.select().from(pubmedArticles).where(where).orderBy(desc(pubmedArticles.createdAt)).limit(limit);
}

export async function savePubmedArticle(data: {
  pmid: string;
  title: string;
  authors: string; // JSON array
  journal?: string;
  pubDate?: string;
  doi?: string;
  abstractText?: string;
  source?: 'pubmed' | 'scielo';
  searchQuery?: string;
  keywords?: string; // JSON array
  language?: string;
  isOpenAccess?: boolean;
  citationCount?: number;
}) {
  const db = await getDb();
  if (!db) return null;
  // Check if already exists
  const existing = await db.select().from(pubmedArticles).where(eq(pubmedArticles.pmid, data.pmid)).limit(1);
  if (existing.length > 0) return existing[0].id;
  const result = await db.insert(pubmedArticles).values({
    pmid: data.pmid,
    title: data.title,
    authors: data.authors,
    journal: data.journal || null,
    pubDate: data.pubDate || null,
    doi: data.doi || null,
    abstractText: data.abstractText || null,
    source: data.source || 'pubmed',
    searchQuery: data.searchQuery || null,
    keywords: data.keywords || null,
    language: data.language || 'en',
    isOpenAccess: data.isOpenAccess || false,
    citationCount: data.citationCount || null,
  });
  return result[0].insertId;
}

export async function getPubmedArticleByPmid(pmid: string) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.select().from(pubmedArticles).where(eq(pubmedArticles.pmid, pmid)).limit(1);
  if (result.length > 0) {
    await db.update(pubmedArticles).set({ views: (result[0].views || 0) + 1 }).where(eq(pubmedArticles.pmid, pmid));
  }
  return result[0] || null;
}

// ─── Material Reviews ─────────────────────────────

export async function addMaterialReview(materialId: number, userId: number, rating: number, comment?: string) {
  const db = await getDb();
  if (!db) return null;
  // Check if user already reviewed this material
  const existing = await db.select().from(materialReviews)
    .where(and(eq(materialReviews.materialId, materialId), eq(materialReviews.userId, userId)))
    .limit(1);
  if (existing.length > 0) {
    // Update existing review
    await db.update(materialReviews).set({ rating, comment: comment || null })
      .where(eq(materialReviews.id, existing[0].id));
    // Update average rating on material
    const avgResult = await db.select({ avgRating: avg(materialReviews.rating) }).from(materialReviews)
      .where(eq(materialReviews.materialId, materialId));
    const avgRating = Math.round(Number(avgResult[0]?.avgRating || 0) * 10);
    await db.update(libraryMaterials).set({ rating: avgRating }).where(eq(libraryMaterials.id, materialId));
    return existing[0].id;
  }
  const result = await db.insert(materialReviews).values({
    materialId, userId, rating, comment: comment || null,
  });
  // Update average rating on material
  const avgResult = await db.select({ avgRating: avg(materialReviews.rating) }).from(materialReviews)
    .where(eq(materialReviews.materialId, materialId));
  const avgRating = Math.round(Number(avgResult[0]?.avgRating || 0) * 10);
  await db.update(libraryMaterials).set({ rating: avgRating }).where(eq(libraryMaterials.id, materialId));
  return result[0].insertId;
}

export async function getMaterialReviews(materialId: number) {
  const db = await getDb();
  if (!db) return [];
  const reviews = await db.select().from(materialReviews)
    .where(eq(materialReviews.materialId, materialId))
    .orderBy(desc(materialReviews.createdAt));
  // Enrich with user names
  const enriched = [];
  for (const review of reviews) {
    const user = await db.select({ name: users.name }).from(users).where(eq(users.id, review.userId)).limit(1);
    enriched.push({ ...review, userName: user[0]?.name || 'Anônimo' });
  }
  return enriched;
}

export async function markReviewHelpful(reviewId: number) {
  const db = await getDb();
  if (!db) return;
  await db.update(materialReviews).set({ helpful: sql`${materialReviews.helpful} + 1` })
    .where(eq(materialReviews.id, reviewId));
}

// ─── User Study History (for recommendations) ─────────────────────────────

export async function trackStudyActivity(userId: number, data: {
  itemType: 'material' | 'article' | 'quiz' | 'flashcard' | 'subject';
  itemId: string;
  itemTitle: string;
  subject?: string;
  score?: number;
  timeSpentMinutes?: number;
  completed?: boolean;
}) {
  const db = await getDb();
  if (!db) return;
  await db.insert(userStudyHistory).values({
    userId,
    itemType: data.itemType,
    itemId: data.itemId,
    itemTitle: data.itemTitle,
    subject: data.subject || null,
    score: data.score || null,
    timeSpentMinutes: data.timeSpentMinutes || null,
    completed: data.completed || false,
  });
}

export async function getUserStudyHistoryData(userId: number, limit = 100) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(userStudyHistory)
    .where(eq(userStudyHistory.userId, userId))
    .orderBy(desc(userStudyHistory.createdAt))
    .limit(limit);
}

export async function getUserTopSubjects(userId: number) {
  const db = await getDb();
  if (!db) return [];
  const result = await db.select({
    subject: userStudyHistory.subject,
    count: count(),
  }).from(userStudyHistory)
    .where(and(eq(userStudyHistory.userId, userId), sql`${userStudyHistory.subject} IS NOT NULL`))
    .groupBy(userStudyHistory.subject)
    .orderBy(desc(count()))
    .limit(10);
  return result;
}

export async function getUserQuizPerformance(userId: number) {
  const db = await getDb();
  if (!db) return { avgScore: 0, totalQuizzes: 0 };
  const result = await db.select({
    avgScore: avg(userStudyHistory.score),
    totalQuizzes: count(),
  }).from(userStudyHistory)
    .where(and(
      eq(userStudyHistory.userId, userId),
      eq(userStudyHistory.itemType, 'quiz'),
      sql`${userStudyHistory.score} IS NOT NULL`
    ));
  return {
    avgScore: Math.round(Number(result[0]?.avgScore || 0)),
    totalQuizzes: Number(result[0]?.totalQuizzes || 0),
  };
}

// ─── Subject Subscriptions & Notifications ─────────────────────────────

export async function subscribeToSubject(userId: number, subject: string) {
  const db = await getDb();
  if (!db) return false;
  const existing = await db.select().from(subjectSubscriptions)
    .where(and(eq(subjectSubscriptions.userId, userId), eq(subjectSubscriptions.subject, subject)))
    .limit(1);
  if (existing.length > 0) return false; // already subscribed
  await db.insert(subjectSubscriptions).values({ userId, subject });
  return true;
}

export async function unsubscribeFromSubject(userId: number, subject: string) {
  const db = await getDb();
  if (!db) return false;
  await db.delete(subjectSubscriptions)
    .where(and(eq(subjectSubscriptions.userId, userId), eq(subjectSubscriptions.subject, subject)));
  return true;
}

export async function getUserSubscriptions(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(subjectSubscriptions)
    .where(eq(subjectSubscriptions.userId, userId))
    .orderBy(desc(subjectSubscriptions.createdAt));
}

export async function getSubscribersForSubject(subject: string) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(subjectSubscriptions)
    .where(eq(subjectSubscriptions.subject, subject));
}

export async function createMaterialNotification(userId: number, materialId: number, subject: string, title: string) {
  const db = await getDb();
  if (!db) return;
  await db.insert(materialNotifications).values({ userId, materialId, subject, title });
}

export async function getUserNotifications(userId: number, limit = 30) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(materialNotifications)
    .where(eq(materialNotifications.userId, userId))
    .orderBy(desc(materialNotifications.createdAt))
    .limit(limit);
}

export async function getUnreadNotificationCount(userId: number) {
  const db = await getDb();
  if (!db) return 0;
  const result = await db.select({ count: count() }).from(materialNotifications)
    .where(and(eq(materialNotifications.userId, userId), eq(materialNotifications.isRead, false)));
  return result[0]?.count || 0;
}

export async function markNotificationRead(notificationId: number) {
  const db = await getDb();
  if (!db) return;
  await db.update(materialNotifications).set({ isRead: true })
    .where(eq(materialNotifications.id, notificationId));
}

export async function markAllNotificationsRead(userId: number) {
  const db = await getDb();
  if (!db) return;
  await db.update(materialNotifications).set({ isRead: true })
    .where(and(eq(materialNotifications.userId, userId), eq(materialNotifications.isRead, false)));
}

// Notify all subscribers when a new material is added to a subject
export async function notifySubscribersOfNewMaterial(materialId: number, subject: string, title: string) {
  const db = await getDb();
  if (!db) return;
  // Find all subscribers matching this subject (partial match)
  const subscribers = await db.select().from(subjectSubscriptions)
    .where(sql`${subjectSubscriptions.subject} LIKE ${'%' + subject + '%'} OR ${subject} LIKE CONCAT('%', ${subjectSubscriptions.subject}, '%')`);
  for (const sub of subscribers) {
    await createMaterialNotification(sub.userId, materialId, subject, title);
  }
}

// ─── Study Templates ─────────────────────────────

export async function saveStudyTemplate(data: {
  userId?: number;
  templateType: string;
  subject: string;
  title: string;
  content: string;
  specialty?: string;
  year?: number;
  difficulty?: string;
  tags?: string;
  isPublic?: boolean;
}) {
  const db = await getDb();
  if (!db) return null;
  await db.insert(studyTemplates).values(data as any);
  const result = await db.select().from(studyTemplates)
    .orderBy(desc(studyTemplates.createdAt))
    .limit(1);
  return result[0] || null;
}

export async function getStudyTemplates(filters?: {
  subject?: string;
  templateType?: string;
  year?: number;
  difficulty?: string;
}, limit = 20) {
  const db = await getDb();
  if (!db) return [];
  const conditions: any[] = [eq(studyTemplates.isPublic, true)];
  if (filters?.subject) conditions.push(sql`${studyTemplates.subject} LIKE ${'%' + filters.subject + '%'}`);
  if (filters?.templateType) conditions.push(eq(studyTemplates.templateType, filters.templateType as any));
  if (filters?.year) conditions.push(eq(studyTemplates.year, filters.year));
  if (filters?.difficulty) conditions.push(eq(studyTemplates.difficulty, filters.difficulty as any));
  return db.select().from(studyTemplates)
    .where(and(...conditions))
    .orderBy(desc(studyTemplates.views))
    .limit(limit);
}

export async function getStudyTemplateById(id: number) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.select().from(studyTemplates).where(eq(studyTemplates.id, id)).limit(1);
  if (result.length > 0) {
    await db.update(studyTemplates).set({ views: (result[0].views || 0) + 1 }).where(eq(studyTemplates.id, id));
  }
  return result[0] || null;
}

export async function getUserTemplates(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(studyTemplates)
    .where(eq(studyTemplates.userId, userId))
    .orderBy(desc(studyTemplates.createdAt));
}

// ============================================================================
// Shared Templates
// ============================================================================

export async function shareTemplate(templateId: number, userId: number, subject: string, university?: string, year?: number) {
  const db = await getDb();
  if (!db) return null;
  const code = Math.random().toString(36).substring(2, 10).toUpperCase();
  const [result] = await db.insert(sharedTemplates).values({
    templateId, sharedByUserId: userId, shareCode: code, subject, university, year
  }).$returningId();
  return { id: result.id, shareCode: code };
}

export async function getSharedTemplateByCode(code: string) {
  const db = await getDb();
  if (!db) return null;
  const rows = await db.select().from(sharedTemplates).where(eq(sharedTemplates.shareCode, code));
  if (!rows.length) return null;
  await db.update(sharedTemplates).set({ views: sql`${sharedTemplates.views} + 1` }).where(eq(sharedTemplates.id, rows[0].id));
  const template = await db.select().from(studyTemplates).where(eq(studyTemplates.id, rows[0].templateId));
  return { share: rows[0], template: template[0] || null };
}

export async function getSharedTemplateFeed(subject?: string, university?: string, limit = 20) {
  const db = await getDb();
  if (!db) return [];
  let query = db.select({
    share: sharedTemplates,
    template: studyTemplates,
    userName: users.name,
  }).from(sharedTemplates)
    .innerJoin(studyTemplates, eq(sharedTemplates.templateId, studyTemplates.id))
    .innerJoin(users, eq(sharedTemplates.sharedByUserId, users.id))
    .where(eq(sharedTemplates.isActive, true))
    .orderBy(desc(sharedTemplates.createdAt))
    .limit(limit);
  return await query;
}

export async function likeSharedTemplate(shareId: number) {
  const db = await getDb();
  if (!db) return;
  await db.update(sharedTemplates).set({ likes: sql`${sharedTemplates.likes} + 1` }).where(eq(sharedTemplates.id, shareId));
}

// ============================================================================
// Study Rooms (Collaborative)
// ============================================================================

export async function createStudyRoom(data: { name: string; subject: string; createdByUserId: number; university?: string; year?: number; description?: string; maxParticipants?: number; isPublic?: boolean }) {
  const db = await getDb();
  if (!db) return null;
  const code = Math.random().toString(36).substring(2, 8).toUpperCase();
  const [result] = await db.insert(studyRooms).values({ ...data, code }).$returningId();
  await db.insert(studyRoomParticipants).values({ roomId: result.id, userId: data.createdByUserId, role: 'owner' });
  return { id: result.id, code };
}

export async function getStudyRooms(userId?: number) {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(studyRooms).where(eq(studyRooms.isActive, true)).orderBy(desc(studyRooms.updatedAt)).limit(50);
}

export async function joinStudyRoom(roomId: number, userId: number) {
  const db = await getDb();
  if (!db) return false;
  const existing = await db.select().from(studyRoomParticipants).where(and(eq(studyRoomParticipants.roomId, roomId), eq(studyRoomParticipants.userId, userId)));
  if (existing.length) return true;
  await db.insert(studyRoomParticipants).values({ roomId, userId, role: 'member' });
  return true;
}

export async function getStudyRoomById(roomId: number) {
  const db = await getDb();
  if (!db) return null;
  const rows = await db.select().from(studyRooms).where(eq(studyRooms.id, roomId));
  if (!rows.length) return null;
  const participants = await db.select({ userId: studyRoomParticipants.userId, role: studyRoomParticipants.role, userName: users.name })
    .from(studyRoomParticipants).innerJoin(users, eq(studyRoomParticipants.userId, users.id))
    .where(eq(studyRoomParticipants.roomId, roomId));
  return { room: rows[0], participants };
}

export async function sendRoomMessage(roomId: number, userId: number, userName: string, content: string, messageType: 'text' | 'note' | 'link' | 'file' = 'text') {
  const db = await getDb();
  if (!db) return null;
  const [result] = await db.insert(studyRoomMessages).values({ roomId, userId, userName, content, messageType }).$returningId();
  return result.id;
}

export async function getRoomMessages(roomId: number, limit = 100) {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(studyRoomMessages).where(eq(studyRoomMessages.roomId, roomId)).orderBy(desc(studyRoomMessages.createdAt)).limit(limit);
}

export async function createSharedNote(roomId: number, userId: number, userName: string, title: string, content: string, subject?: string) {
  const db = await getDb();
  if (!db) return null;
  const [result] = await db.insert(sharedNotes).values({ roomId, userId, userName, title, content, subject }).$returningId();
  return result.id;
}

export async function getRoomNotes(roomId: number) {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(sharedNotes).where(eq(sharedNotes.roomId, roomId)).orderBy(desc(sharedNotes.updatedAt));
}

// ============================================================================
// Calendar & Revision Suggestions
// ============================================================================

export async function createCalendarEvent(data: { userId: number; title: string; eventType: 'prova' | 'trabalho' | 'seminario' | 'pratica' | 'revisao' | 'simulado' | 'outro'; subject: string; eventDate: Date; description?: string; university?: string; year?: number; reminderDays?: number; linkedMaterialIds?: string }) {
  const db = await getDb();
  if (!db) return null;
  const [result] = await db.insert(calendarEvents).values(data).$returningId();
  return result.id;
}

export async function getCalendarEvents(userId: number, month?: number, year?: number) {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(calendarEvents).where(eq(calendarEvents.userId, userId)).orderBy(calendarEvents.eventDate);
}

export async function updateCalendarEvent(eventId: number, userId: number, data: Partial<{ title: string; description: string; eventDate: Date; isCompleted: boolean; reminderDays: number; linkedMaterialIds: string }>) {
  const db = await getDb();
  if (!db) return;
  await db.update(calendarEvents).set(data).where(and(eq(calendarEvents.id, eventId), eq(calendarEvents.userId, userId)));
}

export async function deleteCalendarEvent(eventId: number, userId: number) {
  const db = await getDb();
  if (!db) return;
  await db.delete(calendarEvents).where(and(eq(calendarEvents.id, eventId), eq(calendarEvents.userId, userId)));
}

export async function createRevisionSuggestions(userId: number, calendarEventId: number, subject: string, eventDate: Date, reminderDays: number) {
  const db = await getDb();
  if (!db) return [];
  const suggestions: { suggestedDate: Date; revisionType: 'leitura' | 'flashcards' | 'quiz' | 'resumo' | 'simulado' }[] = [];
  const types: ('leitura' | 'flashcards' | 'quiz' | 'resumo' | 'simulado')[] = ['leitura', 'flashcards', 'quiz', 'resumo', 'simulado'];
  for (let i = reminderDays; i >= 1; i--) {
    const d = new Date(eventDate);
    d.setDate(d.getDate() - i);
    const typeIdx = (reminderDays - i) % types.length;
    suggestions.push({ suggestedDate: d, revisionType: types[typeIdx] });
  }
  for (const s of suggestions) {
    await db.insert(revisionSuggestions).values({ userId, calendarEventId, subject, suggestedDate: s.suggestedDate, revisionType: s.revisionType });
  }
  return suggestions;
}

export async function getRevisionSuggestions(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return await db.select({ suggestion: revisionSuggestions, event: calendarEvents })
    .from(revisionSuggestions)
    .innerJoin(calendarEvents, eq(revisionSuggestions.calendarEventId, calendarEvents.id))
    .where(and(eq(revisionSuggestions.userId, userId), eq(revisionSuggestions.isCompleted, false)))
    .orderBy(revisionSuggestions.suggestedDate);
}

export async function completeRevision(revisionId: number, userId: number) {
  const db = await getDb();
  if (!db) return;
  await db.update(revisionSuggestions).set({ isCompleted: true }).where(and(eq(revisionSuggestions.id, revisionId), eq(revisionSuggestions.userId, userId)));
}

// ============================================================================
// Simulados ENAMED/REVALIDA
// ============================================================================

export async function createSimulado(data: { userId: number; title: string; examType: 'enamed' | 'revalida' | 'residencia' | 'custom'; totalQuestions: number; timeLimit: number; areas: string }) {
  const db = await getDb();
  if (!db) return null;
  const [result] = await db.insert(simulados).values(data).$returningId();
  return result.id;
}

export async function getSimulados(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(simulados).where(eq(simulados.userId, userId)).orderBy(desc(simulados.createdAt));
}

export async function completeSimulado(simuladoId: number, userId: number, score: number, correctAnswers: number, timeSpent: number, results: string) {
  const db = await getDb();
  if (!db) return;
  await db.update(simulados).set({ status: 'completed', score, correctAnswers, timeSpent, results, completedAt: new Date() })
    .where(and(eq(simulados.id, simuladoId), eq(simulados.userId, userId)));
}

export async function getSimuladoQuestions(area?: string, examType?: string, difficulty?: string, limit = 30) {
  const db = await getDb();
  if (!db) return [];
  let conditions = [];
  if (area) conditions.push(eq(simuladoQuestions.area, area));
  if (examType) conditions.push(eq(simuladoQuestions.examType, examType as any));
  if (difficulty) conditions.push(eq(simuladoQuestions.difficulty, difficulty as any));
  const where = conditions.length > 0 ? and(...conditions) : undefined;
  return await db.select().from(simuladoQuestions).where(where).orderBy(sql`RAND()`).limit(limit);
}

export async function saveSimuladoQuestion(data: { area: string; subArea?: string; difficulty: 'facil' | 'medio' | 'dificil'; examType: 'enamed' | 'revalida' | 'residencia'; question: string; options: string; correctIndex: number; explanation: string; references?: string }) {
  const db = await getDb();
  if (!db) return null;
  const [result] = await db.insert(simuladoQuestions).values(data).$returningId();
  return result.id;
}

export async function getSimuladoStats(userId: number) {
  const db = await getDb();
  if (!db) return null;
  const completed = await db.select({ cnt: count(), avgScore: avg(simulados.score) }).from(simulados).where(and(eq(simulados.userId, userId), eq(simulados.status, 'completed')));
  return { totalCompleted: Number(completed[0]?.cnt || 0), avgScore: Number(completed[0]?.avgScore || 0) };
}

// ─── Weekly Goals ─────────────────────────────────────────────

export async function getWeeklyGoals(userId: number, weekStart: string) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(weeklyGoals).where(and(eq(weeklyGoals.userId, userId), eq(weeklyGoals.weekStart, weekStart)));
}

export async function createWeeklyGoal(data: { userId: number; weekStart: string; goalType: 'questions' | 'pomodoro_hours' | 'study_hours' | 'flashcards' | 'simulados'; targetValue: number }) {
  const db = await getDb();
  if (!db) return null;
  const [result] = await db.insert(weeklyGoals).values(data).$returningId();
  return result;
}

export async function updateGoalProgress(goalId: number, currentValue: number) {
  const db = await getDb();
  if (!db) return;
  const [goal] = await db.select().from(weeklyGoals).where(eq(weeklyGoals.id, goalId));
  const completed = currentValue >= (goal?.targetValue || 0);
  await db.update(weeklyGoals).set({ currentValue, completed }).where(eq(weeklyGoals.id, goalId));
}

export async function incrementGoalProgress(userId: number, weekStart: string, goalType: string, increment: number) {
  const db = await getDb();
  if (!db) return;
  await db.update(weeklyGoals)
    .set({ currentValue: sql`current_value + ${increment}` })
    .where(and(
      eq(weeklyGoals.userId, userId),
      eq(weeklyGoals.weekStart, weekStart),
      eq(weeklyGoals.goalType, goalType as any)
    ));
  // Check if completed
  const goals = await db.select().from(weeklyGoals).where(and(
    eq(weeklyGoals.userId, userId),
    eq(weeklyGoals.weekStart, weekStart),
    eq(weeklyGoals.goalType, goalType as any)
  ));
  for (const g of goals) {
    if (g.currentValue >= g.targetValue && !g.completed) {
      await db.update(weeklyGoals).set({ completed: true }).where(eq(weeklyGoals.id, g.id));
    }
  }
}

export async function deleteWeeklyGoal(goalId: number, userId: number) {
  const db = await getDb();
  if (!db) return;
  await db.delete(weeklyGoals).where(and(eq(weeklyGoals.id, goalId), eq(weeklyGoals.userId, userId)));
}

// ─── XP & Leaderboard ────────────────────────────────────────

export async function getUserXP(userId: number) {
  const db = await getDb();
  if (!db) return null;
  const [xp] = await db.select().from(userXP).where(eq(userXP.userId, userId));
  return xp || null;
}

export async function ensureUserXP(userId: number, universityId?: string) {
  const db = await getDb();
  if (!db) return null;
  const [existing] = await db.select().from(userXP).where(eq(userXP.userId, userId));
  if (existing) {
    if (universityId && existing.universityId !== universityId) {
      await db.update(userXP).set({ universityId }).where(eq(userXP.userId, userId));
    }
    return existing;
  }
  const [result] = await db.insert(userXP).values({ userId, universityId }).$returningId();
  return { id: result.id, userId, totalXP: 0, weeklyXP: 0, monthlyXP: 0, streak: 0, longestStreak: 0, lastActiveDate: null, simuladosCompleted: 0, questionsAnswered: 0, correctAnswers: 0, pomodoroMinutes: 0, flashcardsReviewed: 0, universityId };
}

export async function addXP(userId: number, xpAmount: number, activityType: string, description?: string) {
  const db = await getDb();
  if (!db) return;
  
  // Update user XP
  await db.update(userXP).set({
    totalXP: sql`total_xp + ${xpAmount}`,
    weeklyXP: sql`weekly_xp + ${xpAmount}`,
    monthlyXP: sql`monthly_xp + ${xpAmount}`,
  }).where(eq(userXP.userId, userId));
  
  // Log activity
  await db.insert(xpActivities).values({
    userId,
    activityType: activityType as any,
    xpEarned: xpAmount,
    description,
  });
}

export async function updateStreak(userId: number) {
  const db = await getDb();
  if (!db) return;
  const today = new Date().toISOString().split('T')[0];
  const [xp] = await db.select().from(userXP).where(eq(userXP.userId, userId));
  if (!xp) return;
  
  if (xp.lastActiveDate === today) return; // Already counted today
  
  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
  const newStreak = xp.lastActiveDate === yesterday ? xp.streak + 1 : 1;
  const longestStreak = Math.max(newStreak, xp.longestStreak);
  
  await db.update(userXP).set({
    streak: newStreak,
    longestStreak,
    lastActiveDate: today,
  }).where(eq(userXP.userId, userId));
  
  // Streak bonus XP
  if (newStreak > 1 && newStreak % 7 === 0) {
    await addXP(userId, 50, 'streak_bonus', `Streak de ${newStreak} dias!`);
  }
}

export async function updateXPStats(userId: number, field: 'simuladosCompleted' | 'questionsAnswered' | 'correctAnswers' | 'pomodoroMinutes' | 'flashcardsReviewed', increment: number) {
  const db = await getDb();
  if (!db) return;
  const fieldMap: Record<string, any> = {
    simuladosCompleted: userXP.simuladosCompleted,
    questionsAnswered: userXP.questionsAnswered,
    correctAnswers: userXP.correctAnswers,
    pomodoroMinutes: userXP.pomodoroMinutes,
    flashcardsReviewed: userXP.flashcardsReviewed,
  };
  await db.update(userXP).set({
    [field]: sql`${fieldMap[field]} + ${increment}`,
  }).where(eq(userXP.userId, userId));
}

export async function getLeaderboard(period: 'weekly' | 'monthly' | 'alltime', universityId?: string, limit = 50) {
  const db = await getDb();
  if (!db) return [];
  
  const xpField = period === 'weekly' ? userXP.weeklyXP : period === 'monthly' ? userXP.monthlyXP : userXP.totalXP;
  
  let query = db.select({
    userId: userXP.userId,
    xp: xpField,
    totalXP: userXP.totalXP,
    streak: userXP.streak,
    longestStreak: userXP.longestStreak,
    simuladosCompleted: userXP.simuladosCompleted,
    questionsAnswered: userXP.questionsAnswered,
    correctAnswers: userXP.correctAnswers,
    universityId: userXP.universityId,
    userName: users.name,
  }).from(userXP)
    .innerJoin(users, eq(userXP.userId, users.id))
    .orderBy(desc(xpField))
    .limit(limit);
  
  if (universityId) {
    return query.where(eq(userXP.universityId, universityId));
  }
  return query;
}

export async function getXPActivities(userId: number, limit = 20) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(xpActivities).where(eq(xpActivities.userId, userId)).orderBy(desc(xpActivities.createdAt)).limit(limit);
}

export async function resetWeeklyXP() {
  const db = await getDb();
  if (!db) return;
  await db.update(userXP).set({ weeklyXP: 0 });
}

export async function resetMonthlyXP() {
  const db = await getDb();
  if (!db) return;
  await db.update(userXP).set({ monthlyXP: 0 });
}
