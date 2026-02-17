import { db } from "@onecontext/database/server";
import * as mem0 from "@onecontext/memory";
import { Hono } from "hono";
import { describeRoute } from "hono-openapi";
import { authMiddleware } from "../middleware/auth";

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
		async (c) => {
			const user = c.get("user");
			const body = await c.req.json<{
				name?: string;
				profileSummary?: string;
			}>();

			const data: Record<string, string> = {};
			if (body.name !== undefined) data.name = body.name;
			if (body.profileSummary !== undefined)
				data.profileSummary = body.profileSummary;

			if (Object.keys(data).length === 0) {
				return c.json({ error: "No fields to update" }, 400);
			}

			const updated = await db.user.update({
				where: { id: user.id },
				data,
			});

			return c.json({
				name: updated.name,
				email: updated.email,
				profileSummary: updated.profileSummary,
			});
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
		async (c) => {
			const user = c.get("user");
			const body = await c.req.json<{ syncEnabled: boolean }>();

			const updated = await db.user.update({
				where: { id: user.id },
				data: { syncEnabled: body.syncEnabled },
			});

			return c.json({ syncEnabled: updated.syncEnabled });
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

			const [profile, chats, sources, contentItems, memories] =
				await Promise.all([
					db.user.findUnique({
						where: { id: user.id },
						select: {
							id: true,
							name: true,
							email: true,
							username: true,
							profileSummary: true,
							syncEnabled: true,
							createdAt: true,
						},
					}),
					db.chat.findMany({
						where: { userId: user.id },
						include: { messages: true },
					}),
					db.source.findMany({
						where: { userId: user.id },
					}),
					db.contentItem.findMany({
						where: { source: { userId: user.id } },
					}),
					mem0.getAll(user.id),
				]);

			return c.json({
				exportedAt: new Date().toISOString(),
				profile,
				chats,
				sources,
				contentItems,
				memories,
			});
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

			// Delete Mem0 data first
			try {
				await mem0.deleteAll(user.id);
			} catch {
				// Continue even if Mem0 deletion fails
			}

			// Delete user from DB (cascades handle relations)
			await db.user.delete({ where: { id: user.id } });

			return c.json({ success: true });
		},
	);
