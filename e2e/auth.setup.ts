import { expect, test as setup } from "@playwright/test";

const AUTH_FILE = "e2e/.auth/user.json";

setup("authenticate", async ({ page }) => {
	await page.goto("/login");

	await page.getByLabel("Email").fill(process.env.E2E_USER_EMAIL!);
	await page.getByLabel("Password").fill(process.env.E2E_USER_PASSWORD!);
	await page.getByRole("button", { name: "Sign in" }).click();

	// Wait for redirect to dashboard after successful login
	await expect(page).toHaveURL(/\/dashboard/, { timeout: 15_000 });

	// Save signed-in state for reuse across tests
	await page.context().storageState({ path: AUTH_FILE });
});
