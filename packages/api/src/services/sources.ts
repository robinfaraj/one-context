import {
	deleteContentItemsBySourceId,
	findAccountByUserAndProvider,
	findAccountsByUserId,
	findSourceByUserAndProvider,
	findSourcesByUserId,
	markSourceDisconnected,
	upsertSource,
} from "@onecontext/database/queries";
import {
	type AvailableIntegration,
	get,
	getAccessToken,
	getAvailable,
	persistSyncResult,
} from "@onecontext/integrations";
import { logger } from "@onecontext/logs";
import { deleteMemory, getAll } from "@onecontext/memory";
import { checkMemoryLimit, checkSourceLimit } from "../middleware/plan-limits";

export class SourceLimitError extends Error {
	constructor(
		public limit: number | "unlimited",
		public current: number,
	) {
		super("Source limit reached");
	}
}

export class MemoryLimitError extends Error {
	constructor(
		public limit: number | "unlimited",
		public current: number,
		public message: string,
	) {
		super(message);
	}
}

export class NotFoundError extends Error {}

export class BadRequestError extends Error {}

export async function connectSource(userId: string, provider: string) {
	const account = await findAccountByUserAndProvider(userId, provider);
	if (!account) {
		throw new BadRequestError(
			"No OAuth account found. Please connect via OAuth first.",
		);
	}

	const sourceCheck = await checkSourceLimit(userId);
	if (!sourceCheck.allowed) {
		throw new SourceLimitError(sourceCheck.limit, sourceCheck.current);
	}

	const source = await upsertSource(userId, provider);

	// Attempt initial sync
	const adapter = get(provider);
	const accessToken = await getAccessToken(userId, provider);
	if (!adapter || !accessToken) {
		return { source, syncResult: null };
	}

	try {
		const result = await adapter.sync(userId, accessToken);
		await persistSyncResult(source.id, userId, result);
		return {
			source,
			syncResult: {
				itemsSynced: result.contentItems.length,
				memoriesAdded: result.memoriesAdded,
			},
		};
	} catch (err) {
		logger.warn("Initial sync failed during source connect", {
			provider,
			userId,
			error: err,
		});
		return { source, syncResult: null };
	}
}

export async function listSources(userId: string) {
	const [allSources, accounts] = await Promise.all([
		findSourcesByUserId(userId),
		findAccountsByUserId(userId),
	]);

	const connectedSources = allSources.filter(
		(s) => s.status !== "disconnected",
	);

	const available = getAvailable();

	const integrations = available.map((integration: AvailableIntegration) => {
		const connected = connectedSources.find(
			(s) => s.provider === integration.provider,
		);
		return {
			...integration,
			connected: !!connected,
			source: connected ?? null,
		};
	});

	const knownProviders = new Set(allSources.map((s) => s.provider));
	const pendingConnections = accounts
		.map((a) => a.providerId)
		.filter((p) => !knownProviders.has(p));

	const disconnectedProviders = allSources
		.filter((s) => s.status === "disconnected")
		.map((s) => s.provider);

	return {
		integrations,
		connectedSources,
		pendingConnections,
		disconnectedProviders,
	};
}

export async function syncSource(userId: string, provider: string) {
	const source = await findSourceByUserAndProvider(userId, provider);
	if (!source) {
		throw new NotFoundError("Source not connected");
	}

	const adapter = get(provider);
	if (!adapter) {
		throw new NotFoundError("Integration not available");
	}

	const allMemories = await getAll(userId);
	const memoryCheck = await checkMemoryLimit(userId, allMemories.length);
	if (!memoryCheck.allowed) {
		throw new MemoryLimitError(
			memoryCheck.limit,
			memoryCheck.current,
			`Memory limit reached (${memoryCheck.current}/${memoryCheck.limit}). Upgrade your plan to sync more.`,
		);
	}

	const accessToken = await getAccessToken(userId, provider);
	if (!accessToken) {
		throw new BadRequestError(
			"No access token found. Please reconnect this source.",
		);
	}

	const result = await adapter.sync(userId, accessToken);
	await persistSyncResult(source.id, userId, result);

	return {
		provider,
		itemsSynced: result.contentItems.length,
		memoriesAdded: result.memoriesAdded,
	};
}

export async function disconnectSource(userId: string, provider: string) {
	const source = await findSourceByUserAndProvider(userId, provider);
	if (!source) {
		throw new NotFoundError("Source not connected");
	}

	// Delete Mem0 memories associated with this source
	let memoriesDeleted = 0;
	try {
		const allMemories = await getAll(userId);
		const sourceMemories = (allMemories as any[]).filter(
			(m) => m.metadata?.source === provider,
		);
		for (const memory of sourceMemories) {
			try {
				await deleteMemory(memory.id);
				memoriesDeleted++;
			} catch (e) {
				logger.warn(`Failed to delete Mem0 memory ${memory.id}`, { error: e });
			}
		}
	} catch (e) {
		logger.warn("Failed to fetch Mem0 memories for cleanup", { error: e });
	}

	await deleteContentItemsBySourceId(source.id);
	await markSourceDisconnected(source.id);

	return { provider, disconnected: true, memoriesDeleted };
}
