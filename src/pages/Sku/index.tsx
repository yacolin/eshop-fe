import type { ActionType, ProColumns } from '@ant-design/pro-components';
import {
  FooterToolbar,
  PageContainer,
  ProTable,
} from '@ant-design/pro-components';
import { Button, Divider, message, Popconfirm, Tag } from 'antd';
import React, { useEffect, useRef, useState } from 'react';

import { useLocation } from '@umijs/max';

import Auth from '@/components/Auth';
import LinkText from '@/components/LinkText';

import { getProducts } from '@/services/api/products';
import {
  deleteSkusId,
  getSkus,
  postSkus,
  putSkusId,
} from '@/services/api/skus';
import CreateForm from './components/CreateForm';
import DetailDrawer from './components/DetailDrawer';
import UpdateForm from './components/UpdateForm';

import type { FormValueType } from './components/UpdateForm';

const statusMap: Record<number, { text: string; color: string }> = {
  1: { text: '启用', color: '#52c41a' },
  0: { text: '禁用', color: '#ff4d4f' },
};

/**
 * 格式化价格：分 → 元
 */
const formatPrice = (price?: number) => {
  if (price === undefined || price === null) return '-';
  return `¥${(price / 100).toFixed(2)}`;
};

/**
 * 新增 SKU
 */
const handleAdd = async (fields: API.CreateSKUReq): Promise<boolean> => {
  const hide = message.loading('正在创建');
  try {
    await postSkus(fields);
    hide();
    message.success('创建成功');
    return true;
  } catch {
    hide();
    message.error('创建失败，请重试');
    return false;
  }
};

/**
 * 更新 SKU
 */
const handleUpdate = async (fields: FormValueType): Promise<boolean> => {
  const hide = message.loading('正在更新');
  try {
    await putSkusId({ id: fields.id || 0 }, fields);
    hide();
    message.success('更新成功');
    return true;
  } catch {
    hide();
    message.error('更新失败，请重试');
    return false;
  }
};

/**
 * 删除 SKU
 */
const handleRemove = async (selectedRows: API.SKU[]): Promise<boolean> => {
  const hide = message.loading('正在删除');
  if (!selectedRows.length) return true;
  try {
    await Promise.all(
      selectedRows.map((row) => deleteSkusId({ id: row.id || 0 })),
    );
    hide();
    message.success('删除成功');
    return true;
  } catch {
    hide();
    message.error('删除失败，请重试');
    return false;
  }
};

