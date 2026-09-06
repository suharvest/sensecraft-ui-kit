import { ConfigProvider, Empty } from 'antd';
import type { ComponentProps } from 'react';
import zhCN from 'antd/locale/zh_CN.js';
import enUS from 'antd/locale/en_US.js';
import { useTranslation } from 'react-i18next';
import { antdTheme } from '../theme';
import { COMMON_NAMESPACE, resolveLanguage } from '../i18n';

type ConfigProviderProps = ComponentProps<typeof ConfigProvider>;

const ANTD_LOCALE_MAP = { zh: zhCN, en: enUS } as const;

export type AppConfigProviderProps = ConfigProviderProps;

/**
 * antd `ConfigProvider` 的语言感知封装：跟随 kit i18n 当前语言（`common:language`）
 * 自动切 antd 内置 locale（分页器 / DatePicker / Table 筛选文案等），并把空态
 * （裸 `<Table>` / `<Select>` / `<List>` 触发的 `<Empty>`）文案换成 kit 词典的
 * `common:error.noData`，措辞与 `ListPage` 里手写的
 * `<Empty description={t('error.noData')} />` 保持一致 —— 不必给每个业务页里
 * 散落的裸 `<Table>` 单独传 `locale.emptyText`。
 *
 * 根因：只传 `theme={antdTheme}` 不传 `locale` 时，antd 内部组件的空态/分页文案
 * 落回英文默认值，与页面其余中文文案不一致，且不随 `changeLanguage` 切换。
 *
 * 宿主已经显式传了 `locale` 或 `renderEmpty` 时以宿主为准（可用于覆盖成业务定制文案）。
 */
export function AppConfigProvider({ locale, renderEmpty, theme, ...rest }: ConfigProviderProps) {
  const { t, i18n } = useTranslation(COMMON_NAMESPACE);
  const lang = resolveLanguage(i18n.language);

  return (
    <ConfigProvider
      theme={theme ?? antdTheme}
      locale={locale ?? ANTD_LOCALE_MAP[lang]}
      renderEmpty={renderEmpty ?? (() => <Empty description={t('error.noData')} />)}
      {...rest}
    />
  );
}
