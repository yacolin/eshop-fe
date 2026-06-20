import { Column, Line, Pie } from '@ant-design/charts';
import { PageContainer } from '@ant-design/pro-components';
import {
  Avatar,
  Badge,
  Card,
  Col,
  message,
  Row,
  Spin,
  Statistic,
  Tag,
  Tooltip,
  Typography,
} from 'antd';
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';
import relativeTime from 'dayjs/plugin/relativeTime';
import { useEffect, useRef, useState } from 'react';
import styles from './index.less';

import {
  AppstoreOutlined,
  ArrowDownOutlined,
  ArrowUpOutlined,
  ClockCircleOutlined,
  DollarOutlined,
  LinkOutlined,
  ShoppingCartOutlined,
  UserOutlined,
  WarningOutlined,
} from '@ant-design/icons';

import { useWebSocketContext } from '@/contexts/WebSocketContext';
import { getDashboardStats } from '@/services/api/dashboard';

dayjs.extend(relativeTime);
dayjs.locale('zh-cn');

const COLOR_PALETTE = [
  '#5B8FF9',
  '#F6BD16',
  '#F46649',
  '#13C2C2',
  '#845BD4',
  '#FF9845',
];

interface DashboardData {
  summary: Record<string, any>;
  order_trend: any[];
  order_status_dist: any[];
  payment_method_dist: any[];
  category_dist: any[];
  inventory_status_dist: any[];
  top_products: any[];
}

