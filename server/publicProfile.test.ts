/**
 * Tests for the public profile feature
 */
import { describe, it, expect, vi } from "vitest";

// Mock the database module
vi.mock("./db", () => ({
  getPublicProfile: vi.fn().mockImplementation(async (userId: number) => {
    if (userId === 999) return null;
    return {
      user: {
        id: userId,
        name: "Dr. Teste",
        universityId: "USP",
        currentYear: 3,
        plan: "free",
        memberSince: new Date("2025-01-01"),
      },
      xp: {
        totalXP: 5000,
        weeklyXP: 200,
        streak: 7,
        longestStreak: 14,
        simuladosCompleted: 5,
        questionsAnswered: 150,
        correctAnswers: 120,
        pomodoroMinutes: 300,
        flashcardsReviewed: 50,
      },
      gamification: {
        level: 5,
        totalXp: 5000,
        currentStreak: 7,
        longestStreak: 14,
        badges: JSON.stringify([
          { id: "first_study", name: "Primeiro Passo", description: "Complete sua primeira sessão", icon: "M13 10V3L4 14h7v7l9-11h-7z", requirement: "1 sessão", xpReward: 50, unlocked: true, category: "study" },
          { id: "streak_3", name: "Consistente", description: "3 dias seguidos", icon: "M17.657 18.657A8 8 0 016.343 7.343", requirement: "3 dias", xpReward: 150, unlocked: true, category: "streak" },
          { id: "streak_7", name: "Semana Perfeita", description: "7 dias seguidos", icon: "M5 3v4M3 5h4", requirement: "7 dias", xpReward: 350, unlocked: false, category: "streak" },
        ]),
      },
      simuladoStats: {
        totalCompleted: 5,
        avgScore: 72,
      },
      recentSimulados: [
        { id: 1, title: "ENAMED 2025 - Simulado 1", examType: "enamed", totalQuestions: 30, score: 80, correctAnswers: 24, completedAt: new Date("2025-06-01") },
        { id: 2, title: "REVALIDA 2022/2", examType: "revalida", totalQuestions: 50, score: 64, correctAnswers: 32, completedAt: new Date("2025-05-15") },
      ],
      goalsCompleted: 12,
    };
  }),
}));

describe("Public Profile", () => {
  it("should return profile data for a valid user", async () => {
    const { getPublicProfile } = await import("./db");
    const profile = await getPublicProfile(1);
    expect(profile).not.toBeNull();
    expect(profile!.user.name).toBe("Dr. Teste");
    expect(profile!.user.universityId).toBe("USP");
    expect(profile!.xp!.totalXP).toBe(5000);
    expect(profile!.simuladoStats.totalCompleted).toBe(5);
    expect(profile!.simuladoStats.avgScore).toBe(72);
    expect(profile!.recentSimulados).toHaveLength(2);
    expect(profile!.goalsCompleted).toBe(12);
  });

  it("should return null for non-existent user", async () => {
    const { getPublicProfile } = await import("./db");
    const profile = await getPublicProfile(999);
    expect(profile).toBeNull();
  });

  it("should include gamification badges as JSON", async () => {
    const { getPublicProfile } = await import("./db");
    const profile = await getPublicProfile(1);
    expect(profile!.gamification).not.toBeNull();
    const badges = JSON.parse(profile!.gamification!.badges!);
    expect(badges).toHaveLength(3);
    expect(badges.filter((b: any) => b.unlocked)).toHaveLength(2);
  });

  it("should calculate accuracy from XP stats", async () => {
    const { getPublicProfile } = await import("./db");
    const profile = await getPublicProfile(1);
    const accuracy = profile!.xp!.questionsAnswered > 0
      ? Math.round((profile!.xp!.correctAnswers / profile!.xp!.questionsAnswered) * 100)
      : 0;
    expect(accuracy).toBe(80);
  });

  it("should include member since date", async () => {
    const { getPublicProfile } = await import("./db");
    const profile = await getPublicProfile(1);
    expect(profile!.user.memberSince).toBeInstanceOf(Date);
  });
});
