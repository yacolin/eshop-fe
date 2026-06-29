import type { ActionType, ProColumns } from '@ant-design/pro-components';
import {
  PageContainer,
  ProDescriptions,
  ProTable,
} from '@ant-design/pro-components';
import { Divider, Drawer, message, Tag } from 'antd';
import React, { useRef, useState } from 'react';

import { getOrders, getOrdersOrderNo } from '@/services/api/orders';

const statusMap: Record<string, { text: string; color: string }> = {
  pending: { text: '待付款', color: 'orange' },
  paid: { text: '已付款', color: 'blue' },
  shipped: { text: '已发货', color: 'cyan' },
  completed: { text: '已完成', color: '#52c41a' },
  cancelled: { text: '已取消', color: '#999' },
  refunding: { text: '退款中', color: 'volcano' },
  refunded: { text: '已退款', color: '#999' },
};

const paymentStatusMap: Record<string, { text: string; color: string }> = {
  unpaid: { text: '未支付', color: 'orange' },
  paid: { text: '已支付', color: '#52c41a' },
  refunded: { text: '已退款', color: '#999' },
};

const formatPrice = (price?: number) => {
  if (price === undefined || price === null) return '-';
  return `¥${(price / 100).toFixed(2)}`;
};

const TradeList: React.FC = () => {
  const actionRef = useRef<ActionType>();
  const [row, setRow] = useState<API.Order>();

  const columns: ProColumns<API.Order>[] = [
    {
      title: 'ID',
      dataIndex: 'id',
      hideInSearch: true,
      width: 60,
    },
    {
      title: '订单号',
      dataIndex: 'order_no',
      width: 180,
      copyable: true,
    },
    {
      title: '收货人',
      dataIndex: 'consignee',
      width: 100,
    },
    {
      title: '手机号',
      dataIndex: 'phone',
      width: 120,
      hideInSearch: true,
    },
    {
      title: '实付金额',
      dataIndex: 'pay_amount',
      width: 100,
      hideInSearch: true,
      render: (_, record) => formatPrice(record.pay_amount),
    },
    {
      title: '运费',
      dataIndex: 'shipping_fee',
      width: 80,
      hideInSearch: true,
      render: (_, record) => formatPrice(record.shipping_fee),
    },
    {
      title: '订单状态',
      dataIndex: 'status',
      width: 100,
      render: (_, record) => {
        const cfg = statusMap[record.status || ''];
        return cfg ? (
          <Tag color={cfg.color}>{cfg.text}</Tag>
        ) : (
          record.status || '-'
        );
      },
    },
    {
      title: '支付状态',
      dataIndex: 'payment_status',
      width: 100,
      render: (_, record) => {
        const cfg = paymentStatusMap[record.payment_status || ''];
        return cfg ? (
          <Tag color={cfg.color}>{cfg.text}</Tag>
        ) : (
          record.payment_status || '-'
        );
      },
    },
    {
      title: '支付方式',
      dataIndex: 'payment_method',
      width: 100,
      hideInSearch: true,
    },
    {
      title: '来源',
      dataIndex: 'source',
      width: 80,
      hideInSearch: true,
    },
    {
      title: '下单时间',
      dataIndex: 'created_at',
      hideInSearch: true,
      valueType: 'dateTime',
      width: 160,
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      width: 100,
      fixed: 'right',
      render: (_, record) => (
        <div style={{ paddingLeft: 8, whiteSpace: 'nowrap' }}>
          <a onClick={() => setRow(record)}>查看</a>
          <Divider type="vertical" />
          <a
            onClick={async () => {
              try {
                const res = await getOrdersOrderNo({
                  order_no: record.order_no || '',
                });
                setRow((res as any).data || record);
                message.success('已刷新订单详情');
              } catch {
                message.error('获取详情失败');
              }
            }}
          >
            刷新
          </a>
        </div>
      ),
    },
  ];

  return (
    <PageContainer
      header={{
        title: '订单管理',
        breadcrumb: {
          items: [
            { title: '首页' },
            { title: '运营管理' },
            { title: '订单管理' },
          ],
        },
      }}
    >
      <ProTable<API.Order>
        headerTitle="订单列表"
        actionRef={actionRef}
        rowKey="id"
        scroll={{ x: 1400 }}
        search={{ labelWidth: 100, defaultCollapsed: false }}
        request={async (params) => {
          const { current, pageSize, ...rest } = params;
          const res = await getOrders({
            page: current || 1,
            size: pageSize || 10,
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
      <Drawer
        width={600}
        open={!!row}
        onClose={() => setRow(undefined)}
        closable
        title={`订单 #${row?.order_no || ''}`}
      >
        {row && (
          <ProDescriptions<API.Order>
            column={2}
            request={async () => ({ data: row || {} })}
            params={{ id: row?.id }}
            columns={columns as any}
          />
        )}
      </Drawer>
    </PageContainer>
  );
};

export default TradeList;
