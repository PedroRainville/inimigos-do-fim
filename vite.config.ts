import { defineConfig } from "vite";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
	base: '/player-pool-pal/',
	resolve: {
		alias: {
			"node:async_hooks": path.resolve(__dirname, "src/shims/node-async-hooks.js"),
		},
	},
});
