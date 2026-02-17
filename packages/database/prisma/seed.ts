import { auth } from "@onecontext/auth";
import { db } from "@onecontext/database/server";

const E2E_USER_EMAIL = process.env.E2E_USER_EMAIL;
const E2E_USER_PASSWORD = process.env.E2E_USER_PASSWORD;

async function main() {
	if (!E2E_USER_EMAIL || !E2E_USER_PASSWORD) {
		console.warn(
			"[seed] Skipping — E2E_USER_EMAIL and E2E_USER_PASSWORD must be set",
		);
		return;
	}

	console.log(`[seed] Creating e2e test user: ${E2E_USER_EMAIL}`);

	try {
		const result = await auth.api.signUpEmail({
			body: {
				email: E2E_USER_EMAIL,
				password: E2E_USER_PASSWORD,
				name: "E2E Test User",
			},
		});

		if (result?.user) {
			// Mark onboarding complete so the e2e user lands on /dashboard
			await db.user.update({
				where: { id: result.user.id },
				data: { onboardingComplete: true },
			});
			console.log(`[seed] User created: ${result.user.id}`);
		}
	} catch (error: unknown) {
		const message = error instanceof Error ? error.message : String(error);

		// BetterAuth returns an error if the user already exists — that's fine
		if (
			message.includes("already exists") ||
			message.includes("already been taken") ||
			message.includes("UNIQUE constraint")
		) {
			console.log("[seed] User already exists — skipping");
			return;
		}

		console.error("[seed] Failed to create user:", message);
		process.exit(1);
	}

	console.log("[seed] Done");
}

main();
