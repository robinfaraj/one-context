import { Card, CardContent, CardHeader, CardTitle } from "@ui/components/card";

export default function MemoriesPage() {
	return (
		<div className="flex flex-1 flex-col gap-4 p-4 pt-0">
			<h1 className="text-2xl font-semibold tracking-tight">Memories</h1>
			<Card>
				<CardHeader>
					<CardTitle>Memories</CardTitle>
				</CardHeader>
				<CardContent>
					<p className="text-muted-foreground">
						Browse and search your stored knowledge. Coming soon.
					</p>
				</CardContent>
			</Card>
		</div>
	);
}
