import { PageContainer } from '@ant-design/pro-components';
import {
  Button,
  Card,
  Descriptions,
  Form,
  Input,
  InputNumber,
  message,
  Modal,
  Space,
  Statistic,
  Table,
  Tag,
} from 'antd';
import React, { useState } from 'react';

import {
  getInventoriesLogs,
  getInventoriesStock,
  postInventoriesRestock,
} from '@/services/api/inventories';

const statusMap: Record<string, { text: string; color: string }> = {
  instock: { text: '有货', color: '#52c41a' },
  lowstock: { text: '低库存', color: '#faad14' },
  outofstock: { text: '缺货', color: '#ff4d4f' },
};

const InventoryPage: React.FC = () => {
  const [searchText, setSearchText] = useState('');
  const [inventory, setInventory] = useState<API.Inventory | null>(null);
  const [logs, setLogs] = useState<API.InventoryLog[]>([]);
  const [loading, setLoading] = useState(false);
  const [restockModalOpen, setRestockModalOpen] = useState(false);
  const [restockQty, setRestockQty] = useState(0);
  const [restockNote, setRestockNote] = useState('');

  const handleSearch = async () => {
    if (!searchText.trim()) {
      message.warning('请输入 SKU ID');
      return;
    }
    const skuId = parseInt(searchText.trim(), 10);
    if (isNaN(skuId)) {
      message.warning('请输入有效的 SKU ID');
      return;
    }

    setLoading(true);
    try {
      const [stockRes, logsRes] = await Promise.all([
        getInventoriesStock({ sku_id: skuId }),
        getInventoriesLogs({ sku_id: skuId, page: 1, size: 20 }),
      ]);
      setInventory((stockRes as any).data || null);
      const logsData = (logsRes as any).data || {};
      setLogs(logsData.list || []);
    } catch {
      message.error('查询库存失败');
    } finally {
      setLoading(false);
    }
  };

  const handleRestock = async () => {
    if (!inventory) return;
    const hide = message.loading('正在补货');
    try {
      await postInventoriesRestock({
        sku_id: inventory.sku_id || 0,
        quantity: restockQty,
        note: restockNote || undefined,
      });
      hide();
      message.success('补货成功');
      setRestockModalOpen(false);
      handleSearch();
    } catch {
      hide();
      message.error('补货失败，请重试');
    }
  };

  const logColumns = [
    { title: 'ID', dataIndex: 'id', width: 60 },
    { title: '变更类型', dataIndex: 'change_type', width: 120 },
    { title: '变更数量', dataIndex: 'change_amount', width: 100 },
    { title: '操作前', dataIndex: 'before_quantity', width: 80 },
    { title: '操作后', dataIndex: 'after_quantity', width: 80 },
    { title: '备注', dataIndex: 'note', ellipsis: true },
    { title: '操作人', dataIndex: 'operator', width: 100 },
    {
      title: '时间',
      dataIndex: 'created_at',
      width: 160,
      render: (v: string) => v || '-',
    },
  ];

  return (
    <PageContainer
      header={{
        title: '库存管理',
        breadcrumb: { items: [{ title: '首页' }, { title: '库存管理' }] },
      }}
    >
      <Card>
        <Space direction="vertical" style={{ width: '100%' }} size="large">
          <Input.Search
            placeholder="输入 SKU ID 查询库存"
            enterButton="查询"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            onSearch={handleSearch}
            loading={loading}
            style={{ maxWidth: 400 }}
          />

          {inventory && (
            <>
              <Card size="small" title="当前库存">
                <Descriptions column={3} size="small">
                  <Descriptions.Item label="SKU ID">
                    {inventory.sku_id}
                  </Descriptions.Item>
                  <Descriptions.Item label="库存数量">
                    <Statistic
                      value={inventory.quantity || 0}
                      suffix="件"
                      valueStyle={{ fontSize: 18 }}
                    />
                  </Descriptions.Item>
                  <Descriptions.Item label="已预订">
                    {inventory.reserved || 0} 件
                  </Descriptions.Item>
                  <Descriptions.Item label="可用库存">
                    {(inventory.quantity || 0) - (inventory.reserved || 0)} 件
                  </Descriptions.Item>
                  <Descriptions.Item label="预警阈值">
                    {inventory.threshold ?? '-'} 件
                  </Descriptions.Item>
                  <Descriptions.Item label="库存状态">
                    {(() => {
                      const s = statusMap[inventory.status || ''];
                      return s ? (
                        <Tag color={s.color}>{s.text}</Tag>
                      ) : (
                        inventory.status || '-'
                      );
                    })()}
                  </Descriptions.Item>
                </Descriptions>
                <Button
                  type="primary"
                  style={{ marginTop: 16 }}
                  onClick={() => setRestockModalOpen(true)}
                >
                  补货
                </Button>
              </Card>

              <Card size="small" title="库存变更记录">
                <Table
                  rowKey="id"
                  dataSource={logs}
                  columns={logColumns}
                  pagination={{ pageSize: 10, showTotal: (t) => `共 ${t} 条` }}
                  size="small"
                  scroll={{ x: 800 }}
                />
              </Card>
            </>
          )}

          {!inventory && !loading && searchText && (
            <Card>
              <span style={{ color: '#999' }}>未找到库存记录</span>
            </Card>
          )}
        </Space>
      </Card>

      <Modal
        title="补货"
        open={restockModalOpen}
        onCancel={() => setRestockModalOpen(false)}
        onOk={handleRestock}
      >
        <Form layout="vertical">
          <Form.Item label="补货数量" required>
            <InputNumber
              min={1}
              style={{ width: '100%' }}
              value={restockQty}
              onChange={(v) => setRestockQty(v || 0)}
            />
          </Form.Item>
          <Form.Item label="备注">
            <Input.TextArea
              value={restockNote}
              onChange={(e) => setRestockNote(e.target.value)}
              placeholder="可选"
            />
          </Form.Item>
        </Form>
      </Modal>
    </PageContainer>
  );
};

export default InventoryPage;
