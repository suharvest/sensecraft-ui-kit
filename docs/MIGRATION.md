# 接入说明（按应用类型）

策略分类沿用 `seeed-solutions-hub/docs/reports/ui-consistency-audit-2026-09-06.md`：

- **a** —— 迁移到 React + antd，整体接 kit
- **b** —— 已是 React/Vue 组件化，内部整改，接 kit 中能接的部分
- **c** —— 不改技术栈，只对齐配色（套 CSS 变量）

三类应用能用到的 kit 部分不同：React 应用拿组件 + token + i18n；Vue 应用只能拿 token（组件不跨框架）；原生 JS 应用拿 `dist/tokens.css`。

---

## 一、React 应用（新建，或已是 React）

对象：`unmanned-store-access`、`edge-retail-recognition`（新建）、`sensecraft-voice-web`（策略 b）、
`eldercare-alarm` / `warehouse_system` / `Solution_HVAC_SmartControl`（策略 a 完成技术栈迁移之后）。

1. 装依赖：`"@sensecraft/ui-kit": "git+ssh://…#v0.1.0"`，peerDeps 里的 react / antd / react-router-dom / react-i18next 自己装
2. 按 README「接入三步」接 `ConfigProvider` → `AppShell` → `initI18n`
3. 列表页用 `ListPage`，详情页用 `DetailPage`，新增/编辑弹窗用 `FormModal`，状态列一律 `StatusTag`

已有 React 应用（策略 b）额外要做的清理：

- 删掉自己 repo 里的 `src/theme/antd-theme.ts`，改从 kit 导入 `antdTheme`；本地只保留应用特有的覆盖项
- 删掉 `index.css` 里为表格 hover 打的 `!important` 补丁，行为改由 `Table` 的 `rowHoverBg` token 提供
- Tooltip 的 `zIndexPopup: 9999` 去掉，用 kit 的 `1100` 分层值
- 二元 `success/error` 标签改为四态 `StatusTag`
- 硬编码中文文案迁到 i18n：公共词条直接用 `common:` namespace，业务词条开自己的 namespace

## 二、Vue 应用（保留框架，只套 token）

对象：`solution-indoor-positioning/web`（Vue3 + vue-router + vue-i18n）、`Solution_HVAC_SmartControl/frontend`（迁移前的过渡期）。

React 组件不跨框架，Vue 侧只接 token 层，两条路：

**路线 1：直接引 CSS 变量（推荐，零构建改动）**

```js
// main.ts
import '@sensecraft/ui-kit/tokens.css';
```

```css
.status-badge.is-warning {
  background: var(--sc-status-warning-bg);
  color: var(--sc-status-warning-fg);
}
.panel { border-radius: var(--sc-radius-lg); }
.app-sider { width: var(--sc-layout-sider-width); }
```

**路线 2：JS 侧读同一份 token 对象**（用 Element Plus / Naive UI 等需要 JS 主题配置时）

```ts
import { colors, statusColors, borderRadius } from '@sensecraft/ui-kit';
// 映射进 Element Plus 的 CSS 变量或 Naive UI 的 themeOverrides
```

Vue 应用不要复制粘贴色值，只从上面两条路取，改 token 时才能一次生效。
vue-i18n 的词典可以对照 `commonResources` 的键结构手工对齐（同名 key 便于日后统一），但不要把 kit 的 i18next 实例引进 Vue。

## 三、原生 JS / 静态页应用（策略 c，只对齐配色）

对象：`edge-inspection-surface`、`edge-inspection-assembly`、`edge-waste-sorting`、`agri-env-monitor`（HA Lovelace 主题变量层面）。

1. 把 `dist/tokens.css` 拷进静态资源目录，或在页面里直接引：

```html
<link rel="stylesheet" href="./vendor/sensecraft-tokens.css" />
```

2. 把页面里散落的色值换成变量：

```css
.btn-primary { background: var(--sc-color-primary); border-radius: var(--sc-radius-md); }
.card        { border: 1px solid var(--sc-color-border); border-radius: var(--sc-radius-lg); }
body         { background: var(--sc-color-bg-layout); font-family: var(--sc-font-sans); }
```

3. 状态徽标直接用文件里自带的 `.sc-status-badge` + `.sc-status-{normal|warning|danger|disabled}` 类，不用自己再配色

`tokens.css` 由 `scripts/gen-tokens-css.mjs` 从 `src/theme/tokens.ts` 生成，与 antd theme 同源，
所以 React 应用和静态页面上的同一语义色数值必然一致，不存在两处各自维护漂移的问题。

变量清单（前缀 `--sc-`）：

| 组 | 变量 |
|---|---|
| 颜色 | `--sc-color-primary` `--sc-color-primary-hover` `--sc-color-primary-active` `--sc-color-success` `--sc-color-warning` `--sc-color-error` `--sc-color-info` `--sc-color-bg-container` `--sc-color-bg-layout` `--sc-color-border` `--sc-color-text` `--sc-color-text-secondary` `--sc-color-text-tertiary` |
| 四态 | `--sc-status-{normal,warning,danger,disabled}-{bg,fg}` |
| 圆角 | `--sc-radius-{none,sm,base,md,lg,full}` |
| 层级 | `--sc-z-{dropdown,sticky,modal,tooltip}` |
| 布局 | `--sc-layout-{sider-width,sider-collapsed-width,header-height,content-padding}` |
| 弹窗 | `--sc-modal-width-{small,default,large}` |
| 字体 | `--sc-font-sans` |

---

## 落地顺序

审计报告给的顺序（风险从低到高）：`eldercare-alarm` 验证 → kit v0.1 →
`unmanned-store-access` / `edge-retail-recognition` 新建 → `sensecraft-voice-web` 反向接入 →
`solution-indoor-positioning`（验证 token 跨框架）→ `warehouse_system` → `Solution_HVAC_SmartControl`。
策略 c 的静态页只依赖 `tokens.css`，不依赖 kit 成熟度，可以穿插进行。

## 版本约定

各应用锁 tag（`#v0.1.0`），不锁分支。kit 接口有破坏性变更时升次版本号并在本文件补迁移步骤。
