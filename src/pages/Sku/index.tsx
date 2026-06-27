import type { ActionType, ProColumns } from '@ant-design/pro-components';
import {
  PageContainer,
  ProDescriptions,
  ProTable,
} from '@ant-design/pro-components';
import {
  Button,
  Divider,
  Drawer,
  message,
  Popconfirm,
  Select,
  Tag,
  Typography,
} from 'antd';
import React, { useEffect, useMemo, useRef, useState } from 'react';

import { history, useLocation } from '@umijs/max';

import Auth from '@/components/Auth';

import {
  deleteSkusId,
  getSkus,
  postSkus,
  putSkusId,
} from '@/services/api/skus';
import BatchCreateForm from './components/BatchCreateForm';
import CreateForm from './components/CreateForm';
import UpdateForm from './components/UpdateForm';

import type { FormValueType } from './components/UpdateForm';
import useProductOptions from './hooks/useProductOptions';

const formatPrice = (price?: number) => {
  if (price === undefined || price === null) return '-';
  return `¥${(price / 100).toFixed(2)}`;
};

const handleAdd = async (fields: API.CreateSkuDTO & { price: number }) => {
  const hide = message.loading('正在创建');
  try {
    let spec: Record<string, any> | undefined;
    if (typeof fields.spec === 'string') {
      try {
        spec = JSON.parse(fields.spec);
      } catch {
        spec = undefined;
      }
    } else {
      spec = fields.spec;
    }
    await postSkus({
      ...fields,
      price: Math.round(fields.price * 100),
      spec,
    });
    hide();
    message.success('创建成功');
    return true;
  } catch {
    hide();
    message.error('创建失败，请重试');
    return false;
  }
};

const handleUpdate = async (fields: FormValueType) => {
  const hide = message.loading('正在更新');
  try {
    let spec: Record<string, any> | undefined;
    if (typeof fields.spec === 'string') {
      try {
        spec = JSON.parse(fields.spec);
      } catch {
        spec = undefined;
      }
    } else {
      spec = fields.spec;
    }
    await putSkusId(
      { id: fields.id || 0 },
      {
        name: fields.name,
        price: Math.round((fields.price || 0) * 100),
        sku_code: fields.sku_code,
        image: fields.image,
        spec,
      },
    );
    hide();
    message.success('更新成功');
    return true;
  } catch {
    hide();
    message.error('更新失败，请重试');
    return false;
  }
};

