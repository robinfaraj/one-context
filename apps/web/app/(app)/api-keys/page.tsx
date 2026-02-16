import { Card, CardContent, CardHeader, CardTitle } from "@ui/components/card";

export default function ApiPage() {
	return (
		<div className="flex flex-1 flex-col gap-4 p-4 pt-0">
			<h1 className="text-2xl font-semibold tracking-tight">API & MCP</h1>
			<Card>
				<CardHeader>
					<CardTitle>API & MCP</CardTitle>
				</CardHeader>
				<CardContent>
					<p className="text-muted-foreground">
						Manage API keys and MCP server configuration. Coming soon.
					</p>
				</CardContent>
			</Card>
		</div>
	);
}
