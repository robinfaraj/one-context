import { sValidator } from "@hono/standard-validator";
import { config } from "@onecontext/config";
import { logger } from "@onecontext/logs";
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
import { z } from "zod";
import { authMiddleware } from "../middleware/auth";
import {
	cancelSubscription,
	getSubscriptionInfo,
	getUserStripeCustomerId,
} from "../services/billing";

const allowedPriceIds = Object.values(config.payments.plans)
	.flatMap((plan) => ("prices" in plan && plan.prices ? plan.prices : []))
	.map((p) => p.priceId)
	.filter((id) => id.length > 0);

const checkoutSchema = z.object({
	priceId: z
		.string()
		.min(1, "priceId is required")
		.refine((id) => allowedPriceIds.includes(id), "Invalid priceId"),
});

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
		sValidator("json", checkoutSchema),
		async (c) => {
			const sessionUser = c.get("user");
			const { priceId } = c.req.valid("json");

			const customerId = await getUserStripeCustomerId(sessionUser.id);

			const baseUrl = getBaseUrl();
			const { url } = await createCheckoutSession({
				userId: sessionUser.id,
				email: sessionUser.email,
				priceId,
				successUrl: `${baseUrl}/settings/billing?success=true`,
				cancelUrl: `${baseUrl}/settings/billing`,
				customerId,
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

			const customerId = await getUserStripeCustomerId(sessionUser.id);

			if (!customerId) {
				return c.json(
					{ error: "No Stripe customer ID found. Please subscribe first." },
					400,
				);
			}

			const baseUrl = getBaseUrl();
			const { url } = await createPortalSession({
				customerId,
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
			const info = await getSubscriptionInfo(sessionUser.id);
			return c.json(info);
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
			const result = await cancelSubscription(sessionUser.id);

			if ("error" in result) {
				return c.json({ error: result.error }, 400);
			}

			return c.json(result);
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
					try {
						await handleCheckoutCompleted(event.data.object);
					} catch (err) {
						logger.error(
							"Webhook handler failed for checkout.session.completed",
							{ error: err },
						);
					}
					break;
				case "invoice.paid":
					try {
						await handleInvoicePaid(event.data.object);
					} catch (err) {
						logger.error("Webhook handler failed for invoice.paid", {
							error: err,
						});
					}
					break;
				case "invoice.payment_failed":
					try {
						await handleInvoicePaymentFailed(event.data.object);
					} catch (err) {
						logger.error("Webhook handler failed for invoice.payment_failed", {
							error: err,
						});
					}
					break;
				case "customer.subscription.updated":
					try {
						await handleSubscriptionUpdated(event.data.object);
					} catch (err) {
						logger.error(
							"Webhook handler failed for customer.subscription.updated",
							{ error: err },
						);
					}
					break;
				case "customer.subscription.deleted":
					try {
						await handleSubscriptionDeleted(event.data.object);
					} catch (err) {
						logger.error(
							"Webhook handler failed for customer.subscription.deleted",
							{ error: err },
						);
					}
					break;
				default:
					logger.warn("Unhandled Stripe webhook event type", {
						type: event.type,
					});
					break;
			}

			return c.json({ received: true });
		},
	)
	.route("/", protectedRoutes);
