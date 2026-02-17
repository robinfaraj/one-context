import path from "node:path";
import { config } from "dotenv";
import { defineConfig } from "prisma/config";

// Load env vars - Prisma runs this config in a subprocess that doesn't inherit shell env
config({ path: path.resolve(__dirname, "../../.env.local") });

export default defineConfig({
	schema: "prisma/schema.prisma",
	migrations: {
		path: "prisma/migrations",
		seed: "npx tsx prisma/seed.ts",
	},
	datasource: {
		url: process.env.MIGRATION_DATABASE_URL,
	},
});
