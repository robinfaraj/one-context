import { config } from "@onecontext/config";
import { describe, expect, it } from "vitest";
import { getPlanLimits } from "../middleware/plan-limits";

describe("Billing Config & Plan Limits", () => {
	describe("Plan Config", () => {
		it("should have free and pro plans defined", () => {
			expect(config.payments.plans).toHaveProperty("free");
			expect(config.payments.plans).toHaveProperty("pro");
		});

		it("should have free plan marked as isFree", () => {
			expect(config.payments.plans.free.isFree).toBe(true);
		});

		it("should have pro plan marked as recommended", () => {
			expect(config.payments.plans.pro.recommended).toBe(true);
		});

		it("should have free plan with numeric limits", () => {
			const { limits } = config.payments.plans.free;
			expect(typeof limits.sources).toBe("number");
			expect(typeof limits.memories).toBe("number");
			expect(typeof limits.apiCallsPerDay).toBe("number");
		});

		it("should have pro plan with unlimited sources and memories", () => {
			const { limits } = config.payments.plans.pro;
			expect(limits.sources).toBe("unlimited");
			expect(limits.memories).toBe("unlimited");
		});

		it("should have pro plan with prices for month and year", () => {
			const prices = config.payments.plans.pro.prices ?? [];
			const intervals = prices.map((p) => p.interval);
			expect(intervals).toContain("month");
			expect(intervals).toContain("year");
		});
	});

	describe("getPlanLimits", () => {
		it("should return free limits for free plan", () => {
			const limits = getPlanLimits("free");
			expect(limits).toEqual(config.payments.plans.free.limits);
		});

		it("should return pro limits for pro plan", () => {
			const limits = getPlanLimits("pro");
			expect(limits).toEqual(config.payments.plans.pro.limits);
		});

		it("should fall back to free limits for unknown plan", () => {
			const limits = getPlanLimits("nonexistent");
			expect(limits).toEqual(config.payments.plans.free.limits);
		});
	});
});
