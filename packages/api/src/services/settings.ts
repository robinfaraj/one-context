import {
	deleteUser,
	findSourcesByUserId,
	findUserChatsWithMessages,
	findUserContentItems,
	findUserForExport,
	updateUser,
} from "@onecontext/database/queries";
import * as mem0 from "@onecontext/memory";

export async function updateProfile(
	userId: string,
	data: { name?: string; profileSummary?: string },
) {
	const updateData: Record<string, string> = {};
	if (data.name !== undefined) updateData.name = data.name;
	if (data.profileSummary !== undefined)
		updateData.profileSummary = data.profileSummary;

	if (Object.keys(updateData).length === 0) {
		return { error: "No fields to update" as const };
	}

	const updated = await updateUser(userId, updateData);
	return {
		name: updated.name,
		email: updated.email,
		profileSummary: updated.profileSummary,
	};
}

export async function updateSyncSettings(userId: string, syncEnabled: boolean) {
	const updated = await updateUser(userId, { syncEnabled });
	return { syncEnabled: updated.syncEnabled };
}

export async function exportUserData(userId: string) {
	const [profile, chats, sources, contentItems, memories] = await Promise.all([
		findUserForExport(userId),
		findUserChatsWithMessages(userId),
		findSourcesByUserId(userId),
		findUserContentItems(userId),
		mem0.getAll(userId),
	]);

	return {
		exportedAt: new Date().toISOString(),
		profile,
		chats,
		sources,
		contentItems,
		memories,
	};
}

export async function deleteAccount(userId: string) {
	try {
		await mem0.deleteAll(userId);
	} catch {
		// Continue even if Mem0 deletion fails
	}

	await deleteUser(userId);
}
