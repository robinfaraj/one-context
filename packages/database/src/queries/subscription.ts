import { db } from "../client";

export async function findActiveSubscription(userId: string) {
	return db.subscription.findFirst({
		where: { userId, status: "active" },
		orderBy: { createdAt: "desc" },
	});
}

export async function updateSubscription(
	subscriptionId: string,
	data: { cancelAtPeriodEnd?: boolean },
) {
	return db.subscription.update({
		where: { id: subscriptionId },
		data,
	});
}

export async function findApiUsageForDate(userId: string, date: Date) {
	return db.apiUsage.findUnique({
		where: { userId_date: { userId, date } },
	});
}

export async function countConnectedSources(
	userId: string,
	providers: string[],
) {
	return db.source.count({
		where: {
			userId,
			status: "connected",
			provider: { in: providers },
		},
	});
}
