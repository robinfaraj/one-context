import { Button } from "@ui/components/button";
import { Card, CardContent } from "@ui/components/card";
import { FileQuestion } from "lucide-react";
import Link from "next/link";

export default function NotFound() {
	return (
		<div className="flex min-h-svh items-center justify-center p-4">
			<Card className="w-full max-w-md">
				<CardContent className="flex flex-col items-center gap-4 pt-8 pb-8 text-center">
					<FileQuestion className="h-10 w-10 text-emerald-700" />
					<div className="space-y-1">
						<h2 className="text-lg font-semibold">Page not found</h2>
						<p className="text-sm text-muted-foreground">
							The page you're looking for doesn't exist.
						</p>
					</div>
					<Button asChild className="bg-emerald-700 hover:bg-emerald-800">
						<Link href="/dashboard">Go to Dashboard</Link>
					</Button>
				</CardContent>
			</Card>
		</div>
	);
}
