import { Card, CardContent, CardHeader, CardTitle } from "@ui/components/card";

export default function SettingsPage() {
	return (
		<div className="flex flex-1 flex-col gap-4 p-4 pt-0">
			<h1 className="text-2xl font-semibold tracking-tight">Settings</h1>
			<Card>
				<CardHeader>
					<CardTitle>Settings</CardTitle>
				</CardHeader>
				<CardContent>
					<p className="text-muted-foreground">
						Manage your account and preferences. Coming soon.
					</p>
				</CardContent>
			</Card>
		</div>
	);
}
