---
name: code-standard
description: |
  eshop-fe 项目代码规范指南。当用户在 eshop-fe 项目中编写新页面、新 CRUD 组件、或者需要遵循项目代码风格时使用。本技能提供从目录结构、导入顺序、ProTable 配置、CRUD 操作、表单组件到权限守卫的完整规范。适用于以下场景：
  - 创建新的管理页面（如商品管理、订单管理等）
  - 编写或修改 CreateForm / UpdateForm 表单组件
  - 添加 ProTable 列定义或修改表格配置
  - 需要遵循项目统一的代码风格和架构模式
  - Review 代码时检查是否符合项目规范
  - 任何涉及 ProTable CRUD 模板、权限控制、API 调用的代码编写
  本技能专注于 eshop-fe 项目自身的约定，不涉及通用 React 或 TypeScript 规范。
---

# eshop-fe 项目代码规范

本规范基于 eshop-fe 现有页面代码（Category、Product、Inventory、Order、Role、Permission 等）的实际模式提炼而成。**新增和修改代码时请遵循以下约定。**

## 1. 目录结构

每个管理页面遵循统一结构:

```
src/pages/{Entity}/
  index.tsx                  — ProTable 列表页
  components/
    CreateForm.tsx           — 新增弹窗表单
    UpdateForm.tsx           — 编辑弹窗表单（含 drawer 详情）
  hooks/
    use{Entity}Options.ts    — 页面级自定义 Hook（如 useCategoryOptions）
```

**例外场景**：简单页面（无需独立表单组件）可将 Modal + ProForm 直接写在 index.tsx 中，但优先拆分为独立组件。

## 2. 导入规范

### 分组顺序（每组空行分隔）

```typescript
// 1. 第三方库（React / antd / ProComponents）
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import {
  PageContainer,
  ProDescriptions,
  ProTable,
} from '@ant-design/pro-components';
import { Button, Divider, Drawer, message, Popconfirm } from 'antd';
import React, { useRef, useState } from 'react';

// 2. 项目内部模块（@/components, @/hooks, @/constants, @umijs/max）
import Auth from '@/components/Auth';
import { ORDER_STATUS_MAP } from '@/constants';

// 3. API 服务层（@/services/api/*）
import {
  getProducts,
  postProducts,
  putProductsId,
  deleteProductsId,
} from '@/services/api/products';

// 4. 本地组件和 Hook（./components/*, ./hooks/*）
import CreateForm from './components/CreateForm';
import UpdateForm from './components/UpdateForm';
import type { FormValueType } from './components/UpdateForm';
import useCategoryOptions from './hooks/useCategoryOptions';
```

### 具体规则

- 类型导入使用 `import type` 语法，与值导入分开
- 本地路径以 `./` 开头，项目路径以 `@/` 开头
- `@/services/api/*` 中的方法按需导入，不使用 `import * as`
- 导入来源按外部 → 内部 → API → 本地的顺序排列

## 3. 组件命名

- 页面组件使用 PascalCase，以 `List` 或 `Page` 结尾：`ProductList`, `RoleList`, `UserInfoPage`
- 页面组件使用 `default export`
- 表单组件固定命名 `CreateForm` / `UpdateForm`，使用 `React.FC<Props>` 类型标注
- 辅助函数使用 camelCase：`handleAdd`, `handleUpdate`, `handleRemove`, `formatPrice`

## 4. 页面状态管理

每个页面内部使用 useState，集中定义在组件函数顶部：

```typescript
const {Entity}List: React.FC = () => {
  const [createModalVisible, handleModalVisible] = useState<boolean>(false);
  const [updateModalVisible, handleUpdateModalVisible] = useState<boolean>(false);
  const [stepFormValues, setStepFormValues] = useState<FormValueType>({});
  const [row, setRow] = useState<API.{Entity}>();
  const [selectedRowsState, setSelectedRows] = useState<API.{Entity}[]>([]);
  const actionRef = useRef<ActionType>();
  // ...
};
```

**命名约定**：

- 模态框可见性：`{openAction}ModalVisible` + `handle{OpenAction}ModalVisible`
- 编辑记录：`stepFormValues`, `editRecord` 或 `currentRow`
- 表格引用：`actionRef`（类型 `useRef<ActionType>()`）
- 抽屉详情行：`row`
- 批量选择：`selectedRowsState`

## 5. ProTable 配置

### 标准配置模板

