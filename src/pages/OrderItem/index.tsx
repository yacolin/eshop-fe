import type { ActionType, ProColumns } from '@ant-design/pro-components';
import {
  PageContainer,
  ProDescriptions,
  ProTable,
} from '@ant-design/pro-components';
import { Button, Divider, Drawer, message, Popconfirm } from 'antd';
import React, { useRef, useState } from 'react';

import LinkText from '@/components/LinkText';
import { useRouteFilter } from '@/hooks/useRouteFilter';
import { getOrdersItems } from '@/services/api/orders';
import CreateForm from './components/CreateForm';

/**
 * 格式化金额：分 → 元
 */
const formatPrice = (price?: number) => {
  if (price === undefined || price === null) return '-';
  return `¥${(price / 100).toFixed(2)}`;
};

const OrderItemList: React.FC = () => {
  const [createModalVisible, handleModalVisible] = useState<boolean>(false);
  const actionRef = useRef<ActionType>();
  const [row, setRow] = useState<API.OrderItemResponse>();
  const formRef = useRef<any>(null);

  const { getFilter, markApplied } = useRouteFilter<{ order_no: string }>(
    formRef,
    ['order_no'],
  );

  const columns: ProColumns<API.OrderItemResponse>[] = [
    {
      title: '订单号',
      dataIndex: 'order_no',
      width: 200,
      fixed: 'left',
      render: (_, record) => <LinkText value={record.order_no} />,
    },
    {
      title: '商品ID',
      dataIndex: 'product_id',
      width: 100,
    },
    {
      title: '数量',
      dataIndex: 'quantity',
      hideInSearch: true,
      width: 80,
    },
    {
      title: '单价',
      dataIndex: 'unit_price',
      hideInSearch: true,
      width: 100,
      render: (_, record) => formatPrice(record.unit_price),
    },
    {
      title: '小计',
      dataIndex: 'amount',
      hideInSearch: true,
      width: 100,
      render: (_, record) => formatPrice(record.amount),
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
          <Popconfirm
            title="确认删除"
            description={`确定要删除订单项 #${record.id} 吗？`}
            onConfirm={async () => {
              message.success('删除成功');
              actionRef.current?.reloadAndRest?.();
            }}
          >
            <a style={{ color: '#ff4d4f' }}>删除</a>
          </Popconfirm>
        </div>
      ),
    },
  ];

  return (
    <PageContainer
      header={{
        title: '订单项管理',
        breadcrumb: {
          items: [{ title: '首页' }, { title: '订单项管理' }],
        },
      }}
    >
      <ProTable<API.OrderItemResponse>
        headerTitle="订单项列表"
        actionRef={actionRef}
        formRef={formRef}
        rowKey="id"
        scroll={{ x: 800 }}
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
            新建订单项
          </Button>,
        ]}
        request={async (params) => {
          const { current, pageSize, order_no: formOrderNo, ...rest } = params;
          const orderNo = getFilter('order_no', formOrderNo);
          markApplied();

          const res = await getOrdersItems({
            page: current || 1,
            size: pageSize || 10,
            order_no: orderNo,
            sort_by: 'created_at',
            order: 'desc',
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
        onSubmit={async () => {
          handleModalVisible(false);
          actionRef.current?.reload();
          return true;
        }}
      />

      <Drawer
        width={600}
        open={!!row}
        onClose={() => setRow(undefined)}
        closable
        title={row ? `订单项 #${row.id}` : '订单项详情'}
      >
        {row?.id && (
          <ProDescriptions<API.OrderItemResponse>
            column={2}
            title={`订单项 #${row.id}`}
            request={async () => ({ data: row || {} })}
            params={{ id: row?.id }}
            columns={columns as any}
          />
        )}
      </Drawer>
    </PageContainer>
  );
};

export default OrderItemList;
