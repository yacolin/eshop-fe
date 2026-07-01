import { ProDescriptions } from '@ant-design/pro-components';
import { Button, Drawer, Image, message, Space, Tag } from 'antd';
import React, { useEffect, useState } from 'react';

import { INVENTORY_STATUS_MAP } from '@/constants';
import { getSkusId } from '@/services/api/skus';

const statusMap: Record<number, { text: string; color: string }> = {
  1: { text: '启用', color: '#52c41a' },
  0: { text: '禁用', color: '#ff4d4f' },
};

const formatPrice = (price?: number) => {
  if (price === undefined || price === null) return '-';
  return `¥${(price / 100).toFixed(2)}`;
};

interface DetailDrawerProps {
  row?: API.SKU;
  onClose: () => void;
}

const DetailDrawer: React.FC<DetailDrawerProps> = ({ row, onClose }) => {
  const [detailData, setDetailData] = useState<API.SKU>();
  const [refreshing, setRefreshing] = useState(false);

  const loadDetail = async (id: number) => {
    try {
      const res = await getSkusId({ id });
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
      title={row?.sku_code ? `SKU #${row.sku_code}` : 'SKU 详情'}
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
        <Space
          direction="vertical"
          size="large"
          style={{ width: '100%', padding: '0 4px' }}
        >
          <ProDescriptions
            column={2}
            title="基本信息"
            dataSource={detailData}
            columns={[
              { title: '产品 ID', dataIndex: 'product_id' },
              { title: 'SKU 编码', dataIndex: 'sku_code', copyable: true },
              { title: '条码', dataIndex: 'barcode', copyable: true },
              {
                title: '规格',
                dataIndex: 'spec',
                render: (_, record) => {
                  if (!record.spec) return '-';
                  try {
                    const spec =
                      typeof record.spec === 'string'
                        ? JSON.parse(record.spec)
                        : record.spec;
                    return (
                      <>
                        {Object.entries(spec).map(([k, v]) => (
                          <Tag key={k}>
                            {k}: {String(v)}
                          </Tag>
                        ))}
                      </>
                    );
                  } catch {
                    return record.spec;
                  }
                },
              },
              {
                title: '状态',
                dataIndex: 'status',
                render: (_, record) => {
                  const cfg = statusMap[record.status ?? -1];
                  return cfg ? <Tag color={cfg.color}>{cfg.text}</Tag> : '-';
                },
              },
            ]}
          />

          <ProDescriptions
            column={2}
            title="价格信息"
            dataSource={detailData}
            columns={[
              {
                title: '售价',
                dataIndex: 'price',
                render: (_, r) => formatPrice(r.price),
              },
              {
                title: '成本价',
                dataIndex: 'cost_price',
                render: (_, r) => formatPrice(r.cost_price),
              },
              {
                title: '市场价',
                dataIndex: 'market_price',
                render: (_, r) => formatPrice(r.market_price),
              },
            ]}
          />

          <ProDescriptions
            column={2}
            title="库存信息"
            dataSource={detailData}
            columns={[
              { title: '可用库存', dataIndex: 'available_quantity' },
              {
                title: '库存状态',
                dataIndex: 'inventory_status',
                render: (_, record) => {
                  if (!record.inventory_status) return '-';
                  const cfg = INVENTORY_STATUS_MAP[record.inventory_status];
                  return cfg ? (
                    <Tag color={cfg.color}>{cfg.text}</Tag>
                  ) : (
                    record.inventory_status
                  );
                },
              },
            ]}
          />

          <ProDescriptions
            column={2}
            title="物理信息"
            dataSource={detailData}
            columns={[
              {
                title: '重量',
                dataIndex: 'weight',
                render: (_, r) => (r.weight ? `${r.weight}g` : '-'),
              },
              {
                title: '长度',
                dataIndex: 'length',
                render: (_, r) => (r.length ? `${r.length}mm` : '-'),
              },
              {
                title: '宽度',
                dataIndex: 'width',
                render: (_, r) => (r.width ? `${r.width}mm` : '-'),
              },
              {
                title: '高度',
                dataIndex: 'height',
                render: (_, r) => (r.height ? `${r.height}mm` : '-'),
              },
              {
                title: '体积',
                dataIndex: 'volume',
                render: (_, r) => (r.volume ? `${r.volume}mm³` : '-'),
              },
            ]}
          />

          <ProDescriptions
            column={2}
            title="购买限制"
            dataSource={detailData}
            columns={[
              { title: '最小购买量', dataIndex: 'min_purchase_qty' },
              { title: '最大购买量', dataIndex: 'max_purchase_qty' },
            ]}
          />

          <ProDescriptions
            column={2}
            title="时间信息"
            dataSource={detailData}
            columns={[
              {
                title: '创建时间',
                dataIndex: 'created_at',
                valueType: 'dateTime',
              },
              {
                title: '更新时间',
                dataIndex: 'updated_at',
                valueType: 'dateTime',
              },
            ]}
          />

          {detailData.image && (
            <ProDescriptions column={1} title="图片">
              <ProDescriptions.Item>
                <Image
                  src={detailData.image}
                  width={120}
                  style={{ borderRadius: 4 }}
                  fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAYAAABw4pVUAAAACXBIWXMAAAsTAAALEwEAmpwYAAABhGlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4KPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxNDIgNzkuMTYwOTI0LCAyMDE3LzA3LzEzLTAxOjA2OjM5ICAgICAgICAiPgogPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4KICA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIi8+CiA8L3JkZjpSREY+CjwveDp4bXBtZXRhPgo8L3A+PGJvcmRlcj4KPHRhYmxlPgo8dHI+Cjx0ZD4KPC90ZD4KPC90cj4KPC90YWJsZT4KPC9ib3JkZXI+Cjwvc3ZnPg"
                />
              </ProDescriptions.Item>
            </ProDescriptions>
          )}
        </Space>
      )}
    </Drawer>
  );
};

export default DetailDrawer;
