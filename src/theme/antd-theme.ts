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
    Button: {
      borderRadius: radius('md'),
      controlHeight: 40,
      fontWeight: 500,
      // 主按钮白字压在 colors.primary 上只有 2.17:1（WCAG AA 不达标），
      // 改用 primaryDark 系承载白字，比值见 tokens.ts 注释与 test/theme.test.ts。
      colorPrimary: colors.primaryDark,
      colorPrimaryHover: colors.primaryDarkHover,
      colorPrimaryActive: colors.primaryDarkActive,
      primaryColor: '#ffffff',
    },
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
    Menu: {
      itemBorderRadius: radius('md'),
      itemMarginInline: 8,
      itemMarginBlock: 4,
      // 侧栏选中项原用 colors.primary 当文字色，压在浅底上只有 3.22:1，
      // 改用 primaryDark（对 bgLayout 4.56:1）+ bgLayout 浅底承托。
      itemSelectedColor: colors.primaryDark,
      itemSelectedBg: colors.bgLayout,
    },
    Pagination: {
      // 当前页码文字默认压在 colorPrimary（primary，对白 2.17:1）上，不达标；
      // 改用 primaryDark（对白 4.78:1 / 对 bgLayout 4.56:1）。
      colorPrimary: colors.primaryDark,
      colorPrimaryHover: colors.primaryDarkHover,
    },
    Tabs: {
      // 选中项文字默认落到全局 colorPrimary（primary，对白 2.17:1，不达标），
      // 改用 primaryDark（对白 4.78:1）。inkBar 是标示选中态的功能性细线，
      // 按 WCAG 1.4.11 非文字 UI 3:1 门槛核算，primary 对白仅 2.17:1 同样不达标，
      // 一并改为 primaryDark。
      itemSelectedColor: colors.primaryDark,
      inkBarColor: colors.primaryDark,
    },
    Radio: {
      // Radio.Button 选中态边框/文字（outline）及实心态白字底色均落到 colorPrimary，
      // 文字场景对白仅 2.17:1（<4.5 不达标），非文字边框场景同样 <3:1，
      // 改用 primaryDark（对白 4.78:1）。
      colorPrimary: colors.primaryDark,
    },
    Checkbox: {
      // 选中框底色为 colorPrimary，勾选图标为固定白色，对比度 2.17:1（<3:1 非文字门槛不达标），
      // 改用 primaryDark（对白 4.78:1）。
      colorPrimary: colors.primaryDark,
    },
    Switch: {
      // 开启态滑轨底色为 colorPrimary，作为承载"开/关"状态的功能色块，
      // 对相邻页面底色仅 2.07~2.17:1（<3:1 非文字门槛不达标），改用 primaryDark。
      colorPrimary: colors.primaryDark,
    },
    Progress: {
      // 进度条填充色为 colorPrimary，是承载百分比信息的图形对象，
      // 按 WCAG 1.4.11 需 ≥3:1，primary 对白/对 bgLayout 仅 2.17/2.07:1，改用 primaryDark。
      colorPrimary: colors.primaryDark,
    },
    Steps: {
      // 当前步/完成步图标为白字压 colorPrimary 圆点（2.17:1，<4.5 不达标），
      // 连接线同为 colorPrimary 装饰线（<3:1 不达标），一并改用 primaryDark。
      colorPrimary: colors.primaryDark,
    },
    // 已核查未改动：
    // - Link/Typography.Link 的 colorLink 默认落到 colorInfo（#1890ff，对白 3.24:1），
    //   不经过 colorPrimary 链路，非本次"主色劫持"问题范围，不在此处处理。
    // - Card boxShadow 用 primary 做阴影色（装饰用途，不承载文字/状态判读），不动。
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
