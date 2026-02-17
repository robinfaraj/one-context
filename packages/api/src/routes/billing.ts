import { config } from "@onecontext/config";
import { db } from "@onecontext/database/server";
import { getAll } from "@onecontext/memory";
import { stripe } from "@onecontext/stripe";
import { createCheckoutSession } from "@onecontext/stripe/src/checkout";
import { createPortalSession } from "@onecontext/stripe/src/portal";
import {
	handleCheckoutCompleted,
	handleInvoicePaid,
	handleInvoicePaymentFailed,
	handleSubscriptionDeleted,
	handleSubscriptionUpdated,
	verifyWebhookSignature,
} from "@onecontext/stripe/src/webhooks";
import { getBaseUrl } from "@onecontext/utils";
import { Hono } from "hono";
import { describeRoute } from "hono-openapi";
import { authMiddleware } from "../middleware/auth";
import { getPlanLimits } from "../middleware/plan-limits";

// Auth-protected billing routes
const protectedRoutes = new Hono()
	.use(authMiddleware)
	.post(
		"/checkout",
		describeRoute({
			tags: ["Billing"],
			summary: "Create a checkout session",
			description: "Creates a Stripe checkout session for upgrading to Pro",
			responses: {
				200: { description: "Checkout session URL" },
				400: { description: "Invalid request" },
			},
		}),
		async (c) => {
			const sessionUser = c.get("user");
			const body = await c.req.json<{ priceId: string }>();

			if (!body.priceId) {
				return c.json({ error: "priceId is required" }, 400);
			}

			const dbUser = await db.user.findUnique({
				where: { id: sessionUser.id },
				select: { stripeCustomerId: true },
			});

			const baseUrl = getBaseUrl();
			const { url } = await createCheckoutSession({
				userId: sessionUser.id,
				email: sessionUser.email,
				priceId: body.priceId,
				successUrl: `${baseUrl}/settings/billing?success=true`,
				cancelUrl: `${baseUrl}/settings/billing`,
				customerId: dbUser?.stripeCustomerId ?? undefined,
			});

			return c.json({ url });
		},
	)
	.post(
		"/portal",
		describeRoute({
			tags: ["Billing"],
			summary: "Create a customer portal session",
			description:
				"Creates a Stripe customer portal session for managing subscription",
			responses: {
				200: { description: "Portal session URL" },
				400: { description: "No Stripe customer ID found" },
			},
		}),
		async (c) => {
			const sessionUser = c.get("user");

			const dbUser = await db.user.findUnique({
				where: { id: sessionUser.id },
				select: { stripeCustomerId: true },
			});

			if (!dbUser?.stripeCustomerId) {
				return c.json(
					{ error: "No Stripe customer ID found. Please subscribe first." },
					400,
				);
			}

			const baseUrl = getBaseUrl();
			const { url } = await createPortalSession({
				customerId: dbUser.stripeCustomerId,
				returnUrl: `${baseUrl}/settings/billing`,
			});

			return c.json({ url });
		},
	)
	.get(
		"/subscription",
		describeRoute({
			tags: ["Billing"],
			summary: "Get subscription info",
			description:
				"Returns the current user plan, subscription details, usage stats, and limits",
			responses: {
				200: { description: "Subscription info" },
			},
		}),
		async (c) => {
			const sessionUser = c.get("user");

			const dbUser = await db.user.findUnique({
				where: { id: sessionUser.id },
				select: { plan: true },
			});
			const plan = dbUser?.plan ?? "free";
			const limits = getPlanLimits(plan);
			const planConfig = config.payments.plans[plan];

			// Get subscription details if pro
			const subscription =
				plan !== "free"
					? await db.subscription.findFirst({
							where: { userId: sessionUser.id, status: "active" },
							orderBy: { createdAt: "desc" },
						})
					: null;

			// Get usage stats
			const today = new Date();
			today.setHours(0, 0, 0, 0);

			const [sourceCount, apiUsage, memories] = await Promise.all([
				db.source.count({
					where: { userId: sessionUser.id, status: "connected" },
				}),
				db.apiUsage.findUnique({
					where: { userId_date: { userId: sessionUser.id, date: today } },
				}),
				getAll(sessionUser.id).catch(() => []),
			]);

			return c.json({
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
			});
		},
	)
	.post(
		"/cancel",
		describeRoute({
			tags: ["Billing"],
			summary: "Cancel subscription",
			description:
				"Cancels the current subscription at the end of the billing period",
			responses: {
				200: { description: "Subscription cancelled" },
				400: { description: "No active subscription" },
			},
		}),
		async (c) => {
			const sessionUser = c.get("user");

			const subscription = await db.subscription.findFirst({
				where: { userId: sessionUser.id, status: "active" },
			});

			if (!subscription) {
				return c.json({ error: "No active subscription found" }, 400);
			}

			await stripe.subscriptions.update(subscription.stripeSubscriptionId, {
				cancel_at_period_end: true,
			});

			await db.subscription.update({
				where: { id: subscription.id },
				data: { cancelAtPeriodEnd: true },
			});

			return c.json({ cancelled: true });
		},
	);

// Public routes (webhook) + auth-protected routes
export const billingRouter = new Hono()
	.basePath("/billing")
	.post(
		"/webhook",
		describeRoute({
			tags: ["Billing"],
			summary: "Stripe webhook",
			description: "Handles incoming Stripe webhook events",
			responses: {
				200: { description: "Webhook received" },
				400: { description: "Invalid signature" },
			},
		}),
		async (c) => {
			const body = await c.req.text();
			const signature = c.req.header("stripe-signature");

			if (!signature) {
				return c.json({ error: "Missing stripe-signature header" }, 400);
			}

			let event: ReturnType<typeof verifyWebhookSignature>;
			try {
				event = verifyWebhookSignature(body, signature);
			} catch {
				return c.json({ error: "Invalid webhook signature" }, 400);
			}

			switch (event.type) {
				case "checkout.session.completed":
					await handleCheckoutCompleted(event.data.object);
					break;
				case "invoice.paid":
					await handleInvoicePaid(event.data.object);
					break;
				case "invoice.payment_failed":
					await handleInvoicePaymentFailed(event.data.object);
					break;
				case "customer.subscription.updated":
					await handleSubscriptionUpdated(event.data.object);
					break;
				case "customer.subscription.deleted":
					await handleSubscriptionDeleted(event.data.object);
					break;
			}

			return c.json({ received: true });
		},
	)
	.route("/", protectedRoutes);
