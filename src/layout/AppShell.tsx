import { useMemo, useState, type ReactNode } from 'react';
import { Breadcrumb, Button, Dropdown, Layout, Menu, Space, Typography } from 'antd';
import type { MenuProps } from 'antd';
import { useTranslation } from 'react-i18next';
import { GlobeIcon, MenuIcon, UserIcon } from '../components/icons';
import { layoutSizes } from '../theme/tokens';
import { changeLanguage, SUPPORTED_LANGUAGES, type SupportedLanguage } from '../i18n';

export type UserRole = 'view' | 'operate' | 'admin';

const ROLE_WEIGHT: Record<UserRole, number> = { view: 0, operate: 1, admin: 2 };

export interface MenuItemDef {
  key: string;
  icon?: ReactNode;
  label: ReactNode;
  /** 低于该角色的用户看不到该菜单项（取自 warehouse 的 data-min-role 设计） */
  minRole?: UserRole;
  children?: MenuItemDef[];
}

export interface BreadcrumbItemDef {
  title: ReactNode;
  href?: string;
}

export interface AppShellProps {
  logo: { icon?: ReactNode; title: ReactNode };
  menuItems: MenuItemDef[];
  selectedKey?: string;
  onMenuSelect?: (key: string) => void;
  currentUserRole?: UserRole;
  userName?: ReactNode;
  userMenuItems?: MenuProps['items'];
  onUserMenuClick?: MenuProps['onClick'];
  breadcrumb?: BreadcrumbItemDef[];
  pageTitle?: ReactNode;
  extra?: ReactNode;
  versionText?: ReactNode;
  defaultCollapsed?: boolean;
  showLanguageSwitch?: boolean;
  children?: ReactNode;
}

export function filterMenuByRole(items: MenuItemDef[], role: UserRole = 'admin'): MenuItemDef[] {
  const allowed = ROLE_WEIGHT[role] ?? 0;
  return items
    .filter((item) => allowed >= ROLE_WEIGHT[item.minRole ?? 'view'])
    .map((item) => (item.children ? { ...item, children: filterMenuByRole(item.children, role) } : item));
}

function toAntdMenuItems(items: MenuItemDef[]): NonNullable<MenuProps['items']> {
  return items.map((item) => ({
    key: item.key,
    icon: item.icon,
    label: item.label,
    children: item.children ? toAntdMenuItems(item.children) : undefined,
  }));
}

/** 侧栏 + 顶栏 + 面包屑 + 内容区的标准外壳 */
export function AppShell(props: AppShellProps) {
  const {
    logo,
    menuItems,
    selectedKey,
    onMenuSelect,
    currentUserRole = 'admin',
    userName,
    userMenuItems,
    onUserMenuClick,
    breadcrumb,
    pageTitle,
    extra,
    versionText,
    defaultCollapsed = false,
    showLanguageSwitch = true,
    children,
  } = props;

  const [collapsed, setCollapsed] = useState(defaultCollapsed);
  const { t, i18n } = useTranslation('common');

  const visibleItems = useMemo(
    () => toAntdMenuItems(filterMenuByRole(menuItems, currentUserRole)),
    [menuItems, currentUserRole],
  );

  const languageMenu: MenuProps = {
    selectedKeys: [i18n.language?.startsWith('en') ? 'en' : 'zh'],
    items: SUPPORTED_LANGUAGES.map((lang) => ({ key: lang, label: t(`language.${lang}`) })),
    onClick: ({ key }) => changeLanguage(key as SupportedLanguage, i18n),
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Layout.Sider
        theme="light"
        collapsible
        collapsed={collapsed}
        trigger={null}
        width={layoutSizes.siderWidth}
        collapsedWidth={layoutSizes.siderCollapsedWidth}
        style={{ borderInlineEnd: '1px solid #f0f0f0' }}
      >
        <div
          data-testid="app-shell-logo"
          style={{
            height: layoutSizes.headerHeight,
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            padding: '0 16px',
            overflow: 'hidden',
            whiteSpace: 'nowrap',
          }}
        >
          {logo.icon}
          {!collapsed && (
            <Typography.Text strong style={{ fontSize: 16 }}>
              {logo.title}
            </Typography.Text>
          )}
        </div>
        <Menu
          mode="inline"
          items={visibleItems}
          selectedKeys={selectedKey ? [selectedKey] : undefined}
          onClick={({ key }) => onMenuSelect?.(key)}
          style={{ borderInlineEnd: 'none' }}
        />
        {!collapsed && versionText && (
          <div style={{ position: 'absolute', bottom: 12, left: 16, color: '#9ca3af', fontSize: 12 }}>
            {versionText}
          </div>
        )}
      </Layout.Sider>

      <Layout>
        <Layout.Header
          style={{
            height: layoutSizes.headerHeight,
            paddingInline: 16,
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            borderBottom: '1px solid #f0f0f0',
          }}
        >
          <Button
            type="text"
            aria-label="toggle-sider"
            icon={<MenuIcon />}
            onClick={() => setCollapsed((v) => !v)}
          />
          {pageTitle && (
            <Typography.Text strong style={{ fontSize: 16 }}>
              {pageTitle}
            </Typography.Text>
          )}
          <div style={{ marginInlineStart: 'auto' }}>
            <Space size={8}>
              {extra}
              {showLanguageSwitch && (
                <Dropdown menu={languageMenu} trigger={['click']}>
                  <Button type="text" icon={<GlobeIcon />} data-testid="lang-switch">
                    {t(`language.${i18n.language?.startsWith('en') ? 'en' : 'zh'}`)}
                  </Button>
                </Dropdown>
              )}
              <Dropdown
                menu={{ items: userMenuItems ?? [], onClick: onUserMenuClick }}
                trigger={['click']}
                disabled={!userMenuItems?.length}
              >
                <Button type="text" icon={<UserIcon />}>
                  {userName ?? t('auth.guest')}
                </Button>
              </Dropdown>
            </Space>
          </div>
        </Layout.Header>

        <Layout.Content style={{ padding: layoutSizes.contentPadding }}>
          {breadcrumb?.length ? (
            <Breadcrumb style={{ marginBottom: 16 }} items={breadcrumb.map((b) => ({ ...b }))} />
          ) : null}
          {children}
        </Layout.Content>
      </Layout>
    </Layout>
  );
}

export default AppShell;
