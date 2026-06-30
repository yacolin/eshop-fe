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
                  { title: '值', dataIndex: 'value' },
                ]}
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
