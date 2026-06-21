import { PageContainer } from '@ant-design/pro-components';
import { Button, Card, List, message, Space, Tag, Typography } from 'antd';
import dayjs from 'dayjs';
import React, { useState } from 'react';

import { postWsTestPush } from '@/services/api/websocket';
import CreateForm from './components/CreateForm';

interface NotificationRecord {
  id: number;
  title: string;
  message: string;
  level: 'info' | 'success' | 'warning' | 'error';
  target?: string;
  timestamp: number;
}

const levelMap: Record<string, { text: string; color: string }> = {
  info: { text: '信息', color: 'blue' },
  success: { text: '成功', color: 'green' },
  warning: { text: '警告', color: 'orange' },
  error: { text: '错误', color: 'red' },
};

const NotificationList: React.FC = () => {
  const [records, setRecords] = useState<NotificationRecord[]>([]);
  const [createModalVisible, handleModalVisible] = useState(false);
  const seqRef = React.useRef(0);

  const handleSend = async (values: {
    title: string;
    message: string;
    level: string;
    target?: string;
  }) => {
    const hide = message.loading('正在发送');
    try {
      await postWsTestPush({
        title: values.title,
        message: values.message,
        level: values.level,
        target: values.target || 'all',
      });
      hide();
      message.success('发送成功');

      seqRef.current++;
      const record: NotificationRecord = {
        id: seqRef.current,
        title: values.title,
        message: values.message,
        level: values.level as any,
        target: values.target || 'all',
        timestamp: Date.now(),
      };
      setRecords((prev) => [record, ...prev]);
      return true;
    } catch {
      hide();
      message.error('发送失败，请重试');
      return false;
    }
  };

  return (
    <PageContainer
      header={{
        title: '通知管理',
        breadcrumb: {
          items: [{ title: '首页' }, { title: '通知管理' }],
        },
      }}
    >
      <Card
        title="推送记录"
        styles={{ header: { padding: '12px 24px' } }}
        extra={
          <Button type="primary" onClick={() => handleModalVisible(true)}>
            发送通知
          </Button>
        }
      >
        {records.length === 0 ? (
          <div
            style={{ textAlign: 'center', color: '#999', padding: '60px 0' }}
          >
            暂无推送记录
          </div>
        ) : (
          <List<NotificationRecord>
            dataSource={records}
            renderItem={(item) => {
              const levelCfg = levelMap[item.level] || levelMap.info;
              return (
                <List.Item>
                  <List.Item.Meta
                    title={
                      <Space>
                        <Typography.Text strong>{item.title}</Typography.Text>
                        <Tag color={levelCfg.color}>{levelCfg.text}</Tag>
                        {item.target && item.target !== 'all' && (
                          <Tag>用户: {item.target}</Tag>
                        )}
                      </Space>
                    }
                    description={
                      <div>
                        <Typography.Paragraph
                          style={{ marginBottom: 4, whiteSpace: 'pre-wrap' }}
                          type="secondary"
                        >
                          {item.message}
                        </Typography.Paragraph>
                        <Typography.Text
                          type="secondary"
                          style={{ fontSize: 12 }}
                        >
                          {dayjs(item.timestamp).format('YYYY-MM-DD HH:mm:ss')}
                        </Typography.Text>
                      </div>
                    }
                  />
                </List.Item>
              );
            }}
          />
        )}
      </Card>

      {/* 发送通知 */}
      <CreateForm
        modalVisible={createModalVisible}
        onCancel={() => handleModalVisible(false)}
        onSubmit={async (value) => {
          const success = await handleSend(value);
          if (success) {
            handleModalVisible(false);
          }
          return success;
        }}
      />
    </PageContainer>
  );
};

export default NotificationList;
