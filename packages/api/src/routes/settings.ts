import { sValidator } from "@hono/standard-validator";
import { Hono } from "hono";
import { describeRoute } from "hono-openapi";
import { z } from "zod";
import { authMiddleware } from "../middleware/auth";
import {
	deleteAccount,
	exportUserData,
	updateProfile,
	updateSyncSettings,
} from "../services/settings";

const profileUpdateSchema = z.object({
	name: z.string().optional(),
	profileSummary: z.string().optional(),
});

const syncSettingsSchema = z.object({
	syncEnabled: z.boolean(),
});

export const settingsRouter = new Hono()
	.basePath("/settings")
	.use(authMiddleware)
	.put(
		"/profile",
		describeRoute({
			tags: ["Settings"],
			summary: "Update profile",
			description: "Update user name and profile summary",
			responses: {
				200: { description: "Updated user profile" },
				400: { description: "Invalid input" },
			},
		}),
		sValidator("json", profileUpdateSchema),
		async (c) => {
			const user = c.get("user");
			const body = c.req.valid("json");

			const result = await updateProfile(user.id, body);

			if ("error" in result) {
				return c.json({ error: result.error }, 400);
			}

			return c.json(result);
		},
	)
	.put(
		"/sync",
		describeRoute({
			tags: ["Settings"],
			summary: "Update sync settings",
			description: "Enable or disable automatic sync",
			responses: { 200: { description: "Updated sync settings" } },
		}),
		sValidator("json", syncSettingsSchema),
		async (c) => {
			const user = c.get("user");
			const body = c.req.valid("json");

			const result = await updateSyncSettings(user.id, body.syncEnabled);
			return c.json(result);
		},
	)
	.get(
		"/export",
		describeRoute({
			tags: ["Settings"],
			summary: "Export user data",
			description:
				"Export all user data as JSON including profile, chats, sources, and memories",
			responses: { 200: { description: "Exported user data" } },
		}),
		async (c) => {
			const user = c.get("user");
			const data = await exportUserData(user.id);
			return c.json(data);
		},
	)
	.delete(
		"/account",
		describeRoute({
			tags: ["Settings"],
			summary: "Delete account",
			description: "Permanently delete user account and all associated data",
			responses: { 200: { description: "Account deleted" } },
		}),
		async (c) => {
			const user = c.get("user");
			await deleteAccount(user.id);
			return c.body(null, 204);
		},
	);