const handleRemove = async (selectedRows: API.SkuResponse[]) => {
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
  const [createModalVisible, handleModalVisible] = useState<boolean>(false);
  const [batchModalVisible, setBatchModalVisible] = useState<boolean>(false);
  const [updateModalVisible, handleUpdateModalVisible] =
    useState<boolean>(false);
  const [stepFormValues, setStepFormValues] = useState<FormValueType>({});
  const actionRef = useRef<ActionType>();
  const [row, setRow] = useState<API.SkuResponse>();
  const [, setSelectedRows] = useState<API.SkuResponse[]>([]);

  const formRef = useRef<any>(null);
  const location = useLocation();
  const initialProductId = (location.state as any)?.product_id;
  const [tableLoading, setTableLoading] = useState(!!initialProductId);
  const pageReadyRef = useRef(!initialProductId);
  const initRef = useRef(false);

  const products = useProductOptions(true);
  const productMap = useMemo(() => {
    const map: Record<number, string> = {};
    for (const p of products) {
      map[p.value] = p.label;
    }
    return map;
  }, [products]);

  // 产品选项加载完成后回填搜索框，再放行请求
  useEffect(() => {
    if (initialProductId && products.length > 0 && !initRef.current) {
      initRef.current = true;
      formRef.current?.setFieldsValue({ product_id: initialProductId });
      pageReadyRef.current = true;
      formRef.current?.submit();
    }
  }, [products, initialProductId]);

  const columns: ProColumns<API.SkuResponse>[] = [
    {
      title: 'ID',
      dataIndex: 'id',
      hideInForm: true,
      hideInSearch: true,
      width: 60,
      fixed: 'left',
    },
    {
      title: '所属产品',
      dataIndex: 'product_id',
      width: 200,
      render: (_, record) => productMap[record.product_id || 0] || '-',
      renderFormItem: () => (
        <Select
          allowClear
          showSearch
          placeholder="搜索并选择产品"
          options={products}
          filterOption={(input, option) =>
            (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
          }
        />
      ),
    },
    {
      title: 'SKU 名称',
      dataIndex: 'name',
      width: 200,
      render: (_, record) => (
        <Typography.Text
          copyable
          ellipsis
          style={{ width: 180, margin: 0, color: '#1677ff', cursor: 'pointer' }}
          onClick={() =>
            history.push('/inventory/inventory', {
              sku_name: record.name,
            })
          }
        >
          {record.name}
        </Typography.Text>
      ),
    },
    {
      title: 'SKU 编码',
      dataIndex: 'sku_code',
      width: 160,
      ellipsis: true,
      render: (_, record) => (
        <Typography.Text copyable>{record.sku_code}</Typography.Text>
      ),
    },
    {
      title: '价格',
      dataIndex: 'price',
      width: 100,
      render: (_, record) => formatPrice(record.price),
      valueType: 'money',
    },
    {
      title: '规格',
      dataIndex: 'spec',
      hideInSearch: true,
      width: 320,
      render: (_, record) => {
        if (!record.spec || Object.keys(record.spec).length === 0) return '-';
        const COLORS = [
          'blue',
          'gold',
          'green',
          'purple',
          'red',
          'cyan',
          'magenta',
        ];
        const entries = Object.entries(record.spec);
        return (
          <div style={{ display: 'flex' }}>
            {entries.map(([k, v], i) => (
              <Tag
                key={k}
                color={COLORS[i % COLORS.length]}
                style={{ flex: 1, textAlign: 'center' }}
              >
                {k}: {v}
              </Tag>
            ))}
          </div>
        );
      },
    },
    {
      title: '图片',
      dataIndex: 'image',
      hideInSearch: true,
      width: 80,
      render: (_, record) => (record.image ? <Tag color="blue">有</Tag> : '-'),
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
      title: '更新时间',
      dataIndex: 'updated_at',
      hideInForm: true,
      hideInSearch: true,
      valueType: 'dateTime',
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
          <Auth permission="canUpdateSku">
            <Divider type="vertical" />
            <a
              onClick={() => {
                setStepFormValues({
                  ...record,
                  price: record.price ? record.price / 100 : undefined,
                });
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
              description={`确定要删除 SKU「${record.name}」吗？`}
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
        breadcrumb: {
          items: [{ title: '首页' }, { title: 'SKU 管理' }],
        },
      }}
    >
      <ProTable<API.SkuResponse>
        headerTitle="SKU 列表"
        actionRef={actionRef}
        formRef={formRef}
        rowKey="id"
        loading={tableLoading}
        scroll={{ x: 1300 }}
        search={{
          labelWidth: 100,
          defaultCollapsed: false,
        }}
        toolBarRender={() => [
          <Auth key="create" permission="canCreateSku">
            <Button type="primary" onClick={() => handleModalVisible(true)}>
              新建 SKU
            </Button>
          </Auth>,
          <Auth key="batchCreate" permission="canCreateSku">
            <Button onClick={() => setBatchModalVisible(true)}>
              批量创建 SKU
            </Button>
          </Auth>,
        ]}
        request={async (params) => {
          if (!pageReadyRef.current)
            return { data: [], total: 0, success: true };
          const { current, pageSize, ...rest } = params;
          const res = await getSkus({
            page: current || 1,
            size: pageSize || 10,
            ...rest,
          });
          const data = (res as any).data || {};
          setTableLoading(false);
          return {
            data: data.list || [],
            total: data.total || 0,
            success: true,
          };
        }}
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

      <BatchCreateForm
        modalVisible={batchModalVisible}
        onCancel={() => setBatchModalVisible(false)}
        onSuccess={() => {
          setBatchModalVisible(false);
          actionRef.current?.reload();
        }}
      />

      <CreateForm
        onCancel={() => handleModalVisible(false)}
        modalVisible={createModalVisible}
        onSubmit={async (value) => {
          const success = await handleAdd(value);
          if (success) {
            handleModalVisible(false);
            actionRef.current?.reload();
          }
          return success;
        }}
      />

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
          values={stepFormValues}
        />
      ) : null}

      <Drawer
        width={600}
        open={!!row}
        onClose={() => setRow(undefined)}
        closable
        title={row?.name || 'SKU 详情'}
      >
        {row?.name && (
          <ProDescriptions<API.SkuResponse>
            column={2}
            title={row?.name}
            request={async () => ({ data: row || {} })}
            params={{ id: row?.name }}
            columns={columns as any}
          />
        )}
      </Drawer>
    </PageContainer>
  );
};

export default SkuList;
