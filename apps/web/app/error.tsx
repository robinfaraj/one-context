"use client";

import { Button } from "@ui/components/button";
import { Card, CardContent } from "@ui/components/card";
import { AlertTriangle } from "lucide-react";

export default function GlobalError({
	error,
	reset,
}: {
	error: Error & { digest?: string };
	reset: () => void;
}) {
	return (
		<html lang="en">
			<body>
				<div className="flex min-h-svh items-center justify-center p-4">
					<Card className="w-full max-w-md">
						<CardContent className="flex flex-col items-center gap-4 pt-8 pb-8 text-center">
							<AlertTriangle className="h-10 w-10 text-primary" />
							<div className="space-y-1">
								<h2 className="text-lg font-semibold">Something went wrong</h2>
								{error.message && (
									<p className="text-sm text-muted-foreground">
										{error.message}
									</p>
								)}
							</div>
							<Button
								onClick={reset}
								className="bg-primary hover:bg-primary/90"
							>
								Try again
							</Button>
						</CardContent>
					</Card>
				</div>
			</body>
		</html>
	);
}
