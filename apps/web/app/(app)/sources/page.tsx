import { Card, CardContent, CardHeader, CardTitle } from "@ui/components/card";

export default function SourcesPage() {
	return (
		<div className="flex flex-1 flex-col gap-4 p-4 pt-0">
			<h1 className="text-2xl font-semibold tracking-tight">Sources</h1>
			<Card>
				<CardHeader>
					<CardTitle>Sources</CardTitle>
				</CardHeader>
				<CardContent>
					<p className="text-muted-foreground">
						Connect and manage your data sources. Coming soon.
					</p>
				</CardContent>
			</Card>
		</div>
	);
}
