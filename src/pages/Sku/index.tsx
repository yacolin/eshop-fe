import type { ActionType, ProColumns } from '@ant-design/pro-components';
import {
  PageContainer,
  ProDescriptions,
  ProTable,
} from '@ant-design/pro-components';
import { Button, Divider, Drawer, message, Popconfirm, Tag } from 'antd';
import React, { useRef, useState } from 'react';

import Auth from '@/components/Auth';

import {
  deleteSkusId,
  getSkus,
  postSkus,
  putSkusId,
} from '@/services/api/skus';
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
  const [updateModalVisible, handleUpdateModalVisible] =
    useState<boolean>(false);
  const [stepFormValues, setStepFormValues] = useState<FormValueType>({});
  const actionRef = useRef<ActionType>();
  const [row, setRow] = useState<API.SkuResponse>();
  const [, setSelectedRows] = useState<API.SkuResponse[]>([]);

  const products = useProductOptions(true);

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
      title: 'SKU 名称',
      dataIndex: 'name',
      width: 180,
      ellipsis: true,
    },
    {
      title: 'SKU 编码',
      dataIndex: 'sku_code',
      width: 160,
      ellipsis: true,
    },
    {
      title: '价格',
      dataIndex: 'price',
      hideInSearch: true,
      width: 100,
      render: (_, record) => formatPrice(record.price),
    },
    {
      title: '规格',
      dataIndex: 'spec',
      hideInSearch: true,
      width: 200,
      ellipsis: true,
      render: (_, record) => {
        if (!record.spec || Object.keys(record.spec).length === 0) return '-';
        return Object.entries(record.spec)
          .map(([k, v]) => `${k}: ${v}`)
          .join('; ');
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
      title: '所属产品',
      dataIndex: 'product_id',
      valueType: 'select',
      valueEnum: products.reduce((acc, p) => {
        acc[p.value] = p.label;
        return acc;
      }, {} as Record<number, string>),
      hideInTable: true,
      width: 200,
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
        rowKey="id"
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
        ]}
        request={async (params) => {
          const { product_id } = params;

          if (!product_id) {
            return { data: [], total: 0, success: true };
          }

          const res = await getSkus({
            product_id: Number(product_id),
          });
          const data = (res as any).data || {};
          const list = data.list || [];
          return { data: list, total: list.length, success: true };
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
