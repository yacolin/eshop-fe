import type { ProColumns } from '@ant-design/pro-components';
import { PageContainer, ProTable } from '@ant-design/pro-components';
import {
  Divider,
  Drawer,
  Input,
  message,
  Popconfirm,
  Select,
  Space,
  Tag,
  Typography,
} from 'antd';
import React, { useEffect, useState } from 'react';

import Auth from '@/components/Auth';

import { getProducts } from '@/services/api/products';
import { deleteSkusId, getSkus } from '@/services/api/skus';
import UpdateForm from './components/UpdateForm';

import type { FormValueType } from './components/UpdateForm';

const statusMap: Record<number, { text: string; color: string }> = {
  1: { text: '启用', color: '#52c41a' },
  0: { text: '禁用', color: '#ff4d4f' },
};

/**
 * 格式化价格：分 → 元
 */
const formatPrice = (price?: number) => {
  if (price === undefined || price === null) return '-';
  return `¥${(price / 100).toFixed(2)}`;
};

const SkuList: React.FC = () => {
  const [updateModalVisible, handleUpdateModalVisible] =
    useState<boolean>(false);
  const [stepFormValues, setStepFormValues] = useState<FormValueType>({});
  const [row, setRow] = useState<API.SKU>();
  const [dataSource, setDataSource] = useState<API.SKU[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<number | undefined>();
  const [searchCode, setSearchCode] = useState('');
  const [productOptions, setProductOptions] = useState<
    { label: string; value: number }[]
  >([]);

  const fetchSkus = async (productId: number) => {
    setLoading(true);
    try {
      const res = await getSkus({ product_id: productId });
      const list = (res as any).data || [];
      setDataSource(list);
    } catch {
      message.error('获取 SKU 列表失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedProduct) {
      fetchSkus(selectedProduct);
    } else {
      setDataSource([]);
    }
  }, [selectedProduct]);

  const fetchProducts = async (name?: string) => {
    try {
      const res = await getProducts({ page: 1, size: 100, name });
      const data = (res as any).data || {};
      const list = data.list || [];
      setProductOptions(
        list.map((p: API.SPU) => ({
          label: `[${p.id}] ${p.name}`,
          value: p.id || 0,
        })),
      );
    } catch {
      // 静默
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleSearchCode = async () => {
    if (!searchCode.trim()) return;
    try {
      const { getSkusCodeCode } = await import('@/services/api/skus');
      const res = await getSkusCodeCode({ code: searchCode.trim() });
      const sku = (res as any).data;
      if (sku) {
        setDataSource([sku]);
        setSelectedProduct(undefined);
      } else {
        message.warning('未找到该 SKU');
      }
    } catch {
      message.error('查询失败');
    }
  };

  /**
   * 删除 SKU
   */
  const handleRemove = async (selectedRows: API.SKU[]) => {
    const hide = message.loading('正在删除');
    if (!selectedRows.length) return true;
    try {
      await Promise.all(
        selectedRows.map((row) => deleteSkusId({ id: row.id || 0 })),
      );
      hide();
      message.success('删除成功');
      if (selectedProduct) fetchSkus(selectedProduct);
      return true;
    } catch {
      hide();
      message.error('删除失败，请重试');
      return false;
    }
  };

  const columns: ProColumns<API.SKU>[] = [
    {
      title: 'ID',
      dataIndex: 'id',
      hideInSearch: true,
      width: 60,
    },
    {
      title: 'SKU 编码',
      dataIndex: 'sku_code',
      width: 150,
      copyable: true,
    },
    {
      title: '条码',
      dataIndex: 'barcode',
      width: 140,
      copyable: true,
    },
    {
      title: '售价',
      dataIndex: 'price',
      width: 100,
      render: (_, record) => formatPrice(record.price),
    },
    {
      title: '成本价',
      dataIndex: 'cost_price',
      width: 100,
      render: (_, record) => formatPrice(record.cost_price),
    },
    {
      title: '市场价',
      dataIndex: 'market_price',
      width: 100,
      render: (_, record) => formatPrice(record.market_price),
    },
    {
      title: '规格',
      dataIndex: 'spec',
      width: 200,
      ellipsis: true,
      render: (_, record) => {
        if (!record.spec) return '-';
        try {
          const spec =
            typeof record.spec === 'string'
              ? JSON.parse(record.spec)
              : record.spec;
          return Object.entries(spec).map(([k, v]) => (
            <Tag key={k}>
              {k}: {String(v)}
            </Tag>
          ));
        } catch {
          return record.spec;
        }
      },
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 80,
      render: (_, record) => {
        const cfg = statusMap[record.status ?? -1];
        return cfg ? <Tag color={cfg.color}>{cfg.text}</Tag> : '-';
      },
    },
    {
      title: '创建时间',
      dataIndex: 'created_at',
      hideInSearch: true,
      hideInForm: true,
      valueType: 'dateTime',
      width: 160,
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      width: 140,
      fixed: 'right',
      render: (_, record) => (
        <div style={{ paddingLeft: 8, whiteSpace: 'nowrap' }}>
          <a onClick={() => setRow(record)}>查看</a>
          <Auth permission="canUpdateSku">
            <Divider type="vertical" />
            <a
              onClick={() => {
                setStepFormValues(record as FormValueType);
                handleUpdateModalVisible(true);
              }}
            >
              编辑
            </a>
          </Auth>
          <Auth permission="canDeleteSku">
            <Divider type="vertical" />
            <Popconfirm
              title="确认删除"
              description={`确定要删除 SKU「${record.sku_code}」吗？`}
              onConfirm={async () => {
                const success = await handleRemove([record]);
                if (success && selectedProduct) fetchSkus(selectedProduct);
              }}
            >
              <a style={{ color: '#ff4d4f' }}>删除</a>
            </Popconfirm>
          </Auth>
        </div>
      ),
    },
  ];

  return (
    <PageContainer
      header={{
        title: 'SKU 管理',
        breadcrumb: {
          items: [{ title: '首页' }, { title: 'SKU 管理' }],
        },
      }}
    >
      <ProTable<API.SKU>
        headerTitle={
          <Space wrap>
            <Select
              placeholder="选择产品查看 SKU"
              allowClear
              showSearch
              style={{ width: 300 }}
              value={selectedProduct}
              onChange={(val) => setSelectedProduct(val)}
              options={productOptions}
              onSearch={(val) => fetchProducts(val || undefined)}
              filterOption={false}
              notFoundContent={null}
            />
            <Typography.Text type="secondary" style={{ lineHeight: '32px' }}>
              或
            </Typography.Text>
            <Input.Search
              placeholder="按 SKU 编码搜索"
              allowClear
              style={{ width: 220 }}
              value={searchCode}
              onChange={(e) => setSearchCode(e.target.value)}
              onSearch={handleSearchCode}
            />
          </Space>
        }
        rowKey="id"
        dataSource={dataSource}
        loading={loading}
        scroll={{ x: 1200 }}
        search={false}
        options={false}
        columns={columns}
        pagination={{
          defaultPageSize: 10,
          showSizeChanger: true,
          pageSizeOptions: ['10', '20', '50'],
          showTotal: (total) => `共 ${total} 条`,
        }}
      />

      {/* 编辑弹窗 */}
      {stepFormValues && Object.keys(stepFormValues).length ? (
        <UpdateForm
          onSubmit={async (value) => {
            const hide = message.loading('正在更新');
            try {
              const { putSkusId } = await import('@/services/api/skus');
              await putSkusId({ id: stepFormValues.id || 0 }, value);
              hide();
              message.success('更新成功');
              handleUpdateModalVisible(false);
              setStepFormValues({});
              if (selectedProduct) fetchSkus(selectedProduct);
            } catch {
              hide();
              message.error('更新失败，请重试');
            }
          }}
          onCancel={() => {
            handleUpdateModalVisible(false);
            setStepFormValues({});
          }}
          updateModalVisible={updateModalVisible}
          values={stepFormValues as API.SKU}
        />
      ) : null}

      {/* 查看详情抽屉 */}
      <Drawer
        width={600}
        open={!!row}
        onClose={() => setRow(undefined)}
        closable
        title={row?.sku_code ? `SKU #${row.sku_code}` : 'SKU 详情'}
      >
        {row && (
          <div>
            <Typography.Text strong>产品 ID: </Typography.Text>
            <Typography.Text>{row.product_id}</Typography.Text>
            <br />
            <Typography.Text strong>SKU 编码: </Typography.Text>
            <Typography.Text copyable>{row.sku_code}</Typography.Text>
            <br />
            <Typography.Text strong>条码: </Typography.Text>
            <Typography.Text copyable>{row.barcode || '-'}</Typography.Text>
            <br />
            <Typography.Text strong>售价: </Typography.Text>
            <Typography.Text>{formatPrice(row.price)}</Typography.Text>
            <br />
            <Typography.Text strong>成本价: </Typography.Text>
            <Typography.Text>{formatPrice(row.cost_price)}</Typography.Text>
            <br />
            <Typography.Text strong>市场价: </Typography.Text>
            <Typography.Text>{formatPrice(row.market_price)}</Typography.Text>
            <br />
            <Typography.Text strong>重量: </Typography.Text>
            <Typography.Text>
              {row.weight ? `${row.weight}g` : '-'}
            </Typography.Text>
            <br />
            <Typography.Text strong>体积: </Typography.Text>
            <Typography.Text>
              {[row.length, row.width, row.height].filter(Boolean).length === 3
                ? `${row.length}×${row.width}×${row.height}`
                : '-'}
            </Typography.Text>
            <br />
            <Typography.Text strong>最小购买量: </Typography.Text>
            <Typography.Text>{row.min_purchase_qty ?? '-'}</Typography.Text>
            <br />
            <Typography.Text strong>最大购买量: </Typography.Text>
            <Typography.Text>{row.max_purchase_qty ?? '-'}</Typography.Text>
            <br />
            <Typography.Text strong>状态: </Typography.Text>
            {(() => {
              const cfg = statusMap[row.status ?? -1];
              return cfg ? <Tag color={cfg.color}>{cfg.text}</Tag> : '-';
            })()}
          </div>
        )}
      </Drawer>
    </PageContainer>
  );
};

export default SkuList;
