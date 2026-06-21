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
  getRefunds,
  patchRefundsIdStatus,
  postRefunds,
} from '@/services/api/refunds';
import CreateForm from './components/CreateForm';

const formatPrice = (price?: number) => {
  if (price === undefined || price === null) return '-';
  return `¥${(price / 100).toFixed(2)}`;
};

const refundStatusMap: Record<string, { text: string; color: string }> = {
  pending: { text: '待审核', color: 'gold' },
  approved: { text: '已批准', color: 'blue' },
  rejected: { text: '已驳回', color: 'red' },
  processing: { text: '退款中', color: 'cyan' },
  completed: { text: '已退款', color: 'green' },
};

/**
 * 新增退款
 */
const handleAdd = async (fields: API.CreateRefundRequest) => {
  const hide = message.loading('正在创建');
  try {
    await postRefunds({
      ...fields,
      refund_amount: Math.round(fields.refund_amount * 100),
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
 * 更新退款状态
 */
const handleStatusChange = async (id: number, status: string) => {
  try {
    await patchRefundsIdStatus({ id }, { status });
    message.success('状态更新成功');
    return true;
  } catch {
    message.error('状态更新失败');
    return false;
  }
};

const RefundList: React.FC = () => {
  const [createModalVisible, handleModalVisible] = useState<boolean>(false);
  const actionRef = useRef<ActionType>();
  const [row, setRow] = useState<API.RefundResponse>();

  const columns: ProColumns<API.RefundResponse>[] = [
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
      title: '支付ID',
      dataIndex: 'payment_id',
      hideInSearch: true,
      width: 100,
    },
    {
      title: '退款金额',
      dataIndex: 'refund_amount',
      hideInSearch: true,
      width: 120,
      render: (_, record) => formatPrice(record.refund_amount),
    },
    {
      title: '退款原因',
      dataIndex: 'refund_reason',
      hideInSearch: true,
      width: 200,
      ellipsis: true,
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 100,
      valueType: 'select',
      valueEnum: Object.entries(refundStatusMap).reduce((acc, [key, val]) => {
        acc[key] = { text: val.text };
        return acc;
      }, {} as Record<string, { text: string }>),
      render: (_, record) => {
        const cfg = refundStatusMap[record.status || ''];
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
          <Auth permission="canUpdateRefund">
            <Divider type="vertical" />
            <Dropdown
              menu={{
                onClick: ({ key }) => {
                  handleStatusChange(record.id!, key).then((ok) => {
                    if (ok) actionRef.current?.reload();
                  });
                },
                items: Object.entries(refundStatusMap).map(([key, val]) => ({
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
        title: '退款管理',
        breadcrumb: {
          items: [{ title: '首页' }, { title: '退款管理' }],
        },
      }}
    >
      <ProTable<API.RefundResponse>
        headerTitle="退款记录"
        actionRef={actionRef}
        rowKey="id"
        scroll={{ x: 1200 }}
        search={{
          labelWidth: 100,
          defaultCollapsed: false,
        }}
        toolBarRender={() => [
          <Auth key="create" permission="canCreateRefund">
            <Button type="primary" onClick={() => handleModalVisible(true)}>
              新建退款
            </Button>
          </Auth>,
        ]}
        request={async (params) => {
          const { current, pageSize, ...rest } = params;
          const res = await getRefunds({
            page: current || 1,
            page_size: pageSize || 10,
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
        title={row ? `退款 #${row.id}` : '退款详情'}
      >
        {row?.id && (
          <ProDescriptions<API.RefundResponse>
            column={2}
            title={`退款 #${row.id}`}
            request={async () => ({ data: row || {} })}
            params={{ id: row?.id }}
            columns={columns as any}
          />
        )}
      </Drawer>
    </PageContainer>
  );
};

export default RefundList;
