import type { IntegrationAdapter, SyncResult } from "../types";

/**
 * Template adapter — copy this file to create a new integration.
 *
 * 1. Create a new folder: packages/integrations/<provider>/
 * 2. Copy this file into it as adapter.ts
 * 3. Implement the sync method
 * 4. Register the adapter in packages/integrations/index.ts
 */
export const templateAdapter: IntegrationAdapter = {
	provider: "template",
	displayName: "Template",
	icon: "puzzle",
	description: "A template integration adapter",

	async sync(_userId: string, _accessToken: string): Promise<SyncResult> {
		// TODO: Implement sync logic
		// 1. Fetch data from the external API using the accessToken
		// 2. Transform into ContentItemInput[]
		// 3. Return the results
		return {
			contentItems: [],
			memoriesAdded: 0,
		};
	},
};
