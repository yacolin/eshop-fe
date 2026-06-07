import {
  ProForm,
  ProFormDigit,
  ProFormSelect,
} from '@ant-design/pro-components';
import { Modal } from 'antd';
import React, { useEffect, useState } from 'react';

import { getProducts } from '@/services/api/products';

interface CreateFormProps {
  modalVisible: boolean;
  onCancel: () => void;
  onSubmit: (values: API.CreateInventoryDTO) => Promise<boolean>;
}

const CreateForm: React.FC<CreateFormProps> = (props) => {
  const { modalVisible, onCancel, onSubmit } = props;
  const [products, setProducts] = useState<{ label: string; value: number }[]>(
    [],
  );

  useEffect(() => {
    if (!modalVisible) return;

    const fetchProducts = async () => {
      try {
        const res = await getProducts({ page: 1, size: 100 });
        const data = (res as any).data || {};
        const list = data.list || [];
        setProducts(
          // 拼接 SKU 和名称作为选项标签，并使用产品 ID 作为选项值
          list.map((p: API.Product) => ({
            label: `[${p.sku}] ${p.name}`,
            value: p.id || 0,
          })),
        );
      } catch (error) {
        console.error('Failed to fetch products:', error);
      }
    };

    fetchProducts();
  }, [modalVisible]);

  return (
    <Modal
      title="新建库存"
      width={600}
      open={modalVisible}
      onCancel={() => onCancel()}
      footer={null}
    >
      <ProForm<API.CreateInventoryDTO>
        layout="horizontal"
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 18 }}
        style={{ width: '90%', margin: '0 auto' }}
        onFinish={async (values) => {
          const success = await onSubmit(values);
          if (success) {
            onCancel();
          }
        }}
        submitter={{
          render: (_, dom) => (
            <div
              style={{
                width: '90%',
                display: 'flex',
                justifyContent: 'flex-end',
                gap: 8,
              }}
            >
              {dom}
            </div>
          ),
        }}
      >
        <ProFormSelect
          name="product_id"
          label="产品"
          width="md"
          showSearch
          rules={[{ required: true, message: '请选择产品' }]}
          options={products}
          placeholder="搜索并选择产品"
          fieldProps={{
            filterOption: (input, option) =>
              (option?.label ?? '').toLowerCase().includes(input.toLowerCase()),
          }}
        />
        <ProFormDigit
          name="quantity"
          label="初始库存"
          width="md"
          min={0}
          rules={[{ required: true, message: '请输入库存数量' }]}
          fieldProps={{ precision: 0 }}
        />
        <ProFormDigit
          name="threshold"
          label="低库存预警"
          width="md"
          min={0}
          initialValue={0}
          tooltip="库存数量低于此值时自动标记为低库存"
          fieldProps={{ precision: 0 }}
        />
      </ProForm>
    </Modal>
  );
};

export default CreateForm;
