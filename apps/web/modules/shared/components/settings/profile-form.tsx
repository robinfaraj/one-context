"use client";

import { Button } from "@ui/components/button";
import { Card, CardContent, CardHeader, CardTitle } from "@ui/components/card";
import { Input } from "@ui/components/input";
import { Label } from "@ui/components/label";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useUpdateProfile } from "../../lib/settings-api";

interface ProfileFormProps {
	user: {
		name: string;
		email: string;
		profileSummary?: string | null;
	};
}

export function ProfileForm({ user }: ProfileFormProps) {
	const [name, setName] = useState(user.name);
	const [profileSummary, setProfileSummary] = useState(
		user.profileSummary ?? "",
	);
	const updateProfile = useUpdateProfile();

	useEffect(() => {
		setName(user.name);
		setProfileSummary(user.profileSummary ?? "");
	}, [user.name, user.profileSummary]);

	const hasChanges =
		name !== user.name || profileSummary !== (user.profileSummary ?? "");

	function handleSubmit(e: React.FormEvent) {
		e.preventDefault();
		updateProfile.mutate({ name, profileSummary });
	}

	return (
		<Card>
			<CardHeader>
				<CardTitle className="text-lg">Profile</CardTitle>
			</CardHeader>
			<CardContent>
				<form onSubmit={handleSubmit} className="space-y-4">
					<div className="space-y-2">
						<Label htmlFor="name">Name</Label>
						<Input
							id="name"
							value={name}
							onChange={(e) => setName(e.target.value)}
							placeholder="Your name"
						/>
					</div>

					<div className="space-y-2">
						<Label htmlFor="email">Email</Label>
						<Input
							id="email"
							value={user.email}
							disabled
							className="opacity-60"
						/>
					</div>

					<div className="space-y-2">
						<Label htmlFor="profileSummary">Profile Summary</Label>
						<textarea
							id="profileSummary"
							value={profileSummary}
							onChange={(e) => setProfileSummary(e.target.value)}
							placeholder="A brief summary about you..."
							rows={3}
							className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
						/>
					</div>

					<Button
						type="submit"
						disabled={!hasChanges || updateProfile.isPending}
						className="bg-emerald-700 hover:bg-emerald-800"
					>
						{updateProfile.isPending && <Loader2 className="animate-spin" />}
						Save changes
					</Button>
				</form>
			</CardContent>
		</Card>
	);
}
