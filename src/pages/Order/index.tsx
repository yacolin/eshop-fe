import type { ActionType, ProColumns } from '@ant-design/pro-components';
import {
  PageContainer,
  ProDescriptions,
  ProTable,
} from '@ant-design/pro-components';
import { Button, Divider, Drawer, Dropdown, message, Tag } from 'antd';
import React, { useRef, useState } from 'react';

import LinkText from '@/components/LinkText';

import { ORDER_STATUS_MAP } from '@/constants';
import {
  getOrders,
  patchOrdersIdStatus,
  postOrders,
} from '@/services/api/orders';
import CreateForm from './components/CreateForm';

const formatPrice = (price?: number) => {
  if (price === undefined || price === null) return '-';
  return `¥${(price / 100).toFixed(2)}`;
};

const orderStatusMap = ORDER_STATUS_MAP;

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

const handleStatusChange = async (id: number, status: string) => {
  try {
    await patchOrdersIdStatus({ id }, { status });
    message.success('状态更新成功');
    return true;
  } catch {
    message.error('状态更新失败');
    return false;
  }
};

const OrderList: React.FC = () => {
  const [createModalVisible, handleModalVisible] = useState<boolean>(false);
  const actionRef = useRef<ActionType>();
  const [row, setRow] = useState<API.OrderResponse>();

  const columns: ProColumns<API.OrderResponse>[] = [
    {
      title: '订单号',
      dataIndex: 'order_no',
      width: 200,
      fixed: 'left',
      render: (_, record) => (
        <LinkText
          value={record.order_no}
          path="/sales/orderitem"
          state={{ order_no: record.order_no }}
        />
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
      width: 120,
      fixed: 'right',
      render: (_, record) => (
        <div style={{ paddingLeft: 8, whiteSpace: 'nowrap' }}>
          <a onClick={() => setRow(record)}>查看</a>
          <Divider type="vertical" />
          <Dropdown
            menu={{
              onClick: ({ key }) => {
                handleStatusChange(record.id!, key).then((ok) => {
                  if (ok) actionRef.current?.reload();
                });
              },
              items: Object.entries(orderStatusMap).map(([key, val]) => ({
                key,
                label: val.text,
              })),
            }}
          >
            <a onClick={(e) => e.preventDefault()}>改状态</a>
          </Dropdown>
        </div>
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
            sort_by: 'created_at',
            order: 'desc',
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
