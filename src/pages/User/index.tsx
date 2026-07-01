import type { ActionType, ProColumns } from '@ant-design/pro-components';
import {
  FooterToolbar,
  PageContainer,
  ProTable,
} from '@ant-design/pro-components';
import {
  Button,
  Checkbox,
  Divider,
  message,
  Modal,
  Popconfirm,
  Spin,
  Tag,
} from 'antd';
import React, { useRef, useState } from 'react';

import Auth from '@/components/Auth';

import { getRoles } from '@/services/api/roles';
import {
  deleteUsersUserIdRolesRoleId,
  getUsers,
  postUsersUserIdRoles,
} from '@/services/api/users';
import DetailDrawer from './components/DetailDrawer';

const statusMap: Record<number, { text: string; color: string }> = {
  1: { text: '正常', color: '#52c41a' },
  2: { text: '禁用', color: '#ff4d4f' },
  3: { text: '冻结', color: '#faad14' },
};

const handleRemove = async (
  selectedRows: API.UserListItem[],
): Promise<boolean> => {
  const hide = message.loading('正在删除');
  if (!selectedRows.length) return true;
  try {
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
  const [row, setRow] = useState<API.UserListItem>();
  const [selectedRowsState, setSelectedRows] = useState<API.UserListItem[]>([]);

  // 分配角色弹窗
  const [assignRoleUser, setAssignRoleUser] = useState<API.UserListItem>();
  const [allRoles, setAllRoles] = useState<API.Role[]>([]);
  const [selectedRoleIds, setSelectedRoleIds] = useState<number[]>([]);
  const [roleModalOpen, setRoleModalOpen] = useState(false);
  const [savingRoles, setSavingRoles] = useState(false);
  const [loadingRoles, setLoadingRoles] = useState(false);

  const openRoleModal = async (user: API.UserListItem) => {
    setAssignRoleUser(user);
    const ids = (user.roles || []).map((r) => r.id!).filter(Boolean);
    setSelectedRoleIds(ids);
    setRoleModalOpen(true);
    if (allRoles.length === 0) {
      setLoadingRoles(true);
      try {
        const res = await getRoles({ page: 1, size: 100 });
        setAllRoles((res as any).data?.list || []);
      } finally {
        setLoadingRoles(false);
      }
    }
  };

  const handleSaveRoles = async () => {
    if (!assignRoleUser?.id) return;
    setSavingRoles(true);
    try {
      const currentIds = (assignRoleUser.roles || [])
        .map((r) => r.id!)
        .filter(Boolean);
      const toAdd = selectedRoleIds.filter((id) => !currentIds.includes(id));
      const toRemove = currentIds.filter((id) => !selectedRoleIds.includes(id));

      await Promise.all([
        ...toAdd.map((rid) =>
          postUsersUserIdRoles(
            { user_id: assignRoleUser.id! },
            { role_id: rid },
          ),
        ),
        ...toRemove.map((rid) =>
          deleteUsersUserIdRolesRoleId({
            user_id: assignRoleUser.id!,
            role_id: rid,
          }),
        ),
      ]);

      assignRoleUser.roles = allRoles.filter((r) =>
        selectedRoleIds.includes(r.id!),
      );
      setRoleModalOpen(false);
      message.success('角色分配已更新');
    } catch {
      message.error('角色分配失败');
    } finally {
      setSavingRoles(false);
    }
  };

  const columns: ProColumns<API.UserListItem>[] = [
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
      width: 200,
      fixed: 'right',
      render: (_, record) => (
        <div style={{ paddingLeft: 8, whiteSpace: 'nowrap' }}>
          <a onClick={() => setRow(record)}>查看</a>
          <Divider type="vertical" />
          <a onClick={() => openRoleModal(record)}>分配角色</a>
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
      <ProTable<API.UserListItem>
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

      <Modal
        title={
          assignRoleUser
            ? `分配角色 — ${assignRoleUser.username || assignRoleUser.nickname}`
            : '分配角色'
        }
        width={400}
        open={roleModalOpen}
        onCancel={() => setRoleModalOpen(false)}
        onOk={handleSaveRoles}
        confirmLoading={savingRoles}
        destroyOnClose
      >
        <Spin spinning={loadingRoles}>
          <Checkbox.Group
            value={selectedRoleIds}
            onChange={(values) => setSelectedRoleIds(values as number[])}
            style={{ display: 'flex', flexDirection: 'column', gap: 8 }}
          >
            {allRoles.map((role) => (
              <Checkbox key={role.id} value={role.id!}>
                <span>
                  {role.display_name || role.name}
                  <span style={{ color: '#999', marginLeft: 6, fontSize: 12 }}>
                    {role.name}
                  </span>
                </span>
              </Checkbox>
            ))}
          </Checkbox.Group>
          {allRoles.length === 0 && !loadingRoles && (
            <div style={{ textAlign: 'center', color: '#999', padding: 24 }}>
              暂无可用角色
            </div>
          )}
        </Spin>
      </Modal>
    </PageContainer>
  );
};

export default UserList;
