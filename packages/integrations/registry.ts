import type { AvailableIntegration, IntegrationAdapter } from "./types";

const adapters = new Map<string, IntegrationAdapter>();

const comingSoonProviders: AvailableIntegration[] = [
	{
		provider: "linkedin",
		displayName: "LinkedIn",
		icon: "linkedin",
		description: "Import your professional profile",
		available: false,
		comingSoon: true,
	},
	{
		provider: "notion",
		displayName: "Notion",
		icon: "book-open",
		description: "Import your notes and documents",
		available: false,
		comingSoon: true,
	},
	{
		provider: "youtube",
		displayName: "YouTube",
		icon: "youtube",
		description: "Import your videos and playlists",
		available: false,
		comingSoon: true,
	},
	{
		provider: "substack",
		displayName: "Substack",
		icon: "newspaper",
		description: "Import your posts and newsletter",
		available: false,
		comingSoon: true,
	},
];

export function register(adapter: IntegrationAdapter): void {
	adapters.set(adapter.provider, adapter);
}

export function get(provider: string): IntegrationAdapter | undefined {
	return adapters.get(provider);
}

export function list(): IntegrationAdapter[] {
	return Array.from(adapters.values());
}

export function getAvailable(): AvailableIntegration[] {
	const registered: AvailableIntegration[] = list().map((adapter) => ({
		provider: adapter.provider,
		displayName: adapter.displayName,
		icon: adapter.icon,
		description: adapter.description,
		available: true,
	}));

	return [...registered, ...comingSoonProviders];
}
