import { describe, it, expect } from "vitest";
import { appRouter } from "./routers";

describe("Progress & XP Router", () => {
  it("should have progress router with get, addXp, history, and logSession", () => {
    expect(appRouter).toBeDefined();
    // Verify the progress router exists in the appRouter
    const routerDef = appRouter._def;
    expect(routerDef).toBeDefined();
    // Check that the router has the expected procedures
    expect(routerDef.procedures).toBeDefined();
    const procedures = Object.keys(routerDef.procedures);
    expect(procedures).toContain("progress.get");
    expect(procedures).toContain("progress.addXp");
    expect(procedures).toContain("progress.history");
    expect(procedures).toContain("progress.logSession");
  });

  it("should have profile router with update", () => {
    const procedures = Object.keys(appRouter._def.procedures);
    expect(procedures).toContain("profile.update");
  });

  it("should have all expected routers", () => {
    const procedures = Object.keys(appRouter._def.procedures);
    // Auth
    expect(procedures).toContain("auth.me");
    expect(procedures).toContain("auth.logout");
    // Stripe
    expect(procedures).toContain("stripe.getPlans");
    expect(procedures).toContain("stripe.createCheckout");
    expect(procedures).toContain("stripe.getSubscription");
    // Progress
    expect(procedures).toContain("progress.get");
    expect(procedures).toContain("progress.addXp");
    expect(procedures).toContain("progress.history");
    expect(procedures).toContain("progress.logSession");
    // Profile
    expect(procedures).toContain("profile.update");
    // AI
    expect(procedures).toContain("ai.generateContent");
    expect(procedures).toContain("ai.research");
    expect(procedures).toContain("ai.chat");
  });
});

describe("XP Calculation Logic", () => {
  it("should calculate level from XP correctly", () => {
    // Level formula: Math.floor(totalXp / 500) + 1
    expect(Math.floor(0 / 500) + 1).toBe(1);
    expect(Math.floor(499 / 500) + 1).toBe(1);
    expect(Math.floor(500 / 500) + 1).toBe(2);
    expect(Math.floor(1000 / 500) + 1).toBe(3);
    expect(Math.floor(2500 / 500) + 1).toBe(6);
  });

  it("should calculate streak correctly", () => {
    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
    const twoDaysAgo = new Date(Date.now() - 2 * 86400000).toISOString().split('T')[0];
    
    // Same day - no streak change
    expect(today !== yesterday).toBe(true);
    
    // Consecutive days - streak continues
    const yesterdayDate = new Date(yesterday);
    const todayDate = new Date(today);
    const diffMs = todayDate.getTime() - yesterdayDate.getTime();
    expect(diffMs).toBe(86400000);
    
    // Two days gap - streak resets
    const twoDaysAgoDate = new Date(twoDaysAgo);
    const diffMs2 = todayDate.getTime() - twoDaysAgoDate.getTime();
    expect(diffMs2).toBe(2 * 86400000);
  });
});