```typescript
<ProTable<API.{Entity}>
  headerTitle="{中文标题}"
  actionRef={actionRef}
  rowKey="id"
  scroll={{ x: 1300 }}
  search={{
    labelWidth: 100,
    defaultCollapsed: false,
  }}
  toolBarRender={() => [
    <Auth permission="canCreate{Entity}">
      <Button type="primary" onClick={() => handleModalVisible(true)}>
        新建{Entity}
      </Button>
    </Auth>,
  ]}
  request={async (params) => {
    const { current, pageSize, ...rest } = params;
    const res = await get{Entity}s({ page: current || 1, size: pageSize || 10, ...rest });
    const data = (res as any).data || {};
    return { data: data.list || data.roles || data.permissions || [], total: data.total || 0, success: true };
  }}
  columns={columns}
  pagination={{
    defaultPageSize: 10,
    showSizeChanger: true,
    showQuickJumper: true,
    pageSizeOptions: ['10', '20', '50'],
    showTotal: (total) => `共 ${total} 条`,
  }}
/>
```

### 分页 request 映射规则

- ProTable 的 `current` → API 参数 `page`
- ProTable 的 `pageSize` → API 参数 `size` 或 `page_size`
- 返回格式固定为 `{ data: T[], total: number, success: boolean }`

### 列定义（`columns`）

**标准列集**：ID 列、创建时间/更新时间列、操作列。

```typescript
const columns: ProColumns<API.{Entity}>[] = [
  {
    title: 'ID',
    dataIndex: 'id',
    hideInForm: true,
    hideInSearch: true,
    width: 60,
    fixed: 'left',
  },
  // ... 业务字段列
  {
    title: '创建时间',
    dataIndex: 'created_at',
    valueType: 'dateTime',
    hideInForm: true,
    hideInSearch: true,
    width: 160,
  },
  {
    title: '操作',
    dataIndex: 'option',
    valueType: 'option',
    width: 160,
    fixed: 'right',
    render: (_, record) => (
      <div style={{ paddingLeft: 8, whiteSpace: 'nowrap' }}>
        <a onClick={() => setRow(record)}>查看</a>
        <Auth permission="canUpdate{Entity}">
          <Divider type="vertical" />
          <a onClick={() => { handleUpdateModalVisible(true); setStepFormValues(record); }}>编辑</a>
        </Auth>
        <Auth permission="canDelete{Entity}">
          <Divider type="vertical" />
          <Popconfirm title="确认删除" description={`确定要删除「${record.name}」吗？`} onConfirm={() => handleRemove([record])}>
            <a style={{ color: '#ff4d4f' }}>删除</a>
          </Popconfirm>
        </Auth>
      </div>
    ),
  },
];
```

**规则**：

- ID 列：`hideInForm: true, hideInSearch: true, width: 60`
- 时间列：`valueType: 'dateTime'`, `hideInForm: true, hideInSearch: true, width: 160`
- 操作列：`dataIndex: 'option'`, `valueType: 'option'`, `fixed: 'right'`
- 操作列中的 Divider 用 `type="vertical"`，不额外加 margin
- 删除按钮颜色使用 `'#ff4d4f'`

### Status 渲染模式

使用 Tag 组件渲染状态字段，颜色与文本从 Record 映射获取：

```typescript
const statusMap: Record<string, { text: string; color: string }> = {
  instock: { text: '有货', color: '#52c41a' },
  lowstock: { text: '低库存', color: '#faad14' },
  outofstock: { text: '缺货', color: '#ff4d4f' },
};

// 在 columns 中：
{
  title: '状态',
  dataIndex: 'status',
  width: 100,
  render: (_, record) => {
    const cfg = statusMap[record.status || ''];
    return cfg ? <Tag color={cfg.color}>{cfg.text}</Tag> : '-';
  },
}
```

对于通用状态（如订单状态），状态映射定义在 `src/constants/index.ts` 中，按需导入使用。

## 6. CRUD 操作函数模式

所有 CRUD 操作函数定义在组件外部（或组件内部），遵循一致的 try/catch 模式。

### handleAdd — 创建

```typescript
const handleAdd = async (fields: API.Create{Entity}DTO): Promise<boolean> => {
  const hide = message.loading('正在创建');
  try {
    await post{Entity}s(fields);
    hide();
    message.success('创建成功');
    return true;
  } catch {
    hide();
    message.error('创建失败，请重试');
    return false;
  }
};
```

### handleUpdate — 更新

