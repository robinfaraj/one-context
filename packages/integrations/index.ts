import { githubAdapter } from "./github/adapter";
import { get, getAvailable, list, register } from "./registry";
import { twitterAdapter } from "./twitter/adapter";

// Register built-in adapters
register(twitterAdapter);
register(githubAdapter);

// Re-export registry functions and types
export { get, getAvailable, list, register };
export { getAccessToken, persistSyncResult } from "./sync";
export type {
	AvailableIntegration,
	ContentItemInput,
	IntegrationAdapter,
	SyncResult,
} from "./types";
