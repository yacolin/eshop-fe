import { useWebSocketContext } from '@/contexts/WebSocketContext';
import { BellOutlined } from '@ant-design/icons';
import { Badge, Drawer, List, notification, Tag, Typography } from 'antd';
import React, { useEffect, useRef, useState } from 'react';

interface NotifyItem {
  id: number;
  title: string;
  message: string;
  level: 'info' | 'success' | 'warning' | 'error';
  timestamp: number;
  read: boolean;
}

const NotifyBell: React.FC = () => {
  const { subscribe } = useWebSocketContext();
  const [notifications, setNotifications] = useState<NotifyItem[]>([]);
  const [open, setOpen] = useState(false);
  const seqRef = useRef(0);

  useEffect(() => {
    const unsub = subscribe('notification', (msg) => {
      const { title, message: content, level } = msg.payload || {};
      if (!title && !content) return;

      seqRef.current++;
      const item: NotifyItem = {
        id: seqRef.current,
        title: title || '通知',
        message: content || '',
        level: level || 'info',
        timestamp: msg.timestamp || Date.now(),
        read: false,
      };

      setNotifications((prev) => [item, ...prev].slice(0, 50));

      notification[item.level]({
        message: item.title,
        description: item.message,
        placement: 'topRight',
        duration: 4,
      });
    });
    return unsub;
  }, [subscribe]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <>
      <Badge count={unreadCount} size="small" offset={[-2, 2]}>
        <BellOutlined
          style={{ fontSize: 18, cursor: 'pointer', color: 'rgba(0,0,0,0.65)' }}
          onClick={() => setOpen(true)}
        />
      </Badge>
      <Drawer
        title="通知"
        placement="right"
        width={380}
        open={open}
        onClose={() => {
          setOpen(false);
          setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
        }}
      >
        {notifications.length === 0 ? (
          <Typography.Text type="secondary">暂无通知</Typography.Text>
        ) : (
          <List
            dataSource={notifications}
            renderItem={(item) => (
              <List.Item style={{ opacity: item.read ? 0.5 : 1 }}>
                <List.Item.Meta
                  title={
                    <>
                      {item.title}
                      <Tag
                        color={
                          item.level === 'error'
                            ? 'red'
                            : item.level === 'warning'
                            ? 'orange'
                            : item.level === 'success'
                            ? 'green'
                            : 'blue'
                        }
                        style={{ marginLeft: 8 }}
                      >
                        {item.level}
                      </Tag>
                    </>
                  }
                  description={item.message}
                />
              </List.Item>
            )}
          />
        )}
      </Drawer>
    </>
  );
};

export default NotifyBell;
