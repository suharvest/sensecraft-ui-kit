import { describe, expect, it } from 'vitest';
import {
  antdTheme,
  borderRadius,
  colors,
  getStatusColor,
  statusBadgeStatus,
  statusPalette,
  statusTagColor,
  tailwindExtend,
  zIndex,
} from '../src/theme';

describe('design token', () => {
  it('主色与派生色沿用风格指南 §1.5 的数值', () => {
    expect(colors.primary).toBe('#8CC020');
    expect(antdTheme.token?.colorPrimary).toBe('#8CC020');
    expect(antdTheme.token?.colorSuccess).toBe('#52c41a');
    expect(antdTheme.token?.colorInfo).toBe('#1890ff');
    expect(antdTheme.token?.borderRadius).toBe(8);
  });

  it('组件级 token 与 Tailwind 刻度同源', () => {
    expect(antdTheme.components?.Card?.borderRadius).toBe(parseInt(borderRadius.lg, 10));
    expect(antdTheme.components?.Button?.controlHeight).toBe(40);
    expect(tailwindExtend.borderRadius.md).toBe('8px');
    expect(tailwindExtend.zIndex.tooltip).toBe('1100');
  });

  it('Tooltip z-index 采用分层方案而非 9999', () => {
    expect(antdTheme.components?.Tooltip?.zIndexPopup).toBe(zIndex.tooltip);
    expect(zIndex.tooltip).toBe(1100);
  });
});

describe('四态语义色映射', () => {
  it('映射到 antd Tag color', () => {
    expect(statusTagColor).toEqual({
      normal: 'success',
      warning: 'warning',
      danger: 'error',
      disabled: 'default',
    });
  });

  it('映射到 antd Badge status', () => {
    expect(statusBadgeStatus.normal).toBe('success');
    expect(statusBadgeStatus.disabled).toBe('default');
  });

  it('色值对背景沿用 warehouse 的 status-badge，前景为 AA 达标的调暗值', () => {
    expect(getStatusColor('warning')).toEqual({ bg: '#fff7e6', fg: '#96680c' });
    expect(statusPalette.normal.fg).toBe('#357f11');
    expect(Object.keys(statusPalette)).toEqual(['normal', 'warning', 'danger', 'disabled']);
  });
});

describe('WCAG 对比度门（docs/reports/positioning-ux-review-2026-09-06.md §6）', () => {
  // WCAG 2.1 相对亮度/对比度公式
  const srgbToLin = (c: number) => {
    const v = c / 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  };
  const relLum = (hex: string) => {
    const h = hex.replace('#', '');
    const r = parseInt(h.slice(0, 2), 16);
    const g = parseInt(h.slice(2, 4), 16);
    const b = parseInt(h.slice(4, 6), 16);
    return 0.2126 * srgbToLin(r) + 0.7152 * srgbToLin(g) + 0.0722 * srgbToLin(b);
  };
  const contrast = (a: string, b: string) => {
    const l1 = relLum(a);
    const l2 = relLum(b);
    const lighter = Math.max(l1, l2);
    const darker = Math.min(l1, l2);
    return (lighter + 0.05) / (darker + 0.05);
  };
  const AA_NORMAL = 4.5;

  it('主按钮：文字（白）在按钮底（primaryDark）上 ≥4.5:1', () => {
    expect(contrast('#ffffff', antdTheme.components?.Button?.colorPrimary as string)).toBeGreaterThanOrEqual(
      AA_NORMAL,
    );
  });

  it('侧栏选中项：文字（primaryDark）在选中底（bgLayout）上 ≥4.5:1', () => {
    const fg = antdTheme.components?.Menu?.itemSelectedColor as string;
    const bg = antdTheme.components?.Menu?.itemSelectedBg as string;
    expect(contrast(fg, bg)).toBeGreaterThanOrEqual(AA_NORMAL);
  });

  it('正文文字在容器背景上 ≥4.5:1', () => {
    expect(contrast(colors.text, colors.bgContainer)).toBeGreaterThanOrEqual(AA_NORMAL);
  });

  it('四态标签：文字在底色上 ≥4.5:1', () => {
    for (const [key, { fg, bg }] of Object.entries(statusPalette)) {
      expect(contrast(fg, bg), `status "${key}" fg/bg`).toBeGreaterThanOrEqual(AA_NORMAL);
    }
  });
});
