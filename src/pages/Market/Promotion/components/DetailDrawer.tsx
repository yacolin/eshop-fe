import { ProDescriptions } from '@ant-design/pro-components';
import { Button, Divider, Drawer, Empty, Image, message, Tag } from 'antd';
import React, { useEffect, useState } from 'react';

import { getPromotionsIdDetail } from '@/services/api/promotions';

const promoTypeMap: Record<number, { text: string; color: string }> = {
  1: { text: '满减', color: 'blue' },
  2: { text: '折扣', color: 'green' },
  3: { text: '秒杀', color: 'volcano' },
  4: { text: '优惠券', color: 'purple' },
  5: { text: '包邮', color: 'cyan' },
  6: { text: '赠品', color: 'orange' },
};

const statusMap: Record<number, { text: string; color: string }> = {
  1: { text: '未开始', color: '#999' },
  2: { text: '进行中', color: '#52c41a' },
  3: { text: '已结束', color: '#ff4d4f' },
  4: { text: '已关闭', color: '#999' },
};

const productTypeLabels = ['未知', '全部商品', '指定分类', ''];

interface DetailDrawerProps {
  row?: API.Promotion;
  onClose: () => void;
}

const DetailDrawer: React.FC<DetailDrawerProps> = ({ row, onClose }) => {
  const [detailData, setDetailData] = useState<API.PromotionDetailResponse>();
  const [refreshing, setRefreshing] = useState(false);

  const loadDetail = async (id: number) => {
    try {
      const res = await getPromotionsIdDetail({ id });
      setDetailData((res as any).data);
    } catch {
      // handled by global error handler
    }
  };

  useEffect(() => {
    if (row?.id) {
      loadDetail(row.id);
    } else {
      setDetailData(undefined);
    }
  }, [row?.id]);

  const handleRefresh = async () => {
    if (!row?.id) return;
    setRefreshing(true);
    try {
      await loadDetail(row.id);
      message.success('已刷新');
    } catch {
      message.error('刷新失败');
    } finally {
      setRefreshing(false);
    }
  };

  return (
    <Drawer
      width={680}
      open={!!row}
      onClose={onClose}
      closable
      title={row?.promo_name || '活动详情'}
      extra={
        <Button
          type="primary"
          size="small"
          loading={refreshing}
          onClick={handleRefresh}
        >
          刷新
        </Button>
      }
    >
      {detailData && (
        <>
          <ProDescriptions
            column={2}
            title="基本信息"
            dataSource={detailData}
            columns={[
              { title: '活动名称', dataIndex: 'promo_name' },
              {
                title: '类型',
                dataIndex: 'promo_type',
                render: (_, record) => {
                  const cfg = promoTypeMap[record.promo_type ?? -1];
                  return cfg ? <Tag color={cfg.color}>{cfg.text}</Tag> : '-';
                },
              },
              { title: '优惠码', dataIndex: 'promo_code' },
              { title: '每人限购', dataIndex: 'per_user_limit' },
              { title: '总量', dataIndex: 'total_quantity' },
              { title: '已用', dataIndex: 'used_quantity' },
              {
                title: '状态',
                dataIndex: 'status',
                render: (_, record) => {
                  const cfg = statusMap[record.status ?? -1];
                  return cfg ? <Tag color={cfg.color}>{cfg.text}</Tag> : '-';
                },
              },
              {
                title: '开始时间',
                dataIndex: 'start_time',
                valueType: 'dateTime',
              },
              {
                title: '结束时间',
                dataIndex: 'end_time',
                valueType: 'dateTime',
              },
              {
                title: '创建时间',
                dataIndex: 'created_at',
                valueType: 'dateTime',
              },
            ]}
          />

          <Divider />
          <ProDescriptions column={2} title="促销规则">
            <ProDescriptions.Item label="规则名称">
              {detailData.rule?.rule_name ?? '-'}
            </ProDescriptions.Item>
            <ProDescriptions.Item label="条件类型">
              {detailData.rule?.condition_type ?? '-'}
            </ProDescriptions.Item>
            <ProDescriptions.Item label="条件值">
              {detailData.rule?.condition_value ?? '-'}
            </ProDescriptions.Item>
            <ProDescriptions.Item label="优惠类型">
              {detailData.rule?.benefit_type ?? '-'}
            </ProDescriptions.Item>
            <ProDescriptions.Item label="优惠值">
              {detailData.rule?.benefit_value ?? '-'}
            </ProDescriptions.Item>
            <ProDescriptions.Item label="可叠加">
              {detailData.rule?.is_stackable === 1 ? '是' : '否'}
            </ProDescriptions.Item>
            <ProDescriptions.Item label="叠加优先级">
              {detailData.rule?.stack_priority ?? '-'}
            </ProDescriptions.Item>
          </ProDescriptions>

          <Divider />
          <ProDescriptions
            column={1}
            title="商品范围"
            emptyText="暂未设置商品范围"
          >
            {detailData.products?.length ? (
              detailData.products.map((product) => (
                <ProDescriptions.Item
                  key={product.id}
                  label={productTypeLabels[product.product_type ?? 0] ?? '-'}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                    }}
                  >
                    {product.product_type === 3 && product.main_image ? (
                      <Image
                        src={product.main_image}
                        width={40}
                        height={40}
                        style={{
                          objectFit: 'cover',
                          borderRadius: 4,
                        }}
                        fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAYAAABw4pVUAAAACXBIWXMAAAsTAAALEwEAmpwYAAABhGlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4KPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxNDIgNzkuMTYwOTI0LCAyMDE3LzA3LzEzLTAxOjA2OjM5ICAgICAgICAiPgogPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4KICA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIi8+CiA8L3JkZjpSREY+CjwveDp4bXBtZXRhPgo8L3A+PGJvcmRlcj4KPHRhYmxlPgo8dHI+Cjx0ZD4KPC90ZD4KPC90cj4KPC90YWJsZT4KPC9ib3JkZXI+Cjwvc3ZnPg"
                      />
                    ) : (
                      <div
                        style={{
                          width: 40,
                          height: 40,
                          background: '#f5f5f5',
                          borderRadius: 4,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: 10,
                          color: '#999',
                          flexShrink: 0,
                        }}
                      >
                        --
                      </div>
                    )}
                    <span>
                      {product.product_type === 1
                        ? '全部商品'
                        : product.product_type === 2
                        ? `指定分类${
                            product.category_id
                              ? ` (ID: ${product.category_id})`
                              : ''
                          }`
                        : product.spu_name || `SPU #${product.product_id}`}
                    </span>
                  </div>
                </ProDescriptions.Item>
              ))
            ) : (
              <ProDescriptions.Item>
                <Empty
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                  description="暂未设置商品范围"
                />
              </ProDescriptions.Item>
            )}
          </ProDescriptions>
        </>
      )}
    </Drawer>
  );
};

export default DetailDrawer;
