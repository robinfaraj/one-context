import { Card, CardContent } from "@ui/components/card";
import { Skeleton } from "@ui/components/skeleton";
import { User } from "lucide-react";
import type { DashboardUser } from "../../lib/dashboard-api";

interface ProfileSummaryCardProps {
	user?: DashboardUser;
	isLoading: boolean;
}

function UserAvatar({ user }: { user: DashboardUser }) {
	const initials = (user.name ?? user.email ?? "?")
		.split(" ")
		.map((w) => w[0])
		.join("")
		.slice(0, 2)
		.toUpperCase();

	if (user.image) {
		return (
			<img
				src={user.image}
				alt={user.name ?? "User"}
				className="h-14 w-14 rounded-full object-cover ring-2 ring-primary/10"
			/>
		);
	}

	return (
		<div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 ring-2 ring-primary/10">
			{initials ? (
				<span className="text-lg font-semibold text-primary">{initials}</span>
			) : (
				<User className="h-6 w-6 text-primary" />
			)}
		</div>
	);
}

export function ProfileSummaryCard({
	user,
	isLoading,
}: ProfileSummaryCardProps) {
	if (isLoading) {
		return (
			<Card>
				<CardContent className="flex items-center gap-4 p-5">
					<Skeleton className="h-14 w-14 rounded-full" />
					<div className="flex flex-col gap-1.5">
						<Skeleton className="h-5 w-36" />
						<Skeleton className="h-4 w-48" />
					</div>
				</CardContent>
			</Card>
		);
	}

	if (!user) return null;

	return (
		<Card>
			<CardContent className="flex items-center gap-4 p-5">
				<UserAvatar user={user} />
				<div className="min-w-0 flex-1">
					<h2 className="truncate text-lg font-semibold tracking-tight">
						{user.name ?? "Welcome"}
					</h2>
					<p className="truncate text-sm text-muted-foreground">{user.email}</p>
				</div>
			</CardContent>
		</Card>
	);
}
