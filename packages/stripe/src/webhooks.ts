import { db } from "@onecontext/database/server";
import type Stripe from "stripe";
import { stripe } from "./index";

export function verifyWebhookSignature(
	body: string,
	signature: string,
): Stripe.Event {
	const secret = process.env.STRIPE_WEBHOOK_SECRET;
	if (!secret) throw new Error("STRIPE_WEBHOOK_SECRET not configured");
	return stripe.webhooks.constructEvent(body, signature, secret);
}

export async function handleCheckoutCompleted(
	session: Stripe.Checkout.Session,
) {
	const userId = session.metadata?.userId;
	if (!userId) return;

	const subscriptionId = session.subscription as string;
	const customerId = session.customer as string;

	// Get full subscription details
	const subscription = await stripe.subscriptions.retrieve(subscriptionId);

	// Update user plan and Stripe customer ID
	await db.user.update({
		where: { id: userId },
		data: { plan: "pro", stripeCustomerId: customerId },
	});

	// Create subscription record
	await db.subscription.upsert({
		where: { stripeSubscriptionId: subscriptionId },
		create: {
			userId,
			stripeSubscriptionId: subscriptionId,
			stripePriceId: subscription.items.data[0]?.price.id ?? "",
			status: "active",
			currentPeriodStart: new Date(subscription.current_period_start * 1000),
			currentPeriodEnd: new Date(subscription.current_period_end * 1000),
		},
		update: {
			status: "active",
			stripePriceId: subscription.items.data[0]?.price.id ?? "",
			currentPeriodStart: new Date(subscription.current_period_start * 1000),
			currentPeriodEnd: new Date(subscription.current_period_end * 1000),
		},
	});
}

export async function handleInvoicePaid(invoice: Stripe.Invoice) {
	const subscriptionId = invoice.subscription as string;
	if (!subscriptionId) return;

	const subscription = await stripe.subscriptions.retrieve(subscriptionId);

	await db.subscription.updateMany({
		where: { stripeSubscriptionId: subscriptionId },
		data: {
			status: "active",
			currentPeriodStart: new Date(subscription.current_period_start * 1000),
			currentPeriodEnd: new Date(subscription.current_period_end * 1000),
		},
	});
}

export async function handleInvoicePaymentFailed(invoice: Stripe.Invoice) {
	const subscriptionId = invoice.subscription as string;
	if (!subscriptionId) return;

	await db.subscription.updateMany({
		where: { stripeSubscriptionId: subscriptionId },
		data: { status: "past_due" },
	});
}

export async function handleSubscriptionUpdated(
	subscription: Stripe.Subscription,
) {
	await db.subscription.updateMany({
		where: { stripeSubscriptionId: subscription.id },
		data: {
			status: subscription.status === "active" ? "active" : subscription.status,
			stripePriceId: subscription.items.data[0]?.price.id ?? "",
			cancelAtPeriodEnd: subscription.cancel_at_period_end,
			currentPeriodStart: new Date(subscription.current_period_start * 1000),
			currentPeriodEnd: new Date(subscription.current_period_end * 1000),
		},
	});
}

export async function handleSubscriptionDeleted(
	subscription: Stripe.Subscription,
) {
	// Find user via subscription record
	const sub = await db.subscription.findUnique({
		where: { stripeSubscriptionId: subscription.id },
	});

	if (sub) {
		// Downgrade user to free
		await db.user.update({
			where: { id: sub.userId },
			data: { plan: "free" },
		});

		// Update subscription status
		await db.subscription.update({
			where: { id: sub.id },
			data: { status: "canceled" },
		});
	}
}
