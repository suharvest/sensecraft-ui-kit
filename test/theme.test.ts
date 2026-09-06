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

  it('色值对来自 warehouse 的 status-badge', () => {
    expect(getStatusColor('warning')).toEqual({ bg: '#fff7e6', fg: '#faad14' });
    expect(statusPalette.normal.fg).toBe(colors.success);
    expect(Object.keys(statusPalette)).toEqual(['normal', 'warning', 'danger', 'disabled']);
  });
});
