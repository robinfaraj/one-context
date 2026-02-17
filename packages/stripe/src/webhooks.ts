import {
	downgradeUserToFree,
	findSubscriptionByStripeId,
	updateSubscriptionByStripeId,
	upsertSubscriptionWithUser,
} from "@onecontext/database/queries";
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

	await upsertSubscriptionWithUser(
		userId,
		customerId,
		subscriptionId,
		subscription.items.data[0]?.price.id ?? "",
		new Date(subscription.current_period_start * 1000),
		new Date(subscription.current_period_end * 1000),
	);
}

export async function handleInvoicePaid(invoice: Stripe.Invoice) {
	const subscriptionId = invoice.subscription as string;
	if (!subscriptionId) return;

	const subscription = await stripe.subscriptions.retrieve(subscriptionId);

	await updateSubscriptionByStripeId(subscriptionId, {
		status: "active",
		currentPeriodStart: new Date(subscription.current_period_start * 1000),
		currentPeriodEnd: new Date(subscription.current_period_end * 1000),
	});
}

export async function handleInvoicePaymentFailed(invoice: Stripe.Invoice) {
	const subscriptionId = invoice.subscription as string;
	if (!subscriptionId) return;

	await updateSubscriptionByStripeId(subscriptionId, {
		status: "past_due",
	});
}

export async function handleSubscriptionUpdated(
	subscription: Stripe.Subscription,
) {
	await updateSubscriptionByStripeId(subscription.id, {
		status: subscription.status === "active" ? "active" : subscription.status,
		stripePriceId: subscription.items.data[0]?.price.id ?? "",
		cancelAtPeriodEnd: subscription.cancel_at_period_end,
		currentPeriodStart: new Date(subscription.current_period_start * 1000),
		currentPeriodEnd: new Date(subscription.current_period_end * 1000),
	});
}

export async function handleSubscriptionDeleted(
	subscription: Stripe.Subscription,
) {
	const sub = await findSubscriptionByStripeId(subscription.id);

	if (sub) {
		await downgradeUserToFree(sub.userId, sub.id);
	}
}
