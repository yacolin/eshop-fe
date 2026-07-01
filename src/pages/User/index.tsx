import type { ActionType, ProColumns } from '@ant-design/pro-components';
import {
  FooterToolbar,
  PageContainer,
  ProTable,
} from '@ant-design/pro-components';
import { Button, Divider, message, Popconfirm, Tag } from 'antd';
import React, { useRef, useState } from 'react';

import Auth from '@/components/Auth';

import { getUsers } from '@/services/api/users';
import DetailDrawer from './components/DetailDrawer';

const statusMap: Record<number, { text: string; color: string }> = {
  1: { text: '正常', color: '#52c41a' },
  2: { text: '禁用', color: '#ff4d4f' },
  3: { text: '冻结', color: '#faad14' },
};

const handleRemove = async (selectedRows: API.User[]): Promise<boolean> => {
  const hide = message.loading('正在删除');
  if (!selectedRows.length) return true;
  try {
    // TODO: 后端实现 DELETE /api/v1/users/:id 后替换
    await Promise.all(
      selectedRows.map(() => Promise.reject(new Error('删除接口未就绪'))),
    );
    hide();
    message.success('删除成功');
    return true;
  } catch {
    hide();
    message.error('删除失败，请重试');
    return false;
  }
};

const UserList: React.FC = () => {
  const actionRef = useRef<ActionType>();
  const [row, setRow] = useState<API.User>();
  const [selectedRowsState, setSelectedRows] = useState<API.User[]>([]);

  const columns: ProColumns<API.User>[] = [
    {
      title: 'ID',
      dataIndex: 'id',
      width: 60,
      fixed: 'left',
      hideInSearch: true,
    },
    {
      title: '用户名',
      dataIndex: 'username',
      width: 120,
    },
    {
      title: '昵称',
      dataIndex: 'nickname',
      width: 120,
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      width: 180,
    },
    {
      title: '手机号',
      dataIndex: 'phone',
      width: 140,
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 80,
      render: (_, record) => {
        const cfg = statusMap[record.status ?? -1];
        return cfg ? <Tag color={cfg.color}>{cfg.text}</Tag> : '-';
      },
      valueType: 'select',
      valueEnum: {
        1: { text: '正常', status: 'Success' },
        2: { text: '禁用', status: 'Error' },
      },
    },
    {
      title: '注册来源',
      dataIndex: 'register_source',
      width: 100,
      hideInSearch: true,
    },
    {
      title: '最后登录',
      dataIndex: 'last_login_at',
      width: 160,
      hideInSearch: true,
      valueType: 'dateTime',
    },
    {
      title: '创建时间',
      dataIndex: 'created_at',
      width: 160,
      hideInSearch: true,
      valueType: 'dateTime',
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
          <Auth permission="canDeleteUser">
            <Divider type="vertical" />
            <Popconfirm
              title="确认删除"
              description={`确定要删除用户「${
                record.username || record.nickname
              }」吗？`}
              onConfirm={async () => {
                const success = await handleRemove([record]);
                if (success) {
                  actionRef.current?.reloadAndRest?.();
                  setSelectedRows([]);
                }
              }}
            >
              <a style={{ color: '#ff4d4f' }}>删除</a>
            </Popconfirm>
          </Auth>
        </div>
      ),
    },
  ];

  return (
    <PageContainer
      header={{
        title: '用户管理',
        breadcrumb: { items: [{ title: '首页' }, { title: '用户管理' }] },
      }}
    >
      <ProTable<API.User>
        headerTitle="用户列表"
        actionRef={actionRef}
        rowKey="id"
        scroll={{ x: 1300 }}
        search={{
          labelWidth: 100,
          defaultCollapsed: false,
          transform: (values) => ({ keyword: values.keyword }),
        }}
        request={async (params) => {
          const { current, pageSize, keyword, ...rest } = params;
          const res = await getUsers({
            page: current || 1,
            size: pageSize || 20,
            keyword: keyword || undefined,
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
        rowSelection={{
          onChange: (_, selectedRows) => setSelectedRows(selectedRows),
        }}
        pagination={{
          defaultPageSize: 10,
          showSizeChanger: true,
          showQuickJumper: true,
          pageSizeOptions: ['10', '20', '50'],
          showTotal: (total) => `共 ${total} 条`,
        }}
      />

      {selectedRowsState?.length > 0 && (
        <Auth permission="canDeleteUser">
          <FooterToolbar
            extra={
              <div>
                已选择{' '}
                <a style={{ fontWeight: 600 }}>{selectedRowsState.length}</a>{' '}
                项&nbsp;&nbsp;
              </div>
            }
          >
            <Popconfirm
              title="确认批量删除"
              description={`确定要删除选中的 ${selectedRowsState.length} 个用户吗？`}
              onConfirm={async () => {
                const success = await handleRemove(selectedRowsState);
                if (success) {
                  setSelectedRows([]);
                  actionRef.current?.reloadAndRest?.();
                }
              }}
            >
              <Button danger>批量删除</Button>
            </Popconfirm>
          </FooterToolbar>
        </Auth>
      )}

      <DetailDrawer row={row} onClose={() => setRow(undefined)} />
    </PageContainer>
  );
};

export default UserList;
