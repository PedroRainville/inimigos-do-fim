import { defineConfig } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
	base: '/inimigos-do-fim/',
	plugins: [react(), tsconfigPaths()],
	resolve: {
		alias: {
			"node:async_hooks": path.resolve(__dirname, "src/shims/node-async-hooks.js"),
		},
	},
});
