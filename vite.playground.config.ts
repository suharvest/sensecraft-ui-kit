import { resolve } from 'node:path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  root: resolve(__dirname, 'playground'),
  plugins: [react()],
  resolve: {
    alias: { '@sensecraft/ui-kit': resolve(__dirname, 'src/index.ts') },
  },
  build: { outDir: resolve(__dirname, 'playground-dist'), emptyOutDir: true },
  server: { port: 5178, host: '127.0.0.1' },
});
