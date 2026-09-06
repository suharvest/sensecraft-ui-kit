import { describe, expect, it } from 'vitest';
import { viteKitPreset } from '../src/vite/preset';

describe('viteKitPreset', () => {
  it('去重宿主与 kit 共用的 peer 依赖，避免 file: 依赖下 Rollup 打两份', () => {
    const preset = viteKitPreset();
    expect(preset.resolve.dedupe).toEqual(
      expect.arrayContaining(['react', 'react-dom', 'antd', 'react-router-dom', 'react-i18next', 'i18next']),
    );
  });

  it('把同一批依赖和 kit 自身加入 optimizeDeps.include', () => {
    const preset = viteKitPreset();
    expect(preset.optimizeDeps.include).toEqual(expect.arrayContaining(['react-router-dom', 'i18next', '@sensecraft/ui-kit']));
  });

  it('支持宿主追加自己的 dedupe / optimizeDeps 目标', () => {
    const preset = viteKitPreset({ extraDedupe: ['dayjs'], extraOptimizeInclude: ['dayjs'] });
    expect(preset.resolve.dedupe).toContain('dayjs');
    expect(preset.optimizeDeps.include).toContain('dayjs');
  });
});