const SkuList: React.FC = () => {
  const [createModalVisible, handleCreateModalVisible] =
    useState<boolean>(false);
  const [updateModalVisible, handleUpdateModalVisible] =
    useState<boolean>(false);
  const [stepFormValues, setStepFormValues] = useState<FormValueType>({});
  const actionRef = useRef<ActionType>();
  const formRef = useRef<any>();
  const [row, setRow] = useState<API.SKU>();
  const [selectedRowsState, setSelectedRows] = useState<API.SKU[]>([]);

  const location = useLocation() as any;
  const routeProductId = (location.state as any)?.product_id;
  const routeProductName = (location.state as any)?.product_name;

  const [createProductId, setCreateProductId] = useState<number | undefined>();
  const [productOptions, setProductOptions] = useState<
    { label: string; value: number }[]
  >(
    routeProductId && routeProductName
      ? [
          {
            label: `[${routeProductId}] ${routeProductName}`,
            value: routeProductId,
          },
        ]
      : [],
  );

  const fetchProducts = async (name?: string) => {
    try {
      const res = await getProducts({ size: 100, name });
      const data = (res as any).data || {};
      const list = data.list || [];
      setProductOptions((prev) => {
        const merged = new Map(prev.map((p) => [p.value, p]));
        list.forEach((p: API.SPU) => {
          if (!merged.has(p.id)) {
            merged.set(p.id, {
              label: `[${p.id}] ${p.name}`,
              value: p.id || 0,
            });
          }
        });
        return Array.from(merged.values());
      });
    } catch {
      // 静默
    }
  };

  // 加载产品下拉 + 预设路由产品搜索条件
  useEffect(() => {
    fetchProducts();
    if (routeProductId) {
      const timer = setTimeout(() => {
        formRef.current?.setFieldsValue({ product_id: routeProductId });
        formRef.current?.submit();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleOpenCreate = () => {
    const productId = formRef.current?.getFieldValue?.('product_id');
    if (!productId) {
      message.warning('请先在搜索条件中选择产品');
      return;
    }
    setCreateProductId(productId);
    handleCreateModalVisible(true);
  };

  const columns: ProColumns<API.SKU>[] = [
    {
      title: 'ID',
      dataIndex: 'id',
      hideInForm: true,
      hideInSearch: true,
      width: 60,
      render: (_, record) => (
        <LinkText
          value={record.id}
          path="/inventory/inventory"
          state={{ sku_id: record.id }}
          copyable={false}
        />
      ),
    },
    {
      title: '产品',
      dataIndex: 'product_id',
      hideInTable: true,
      valueType: 'select',
      fieldProps: {
        showSearch: true,
        options: productOptions,
        filterOption: (input: string, option: any) =>
          (option?.label ?? '').toLowerCase().includes(input.toLowerCase()),
      },
    },
    {
      title: 'SKU 编码',
      dataIndex: 'sku_code',
      width: 150,
      copyable: true,
    },
    {
      title: '条码',
      dataIndex: 'barcode',
      width: 140,
      copyable: true,
      hideInSearch: true,
    },
    {
      title: '售价',
      dataIndex: 'price',
      width: 100,
      hideInSearch: true,
      render: (_, record) => formatPrice(record.price),
    },
    {
      title: '成本价',
      dataIndex: 'cost_price',
      width: 100,
      hideInSearch: true,
      render: (_, record) => formatPrice(record.cost_price),
    },
    {
      title: '市场价',
      dataIndex: 'market_price',
      width: 100,
      hideInSearch: true,
      render: (_, record) => formatPrice(record.market_price),
    },
    {
      title: '规格',
      dataIndex: 'spec',
      width: 400,
      hideInSearch: true,
      render: (_, record) => {
        if (!record.spec) return '-';
        try {
          const spec =
            typeof record.spec === 'string'
              ? JSON.parse(record.spec)
              : record.spec;
          return Object.entries(spec).map(([k, v]) => (
            <Tag key={k}>
              {k}: {String(v)}
            </Tag>
          ));
        } catch {
          return record.spec;
        }
      },
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 80,
      hideInSearch: true,
      render: (_, record) => {
        const cfg = statusMap[record.status ?? -1];
        return cfg ? <Tag color={cfg.color}>{cfg.text}</Tag> : '-';
      },
    },
    {
      title: '创建时间',
      dataIndex: 'created_at',
      hideInForm: true,
      hideInSearch: true,
      valueType: 'dateTime',
      width: 160,
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      width: 140,
      fixed: 'right',
      render: (_, record) => (
        <div style={{ paddingLeft: 8, whiteSpace: 'nowrap' }}>
          <a onClick={() => setRow(record)}>查看</a>
          <Auth permission="canUpdateSku">
            <Divider type="vertical" />
            <a
              onClick={() => {
                setStepFormValues(record as FormValueType);
                handleUpdateModalVisible(true);
              }}
            >
              编辑
            </a>
          </Auth>
          <Auth permission="canDeleteSku">
            <Divider type="vertical" />
            <Popconfirm
              title="确认删除"
              description={`确定要删除 SKU「${record.sku_code}」吗？`}
              onConfirm={async () => {
                const success = await handleRemove([record]);
                if (success) {
                  actionRef.current?.reloadAndRest?.();
                  setSelectedRows([]);
                }
              }}
            >
              <a style={{ color: '#ff4d4f' }}>删除</a>
            </Popconfirm>
          </Auth>
        </div>
      ),
    },
  ];

  return (
    <PageContainer
      header={{
        title: 'SKU 管理',
        breadcrumb: { items: [{ title: '首页' }, { title: 'SKU 管理' }] },
      }}
    >
      <ProTable<API.SKU>
        headerTitle="SKU 列表"
        formRef={formRef}
        actionRef={actionRef}
        rowKey="id"
        scroll={{ x: 1300 }}
        search={{
          labelWidth: 100,
          defaultCollapsed: false,
        }}
        options={false}
        request={async (params) => {
          const { product_id, sku_code } = params as any;
          if (product_id || sku_code) {
            const res = await getSkus({ product_id, sku_code });
            const list = (res as any).data || [];
            return { data: list, total: list.length, success: true };
          }
          return { data: [], total: 0, success: true };
        }}
        toolBarRender={() => [
          <Auth key="create" permission="canCreateSku">
            <Button type="primary" onClick={handleOpenCreate}>
              新建 SKU
            </Button>
          </Auth>,
        ]}
        columns={columns}
        rowSelection={{
          onChange: (_, selectedRows) => setSelectedRows(selectedRows),
        }}
        pagination={{
          defaultPageSize: 10,
          showSizeChanger: true,
          showQuickJumper: true,
          pageSizeOptions: ['10', '20', '50'],
          showTotal: (total) => `共 ${total} 条`,
        }}
      />

      {selectedRowsState?.length > 0 && (
        <Auth permission="canDeleteSku">
          <FooterToolbar
            extra={
              <div>
                已选择{' '}
                <a style={{ fontWeight: 600 }}>{selectedRowsState.length}</a>{' '}
                项&nbsp;&nbsp;
              </div>
            }
          >
            <Popconfirm
              title="确认批量删除"
              description={`确定要删除选中的 ${selectedRowsState.length} 个 SKU 吗？`}
              onConfirm={async () => {
                const success = await handleRemove(selectedRowsState);
                if (success) {
                  setSelectedRows([]);
                  actionRef.current?.reloadAndRest?.();
                }
              }}
            >
              <Button danger>批量删除</Button>
            </Popconfirm>
          </FooterToolbar>
        </Auth>
      )}

      {/* 新建弹窗 */}
      <CreateForm
        modalVisible={createModalVisible}
        onCancel={() => handleCreateModalVisible(false)}
        productId={createProductId}
        onSubmit={async (value) => {
          const success = await handleAdd(value);
          if (success) {
            handleCreateModalVisible(false);
            actionRef.current?.reload();
          }
          return success;
        }}
      />

      {/* 编辑弹窗 */}
      {stepFormValues && Object.keys(stepFormValues).length ? (
        <UpdateForm
          onSubmit={async (value) => {
            const success = await handleUpdate({
              ...value,
              id: stepFormValues.id,
            });
            if (success) {
              handleUpdateModalVisible(false);
              setStepFormValues({});
              actionRef.current?.reload();
            }
          }}
          onCancel={() => {
            handleUpdateModalVisible(false);
            setStepFormValues({});
          }}
          updateModalVisible={updateModalVisible}
          values={stepFormValues as API.SKU}
        />
      ) : null}

      <DetailDrawer row={row} onClose={() => setRow(undefined)} />
    </PageContainer>
  );
};

export default SkuList;
