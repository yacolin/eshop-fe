import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { PageContainer, ProTable } from '@ant-design/pro-components';
import {
  Divider,
  message,
  Modal,
  Popconfirm,
  Radio,
  Space,
  Tag,
  Tooltip,
} from 'antd';
import React, { useRef, useState } from 'react';

import {
  deleteAdminReviewsId,
  getAdminReviewsPending,
  patchAdminReviewsIdModerate,
  postAdminReviewsIdReply,
} from '@/services/api/reviews';

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

const ReviewManagePage: React.FC = () => {
  const actionRef = useRef<ActionType>();

  // 审核弹窗
  const [moderateVisible, setModerateVisible] = useState(false);
  const [moderateReview, setModerateReview] = useState<API.ReviewResp>();
  const [moderateStatus, setModerateStatus] = useState<string>('approved');

  // 回复弹窗
  const [replyVisible, setReplyVisible] = useState(false);
  const [replyReview, setReplyReview] = useState<API.ReviewResp>();
  const [replyContent, setReplyContent] = useState('');

  /** 审核评论 */
  const handleModerate = async () => {
    if (!moderateReview?.id) return;
    const hide = message.loading('正在处理');
    try {
      await patchAdminReviewsIdModerate(
        { id: moderateReview.id },
        {
          status: moderateStatus as 'approved' | 'rejected' | 'hidden',
        },
      );
      hide();
      message.success('审核完成');
      setModerateVisible(false);
      actionRef.current?.reload();
    } catch {
      hide();
      message.error('审核失败，请重试');
    }
  };

  /** 回复评论 */
  const handleReply = async () => {
    if (!replyReview?.id) return;
    const hide = message.loading('正在提交');
    try {
      await postAdminReviewsIdReply(
        { id: replyReview.id },
        { reply: replyContent },
      );
      hide();
      message.success('回复成功');
      setReplyVisible(false);
      setReplyContent('');
      actionRef.current?.reload();
    } catch {
      hide();
      message.error('回复失败，请重试');
    }
  };

  /** 删除评论 */
  const handleDelete = async (id: number) => {
    const hide = message.loading('正在删除');
    try {
      await deleteAdminReviewsId({ id });
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
      title: '用户',
      dataIndex: 'user_name',
      width: 100,
      render: (_, record) => record.user_name || `用户${record.user_id}`,
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
      title: '商家回复',
      dataIndex: 'reply',
      width: 160,
      search: false,
      ellipsis: true,
      render: (_, record) =>
        record.reply ? (
          <Tooltip title={record.reply}>
            <span>{record.reply}</span>
          </Tooltip>
        ) : (
          <span style={{ color: '#999' }}>暂无回复</span>
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
      width: 240,
      key: 'action',
      search: false,
      fixed: 'right',
      render: (_, record) => (
        <Space split={<Divider type="vertical" />}>
          {record.status === 'pending' && (
            <a
              onClick={() => {
                setModerateReview(record);
                setModerateStatus('approved');
                setModerateVisible(true);
              }}
            >
              审核
            </a>
          )}
          {record.status === 'approved' && !record.reply && (
            <a
              onClick={() => {
                setReplyReview(record);
                setReplyContent('');
                setReplyVisible(true);
              }}
            >
              回复
            </a>
          )}
          {record.status === 'approved' && record.reply && (
            <a
              onClick={() => {
                setReplyReview(record);
                setReplyContent(record.reply || '');
                setReplyVisible(true);
              }}
            >
              编辑回复
            </a>
          )}
          <Popconfirm
            title="确定删除该评论？"
            onConfirm={() => handleDelete(record.id!)}
          >
            <a style={{ color: '#ff4d4f' }}>删除</a>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <PageContainer
      header={{
        title: '评论审核',
        breadcrumb: {
          items: [{ title: '首页' }, { title: '评论审核' }],
        },
      }}
    >
      <ProTable<API.ReviewResp>
        actionRef={actionRef}
        rowKey="id"
        search={false}
        scroll={{ x: 1200 }}
        options={{
          density: true,
          fullScreen: true,
          reload: true,
          setting: true,
        }}
        request={async (params) => {
          const { current, pageSize } = params;
          const res = await getAdminReviewsPending({
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

      {/* 审核弹窗 */}
      <Modal
        title="审核评论"
        open={moderateVisible}
        onOk={handleModerate}
        onCancel={() => setModerateVisible(false)}
        okText="确认"
        cancelText="取消"
      >
        <div style={{ marginBottom: 16 }}>
          <div style={{ marginBottom: 8, color: '#666' }}>
            用户：
            {moderateReview?.user_name || `用户${moderateReview?.user_id}`}
          </div>
          <div style={{ marginBottom: 8, color: '#666' }}>
            评分：
            <span style={{ color: '#faad14' }}>
              {renderRating(moderateReview?.rating)}
            </span>
          </div>
          <div
            style={{
              marginBottom: 16,
              padding: '8px 12px',
              background: '#f5f5f5',
              borderRadius: 4,
            }}
          >
            {moderateReview?.content || '（无文本内容）'}
          </div>
        </div>
        <div style={{ marginBottom: 16 }}>
          <div style={{ marginBottom: 8 }}>审核结果：</div>
          <Radio.Group
            value={moderateStatus}
            onChange={(e) => setModerateStatus(e.target.value)}
          >
            <Radio value="approved">通过</Radio>
            <Radio value="rejected">拒绝</Radio>
            <Radio value="hidden">隐藏</Radio>
          </Radio.Group>
        </div>
      </Modal>

      {/* 回复弹窗 */}
      <Modal
        title="回复评论"
        open={replyVisible}
        onOk={handleReply}
        onCancel={() => {
          setReplyVisible(false);
          setReplyContent('');
        }}
        okText="回复"
        cancelText="取消"
      >
        <div style={{ marginBottom: 16 }}>
          <div style={{ marginBottom: 8, color: '#666' }}>
            用户：
            {replyReview?.user_name || `用户${replyReview?.user_id}`}
          </div>
          <div style={{ marginBottom: 8, color: '#666' }}>
            评分：
            <span style={{ color: '#faad14' }}>
              {renderRating(replyReview?.rating)}
            </span>
          </div>
          <div
            style={{
              marginBottom: 16,
              padding: '8px 12px',
              background: '#f5f5f5',
              borderRadius: 4,
            }}
          >
            {replyReview?.content || '（无文本内容）'}
          </div>
        </div>
        <div style={{ marginBottom: 16 }}>
          <div style={{ marginBottom: 8 }}>回复内容：</div>
          <textarea
            value={replyContent}
            onChange={(e) => setReplyContent(e.target.value)}
            placeholder="请输入回复内容"
            rows={4}
            style={{
              width: '100%',
              padding: 8,
              borderRadius: 4,
              border: '1px solid #d9d9d9',
              resize: 'vertical',
            }}
          />
        </div>
      </Modal>
    </PageContainer>
  );
};

export default ReviewManagePage;