```typescript
const handleUpdate = async (fields: FormValueType): Promise<boolean> => {
  const hide = message.loading('正在更新');
  try {
    await put{Entity}Id({ id: fields.id || 0 }, { /* 更新字段 */ });
    hide();
    message.success('更新成功');
    return true;
  } catch {
    hide();
    message.error('更新失败，请重试');
    return false;
  }
};
```

### handleRemove — 删除（支持批量）

```typescript
const handleRemove = async (selectedRows: API.{Entity}[]): Promise<boolean> => {
  const hide = message.loading('正在删除');
  if (!selectedRows.length) return true;
  try {
    await Promise.all(selectedRows.map((row) => delete{Entity}Id({ id: row.id || 0 })));
    hide();
    message.success('删除成功');
    actionRef.current?.reloadAndRest?.();
    setSelectedRows([]);
    return true;
  } catch {
    hide();
    message.error('删除失败，请重试');
    return false;
  }
};
```

**规则**：

- 返回值统一为 `Promise<boolean>`，true 表示成功
- loading 用 `message.loading()` + `.hide()` 模式（外部调用 hide，catch 中也要调用）
- 成功/失败消息文本统一：`'{Action}成功'` / `'{Action}失败，请重试'`
- 创建/更新成功后调用 `actionRef.current?.reload()` 刷新表格
- 删除成功后调用 `actionRef.current?.reloadAndRest?.()` 并 `setSelectedRows([])`

## 7. 表单组件规范

### CreateForm 模板

```typescript
import { ProForm, ProFormText, ProFormDigit, ProFormSelect, ProFormTextArea } from '@ant-design/pro-components';
import { Modal } from 'antd';
import React from 'react';

interface CreateFormProps {
  modalVisible: boolean;
  onCancel: () => void;
  onSubmit: (values: API.Create{Entity}DTO) => Promise<boolean>;
}

const CreateForm: React.FC<CreateFormProps> = (props) => {
  const { modalVisible, onCancel, onSubmit } = props;

  return (
    <Modal title="新建{Entity}" width={600} open={modalVisible} onCancel={() => onCancel()} footer={null}>
      <ProForm<API.Create{Entity}DTO>
        layout="horizontal"
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 18 }}
        style={{ width: '90%', margin: '0 auto' }}
        onFinish={async (values) => {
          const success = await onSubmit(values);
          if (success) { onCancel(); }
        }}
        submitter={{
          render: (_, dom) => (
            <div style={{ width: '90%', display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
              {dom}
            </div>
          ),
        }}
      >
        {/* 表单字段 — 使用 ProFormText / ProFormDigit / ProFormSelect / ProFormTextArea 等 */}
      </ProForm>
    </Modal>
  );
};

export default CreateForm;
```

### UpdateForm 模板

```typescript
import { ProForm, ProFormText, ProFormDigit } from '@ant-design/pro-components';
import { Modal } from 'antd';
import React from 'react';

export type FormValueType = {
  id?: number;
  name?: string;
  // 其他可更新字段...
};

export interface UpdateFormProps {
  onCancel: () => void;
  onSubmit: (values: FormValueType) => Promise<void>;
  updateModalVisible: boolean;
  values: Partial<API.{Entity}>;
}

const UpdateForm: React.FC<UpdateFormProps> = (props) => {
  const { values } = props;

  return (
    <Modal title="编辑{Entity}" width={600} destroyOnHidden open={props.updateModalVisible}
           onCancel={() => props.onCancel()} footer={null}>
      <ProForm layout="horizontal" labelCol={{ span: 6 }} wrapperCol={{ span: 18 }}
               style={{ width: '90%', margin: '0 auto' }}
               onFinish={props.onSubmit}
               initialValues={{ /* 从 values 映射 */ }}
               submitter={{
                 render: (_, dom) => (
                   <div style={{ width: '90%', display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
                     {dom}
                   </div>
                 ),
               }}>
        {/* 表单字段 */}
      </ProForm>
    </Modal>
  );
};

export default UpdateForm;
```

### 详细规则

**Props 接口**：

- CreateFormProps：`{ modalVisible, onCancel, onSubmit }`
- UpdateFormProps：`{ onCancel, onSubmit, updateModalVisible, values }`
- UpdateForm 额外导出 `FormValueType` 和 `UpdateFormProps`

**Modal 配置**：

