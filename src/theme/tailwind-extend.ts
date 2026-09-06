import { borderRadius, colors, fontFamilySans, layoutSizes, zIndex } from './tokens';

/** 供各应用 tailwind.config.js 的 theme.extend 直接展开 */
export const tailwindExtend = {
  colors: {
    primary: {
      DEFAULT: colors.primary,
      hover: colors.primaryHover,
      active: colors.primaryActive,
      // AA 达标的深色系：文字压在主色块上、或主色本身当文字色时用这三档
      // （对比度依据见 src/theme/tokens.ts 注释）
      dark: colors.primaryDark,
      'dark-hover': colors.primaryDarkHover,
      'dark-active': colors.primaryDarkActive,
    },
    success: colors.success,
    warning: colors.warning,
    danger: colors.error,
    info: colors.info,
    border: colors.border,
    'bg-layout': colors.bgLayout,
    'text-main': colors.text,
    'text-secondary': colors.textSecondary,
    'text-muted': colors.textTertiary,
  },
  borderRadius: { ...borderRadius },
  zIndex: Object.fromEntries(Object.entries(zIndex).map(([k, v]) => [k, String(v)])),
  fontFamily: { sans: [...fontFamilySans] },
  spacing: { sidebar: `${layoutSizes.siderWidth}px`, header: `${layoutSizes.headerHeight}px` },
};

export default tailwindExtend;
