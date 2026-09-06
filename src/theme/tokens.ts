/**
 * 单一 token 源 —— antd theme、Tailwind extend、dist/tokens.css 三份产物都由这里生成，
 * 数值出处见 docs/specs/ui-style-guide.md §1.5（seeed-solutions-hub）。
 */

export const colors = {
  primary: '#8CC020',
  primaryHover: '#7aad1c',
  primaryActive: '#689a18',
  success: '#52c41a',
  warning: '#faad14',
  error: '#ff4d4f',
  info: '#1890ff',
  bgContainer: '#ffffff',
  bgLayout: '#f7fbf0',
  border: '#ddeec0',
  text: '#1f2937',
  textSecondary: '#64748b',
  textTertiary: '#9ca3af',
} as const;

/** 四态语义色的背景/前景对（来自 warehouse design-system 的 .status-badge） */
export const statusColors = {
  normal: { bg: '#effce8', fg: colors.success },
  warning: { bg: '#fff7e6', fg: colors.warning },
  danger: { bg: '#fff1f0', fg: colors.error },
  disabled: { bg: '#f5f5f5', fg: colors.textTertiary },
} as const;

export const borderRadius = {
  none: '0px',
  sm: '4px',
  DEFAULT: '6px',
  md: '8px',
  lg: '12px',
  full: '9999px',
} as const;

export const zIndex = {
  dropdown: 100,
  sticky: 200,
  modal: 1000,
  tooltip: 1100,
} as const;

export const layoutSizes = {
  siderWidth: 256,
  siderCollapsedWidth: 80,
  headerHeight: 64,
  contentPadding: 24,
} as const;

export const fontFamilySans = [
  'Inter',
  '-apple-system',
  'BlinkMacSystemFont',
  'Segoe UI',
  'Roboto',
  'Helvetica Neue',
  'Arial',
  'PingFang SC',
  'Microsoft YaHei',
  'sans-serif',
] as const;

/** antd Modal 尺寸预设（沿用 warehouse 的 modal-small / modal-large 两档） */
export const modalWidth = { small: 480, default: 720, large: 960 } as const;

export type StatusKey = keyof typeof statusColors;
