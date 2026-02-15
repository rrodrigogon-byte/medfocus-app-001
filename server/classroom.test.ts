import { describe, expect, it, beforeAll } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createAuthContext(userId = 1, role: "user" | "admin" = "user"): TrpcContext {
  const user: AuthenticatedUser = {
    id: userId,
    openId: `user-${userId}`,
    email: `user${userId}@example.com`,
    name: `User ${userId}`,
    loginMethod: "manus",
    role,
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };

  return {
    user,
    req: {
      protocol: "https",
      headers: { origin: "http://localhost:3000" },
    } as TrpcContext["req"],
    res: {
      clearCookie: () => {},
    } as TrpcContext["res"],
  };
}

describe("classroom router", () => {
  describe("classroom.create", () => {
    it("creates a classroom and returns it with a code", async () => {
      const ctx = createAuthContext(1, "admin");
      const caller = appRouter.createCaller(ctx);

      const room = await caller.classroom.create({
        name: "Anatomia Humana - Turma A",
        subject: "Anatomia",
        year: 1,
        semester: 1,
        university: "USP",
        description: "Turma de anatomia do 1º ano",
        maxStudents: 60,
      });

      expect(room).toBeDefined();
      expect(room.name).toBe("Anatomia Humana - Turma A");
      expect(room.subject).toBe("Anatomia");
      expect(room.code).toBeDefined();
      expect(room.code.length).toBeGreaterThanOrEqual(6);
      expect(room.isActive).toBe(true);
    });

    it("rejects short names", async () => {
      const ctx = createAuthContext(1, "admin");
      const caller = appRouter.createCaller(ctx);

      await expect(
        caller.classroom.create({
          name: "AB",
          subject: "Anatomia",
          year: 1,
          semester: 1,
          university: "USP",
        })
      ).rejects.toThrow();
    });
  });

  describe("classroom.myClassrooms", () => {
    it("returns asProfessor and asStudent arrays", async () => {
      const ctx = createAuthContext(1);
      const caller = appRouter.createCaller(ctx);

      const result = await caller.classroom.myClassrooms();

      expect(result).toHaveProperty("asProfessor");
      expect(result).toHaveProperty("asStudent");
      expect(Array.isArray(result.asProfessor)).toBe(true);
      expect(Array.isArray(result.asStudent)).toBe(true);
    });
  });

  describe("classroom.join", () => {
    it("rejects invalid codes", async () => {
      const ctx = createAuthContext(2);
      const caller = appRouter.createCaller(ctx);

      await expect(
        caller.classroom.join({ code: "INVALID_CODE_123" })
      ).rejects.toThrow();
    });
  });

  describe("classroom.createActivity", () => {
    it("rejects short titles", async () => {
      const ctx = createAuthContext(1, "admin");
      const caller = appRouter.createCaller(ctx);

      await expect(
        caller.classroom.createActivity({
          classroomId: 999999,
          title: "AB",
          type: "quiz",
        })
      ).rejects.toThrow();
    });
  });

  describe("classroom.analytics", () => {
    it("returns analytics structure for a valid classroom", async () => {
      // First create a classroom
      const ctx = createAuthContext(1, "admin");
      const caller = appRouter.createCaller(ctx);

      const room = await caller.classroom.create({
        name: "Test Analytics Room",
        subject: "Fisiologia",
        year: 2,
        semester: 1,
        university: "UNICAMP",
      });

      const analytics = await caller.classroom.analytics({ classroomId: room.id });

      expect(analytics).toHaveProperty("enrolledStudents");
      expect(analytics).toHaveProperty("totalActivities");
      expect(analytics).toHaveProperty("activeActivities");
      expect(analytics).toHaveProperty("totalSubmissions");
      expect(analytics).toHaveProperty("gradedSubmissions");
      expect(analytics).toHaveProperty("avgScore");
      expect(analytics).toHaveProperty("completionRate");
      expect(analytics).toHaveProperty("atRiskStudents");
      expect(typeof analytics.enrolledStudents).toBe("number");
      expect(typeof analytics.completionRate).toBe("number");
      expect(Array.isArray(analytics.atRiskStudents)).toBe(true);
    });
  });

  describe("classroom.getById", () => {
    it("throws NOT_FOUND for non-existent classroom", async () => {
      const ctx = createAuthContext(1);
      const caller = appRouter.createCaller(ctx);

      await expect(
        caller.classroom.getById({ id: 999999 })
      ).rejects.toThrow("Sala não encontrada");
    });
  });
});
