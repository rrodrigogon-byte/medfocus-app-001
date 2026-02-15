/**
 * Database Service
 * SQLite for development/MVP, prepared for PostgreSQL migration
 */
import Database from "better-sqlite3";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.join(__dirname, "..", "data", "medfocus.db");
let db: Database.Database;

export function getDatabase(): Database.Database {
  if (!db) {
    throw new Error("Database not initialized. Call initializeDatabase() first.");
  }
  return db;
}

export async function initializeDatabase(): Promise<void> {
  console.log("📦 Initializing database...");
  
  db = new Database(dbPath, { verbose: console.log });
  
  // Enable foreign keys
  db.pragma("foreign_keys = ON");
  
  // Create tables
  createTables();
  
  console.log("✅ Database initialized successfully");
}

function createTables(): void {
  // Users table
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      name TEXT NOT NULL,
      role TEXT CHECK(role IN ('student', 'professor', 'coordinator', 'admin')) DEFAULT 'student',
      university_id TEXT,
      department TEXT,
      specialties TEXT, -- JSON array
      current_year INTEGER,
      verified_credentials BOOLEAN DEFAULT 0,
      lattes_url TEXT,
      orcid TEXT,
      google_scholar TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      last_login DATETIME
    )
  `);

  // Classrooms table
  db.exec(`
    CREATE TABLE IF NOT EXISTS classrooms (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      description TEXT,
      code TEXT UNIQUE NOT NULL,
      professor_id TEXT NOT NULL,
      university_id TEXT NOT NULL,
      course TEXT NOT NULL,
      year INTEGER NOT NULL,
      semester INTEGER NOT NULL,
      academic_year TEXT NOT NULL,
      is_public BOOLEAN DEFAULT 1,
      max_students INTEGER,
      enrollment_open BOOLEAN DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (professor_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `);

  // Classroom enrollments
  db.exec(`
    CREATE TABLE IF NOT EXISTS classroom_enrollments (
      id TEXT PRIMARY KEY,
      classroom_id TEXT NOT NULL,
      student_id TEXT NOT NULL,
      enrolled_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      status TEXT CHECK(status IN ('active', 'dropped', 'completed')) DEFAULT 'active',
      FOREIGN KEY (classroom_id) REFERENCES classrooms(id) ON DELETE CASCADE,
      FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE,
      UNIQUE(classroom_id, student_id)
    )
  `);

  // Materials table
  db.exec(`
    CREATE TABLE IF NOT EXISTS materials (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      description TEXT,
      type TEXT NOT NULL,
      content_url TEXT,
      thumbnail_url TEXT,
      university_id TEXT NOT NULL,
      course TEXT NOT NULL,
      year INTEGER NOT NULL,
      semester INTEGER NOT NULL,
      academic_year TEXT,
      subject_id TEXT NOT NULL,
      subject_name TEXT NOT NULL,
      module TEXT,
      tags TEXT, -- JSON array
      language TEXT DEFAULT 'pt-BR',
      uploaded_by TEXT NOT NULL,
      tier TEXT CHECK(tier IN ('validated', 'community', 'experimental')) DEFAULT 'experimental',
      quality_score INTEGER DEFAULT 50,
      downloads INTEGER DEFAULT 0,
      views INTEGER DEFAULT 0,
      rating REAL,
      verified BOOLEAN DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (uploaded_by) REFERENCES users(id)
    )
  `);

  // Material validations
  db.exec(`
    CREATE TABLE IF NOT EXISTS material_validations (
      id TEXT PRIMARY KEY,
      material_id TEXT NOT NULL,
      validator_id TEXT NOT NULL,
      status TEXT CHECK(status IN ('approved', 'rejected', 'revision_requested')) NOT NULL,
      comments TEXT,
      quality_score INTEGER,
      validated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (material_id) REFERENCES materials(id) ON DELETE CASCADE,
      FOREIGN KEY (validator_id) REFERENCES users(id),
      UNIQUE(material_id, validator_id)
    )
  `);

  // Academic references
  db.exec(`
    CREATE TABLE IF NOT EXISTS academic_references (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      authors TEXT NOT NULL, -- JSON array
      source TEXT NOT NULL,
      year INTEGER NOT NULL,
      doi TEXT,
      pmid TEXT,
      isbn TEXT,
      url TEXT,
      quality TEXT CHECK(quality IN ('gold', 'silver', 'bronze')) DEFAULT 'bronze',
      citation_count INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Material references (many-to-many)
  db.exec(`
    CREATE TABLE IF NOT EXISTS material_references (
      material_id TEXT NOT NULL,
      reference_id TEXT NOT NULL,
      PRIMARY KEY (material_id, reference_id),
      FOREIGN KEY (material_id) REFERENCES materials(id) ON DELETE CASCADE,
      FOREIGN KEY (reference_id) REFERENCES academic_references(id) ON DELETE CASCADE
    )
  `);

  // Quizzes table
  db.exec(`
    CREATE TABLE IF NOT EXISTS quizzes (
      id TEXT PRIMARY KEY,
      material_id TEXT,
      classroom_id TEXT,
      title TEXT NOT NULL,
      description TEXT,
      target_year INTEGER NOT NULL,
      difficulty TEXT CHECK(difficulty IN ('basico', 'intermediario', 'avancado', 'residencia')),
      topics TEXT, -- JSON array
      time_limit INTEGER, -- seconds
      passing_score INTEGER DEFAULT 70,
      created_by TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (material_id) REFERENCES materials(id) ON DELETE SET NULL,
      FOREIGN KEY (classroom_id) REFERENCES classrooms(id) ON DELETE CASCADE,
      FOREIGN KEY (created_by) REFERENCES users(id)
    )
  `);

  // Quiz questions
  db.exec(`
    CREATE TABLE IF NOT EXISTS quiz_questions (
      id TEXT PRIMARY KEY,
      quiz_id TEXT NOT NULL,
      question TEXT NOT NULL,
      options TEXT NOT NULL, -- JSON array
      correct_index INTEGER NOT NULL,
      explanation TEXT NOT NULL,
      bloom_level TEXT CHECK(bloom_level IN ('conhecimento', 'compreensao', 'aplicacao', 'analise', 'sintese', 'avaliacao')),
      estimated_time INTEGER, -- seconds
      order_index INTEGER NOT NULL,
      FOREIGN KEY (quiz_id) REFERENCES quizzes(id) ON DELETE CASCADE
    )
  `);

  // Quiz attempts
  db.exec(`
    CREATE TABLE IF NOT EXISTS quiz_attempts (
      id TEXT PRIMARY KEY,
      quiz_id TEXT NOT NULL,
      student_id TEXT NOT NULL,
      score REAL NOT NULL,
      correct_count INTEGER NOT NULL,
      total_questions INTEGER NOT NULL,
      time_spent INTEGER, -- seconds
      answers TEXT NOT NULL, -- JSON array
      started_at DATETIME NOT NULL,
      completed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (quiz_id) REFERENCES quizzes(id) ON DELETE CASCADE,
      FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `);

  // Announcements
  db.exec(`
    CREATE TABLE IF NOT EXISTS announcements (
      id TEXT PRIMARY KEY,
      classroom_id TEXT NOT NULL,
      title TEXT NOT NULL,
      content TEXT NOT NULL,
      created_by TEXT NOT NULL,
      is_pinned BOOLEAN DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (classroom_id) REFERENCES classrooms(id) ON DELETE CASCADE,
      FOREIGN KEY (created_by) REFERENCES users(id)
    )
  `);

  // Assignments
  db.exec(`
    CREATE TABLE IF NOT EXISTS assignments (
      id TEXT PRIMARY KEY,
      classroom_id TEXT NOT NULL,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      due_date DATETIME NOT NULL,
      max_score REAL DEFAULT 100,
      material_ids TEXT, -- JSON array
      created_by TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (classroom_id) REFERENCES classrooms(id) ON DELETE CASCADE,
      FOREIGN KEY (created_by) REFERENCES users(id)
    )
  `);

  // Assignment submissions
  db.exec(`
    CREATE TABLE IF NOT EXISTS assignment_submissions (
      id TEXT PRIMARY KEY,
      assignment_id TEXT NOT NULL,
      student_id TEXT NOT NULL,
      content TEXT NOT NULL,
      attachments TEXT, -- JSON array
      submitted_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      score REAL,
      feedback TEXT,
      reviewed_by TEXT,
      reviewed_at DATETIME,
      FOREIGN KEY (assignment_id) REFERENCES assignments(id) ON DELETE CASCADE,
      FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (reviewed_by) REFERENCES users(id),
      UNIQUE(assignment_id, student_id)
    )
  `);

  // Discussions/Forum
  db.exec(`
    CREATE TABLE IF NOT EXISTS discussion_threads (
      id TEXT PRIMARY KEY,
      classroom_id TEXT,
      material_id TEXT,
      title TEXT NOT NULL,
      content TEXT NOT NULL,
      created_by TEXT NOT NULL,
      is_pinned BOOLEAN DEFAULT 0,
      is_resolved BOOLEAN DEFAULT 0,
      views INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (classroom_id) REFERENCES classrooms(id) ON DELETE CASCADE,
      FOREIGN KEY (material_id) REFERENCES materials(id) ON DELETE CASCADE,
      FOREIGN KEY (created_by) REFERENCES users(id)
    )
  `);

  // Discussion replies
  db.exec(`
    CREATE TABLE IF NOT EXISTS discussion_replies (
      id TEXT PRIMARY KEY,
      thread_id TEXT NOT NULL,
      parent_reply_id TEXT, -- for nested replies
      content TEXT NOT NULL,
      created_by TEXT NOT NULL,
      is_accepted_answer BOOLEAN DEFAULT 0,
      likes INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (thread_id) REFERENCES discussion_threads(id) ON DELETE CASCADE,
      FOREIGN KEY (parent_reply_id) REFERENCES discussion_replies(id) ON DELETE CASCADE,
      FOREIGN KEY (created_by) REFERENCES users(id)
    )
  `);

  // Notifications
  db.exec(`
    CREATE TABLE IF NOT EXISTS notifications (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      type TEXT NOT NULL,
      title TEXT NOT NULL,
      message TEXT NOT NULL,
      link TEXT,
      is_read BOOLEAN DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `);

  // Analytics events
  db.exec(`
    CREATE TABLE IF NOT EXISTS analytics_events (
      id TEXT PRIMARY KEY,
      user_id TEXT,
      event_type TEXT NOT NULL,
      event_data TEXT, -- JSON
      ip_address TEXT,
      user_agent TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
    )
  `);

  // Create indexes for performance
  db.exec(`
    CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
    CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
    CREATE INDEX IF NOT EXISTS idx_classrooms_professor ON classrooms(professor_id);
    CREATE INDEX IF NOT EXISTS idx_classrooms_code ON classrooms(code);
    CREATE INDEX IF NOT EXISTS idx_materials_subject ON materials(subject_id);
    CREATE INDEX IF NOT EXISTS idx_materials_tier ON materials(tier);
    CREATE INDEX IF NOT EXISTS idx_materials_uploaded_by ON materials(uploaded_by);
    CREATE INDEX IF NOT EXISTS idx_quiz_attempts_student ON quiz_attempts(student_id);
    CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id, is_read);
    CREATE INDEX IF NOT EXISTS idx_analytics_events_user ON analytics_events(user_id);
    CREATE INDEX IF NOT EXISTS idx_analytics_events_type ON analytics_events(event_type);
  `);
}

export default {
  getDatabase,
  initializeDatabase,
};
