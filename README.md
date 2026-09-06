# @sensecraft/ui-kit

SenseCraft 系列 demo 应用的共享前端基座：设计 token、应用外壳、页面模式、双语词典。
实现依据 `seeed-solutions-hub/docs/specs/ui-style-guide.md`（综合 sensecraft-voice-web 与 warehouse_system/frontend 两个基准）。

- 技术栈：React 18 + antd 5 + TypeScript，Vite library mode 产出 ESM + `.d.ts`
- 分发：git 依赖，不发 npm registry
- 附带 `dist/tokens.css`（纯 CSS 变量），供 Vue / 原生 JS 应用套同一套 token

## 安装

两种方式任选，版本以 tag 锁定。

```jsonc
// package.json —— git 依赖（推荐，多机协作用这个）
{
  "dependencies": {
    "@sensecraft/ui-kit": "git+ssh://git@<host>/<group>/sensecraft-ui-kit.git#v0.1.0"
  }
}
```

```jsonc
// package.json —— 本地路径（同一台机器上并排开发时用）
{
  "dependencies": {
    "@sensecraft/ui-kit": "file:../sensecraft-ui-kit"
  }
}
```

git 依赖方式下 npm 会在安装时执行 `prepare`，需要目标机器能拉到仓库并装得上 devDependencies；
若目标环境只想拿产物，可以在本仓库 `npm run build` 后把 `dist/` 一并提交到发布分支再引用该分支。

peerDependencies（宿主应用自己装）：`react` `react-dom` `antd@^5.12` `react-router-dom@^6.8` `react-i18next`。

## 接入三步

### 1. ConfigProvider 套主题

```tsx
import { ConfigProvider } from 'antd';
import { antdTheme } from '@sensecraft/ui-kit';

<ConfigProvider theme={antdTheme}>{/* ... */}</ConfigProvider>
```

Tailwind 侧（可选）在 `tailwind.config.js` 展开同源刻度：

```js
const { tailwindExtend } = require('@sensecraft/ui-kit');
module.exports = { theme: { extend: tailwindExtend } };
```

### 2. AppShell 包裹路由

```tsx
import { AppShell, ProtectedRoute } from '@sensecraft/ui-kit';
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';

const navigate = useNavigate();
const { pathname } = useLocation();

<Routes>
  <Route path="/login" element={<LoginRoute />} />
  <Route
    path="/*"
    element={
      <ProtectedRoute isAuthenticated={!!user} currentUserRole={user?.role}>
        <AppShell
          logo={{ icon: <Logo />, title: 'SenseCraft Console' }}
          menuItems={[
            { key: '/devices', label: t('common:nav.devices') },
            { key: '/users', label: t('common:nav.users'), minRole: 'admin' },
          ]}
          selectedKey={pathname}
          onMenuSelect={navigate}
          currentUserRole={user?.role}
          userName={user?.name}
          userMenuItems={[{ key: 'logout', label: t('common:auth.logout') }]}
          breadcrumb={[{ title: t('common:nav.dashboard') }]}
          versionText="v0.1.0"
        >
          <Routes>{/* 业务页 */}</Routes>
        </AppShell>
      </ProtectedRoute>
    }
  />
</Routes>
```

`minRole` 低于当前用户角色的菜单项会被过滤掉（角色权重 `view < operate < admin`）。

### 3. 初始化 i18n

```tsx
import { initI18n } from '@sensecraft/ui-kit';

initI18n({
  defaultLanguage: 'zh',
  resources: {
    zh: { app: { deviceName: '设备名称' } },
    en: { app: { deviceName: 'Device Name' } },
  },
});
```

公共词条落在 `common` namespace（`nav` / `action` / `status` / `time` / `filter` / `pagination` / `error` / `auth` / `language`），
业务词条自己开 namespace。语言选择写入 `localStorage['sensecraft.lang']`，`AppShell` 顶栏自带切换入口。

## 导出内容

| 分类 | 导出 |
|---|---|
| theme | `antdTheme` `tailwindExtend` `colors` `statusColors` `borderRadius` `zIndex` `layoutSizes` `modalWidth` `fontFamilySans` |
| 语义色 | `statusTagColor` `statusBadgeStatus` `statusPalette` `getStatusColor` `StatusTag` |
| layout | `AppShell` `filterMenuByRole` `ProtectedRoute` `LoginPage` |
| patterns | `FilterBar` `ListPage` `RowActions` `DetailPage` `FormModal` |
| i18n | `initI18n` `changeLanguage` `readStoredLanguage` `commonResources` `SUPPORTED_LANGUAGES` |
| 图标 | `MenuIcon` `GlobeIcon` `UserIcon` `InboxIcon`（内联 SVG，避免把 `@ant-design/icons` 变成硬依赖） |

## 设计约定摘要

- 主色 `#8CC020`，success 用标准绿 `#52c41a` 而非主色，避免品牌色与状态色语义重叠
- 状态一律四态：`normal` / `warning` / `danger` / `disabled`，映射到 antd `Tag` 的 `success/warning/error/default`
- 圆角刻度 `sm 4 / DEFAULT 6 / md 8 / lg 12 / full`；z-index 分层 `dropdown 100 / sticky 200 / modal 1000 / tooltip 1100`
- Sider 256px，Header 64px，内容区 padding 24px
- 登录走独立路由页，不用 Modal
- 不提供暗色模式

完整取舍理由见 `seeed-solutions-hub/docs/specs/ui-style-guide.md`；各类应用的接入路径见 [`docs/MIGRATION.md`](docs/MIGRATION.md)。

## 开发

```bash
npm install          # registry 走 .npmrc 里的 npmmirror
npm run typecheck
npm test
npm run build        # dist/index.js + d.ts + tokens.css
npm run playground   # http://127.0.0.1:5178
```

`dist/tokens.css` 由 `scripts/gen-tokens-css.mjs` 从构建产物读取 `src/theme/tokens.ts` 的同一份数值生成，
不手写，改 token 只改 `src/theme/tokens.ts`。