const HomePage: React.FC = () => {
  // ─── WebSocket 实时数据 ──────────────────────────────────
  const {
    isConnected,
    isReconnecting,
    users,
    stats: wsStats,
    subscribe,
  } = useWebSocketContext();
  const [events, setEvents] = useState<
    { id: number; type: string; title: string; time: Date }[]
  >([]);
  const eventSeq = useRef(0);

  useEffect(() => {
    const unsub = subscribe('notification', (msg) => {
      eventSeq.current++;
      setEvents((prev) =>
        [
          {
            id: eventSeq.current,
            type: msg.payload?.level || 'info',
            title: msg.payload?.title || msg.payload?.message || '',
            time: new Date(msg.timestamp || Date.now()),
          },
          ...prev,
        ].slice(0, 20),
      );
    });
    return unsub;
  }, [subscribe]);

  // ─── 仪表盘数据 ─────────────────────────────────────────
  const [loading, setLoading] = useState(true);
  const [dashData, setDashData] = useState<DashboardData>({
    summary: {},
    order_trend: [],
    order_status_dist: [],
    payment_method_dist: [],
    category_dist: [],
    inventory_status_dist: [],
    top_products: [],
  });

  const fetchDashboard = async () => {
    setLoading(true);
    try {
      const res = await getDashboardStats();
      const raw = (res as any)?.data;
      if (raw) {
        setDashData({
          summary: raw.summary ?? {},
          order_trend: raw.order_trend ?? [],
          order_status_dist: raw.order_status_dist ?? [],
          payment_method_dist: raw.payment_method_dist ?? [],
          category_dist: raw.category_dist ?? [],
          inventory_status_dist: raw.inventory_status_dist ?? [],
          top_products: raw.top_products ?? [],
        });
      }
    } catch {
      message.error('获取仪表盘数据失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const {
    summary,
    order_trend: orderTrend,
    order_status_dist: orderStatusDist,
    payment_method_dist: paymentMethodDist,
    category_dist: categoryDist,
    inventory_status_dist: inventoryStatusDist,
    top_products: topProducts,
  } = dashData;

  if (loading) {
    return (
      <PageContainer ghost>
        <div className={styles.loading}>
          <Spin size="large" />
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer ghost>
      <div className={styles.container}>
        {/* ====== 核心指标卡片 ====== */}
        <Row gutter={[16, 16]} className={styles.statRow}>
          <Col xs={24} sm={12} lg={6}>
            <Card className={styles.statCard} hoverable>
              <Statistic
                title="总订单数"
                value={summary.total_orders}
                prefix={<ShoppingCartOutlined style={{ color: '#5B8FF9' }} />}
                valueStyle={{ color: '#5B8FF9' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card className={styles.statCard} hoverable>
              <Statistic
                title="总营收 (元)"
                value={Math.round((summary.total_revenue ?? 0) / 100)}
                prefix={<DollarOutlined style={{ color: '#F6BD16' }} />}
                suffix={
                  <span style={{ fontSize: 14, color: '#52c41a' }}>
                    <ArrowUpOutlined /> 环比
                  </span>
                }
                valueStyle={{ color: '#F6BD16', fontWeight: 600 }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card className={styles.statCard} hoverable>
              <Statistic
                title="商品总数"
                value={summary.total_products}
                prefix={<AppstoreOutlined style={{ color: '#13C2C2' }} />}
                valueStyle={{ color: '#13C2C2' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card className={styles.statCard} hoverable>
              <Statistic
                title="库存告警"
                value={summary.low_stock_count}
                prefix={<WarningOutlined style={{ color: '#F46649' }} />}
                valueStyle={{
                  color:
                    (summary.low_stock_count ?? 0) > 0 ? '#F46649' : '#52c41a',
                }}
                suffix={
                  <span style={{ fontSize: 14, color: '#F46649' }}>
                    <ArrowDownOutlined /> 需补货
                  </span>
                }
              />
            </Card>
          </Col>
        </Row>

        {/* ====== 实时数据（WebSocket） ====== */}
        <Row gutter={[16, 16]} className={styles.realtimeRow}>
          <Col xs={24} lg={10}>
            <Card
              title={
                <span>
                  <ClockCircleOutlined style={{ marginRight: 6 }} />
                  实时连接
                </span>
              }
              className={styles.chartCard}
            >
              <div className={styles.realtimeBody}>
                <div className={styles.realtimeStats}>
                  <div className={styles.realtimeStatItem}>
                    <Statistic
                      title="在线用户"
                      value={wsStats.onlineUsers}
                      prefix={<UserOutlined style={{ color: '#5B8FF9' }} />}
                      valueStyle={{ color: '#5B8FF9', fontSize: 28 }}
                    />
                  </div>
                  <div className={styles.realtimeStatItem}>
                    <Statistic
                      title="总连接数"
                      value={wsStats.connections}
                      prefix={<LinkOutlined style={{ color: '#13C2C2' }} />}
                      valueStyle={{ color: '#13C2C2', fontSize: 28 }}
                    />
                  </div>
                  <div className={styles.realtimeStatItem}>
                    <Statistic
                      title="连接状态"
                      valueRender={() => (
                        <Badge
                          status={
                            isReconnecting
                              ? 'warning'
                              : isConnected
                              ? 'success'
                              : 'error'
                          }
                          text={
                            <Typography.Text style={{ fontSize: 14 }}>
                              {isReconnecting
                                ? '重连中'
                                : isConnected
                                ? '已连接'
                                : '未连接'}
                            </Typography.Text>
                          }
                        />
                      )}
                    />
                  </div>
                </div>
                {users.length > 0 && (
                  <div className={styles.onlineUsers}>
                    <Typography.Text
                      type="secondary"
                      style={{
                        fontSize: 12,
                        marginBottom: 6,
                        display: 'block',
                      }}
                    >
                      当前在线 ({users.length})
                    </Typography.Text>
                    <Avatar.Group max={{ count: 8 }}>
                      {users.slice(0, 16).map((u) => (
                        <Tooltip
                          key={u.id}
                          title={`${u.nickname || u.username}${
                            u.username === localStorage.getItem('savedUsername')
                              ? ' (我)'
                              : ''
                          }`}
                        >
                          <Avatar
                            icon={<UserOutlined />}
                            src={u.avatar}
                            style={{ backgroundColor: '#5B8FF9' }}
                          >
                            {u.username?.charAt(0).toUpperCase()}
                          </Avatar>
                        </Tooltip>
                      ))}
                    </Avatar.Group>
                  </div>
                )}
              </div>
            </Card>
          </Col>
          <Col xs={24} lg={14}>
            <Card
              title={
                <span>
                  <Badge status="success" style={{ marginRight: 6 }} />
                  实时事件
                </span>
              }
              className={styles.chartCard}
            >
              <div className={styles.eventCardBody}>
                {events.length === 0 ? (
                  <Typography.Text
                    type="secondary"
                    style={{
                      display: 'block',
                      textAlign: 'center',
                      padding: '20px 0',
                    }}
                  >
                    暂无实时事件，等待 WebSocket 推送...
                  </Typography.Text>
                ) : (
                  <div className={styles.eventList}>
                    {events.map((ev) => (
                      <div key={ev.id} className={styles.eventItem}>
                        <Tag
                          color={
                            ev.type === 'error'
                              ? 'red'
                              : ev.type === 'warning'
                              ? 'orange'
                              : ev.type === 'success'
                              ? 'green'
                              : 'blue'
                          }
                          style={{ flexShrink: 0 }}
                        >
                          {ev.type}
                        </Tag>
                        <span className={styles.eventTitle}>{ev.title}</span>
                        <Typography.Text
                          type="secondary"
                          style={{
                            flexShrink: 0,
                            fontSize: 12,
                            marginLeft: 'auto',
                          }}
                        >
                          {dayjs(ev.time).fromNow()}
                        </Typography.Text>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </Card>
          </Col>
        </Row>

        {/* ====== Row 2: 订单趋势 + 状态分布 ====== */}
        <Row gutter={[16, 16]} className={styles.chartRow}>
          <Col xs={24} lg={16}>
            <Card title="近7天订单趋势" className={styles.chartCard}>
              <Line
                data={orderTrend}
                xField="date"
                yField="count"
                smooth
                point={{ size: 3, shape: 'circle' }}
                color="#5B8FF9"
                tooltip={{
                  channel: 'y',
                  valueFormatter: (v: number) => `${v} 单`,
                }}
                axis={{ x: { title: '日期' }, y: { title: '订单数' } }}
                height={280}
                legend={false}
                style={{ lineWidth: 2 }}
              />
            </Card>
          </Col>
          <Col xs={24} lg={8}>
            <Card title="订单状态分布" className={styles.chartCard}>
              <Pie
                data={orderStatusDist}
                angleField="value"
                colorField="label"
                color={COLOR_PALETTE}
                label={{
                  text: (d: any) => `${d.label}\n${d.value}`,
                  style: { fontSize: 11 },
                }}
                legend={{ color: { title: false, position: 'bottom' } }}
                height={280}
              />
            </Card>
          </Col>
        </Row>

        {/* ====== Row 3: 热销商品 + 分类分布 ====== */}
        <Row gutter={[16, 16]} className={styles.chartRow}>
          <Col xs={24} lg={16}>
            <Card title="热销商品 Top 10" className={styles.chartCard}>
              <Column
                data={topProducts}
                xField="name"
                yField="count"
                color="#5B8FF9"
                label={{
                  text: (d: any) => d.count,
                  position: 'top',
                  style: { fontSize: 10 },
                }}
                tooltip={{
                  channel: 'y',
                  valueFormatter: (v: number) => `${v} 件`,
                }}
                axis={{
                  x: { labelAutoRotate: true, title: '商品' },
                  y: { title: '销量' },
                }}
                height={280}
                legend={false}
              />
            </Card>
          </Col>
          <Col xs={24} lg={8}>
            <Card title="商品分类分布" className={styles.chartCard}>
              <Pie
                data={categoryDist}
                angleField="value"
                colorField="category"
                color={COLOR_PALETTE}
                label={{
                  text: (d: any) => `${d.category}\n${d.value}`,
                  style: { fontSize: 10 },
                }}
                legend={{ color: { title: false, position: 'bottom' } }}
                height={280}
              />
            </Card>
          </Col>
        </Row>

        {/* ====== Row 4: 支付方式 + 库存状态 ====== */}
        <Row gutter={[16, 16]} className={styles.chartEqualRow}>
          <Col xs={24} lg={12}>
            <Card title="支付方式分布" className={styles.chartCard}>
              <div className={styles.equalChartBody}>
                <Pie
                  data={paymentMethodDist}
                  angleField="value"
                  colorField="label"
                  color={COLOR_PALETTE}
                  label={{
                    text: (d: any) => `${d.label}\n${d.value}`,
                    style: { fontSize: 11 },
                  }}
                  legend={{ color: { title: false, position: 'bottom' } }}
                  height={260}
                  innerRadius={0.5}
                />
              </div>
            </Card>
          </Col>
          <Col xs={24} lg={12}>
            <Card title="库存状态" className={styles.chartCard}>
              <div className={styles.equalChartBody}>
                <Pie
                  data={inventoryStatusDist}
                  angleField="value"
                  colorField="label"
                  color={['#52c41a', '#F6BD16', '#F46649']}
                  label={{
                    text: (d: any) => `${d.label}\n${d.value}`,
                    style: { fontSize: 11 },
                  }}
                  legend={{ color: { title: false, position: 'bottom' } }}
                  height={260}
                  innerRadius={0.6}
                />
              </div>
            </Card>
          </Col>
        </Row>
      </div>
    </PageContainer>
  );
};

export default HomePage;
