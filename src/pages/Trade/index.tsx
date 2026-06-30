import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { PageContainer, ProTable } from '@ant-design/pro-components';
import {
  Button,
  Descriptions,
  Drawer,
  message,
  Space,
  Table,
  Tag,
  Typography,
} from 'antd';
import React, { useEffect, useRef, useState } from 'react';

import { ORDER_STATUS_MAP, PAYMENT_METHOD_MAP } from '@/constants';
import { getOrders, getOrdersOrderNo } from '@/services/api/orders';

const paymentStatusMap: Record<string, { text: string; color: string }> = {
  unpaid: { text: '未支付', color: 'orange' },
  paid: { text: '已支付', color: '#52c41a' },
  refunded: { text: '已退款', color: '#999' },
};

const formatPrice = (price?: number) => {
  if (price === undefined || price === null) return '-';
  return `¥${(price / 100).toFixed(2)}`;
};

const formatSpec = (spec?: string) => {
  if (!spec) return '-';
  try {
    const obj = JSON.parse(spec);
    return (
      <div style={{ lineHeight: 1.8 }}>
        {Object.entries(obj).map(([k, v]) => (
          <div key={k}>
            {k}: {String(v)}
          </div>
        ))}
      </div>
    );
  } catch {
    return spec;
  }
};

const TradeList: React.FC = () => {
  const actionRef = useRef<ActionType>();
  const [row, setRow] = useState<API.Order>();
  const [detailData, setDetailData] = useState<API.OrderDetailResponse>();

  /** 查看详情时拉取完整数据 */
  useEffect(() => {
    if (!row?.order_no) {
      setDetailData(undefined);
      return;
    }
    getOrdersOrderNo({ order_no: row.order_no }).then((res) => {
      setDetailData((res as any).data);
    });
  }, [row?.order_no]);

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
      width: 240,
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
        const cfg = ORDER_STATUS_MAP[record.status || ''];
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
      render: (_, record) =>
        PAYMENT_METHOD_MAP[record.payment_method || ''] ||
        record.payment_method ||
        '-',
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
      render: (_, record) => <a onClick={() => setRow(record)}>查看</a>,
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
        scroll={{ x: 1500 }}
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
        width={640}
        open={!!row}
        onClose={() => setRow(undefined)}
        closable
        title={`订单 #${row?.order_no || ''}`}
        extra={
          <Button
            type="primary"
            size="small"
            loading={false}
            onClick={async () => {
              if (!row?.order_no) return;
              try {
                const res = await getOrdersOrderNo({ order_no: row.order_no });
                setDetailData((res as any).data);
                message.success('已刷新');
              } catch {
                message.error('刷新失败');
              }
            }}
          >
            刷新
          </Button>
        }
      >
        {detailData && (
          <Space direction="vertical" style={{ width: '100%' }} size="large">
            {/* 订单信息 */}
            <Descriptions title="订单信息" column={2} size="small" bordered>
              <Descriptions.Item label="订单号">
                {detailData.order_no}
              </Descriptions.Item>
              <Descriptions.Item label="订单状态">
                {(() => {
                  const cfg = ORDER_STATUS_MAP[detailData.status || ''];
                  return cfg ? (
                    <Tag color={cfg.color}>{cfg.text}</Tag>
                  ) : (
                    detailData.status || '-'
                  );
                })()}
              </Descriptions.Item>
              <Descriptions.Item label="实付金额">
                {formatPrice(detailData.pay_amount)}
              </Descriptions.Item>
              <Descriptions.Item label="运费">
                {formatPrice(detailData.shipping_fee)}
              </Descriptions.Item>
              <Descriptions.Item label="支付方式">
                {PAYMENT_METHOD_MAP[detailData.payment_method || ''] ||
                  detailData.payment_method ||
                  '-'}
              </Descriptions.Item>
              <Descriptions.Item label="支付状态">
                {(() => {
                  const cfg = paymentStatusMap[detailData.payment_status || ''];
                  return cfg ? (
                    <Tag color={cfg.color}>{cfg.text}</Tag>
                  ) : (
                    detailData.payment_status || '-'
                  );
                })()}
              </Descriptions.Item>
              <Descriptions.Item label="下单时间">
                {detailData.created_at || '-'}
              </Descriptions.Item>
              <Descriptions.Item label="来源">
                {detailData.source || '-'}
              </Descriptions.Item>
            </Descriptions>

            {/* 收货信息 */}
            <Descriptions title="收货信息" column={2} size="small" bordered>
              <Descriptions.Item label="收货人">
                {detailData.consignee || '-'}
              </Descriptions.Item>
              <Descriptions.Item label="手机号">
                {detailData.phone || '-'}
              </Descriptions.Item>
              <Descriptions.Item label="收货地址" span={2}>
                {[
                  detailData.province,
                  detailData.city,
                  detailData.district,
                  detailData.detail_addr,
                ]
                  .filter(Boolean)
                  .join(' ') || '-'}
              </Descriptions.Item>
            </Descriptions>

            {/* 订单商品 */}
            {detailData.items && detailData.items.length > 0 && (
              <>
                <Typography.Title level={5}>订单商品</Typography.Title>
                <Table
                  dataSource={detailData.items}
                  rowKey="id"
                  pagination={false}
                  size="small"
                  columns={[
                    { title: '商品', dataIndex: 'product_name', width: 160 },
                    {
                      title: '规格',
                      width: 160,
                      render: (_, record) => formatSpec(record.sku_spec),
                    },
                    {
                      title: '单价',
                      width: 80,
                      render: (_, record) => formatPrice(record.price),
                    },
                    { title: '数量', dataIndex: 'quantity', width: 60 },
                    {
                      title: '小计',
                      width: 80,
                      render: (_, record) => formatPrice(record.subtotal),
                    },
                  ]}
                />
              </>
            )}

            {/* 备注 */}
            {detailData.buyer_remark && (
              <Descriptions title="备注" size="small" bordered>
                <Descriptions.Item label="买家备注">
                  {detailData.buyer_remark}
                </Descriptions.Item>
              </Descriptions>
            )}
          </Space>
        )}
      </Drawer>
    </PageContainer>
  );
};

export default TradeList;
