import { Column, Line, Pie } from '@ant-design/charts';
import { PageContainer } from '@ant-design/pro-components';
import { useRequest } from '@umijs/max';
import {
  Avatar,
  Badge,
  Card,
  Col,
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
import { useEffect, useMemo, useRef, useState } from 'react';
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
import { getInventories } from '@/services/api/inventories';
import { getOrders } from '@/services/api/orders';
import { getPayments } from '@/services/api/payments';
import { getProductsEnriched } from '@/services/api/products';

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

const statusLabel: Record<string, string> = {
  pending: '待付款',
  paid: '已付款',
  shipped: '已发货',
  delivered: '已送达',
  cancelled: '已取消',
  refunded: '已退款',
};

const HomePage: React.FC = () => {
  const [now] = useState(() => dayjs());

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

  // 订阅通知消息，形成实时事件流
  useEffect(() => {
    const unsub = subscribe('notification', (msg) => {
      eventSeq.current++;
      const item = {
        id: eventSeq.current,
        type: msg.payload?.level || 'info',
        title: msg.payload?.title || msg.payload?.message || '',
        time: new Date(msg.timestamp || Date.now()),
      };
      setEvents((prev) => [item, ...prev].slice(0, 20));
    });
    return unsub;
  }, [subscribe]);

  // ─── 订单数据 ───────────────────────────────────────────
  const { data: ordersRes, loading: ordersLoading } = useRequest(
    () =>
      getOrders({
        page: 1,
        size: 100,
        sort_by: 'created_at',
        order: 'desc',
      }),
    { refreshDeps: [] },
  );
  // 取最近 30 天的订单
  const orders = useMemo(() => {
    const list = ordersRes?.data?.list ?? [];
    const total = ordersRes?.data?.total ?? 0;
    return { list, total };
  }, [ordersRes]);

  // ─── 支付数据 ───────────────────────────────────────────
  const { data: paymentsRes, loading: paymentsLoading } = useRequest(
    () =>
      getPayments({
        page: 1,
        page_size: 100,
      }),
    { refreshDeps: [] },
  );
  const payments = useMemo(() => {
    return paymentsRes?.data?.payments ?? [];
  }, [paymentsRes]);

  // ─── 产品数据 ───────────────────────────────────────────
  const { data: productsRes, loading: productsLoading } = useRequest(
    () =>
      getProductsEnriched({
        page: 1,
        size: 100,
      }),
    { refreshDeps: [] },
  );
  const products = useMemo(() => {
    const list = productsRes?.data?.list ?? [];
    const total = productsRes?.data?.total ?? 0;
    return { list, total };
  }, [productsRes]);

  // ─── 库存数据 ───────────────────────────────────────────
  const { data: inventoryRes, loading: inventoryLoading } = useRequest(
    () =>
      getInventories({
        page: 1,
        size: 100,
      }),
    { refreshDeps: [] },
  );
  const inventories = useMemo(() => {
    return inventoryRes?.data?.list ?? [];
  }, [inventoryRes]);

  const loading =
    ordersLoading || paymentsLoading || productsLoading || inventoryLoading;

  // ─── 核心指标 ───────────────────────────────────────────
  const stats = useMemo(() => {
    const totalRevenue = (payments as API.PaymentResponse[])
      .filter((p) => p.status === 'completed' || p.status === 'paid')
      .reduce((sum, p) => sum + (p.amount ?? 0), 0);

    const lowStockCount = (inventories as API.Inventory[]).filter(
      (i) => i.status === 'lowstock' || i.status === 'outofstock',
    ).length;

    const totalOrders = orders.total;
    const totalProducts = products.total;

    return { totalOrders, totalRevenue, totalProducts, lowStockCount };
  }, [payments, inventories, orders.total, products.total]);

  // ─── 订单趋势（按天聚合，近7天） ──────────────────────
  const orderTrend = useMemo(() => {
    const sevenDaysAgo = now.subtract(7, 'day');
    const dayMap: Record<
      string,
      { date: string; count: number; amount: number }
    > = {};

    for (let i = 0; i < 7; i++) {
      const d = now.subtract(i, 'day').format('MM-DD');
      dayMap[d] = { date: d, count: 0, amount: 0 };
    }

    (orders.list as API.OrderResponse[]).forEach((o) => {
      if (!o.created_at) return;
      const d = dayjs(o.created_at);
      if (d.isBefore(sevenDaysAgo)) return;
      const key = d.format('MM-DD');
      if (dayMap[key]) {
        dayMap[key].count += 1;
        dayMap[key].amount += (o.total_amount ?? 0) / 100;
      }
    });

    return Object.values(dayMap).sort((a, b) => a.date.localeCompare(b.date));
  }, [orders.list, now]);

  // ─── 订单状态分布 ─────────────────────────────────────
  const orderStatusDist = useMemo(() => {
    const map: Record<string, number> = {};
    (orders.list as API.OrderResponse[]).forEach((o) => {
      const s = o.status ?? 'unknown';
      map[s] = (map[s] ?? 0) + 1;
    });
    return Object.entries(map)
      .filter(([k]) => k !== 'unknown')
      .map(([status, value]) => ({
        status,
        label: statusLabel[status] ?? status,
        value,
      }));
  }, [orders.list]);

  // ─── 支付方式分布 ─────────────────────────────────────
  const paymentMethodDist = useMemo(() => {
    const map: Record<string, number> = {};
    (payments as API.PaymentResponse[]).forEach((p) => {
      const m = p.payment_method ?? 'unknown';
      map[m] = (map[m] ?? 0) + 1;
    });
    return Object.entries(map)
      .filter(([k]) => k !== 'unknown')
      .map(([method, value]) => ({ method, label: method, value }));
  }, [payments]);

  // ─── 分类分布 ─────────────────────────────────────────
  const categoryDist = useMemo(() => {
    const map: Record<string, number> = {};
    (products.list as API.ProductWithCategoryDTO[]).forEach((p) => {
      (p.categories ?? []).forEach((c) => {
        const name = c.name ?? '未分类';
        map[name] = (map[name] ?? 0) + 1;
      });
    });
    return Object.entries(map)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
      .map(([category, value]) => ({ category, value }));
  }, [products.list]);

  // ─── 库存状态分布 ─────────────────────────────────────
  const inventoryStatusDist = useMemo(() => {
    const map: Record<string, number> = {};
    (inventories as API.Inventory[]).forEach((i) => {
      const s = i.status ?? 'unknown';
      map[s] = (map[s] ?? 0) + 1;
    });
    const labelMap: Record<string, string> = {
      instock: '库存充足',
      lowstock: '库存偏低',
      outofstock: '缺货',
    };
    return Object.entries(map).map(([status, value]) => ({
      status,
      label: labelMap[status] ?? status,
      value,
    }));
  }, [inventories]);

  // ─── 热销商品（按订单项频次估算） ─────────────────────
  const topProducts = useMemo(() => {
    const map: Record<string, { name: string; count: number; amount: number }> =
      {};
    (orders.list as API.OrderResponse[]).forEach((o) => {
      (o.items ?? []).forEach((item) => {
        const id = String(item.product_id ?? '');
        if (!id) return;
        if (!map[id]) map[id] = { name: `商品#${id}`, count: 0, amount: 0 };
        map[id].count += item.quantity ?? 1;
        map[id].amount += ((item.unit_price ?? 0) * (item.quantity ?? 1)) / 100;
      });
    });
    return Object.values(map)
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);
  }, [orders.list]);

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
                value={stats.totalOrders}
                prefix={<ShoppingCartOutlined style={{ color: '#5B8FF9' }} />}
                valueStyle={{ color: '#5B8FF9' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card className={styles.statCard} hoverable>
              <Statistic
                title="总营收 (元)"
                value={Math.round(stats.totalRevenue / 100)}
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
                value={stats.totalProducts}
                prefix={<AppstoreOutlined style={{ color: '#13C2C2' }} />}
                valueStyle={{ color: '#13C2C2' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card className={styles.statCard} hoverable>
              <Statistic
                title="库存告警"
                value={stats.lowStockCount}
                prefix={<WarningOutlined style={{ color: '#F46649' }} />}
                valueStyle={{
                  color: stats.lowStockCount > 0 ? '#F46649' : '#52c41a',
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
                <div className={styles.inventoryBody}>
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
                    height={200}
                    innerRadius={0.6}
                  />
                  <div className={styles.inventoryList}>
                    {(inventories as API.Inventory[]).slice(0, 8).map((inv) => (
                      <div key={inv.id} className={styles.inventoryItem}>
                        <span className={styles.invName}>
                          商品 #{inv.product_id}
                        </span>
                        <Tag
                          color={
                            inv.status === 'instock'
                              ? 'success'
                              : inv.status === 'lowstock'
                              ? 'warning'
                              : 'error'
                          }
                        >
                          {inv.status === 'instock'
                            ? '充足'
                            : inv.status === 'lowstock'
                            ? '偏低'
                            : '缺货'}
                        </Tag>
                        <span className={styles.invQty}>{inv.quantity}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          </Col>
        </Row>
      </div>
    </PageContainer>
  );
};

export default HomePage;