- `title`: `"新建{Entity}"` 或 `"编辑{Entity}"`
- `width`: 默认 `600`（复杂表单可用 `800`）
- `footer={null}`（由 ProForm 管理提交按钮）
- UpdateForm 额外加 `destroyOnHidden`
- `open` 属性接收可见性状态（非 visible）
- `onCancel` 直接调用 `props.onCancel()`，不包裹额外逻辑

**ProForm 配置**：

- `layout="horizontal"` + `labelCol={{ span: 6 }}` + `wrapperCol={{ span: 18 }}`
- `style={{ width: '90%', margin: '0 auto' }}`
- `submitter.render`：fixed 在右下角，flex 布局
- CreateForm 使用 `onFinish` 调用 `onSubmit` 成功后自动 `onCancel`
- UpdateForm 使用 `onFinish={props.onSubmit}` 直接传递
- UpdateForm 必须设置 `initialValues` 从 `values` 映射字段

**表单字段规则**：

- `ProFormText`：`width="md"`, `rules` 中必填项用 `{ required: true, message: '请输入...' }`
- `ProFormDigit`：额外 `min={0}` 和可选 `fieldProps={{ precision: 0 }}`
- `ProFormSelect`：`initialValue` 设置默认值；`mode="multiple"` 支持多选
- 下拉选项支持 `showSearch` + `fieldProps.filterOption` 实现本地搜索
- UpdateForm 中不可修改的字段加 `disabled` 和 `tooltip` 提示原因

**自定义 Hook 获取选项数据**：

- 在 CreateForm/UpdateForm 组件内调用 Hook，传入 modalVisible 作为触发条件
- 示例：`const categories = useRootCategories(modalVisible);`
- Hook 返回 `{ label: string; value: any }[]` 格式的选项数组

## 8. 权限守卫

### 按钮级权限（使用 `<Auth>` 组件）

```typescript
import Auth from '@/components/Auth';

// 新建按钮
<Auth permission="canCreate{Entity}">
  <Button type="primary" onClick={() => handleModalVisible(true)}>新建{Entity}</Button>
</Auth>

// 编辑/删除操作列
<Auth permission="canUpdate{Entity}">
  <Divider type="vertical" />
  <a onClick={() => { /* 编辑逻辑 */ }}>编辑</a>
</Auth>

// 批量删除
{selectedRowsState?.length > 0 && (
  <Auth permission="canDelete{Entity}">
    <FooterToolbar extra={...}>
      <Popconfirm ...><Button danger>批量删除</Button></Popconfirm>
    </FooterToolbar>
  </Auth>
)}
```

### 权限命名

- 格式：`can{Action}{Entity}` （PascalCase）
- 例如：`canCreateProduct`, `canUpdateCategory`, `canDeleteOrder`, `canModerateReview`
- 对应 `src/access.ts` 中定义的权限函数名
- 路由级权限在 `configs/routes.ts` 中用 `access` 字段配置

## 9. 错误处理

### CRUD 操作中的统一模式

```typescript
const hide = message.loading('正在操作');
try {
  await apiCall();
  hide();
  message.success('操作成功');
  actionRef.current?.reload();
} catch {
  hide();
  message.error('操作失败，请重试');
}
```

### 规则

- 使用 `message.loading()` 返回的 hide 函数，确保 catch 路径也会关闭 loading
- 业务错误由 `src/app.ts` 或 `src/utils/request.ts` 的全局 errorHandler 处理
- 组件内只需 catch 未知错误，显示通用失败消息
- 简单的状态变更操作可省略 loading 句柄，直接 try/catch

## 10. 跨页面导航

使用 LinkText 组件（位于 `@/components/LinkText`）实现跨页面跳转+筛选条件传递：

```typescript
<LinkText
  value={record.name}
  path="/inventory/inventory"
  state={{ product_name: record.name }}
/>
```

在目标页面使用 `useRouteFilter` Hook 接收筛选条件：

```typescript
const formRef = useRef<any>(null);
const { getFilter, markApplied } = useRouteFilter<{ product_name: string }>(
  formRef,
  ['product_name'],
);
// 在 ProTable request 中使用：
const productName = getFilter('product_name', formProductName);
markApplied();
```

## 11. 价格格式化

价格单位以「分」存储，显示时转换为「元」：

```typescript
/**
 * 格式化价格：分 → 元
 */
const formatPrice = (price?: number) => {
  if (price === undefined || price === null) return '-';
  return `¥${(price / 100).toFixed(2)}`;
};
```

