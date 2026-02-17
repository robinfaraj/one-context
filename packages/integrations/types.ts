export interface IntegrationAdapter {
	provider: string;
	displayName: string;
	icon: string;
	description: string;
	oauthProvider?: string;
	sync(userId: string, accessToken: string): Promise<SyncResult>;
}

export type SyncResult = {
	contentItems: ContentItemInput[];
	memoriesAdded: number;
};

export type ContentItemInput = {
	externalId: string;
	type: string;
	rawData: any;
	contentDate: Date;
	textContent: string;
};

export type AvailableIntegration = {
	provider: string;
	displayName: string;
	icon: string;
	description: string;
	available: boolean;
	comingSoon?: boolean;
};
