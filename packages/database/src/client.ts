import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import { PrismaClient } from "./generated/prisma/client";

const connectionString = process.env.DATABASE_URL;

// Create PostgreSQL connection pool
const pool = new Pool({
	connectionString,
});

// Create PrismaPg adapter with pool
const adapter = new PrismaPg(pool);

const prismaClientSingleton = () => {
	return new PrismaClient({
		adapter,
		log: [
			{ emit: "event", level: "query" },
			{ emit: "stdout", level: "error" },
			{ emit: "stdout", level: "warn" },
		],
	});
};

declare global {
	var prisma: undefined | ReturnType<typeof prismaClientSingleton>;
}

// biome-ignore lint/suspicious/noRedeclare: This is a singleton
const prisma = globalThis.prisma ?? prismaClientSingleton();

// Add query logging for debugging
if (prisma.$on) {
	prisma.$on("query", (e) => {
		if (e.duration > 2000) {
			console.warn(
				`[SLOW QUERY] ${e.query.substring(0, 80)}... took ${e.duration}ms`,
			);
		}
	});
}

if (process.env.NODE_ENV !== "production") {
	globalThis.prisma = prisma;
}

export { prisma as db };

// Re-export Prisma namespace with server-only features (like sql tagged template)
export { Prisma } from "./generated/prisma/client";
