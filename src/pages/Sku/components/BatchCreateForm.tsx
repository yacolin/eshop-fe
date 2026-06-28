import useNonRootCategoryOptions from '@/pages/Category/hooks/useNonRootCategoryOptions';
import SkuMatrixEditor from '@/pages/Sku/components/SkuMatrixEditor';
import useProductOptionsByCategory from '@/pages/Sku/hooks/useProductOptionsByCategory';
import { getProductsId } from '@/services/api/products';
import { Modal, Select } from 'antd';
import React, { useEffect, useState } from 'react';

interface BatchCreateFormProps {
  modalVisible: boolean;
  onCancel: () => void;
  onSuccess: () => void;
}

const BatchCreateForm: React.FC<BatchCreateFormProps> = ({
  modalVisible,
  onCancel,
  onSuccess,
}) => {
  const [productId, setProductId] = useState<number>();
  const [defaultPrice, setDefaultPrice] = useState<number>();
  const [categoryId, setCategoryId] = useState<number>();
  const categories = useNonRootCategoryOptions(modalVisible);
  const products = useProductOptionsByCategory(modalVisible, categoryId);

  // 每次弹窗打开时重置表单状态
  useEffect(() => {
    if (modalVisible) {
      setProductId(undefined);
      setDefaultPrice(undefined);
      setCategoryId(undefined);
    }
  }, [modalVisible]);

  const handleProductChange = async (id: number | undefined) => {
    setProductId(id);
    if (!id) {
      setDefaultPrice(undefined);
      return;
    }
    try {
      const res = await getProductsId({ id });
      const product = (res as any).data as API.Product | undefined;
      setDefaultPrice(product?.min_price);
    } catch {
      setDefaultPrice(undefined);
    }
  };

  return (
    <Modal
      title="批量创建 SKU"
      width={900}
      open={modalVisible}
      onCancel={() => {
        setProductId(undefined);
        setDefaultPrice(undefined);
        setCategoryId(undefined);
        onCancel();
      }}
      footer={null}
      destroyOnHidden
    >
      <div style={{ marginBottom: 16, display: 'flex', gap: 12 }}>
        <Select
          allowClear
          showSearch
          style={{ width: 200 }}
          placeholder="分类筛选"
          value={categoryId}
          onChange={(val) => {
            setCategoryId(val);
            setProductId(undefined);
            setDefaultPrice(undefined);
          }}
          options={categories}
          filterOption={(input, option) =>
            (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
          }
        />
        <Select
          showSearch
          allowClear
          style={{ width: 320 }}
          placeholder="选择产品"
          value={productId}
          onChange={handleProductChange}
          options={products}
          filterOption={(input, option) =>
            (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
          }
        />
      </div>

      {productId ? (
        <SkuMatrixEditor
          key={productId}
          productId={productId}
          defaultPrice={defaultPrice}
          onSuccess={onSuccess}
        />
      ) : (
        <div style={{ textAlign: 'center', padding: 40, color: '#999' }}>
          请先选择一个产品
        </div>
      )}
    </Modal>
  );
};

export default BatchCreateForm;
