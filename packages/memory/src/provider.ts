import { Mem0Provider } from "./providers/mem0";
import type { MemoryProvider } from "./types";

let _provider: MemoryProvider | undefined;

export function getMemoryProvider(): MemoryProvider {
	if (!_provider) {
		_provider = new Mem0Provider();
	}
	return _provider;
}

export function setMemoryProvider(provider: MemoryProvider): void {
	_provider = provider;
}
