import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { PageContainer, ProTable } from '@ant-design/pro-components';
import { Select, Tag } from 'antd';
import React, { useRef } from 'react';

import { getCouponsMe } from '@/services/api/coupons';

const statusMap: Record<number, { text: string; color: string }> = {
  0: { text: '未使用', color: 'blue' },
  1: { text: '已使用', color: '#999' },
  2: { text: '已过期', color: '#999' },
  3: { text: '已冻结', color: 'orange' },
};

const CouponList: React.FC = () => {
  const actionRef = useRef<ActionType>();

  const columns: ProColumns<API.UserPromotion>[] = [
    {
      title: 'ID',
      dataIndex: 'id',
      hideInSearch: true,
      width: 60,
    },
    {
      title: '用户ID',
      dataIndex: 'user_id',
      width: 80,
      hideInSearch: true,
    },
    {
      title: '促销ID',
      dataIndex: 'promotion_id',
      width: 80,
    },
    {
      title: '获取时间',
      dataIndex: 'acquire_time',
      hideInSearch: true,
      valueType: 'dateTime',
      width: 160,
    },
    {
      title: '过期时间',
      dataIndex: 'expire_time',
      hideInSearch: true,
      valueType: 'dateTime',
      width: 160,
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 100,
      render: (_, record) => {
        const cfg = statusMap[record.status ?? -1];
        return cfg ? <Tag color={cfg.color}>{cfg.text}</Tag> : '-';
      },
      renderFormItem: () => (
        <Select
          allowClear
          placeholder="选择状态"
          options={[
            { label: '未使用', value: 0 },
            { label: '已使用', value: 1 },
            { label: '已过期', value: 2 },
            { label: '已冻结', value: 3 },
          ]}
        />
      ),
    },
    {
      title: '使用时间',
      dataIndex: 'used_time',
      hideInSearch: true,
      valueType: 'dateTime',
      width: 160,
    },
    {
      title: '创建时间',
      dataIndex: 'created_at',
      hideInSearch: true,
      valueType: 'dateTime',
      width: 160,
    },
  ];

  return (
    <PageContainer
      header={{
        title: '优惠券管理',
        breadcrumb: { items: [{ title: '首页' }, { title: '优惠券管理' }] },
      }}
    >
      <ProTable<API.UserPromotion>
        headerTitle="用户优惠券"
        actionRef={actionRef}
        rowKey="id"
        scroll={{ x: 1100 }}
        search={{ labelWidth: 100, defaultCollapsed: false }}
        request={async (params) => {
          const { current, pageSize, ...rest } = params;
          const res = await getCouponsMe({
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
    </PageContainer>
  );
};

export default CouponList;
