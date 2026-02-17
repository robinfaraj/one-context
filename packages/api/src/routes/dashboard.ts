import { Hono } from "hono";
import { describeRoute } from "hono-openapi";
import { authMiddleware } from "../middleware/auth";
import { getDashboardData } from "../services/dashboard";

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
			const data = await getDashboardData(user);
			return c.json(data);
		},
	);
