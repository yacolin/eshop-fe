import { ProDescriptions } from '@ant-design/pro-components';
import { Divider, Drawer, Tag } from 'antd';
import React from 'react';

const statusMap: Record<number, { text: string; color: string }> = {
  1: { text: '正常', color: '#52c41a' },
  2: { text: '禁用', color: '#ff4d4f' },
  3: { text: '冻结', color: '#faad14' },
};

interface DetailDrawerProps {
  row?: API.UserListItem;
  onClose: () => void;
}

const DetailDrawer: React.FC<DetailDrawerProps> = ({ row, onClose }) => {
  const roles = row?.roles || [];

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
              { title: '最后登录 IP', dataIndex: 'last_login_ip' },
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

          {roles.length > 0 && (
            <>
              <Divider />
              <ProDescriptions column={1} title="角色" />
              <div style={{ padding: '0 0 24px 24px' }}>
                {roles.map((role) => (
                  <Tag key={role.id} color="blue" style={{ marginBottom: 4 }}>
                    {role.display_name || role.name}
                  </Tag>
                ))}
              </div>
            </>
          )}
        </>
      )}
    </Drawer>
  );
};

export default DetailDrawer;
