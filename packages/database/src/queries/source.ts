import { db } from "../client";

export async function findAccountByUserAndProvider(
	userId: string,
	provider: string,
) {
	return db.account.findFirst({
		where: { userId, providerId: provider },
	});
}

export async function upsertSource(userId: string, provider: string) {
	return db.source.upsert({
		where: { userId_provider: { userId, provider } },
		create: { userId, provider, status: "connected" },
		update: { status: "connected" },
	});
}

export async function findSourcesByUserId(userId: string) {
	return db.source.findMany({
		where: { userId },
		orderBy: { createdAt: "desc" },
	});
}

export async function findAccountsByUserId(userId: string) {
	return db.account.findMany({
		where: { userId },
		select: { providerId: true },
	});
}

export async function findSourceByUserAndProvider(
	userId: string,
	provider: string,
) {
	return db.source.findUnique({
		where: { userId_provider: { userId, provider } },
	});
}

export async function deleteContentItemsBySourceId(sourceId: string) {
	return db.contentItem.deleteMany({
		where: { sourceId },
	});
}

export async function markSourceDisconnected(sourceId: string) {
	return db.source.update({
		where: { id: sourceId },
		data: { status: "disconnected", lastSyncAt: null },
	});
}
