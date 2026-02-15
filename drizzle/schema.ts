import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, json, boolean } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extended with Stripe subscription fields for MedFocus Pro.
 */
export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  
  // Stripe fields
  stripeCustomerId: varchar("stripeCustomerId", { length: 128 }),
  stripeSubscriptionId: varchar("stripeSubscriptionId", { length: 128 }),
  plan: mysqlEnum("plan", ["free", "pro", "premium"]).default("free").notNull(),

  // Profile fields for medical student
  universityId: varchar("universityId", { length: 64 }),
  currentYear: int("currentYear"),
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * XP & Gamification progress — persisted per user.
 * Replaces localStorage-based gamification.
 */
export const userProgress = mysqlTable("user_progress", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  totalXp: int("totalXp").default(0).notNull(),
  level: int("level").default(1).notNull(),
  currentStreak: int("currentStreak").default(0).notNull(),
  longestStreak: int("longestStreak").default(0).notNull(),
  lastActiveDate: varchar("lastActiveDate", { length: 10 }), // YYYY-MM-DD
  pomodorosCompleted: int("pomodorosCompleted").default(0).notNull(),
  quizzesCompleted: int("quizzesCompleted").default(0).notNull(),
  flashcardsReviewed: int("flashcardsReviewed").default(0).notNull(),
  checklistItemsDone: int("checklistItemsDone").default(0).notNull(),
  studyMinutes: int("studyMinutes").default(0).notNull(),
  badges: text("badges"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type UserProgress = typeof userProgress.$inferSelect;
export type InsertUserProgress = typeof userProgress.$inferInsert;

/**
 * XP activity log — individual XP events for history/analytics.
 */
export const xpLog = mysqlTable("xp_log", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  action: varchar("action", { length: 64 }).notNull(), // e.g. 'pomodoro', 'quiz', 'flashcard', 'checklist'
  xpEarned: int("xpEarned").notNull(),
  description: varchar("description", { length: 255 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type XpLog = typeof xpLog.$inferSelect;

/**
 * Study sessions — tracks Pomodoro and study time.
 */
export const studySessions = mysqlTable("study_sessions", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  type: mysqlEnum("type", ["pomodoro", "free_study"]).notNull(),
  durationMinutes: int("durationMinutes").notNull(),
  subject: varchar("subject", { length: 128 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type StudySession = typeof studySessions.$inferSelect;

/**
 * Classrooms — virtual study rooms created by professors.
 */
export const classrooms = mysqlTable("classrooms", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  code: varchar("code", { length: 32 }).notNull().unique(),
  professorId: int("professorId").notNull(),
  subject: varchar("subject", { length: 128 }).notNull(),
  year: int("year").notNull(),
  semester: int("semester").notNull(),
  university: varchar("university", { length: 128 }).notNull(),
  description: text("description"),
  maxStudents: int("maxStudents").default(60).notNull(),
  isActive: boolean("isActive").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Classroom = typeof classrooms.$inferSelect;
export type InsertClassroom = typeof classrooms.$inferInsert;

/**
 * Enrollments — students enrolled in classrooms.
 */
export const enrollments = mysqlTable("enrollments", {
  id: int("id").autoincrement().primaryKey(),
  classroomId: int("classroomId").notNull(),
  studentId: int("studentId").notNull(),
  status: mysqlEnum("status", ["active", "inactive", "removed"]).default("active").notNull(),
  enrolledAt: timestamp("enrolledAt").defaultNow().notNull(),
});

export type Enrollment = typeof enrollments.$inferSelect;
export type InsertEnrollment = typeof enrollments.$inferInsert;

/**
 * Activities — assignments, quizzes, readings created by professors for classrooms.
 */
export const activities = mysqlTable("activities", {
  id: int("id").autoincrement().primaryKey(),
  classroomId: int("classroomId").notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  type: mysqlEnum("type", ["quiz", "flashcards", "assignment", "reading", "discussion"]).notNull(),
  description: text("description"),
  dueDate: timestamp("dueDate"),
  points: int("points").default(100).notNull(),
  status: mysqlEnum("activityStatus", ["draft", "active", "completed", "archived"]).default("draft").notNull(),
  content: text("content"), // JSON string for quiz questions, reading links, etc.
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Activity = typeof activities.$inferSelect;
export type InsertActivity = typeof activities.$inferInsert;

/**
 * Submissions — student responses/completions for activities.
 */
export const submissions = mysqlTable("submissions", {
  id: int("id").autoincrement().primaryKey(),
  activityId: int("activityId").notNull(),
  studentId: int("studentId").notNull(),
  score: int("score"),
  status: mysqlEnum("submissionStatus", ["pending", "submitted", "graded"]).default("pending").notNull(),
  response: text("response"), // JSON string with answers
  feedback: text("feedback"),
  submittedAt: timestamp("submittedAt"),
  gradedAt: timestamp("gradedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Submission = typeof submissions.$inferSelect;
export type InsertSubmission = typeof submissions.$inferInsert;

/**
 * Generated Materials — AI-generated study content cached per user/university/subject.
 * Avoids re-generation and provides quick access to previously generated content.
 */
export const generatedMaterials = mysqlTable("generated_materials", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  universityId: varchar("universityId", { length: 64 }).notNull(),
  universityName: varchar("universityName", { length: 255 }).notNull(),
  subject: varchar("subject", { length: 255 }).notNull(),
  year: int("year").notNull(),
  contentType: mysqlEnum("contentType", ["full", "summary", "flashcards", "quiz"]).default("full").notNull(),
  content: text("content").notNull(), // JSON string with SubjectContent
  research: text("research"), // Research text from AI
  qualityScore: int("qualityScore"), // 0-100 user rating
  accessCount: int("accessCount").default(1).notNull(),
  lastAccessedAt: timestamp("lastAccessedAt").defaultNow().notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type GeneratedMaterial = typeof generatedMaterials.$inferSelect;
export type InsertGeneratedMaterial = typeof generatedMaterials.$inferInsert;
