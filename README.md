# @suharvest/ui-kit

Seeed SenseCraft 应用统一 UI 组件库 —— SenseCraft 系列应用的共享前端基座：设计 token、应用外壳、页面模式、双语词典。
以 MIT 许可开源（见 [LICENSE](./LICENSE)）。
实现依据 `seeed-solutions-hub/docs/specs/ui-style-guide.md`（综合 sensecraft-voice-web 与 warehouse_system/frontend 两个基准）。

- 技术栈：React 18 + antd 5 + TypeScript，Vite library mode 产出 ESM + `.d.ts`
- 分发：git tag 依赖（当前）；npm registry 发布后可切换为版本号依赖
- 附带 `dist/tokens.css`（纯 CSS 变量），供 Vue / 原生 JS 应用套同一套 token

## 安装

三种方式，按场景选。

### 1. git tag 依赖（当前推荐）

仓库转公开前，消费方机器需要配置好 GitHub SSH key；转公开后 `git+https://` 亦可。

```jsonc
// package.json
{
  "dependencies": {
    "@suharvest/ui-kit": "git+ssh://git@github.com/suharvest/sensecraft-ui-kit.git#v0.1.6"
  }
}
```

npm 安装 git 依赖时会克隆仓库、装 devDependencies、执行 `prepare`（即 `npm run build`），
`dist/` 在消费方机器上现场生成，因此本仓库不提交 `dist/`。
升级 kit 时改 tag 号后 `npm install` 即可；npm 会按 lockfile 里记录的 commit 锁定，
tag 改动不会自动生效，必须显式改 package.json 里的 tag 再安装。

### 2. npm registry（即将发布 `@suharvest/ui-kit`）

```jsonc
{
  "dependencies": {
    "@suharvest/ui-kit": "^0.1.6"
  }
}
```

包名 `@suharvest/ui-kit` 为 scoped 包，`publishConfig.access` 已设为 `public`。

### 3. 本地开发（`npm link`）

同一台机器上并排改 kit 和消费方时用 link，避免每次改动都要提交打 tag：

```bash
cd ~/project/sensecraft-ui-kit && npm run build && npm link
cd <消费方仓库>/web/ui && npm link @suharvest/ui-kit
# 改完 kit 后重新 build，消费方 dev server 会拾取
# 解除：npm unlink @suharvest/ui-kit && npm install
```

`npm link` 是符号链接，与 `file:` 依赖有同一个双份 React / Router 实例的坑，
必须配 `viteKitPreset()`（见下节）。git tag 依赖装进 `node_modules` 的是普通目录，
但 `viteKitPreset()` 仍需保留：它同时负责 `optimizeDeps` 与 antd 主题的 token 注入。

peerDependencies（宿主应用自己装）：`react` `react-dom` `antd@^5.12` `react-router-dom@^6.8` `react-i18next`。

## Vite 配置（必读）

kit 以 `file:` / `npm link` 方式接入时，Rollup 按物理路径分模块，`react` / `react-router-dom` / `antd` /
`react-i18next` / `i18next` 会各打包一份进宿主 bundle、一份进 kit 侧解析结果，两份模块级单例互不相认——
`react-router-dom` 报 `useLocation() may be used only in the context of a <Router>`，
`react-i18next` 的 `<Trans>` / `useTranslation` 拿不到已初始化的实例。dev 模式下 esbuild 预打包偶尔恰好去重掉，
`npm run build`（Rollup）不会，所以这个坑只在生产构建后现形，dev 环境看不出来。

统一用 `viteKitPreset()`（独立入口，不引入 React，`vite.config.ts` 在 Node 侧直接 import 也安全）：

```ts
// vite.config.ts
import { defineConfig, mergeConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { viteKitPreset } from '@suharvest/ui-kit/vite';

export default defineConfig(
  mergeConfig(viteKitPreset(), {
    plugins: [react()],
    // 应用自己的其余配置
  }),
);
```

`viteKitPreset()` 返回 `{ resolve: { dedupe }, optimizeDeps: { include } }`，覆盖 kit 自身的 peer 依赖；
需要额外去重/预打包的包用 `viteKitPreset({ extraDedupe: [...], extraOptimizeInclude: [...] })`。

**SPA 用 `file:` 依赖时必须宿主先 `npm run build` 再 `docker build`。**
`file:` 依赖在容器里就是一个真实目录拷贝，不会像 git 依赖那样在 `npm install` 时自带可执行的
构建产物；如果 Dockerfile 里跳过宿主构建、直接把源码整个拷进镜像再装依赖，装进去的是 kit 的
TypeScript 源文件而非 `dist/`，`import '@suharvest/ui-kit'` 会解析失败或对不上 `exports` 声明的路径。
正确顺序是本机（或 CI）先把 kit 构建好、`node_modules/@suharvest/ui-kit` 落地的是构建产物，
再执行宿主自己的 `npm run build` 和 `docker build`：

```dockerfile
# Dockerfile 片段：多阶段构建，前端产物在 builder 阶段生成好再拷进运行时镜像
FROM node:20-slim AS builder
WORKDIR /app
# kit 是 file: 依赖，必须和宿主源码一起进 builder 阶段，且要能拿到已经 build 过的 dist/
COPY sensecraft-ui-kit ./sensecraft-ui-kit
COPY web/ui ./web/ui
WORKDIR /app/web/ui
RUN npm ci && npm run build   # 此时 node_modules/@suharvest/ui-kit 已经是构建产物，不是源码

FROM nginx:alpine  # 或宿主自己的运行时基础镜像
COPY --from=builder /app/web/ui/dist /usr/share/nginx/html
```

## 接入三步

### 1. ConfigProvider 套主题

推荐用 `AppConfigProvider`——除了套主题，还会跟随当前语言传 antd 内置 `locale`（分页器/DatePicker
文案）和 `renderEmpty`（裸 `<Table>`/`<List>`/`<Select>` 的空态用 `common:error.noData` 词典，不再固定显示英文
"No data"）：

```tsx
import { AppConfigProvider } from '@suharvest/ui-kit';

<AppConfigProvider>{/* ... */}</AppConfigProvider>
```

只需要主题、不需要语言联动时仍可以用原生 `ConfigProvider`：

```tsx
import { ConfigProvider } from 'antd';
import { antdTheme } from '@suharvest/ui-kit';

<ConfigProvider theme={antdTheme}>{/* ... */}</ConfigProvider>
```

Tailwind 侧（可选）在 `tailwind.config.js` 展开同源刻度：

```js
const { tailwindExtend } = require('@suharvest/ui-kit');
module.exports = { theme: { extend: tailwindExtend } };
```

### 2. AppShell 包裹路由

```tsx
import { AppShell, ProtectedRoute } from '@suharvest/ui-kit';
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

> **必须传 `currentUserRole`。** `ProtectedRoute` 未传角色时按未授权处理（不再默认放行为 `admin`）；`AppShell` 未传角色时按最低角色 `'view'` 过滤菜单（不再默认显示 `admin` 菜单）。宿主应用应在用户信息加载完成后再传入真实角色，加载期间应展示加载态而不是把 `currentUserRole` 留空。

### 3. 初始化 i18n

```tsx
import { initI18n } from '@suharvest/ui-kit';

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
| ConfigProvider | `AppConfigProvider`（跟随当前语言传 antd `locale` + `renderEmpty`，用法见「接入三步 · 1」） |
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