创建/更新时的反向转换：

```typescript
// 创建时
await postProducts({ ...fields, price: Math.round(fields.price * 100) });
// 编辑表单初始化时
initialValues={{ price: values.price ? values.price / 100 : undefined }}
```

## 12. 抽屉详情

使用 ProDescriptions 组件展示单行详情：

```typescript
{row?.name && (
  <Drawer width={600} open={!!row} onClose={() => setRow(undefined)}>
    <ProDescriptions<API.{Entity}>
      column={2}
      title={row?.name}
      request={async () => ({ data: row || {} })}
      params={{ id: row?.name }}
      columns={columns as any}
    />
  </Drawer>
)}
```

- Drawer 的条件渲染：`row?.name &&` 作为守卫，避免空数据渲染
- Drawer 的 `open` 使用 `!!row`
- 关闭时 setRow(undefined)

## 13. 内联状态变更（Dropdown 菜单）

用于快速切换状态：

```typescript
<Dropdown
  menu={{
    onClick: ({ key }) => {
      handleStatusChange(record.id!, key).then((ok) => {
        if (ok) actionRef.current?.reload();
      });
    },
    items: Object.entries(statusMap).map(([key, val]) => ({
      key,
      label: val.text,
    })),
  }}
>
  <a onClick={(e) => e.preventDefault()}>改状态</a>
</Dropdown>
```

## 14. 注释规范

```typescript
/**
 * 新增{Entity}
 */
const handleAdd = async (fields: API.CreateDTO): Promise<boolean> => { ... };

// 行内注释：简洁说明
// 新建弹窗
// 编辑弹窗
// 查看详情抽屉
```

- 导出的处理函数使用 JSDoc 块注释说明用途
- 模态框/抽屉旁使用单行注释标注
- 避免对显而易见的代码加注释

## 15. 批量删除的 FooterToolbar

```typescript
{
  selectedRowsState?.length > 0 && (
    <Auth permission="canDelete{Entity}">
      <FooterToolbar extra={`已选择 ${selectedRowsState.length} 项`}>
        <Popconfirm
          title="确认删除"
          description="确定要删除选中的项吗？"
          onConfirm={() => handleRemove(selectedRowsState)}
        >
          <Button danger>批量删除</Button>
        </Popconfirm>
      </FooterToolbar>
    </Auth>
  );
}
```

- 需要同时设置 ProTable 的 `rowSelection` 属性
- `rowSelection` 的 `onChange` 绑定到 `setSelectedRows`

## 16. CSS / Less 样式规范

### 16.1 文件管理

- **默认不创建**：常规 CRUD 页面（Category、Product、Order 等）依赖 ProTable / antd 默认样式，**不需要** `index.less` 文件。仅在以下情况创建：
  - 用户明确要求或手动创建了 `index.less`
  - 用户提到需要抽离样式或提取样式到独立文件
  - 页面包含 `:global(.ant-*)` 覆盖 antd 组件内部样式
  - 页面有特殊布局、渐变背景、卡片动效等非标准样式
- 每个页面独立一个 `index.less` 文件，与 `index.tsx` 同目录
- 使用 CSS Modules 方式导入：`import styles from './index.less'`
- 组件级别样式可提取为独立文件，如 `AdminIllustration.tsx` 的 SVG 内联样式保留在组件内
- 通用 UI 组件（卡片、按钮变体等）考虑抽取到 `src/components/` 对应目录

### 16.2 类名命名

采用 **camelCase** 命名，与 CSS Modules 的 `styles.xxx` 调用一致：

```less
/* ✅ 正确 */
.loginContainer {
  ...;
}
.statCard {
  ...;
}
.loginFormPanel {
  ...;
}

/* ❌ 错误：kebab-case 在 styles.xxx 中需用括号访问 */
.login-container {
  ...;
} // 必须写 styles['login-container']
.login-form-panel {
  ...;
} // 必须写 styles['login-form-panel']
```

修饰符类名同样使用 camelCase，搭配多个 className：

```less
.loginGlow {
  ...;
}
.loginGlowTop {
  ...;
}
.loginGlowBottom {
  ...;
}
```

```tsx
<div className={`${styles.loginGlow} ${styles.loginGlowTop}`} />
```

### 16.3 注释结构

使用带分隔线的块注释区分样式区域：

```less
/* ─── 等高校对行 ──────────────────────────────── */

/* ─── 实时数据 ────────────────────────────────── */

/* 右侧：表单面板 */
/* 左侧：插图面板 */
```

