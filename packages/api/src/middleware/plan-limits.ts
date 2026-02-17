import { config } from "@onecontext/config";
import { db } from "@onecontext/database/server";
import { list } from "@onecontext/integrations";

export function getPlanLimits(plan: string) {
	const planConfig = config.payments.plans[plan] ?? config.payments.plans.free;
	return planConfig.limits;
}

export async function checkSourceLimit(
	userId: string,
): Promise<{ allowed: boolean; current: number; limit: number | "unlimited" }> {
	const user = await db.user.findUnique({
		where: { id: userId },
		select: { plan: true },
	});
	const limits = getPlanLimits(user?.plan ?? "free");

	if (limits.sources === "unlimited") {
		return { allowed: true, current: 0, limit: "unlimited" };
	}

	const integrationProviders = list().map((a) => a.provider);
	const count = await db.source.count({
		where: {
			userId,
			status: "connected",
			provider: { in: integrationProviders },
		},
	});
	return {
		allowed: count < limits.sources,
		current: count,
		limit: limits.sources,
	};
}

export async function checkMemoryLimit(
	userId: string,
	currentCount: number,
): Promise<{ allowed: boolean; current: number; limit: number | "unlimited" }> {
	const user = await db.user.findUnique({
		where: { id: userId },
		select: { plan: true },
	});
	const limits = getPlanLimits(user?.plan ?? "free");

	if (limits.memories === "unlimited") {
		return { allowed: true, current: currentCount, limit: "unlimited" };
	}

	return {
		allowed: currentCount < limits.memories,
		current: currentCount,
		limit: limits.memories,
	};
}

export async function trackApiCall(userId: string): Promise<{
	allowed: boolean;
	remaining: number;
	limit: number | "unlimited";
}> {
	const user = await db.user.findUnique({
		where: { id: userId },
		select: { plan: true },
	});
	const limits = getPlanLimits(user?.plan ?? "free");

	if (limits.apiCallsPerDay === "unlimited") {
		return {
			allowed: true,
			remaining: Number.POSITIVE_INFINITY,
			limit: "unlimited",
		};
	}

	const today = new Date();
	today.setHours(0, 0, 0, 0);

	const usage = await db.apiUsage.upsert({
		where: { userId_date: { userId, date: today } },
		create: { userId, date: today, callCount: 1 },
		update: { callCount: { increment: 1 } },
	});

	const remaining = limits.apiCallsPerDay - usage.callCount;
	return {
		allowed: remaining >= 0,
		remaining: Math.max(0, remaining),
		limit: limits.apiCallsPerDay,
	};
}
