import {
	countChats,
	countConnectedSources,
	findRecentContentItems,
	findSourcesByUserId,
} from "@onecontext/database/queries";
import { list } from "@onecontext/integrations";
import * as mem0 from "@onecontext/memory";

interface DashboardUser {
	id: string;
	name: string;
	email: string;
	image?: string | null;
}

export async function getDashboardData(user: DashboardUser) {
	const providers = list().map((a) => a.provider);

	const [memories, sourceCount, chatCount, connectedSources, contentItems] =
		await Promise.all([
			mem0.getAll(user.id),
			countConnectedSources(user.id, providers),
			countChats(user.id),
			findSourcesByUserId(user.id),
			findRecentContentItems(user.id),
		]);

	const memoryCount = Array.isArray(memories) ? memories.length : 0;

	const recentActivity = contentItems.map((item) => ({
		...item,
		contentType: item.type,
	}));

	return {
		user: {
			name: user.name,
			email: user.email,
			image: user.image,
		},
		stats: {
			memoryCount,
			sourceCount,
			chatCount,
		},
		connectedSources,
		recentActivity,
	};
}
