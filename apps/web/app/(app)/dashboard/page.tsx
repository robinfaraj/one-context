import { Card, CardContent, CardHeader, CardTitle } from "@ui/components/card";

export default function DashboardPage() {
	return (
		<div className="flex flex-1 flex-col gap-4 p-4 pt-0">
			<h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
			<Card>
				<CardHeader>
					<CardTitle>Welcome to OneContext</CardTitle>
				</CardHeader>
				<CardContent>
					<p className="text-muted-foreground">
						Your AI identity dashboard. Coming soon.
					</p>
				</CardContent>
			</Card>
		</div>
	);
}
