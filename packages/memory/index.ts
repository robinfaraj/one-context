export {
	add,
	search,
	get,
	getAll,
	update,
	deleteMemory,
	deleteAll,
	history,
} from "./src/client";

export type {
	AddMemoryOptions,
	Memory,
	SearchResult,
	MemoryHistory,
	AddResult,
	MemoryProvider,
} from "./src/types";

export { getMemoryProvider, setMemoryProvider } from "./src/provider";
export { Mem0Provider } from "./src/providers/mem0";
