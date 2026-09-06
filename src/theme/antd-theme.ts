import type { ThemeConfig } from 'antd';
import { borderRadius, colors, fontFamilySans, layoutSizes, zIndex } from './tokens';

const radius = (key: keyof typeof borderRadius) => parseInt(borderRadius[key], 10);

export const antdTheme: ThemeConfig = {
  token: {
    colorPrimary: colors.primary,
    colorPrimaryHover: colors.primaryHover,
    colorPrimaryActive: colors.primaryActive,
    colorSuccess: colors.success,
    colorWarning: colors.warning,
    colorError: colors.error,
    colorInfo: colors.info,
    borderRadius: radius('md'),
    colorBgContainer: colors.bgContainer,
    colorBgLayout: colors.bgLayout,
    colorBorder: colors.border,
    colorText: colors.text,
    colorTextSecondary: colors.textSecondary,
    colorTextTertiary: colors.textTertiary,
    fontFamily: fontFamilySans.join(', '),
  },
  components: {
    Button: { borderRadius: radius('md'), controlHeight: 40, fontWeight: 500 },
    Card: {
      borderRadius: radius('lg'),
      boxShadow: '0 1px 3px 0 rgba(140,192,32,0.1)',
      bodyPadding: layoutSizes.contentPadding,
    },
    Table: {
      borderRadius: radius('md'),
      headerBg: colors.bgLayout,
      headerColor: colors.text,
      rowHoverBg: colors.bgLayout,
    },
    Input: { borderRadius: radius('md'), controlHeight: 40 },
    Select: { borderRadius: radius('md'), controlHeight: 40 },
    Tag: { borderRadius: radius('DEFAULT') },
    Menu: { itemBorderRadius: radius('md'), itemMarginInline: 8, itemMarginBlock: 4 },
    Layout: {
      headerBg: colors.bgContainer,
      siderBg: colors.bgContainer,
      bodyBg: colors.bgLayout,
      headerHeight: layoutSizes.headerHeight,
    },
    Tooltip: {
      zIndexPopup: zIndex.tooltip,
      colorBgSpotlight: '#000000',
      colorTextLightSolid: '#ffffff',
      borderRadius: radius('DEFAULT'),
    },
  },
};

export default antdTheme;
