"use client";

import { authClient } from "@onecontext/auth/client";
import { Input } from "@ui/components/input";
import { Label } from "@ui/components/label";
import { cn } from "@ui/lib/utils";
import { User } from "lucide-react";
import { useRef } from "react";

interface OnboardingStepProfileProps {
	user: { name?: string | null; email: string };
}

export function OnboardingStepProfile({ user }: OnboardingStepProfileProps) {
	const nameRef = useRef<HTMLInputElement>(null);

	const handleNameBlur = async () => {
		const name = nameRef.current?.value?.trim();
		if (name && name !== user.name) {
			await authClient.updateUser({ name });
		}
	};

	return (
		<div className="space-y-6">
			<div className="flex flex-col items-center gap-2">
				<div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-700/10">
					<User className="h-6 w-6 text-emerald-700" />
				</div>
				<h2 className="text-xl font-semibold">Tell us about yourself</h2>
				<p className="text-sm text-muted-foreground">
					Help your AI identity get to know you
				</p>
			</div>

			<div className="space-y-4">
				<div className="space-y-2">
					<Label htmlFor="name">Name</Label>
					<Input
						id="name"
						ref={nameRef}
						defaultValue={user.name ?? ""}
						placeholder="Your name"
						onBlur={handleNameBlur}
					/>
				</div>

				<div className="space-y-2">
					<Label htmlFor="role">Role / Title</Label>
					<Input id="role" placeholder="e.g. Full-Stack Developer" />
				</div>

				<div className="space-y-2">
					<Label htmlFor="bio">Bio</Label>
					<textarea
						id="bio"
						rows={3}
						placeholder="What are you working on?"
						className={cn(
							"flex w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm resize-none",
						)}
					/>
				</div>
			</div>
		</div>
	);
}
