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
      entry: {
        index: resolve(__dirname, 'src/index.ts'),
        // 独立入口，见 src/vite/preset.ts 顶部注释：不引入 React，供宿主
        // vite.config.ts 在 Node 侧直接 import。
        'vite/preset': resolve(__dirname, 'src/vite/preset.ts'),
      },
      formats: ['es'],
      fileName: (_format: string, entryName: string) => `${entryName}.js`,
    },
    rollupOptions: {
      external: [
        'react',
        'react/jsx-runtime',
        'react-dom',
        'antd',
        'antd/locale/zh_CN.js',
        'antd/locale/en_US.js',
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
