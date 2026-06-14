import { DeleteOutlined } from '@ant-design/icons';
import {
  ProForm,
  ProFormSelect,
  ProFormText,
} from '@ant-design/pro-components';
import { Form, InputNumber, Modal, Select, Typography } from 'antd';
import React, { useState } from 'react';

import { getProductsCache } from '@/services/api/products';

interface CreateFormProps {
  modalVisible: boolean;
  onCancel: () => void;
  onSubmit: (values: API.CreateOrderDTO) => Promise<boolean>;
}

interface ProductOption {
  label: string;
  value: string;
  price: number;
}

const ItemRow: React.FC<{
  name: number;
  fieldsLength: number;
  remove: (index: number | number[]) => void;
  productOptions: ProductOption[];
  loadProducts: () => void;
}> = ({ name, fieldsLength, remove, productOptions, loadProducts }) => {
  const form = Form.useFormInstance();

  return (
    <div
      style={{
        display: 'flex',
        gap: 12,
        alignItems: 'center',
        marginBottom: 8,
      }}
    >
      <Form.Item
        name={[name, 'product_id']}
        rules={[{ required: true, message: '请选择商品' }]}
        noStyle
      >
        <Select
          style={{ width: 220 }}
          showSearch
          placeholder="搜索选择商品"
          filterOption={(input, option) =>
            (option?.label as string)
              ?.toLowerCase()
              .includes(input.toLowerCase())
          }
          onFocus={() => {
            if (productOptions.length === 0) loadProducts();
          }}
          options={productOptions}
          onSelect={(_val, option) => {
            const items = form.getFieldValue('items');
            if (items?.[name]) {
              items[name].quantity = 1;
              items[name].unit_price = option?.price ? option.price / 100 : 0;
              form.setFieldsValue({ items });
            }
          }}
          notFoundContent={
            productOptions.length === 0 ? '点击加载商品列表' : '暂无匹配商品'
          }
        />
      </Form.Item>
      <Form.Item name={[name, 'quantity']} noStyle>
        <InputNumber style={{ width: 100 }} min={1} placeholder="数量" />
      </Form.Item>
      <Form.Item name={[name, 'unit_price']} noStyle>
        <InputNumber
          style={{ width: 130 }}
          min={0}
          precision={2}
          prefix="¥"
          disabled
        />
      </Form.Item>
      <Form.Item noStyle shouldUpdate>
        {() => {
          const price = form.getFieldValue(['items', name, 'unit_price']);
          const qty = form.getFieldValue(['items', name, 'quantity']);
          const total = (price || 0) * (qty || 0);
          return (
            <Typography.Text style={{ width: 80, color: '#1677ff' }}>
              ¥{total.toFixed(2)}
            </Typography.Text>
          );
        }}
      </Form.Item>
      {fieldsLength > 1 && (
        <DeleteOutlined
          style={{ color: '#ff4d4f', cursor: 'pointer', fontSize: 16 }}
          onClick={() => remove(name)}
        />
      )}
    </div>
  );
};

const CreateForm: React.FC<CreateFormProps> = (props) => {
  const { modalVisible, onCancel, onSubmit } = props;
  const [productOptions, setProductOptions] = useState<ProductOption[]>([]);

  const loadProducts = async () => {
    const res = await getProductsCache({ page: 1, size: 100 });
    const data = (res as any).data || {};
    setProductOptions(
      (data.list || []).map((p: API.Product) => ({
        label: `${p.name} (${p.sku})`,
        value: String(p.id),
        price: p.price,
      })),
    );
  };

  return (
    <Modal
      title="新建订单"
      width={800}
      open={modalVisible}
      onCancel={() => onCancel()}
      footer={null}
      destroyOnHidden={true}
    >
      <ProForm<API.CreateOrderDTO>
        layout="horizontal"
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 20 }}
        style={{ width: '95%', margin: '0 auto' }}
        onFinish={async (values) => {
          const success = await onSubmit({
            ...values,
            items: values.items.map((item: any) => ({
              product_id: item.product_id,
              quantity: item.quantity,
              unit_price: Math.round(item.unit_price * 100),
            })),
          });
          if (success) {
            onCancel();
          }
          return success;
        }}
        submitter={{
          render: (_, dom) => (
            <div
              style={{
                width: '100%',
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
        <ProFormText
          name="customer_id"
          label="客户ID"
          rules={[{ required: true, message: '请输入客户ID' }]}
        />
        <ProFormSelect
          name="currency"
          label="币种"
          initialValue="CNY"
          options={[
            { label: '人民币 (CNY)', value: 'CNY' },
            { label: '美元 (USD)', value: 'USD' },
            { label: '欧元 (EUR)', value: 'EUR' },
          ]}
        />

        <Form.Item label="订单商品" required>
          <Form.List name="items">
            {(fields, { add, remove }) => (
              <div>
                <div
                  style={{
                    display: 'flex',
                    gap: 12,
                    marginBottom: 8,
                    padding: '0 4px',
                    fontSize: 12,
                    color: '#8c8c8c',
                  }}
                >
                  <span style={{ width: 220 }}>商品</span>
                  <span style={{ width: 100 }}>数量</span>
                  <span style={{ width: 130 }}>单价</span>
                  <span style={{ width: 80 }}>小计</span>
                </div>
                {fields.map(({ key, name }) => (
                  <ItemRow
                    key={key}
                    name={name}
                    fieldsLength={fields.length}
                    remove={remove}
                    productOptions={productOptions}
                    loadProducts={loadProducts}
                  />
                ))}
                <a
                  style={{
                    fontSize: 13,
                    marginTop: 4,
                    display: 'inline-block',
                  }}
                  onClick={() =>
                    add({ product_id: undefined, quantity: 1, unit_price: 0 })
                  }
                >
                  + 添加商品
                </a>
              </div>
            )}
          </Form.List>
        </Form.Item>
      </ProForm>
    </Modal>
  );
};

export default CreateForm;
