import type { ActionType, ProColumns } from '@ant-design/pro-components';
import {
  PageContainer,
  ProDescriptions,
  ProTable,
} from '@ant-design/pro-components';
import { Button, Divider, Drawer, Dropdown, message, Tag } from 'antd';
import React, { useRef, useState } from 'react';

import Auth from '@/components/Auth';
import {
  getPayments,
  patchPaymentsIdStatus,
  postPayments,
} from '@/services/api/payments';
import CreateForm from './components/CreateForm';

const formatPrice = (price?: number) => {
  if (price === undefined || price === null) return '-';
  return `¥${(price / 100).toFixed(2)}`;
};

const paymentStatusMap: Record<string, { text: string; color: string }> = {
  pending: { text: '待支付', color: 'gold' },
  processing: { text: '支付中', color: 'cyan' },
  completed: { text: '已支付', color: 'green' },
  failed: { text: '支付失败', color: 'red' },
  refunded: { text: '已退款', color: 'orange' },
};

/**
 * 新增支付
 */
const handleAdd = async (fields: API.CreatePaymentRequest) => {
  const hide = message.loading('正在创建');
  try {
    await postPayments({
      ...fields,
      amount: Math.round(fields.amount * 100),
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

/**
 * 更新支付状态
 */
const handleStatusChange = async (id: number, status: string) => {
  try {
    await patchPaymentsIdStatus({ id }, { status });
    message.success('状态更新成功');
    return true;
  } catch {
    message.error('状态更新失败');
    return false;
  }
};

const PaymentList: React.FC = () => {
  const [createModalVisible, handleModalVisible] = useState<boolean>(false);
  const actionRef = useRef<ActionType>();
  const [row, setRow] = useState<API.PaymentResponse>();

  const columns: ProColumns<API.PaymentResponse>[] = [
    {
      title: 'ID',
      dataIndex: 'id',
      hideInSearch: true,
      width: 60,
    },
    {
      title: '订单号',
      dataIndex: 'order_id',
      width: 100,
    },
    {
      title: '支付方式',
      dataIndex: 'payment_method',
      width: 120,
      valueType: 'select',
      valueEnum: {
        alipay: { text: '支付宝' },
        wechat: { text: '微信支付' },
        card: { text: '银行卡' },
      },
      render: (_, record) => {
        const methodMap: Record<string, string> = {
          alipay: '支付宝',
          wechat: '微信支付',
          card: '银行卡',
        };
        return (
          methodMap[record.payment_method || ''] || record.payment_method || '-'
        );
      },
    },
    {
      title: '金额',
      dataIndex: 'amount',
      hideInSearch: true,
      width: 120,
      render: (_, record) => formatPrice(record.amount),
    },
    {
      title: '币种',
      dataIndex: 'currency',
      hideInSearch: true,
      width: 80,
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 100,
      valueType: 'select',
      valueEnum: Object.entries(paymentStatusMap).reduce((acc, [key, val]) => {
        acc[key] = { text: val.text };
        return acc;
      }, {} as Record<string, { text: string }>),
      render: (_, record) => {
        const cfg = paymentStatusMap[record.status || ''];
        return cfg ? <Tag color={cfg.color}>{cfg.text}</Tag> : '-';
      },
    },
    {
      title: '交易号',
      dataIndex: 'transaction_id',
      hideInSearch: true,
      width: 180,
    },
    {
      title: '支付时间',
      dataIndex: 'paid_at',
      hideInSearch: true,
      valueType: 'dateTime',
      width: 160,
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
      width: 120,
      fixed: 'right',
      render: (_, record) => (
        <div style={{ paddingLeft: 8, whiteSpace: 'nowrap' }}>
          <a onClick={() => setRow(record)}>查看</a>
          <Auth permission="canUpdatePayment">
            <Divider type="vertical" />
            <Dropdown
              menu={{
                onClick: ({ key }) => {
                  handleStatusChange(record.id!, key).then((ok) => {
                    if (ok) actionRef.current?.reload();
                  });
                },
                items: Object.entries(paymentStatusMap).map(([key, val]) => ({
                  key,
                  label: val.text,
                })),
              }}
            >
              <a onClick={(e) => e.preventDefault()}>改状态</a>
            </Dropdown>
          </Auth>
        </div>
      ),
    },
  ];

  return (
    <PageContainer
      header={{
        title: '支付管理',
        breadcrumb: {
          items: [{ title: '首页' }, { title: '支付管理' }],
        },
      }}
    >
      <ProTable<API.PaymentResponse>
        headerTitle="支付记录"
        actionRef={actionRef}
        rowKey="id"
        scroll={{ x: 1300 }}
        search={{
          labelWidth: 100,
          defaultCollapsed: false,
        }}
        toolBarRender={() => [
          <Auth key="create" permission="canCreatePayment">
            <Button type="primary" onClick={() => handleModalVisible(true)}>
              新建支付
            </Button>
          </Auth>,
        ]}
        request={async (params) => {
          const { current, pageSize, ...rest } = params;
          const res = await getPayments({
            page: current || 1,
            page_size: pageSize || 10,
            sort_by: 'created_at',
            order: 'desc',
            ...rest,
          });
          const data = (res as any).data || {};
          return {
            data: data.payments || data.list || [],
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

      {/* 新建 */}
      <CreateForm
        modalVisible={createModalVisible}
        onCancel={() => handleModalVisible(false)}
        onSubmit={async (value) => {
          const success = await handleAdd(value);
          if (success) {
            handleModalVisible(false);
            actionRef.current?.reload();
          }
          return success;
        }}
      />

      {/* 详情 */}
      <Drawer
        width={600}
        open={!!row}
        onClose={() => setRow(undefined)}
        closable
        title={row ? `支付 #${row.id}` : '支付详情'}
      >
        {row?.id && (
          <ProDescriptions<API.PaymentResponse>
            column={2}
            title={`支付 #${row.id}`}
            request={async () => ({ data: row || {} })}
            params={{ id: row?.id }}
            columns={columns as any}
          />
        )}
      </Drawer>
    </PageContainer>
  );
};

export default PaymentList;
