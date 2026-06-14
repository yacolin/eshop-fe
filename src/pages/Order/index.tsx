import type { ActionType, ProColumns } from '@ant-design/pro-components';
import {
  FooterToolbar,
  PageContainer,
  ProDescriptions,
  ProTable,
} from '@ant-design/pro-components';
import { history } from '@umijs/max';
import {
  Button,
  Divider,
  Drawer,
  message,
  Popconfirm,
  Tag,
  Typography,
} from 'antd';
import React, { useRef, useState } from 'react';

import { ORDER_STATUS_MAP } from '@/constants';
import {
  deleteOrdersId,
  getOrders,
  postOrders,
  putOrdersId,
} from '@/services/api/orders';
import CreateForm from './components/CreateForm';
import UpdateForm from './components/UpdateForm';

import type { FormValueType } from './components/UpdateForm';

/**
 * 格式化金额：分 → 元
 */
const formatPrice = (price?: number) => {
  if (price === undefined || price === null) return '-';
  return `¥${(price / 100).toFixed(2)}`;
};

const orderStatusMap = ORDER_STATUS_MAP;

/**
 * 新增订单
 */
const handleAdd = async (fields: API.CreateOrderDTO) => {
  const hide = message.loading('正在创建');
  try {
    await postOrders(fields);
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
 * 更新订单
 */
const handleUpdate = async (fields: FormValueType) => {
  const hide = message.loading('正在更新');
  try {
    await putOrdersId({ id: fields.id || 0 }, { status: fields.status });
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
 * 删除订单
 */
const handleRemove = async (selectedRows: API.OrderResponse[]) => {
  const hide = message.loading('正在删除');
  if (!selectedRows.length) return true;

  try {
    await Promise.all(
      selectedRows.map((row) => deleteOrdersId({ id: row.id || 0 })),
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

const OrderList: React.FC = () => {
  const [createModalVisible, handleModalVisible] = useState<boolean>(false);
  const [updateModalVisible, handleUpdateModalVisible] =
    useState<boolean>(false);
  const [stepFormValues, setStepFormValues] = useState<FormValueType>({});
  const actionRef = useRef<ActionType>();
  const [row, setRow] = useState<API.OrderResponse>();
  const [selectedRowsState, setSelectedRows] = useState<API.OrderResponse[]>(
    [],
  );

  const columns: ProColumns<API.OrderResponse>[] = [
    {
      title: '订单号',
      dataIndex: 'order_no',
      width: 160,
      fixed: 'left',
      render: (_, record) => (
        <Typography.Text
          copyable
          style={{ color: '#1677ff', cursor: 'pointer' }}
          onClick={() =>
            history.push('/sales/orderitem', { order_no: record.order_no })
          }
        >
          {record.order_no}
        </Typography.Text>
      ),
    },
    {
      title: '客户ID',
      dataIndex: 'customer_id',
      width: 100,
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 100,
      valueType: 'select',
      valueEnum: Object.entries(orderStatusMap).reduce((acc, [key, val]) => {
        acc[key] = val.text;
        return acc;
      }, {} as Record<string, string>),
      render: (_, record) => {
        const status = record.status || 'pending';
        const config = orderStatusMap[status] || {
          color: 'default',
          text: status,
        };
        return <Tag color={config.color}>{config.text}</Tag>;
      },
    },
    {
      title: '总金额',
      dataIndex: 'total_amount',
      hideInSearch: true,
      width: 120,
      render: (_, record) => formatPrice(record.total_amount),
    },
    {
      title: '币种',
      dataIndex: 'currency',
      hideInSearch: true,
      width: 80,
    },
    {
      title: '订单项数',
      dataIndex: 'items',
      hideInSearch: true,
      width: 100,
      render: (_, record) => record.items?.length ?? 0,
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
        <>
          <a onClick={() => setRow(record)}>查看</a>
          <Divider type="vertical" />
          <a
            onClick={() => {
              setStepFormValues({
                id: record.id,
                status: record.status,
                customer_id: record.customer_id,
              });
              handleUpdateModalVisible(true);
            }}
          >
            编辑
          </a>
          <Divider type="vertical" />
          <Popconfirm
            title="确认删除"
            description={`确定要删除订单 #${record.id} 吗？`}
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
        </>
      ),
    },
  ];

  return (
    <PageContainer
      header={{
        title: '订单管理',
        breadcrumb: {
          items: [{ title: '首页' }, { title: '订单管理' }],
        },
      }}
    >
      <ProTable<API.OrderResponse>
        headerTitle="订单列表"
        actionRef={actionRef}
        rowKey="id"
        scroll={{ x: 1200 }}
        search={{
          labelWidth: 100,
          defaultCollapsed: false,
        }}
        toolBarRender={() => [
          <Button
            key="create"
            type="primary"
            onClick={() => handleModalVisible(true)}
          >
            新建订单
          </Button>,
        ]}
        request={async (params) => {
          const { current, pageSize, status, ...rest } = params;
          const res = await getOrders({
            page: current || 1,
            size: pageSize || 10,
            status,
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
            description={`确定要删除选中的 ${selectedRowsState.length} 个订单吗？`}
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
      )}

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
        title={row ? `订单 #${row.id}` : '订单详情'}
      >
        {row?.id && (
          <ProDescriptions<API.OrderResponse>
            column={2}
            title={`订单 #${row.id}`}
            request={async () => ({ data: row || {} })}
            params={{ id: row?.id }}
            columns={columns as any}
          />
        )}
      </Drawer>
    </PageContainer>
  );
};

export default OrderList;
