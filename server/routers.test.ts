import { describe, expect, it } from "vitest";
import { PLANS } from "./products";

describe("Products & Plans", () => {
  it("should have 3 plans defined", () => {
    expect(Object.keys(PLANS)).toHaveLength(3);
  });

  it("should have free, pro and premium plans", () => {
    expect(PLANS.free).toBeDefined();
    expect(PLANS.pro).toBeDefined();
    expect(PLANS.premium).toBeDefined();
  });

  it("free plan should have price 0", () => {
    expect(PLANS.free.price).toBe(0);
  });

  it("pro plan should cost R$ 29,90", () => {
    expect(PLANS.pro.price).toBe(2990);
    expect(PLANS.pro.currency).toBe("brl");
  });

  it("premium plan should cost R$ 49,90", () => {
    expect(PLANS.premium.price).toBe(4990);
    expect(PLANS.premium.currency).toBe("brl");
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

  it("pro and premium plans should have unlimited AI queries", () => {
    expect(PLANS.pro.limits.aiQueriesPerDay).toBe(-1);
    expect(PLANS.premium.limits.aiQueriesPerDay).toBe(-1);
  });

  it("free plan should only include years 1-2", () => {
    expect(PLANS.free.limits.contentYears).toEqual([1, 2]);
  });

  it("pro and premium plans should include all 6 years", () => {
    expect(PLANS.pro.limits.contentYears).toEqual([1, 2, 3, 4, 5, 6]);
    expect(PLANS.premium.limits.contentYears).toEqual([1, 2, 3, 4, 5, 6]);
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
