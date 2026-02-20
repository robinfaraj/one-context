import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";

export interface CliConfig {
	apiUrl: string;
	apiKey: string;
}

const CONFIG_DIR = join(homedir(), ".onecontext");
const CONFIG_FILE = join(CONFIG_DIR, "config.json");
const DEFAULT_API_URL = "https://www.onecontext.dev";

export function getConfigPath(): string {
	return CONFIG_FILE;
}

export function readConfig(): CliConfig | null {
	if (!existsSync(CONFIG_FILE)) return null;
	try {
		const raw = readFileSync(CONFIG_FILE, "utf-8");
		return JSON.parse(raw) as CliConfig;
	} catch {
		return null;
	}
}

export function writeConfig(config: CliConfig): void {
	if (!existsSync(CONFIG_DIR)) {
		mkdirSync(CONFIG_DIR, { recursive: true, mode: 0o700 });
	}
	writeFileSync(CONFIG_FILE, `${JSON.stringify(config, null, 2)}\n`, {
		mode: 0o600,
	});
}

export function clearConfig(): void {
	if (existsSync(CONFIG_FILE)) {
		writeFileSync(CONFIG_FILE, "{}\n", { mode: 0o600 });
	}
}

export function getApiUrl(): string {
	return readConfig()?.apiUrl ?? DEFAULT_API_URL;
}

export function getApiKey(): string | null {
	return readConfig()?.apiKey ?? null;
}
