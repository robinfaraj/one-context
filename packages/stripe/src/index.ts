import Stripe from "stripe";

if (!process.env.STRIPE_SECRET_KEY) {
	console.warn("[Stripe] STRIPE_SECRET_KEY not set — Stripe calls will fail");
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? "", {
	apiVersion: "2025-02-24.acacia",
	typescript: true,
});

export { Stripe };
