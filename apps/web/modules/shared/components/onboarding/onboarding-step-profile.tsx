"use client";

import { authClient } from "@shared/lib/api";
import { Input } from "@ui/components/input";
import { Label } from "@ui/components/label";
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
				<div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
					<User className="h-6 w-6 text-primary" />
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
			</div>
		</div>
	);
}
