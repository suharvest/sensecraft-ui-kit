/**
 * 单一 token 源 —— antd theme、Tailwind extend、dist/tokens.css 三份产物都由这里生成，
 * 数值出处见 docs/specs/ui-style-guide.md §1.5（seeed-solutions-hub）。
 */

export const colors = {
  primary: '#8CC020',
  primaryHover: '#7aad1c',
  primaryActive: '#689a18',
  /**
   * 对比度规则与派生色（docs/specs/ui-style-guide.md §1.1）：
   * 品牌绿 #8CC020 对白字仅 2.17:1，对白底也仅 2.17:1，均低于 WCAG AA 4.5:1，
   * 不能直接承载文字。凡"文字压在主色块上"或"主色作为文字色"的场景，
   * 一律改用 primaryDark 系（对白 4.78:1，对 bgLayout 4.56:1），primary 本身
   * 只保留给不承载文字的装饰/强调用途（图标、边框、阴影色）。
   * 取值：primaryDark = primary 整体调暗 35%，hover/active 依次再调暗 5%，
   * 与 primaryHover/primaryActive 的调暗节奏保持一致，可用 scripts 里的
   * 对比度校验脚本复算（见 test/theme.test.ts 的 WCAG 断言）。
   */
  primaryDark: '#5B7D15',
  primaryDarkHover: '#547313',
  primaryDarkActive: '#4D6A12',
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

/**
 * 四态语义色的背景/前景对（背景沿用 warehouse design-system 的 .status-badge，
 * 前景改为对应色相调暗后的 AA 达标值——原始 colorSuccess/Warning/Error/
 * textTertiary 直接当文字色用在这几个浅底上时，对比度只有 1.78~2.97:1，
 * 全部低于 WCAG AA 4.5:1，见 docs/reports/positioning-ux-review-2026-09-06.md §6）
 */
export const statusColors = {
  normal: { bg: '#effce8', fg: '#357f11' },
  warning: { bg: '#fff7e6', fg: '#96680c' },
  danger: { bg: '#fff1f0', fg: '#c73c3e' },
  disabled: { bg: '#f5f5f5', fg: '#6a6f77' },
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
