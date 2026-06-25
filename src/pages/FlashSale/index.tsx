import type { ProColumns } from '@ant-design/pro-components';
import {
  PageContainer,
  ProDescriptions,
  ProTable,
} from '@ant-design/pro-components';
import { Drawer, Select, Space, Tag } from 'antd';
import dayjs from 'dayjs';
import React, { useCallback, useEffect, useRef, useState } from 'react';

import { getFlashActivitiesCursor } from '@/services/api/flashActivities';

const flashStatusMap: Record<string, { text: string; color: string }> = {
  pending: { text: '待开始', color: 'default' },
  active: { text: '进行中', color: 'green' },
  finished: { text: '已结束', color: 'purple' },
};

const formatPrice = (price?: number) => {
  if (price === undefined || price === null) return '-';
  return `¥${(price / 100).toFixed(2)}`;
};

const formatFlashTime = (t?: string) => {
  if (!t) return '-';
  return dayjs(t).format('YYYY-MM-DD HH:mm');
};

const FlashSaleList: React.FC = () => {
  const [dataSource, setDataSource] = useState<API.FlashActivity[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [cursor, setCursor] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>();
  const [row, setRow] = useState<API.FlashActivity>();

  /** 防重复请求锁 */
  const loadingRef = useRef(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const stateRef = useRef({
    hasMore: true,
    cursor: 0,
    statusFilter: undefined as string | undefined,
  });

  useEffect(() => {
    stateRef.current = { hasMore, cursor, statusFilter };
  }, [hasMore, cursor, statusFilter]);

  const fetchData = useCallback(
    async (cursorVal: number, status: string | undefined, replace: boolean) => {
      if (!replace) {
        if (loadingRef.current) return;
        loadingRef.current = true;
      }
      if (replace) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }
      try {
        const res = await getFlashActivitiesCursor({
          cursor: cursorVal,
          size: 20,
          status,
        });
        const data = (res as any).data || {};
        const list = data.list || [];
        if (replace) {
          setDataSource(list);
        } else {
          setDataSource((prev) => [...prev, ...list]);
        }
        setCursor(data.next_cursor || 0);
        setHasMore(data.has_more || false);
      } finally {
        setLoading(false);
        setLoadingMore(false);
        loadingRef.current = false;
      }
    },
    [],
  );
  const fetchDataRef = useRef(fetchData);
  fetchDataRef.current = fetchData;

  /** 挂载时给 wrapper 加 capture 阶段 scroll 监听，捕获内部滚动容器的 scroll 事件 */
  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;

    const onScroll = (e: Event) => {
      const target = e.target as HTMLElement;
      const s = stateRef.current;
      if (!s.hasMore || loadingRef.current) return;
      if (target.scrollHeight - target.scrollTop - target.clientHeight < 100) {
        fetchDataRef.current(s.cursor, s.statusFilter, false);
      }
    };

    wrapper.addEventListener('scroll', onScroll, {
      capture: true,
      passive: true,
    });

    return () => {
      wrapper.removeEventListener('scroll', onScroll, { capture: true });
    };
  }, []);

  /** 初始加载 & 切换筛选条件时重置 */
  useEffect(() => {
    setDataSource([]);
    setCursor(0);
    setHasMore(true);
    fetchData(0, statusFilter, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter]);

  const columns: ProColumns<API.FlashActivity>[] = [
    {
      title: 'ID',
      dataIndex: 'id',
      width: 60,
      fixed: 'left',
    },
    {
      title: '商品ID',
      dataIndex: 'product_id',
      width: 100,
    },
    {
      title: '秒杀价',
      dataIndex: 'flash_price',
      width: 100,
      render: (_, record) => formatPrice(record.flash_price),
    },
    {
      title: '总库存',
      dataIndex: 'total_stock',
      width: 100,
    },
    {
      title: '已售',
      dataIndex: 'sold_stock',
      width: 80,
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 100,
      render: (_, record) => {
        const cfg = flashStatusMap[record.status || ''];
        return cfg ? <Tag color={cfg.color}>{cfg.text}</Tag> : '-';
      },
    },
    {
      title: '开始时间',
      dataIndex: 'start_time',
      width: 150,
      render: (_, record) => formatFlashTime(record.start_time),
    },
    {
      title: '结束时间',
      dataIndex: 'end_time',
      width: 150,
      render: (_, record) => formatFlashTime(record.end_time),
    },
    {
      title: '创建时间',
      dataIndex: 'created_at',
      width: 150,
      render: (_, record) => formatFlashTime(record.created_at),
    },
  ];

  return (
    <PageContainer
      header={{
        title: '秒杀活动',
        breadcrumb: {
          items: [{ title: '首页' }, { title: '秒杀活动' }],
        },
      }}
    >
      <div ref={wrapperRef}>
        <ProTable<API.FlashActivity>
          headerTitle={
            <Space>
              <span style={{ fontSize: 13, color: '#666' }}>状态筛选：</span>
              <Select
                allowClear
                placeholder="全部"
                style={{ width: 130 }}
                value={statusFilter}
                onChange={(val) => setStatusFilter(val)}
                options={[
                  { label: '待开始', value: 'pending' },
                  { label: '进行中', value: 'active' },
                  { label: '已结束', value: 'finished' },
                ]}
              />
            </Space>
          }
          rowKey="id"
          dataSource={dataSource}
          loading={loading}
          virtual
          scroll={{ x: 1000, y: 500 }}
          search={false}
          options={false}
          pagination={false}
          columns={[
            ...columns,
            {
              title: '操作',
              dataIndex: 'option',
              valueType: 'option',
              width: 80,
              fixed: 'right',
              render: (_, record) => <a onClick={() => setRow(record)}>查看</a>,
            },
          ]}
          footer={() => (
            <div style={{ textAlign: 'center' }}>
              {loadingMore && (
                <span style={{ color: '#999', fontSize: 13 }}>
                  正在加载更多数据...
                </span>
              )}
              {!hasMore && dataSource.length > 0 && (
                <span style={{ color: '#999', fontSize: 13 }}>
                  已加载全部 {dataSource.length} 条数据
                </span>
              )}
            </div>
          )}
        />
      </div>

      <Drawer
        width={600}
        open={!!row}
        onClose={() => setRow(undefined)}
        closable
        title={row ? `秒杀活动 #${row.id}` : '秒杀活动详情'}
      >
        {row?.id && (
          <ProDescriptions<API.FlashActivity>
            column={2}
            title={`秒杀活动 #${row.id}`}
            request={async () => ({ data: row || {} })}
            params={{ id: row?.id }}
            columns={columns as any}
          />
        )}
      </Drawer>
    </PageContainer>
  );
};

export default FlashSaleList;
