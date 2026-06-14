import CacheWarmup from '@/components/CacheWarmup';
import OnlineUsers from '@/components/OnlineUsers';
import { postProductsCacheWarmup } from '@/services/api/products';
import { PageContainer } from '@ant-design/pro-components';
import { Card } from 'antd';
import styles from './index.less';

const HomePage: React.FC = () => {
  return (
    <PageContainer ghost>
      <div className={styles.container}>
        <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
          <OnlineUsers />
          <Card title="缓存管理" size="small" style={{ width: 300 }}>
            <CacheWarmup
              size="large"
              label="预热商品"
              request={postProductsCacheWarmup}
            />
          </Card>
        </div>
      </div>
    </PageContainer>
  );
};

export default HomePage;
