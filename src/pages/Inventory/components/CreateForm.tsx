import {
  ProForm,
  ProFormDigit,
  ProFormSelect,
} from '@ant-design/pro-components';
import { Modal } from 'antd';
import React, { useRef, useState } from 'react';

import useNonRootCategoryOptions from '@/pages/Category/hooks/useNonRootCategoryOptions';
import useProductOptionsByCategory from '@/pages/Sku/hooks/useProductOptionsByCategory';
import { getSkus } from '@/services/api/skus';

interface CreateFormProps {
  modalVisible: boolean;
  onCancel: () => void;
  onSubmit: (values: API.CreateInventoryDTO) => Promise<boolean>;
}

const CreateForm: React.FC<CreateFormProps> = (props) => {
  const { modalVisible, onCancel, onSubmit } = props;
  const formRef = useRef<any>(null);
  const [categoryId, setCategoryId] = useState<number>();
  const categories = useNonRootCategoryOptions(modalVisible);
  const products = useProductOptionsByCategory(modalVisible, categoryId);
  const [skuOptions, setSkuOptions] = useState<
    { label: string; value: number }[]
  >([]);

  const handleProductChange = async (productId: number) => {
    formRef.current?.setFieldsValue({ sku_id: undefined });
    if (!productId) {
      setSkuOptions([]);
      return;
    }
    try {
      const res = await getSkus({ product_id: productId, page: 1, size: 1000 });
      const data = (res as any).data || {};
      const list: API.SkuResponse[] = data.list || [];
      setSkuOptions(
        list.map((sku) => ({
          label: `${sku.name}（${sku.sku_code}）`,
          value: sku.id || 0,
        })),
      );
    } catch {
      setSkuOptions([]);
    }
  };

  return (
    <Modal
      title="新建库存"
      width={600}
      open={modalVisible}
      onCancel={() => onCancel()}
      footer={null}
      destroyOnHidden
    >
      <ProForm<API.CreateInventoryDTO & { product_id?: number }>
        formRef={formRef}
        layout="horizontal"
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 18 }}
        style={{ width: '90%', margin: '0 auto' }}
        onFinish={async (values) => {
          const v = values as any;
          const success = await onSubmit({
            sku_id: v.sku_id!,
            quantity: v.quantity,
            threshold: v.threshold,
          });
          if (success) {
            onCancel();
          }
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
        <ProFormSelect
          name="category_id"
          label="分类筛选"
          showSearch
          options={categories}
          placeholder="选择分类"
          fieldProps={{
            allowClear: true,
            filterOption: (input, option) =>
              (option?.label ?? '').toLowerCase().includes(input.toLowerCase()),
            onChange: (val: number | undefined) => {
              setCategoryId(val);
              setSkuOptions([]);
              formRef.current?.setFieldsValue?.({
                product_id: undefined,
                sku_id: undefined,
              });
            },
          }}
        />
        <ProFormSelect
          name="product_id"
          label="产品"
          showSearch
          rules={[{ required: true, message: '请选择产品' }]}
          options={products}
          placeholder="搜索并选择产品"
          fieldProps={{
            filterOption: (input, option) =>
              (option?.label ?? '').toLowerCase().includes(input.toLowerCase()),
            onChange: handleProductChange,
          }}
        />
        <ProFormSelect
          name="sku_id"
          label="SKU"
          showSearch
          rules={[{ required: true, message: '请选择 SKU' }]}
          options={skuOptions}
          placeholder="请先选择产品"
          fieldProps={{
            filterOption: (input, option) =>
              (option?.label ?? '').toLowerCase().includes(input.toLowerCase()),
          }}
        />
        <ProFormDigit
          name="quantity"
          label="初始库存"
          min={0}
          rules={[{ required: true, message: '请输入库存数量' }]}
          fieldProps={{ precision: 0 }}
        />
        <ProFormDigit
          name="threshold"
          label="低库存预警"
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