### 16.4 全局样式覆盖（`:global`）

当需要覆盖 Ant Design 组件内部样式时，使用 `:global()` 包裹选择器：

```less
.chartCard {
  height: 100%;

  :global(.ant-card-body) {
    height: calc(100% - 56px); /* 扣除卡片标题栏高度 */
  }
}
```

### 16.5 颜色与透明度

RGBA 透明度使用百分比形式：

```less
/* ✅ 正确 */
box-shadow: 0 1px 4px rgba(0, 0, 0, 6%);
background: radial-gradient(
  circle,
  rgba(59, 130, 246, 12%) 0%,
  transparent 70%
);
color: rgba(255, 255, 255, 55%);

/* ❌ 避免 */
box-shadow: 0 1px 4px rgba(0, 0, 0, 0.06);
```

### 16.6 卡片与容器样式

```less
.statCard {
  border-radius: 8px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 6%);
  transition: box-shadow 0.25s, transform 0.25s;

  &:hover {
    box-shadow: 0 4px 16px rgba(0, 0, 0, 10%);
    transform: translateY(-2px);
  }
}

.chartCard {
  border-radius: 8px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 6%);
}
```

### 16.7 渐变背景

大区块背景使用 `linear-gradient`，装饰光晕使用 `radial-gradient`：

```less
/* 大面积背景渐变 */
.loginIllustrationPanel {
  background: linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #1a1f35 100%);
}

/* 装饰光晕 */
.loginGlowTop {
  background: radial-gradient(
    circle,
    rgba(59, 130, 246, 12%) 0%,
    transparent 70%
  );
}
```

### 16.8 Flexbox 布局模式

```less
// 居中容器
display: flex;
align-items: center;
justify-content: center;

// 水平等距排列
display: flex;
gap: 24px;
flex-wrap: wrap;

// 纵向填充 + 底部自动边距
display: flex;
flex-direction: column;
height: 100%;
/* 子项：margin-top: auto 推到底部 */
```

### 16.9 嵌套选择器

Less 嵌套层级不超过 3 层：

```less
.chartEqualRow {
  margin-top: 16px;

  .chartCard {
    height: 100%;

    :global(.ant-card-body) {
      /* 第 3 层：允许 */
      height: calc(100% - 56px);
    }
  }
}
```

### 16.10 响应式与 hover 效果

```less
// Hover 动效
.transition-hover {
  transition: box-shadow 0.25s, transform 0.25s;

  &:hover {
    box-shadow: 0 4px 16px rgba(0, 0, 0, 10%);
    transform: translateY(-2px);
  }
}

// 列表项分隔线
.eventItem {
  border-bottom: 1px solid #f5f5f5;

  &:last-child {
    border-bottom: none;
  }
}
```

### 16.11 溢出与文本省略

```less
.ellipsis {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
```

### 16.12 页面级样式布局参考

**Home 页面模式**（Dashboard 概览页）：

```
.container              → 页面外层容器
  .statRow              → 统计数据行
    .statCard           → 统计卡片（带 hover 动效）
  .chartRow             → 图表的行
    .chartCard          → 图表卡片
  .chartEqualRow        → 等高校对行
    .chartCard          → 内嵌卡片（:global 覆盖 ant-card-body）
  .realtimeRow          → 实时数据行
    .realtimeBody       → Flex 纵向布局
    .realtimeStats      → 统计项 Flex 行
    .onlineUsers        → 底部在线用户（border-top + margin-top: auto）
```

**Login 页面模式**（全屏登录页）：

```
.loginContainer        → 100vw x 100vh flex 容器
  .loginFormPanel      → 右侧表单面板（flex: 0 0 45%, order: 2）
    .loginFormWrapper  → 表单宽度约束
  .loginIllustrationPanel → 左侧插图面板（flex: 0 0 55%, order: 1）
    .loginGlow         → 装饰光晕（position: absolute）
    .loginIllustration → 插图居中容器
    .loginWelcome      → 欢迎文案居中
```

---

**参考页面**：Category（最标准的 CRUD 模板）、Product（含价格转换）、Inventory（含跨页面筛选）、Order（含状态变更 Dropdown）、Permission（含 useModel('@@initialState') 刷新）、**Home（CSS Modules + Less 嵌套 + :global 覆盖）**、**Login（CSS Modules + 渐变背景 + flex 左右布局）**
