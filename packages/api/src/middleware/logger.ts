import { logger } from "@onecontext/logs";
import { logger as honoLogger } from "hono/logger";

export const loggerMiddleware = honoLogger((message, ...rest) => {
	// Extract timing information from Hono logger
	const infoObj = rest[0] as any;
	if (infoObj && typeof infoObj === "object") {
		const method = infoObj.method || "";
		const path = infoObj.path || "";
		const status = infoObj.status || 0;
		const elapsed = infoObj.elapsed || 0;

		// Log API timing for debugging
		console.log(`[API] ${method} ${path} - ${status} - ${elapsed}ms`);

		// Warn on slow requests
		if (elapsed > 3000) {
			console.warn(`[SLOW API] ${method} ${path} took ${elapsed}ms`);
		}
	}

	logger.log(message, ...rest);
});
