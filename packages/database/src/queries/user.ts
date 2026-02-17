import { db } from "../client";

export async function findUserById(userId: string) {
	return db.user.findUnique({ where: { id: userId } });
}

export async function findUserStripeCustomerId(userId: string) {
	return db.user.findUnique({
		where: { id: userId },
		select: { stripeCustomerId: true },
	});
}

export async function findUserPlan(userId: string) {
	return db.user.findUnique({
		where: { id: userId },
		select: { plan: true },
	});
}

export async function findUserForExport(userId: string) {
	return db.user.findUnique({
		where: { id: userId },
		select: {
			id: true,
			name: true,
			email: true,
			username: true,
			profileSummary: true,
			syncEnabled: true,
			createdAt: true,
		},
	});
}

export async function updateUser(
	userId: string,
	data: Record<string, string | boolean>,
) {
	return db.user.update({
		where: { id: userId },
		data,
	});
}

export async function deleteUser(userId: string) {
	return db.user.delete({ where: { id: userId } });
}
