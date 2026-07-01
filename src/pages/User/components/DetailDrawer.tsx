import { ProDescriptions } from '@ant-design/pro-components';
import { Button, Divider, Drawer, message, Select, Space, Tag } from 'antd';
import React, { useEffect, useState } from 'react';

import { getRoles } from '@/services/api/roles';
import {
  deleteUsersUserIdRolesRoleId,
  postUsersUserIdRoles,
} from '@/services/api/users';

const statusMap: Record<number, { text: string; color: string }> = {
  1: { text: '正常', color: '#52c41a' },
  2: { text: '禁用', color: '#ff4d4f' },
  3: { text: '冻结', color: '#faad14' },
};

interface DetailDrawerProps {
  row?: API.User;
  onClose: () => void;
}

const DetailDrawer: React.FC<DetailDrawerProps> = ({ row, onClose }) => {
  const [userRoles, setUserRoles] = useState<API.Role[]>([]);
  const [allRoles, setAllRoles] = useState<API.Role[]>([]);
  const [selectedRoleId, setSelectedRoleId] = useState<number>();

  // 加载全部角色供选择
  useEffect(() => {
    if (row?.id) {
      getRoles({ page: 1, size: 100 }).then((res) => {
        setAllRoles((res as any).data?.list || []);
      });
    }
  }, [row?.id]);

  const availableRoles = allRoles.filter(
    (r) => !userRoles.some((ur) => ur.id === r.id),
  );

  const handleAssign = async () => {
    if (!row?.id || !selectedRoleId) return;
    try {
      await postUsersUserIdRoles(
        { user_id: row.id },
        { role_id: selectedRoleId },
      );
      const role = allRoles.find((r) => r.id === selectedRoleId);
      if (role) setUserRoles((prev) => [...prev, role]);
      setSelectedRoleId(undefined);
      message.success('角色分配成功');
    } catch {
      message.error('角色分配失败');
    }
  };

  const handleRemove = async (roleId: number) => {
    if (!row?.id) return;
    try {
      await deleteUsersUserIdRolesRoleId({
        user_id: row.id,
        role_id: roleId,
      });
      setUserRoles((prev) => prev.filter((r) => r.id !== roleId));
      message.success('角色移除成功');
    } catch {
      message.error('角色移除失败');
    }
  };

  return (
    <Drawer
      width={680}
      open={!!row}
      onClose={onClose}
      closable
      title={`用户 #${row?.id || ''}`}
    >
      {row && (
        <>
          <ProDescriptions
            column={2}
            title="基本信息"
            dataSource={row}
            columns={[
              { title: 'ID', dataIndex: 'id' },
              { title: '用户名', dataIndex: 'username' },
              { title: '昵称', dataIndex: 'nickname' },
              { title: '邮箱', dataIndex: 'email' },
              {
                title: '邮箱验证',
                dataIndex: 'email_verified',
                render: (_, r) =>
                  r.email_verified ? (
                    <Tag color="green">已验证</Tag>
                  ) : (
                    <Tag color="default">未验证</Tag>
                  ),
              },
              { title: '手机号', dataIndex: 'phone' },
              {
                title: '手机验证',
                dataIndex: 'phone_verified',
                render: (_, r) =>
                  r.phone_verified ? (
                    <Tag color="green">已验证</Tag>
                  ) : (
                    <Tag color="default">未验证</Tag>
                  ),
              },
              {
                title: '状态',
                dataIndex: 'status',
                render: (_, r) => {
                  const cfg = statusMap[r.status ?? -1];
                  return cfg ? <Tag color={cfg.color}>{cfg.text}</Tag> : '-';
                },
              },
              { title: '注册 IP', dataIndex: 'register_ip' },
              { title: '注册来源', dataIndex: 'register_source' },
              {
                title: '最后登录 IP',
                dataIndex: 'last_login_ip',
              },
              {
                title: '最后登录',
                dataIndex: 'last_login_at',
                valueType: 'dateTime',
              },
              {
                title: '创建时间',
                dataIndex: 'created_at',
                valueType: 'dateTime',
              },
              {
                title: '更新时间',
                dataIndex: 'updated_at',
                valueType: 'dateTime',
              },
            ]}
          />

          <Divider />
          <ProDescriptions column={1} title="角色" />

          <div style={{ padding: '0 0 24px 24px' }}>
            {userRoles.length > 0 ? (
              <div
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: 8,
                  marginBottom: 12,
                }}
              >
                {userRoles.map((role) => (
                  <Tag
                    key={role.id}
                    color="blue"
                    closable
                    onClose={() => handleRemove(role.id!)}
                  >
                    {role.display_name || role.name}
                  </Tag>
                ))}
              </div>
            ) : (
              <div style={{ color: '#999', marginBottom: 12, fontSize: 13 }}>
                暂未分配角色
              </div>
            )}

            {availableRoles.length > 0 && (
              <Space>
                <Select
                  placeholder="选择角色"
                  style={{ width: 200 }}
                  value={selectedRoleId}
                  onChange={setSelectedRoleId}
                  options={availableRoles.map((r) => ({
                    label: r.display_name || r.name,
                    value: r.id!,
                  }))}
                />
                <Button
                  type="primary"
                  size="small"
                  disabled={!selectedRoleId}
                  onClick={handleAssign}
                >
                  添加角色
                </Button>
              </Space>
            )}
          </div>
        </>
      )}
    </Drawer>
  );
};

export default DetailDrawer;
