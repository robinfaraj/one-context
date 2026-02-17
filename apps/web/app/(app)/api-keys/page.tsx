"use client";

import { ApiKeyManager } from "@shared/components/api/api-key-manager";
import { McpSetupGuide } from "@shared/components/api/mcp-setup-guide";
import { RestApiEndpoints } from "@shared/components/api/rest-api-endpoints";

export default function ApiPage() {
	return (
		<div className="flex flex-1 flex-col gap-4 p-4 pt-0">
			<h1 className="text-2xl font-semibold tracking-tight">API & MCP</h1>
			<ApiKeyManager />
			<McpSetupGuide />
			<RestApiEndpoints />
		</div>
	);
}
