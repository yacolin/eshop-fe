import type { ActionType, ProColumns } from '@ant-design/pro-components';
import {
  PageContainer,
  ProDescriptions,
  ProTable,
} from '@ant-design/pro-components';
import { Button, Divider, Drawer, message, Tag } from 'antd';
import React, { useRef, useState } from 'react';

import Auth from '@/components/Auth';
import { useRouteFilter } from '@/hooks/useRouteFilter';

import {
  getInventories,
  postInventories,
  putInventoriesId,
} from '@/services/api/inventories';
import CreateForm from './components/CreateForm';
import UpdateForm from './components/UpdateForm';

import type { FormValueType } from './components/UpdateForm';
import useProductOptions from './hooks/useProductOptions';

const statusMap: Record<string, { text: string; color: string }> = {
  instock: { text: '有货', color: '#52c41a' },
  lowstock: { text: '低库存', color: '#faad14' },
  outofstock: { text: '缺货', color: '#ff4d4f' },
};

const handleAdd = async (fields: API.CreateInventoryDTO) => {
  const hide = message.loading('正在创建');
  try {
    await postInventories({
      product_id: fields.product_id,
      quantity: fields.quantity,
      threshold: fields.threshold,
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
    await putInventoriesId(
      { id: fields.id || 0 },
      {
        quantity: fields.quantity,
        threshold: fields.threshold,
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

const InventoryList: React.FC = () => {
  const [createModalVisible, handleModalVisible] = useState<boolean>(false);
  const [updateModalVisible, handleUpdateModalVisible] =
    useState<boolean>(false);
  const [stepFormValues, setStepFormValues] = useState<FormValueType>({});
  const actionRef = useRef<ActionType>();
  const [row, setRow] = useState<API.Inventory>();
  const products = useProductOptions(true);

  const formRef = useRef<any>(null);
  const { getFilter, markApplied } = useRouteFilter<{
    product_name: string;
    sku: string;
  }>(formRef, ['product_name', 'sku']);

  const columns: ProColumns<API.Inventory>[] = [
    {
      title: 'ID',
      dataIndex: 'id',
      hideInForm: true,
      hideInSearch: true,
      width: 80,
      fixed: 'left',
    },
    {
      title: '产品',
      dataIndex: 'product_name',
      width: 240,
      ellipsis: true,
      render: (_, record) => {
        const product = products.find((p) => p.value === record.product_id);
        return product ? product.label : record.product_id;
      },
    },
    {
      title: 'SKU',
      dataIndex: 'sku',
      hideInTable: true,
    },
    {
      title: '库存数量',
      dataIndex: 'quantity',
      hideInSearch: true,
      width: 80,
    },
    {
      title: '已预订',
      dataIndex: 'reserved',
      hideInSearch: true,
      width: 80,
    },
    {
      title: '可用库存',
      dataIndex: 'quantity',
      hideInSearch: true,
      width: 80,
      render: (_, record) => {
        const available = (record.quantity || 0) - (record.reserved || 0);
        return available;
      },
    },
    {
      title: '预警阈值',
      dataIndex: 'threshold',
      hideInSearch: true,
      width: 80,
    },
    {
      title: '库存状态',
      dataIndex: 'status',
      valueEnum: {
        instock: { text: '有货', status: 'Success' },
        lowstock: { text: '低库存', status: 'Warning' },
        outofstock: { text: '缺货', status: 'Error' },
      },
      valueType: 'select',
      width: 100,
      render: (_, record) => {
        const status = statusMap[record.status || ''];
        return status ? <Tag color={status.color}>{status.text}</Tag> : '-';
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
      width: 120,
      fixed: 'right',
      render: (_, record) => (
        <div style={{ paddingLeft: 8, whiteSpace: 'nowrap' }}>
          <a onClick={() => setRow(record)}>查看</a>
          <Auth permission="canUpdateInventory">
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
        </div>
      ),
    },
  ];

  return (
    <PageContainer
      header={{
        title: '库存管理',
        breadcrumb: {
          items: [{ title: '首页' }, { title: '库存管理' }],
        },
      }}
    >
      <ProTable<API.Inventory>
        headerTitle="库存列表"
        actionRef={actionRef}
        formRef={formRef}
        rowKey="id"
        scroll={{ x: 1200 }}
        search={{
          labelWidth: 100,
          defaultCollapsed: false,
        }}
        toolBarRender={() => [
          <Auth key="create" permission="canCreateInventory">
            <Button type="primary" onClick={() => handleModalVisible(true)}>
              新建库存
            </Button>
          </Auth>,
        ]}
        request={async (params) => {
          const {
            current,
            pageSize,
            product_name: formProductName,
            sku: formSku,
            ...rest
          } = params;
          const productName = getFilter('product_name', formProductName);
          const sku = getFilter('sku', formSku);
          markApplied();

          const res = await getInventories({
            page: current || 1,
            size: pageSize || 10,
            product_name: productName,
            sku,
            ...rest,
          });
          const data = (res as any).data || {};
          return {
            data: data.list || [],
            total: data.total || 0,
            success: true,
          };
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
          values={stepFormValues as API.Inventory}
        />
      ) : null}

      <Drawer
        width={600}
        open={!!row}
        onClose={() => setRow(undefined)}
        closable
        title={row?.id ? `库存 #${row.id}` : '库存详情'}
      >
        {row && (
          <ProDescriptions<API.Inventory>
            column={2}
            title={`产品 ID: ${row.product_id}`}
            request={async () => ({ data: row || {} })}
            params={{ id: row.id }}
            columns={columns as any}
          />
        )}
      </Drawer>
    </PageContainer>
  );
};

export default InventoryList;
