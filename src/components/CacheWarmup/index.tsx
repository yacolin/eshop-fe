import { FireOutlined } from '@ant-design/icons';
import { Button, message } from 'antd';
import React, { useState } from 'react';

interface CacheWarmupProps {
  label?: string;
  size?: 'small' | 'middle' | 'large';
  request: () => Promise<any>;
}

const CacheWarmup: React.FC<CacheWarmupProps> = ({
  label = '预热缓存',
  size,
  request,
}) => {
  const [loading, setLoading] = useState(false);

  const handleWarmup = async () => {
    setLoading(true);
    try {
      const res = await request();
      const data = (res as any).data || {};
      message.success(
        `${label}成功${data.count ? `，共处理 ${data.count} 条` : ''}`,
      );
    } catch {
      message.error(`${label}失败，请重试`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      type="primary"
      icon={<FireOutlined />}
      loading={loading}
      onClick={handleWarmup}
      size={size}
    >
      {label}
    </Button>
  );
};

export default CacheWarmup;
