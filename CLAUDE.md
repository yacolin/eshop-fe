# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `pnpm dev` — 启动开发服务器（别名: `pnpm start`）
- `pnpm build` — 生产构建
- `pnpm format` — Prettier 格式化全部文件（含 import 排序、package.json 排序）
- `pnpm genapi` — 从 OpenAPI Swagger 文档重新生成所有 API 服务层代码（src/services/api/）
- `pnpm lint` — ESLint + Stylelint 检查
- `pnpm setup` — UmiJS 项目初始化（生成 .umi 临时文件）
- `pnpm postinstall` — 安装后自动 setup
- 提交前自动执行 lint-staged（ESLint fix + Prettier 格式化）

## Tech Stack

- **框架**: React 18 + TypeScript + **UmiJS Max 4**（插件集: antd, access, model, request, layout, initialState）
- **UI**: Ant Design 5 + @ant-design/pro-components（ProTable, ProDescriptions, ProForm 等）
- **图表**: @ant-design/charts（Dashboard 页面）
- **构建/包管理**: UmiJS 内置构建（utoopack）/ pnpm
- **代码生成**: @umijs/openapi 从后端 Swagger 自动生成 TypeScript API 层
- **实时通信**: 原生 WebSocket（自研 useWebSocket Hook）+ WebSocketContext 全局共享
- **代码规范**: ESLint + Prettier + Stylelint + Husky + lint-staged

## Architecture

### 路由 (`configs/routes.ts`)

集中式路由配置，按业务域分组（INVENTORY / SALES / REVIEW / USER），支持嵌套子路由和 access 权限守卫。布局统一由 UmiJS ProLayout 处理。

### 页面模式（ProTable CRUD 模板）

每个管理页面遵循统一结构:

```
src/pages/{Entity}/
  index.tsx          — ProTable 列表页（含 handleAdd / handleUpdate / handleRemove）
  components/
    CreateForm.tsx   — 新增弹窗表单
    UpdateForm.tsx   — 编辑弹窗表单（含 drawer 详情）
  hooks/             — 页面级自定义 Hook（如 useCategoryOptions）
```

典型流程: ProTable `request` 属性自动调用 API → 表格渲染 → 弹窗创建/编辑 → 刷新表格。

### API 服务层 (`src/services/api/`)

**由 `pnpm genapi` 从后端 Go 服务（eshop-monolith）的 Swagger 自动全量生成。** 不要手动修改这些文件。后端接口变更时需重新运行代码生成。每个文件对应一个资源域（auths, products, orders, categories, roles 等），类型定义在 `typings.d.ts` 中。

### 权限/访问控制

- **`src/access.ts`** — 定义全局权限函数，基于用户角色（admin/merchant）和细粒度权限（product:create 等）
- **`src/components/Auth/index.tsx`** — 按钮级权限守卫组件，检查 `access.ts` 中的权限键
- **路由级 access** 在 `configs/routes.ts` 中通过 `access: 'canManageRoles'` 配置
- `useModel('@@initialState')` 可在页面中刷新用户权限和角色

### 数据流

- **请求**: UmiJS request 插件（基于 fetch）+ 自动注入 access_token + 401 静默刷新
- **全局状态**: Umi model 插件（`src/models/global.ts` 示例）
- **实时数据**: WebSocketContext 全局共享连接状态，页面通过 `useWebSocketContext()` 消费

### WebSocket 实时通信

- 自研 `useWebSocket` Hook 封装在 `src/hooks/useWebSocket.ts`，支持:
  - 指数退避自动重连（最大 30s，最多 10 次）
  - 心跳保活（30s ping / 10s timeout）
  - 序列号去重与断线重连后的消息补发
- `WebSocketContext` 全局 Provider 共享连接状态 + 在线用户列表 + 消息订阅机制

### 配置

- **`src/app.ts`** — UmiJS 运行时配置，包含:
  - `getInitialState`: 登录态初始化（解析 JWT + 获取角色/权限）
  - `layout`: ProLayout 配置（logo, title, 混合布局, 右侧区域, 登出逻辑）
  - `request`: 请求/响应拦截器、业务错误处理、401 自动静默刷新 Token
  - `rootContainer`: 全局 WebSocketProvider 注入
- **`.umirc.ts`** — UmiJS 构建配置（路由、代理 `/api` → localhost:8080、插件开关）
- **`.openapi2tsrc.ts`** — OpenAPI 代码生成配置（Swagger 地址、输出路径）

### 跨页面导航

- `LinkText` 组件渲染可点击/可复制的文本，携带路由 state 跳转
- `useRouteFilter` Hook 从路由 state 读取初始筛选条件，自动回填 ProTable 搜索框
- 典型场景: 商品列表 → 库存列表（携带商品名称/SKU 筛选条件跳转）

### 错误处理约定

- 后端响应格式: `{ code: number, msg: string, data: any }`（code=0 表示成功）
- 前端在 `src/utils/request.ts` 中定义完整 BizError 枚举（通用 1001-1023 / 权限 2001-2999 / 令牌 4001-4999）
- 全局 errorHandler 根据错误码分级提示（UNAUTHORIZED 跳转登录、INSUFFICIENT_PERMISSIONS 弹权限提示等）

### 关键目录结构

```
configs/routes.ts              — 路由配置
src/
  access.ts                    — 权限定义
  app.ts                       — 运行时配置（核心）
  constants/index.ts           — 常量（订单状态映射等）
  utils/
    auth.ts                    — JWT 解析工具
    request.ts                 — 请求配置（错误码 + 拦截器）
  hooks/                       — 通用 Hooks（useWebSocket, useRouteFilter）
  contexts/                    — React Context（WebSocketContext）
  components/                  — 通用组件（Auth, LinkText, RightContent, NotifyBell, CacheWarmup）
  models/                      — Umi model 全局状态
  services/api/                — 自动生成的 API 服务层（勿手动修改）
  pages/                       — 页面组件
mock/                          — 开发环境 mock 数据
```
