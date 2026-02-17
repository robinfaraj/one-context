import { type Page, expect, test } from "@playwright/test";

/** Navigate to /chat and wait for both page and sidebar chat list to load. */
async function gotoChat(page: Page) {
	const chatListPromise = page.waitForResponse(
		(res) =>
			res.url().includes("/api/ai/chats") &&
			!res.url().includes("/api/ai/chats/") &&
			res.status() === 200,
		{ timeout: 15_000 },
	);
	await page.goto("/chat");
	await expect(
		page.getByRole("heading", { name: "What would you like to know?" }),
	).toBeVisible({ timeout: 15_000 });
	await chatListPromise;
	// Give React a tick to render the sidebar
	await page.waitForTimeout(500);
}

/** Send a chat message and wait for the AI response to complete. */
async function sendAndWait(page: Page, message: string) {
	const input = page.getByPlaceholder("Send a message...");
	await input.fill(message);
	await page.getByRole("button", { name: "Send message" }).click();

	// Wait for streaming to finish: "Stop generating" button appears then disappears
	const stopButton = page.getByRole("button", { name: "Stop generating" });
	await stopButton
		.waitFor({ state: "visible", timeout: 10_000 })
		.catch(() => {});
	await stopButton.waitFor({ state: "hidden", timeout: 60_000 });
}

/**
 * Count chat entries in sidebar by counting "Delete chat" buttons.
 * These buttons have opacity:0 by default (shown on hover), so we count
 * attached DOM elements rather than checking visibility.
 */
function chatEntryCount(page: Page) {
	return page.getByRole("button", { name: "Delete chat" }).count();
}

test.describe("Chat", () => {
	test.beforeEach(async ({ page }) => {
		await gotoChat(page);
	});

	test("shows empty state for new chat", async ({ page }) => {
		await expect(page.getByPlaceholder("Send a message...")).toBeVisible();
		await expect(
			page.getByRole("button", { name: "New Chat" }).first(),
		).toBeVisible();
	});

	test("sends a message and receives a response", async ({ page }) => {
		await sendAndWait(page, "say hello in exactly 3 words");

		await expect(page.getByText("say hello in exactly 3 words")).toBeVisible();
		await expect(page.getByRole("button", { name: "Copy" })).toBeVisible();
	});

	test("multiple messages persist in the same chat", async ({ page }) => {
		test.setTimeout(90_000);

		await sendAndWait(page, "repeat exactly: ALPHA");
		await sendAndWait(page, "repeat exactly: BRAVO");

		// Both user messages should be visible (all in same chat, not split)
		await expect(page.getByText("repeat exactly: ALPHA")).toBeVisible();
		await expect(page.getByText("repeat exactly: BRAVO")).toBeVisible();
	});

	test("chat history persists after navigating away and back", async ({
		page,
	}) => {
		test.setTimeout(90_000);

		await sendAndWait(page, "e2e persistence test xyz789");

		// Navigate away
		await page.goto("/dashboard");
		await expect(page).toHaveURL(/\/dashboard/);

		// Navigate back and wait for sidebar to fully load
		await gotoChat(page);

		// The sidebar should have at least one chat entry (the one we just created)
		// Delete buttons are opacity:0 so use 'attached' instead of 'visible'
		const deleteButtons = page.getByRole("button", { name: "Delete chat" });
		await deleteButtons.first().waitFor({ state: "attached", timeout: 15_000 });

		// Click the most recent chat entry (first in the sidebar list)
		// Each chat wrapper: [chat title button, delete button] — click title
		const firstChatWrapper = deleteButtons.first().locator("..");
		const chatButton = firstChatWrapper.locator("button").first();
		await chatButton.click();

		// The user message should load from DB
		await expect(
			page.getByText("e2e persistence test xyz789", { exact: true }),
		).toBeVisible({ timeout: 10_000 });
	});

	test("new chat button resets to empty state", async ({ page }) => {
		test.setTimeout(90_000);

		await sendAndWait(page, "some message");

		await page.getByRole("button", { name: "New Chat" }).first().click();

		await expect(
			page.getByRole("heading", { name: "What would you like to know?" }),
		).toBeVisible({ timeout: 5_000 });
	});

	test("sidebar updates with new chat after sending a message", async ({
		page,
	}) => {
		test.setTimeout(90_000);

		const initialCount = await chatEntryCount(page);

		await sendAndWait(page, "sidebar update test");

		// Sidebar should show the new chat without a page reload
		await expect(async () => {
			const count = await chatEntryCount(page);
			expect(count).toBe(initialCount + 1);
		}).toPass({ timeout: 10_000 });
	});

	test("delete removes chat from sidebar without reload", async ({
		page,
	}) => {
		test.setTimeout(90_000);

		// Create a chat first
		await sendAndWait(page, "delete test message");

		// Wait for sidebar to reflect the new chat
		const countAfterCreate = await expect(async () => {
			const count = await chatEntryCount(page);
			expect(count).toBeGreaterThan(0);
			return count;
		}).toPass({ timeout: 10_000 });

		const beforeDelete = await chatEntryCount(page);

		// Double-click delete on the first chat (confirm pattern)
		const deleteBtn = page.getByRole("button", { name: "Delete chat" }).first();
		await deleteBtn.click();
		await page.waitForTimeout(300);
		const confirmBtn = page
			.getByRole("button", { name: "Confirm delete" })
			.first();
		await confirmBtn.click();

		// Sidebar should have one fewer chat without reload
		await expect(async () => {
			const count = await chatEntryCount(page);
			expect(count).toBe(beforeDelete - 1);
		}).toPass({ timeout: 10_000 });
	});

	test("chat title appears in sidebar after generation", async ({ page }) => {
		test.setTimeout(120_000);

		// Send a message to create a chat — title generates on first message
		await sendAndWait(page, "tell me about quantum computing basics");

		// The sidebar should eventually show a generated title (not "New Chat")
		// Title generation is async, so poll for up to 15 seconds
		const sidebar = page.locator("aside").first();
		await expect(async () => {
			const text = (await sidebar.textContent()) ?? "";
			// The sidebar should contain something other than just "New Chat" entries
			// for the chat we just created. The title model generates a short summary.
			const chatButtons = await page
				.locator("aside button")
				.allTextContents();
			const nonGenericTitles = chatButtons.filter(
				(t) => t.trim() && t !== "New Chat" && t !== "Delete chat" && t !== "Confirm delete",
			);
			expect(nonGenericTitles.length).toBeGreaterThan(0);
		}).toPass({ timeout: 15_000 });
	});

	test("no duplicate chats created from multiple messages", async ({
		page,
	}) => {
		test.setTimeout(90_000);

		const initialCount = await chatEntryCount(page);

		await sendAndWait(page, "dedup test msg 1");
		await sendAndWait(page, "dedup test msg 2");

		// Reload with fresh sidebar data, listening for response before reload
		const chatListPromise = page.waitForResponse(
			(res) =>
				res.url().includes("/api/ai/chats") &&
				!res.url().includes("/api/ai/chats/") &&
				res.status() === 200,
			{ timeout: 15_000 },
		);
		await page.reload();
		await expect(
			page.getByRole("heading", { name: "What would you like to know?" }),
		).toBeVisible({ timeout: 15_000 });
		await chatListPromise;
		await page.waitForTimeout(500);

		// Should have created exactly ONE new chat, not two
		const finalCount = await chatEntryCount(page);
		expect(finalCount).toBe(initialCount + 1);
	});
});
