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

export async function upsertSubscriptionWithUser(
	userId: string,
	customerId: string,
	stripeSubscriptionId: string,
	stripePriceId: string,
	currentPeriodStart: Date,
	currentPeriodEnd: Date,
) {
	return db.$transaction([
		db.user.update({
			where: { id: userId },
			data: { plan: "pro", stripeCustomerId: customerId },
		}),
		db.subscription.upsert({
			where: { stripeSubscriptionId },
			create: {
				userId,
				stripeSubscriptionId,
				stripePriceId,
				status: "active",
				currentPeriodStart,
				currentPeriodEnd,
			},
			update: {
				status: "active",
				stripePriceId,
				currentPeriodStart,
				currentPeriodEnd,
			},
		}),
	]);
}

export async function updateSubscriptionByStripeId(
	stripeSubscriptionId: string,
	data: {
		status?: string;
		stripePriceId?: string;
		cancelAtPeriodEnd?: boolean;
		currentPeriodStart?: Date;
		currentPeriodEnd?: Date;
	},
) {
	return db.subscription.updateMany({
		where: { stripeSubscriptionId },
		data,
	});
}

export async function findSubscriptionByStripeId(stripeSubscriptionId: string) {
	return db.subscription.findUnique({
		where: { stripeSubscriptionId },
	});
}

export async function downgradeUserToFree(
	userId: string,
	subscriptionId: string,
) {
	return db.$transaction([
		db.user.update({
			where: { id: userId },
			data: { plan: "free" },
		}),
		db.subscription.update({
			where: { id: subscriptionId },
			data: { status: "canceled" },
		}),
	]);
}
