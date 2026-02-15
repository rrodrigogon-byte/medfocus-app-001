/**
 * Classroom Routes
 * Complete classroom management system:
 * - Create and manage classrooms
 * - Student enrollment
 * - Announcements
 * - Assignments and submissions
 * - Grade management
 */
import { Router } from "express";
import { nanoid } from "nanoid";
import { getDatabase } from "../services/database.js";
import { AuthRequest, requireProfessor } from "../middleware/auth.js";
import { createError } from "../middleware/errorHandler.js";

export const classroomRouter = Router();

/**
 * GET /api/classrooms
 * Get all classrooms (filtered by role)
 */
classroomRouter.get("/", async (req: AuthRequest, res, next) => {
  try {
    const db = getDatabase();
    const user = req.user!;

    let classrooms;

    if (user.role === "student") {
      // Get classrooms where student is enrolled
      classrooms = db.prepare(`
        SELECT c.*, u.name as professor_name,
               (SELECT COUNT(*) FROM classroom_enrollments WHERE classroom_id = c.id AND status = 'active') as student_count
        FROM classrooms c
        JOIN users u ON c.professor_id = u.id
        JOIN classroom_enrollments e ON c.id = e.classroom_id
        WHERE e.student_id = ? AND e.status = 'active'
        ORDER BY c.created_at DESC
      `).all(user.id);
    } else if (user.role === "professor" || user.role === "coordinator") {
      // Get classrooms created by this professor
      classrooms = db.prepare(`
        SELECT c.*, u.name as professor_name,
               (SELECT COUNT(*) FROM classroom_enrollments WHERE classroom_id = c.id AND status = 'active') as student_count
        FROM classrooms c
        JOIN users u ON c.professor_id = u.id
        WHERE c.professor_id = ?
        ORDER BY c.created_at DESC
      `).all(user.id);
    } else {
      // Admin: get all classrooms
      classrooms = db.prepare(`
        SELECT c.*, u.name as professor_name,
               (SELECT COUNT(*) FROM classroom_enrollments WHERE classroom_id = c.id AND status = 'active') as student_count
        FROM classrooms c
        JOIN users u ON c.professor_id = u.id
        ORDER BY c.created_at DESC
      `).all();
    }

    res.json({
      success: true,
      classrooms,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/classrooms/discover
 * Discover public classrooms for enrollment
 */
classroomRouter.get("/discover", async (req: AuthRequest, res, next) => {
  try {
    const db = getDatabase();
    const { universityId, year, semester, subject } = req.query;

    let query = `
      SELECT c.*, u.name as professor_name,
             (SELECT COUNT(*) FROM classroom_enrollments WHERE classroom_id = c.id AND status = 'active') as student_count
      FROM classrooms c
      JOIN users u ON c.professor_id = u.id
      WHERE c.is_public = 1 AND c.enrollment_open = 1
    `;

    const params: any[] = [];

    if (universityId) {
      query += " AND c.university_id = ?";
      params.push(universityId);
    }
    if (year) {
      query += " AND c.year = ?";
      params.push(Number(year));
    }
    if (semester) {
      query += " AND c.semester = ?";
      params.push(Number(semester));
    }

    query += " ORDER BY student_count DESC, c.created_at DESC LIMIT 50";

    const classrooms = db.prepare(query).all(...params);

    res.json({
      success: true,
      classrooms,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/classrooms
 * Create a new classroom (professor only)
 */
classroomRouter.post("/", requireProfessor, async (req: AuthRequest, res, next) => {
  try {
    const {
      name,
      description,
      universityId,
      course,
      year,
      semester,
      academicYear,
      isPublic = true,
      maxStudents,
    } = req.body;

    if (!name || !universityId || !course || !year || !semester || !academicYear) {
      throw createError("Missing required fields", 400);
    }

    const db = getDatabase();
    const classroomId = nanoid();
    const code = nanoid(8).toUpperCase();

    db.prepare(`
      INSERT INTO classrooms (
        id, name, description, code, professor_id, university_id,
        course, year, semester, academic_year, is_public, max_students, enrollment_open
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1)
    `).run(
      classroomId,
      name,
      description || null,
      code,
      req.user!.id,
      universityId,
      course,
      year,
      semester,
      academicYear,
      isPublic ? 1 : 0,
      maxStudents || null
    );

    const classroom = db.prepare("SELECT * FROM classrooms WHERE id = ?").get(classroomId);

    // Notify WebSocket
    const wsService = (req.app as any).get("wsService");
    wsService.notifyRole("student", {
      type: "new-classroom",
      title: "Nova Turma Disponível",
      message: `${name} - ${course} (${year}º ano)`,
      link: `/classrooms/${classroomId}`,
    });

    res.status(201).json({
      success: true,
      classroom,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/classrooms/:id
 * Get classroom details
 */
classroomRouter.get("/:id", async (req: AuthRequest, res, next) => {
  try {
    const db = getDatabase();
    const { id } = req.params;

    const classroom = db.prepare(`
      SELECT c.*, u.name as professor_name, u.email as professor_email
      FROM classrooms c
      JOIN users u ON c.professor_id = u.id
      WHERE c.id = ?
    `).get(id) as any;

    if (!classroom) {
      throw createError("Classroom not found", 404);
    }

    // Check access
    if (classroom.professor_id !== req.user!.id && req.user!.role !== "admin") {
      const enrollment = db.prepare(`
        SELECT id FROM classroom_enrollments
        WHERE classroom_id = ? AND student_id = ? AND status = 'active'
      `).get(id, req.user!.id);

      if (!enrollment && !classroom.is_public) {
        throw createError("Access denied", 403);
      }
    }

    // Get enrolled students count
    const stats = db.prepare(`
      SELECT COUNT(*) as student_count
      FROM classroom_enrollments
      WHERE classroom_id = ? AND status = 'active'
    `).get(id) as any;

    res.json({
      success: true,
      classroom: {
        ...classroom,
        studentCount: stats.student_count,
      },
    });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/classrooms/:id/enroll
 * Enroll in a classroom
 */
classroomRouter.post("/:id/enroll", async (req: AuthRequest, res, next) => {
  try {
    const db = getDatabase();
    const { id } = req.params;

    if (req.user!.role !== "student") {
      throw createError("Only students can enroll in classrooms", 403);
    }

    const classroom = db.prepare("SELECT * FROM classrooms WHERE id = ?").get(id) as any;

    if (!classroom) {
      throw createError("Classroom not found", 404);
    }

    if (!classroom.enrollment_open) {
      throw createError("Enrollment is closed for this classroom", 403);
    }

    // Check if already enrolled
    const existing = db.prepare(`
      SELECT id FROM classroom_enrollments
      WHERE classroom_id = ? AND student_id = ?
    `).get(id, req.user!.id);

    if (existing) {
      throw createError("Already enrolled in this classroom", 409);
    }

    // Check max students
    if (classroom.max_students) {
      const count = db.prepare(`
        SELECT COUNT(*) as count FROM classroom_enrollments
        WHERE classroom_id = ? AND status = 'active'
      `).get(id) as any;

      if (count.count >= classroom.max_students) {
        throw createError("Classroom is full", 403);
      }
    }

    // Enroll student
    const enrollmentId = nanoid();
    db.prepare(`
      INSERT INTO classroom_enrollments (id, classroom_id, student_id, status)
      VALUES (?, ?, ?, 'active')
    `).run(enrollmentId, id, req.user!.id);

    // Notify professor
    const wsService = (req.app as any).get("wsService");
    const student = db.prepare("SELECT name FROM users WHERE id = ?").get(req.user!.id) as any;
    
    wsService.notifyUser(classroom.professor_id, {
      type: "enrollment",
      title: "Nova Matrícula",
      message: `${student.name} se matriculou em ${classroom.name}`,
      link: `/classrooms/${id}`,
    });

    res.json({
      success: true,
      message: "Successfully enrolled",
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/classrooms/:id/students
 * Get enrolled students
 */
classroomRouter.get("/:id/students", async (req: AuthRequest, res, next) => {
  try {
    const db = getDatabase();
    const { id } = req.params;

    // Check access
    const classroom = db.prepare("SELECT professor_id FROM classrooms WHERE id = ?").get(id) as any;
    
    if (!classroom) {
      throw createError("Classroom not found", 404);
    }

    if (classroom.professor_id !== req.user!.id && req.user!.role !== "admin") {
      throw createError("Access denied", 403);
    }

    const students = db.prepare(`
      SELECT u.id, u.name, u.email, u.current_year, e.enrolled_at, e.status
      FROM classroom_enrollments e
      JOIN users u ON e.student_id = u.id
      WHERE e.classroom_id = ?
      ORDER BY e.enrolled_at DESC
    `).all(id);

    res.json({
      success: true,
      students,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * DELETE /api/classrooms/:id/students/:studentId
 * Remove student from classroom
 */
classroomRouter.delete("/:id/students/:studentId", requireProfessor, async (req: AuthRequest, res, next) => {
  try {
    const db = getDatabase();
    const { id, studentId } = req.params;

    // Check if professor owns classroom
    const classroom = db.prepare("SELECT professor_id FROM classrooms WHERE id = ?").get(id) as any;
    
    if (!classroom) {
      throw createError("Classroom not found", 404);
    }

    if (classroom.professor_id !== req.user!.id && req.user!.role !== "admin") {
      throw createError("Access denied", 403);
    }

    db.prepare(`
      UPDATE classroom_enrollments
      SET status = 'dropped'
      WHERE classroom_id = ? AND student_id = ?
    `).run(id, studentId);

    res.json({
      success: true,
      message: "Student removed from classroom",
    });
  } catch (error) {
    next(error);
  }
});

/**
 * PATCH /api/classrooms/:id
 * Update classroom
 */
classroomRouter.patch("/:id", requireProfessor, async (req: AuthRequest, res, next) => {
  try {
    const db = getDatabase();
    const { id } = req.params;
    const { name, description, isPublic, enrollmentOpen, maxStudents } = req.body;

    // Check ownership
    const classroom = db.prepare("SELECT professor_id FROM classrooms WHERE id = ?").get(id) as any;
    
    if (!classroom) {
      throw createError("Classroom not found", 404);
    }

    if (classroom.professor_id !== req.user!.id && req.user!.role !== "admin") {
      throw createError("Access denied", 403);
    }

    const updates: string[] = [];
    const values: any[] = [];

    if (name !== undefined) {
      updates.push("name = ?");
      values.push(name);
    }
    if (description !== undefined) {
      updates.push("description = ?");
      values.push(description);
    }
    if (isPublic !== undefined) {
      updates.push("is_public = ?");
      values.push(isPublic ? 1 : 0);
    }
    if (enrollmentOpen !== undefined) {
      updates.push("enrollment_open = ?");
      values.push(enrollmentOpen ? 1 : 0);
    }
    if (maxStudents !== undefined) {
      updates.push("max_students = ?");
      values.push(maxStudents);
    }

    if (updates.length > 0) {
      updates.push("updated_at = CURRENT_TIMESTAMP");
      values.push(id);

      db.prepare(`
        UPDATE classrooms
        SET ${updates.join(", ")}
        WHERE id = ?
      `).run(...values);
    }

    res.json({
      success: true,
      message: "Classroom updated successfully",
    });
  } catch (error) {
    next(error);
  }
});

/**
 * DELETE /api/classrooms/:id
 * Delete classroom
 */
classroomRouter.delete("/:id", requireProfessor, async (req: AuthRequest, res, next) => {
  try {
    const db = getDatabase();
    const { id } = req.params;

    // Check ownership
    const classroom = db.prepare("SELECT professor_id FROM classrooms WHERE id = ?").get(id) as any;
    
    if (!classroom) {
      throw createError("Classroom not found", 404);
    }

    if (classroom.professor_id !== req.user!.id && req.user!.role !== "admin") {
      throw createError("Access denied", 403);
    }

    db.prepare("DELETE FROM classrooms WHERE id = ?").run(id);

    res.json({
      success: true,
      message: "Classroom deleted successfully",
    });
  } catch (error) {
    next(error);
  }
});
