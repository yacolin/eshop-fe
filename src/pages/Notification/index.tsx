import type { ActionType, ProColumns } from '@ant-design/pro-components';
import {
  PageContainer,
  ProDescriptions,
  ProTable,
} from '@ant-design/pro-components';
import { Button, Divider, Drawer, message, Popconfirm, Tag } from 'antd';
import React, { useRef, useState } from 'react';

import Auth from '@/components/Auth';
import {
  deleteNotificationsId,
  getNotifications,
  getNotificationsUnread,
  putNotificationsIdRead,
  putNotificationsReadall,
} from '@/services/api/notifications';
import CreateForm from './components/CreateForm';

const notificationTypeMap: Record<number, { text: string; color: string }> = {
  1: { text: '系统', color: 'blue' },
  2: { text: '订单', color: 'cyan' },
  3: { text: '支付', color: 'green' },
  4: { text: '秒杀', color: 'volcano' },
  5: { text: '管理员', color: 'purple' },
};

const formatTime = (t?: number) => {
  if (!t) return '-';
  const d = new Date(t * 1000);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(
    2,
    '0',
  )}-${String(d.getDate()).padStart(2, '0')} ${String(d.getHours()).padStart(
    2,
    '0',
  )}:${String(d.getMinutes()).padStart(2, '0')}`;
};

const NotificationList: React.FC = () => {
  const [createModalVisible, handleCreateModalVisible] =
    useState<boolean>(false);
  const actionRef = useRef<ActionType>();
  const [row, setRow] = useState<API.NotificationResp>();
  const [unreadCount, setUnreadCount] = useState<number>(0);

  const fetchUnread = async () => {
    try {
      const res = await getNotificationsUnread();
      const data = (res as any).data || {};
      setUnreadCount(data.count ?? 0);
    } catch {
      // 静默
    }
  };

  React.useEffect(() => {
    fetchUnread();
  }, []);

  /**
   * 标记已读
   */
  const handleMarkRead = async (id: number) => {
    try {
      await putNotificationsIdRead({ id });
      message.success('已标记已读');
      actionRef.current?.reload();
      fetchUnread();
    } catch {
      message.error('操作失败');
    }
  };

  /**
   * 全部已读
   */
  const handleMarkAllRead = async () => {
    try {
      await putNotificationsReadall();
      message.success('已全部标记已读');
      actionRef.current?.reload();
      setUnreadCount(0);
    } catch {
      message.error('操作失败');
    }
  };

  /**
   * 删除通知
   */
  const handleRemove = async (id: number) => {
    try {
      await deleteNotificationsId({ id });
      message.success('删除成功');
      actionRef.current?.reload();
      fetchUnread();
    } catch {
      message.error('删除失败，请重试');
    }
  };

  const columns: ProColumns<API.NotificationResp>[] = [
    {
      title: 'ID',
      dataIndex: 'id',
      hideInSearch: true,
      width: 60,
    },
    {
      title: '标题',
      dataIndex: 'title',
      width: 200,
    },
    {
      title: '类型',
      dataIndex: 'category',
      width: 100,
      valueType: 'select',
      valueEnum: {
        1: { text: '系统' },
        2: { text: '订单' },
        3: { text: '支付' },
        4: { text: '秒杀' },
        5: { text: '管理员' },
      },
      render: (_, record) => {
        const cfg = notificationTypeMap[record.category || 0];
        return cfg ? <Tag color={cfg.color}>{cfg.text}</Tag> : '-';
      },
    },
    {
      title: '内容',
      dataIndex: 'content',
      hideInSearch: true,
      width: 300,
      ellipsis: true,
    },
    {
      title: '已读',
      dataIndex: 'is_read',
      width: 80,
      filters: true,
      valueType: 'select',
      valueEnum: {
        true: { text: '已读' },
        false: { text: '未读' },
      },
      render: (_, record) =>
        record.is_read ? (
          <Tag color="default">已读</Tag>
        ) : (
          <Tag color="red">未读</Tag>
        ),
    },
    {
      title: '创建时间',
      dataIndex: 'created_at',
      hideInForm: true,
      hideInSearch: true,
      width: 150,
      render: (_, record) => formatTime(record.created_at),
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      width: 160,
      fixed: 'right',
      render: (_, record) => (
        <div style={{ paddingLeft: 8, whiteSpace: 'nowrap' }}>
          <a onClick={() => setRow(record)}>查看</a>
          {!record.is_read && (
            <>
              <Divider type="vertical" />
              <a onClick={() => handleMarkRead(record.id!)}>标为已读</a>
            </>
          )}
          <Divider type="vertical" />
          <Popconfirm
            title="确认删除"
            description={`确定要删除通知「${record.title}」吗？`}
            onConfirm={() => handleRemove(record.id!)}
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
        title: '通知管理',
        breadcrumb: {
          items: [{ title: '首页' }, { title: '通知管理' }],
        },
      }}
    >
      <ProTable<API.NotificationResp>
        headerTitle={`通知列表${
          unreadCount > 0 ? `（${unreadCount} 条未读）` : ''
        }`}
        actionRef={actionRef}
        rowKey="id"
        scroll={{ x: 1100 }}
        search={{
          labelWidth: 100,
          defaultCollapsed: false,
        }}
        toolBarRender={() => [
          <Button key="markAllRead" onClick={handleMarkAllRead}>
            全部已读
          </Button>,
          <Auth key="create" permission="canCreateNotification">
            <Button
              type="primary"
              onClick={() => handleCreateModalVisible(true)}
            >
              发送通知
            </Button>
          </Auth>,
        ]}
        request={async (params) => {
          const { current, pageSize, ...rest } = params;
          const res = await getNotifications({
            page: current || 1,
            size: pageSize || 10,
            ...rest,
          });
          const data = (res as any).data || {};
          // 拉取列表后同步未读数
          fetchUnread();
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

      {/* 发送通知 */}
      <CreateForm
        modalVisible={createModalVisible}
        onCancel={() => handleCreateModalVisible(false)}
        onSubmit={async () => {
          handleCreateModalVisible(false);
          actionRef.current?.reload();
          fetchUnread();
          return true;
        }}
      />

      {/* 详情 */}
      <Drawer
        width={600}
        open={!!row}
        onClose={() => setRow(undefined)}
        closable
        title={row?.title || '通知详情'}
      >
        {row?.id && (
          <ProDescriptions<API.NotificationResp>
            column={2}
            title={row.title}
            request={async () => ({ data: row || {} })}
            params={{ id: row?.id }}
            columns={columns as any}
          />
        )}
      </Drawer>
    </PageContainer>
  );
};

export default NotificationList;
