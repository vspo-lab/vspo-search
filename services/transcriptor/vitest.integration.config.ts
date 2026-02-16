import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

export default defineConfig({
	resolve: {
		alias: {
			"@vspo/errors": fileURLToPath(
				new URL("../../packages/errors/index.ts", import.meta.url),
			),
		},
	},
	test: {
		environment: "node",
		include: ["src/**/*.integration.test.ts"],
		exclude: ["node_modules", "dist"],
	},
});
