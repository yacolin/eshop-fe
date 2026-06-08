import OnlineUsers from '@/components/OnlineUsers';
import { PageContainer } from '@ant-design/pro-components';
import styles from './index.less';

const HomePage: React.FC = () => {
  return (
    <PageContainer ghost>
      <div className={styles.container}>
        <OnlineUsers />
      </div>
    </PageContainer>
  );
};

export default HomePage;
