import NotifyBell from '@/components/NotifyBell';
import {
  LogoutOutlined,
  ProfileOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Avatar, Dropdown } from 'antd';
import React from 'react';

import { history } from '@umijs/max';

interface RightContentProps {
  onLogout: () => void;
}

const RightContent: React.FC<RightContentProps> = ({ onLogout }) => {
  const username = localStorage.getItem('savedUsername') || '';

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 16,
        height: '100%',
        paddingRight: 20,
      }}
    >
      <NotifyBell />
      <Dropdown
        menu={{
          items: [
            {
              key: 'profile',
              icon: <ProfileOutlined />,
              label: '个人资料',
              onClick: () => history.push('/user/user-info'),
            },
            { type: 'divider' },
            {
              key: 'logout',
              icon: <LogoutOutlined />,
              label: '退出登录',
              onClick: () => onLogout(),
            },
          ],
        }}
      >
        <span
          style={{
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 6,
          }}
        >
          <Avatar size="small" icon={<UserOutlined />} />
          <span style={{ color: '#666' }}>{username}</span>
        </span>
      </Dropdown>
    </div>
  );
};

export default RightContent;
