"use client";

import { authClient } from "@shared/lib/api";
import { Button } from "@ui/components/button";
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@ui/components/card";
import { Input } from "@ui/components/input";
import { Label } from "@ui/components/label";
import { Separator } from "@ui/components/separator";
import { Github, Loader2, Twitter } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const loginSchema = z.object({
	email: z.string().email("Please enter a valid email"),
	password: z.string().min(1, "Password is required"),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function LoginPage() {
	const router = useRouter();
	const [isLoading, setIsLoading] = useState(false);
	const [socialLoading, setSocialLoading] = useState<string | null>(null);

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<LoginForm>({
		resolver: async (values) => {
			const result = loginSchema.safeParse(values);
			if (result.success) {
				return { values: result.data, errors: {} };
			}
			const fieldErrors: Record<string, { message: string }> = {};
			for (const issue of result.error.issues) {
				const field = issue.path[0] as string;
				if (!fieldErrors[field]) {
					fieldErrors[field] = { message: issue.message };
				}
			}
			return { values: {}, errors: fieldErrors };
		},
	});

	async function onSubmit(data: LoginForm) {
		setIsLoading(true);
		try {
			const { error } = await authClient.signIn.email({
				email: data.email,
				password: data.password,
			});
			if (error) {
				toast.error(error.message);
				return;
			}
			router.push("/dashboard");
		} catch {
			toast.error("Something went wrong. Please try again.");
		} finally {
			setIsLoading(false);
		}
	}

	function handleSocialLogin(provider: "github" | "twitter") {
		setSocialLoading(provider);
		authClient.signIn.social({
			provider,
			callbackURL: "/dashboard",
		});
	}

	return (
		<>
			<title>Log In | OneContext</title>
			<Card>
				<CardHeader>
					<CardTitle className="font-instrument-serif text-center">
						Sign in
					</CardTitle>
				</CardHeader>
				<CardContent>
					<form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
						<div className="space-y-2">
							<Label htmlFor="email">Email</Label>
							<Input
								id="email"
								type="email"
								placeholder="you@example.com"
								{...register("email")}
							/>
							{errors.email && (
								<p className="text-sm text-destructive">
									{errors.email.message}
								</p>
							)}
						</div>
						<div className="space-y-2">
							<Label htmlFor="password">Password</Label>
							<Input
								id="password"
								type="password"
								placeholder="••••••••"
								{...register("password")}
							/>
							{errors.password && (
								<p className="text-sm text-destructive">
									{errors.password.message}
								</p>
							)}
						</div>
						<Button
							type="submit"
							className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
							disabled={isLoading}
						>
							{isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
							Sign in
						</Button>
					</form>

					<div className="relative my-6">
						<Separator />
						<span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-card px-2 text-xs text-muted-foreground">
							or
						</span>
					</div>

					<div className="space-y-3">
						<Button
							variant="outline"
							className="w-full"
							onClick={() => handleSocialLogin("github")}
							disabled={socialLoading !== null}
						>
							{socialLoading === "github" ? (
								<Loader2 className="mr-2 h-4 w-4 animate-spin" />
							) : (
								<Github className="mr-2 h-4 w-4" />
							)}
							Continue with GitHub
						</Button>
						<Button
							variant="outline"
							className="w-full"
							onClick={() => handleSocialLogin("twitter")}
							disabled={socialLoading !== null}
						>
							{socialLoading === "twitter" ? (
								<Loader2 className="mr-2 h-4 w-4 animate-spin" />
							) : (
								<Twitter className="mr-2 h-4 w-4" />
							)}
							Continue with X
						</Button>
					</div>
				</CardContent>
				<CardFooter className="justify-center">
					<p className="text-sm text-muted-foreground">
						Don&apos;t have an account?{" "}
						<Link href="/signup" className="text-primary hover:underline">
							Sign up
						</Link>
					</p>
				</CardFooter>
			</Card>
		</>
	);
}
