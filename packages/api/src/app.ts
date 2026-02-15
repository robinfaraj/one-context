import { auth } from "@onecontext/auth";
import { getBaseUrl } from "@onecontext/utils";
import { Scalar } from "@scalar/hono-api-reference";
import { Hono } from "hono";
import { openAPIRouteHandler } from "hono-openapi";
import { corsMiddleware } from "./middleware/cors";
import { loggerMiddleware } from "./middleware/logger";
import { authRouter } from "./routes/auth";
import { healthRouter } from "./routes/health";

export const app = new Hono().basePath("/api");

app.use(loggerMiddleware);
app.use(corsMiddleware);

const appRouter = app.route("/", healthRouter).route("/", authRouter);

app.get("/app-openapi", async (c) => {
	try {
		const handler = openAPIRouteHandler(app, {
			documentation: {
				info: {
					title: "OneContext API",
					version: "1.0.0",
				},
				servers: [
					{
						url: getBaseUrl(),
						description: "API server",
					},
				],
			},
		});
		return await handler(c, async () => {});
	} catch (error) {
		console.error("[app-openapi] Error generating OpenAPI spec:", error);
		throw error;
	}
});

app.get("/openapi", async (c) => {
	const authSchema = await auth.api.generateOpenAPISchema();
	const appSchema = await (
		app.request("/api/app-openapi") as Promise<Response>
	).then((res) => res.json());

	// Merge auth and app schemas
	const mergedSchema = {
		...appSchema,
		paths: {
			...(appSchema as any).paths,
			...(authSchema as any).paths,
		},
		components: {
			...((appSchema as any).components || {}),
			schemas: {
				...((appSchema as any).components?.schemas || {}),
				...((authSchema as any).components?.schemas || {}),
			},
		},
	};

	return c.json(mergedSchema);
});

app.get(
	"/docs",
	Scalar({
		theme: "saturn",
		url: "/api/openapi",
	}),
);

export type AppRouter = typeof appRouter;
