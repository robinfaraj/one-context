import { tavilySearch } from "@tavily/ai-sdk";
import type { Tool } from "ai";

let _webSearchTool: Tool | undefined;

export function getWebSearchTool(): Tool {
	if (!_webSearchTool) {
		_webSearchTool = tavilySearch({
			maxResults: 5,
			searchDepth: "basic",
		});
	}
	return _webSearchTool;
}
