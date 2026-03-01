import { describe, expect, it } from "vitest";
import { PLANS, hasAccess, FREE_MODULES, PUBLIC_MODULES, PRO_MODULES, PARTNERSHIP_CONFIG } from "./products";

describe("Products & Plans", () => {
  it("should have 5 plans defined (free, publico, estudante, medico, professor)", () => {
    expect(Object.keys(PLANS)).toHaveLength(5);
  });

  it("should have all expected plan IDs", () => {
    expect(PLANS.free).toBeDefined();
    expect(PLANS.publico).toBeDefined();
    expect(PLANS.estudante).toBeDefined();
    expect(PLANS.medico).toBeDefined();
    expect(PLANS.professor).toBeDefined();
  });

  it("free plan should have price 0", () => {
    expect(PLANS.free.price).toBe(0);
  });

  it("publico plan should cost R$ 6,99", () => {
    expect(PLANS.publico.price).toBe(699);
    expect(PLANS.publico.currency).toBe("brl");
  });

  it("estudante plan should cost R$ 49,90", () => {
    expect(PLANS.estudante.price).toBe(4990);
    expect(PLANS.estudante.currency).toBe("brl");
  });

  it("medico plan should cost R$ 59,90", () => {
    expect(PLANS.medico.price).toBe(5990);
    expect(PLANS.medico.currency).toBe("brl");
  });

  it("all plans should have features array", () => {
    Object.values(PLANS).forEach((plan) => {
      expect(Array.isArray(plan.features)).toBe(true);
      expect(plan.features.length).toBeGreaterThan(0);
    });
  });

  it("all plans should have limits defined", () => {
    Object.values(PLANS).forEach((plan) => {
      expect(plan.limits).toBeDefined();
      expect(typeof plan.limits.aiQueriesPerDay).toBe("number");
      expect(Array.isArray(plan.limits.contentYears)).toBe(true);
    });
  });

  it("free plan should limit AI queries to 3 per day", () => {
    expect(PLANS.free.limits.aiQueriesPerDay).toBe(3);
  });

  it("paid plans should have unlimited AI queries", () => {
    expect(PLANS.estudante.limits.aiQueriesPerDay).toBe(-1);
    expect(PLANS.medico.limits.aiQueriesPerDay).toBe(-1);
    expect(PLANS.professor.limits.aiQueriesPerDay).toBe(-1);
  });

  it("free plan should only include years 1-2", () => {
    expect(PLANS.free.limits.contentYears).toEqual([1, 2]);
  });

  it("paid plans should include all 6 years", () => {
    expect(PLANS.estudante.limits.contentYears).toEqual([1, 2, 3, 4, 5, 6]);
    expect(PLANS.medico.limits.contentYears).toEqual([1, 2, 3, 4, 5, 6]);
    expect(PLANS.professor.limits.contentYears).toEqual([1, 2, 3, 4, 5, 6]);
  });

  it("yearly prices should have 20% discount", () => {
    expect(PLANS.estudante.yearlyPrice).toBe(47904);
    expect(PLANS.medico.yearlyPrice).toBe(57504);
  });

  it("all paid plans should have 7-day trial", () => {
    expect(PLANS.publico.trialDays).toBe(7);
    expect(PLANS.estudante.trialDays).toBe(7);
    expect(PLANS.medico.trialDays).toBe(7);
  });
});

describe("Access Control (hasAccess)", () => {
  it("admin should have access to everything", () => {
    expect(hasAccess("admin", "anything")).toBe(true);
  });

  it("free user should access free modules", () => {
    FREE_MODULES.forEach(mod => {
      expect(hasAccess("free", mod)).toBe(true);
    });
  });

  it("free user should NOT access pro modules", () => {
    PRO_MODULES.forEach(mod => {
      expect(hasAccess("free", mod)).toBe(false);
    });
  });

  it("publico user should access public modules", () => {
    PUBLIC_MODULES.forEach(mod => {
      expect(hasAccess("publico", mod)).toBe(true);
    });
  });

  it("estudante should access all modules", () => {
    expect(hasAccess("estudante", "atlas")).toBe(true);
    expect(hasAccess("estudante", "clinicalCases")).toBe(true);
  });

  it("trial user should access all modules", () => {
    expect(hasAccess("free", "atlas", true)).toBe(true);
  });
});

describe("Partnership Configuration", () => {
  it("should require minimum 30 subscriptions", () => {
    expect(PARTNERSHIP_CONFIG.minSubscriptions).toBe(30);
  });

  it("should offer 40% student discount", () => {
    expect(PARTNERSHIP_CONFIG.studentDiscount).toBe(0.40);
  });

  it("should make professor free", () => {
    expect(PARTNERSHIP_CONFIG.professorFree).toBe(true);
  });
});

describe("Stripe Webhook Handler", () => {
  it("stripe-webhook module should export handleStripeWebhook", async () => {
    const mod = await import("./stripe-webhook");
    expect(typeof mod.handleStripeWebhook).toBe("function");
  });
});

describe("tRPC Router Structure", () => {
  it("appRouter should export correct shape", async () => {
    const { appRouter } = await import("./routers");
    expect(appRouter).toBeDefined();
    // Verify router has the expected procedures
    expect(appRouter._def).toBeDefined();
  });
});
