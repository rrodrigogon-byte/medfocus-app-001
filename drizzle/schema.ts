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

/**
 * Library Materials — AI-curated academic references from renowned professors, 
 * doctors and researchers from Brazil and worldwide.
 * Each entry is validated by IA and linked to real academic sources.
 */
export const libraryMaterials = mysqlTable("library_materials", {
  id: int("id").autoincrement().primaryKey(),
  title: varchar("title", { length: 500 }).notNull(),
  description: text("description").notNull(),
  type: mysqlEnum("libraryMaterialType", [
    "livro", "artigo", "diretriz", "atlas", "videoaula", "podcast",
    "tese", "revisao_sistematica", "caso_clinico", "guideline"
  ]).notNull(),
  subject: varchar("subject", { length: 255 }).notNull(),
  specialty: varchar("specialty", { length: 255 }),
  year: int("year"), // medical year (1-6)
  
  // Author info — professors, doctors, researchers
  authorName: varchar("authorName", { length: 500 }).notNull(),
  authorTitle: varchar("authorTitle", { length: 255 }), // Dr., Prof., PhD, etc.
  authorInstitution: varchar("authorInstitution", { length: 500 }),
  authorCountry: varchar("authorCountry", { length: 64 }).default("Brasil"),
  
  // Source & validation
  source: varchar("source", { length: 500 }), // PubMed, SciELO, NEJM, Lancet, etc.
  doi: varchar("doi", { length: 255 }),
  externalUrl: text("externalUrl"),
  publishedYear: int("publishedYear"),
  impactFactor: varchar("impactFactor", { length: 32 }),
  
  // AI metadata
  aiCurated: boolean("aiCurated").default(true).notNull(),
  relevanceScore: int("relevanceScore").default(80), // 0-100
  searchQuery: varchar("searchQuery", { length: 500 }), // query that generated this result
  
  // User interaction
  views: int("views").default(0).notNull(),
  saves: int("saves").default(0).notNull(),
  rating: int("rating"), // avg 0-50 (x10)
  
  language: varchar("language", { length: 10 }).default("pt-BR"),
  tags: text("tags"), // JSON array of tags
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type LibraryMaterial = typeof libraryMaterials.$inferSelect;
export type InsertLibraryMaterial = typeof libraryMaterials.$inferInsert;

/**
 * User saved library materials — bookmarks for quick access.
 */
export const userSavedMaterials = mysqlTable("user_saved_materials", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  materialId: int("materialId").notNull(),
  notes: text("notes"),
  savedAt: timestamp("savedAt").defaultNow().notNull(),
});

export type UserSavedMaterial = typeof userSavedMaterials.$inferSelect;

/**
 * Material Reviews — ratings and comments from students on library materials.
 * Creates a collaborative quality ranking system.
 */
export const materialReviews = mysqlTable("material_reviews", {
  id: int("id").autoincrement().primaryKey(),
  materialId: int("materialId").notNull(),
  userId: int("userId").notNull(),
  rating: int("rating").notNull(), // 1-5 stars
  comment: text("comment"),
  helpful: int("helpful").default(0).notNull(), // upvotes
  reported: boolean("reported").default(false).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type MaterialReview = typeof materialReviews.$inferSelect;
export type InsertMaterialReview = typeof materialReviews.$inferInsert;

/**
 * PubMed/SciELO cached articles — real search results from scientific databases.
 * Cached to avoid repeated API calls and provide faster access.
 */
export const pubmedArticles = mysqlTable("pubmed_articles", {
  id: int("id").autoincrement().primaryKey(),
  pmid: varchar("pmid", { length: 32 }).notNull().unique(),
  title: text("title").notNull(),
  authors: text("authors").notNull(), // JSON array of author names
  journal: varchar("journal", { length: 500 }),
  pubDate: varchar("pubDate", { length: 32 }),
  doi: varchar("doi", { length: 255 }),
  abstractText: text("abstractText"),
  source: mysqlEnum("articleSource", ["pubmed", "scielo"]).default("pubmed").notNull(),
  searchQuery: varchar("searchQuery", { length: 500 }),
  keywords: text("keywords"), // JSON array
  language: varchar("language", { length: 10 }).default("en"),
  isOpenAccess: boolean("isOpenAccess").default(false),
  citationCount: int("citationCount"),
  views: int("views").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type PubmedArticle = typeof pubmedArticles.$inferSelect;
export type InsertPubmedArticle = typeof pubmedArticles.$inferInsert;

/**
 * User study history — tracks which subjects, materials and quizzes the user has engaged with.
 * Used for AI-powered personalized recommendations.
 */
export const userStudyHistory = mysqlTable("user_study_history", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  itemType: mysqlEnum("itemType", ["material", "article", "quiz", "flashcard", "subject"]).notNull(),
  itemId: varchar("itemId", { length: 255 }).notNull(), // material ID, PMID, subject name, etc.
  itemTitle: varchar("itemTitle", { length: 500 }).notNull(),
  subject: varchar("subject", { length: 255 }),
  score: int("score"), // quiz score, rating given, etc.
  timeSpentMinutes: int("timeSpentMinutes"),
  completed: boolean("completed").default(false),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type UserStudyHistory = typeof userStudyHistory.$inferSelect;
export type InsertUserStudyHistory = typeof userStudyHistory.$inferInsert;

/**
 * Subject Subscriptions — users subscribe to subjects to receive notifications
 * when new materials are added to those subjects.
 */
export const subjectSubscriptions = mysqlTable("subject_subscriptions", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  subject: varchar("subject", { length: 255 }).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type SubjectSubscription = typeof subjectSubscriptions.$inferSelect;
export type InsertSubjectSubscription = typeof subjectSubscriptions.$inferInsert;

/**
 * Material Notifications — alerts sent to users when new materials match their subscribed subjects.
 */
export const materialNotifications = mysqlTable("material_notifications", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  materialId: int("materialId").notNull(),
  subject: varchar("subject", { length: 255 }).notNull(),
  title: varchar("title", { length: 500 }).notNull(),
  isRead: boolean("isRead").default(false).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type MaterialNotification = typeof materialNotifications.$inferSelect;
export type InsertMaterialNotification = typeof materialNotifications.$inferInsert;

/**
 * Generated Study Templates — AI-generated original study templates and guides.
 * All content is original (not copied), respecting copyright.
 * Types: anamnese, exame_fisico, diagnostico_diferencial, prescricao, 
 *        roteiro_revisao, mapa_mental, checklist_estudo, guia_completo
 */
export const studyTemplates = mysqlTable("study_templates", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId"),
  templateType: mysqlEnum("templateType", [
    "anamnese", "exame_fisico", "diagnostico_diferencial", "prescricao",
    "roteiro_revisao", "mapa_mental", "checklist_estudo", "guia_completo",
    "resumo_estruturado", "caso_clinico_modelo"
  ]).notNull(),
  subject: varchar("subject", { length: 255 }).notNull(),
  title: varchar("title", { length: 500 }).notNull(),
  content: text("content").notNull(), // Markdown content
  specialty: varchar("specialty", { length: 255 }),
  year: int("year"), // medical year 1-6
  difficulty: mysqlEnum("difficulty", ["basico", "intermediario", "avancado"]).default("intermediario"),
  tags: text("tags"), // JSON array
  views: int("views").default(0).notNull(),
  saves: int("saves").default(0).notNull(),
  rating: int("rating"), // avg 0-50 (x10)
  isPublic: boolean("isPublic").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type StudyTemplate = typeof studyTemplates.$inferSelect;
export type InsertStudyTemplate = typeof studyTemplates.$inferInsert;
