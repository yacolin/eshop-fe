import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { PageContainer, ProTable } from '@ant-design/pro-components';
import { message, Popconfirm, Tag } from 'antd';
import React, { useRef } from 'react';

import { deleteReviewsId, getReviewsMe } from '@/services/api/reviews';

const statusColorMap: Record<string, string> = {
  pending: 'orange',
  approved: 'green',
  rejected: 'red',
  hidden: 'default',
};

const statusLabelMap: Record<string, string> = {
  pending: '待审核',
  approved: '已通过',
  rejected: '已拒绝',
  hidden: '已隐藏',
};

const renderRating = (rating?: number) => {
  if (!rating) return '-';
  return '★'.repeat(rating) + '☆'.repeat(5 - rating);
};

const MyReviewsPage: React.FC = () => {
  const actionRef = useRef<ActionType>();

  /** 删除我的评论 */
  const handleDelete = async (id: number) => {
    const hide = message.loading('正在删除');
    try {
      await deleteReviewsId({ id });
      hide();
      message.success('删除成功');
      actionRef.current?.reload();
    } catch {
      hide();
      message.error('删除失败，请重试');
    }
  };

  const columns: ProColumns<API.ReviewResp>[] = [
    {
      title: 'ID',
      dataIndex: 'id',
      width: 60,
      search: false,
    },
    {
      title: '商品ID',
      dataIndex: 'product_id',
      width: 80,
    },
    {
      title: '评分',
      dataIndex: 'rating',
      width: 100,
      search: false,
      render: (_, record) => (
        <span style={{ color: '#faad14' }}>{renderRating(record.rating)}</span>
      ),
    },
    {
      title: '评论内容',
      dataIndex: 'content',
      ellipsis: true,
      search: false,
    },
    {
      title: '商家回复',
      dataIndex: 'reply',
      width: 160,
      search: false,
      ellipsis: true,
      render: (_, record) =>
        record.reply ? (
          <span>{record.reply}</span>
        ) : (
          <span style={{ color: '#999' }}>暂无回复</span>
        ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 90,
      search: false,
      render: (_, record) => (
        <Tag color={statusColorMap[record.status || '']}>
          {statusLabelMap[record.status || '']}
        </Tag>
      ),
    },
    {
      title: '创建时间',
      dataIndex: 'created_at',
      width: 160,
      search: false,
      valueType: 'dateTime',
    },
    {
      title: '操作',
      width: 100,
      key: 'action',
      search: false,
      render: (_, record) => (
        <Popconfirm
          title="确定删除该评论？"
          onConfirm={() => handleDelete(record.id!)}
        >
          <a style={{ color: '#ff4d4f' }}>删除</a>
        </Popconfirm>
      ),
    },
  ];

  return (
    <PageContainer
      header={{
        title: '我的评论',
        breadcrumb: {
          items: [{ title: '首页' }, { title: '我的评论' }],
        },
      }}
    >
      <ProTable<API.ReviewResp>
        actionRef={actionRef}
        rowKey="id"
        search={false}
        scroll={{ x: 1000 }}
        options={{
          density: true,
          fullScreen: true,
          reload: true,
          setting: true,
        }}
        request={async (params) => {
          const { current, pageSize } = params;
          const res = await getReviewsMe({
            page: current || 1,
            size: pageSize || 10,
          });
          return {
            data: (res as any).data?.list || [],
            total: (res as any).data?.total || 0,
            success: true,
          };
        }}
        columns={columns}
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showQuickJumper: true,
          pageSizeOptions: ['10', '20', '50'],
          showTotal: (total) => `共 ${total} 条`,
        }}
      />
    </PageContainer>
  );
};

export default MyReviewsPage;
