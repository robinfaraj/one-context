import type { IntegrationAdapter, SyncResult } from "../types";

export const githubAdapter: IntegrationAdapter = {
	provider: "github",
	displayName: "GitHub",
	icon: "github",
	description: "Import your repos, bio, and activity",
	oauthProvider: "github",

	async sync(_userId: string, _accessToken: string): Promise<SyncResult> {
		// TODO: Call GitHub API to fetch user repos, bio, and activity
		// - GET /user for profile/bio
		// - GET /user/repos for repositories
		// - GET /users/:username/events for recent activity
		// - Transform each item into a ContentItemInput
		return {
			contentItems: [],
			memoriesAdded: 0,
		};
	},
};
