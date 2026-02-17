import { defineConfig } from "vitest/config";

export default defineConfig({
	test: {
		env: {
			// Prevent Stripe from throwing during module initialization in tests.
			// Actual Stripe API calls are not made in unit/integration tests.
			STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY ?? "sk_test_dummy",
		},
	},
});
