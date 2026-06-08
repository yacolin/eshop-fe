import { getWsStats } from '@/services/api/websocket';
import { UserOutlined, LinkOutlined } from '@ant-design/icons';
import { Card, Statistic } from 'antd';
import React, { useEffect, useState } from 'react';

const OnlineStats: React.FC = () => {
  const [onlineUsers, setOnlineUsers] = useState(0);
  const [connections, setConnections] = useState(0);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await getWsStats();
        const data = (res as any)?.data;
        if (data) {
          setOnlineUsers(data.online_users ?? 0);
          setConnections(data.connections ?? 0);
        }
      } catch {
        // ignore
      }
    };

    fetch();
    const timer = setInterval(fetch, 30000);
    return () => clearInterval(timer);
  }, []);

  return (
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
  );
};

export default OnlineStats;
