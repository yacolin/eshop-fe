import { useWebSocketContext } from '@/contexts/WebSocketContext';
import { UserOutlined, LinkOutlined } from '@ant-design/icons';
import { Avatar, Badge, Card, List, Statistic, Tag, Typography } from 'antd';
import React from 'react';

const OnlineUsers: React.FC = () => {
  const { isConnected, isReconnecting, users, stats } = useWebSocketContext();

  const currentUsername = localStorage.getItem('savedUsername') || '';

  const badgeStatus = () => {
    if (isReconnecting) return { status: 'warning' as const, text: '重连中...' };
    if (!isConnected) return { status: 'error' as const, text: '未连接' };
    return { status: 'success' as const, text: '已连接' };
  };

  return (
    <div>
      <Card title="系统概览" size="small" style={{ width: 300 }}>
        <Statistic
          title="在线用户"
          value={stats.onlineUsers}
          prefix={<UserOutlined />}
          style={{ marginBottom: 16 }}
        />
        <Statistic
          title="总连接数"
          value={stats.connections}
          prefix={<LinkOutlined />}
        />
      </Card>

      <div style={{ marginTop: 16 }}>
        <Badge status={badgeStatus().status} text={`WebSocket: ${badgeStatus().text}`} />
      </div>

      {users.length > 0 && (
        <div style={{ marginTop: 24, width: 300 }}>
          <Typography.Text type="secondary" style={{ marginBottom: 8, display: 'block' }}>
            在线用户 ({users.length})
          </Typography.Text>
          <List
            size="small"
            dataSource={users}
            renderItem={(user) => {
              const isMe = user.username === currentUsername;
              return (
                <List.Item style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 0' }}>
                  <span>
                    <Avatar icon={<UserOutlined />} src={user.avatar} style={{ marginRight: 8 }} />
                    {user.nickname || user.username}
                    {isMe && <Tag style={{ marginLeft: 4 }}>我</Tag>}
                  </span>
                  <Tag color={isMe ? 'blue' : 'green'}>在线</Tag>
                </List.Item>
              );
            }}
          />
        </div>
      )}
    </div>
  );
};

export default OnlineUsers;
