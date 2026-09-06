import { resolve } from 'node:path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import dts from 'vite-plugin-dts';

export default defineConfig({
  plugins: [
    react(),
    dts({ include: ['src'], outDir: 'dist', rollupTypes: false, entryRoot: 'src' }),
  ],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      formats: ['es'],
      fileName: () => 'index.js',
    },
    rollupOptions: {
      external: [
        'react',
        'react/jsx-runtime',
        'react-dom',
        'antd',
        'antd/es/locale/zh_CN',
        'antd/es/locale/en_US',
        '@ant-design/icons',
        'react-router-dom',
        'react-i18next',
        'i18next',
      ],
    },
    sourcemap: true,
    emptyOutDir: true,
  },
  test: {
    environment: 'jsdom',
    globals: true,
    include: ['test/**/*.test.{ts,tsx}'],
  },
} as any);
