import { useWebSocket } from '@/hooks/useWebSocket';
import type { WebSocketMessage } from '@/hooks/useWebSocket';
import { UserOutlined, LinkOutlined } from '@ant-design/icons';
import { Avatar, Badge, Card, List, Statistic, Tag, Typography } from 'antd';
import React, { useCallback, useRef, useState } from 'react';

interface OnlineUser {
  id: number;
  username: string;
  nickname?: string;
  avatar?: string;
  onlineAt: number;
}

const OnlineUsers: React.FC = () => {
  const [users, setUsers] = useState<OnlineUser[]>([]);
  const [onlineUsers, setOnlineUsers] = useState(0);
  const [connections, setConnections] = useState(0);
  const prevConnected = useRef(false);

  const handleMessage = useCallback((msg: WebSocketMessage) => {
    if (msg.type === 'stats') {
      setOnlineUsers(msg.payload?.online_users ?? 0);
      setConnections(msg.payload?.connections ?? 0);
      return;
    }

    if (msg.type !== 'user') return;

    const { payload } = msg;
    if (!payload) return;

    if (payload.action === 'sync' && Array.isArray(payload.users)) {
      setUsers(
        payload.users.map((u: any) => ({
          id: u.id,
          username: u.username,
          nickname: u.nickname,
          avatar: u.avatar,
          onlineAt: u.onlineAt || Date.now(),
        })),
      );
      return;
    }

    if (!payload.user?.id) return;

    setUsers((prev) => {
      if (payload.action === 'online') {
        const exists = prev.some((u) => u.id === payload.user.id);
        if (exists) return prev;
        return [
          ...prev,
          {
            id: payload.user.id,
            username: payload.user.username,
            nickname: payload.user.nickname,
            avatar: payload.user.avatar,
            onlineAt: payload.timestamp || Date.now(),
          },
        ];
      }

      if (payload.action === 'offline') {
        return prev.filter((u) => u.id !== payload.user.id);
      }

      return prev;
    });
  }, []);

  const { isConnected, isReconnecting } = useWebSocket(undefined, handleMessage);

  // 断连时清空用户列表
  const prevConnectedRef = useRef(isConnected);
  if (prevConnectedRef.current && !isConnected) {
    setUsers([]);
  }
  prevConnectedRef.current = isConnected;

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
          value={onlineUsers}
          prefix={<UserOutlined />}
          style={{ marginBottom: 16 }}
        />
        <Statistic
          title="总连接数"
          value={connections}
          prefix={<LinkOutlined />}
        />
      </Card>

      <div style={{ marginTop: 16 }}>
        <Badge status={badgeStatus().status} text={`WebSocket: ${badgeStatus().text}`} />
      </div>

      {users.length > 0 && (
        <div style={{ marginTop: 24 }}>
          <Typography.Text type="secondary" style={{ marginBottom: 8, display: 'block' }}>
            在线用户 ({users.length})
          </Typography.Text>
          <List
            size="small"
            dataSource={users}
            renderItem={(user) => (
              <List.Item>
                <List.Item.Meta
                  avatar={<Avatar icon={<UserOutlined />} src={user.avatar} />}
                  title={user.nickname || user.username}
                />
                <Tag color="green">在线</Tag>
              </List.Item>
            )}
          />
        </div>
      )}
    </div>
  );
};

export default OnlineUsers;
