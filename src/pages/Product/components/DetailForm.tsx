import { Descriptions, Drawer, Space, Table, Typography } from 'antd';
import React from 'react';

interface DetailFormProps {
  open: boolean;
  data?: API.SPUDetailResponse;
  onClose: () => void;
}

const statusOptions = [
  { label: '草稿', value: 0 },
  { label: '待审', value: 1 },
  { label: '上架', value: 2 },
  { label: '下架', value: 3 },
  { label: '封禁', value: 4 },
];

const formatPrice = (price?: number) => {
  if (price === undefined || price === null) return '-';
  return `¥${(price / 100).toFixed(2)}`;
};

const DetailForm: React.FC<DetailFormProps> = (props) => {
  const { open, data, onClose } = props;

  return (
    <Drawer
      width={640}
      open={open}
      onClose={onClose}
      closable
      title={data?.name || '商品详情'}
    >
      {data && (
        <Space direction="vertical" style={{ width: '100%' }} size="large">
          {/* 基本信息 */}
          <Descriptions title="基本信息" column={2} size="small" bordered>
            <Descriptions.Item label="商品名称">{data.name}</Descriptions.Item>
            <Descriptions.Item label="副标题">
              {data.subtitle || '-'}
            </Descriptions.Item>
            <Descriptions.Item label="价格区间">
              {formatPrice(data.min_price)} ~ {formatPrice(data.max_price)}
            </Descriptions.Item>
            <Descriptions.Item label="单位">
              {data.unit || '-'}
            </Descriptions.Item>
            <Descriptions.Item label="总库存">
              {data.total_stock ?? '-'}
            </Descriptions.Item>
            <Descriptions.Item label="销量">
              {data.sales_count ?? '-'}
            </Descriptions.Item>
            <Descriptions.Item label="评分">
              {data.rating_average ?? '-'}
            </Descriptions.Item>
            <Descriptions.Item label="状态">
              {data.status !== undefined
                ? statusOptions.find((s) => s.value === data.status)?.label ||
                  '-'
                : '-'}
            </Descriptions.Item>
            <Descriptions.Item label="主图" span={2}>
              {data.main_image ? (
                <img
                  src={data.main_image}
                  alt="主图"
                  style={{ maxWidth: 200, maxHeight: 150 }}
                />
              ) : (
                '-'
              )}
            </Descriptions.Item>
          </Descriptions>

          {/* 规格参数 */}
          {data.attributes && data.attributes.length > 0 && (
            <>
              <Typography.Title level={5}>规格参数</Typography.Title>
              <Table
                dataSource={data.attributes}
                rowKey="attribute_id"
                pagination={false}
                size="small"
                columns={[
                  { title: '属性', dataIndex: 'attribute_name', width: 120 },
                  {
                    title: '值',
                    dataIndex: 'values',
                    width: 200,
                    render: (val: any) =>
                      Array.isArray(val) ? val.join('，') : val || '-',
                  },
                ]}
              />
            </>
          )}

          {/* SKU 列表 */}
          {data.skus && data.skus.length > 0 && (
            <>
              <Typography.Title level={5}>SKU 列表</Typography.Title>
              <Table
                dataSource={data.skus}
                rowKey="id"
                pagination={false}
                size="small"
                scroll={{ x: 'max-content' }}
                columns={(() => {
                  const parseSpec = (s: any): Record<string, string> => {
                    if (typeof s === 'string') {
                      try {
                        return JSON.parse(s);
                      } catch {
                        return {};
                      }
                    }
                    return s || {};
                  };
                  const specKeys: string[] = [];
                  data.skus!.forEach((sku) => {
                    Object.keys(parseSpec(sku.spec)).forEach((k) => {
                      if (!specKeys.includes(k)) specKeys.push(k);
                    });
                  });
                  return [
                    {
                      title: 'SKU ID',
                      key: 'id',
                      width: 70,
                      render: (_: any, r: API.SkuDetailItem) => r.id ?? '-',
                    },
                    {
                      title: '编码',
                      key: 'sku_code',
                      width: 130,
                      render: (_: any, r: API.SkuDetailItem) =>
                        r.sku_code || '-',
                    },
                    ...specKeys.map((k) => ({
                      key: k,
                      title: k,
                      width: 100,
                      render: (_: any, r: API.SkuDetailItem) =>
                        parseSpec(r.spec)[k] || '-',
                    })),
                    {
                      title: '价格',
                      key: 'price',
                      width: 100,
                      render: (_: any, r: API.SkuDetailItem) =>
                        formatPrice(r.price),
                    },
                  ];
                })()}
              />
            </>
          )}

          {/* 图文详情 */}
          {data.description?.description && (
            <>
              <Typography.Title level={5}>图文详情</Typography.Title>
              <Typography.Paragraph>
                {data.description.description}
              </Typography.Paragraph>
            </>
          )}
          {data.description?.mobile_description && (
            <>
              <Typography.Title level={5}>移动端详情</Typography.Title>
              <div
                dangerouslySetInnerHTML={{
                  __html: data.description.mobile_description,
                }}
                style={{
                  border: '1px solid #f0f0f0',
                  padding: 16,
                  borderRadius: 8,
                  maxHeight: 400,
                  overflow: 'auto',
                }}
              />
            </>
          )}
        </Space>
      )}
    </Drawer>
  );
};

export default DetailForm;
