import type { ProColumns } from '@ant-design/pro-components';
import { PageContainer } from '@ant-design/pro-components';
import { useModel } from '@umijs/max';
import {
  Button,
  Card,
  Col,
  message,
  Popconfirm,
  Row,
  Space,
  Statistic,
  Table,
  Tag,
} from 'antd';
import React, { useEffect, useState } from 'react';

import Auth from '@/components/Auth';
import {
  deleteCarts,
  deleteCartsItemsItemId,
  getCarts,
  putCartsItemsItemId,
} from '@/services/api/carts';
import CreateForm from './components/CreateForm';

const formatPrice = (price?: number) => {
  if (price === undefined || price === null) return '-';
  return `¥${(price / 100).toFixed(2)}`;
};

const CartList: React.FC = () => {
  const { initialState } = useModel('@@initialState');
  const userId = initialState?.userId;

  const [cart, setCart] = useState<API.CartResponse>();
  const [loading, setLoading] = useState(false);
  const [addModalVisible, setAddModalVisible] = useState(false);

  const fetchCart = async () => {
    if (!userId) return;
    setLoading(true);
    try {
      const res = await getCarts({ user_id: userId });
      const data = (res as any).data || {};
      setCart(data);
    } catch {
      // 静默处理
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  /**
   * 更新购物车项数量
   */
  const handleUpdateQuantity = async (itemId: number, quantity: number) => {
    try {
      await putCartsItemsItemId(
        { item_id: itemId, user_id: userId },
        { quantity },
      );
      message.success('数量已更新');
      fetchCart();
      return true;
    } catch {
      message.error('更新失败，请重试');
      return false;
    }
  };

  /**
   * 删除购物车项
   */
  const handleRemoveItem = async (itemId: number) => {
    try {
      await deleteCartsItemsItemId({ item_id: itemId, user_id: userId });
      message.success('已移除');
      fetchCart();
    } catch {
      message.error('移除失败，请重试');
    }
  };

  /**
   * 清空购物车
   */
  const handleClearCart = async () => {
    try {
      await deleteCarts({ user_id: userId });
      message.success('购物车已清空');
      setCart(undefined);
    } catch {
      message.error('清空失败，请重试');
    }
  };

  const items = cart?.items || [];
  const hasItems = items.length > 0;

  const columns: ProColumns<API.CartItemResponse>[] = [
    {
      title: '商品ID',
      dataIndex: 'product_id',
      width: 80,
    },
    {
      title: '商品名称',
      dataIndex: 'product_name',
      width: 200,
    },
    {
      title: 'SKU',
      dataIndex: 'sku',
      width: 120,
    },
    {
      title: '单价',
      dataIndex: 'price',
      width: 100,
      render: (_, record) => formatPrice(record.price),
    },
    {
      title: '数量',
      dataIndex: 'quantity',
      width: 120,
      render: (_, record) => (
        <Space>
          <Button
            size="small"
            disabled={!record.id || (record.quantity || 0) <= 1}
            onClick={() => {
              if (record.id) {
                handleUpdateQuantity(record.id, (record.quantity || 1) - 1);
              }
            }}
          >
            −
          </Button>
          <span style={{ width: 32, textAlign: 'center' }}>
            {record.quantity ?? '-'}
          </span>
          <Button
            size="small"
            disabled={!record.id}
            onClick={() => {
              if (record.id) {
                handleUpdateQuantity(record.id, (record.quantity || 0) + 1);
              }
            }}
          >
            +
          </Button>
        </Space>
      ),
    },
    {
      title: '小计',
      width: 100,
      render: (_, record) =>
        formatPrice((record.price || 0) * (record.quantity || 0)),
    },
    {
      title: '库存',
      dataIndex: 'stock',
      width: 80,
      render: (_, record) => {
        const stock = record.stock;
        if (stock === undefined || stock === null) return '-';
        return stock > 10 ? (
          <span style={{ color: '#52c41a' }}>{stock}</span>
        ) : (
          <Tag color="red">{stock}</Tag>
        );
      },
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      width: 80,
      render: (_, record) => (
        <Auth permission="canDeleteCart">
          <Popconfirm
            title="确认移除"
            description={`确定要移除「${record.product_name || ''}」吗？`}
            onConfirm={() => handleRemoveItem(record.id!)}
          >
            <a style={{ color: '#ff4d4f' }}>移除</a>
          </Popconfirm>
        </Auth>
      ),
    },
  ];

  return (
    <PageContainer
      header={{
        title: '购物车管理',
        breadcrumb: {
          items: [{ title: '首页' }, { title: '购物车管理' }],
        },
      }}
    >
      {/* 统计卡片 */}
      <Row gutter={24} style={{ marginBottom: 16 }}>
        <Col span={6}>
          <Card loading={loading} styles={{ body: { padding: '20px 24px' } }}>
            <Statistic title="用户ID" value={cart?.user_id ?? '-'} />
          </Card>
        </Col>
        <Col span={6}>
          <Card loading={loading} styles={{ body: { padding: '20px 24px' } }}>
            <Statistic title="商品总数" value={cart?.total_items ?? 0} />
          </Card>
        </Col>
        <Col span={6}>
          <Card loading={loading} styles={{ body: { padding: '20px 24px' } }}>
            <Statistic
              title="购物车总价"
              value={formatPrice(cart?.total_price)}
              valueStyle={{ fontSize: 20 }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card loading={loading} styles={{ body: { padding: '20px 24px' } }}>
            <Statistic title="商品种类" value={items.length} />
          </Card>
        </Col>
      </Row>

      {/* 操作栏 */}
      <Card
        title="购物车商品"
        styles={{
          header: { padding: '12px 24px' },
          body: hasItems ? { padding: 0 } : { padding: 24 },
        }}
        extra={
          <Space>
            <Auth permission="canCreateCart">
              <Button type="primary" onClick={() => setAddModalVisible(true)}>
                添加商品
              </Button>
            </Auth>
            <Auth permission="canDeleteCart">
              <Popconfirm
                title="确认清空"
                description="确定要清空购物车中的所有商品吗？"
                onConfirm={handleClearCart}
              >
                <Button danger disabled={!hasItems}>
                  清空购物车
                </Button>
              </Popconfirm>
            </Auth>
          </Space>
        }
      >
        {hasItems ? (
          <Table<API.CartItemResponse>
            rowKey={(record) => record.id || record.product_id || 0}
            dataSource={items}
            columns={columns as any}
            pagination={false}
            loading={loading}
            size="middle"
          />
        ) : (
          <div
            style={{ textAlign: 'center', color: '#999', padding: '40px 0' }}
          >
            购物车为空
          </div>
        )}
      </Card>

      {/* 添加商品 */}
      <CreateForm
        modalVisible={addModalVisible}
        onCancel={() => setAddModalVisible(false)}
        userId={userId}
        onSubmit={async () => {
          setAddModalVisible(false);
          fetchCart();
          return true;
        }}
      />
    </PageContainer>
  );
};

export default CartList;
