/**
 * 独立入口 `@sensecraft/ui-kit/vite`，不引入 React —— 供宿主应用的 vite.config.ts 在
 * Node 侧（配置求值阶段）直接 import，不会把 React 相关代码带进配置文件的模块图。
 *
 * 根因：kit 以 `file:` 依赖接入时，Rollup 按“不同物理路径 = 不同模块”处理，
 * 会把 react-router-dom / i18next 等库各打包一份进宿主 bundle、一份进 kit 侧的
 * 依赖解析结果，两份模块级单例互不相认（Router context、i18next 实例对不上）。
 * dev 模式下 esbuild 预打包有时候恰好去重掉了，`vite build`（Rollup）不会，
 * 所以这个坑只在生产构建后现形，dev 环境看不出问题。
 *
 * 解决办法是 `resolve.dedupe` 强制这些包解析到宿主 node_modules 里的同一份，
 * 并用 `optimizeDeps.include` 让 esbuild 把它们（以及 kit 包本身）预打包，
 * 避免 dev/build 两种打包路径产生不一致的模块图。
 */

const KIT_PEER_DEPS = ['react', 'react-dom', 'antd', 'react-router-dom', 'react-i18next', 'i18next'];

export interface ViteKitPresetOptions {
  /** 除 kit 自身依赖外，宿主还想强制去重的包名 */
  extraDedupe?: string[];
  /** 除 kit 自身依赖外，宿主还想让 esbuild 预打包的包名 */
  extraOptimizeInclude?: string[];
}

export interface ViteKitPresetConfig {
  resolve: { dedupe: string[] };
  optimizeDeps: { include: string[] };
}

/**
 * 返回一份可直接喂给 `mergeConfig` 的 Vite 配置片段：
 *
 * ```ts
 * import { defineConfig, mergeConfig } from 'vite';
 * import { viteKitPreset } from '@sensecraft/ui-kit/vite';
 *
 * export default defineConfig(mergeConfig(viteKitPreset(), {
 *   plugins: [react()],
 *   // 应用自己的配置
 * }));
 * ```
 */
export function viteKitPreset(options: ViteKitPresetOptions = {}): ViteKitPresetConfig {
  const { extraDedupe = [], extraOptimizeInclude = [] } = options;

  return {
    resolve: {
      dedupe: [...KIT_PEER_DEPS, ...extraDedupe],
    },
    optimizeDeps: {
      include: [...KIT_PEER_DEPS, '@sensecraft/ui-kit', ...extraOptimizeInclude],
    },
  };
}
