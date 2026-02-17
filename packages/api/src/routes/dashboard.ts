import { db } from "@onecontext/database/server";
import { list } from "@onecontext/integrations";
import * as mem0 from "@onecontext/memory";
import { Hono } from "hono";
import { describeRoute } from "hono-openapi";
import { authMiddleware } from "../middleware/auth";

export const dashboardRouter = new Hono()
	.basePath("/dashboard")
	.use(authMiddleware)
	.get(
		"/",
		describeRoute({
			tags: ["Dashboard"],
			summary: "Get dashboard data",
			description:
				"Returns aggregated dashboard data including stats, connected sources, and recent activity",
			responses: { 200: { description: "Dashboard data" } },
		}),
		async (c) => {
			const user = c.get("user");

			const [
				memories,
				sourceCount,
				chatCount,
				connectedSources,
				recentActivity,
			] = await Promise.all([
				mem0.getAll(user.id),
				db.source.count({
					where: {
						userId: user.id,
						status: "connected",
						provider: { in: list().map((a) => a.provider) },
					},
				}),
				db.chat.count({ where: { userId: user.id } }),
				db.source.findMany({
					where: { userId: user.id },
					orderBy: { createdAt: "desc" },
				}),
				db.contentItem
					.findMany({
						where: { source: { userId: user.id } },
						orderBy: { importedAt: "desc" },
						take: 10,
						include: { source: true },
					})
					.then((items) =>
						items.map((item) => ({
							...item,
							contentType: item.type,
						})),
					),
			]);

			const memoryCount = Array.isArray(memories) ? memories.length : 0;

			return c.json({
				user: {
					name: user.name,
					email: user.email,
					image: user.image,
				},
				stats: {
					memoryCount,
					sourceCount,
					chatCount,
				},
				connectedSources,
				recentActivity,
			});
		},
	);
