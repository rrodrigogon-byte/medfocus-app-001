import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, json, boolean, double, tinyint } from "drizzle-orm/mysql-core";

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
  plan: mysqlEnum("plan", ["free", "pro", "premium", "estudante", "medico", "professor", "admin"]).default("free").notNull(),
  
  // Trial fields
  trialStartDate: timestamp("trialStartDate"),
  trialEndDate: timestamp("trialEndDate"),
  trialActive: boolean("trialActive").default(false).notNull(),
  cardRegistered: boolean("cardRegistered").default(false).notNull(),
  
  // Subscription billing
  billingInterval: mysqlEnum("billingInterval", ["monthly", "yearly"]).default("monthly"),
  subscriptionStatus: varchar("subscriptionStatus", { length: 32 }).default("none"),
  paymentGateway: varchar("paymentGateway", { length: 32 }).default("stripe"),
  mpSubscriptionId: varchar("mpSubscriptionId", { length: 128 }),

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

/**
 * Shared Templates — templates shared publicly between students.
 * Links to studyTemplates but tracks sharing metadata.
 */
export const sharedTemplates = mysqlTable("shared_templates", {
  id: int("id").autoincrement().primaryKey(),
  templateId: int("templateId").notNull(),
  sharedByUserId: int("sharedByUserId").notNull(),
  shareCode: varchar("shareCode", { length: 32 }).notNull().unique(),
  subject: varchar("subject", { length: 255 }).notNull(),
  university: varchar("university", { length: 255 }),
  year: int("year"),
  views: int("views").default(0).notNull(),
  copies: int("copies").default(0).notNull(),
  likes: int("likes").default(0).notNull(),
  isActive: boolean("isActive").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type SharedTemplate = typeof sharedTemplates.$inferSelect;
export type InsertSharedTemplate = typeof sharedTemplates.$inferInsert;

/**
 * Study Rooms — collaborative real-time study rooms.
 * Students can join, chat, and share notes.
 */
export const studyRooms = mysqlTable("study_rooms", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  code: varchar("code", { length: 16 }).notNull().unique(),
  createdByUserId: int("createdByUserId").notNull(),
  subject: varchar("subject", { length: 255 }).notNull(),
  university: varchar("university", { length: 255 }),
  year: int("year"),
  description: text("description"),
  maxParticipants: int("maxParticipants").default(20).notNull(),
  isActive: boolean("isActive").default(true).notNull(),
  isPublic: boolean("isPublic").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type StudyRoomDB = typeof studyRooms.$inferSelect;
export type InsertStudyRoom = typeof studyRooms.$inferInsert;

/**
 * Study Room Participants — tracks who is in each study room.
 */
export const studyRoomParticipants = mysqlTable("study_room_participants", {
  id: int("id").autoincrement().primaryKey(),
  roomId: int("roomId").notNull(),
  userId: int("userId").notNull(),
  role: mysqlEnum("participantRole", ["owner", "moderator", "member"]).default("member").notNull(),
  joinedAt: timestamp("joinedAt").defaultNow().notNull(),
});

export type StudyRoomParticipant = typeof studyRoomParticipants.$inferSelect;

/**
 * Study Room Messages — chat messages in study rooms.
 */
export const studyRoomMessages = mysqlTable("study_room_messages", {
  id: int("id").autoincrement().primaryKey(),
  roomId: int("roomId").notNull(),
  userId: int("userId").notNull(),
  userName: varchar("userName", { length: 255 }).notNull(),
  content: text("content").notNull(),
  messageType: mysqlEnum("messageType", ["text", "note", "link", "file"]).default("text").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type StudyRoomMessage = typeof studyRoomMessages.$inferSelect;

/**
 * Shared Notes — collaborative notes in study rooms.
 */
export const sharedNotes = mysqlTable("shared_notes", {
  id: int("id").autoincrement().primaryKey(),
  roomId: int("roomId").notNull(),
  userId: int("userId").notNull(),
  userName: varchar("userName", { length: 255 }).notNull(),
  title: varchar("title", { length: 500 }).notNull(),
  content: text("content").notNull(),
  subject: varchar("subject", { length: 255 }),
  isPinned: boolean("isPinned").default(false).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type SharedNote = typeof sharedNotes.$inferSelect;

/**
 * Academic Calendar Events — exams, deadlines, study sessions.
 * Linked to subjects and materials for automatic revision suggestions.
 */
export const calendarEvents = mysqlTable("calendar_events", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  title: varchar("title", { length: 500 }).notNull(),
  description: text("description"),
  eventType: mysqlEnum("eventType", [
    "prova", "trabalho", "seminario", "pratica", "revisao", "simulado", "outro"
  ]).notNull(),
  subject: varchar("subject", { length: 255 }).notNull(),
  university: varchar("university", { length: 255 }),
  year: int("year"),
  eventDate: timestamp("eventDate").notNull(),
  reminderDays: int("reminderDays").default(3), // days before to start revision
  isCompleted: boolean("isCompleted").default(false).notNull(),
  linkedMaterialIds: text("linkedMaterialIds"), // JSON array of material IDs
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type CalendarEvent = typeof calendarEvents.$inferSelect;
export type InsertCalendarEvent = typeof calendarEvents.$inferInsert;

/**
 * Revision Suggestions — auto-generated revision plans before exams.
 */
export const revisionSuggestions = mysqlTable("revision_suggestions", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  calendarEventId: int("calendarEventId").notNull(),
  suggestedDate: timestamp("suggestedDate").notNull(),
  subject: varchar("subject", { length: 255 }).notNull(),
  revisionType: mysqlEnum("revisionType", [
    "leitura", "flashcards", "quiz", "resumo", "simulado"
  ]).notNull(),
  materialSuggestion: text("materialSuggestion"), // JSON with suggested materials
  isCompleted: boolean("isCompleted").default(false).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type RevisionSuggestion = typeof revisionSuggestions.$inferSelect;

/**
 * ENAMED/REVALIDA Simulados — exam simulations with question banks.
 */
export const simulados = mysqlTable("simulados", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  title: varchar("title", { length: 500 }).notNull(),
  examType: mysqlEnum("examType", ["enamed", "revalida", "residencia", "custom"]).notNull(),
  totalQuestions: int("totalQuestions").notNull(),
  timeLimit: int("timeLimit").notNull(), // minutes
  areas: text("areas").notNull(), // JSON array of medical areas
  status: mysqlEnum("simuladoStatus", ["in_progress", "completed", "abandoned"]).default("in_progress").notNull(),
  score: int("score"), // percentage 0-100
  correctAnswers: int("correctAnswers"),
  timeSpent: int("timeSpent"), // minutes actually spent
  startedAt: timestamp("startedAt").defaultNow().notNull(),
  completedAt: timestamp("completedAt"),
  results: text("results"), // JSON with detailed results per area
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Simulado = typeof simulados.$inferSelect;
export type InsertSimulado = typeof simulados.$inferInsert;

/**
 * Simulado Questions — individual questions for ENAMED/REVALIDA simulations.
 * Generated by AI based on real exam patterns.
 */
export const simuladoQuestions = mysqlTable("simulado_questions", {
  id: int("id").autoincrement().primaryKey(),
  area: varchar("area", { length: 128 }).notNull(), // Clínica Médica, Cirurgia, Pediatria, etc.
  subArea: varchar("subArea", { length: 128 }),
  difficulty: mysqlEnum("questionDifficulty", ["facil", "medio", "dificil"]).default("medio").notNull(),
  examType: mysqlEnum("questionExamType", ["enamed", "revalida", "residencia"]).default("enamed").notNull(),
  question: text("question").notNull(),
  options: text("options").notNull(), // JSON array of 5 options
  correctIndex: int("correctIndex").notNull(),
  explanation: text("explanation").notNull(),
  references: text("references"), // JSON array of references
  year: int("year"), // year the question was created/based on
  timesAnswered: int("timesAnswered").default(0).notNull(),
  timesCorrect: int("timesCorrect").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type SimuladoQuestion = typeof simuladoQuestions.$inferSelect;
export type InsertSimuladoQuestion = typeof simuladoQuestions.$inferInsert;

// ─── Weekly Goals ─────────────────────────────────────────────
export const weeklyGoals = mysqlTable("weekly_goals", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  weekStart: varchar("weekStart", { length: 10 }).notNull(), // YYYY-MM-DD (Monday)
  goalType: mysqlEnum("goalType", ["questions", "pomodoro_hours", "study_hours", "flashcards", "simulados"]).notNull(),
  targetValue: int("targetValue").notNull(),
  currentValue: int("currentValue").default(0).notNull(),
  completed: boolean("completed").default(false).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type WeeklyGoal = typeof weeklyGoals.$inferSelect;
export type InsertWeeklyGoal = typeof weeklyGoals.$inferInsert;

// ─── Leaderboard / XP System ──────────────────────────────────
export const userXP = mysqlTable("user_xp", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  totalXP: int("totalXP").default(0).notNull(),
  weeklyXP: int("weeklyXP").default(0).notNull(),
  monthlyXP: int("monthlyXP").default(0).notNull(),
  streak: int("streak").default(0).notNull(),
  longestStreak: int("longestStreak").default(0).notNull(),
  lastActiveDate: varchar("lastActiveDate", { length: 10 }), // YYYY-MM-DD
  simuladosCompleted: int("simuladosCompleted").default(0).notNull(),
  questionsAnswered: int("questionsAnswered").default(0).notNull(),
  correctAnswers: int("correctAnswers").default(0).notNull(),
  pomodoroMinutes: int("pomodoroMinutes").default(0).notNull(),
  flashcardsReviewed: int("flashcardsReviewed").default(0).notNull(),
  universityId: varchar("universityId", { length: 64 }),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type UserXP = typeof userXP.$inferSelect;
export type InsertUserXP = typeof userXP.$inferInsert;

// ─── XP Activity Log ──────────────────────────────────────────
export const xpActivities = mysqlTable("xp_activities", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  activityType: mysqlEnum("activityType", [
    "simulado_completed", "question_correct", "question_wrong",
    "pomodoro_completed", "flashcard_reviewed", "streak_bonus",
    "goal_completed", "daily_login", "material_reviewed"
  ]).notNull(),
  xpEarned: int("xpEarned").notNull(),
  description: text("description"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type XPActivity = typeof xpActivities.$inferSelect;
export type InsertXPActivity = typeof xpActivities.$inferInsert;

// ─── Clinical Cases (Casos Clínicos Interativos) ──────────────
export const clinicalCases = mysqlTable("clinical_cases", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  specialty: varchar("specialty", { length: 100 }).notNull(),
  title: varchar("title", { length: 500 }).notNull(),
  difficulty: mysqlEnum("caseDifficulty", ["easy", "medium", "hard"]).notNull().default("medium"),
  patientInfo: text("patientInfo").notNull(),
  conversationHistory: json("conversationHistory"),
  currentPhase: mysqlEnum("currentPhase", ["anamnesis", "physical_exam", "lab_tests", "hypothesis", "treatment", "completed"]).notNull().default("anamnesis"),
  finalDiagnosis: varchar("finalDiagnosis", { length: 500 }),
  score: int("score"),
  xpEarned: int("xpEarned"),
  completedAt: timestamp("completedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});
export type ClinicalCase = typeof clinicalCases.$inferSelect;
export type InsertClinicalCase = typeof clinicalCases.$inferInsert;

// ─── Question Battles (Modo Batalha) ──────────────────────────
export const questionBattles = mysqlTable("question_battles", {
  id: int("id").autoincrement().primaryKey(),
  challengerId: int("challengerId").notNull(),
  opponentId: int("opponentId"),
  inviteCode: varchar("inviteCode", { length: 20 }).notNull(),
  status: mysqlEnum("battleStatus", ["waiting", "active", "completed", "expired"]).notNull().default("waiting"),
  specialty: varchar("battleSpecialty", { length: 100 }),
  totalQuestions: int("totalQuestions").notNull().default(10),
  challengerScore: int("challengerScore").default(0),
  opponentScore: int("opponentScore").default(0),
  currentQuestionIndex: int("currentQuestionIndex").default(0),
  questionIds: json("questionIds"),
  challengerAnswers: json("challengerAnswers"),
  opponentAnswers: json("opponentAnswers"),
  winnerId: int("winnerId"),
  completedAt: timestamp("battleCompletedAt"),
  expiresAt: timestamp("expiresAt").notNull(),
  createdAt: timestamp("battleCreatedAt").defaultNow().notNull(),
});
export type QuestionBattle = typeof questionBattles.$inferSelect;
export type InsertQuestionBattle = typeof questionBattles.$inferInsert;

// ─── Smart Summaries (Resumos Inteligentes) ───────────────────
export const smartSummaries = mysqlTable("smart_summaries", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  topic: varchar("topic", { length: 500 }).notNull(),
  specialty: varchar("summarySpecialty", { length: 100 }),
  content: text("summaryContent").notNull(),
  mnemonics: json("mnemonics"),
  isPublic: boolean("isPublic").default(false),
  shareCode: varchar("shareCode", { length: 20 }),
  likes: int("summaryLikes").default(0),
  createdAt: timestamp("summaryCreatedAt").defaultNow().notNull(),
});
export type SmartSummary = typeof smartSummaries.$inferSelect;
export type InsertSmartSummary = typeof smartSummaries.$inferInsert;

// ─── Social Feed (Feed de Conquistas) ─────────────────────────
export const socialFeed = mysqlTable("social_feed", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  eventType: mysqlEnum("feedEventType", [
    "badge_earned", "simulado_completed", "streak_milestone",
    "clinical_case_solved", "battle_won", "level_up",
    "goal_completed", "summary_shared"
  ]).notNull(),
  title: varchar("feedTitle", { length: 300 }).notNull(),
  description: text("feedDescription"),
  metadata: json("feedMetadata"),
  likes: int("feedLikes").default(0),
  createdAt: timestamp("feedCreatedAt").defaultNow().notNull(),
});
export type SocialFeedItem = typeof socialFeed.$inferSelect;
export type InsertSocialFeedItem = typeof socialFeed.$inferInsert;

export const socialFeedLikes = mysqlTable("social_feed_likes", {
  id: int("id").autoincrement().primaryKey(),
  feedItemId: int("feedItemId").notNull(),
  userId: int("userId").notNull(),
  createdAt: timestamp("likeCreatedAt").defaultNow().notNull(),
});
export type SocialFeedLike = typeof socialFeedLikes.$inferSelect;

export const socialFeedComments = mysqlTable("social_feed_comments", {
  id: int("id").autoincrement().primaryKey(),
  feedItemId: int("commentFeedItemId").notNull(),
  userId: int("commentUserId").notNull(),
  content: text("commentContent").notNull(),
  createdAt: timestamp("commentCreatedAt").defaultNow().notNull(),
});
export type SocialFeedComment = typeof socialFeedComments.$inferSelect;


// ─── Flashcard Decks & Cards (SM-2 Spaced Repetition) ───────────
export const flashcardDecks = mysqlTable("flashcard_decks", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  title: varchar("deckTitle", { length: 255 }).notNull(),
  subject: varchar("deckSubject", { length: 100 }).notNull(),
  description: text("deckDescription"),
  cardCount: int("cardCount").default(0).notNull(),
  sourceSummaryId: int("sourceSummaryId"),
  isPublic: tinyint("deckIsPublic").default(0).notNull(),
  createdAt: timestamp("deckCreatedAt").defaultNow().notNull(),
  updatedAt: timestamp("deckUpdatedAt").defaultNow().notNull(),
});
export type FlashcardDeck = typeof flashcardDecks.$inferSelect;

export const flashcardCards = mysqlTable("flashcard_cards", {
  id: int("id").autoincrement().primaryKey(),
  deckId: int("deckId").notNull(),
  front: text("cardFront").notNull(),
  back: text("cardBack").notNull(),
  difficulty: varchar("cardDifficulty", { length: 20 }).default("medium").notNull(),
  easeFactor: double("easeFactor").default(2.5).notNull(),
  interval: int("sm2Interval").default(0).notNull(),
  repetitions: int("repetitions").default(0).notNull(),
  nextReviewDate: timestamp("nextReviewDate").defaultNow().notNull(),
  lastReviewDate: timestamp("lastReviewDate"),
  createdAt: timestamp("cardCreatedAt").defaultNow().notNull(),
});
export type FlashcardCard = typeof flashcardCards.$inferSelect;

// ─── Exam Calendar ──────────────────────────────────────────────
export const examCalendar = mysqlTable("exam_calendar", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("examUserId").notNull(),
  title: varchar("examTitle", { length: 255 }).notNull(),
  examType: varchar("examType", { length: 50 }).notNull(),
  examDate: timestamp("examDate").notNull(),
  description: text("examDescription"),
  subjects: text("examSubjects"),
  importance: varchar("importance", { length: 20 }).default("high").notNull(),
  reminderDays: int("reminderDays").default(7).notNull(),
  isCompleted: tinyint("examIsCompleted").default(0).notNull(),
  createdAt: timestamp("examCreatedAt").defaultNow().notNull(),
});
export type ExamCalendarEntry = typeof examCalendar.$inferSelect;

export const studySuggestions = mysqlTable("study_suggestions", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("suggUserId").notNull(),
  examId: int("examId").notNull(),
  suggestionType: varchar("suggestionType", { length: 50 }).notNull(),
  title: varchar("suggestionTitle", { length: 255 }).notNull(),
  description: text("suggestionDescription"),
  subject: varchar("suggestionSubject", { length: 100 }),
  priority: int("priority").default(0).notNull(),
  isCompleted: tinyint("suggestionCompleted").default(0).notNull(),
  suggestedDate: timestamp("suggestedDate").notNull(),
  createdAt: timestamp("suggestionCreatedAt").defaultNow().notNull(),
});
export type StudySuggestion = typeof studySuggestions.$inferSelect;


// ─── Video Lessons (Vídeo-Aulas Colaborativas) ──────────────────
export const videoLessons = mysqlTable("video_lessons", {
  id: int("id").autoincrement().primaryKey(),
  title: varchar("videoTitle", { length: 500 }).notNull(),
  description: text("videoDescription"),
  discipline: varchar("discipline", { length: 128 }).notNull(),
  professor: varchar("professor", { length: 255 }).notNull(),
  professorId: int("professorId"), // linked to users table
  duration: varchar("videoDuration", { length: 16 }), // e.g. "45:00"
  year: int("videoYear").notNull(), // medical year 1-6
  semester: int("videoSemester").default(1).notNull(),
  topics: text("videoTopics"), // JSON array of topic strings
  difficulty: mysqlEnum("videoDifficulty", ["basico", "intermediario", "avancado"]).default("intermediario").notNull(),
  
  // Video file info
  videoUrl: text("videoUrl"), // GCS or external URL
  thumbnailUrl: text("thumbnailUrl"),
  fileSize: int("fileSize"), // bytes
  mimeType: varchar("mimeType", { length: 64 }),
  
  // Approval workflow
  status: mysqlEnum("videoStatus", ["pending", "approved", "rejected", "archived"]).default("pending").notNull(),
  reviewedBy: int("reviewedBy"),
  reviewNotes: text("reviewNotes"),
  reviewedAt: timestamp("reviewedAt"),
  
  // Engagement metrics
  views: int("videoViews").default(0).notNull(),
  likes: int("videoLikes").default(0).notNull(),
  rating: int("videoRating"), // avg 0-50 (x10)
  ratingCount: int("ratingCount").default(0).notNull(),
  
  // Metadata
  tags: text("videoTags"), // JSON array
  externalLink: text("externalLink"), // YouTube, Vimeo, etc.
  
  createdAt: timestamp("videoCreatedAt").defaultNow().notNull(),
  updatedAt: timestamp("videoUpdatedAt").defaultNow().onUpdateNow().notNull(),
});

export type VideoLesson = typeof videoLessons.$inferSelect;
export type InsertVideoLesson = typeof videoLessons.$inferInsert;

// ─── Video Ratings ──────────────────────────────────────────────
export const videoRatings = mysqlTable("video_ratings", {
  id: int("id").autoincrement().primaryKey(),
  videoId: int("videoId").notNull(),
  userId: int("ratingUserId").notNull(),
  rating: int("userRating").notNull(), // 1-5
  comment: text("ratingComment"),
  createdAt: timestamp("ratingCreatedAt").defaultNow().notNull(),
});

export type VideoRating = typeof videoRatings.$inferSelect;

// ─── Video Notes (per user per video) ───────────────────────────
export const videoNotes = mysqlTable("video_notes", {
  id: int("id").autoincrement().primaryKey(),
  videoId: int("noteVideoId").notNull(),
  userId: int("noteUserId").notNull(),
  content: text("noteContent").notNull(),
  timestamp: int("noteTimestamp"), // seconds into video
  updatedAt: timestamp("noteUpdatedAt").defaultNow().onUpdateNow().notNull(),
  createdAt: timestamp("noteCreatedAt").defaultNow().notNull(),
});

export type VideoNote = typeof videoNotes.$inferSelect;
