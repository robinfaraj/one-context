import { config } from "@onecontext/config";
import {
	countConnectedSources,
	findActiveSubscription,
	findApiUsageForDate,
	findUserPlan,
	findUserStripeCustomerId,
	updateSubscription,
} from "@onecontext/database/queries";
import { list } from "@onecontext/integrations";
import { logger } from "@onecontext/logs";
import { getAll } from "@onecontext/memory";
import { stripe } from "@onecontext/stripe";
import { getPlanLimits } from "../middleware/plan-limits";

export async function getUserStripeCustomerId(userId: string) {
	const dbUser = await findUserStripeCustomerId(userId);
	return dbUser?.stripeCustomerId ?? undefined;
}

export async function getSubscriptionInfo(userId: string) {
	const dbUser = await findUserPlan(userId);
	const plan = dbUser?.plan ?? "free";
	const limits = getPlanLimits(plan);
	const planConfig = config.payments.plans[plan];

	const subscription =
		plan !== "free" ? await findActiveSubscription(userId) : null;

	const today = new Date();
	today.setHours(0, 0, 0, 0);

	const [sourceCount, apiUsage, memories] = await Promise.all([
		countConnectedSources(
			userId,
			list().map((a) => a.provider),
		),
		findApiUsageForDate(userId, today),
		getAll(userId).catch((err) => {
			logger.warn("Failed to fetch memories for billing info", {
				userId,
				error: err,
			});
			return [];
		}),
	]);

	return {
		plan: planConfig?.name ?? "Free",
		planId: plan,
		isPro: plan === "pro",
		subscription: subscription
			? {
					id: subscription.id,
					status: subscription.status,
					currentPeriodEnd: subscription.currentPeriodEnd,
					cancelAtPeriodEnd: subscription.cancelAtPeriodEnd,
				}
			: null,
		usage: {
			sources: sourceCount,
			memories: Array.isArray(memories) ? memories.length : 0,
			apiCallsToday: apiUsage?.callCount ?? 0,
		},
		limits,
	};
}

export async function cancelSubscription(userId: string) {
	const subscription = await findActiveSubscription(userId);

	if (!subscription) {
		return { error: "No active subscription found" as const };
	}

	await stripe.subscriptions.update(subscription.stripeSubscriptionId, {
		cancel_at_period_end: true,
	});

	await updateSubscription(subscription.id, { cancelAtPeriodEnd: true });

	return { cancelled: true };
}
