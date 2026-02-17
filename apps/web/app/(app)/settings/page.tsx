"use client";

import { DangerZone } from "@shared/components/settings/danger-zone";
import { ProfileForm } from "@shared/components/settings/profile-form";
import { SyncSettings } from "@shared/components/settings/sync-settings";
import { authClient } from "@shared/lib/api";
import { Skeleton } from "@ui/components/skeleton";

export default function SettingsPage() {
	const { data: session, isPending } = authClient.useSession();

	if (isPending) {
		return (
			<div className="flex flex-1 flex-col gap-4 p-4 pt-0">
				<title>Settings | OneContext</title>
				<h1 className="text-2xl font-semibold tracking-tight">Settings</h1>
				<Skeleton className="h-64 w-full rounded-lg" />
				<Skeleton className="h-24 w-full rounded-lg" />
				<Skeleton className="h-40 w-full rounded-lg" />
			</div>
		);
	}

	if (!session?.user) return null;

	const user = session.user as typeof session.user & {
		profileSummary?: string | null;
		syncEnabled?: boolean;
	};

	return (
		<div className="flex flex-1 flex-col gap-4 p-4 pt-0">
			<title>Settings | OneContext</title>
			<h1 className="text-2xl font-semibold tracking-tight">Settings</h1>

			<ProfileForm
				user={{
					name: user.name,
					email: user.email,
					profileSummary: user.profileSummary ?? null,
				}}
			/>

			<SyncSettings syncEnabled={user.syncEnabled ?? true} />

			<DangerZone />
		</div>
	);
}
