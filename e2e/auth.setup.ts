import { expect, test as setup } from "@playwright/test";

const AUTH_FILE = "e2e/.auth/user.json";

setup("authenticate", async ({ page, request }) => {
	const email = process.env.E2E_USER_EMAIL!;
	const password = process.env.E2E_USER_PASSWORD!;

	// Ensure e2e test user exists — signup is a no-op if the user already exists
	await request.post("/api/auth/sign-up/email", {
		data: { email, password, name: "E2E Test User" },
	});

	await page.goto("/login");

	await page.getByLabel("Email").fill(email);
	await page.getByLabel("Password").fill(password);
	await page.getByRole("button", { name: "Sign in" }).click();

	// After login, user may land on /dashboard or /onboarding
	await expect(page).toHaveURL(/\/(dashboard|onboarding)/, {
		timeout: 15_000,
	});

	// If redirected to onboarding, click through the wizard to complete it
	if (page.url().includes("/onboarding")) {
		// Step 1 (Profile) → Next
		await page.getByRole("button", { name: "Next" }).click();
		// Step 2 (Sources) → Skip for now
		await page.getByRole("button", { name: /skip for now/i }).click();
		// Step 3 (Ready) → Go to Dashboard
		await page.getByRole("button", { name: /go to dashboard/i }).click();

		await expect(page).toHaveURL(/\/dashboard/, { timeout: 15_000 });
	}

	// Save signed-in state for reuse across tests
	await page.context().storageState({ path: AUTH_FILE });
});
