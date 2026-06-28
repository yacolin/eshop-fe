import {
  ProForm,
  ProFormDigit,
  ProFormSelect,
} from '@ant-design/pro-components';
import { Checkbox, Empty, Form, Modal, message } from 'antd';
import React, { useRef, useState } from 'react';

import useNonRootCategoryOptions from '@/pages/Category/hooks/useNonRootCategoryOptions';
import useProductOptionsByCategory from '@/pages/Sku/hooks/useProductOptionsByCategory';
import { getSkus } from '@/services/api/skus';

interface CreateFormProps {
  modalVisible: boolean;
  onCancel: () => void;
  onSubmit: (values: {
    sku_ids: number[];
    quantity: number;
    threshold?: number;
  }) => Promise<boolean>;
}

const BatchCreateForm: React.FC<CreateFormProps> = (props) => {
  const { modalVisible, onCancel, onSubmit } = props;
  const formRef = useRef<any>(null);
  const [categoryId, setCategoryId] = useState<number>();
  const categories = useNonRootCategoryOptions(modalVisible);
  const products = useProductOptionsByCategory(modalVisible, categoryId);
  const [skuOptions, setSkuOptions] = useState<
    { label: string; value: number }[]
  >([]);
  const [selectedSkuIds, setSelectedSkuIds] = useState<number[]>([]);
  const [skuLoading, setSkuLoading] = useState(false);

  const allSelected =
    skuOptions.length > 0 && selectedSkuIds.length === skuOptions.length;
  const someSelected = selectedSkuIds.length > 0 && !allSelected;

  // Modal 打开时重置状态
  React.useEffect(() => {
    if (modalVisible) {
      setCategoryId(undefined);
      setSelectedSkuIds([]);
      setSkuOptions([]);
    }
  }, [modalVisible]);

  const handleProductChange = async (productId: number) => {
    setSelectedSkuIds([]);
    formRef.current?.setFieldsValue({ sku_ids: [] });
    if (!productId) {
      setSkuOptions([]);
      return;
    }
    setSkuLoading(true);
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
    } finally {
      setSkuLoading(false);
    }
  };

  const handleSelectAll = (checked: boolean) => {
    const ids = checked ? skuOptions.map((s) => s.value) : [];
    setSelectedSkuIds(ids);
    formRef.current?.setFieldsValue({ sku_ids: ids });
  };

  const handleCheckboxChange = (checkedValues: number[]) => {
    setSelectedSkuIds(checkedValues);
    formRef.current?.setFieldsValue({ sku_ids: checkedValues });
  };

  return (
    <Modal
      title="批量新建库存"
      width={600}
      open={modalVisible}
      onCancel={() => onCancel()}
      footer={null}
      destroyOnHidden
    >
      <ProForm<{
        product_id?: number;
        sku_ids: number[];
        quantity: number;
        threshold?: number;
      }>
        formRef={formRef}
        layout="horizontal"
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 18 }}
        style={{ width: '90%', margin: '0 auto' }}
        onFinish={async (values) => {
          if (selectedSkuIds.length === 0) {
            message.warning('请选择 SKU');
            return;
          }
          const success = await onSubmit({
            sku_ids: selectedSkuIds,
            quantity: values.quantity,
            threshold: values.threshold,
          });
          if (success) {
            onCancel();
          }
        }}
        onReset={() => {
          setCategoryId(undefined);
          setSelectedSkuIds([]);
          setSkuOptions([]);
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
              setSelectedSkuIds([]);
              setSkuOptions([]);
              formRef.current?.setFieldsValue?.({
                product_id: undefined,
                sku_ids: [],
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
        <Form.Item
          name="sku_ids"
          label="SKU"
          rules={[{ required: true, message: '请选择 SKU' }]}
        >
          <div
            style={{
              border: '1px solid #d9d9d9',
              borderRadius: 6,
              padding: '8px 12px',
              height: 200,
              width: '100%',
              overflowY: 'auto',
            }}
          >
            {skuOptions.length === 0 ? (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: '100%',
                }}
              >
                {skuLoading ? (
                  <span style={{ color: '#999' }}>加载中...</span>
                ) : (
                  <Empty description="请先选择产品" />
                )}
              </div>
            ) : (
              <>
                <Checkbox
                  indeterminate={someSelected}
                  checked={allSelected}
                  onChange={(e) => handleSelectAll(e.target.checked)}
                  style={{ marginBottom: 8, fontWeight: 600 }}
                >
                  全选
                </Checkbox>
                <br />
                <Checkbox.Group
                  options={skuOptions}
                  value={selectedSkuIds}
                  onChange={handleCheckboxChange}
                />
              </>
            )}
          </div>
        </Form.Item>
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

export default BatchCreateForm;
