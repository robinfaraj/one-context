import chalk from "chalk";
import { getApiKey, getApiUrl } from "./config.js";

export class ApiError extends Error {
	constructor(
		public status: number,
		public body: unknown,
	) {
		const bodyMsg =
			body && typeof body === "object"
				? String(
						(body as Record<string, unknown>).error ??
							(body as Record<string, unknown>).message ??
							"",
					)
				: "";
		super(bodyMsg || `API request failed with status ${status}`);
	}
}

export async function apiRequest<T = unknown>(
	path: string,
	options: RequestInit = {},
): Promise<T> {
	const apiKey = getApiKey();
	if (!apiKey) {
		console.error(chalk.red("Not logged in. Run: octx login"));
		process.exit(1);
	}

	const apiUrl = getApiUrl();
	const url = `${apiUrl}${path}`;

	const response = await fetch(url, {
		...options,
		headers: {
			"Content-Type": "application/json",
			"x-api-key": apiKey,
			...options.headers,
		},
	});

	if (response.status === 401) {
		console.error(chalk.red("Invalid or expired API key. Run: octx login"));
		process.exit(1);
	}

	if (response.status === 204) {
		return undefined as T;
	}

	const body = await response.json();

	if (!response.ok) {
		throw new ApiError(response.status, body);
	}

	return body as T;
}
