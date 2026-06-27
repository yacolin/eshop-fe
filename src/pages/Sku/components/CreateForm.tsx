import {
  ProForm,
  ProFormDigit,
  ProFormSelect,
  ProFormText,
} from '@ant-design/pro-components';
import { Modal } from 'antd';
import React, { useEffect, useRef, useState } from 'react';

import { getProductsIdAttributes } from '@/services/api/products';
import useProductOptions from '../hooks/useProductOptions';

interface CreateFormProps {
  modalVisible: boolean;
  onCancel: () => void;
  onSubmit: (values: API.CreateSkuDTO & { price: number }) => Promise<boolean>;
}

const CreateForm: React.FC<CreateFormProps> = (props) => {
  const { modalVisible, onCancel, onSubmit } = props;
  const formRef = useRef<any>(null);
  const products = useProductOptions(modalVisible);
  const [attributes, setAttributes] = useState<API.ProductAttributeItem[]>([]);
  const [selectedAttrs, setSelectedAttrs] = useState<
    Record<number, { valueId: number; value: string }>
  >({});

  const handleProductChange = async (productId: number | undefined) => {
    setSelectedAttrs({});
    if (!productId) {
      setAttributes([]);
      return;
    }
    try {
      const res = await getProductsIdAttributes({ id: productId });
      setAttributes((res as any).data || []);
    } catch {
      setAttributes([]);
    }
  };

  const handleAttrChange =
    (attrId: number) => (valueId: number | undefined) => {
      if (!valueId) {
        setSelectedAttrs((prev) => {
          const next = { ...prev };
          delete next[attrId];
          return next;
        });
        return;
      }
      const attr = attributes.find((a) => a.attribute_id === attrId);
      const v = attr?.values?.find((v) => v.value_id === valueId);
      setSelectedAttrs((prev) => ({
        ...prev,
        [attrId]: { valueId, value: v?.value || '' },
      }));
    };

  // 属性选择变化时自动填充 SKU 名称和编码（仅当用户未手动编辑时覆盖）
  const autoName = Object.values(selectedAttrs)
    .map((s) => s.value)
    .filter(Boolean)
    .join('-');
  const prevAutoNameRef = useRef('');
  const prevAutoCodeRef = useRef('');

  const generateSkuCode = () => {
    const productId = formRef.current?.getFieldValue?.('product_id');
    if (!productId) return '';
    const suffix = Math.random().toString(36).substring(2, 6).toUpperCase();
    const valueIds = Object.values(selectedAttrs)
      .map((s) => s.valueId)
      .join('');
    return `SKU-P${productId}${valueIds}-${suffix}`;
  };

  const allAttrsSelected =
    attributes.length > 0 &&
    Object.keys(selectedAttrs).length === attributes.length;

  useEffect(() => {
    if (autoName) {
      const currentName = formRef.current?.getFieldValue?.('name');
      if (!currentName || currentName === prevAutoNameRef.current) {
        formRef.current?.setFieldsValue?.({ name: autoName });
      }
      prevAutoNameRef.current = autoName;
    }
  }, [autoName]);

  useEffect(() => {
    if (allAttrsSelected) {
      const code = generateSkuCode();
      const currentCode = formRef.current?.getFieldValue?.('sku_code');
      if (!currentCode || currentCode === prevAutoCodeRef.current) {
        formRef.current?.setFieldsValue?.({ sku_code: code });
      }
      prevAutoCodeRef.current = code;
    } else {
      formRef.current?.setFieldsValue?.({ sku_code: undefined });
      prevAutoCodeRef.current = '';
    }
  }, [allAttrsSelected]);

  const buildSpec = () => {
    const spec: Record<string, any> = {};
    for (const attr of attributes) {
      const sel = selectedAttrs[attr.attribute_id || 0];
      if (sel) {
        spec[attr.attribute_name || ''] = sel.value;
      }
    }
    return Object.keys(spec).length > 0 ? spec : undefined;
  };

  return (
    <Modal
      title="新建 SKU"
      width={600}
      open={modalVisible}
      onCancel={() => {
        setAttributes([]);
        setSelectedAttrs({});
        onCancel();
      }}
      footer={null}
      destroyOnHidden
    >
      <ProForm<API.CreateSkuDTO & { price: number }>
        formRef={formRef}
        layout="horizontal"
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 18 }}
        style={{ width: '90%', margin: '0 auto' }}
        onReset={() => {
          setAttributes([]);
          setSelectedAttrs({});
        }}
        onFinish={async (values) => {
          const success = await onSubmit({
            ...values,
            spec: buildSpec(),
          });
          if (success) {
            setAttributes([]);
            setSelectedAttrs({});
            onCancel();
          }
        }}
        submitter={{
          render: (_, dom) => (
            <div
              style={{
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
          label="所属产品"
          showSearch
          rules={[{ required: true, message: '请选择所属产品' }]}
          options={products}
          placeholder="搜索并选择产品"
          fieldProps={{
            filterOption: (input, option) =>
              (option?.label ?? '').toLowerCase().includes(input.toLowerCase()),
            onChange: handleProductChange,
          }}
        />

        {attributes.map((attr) => (
          <ProFormSelect
            key={attr.attribute_id}
            name={`attr_${attr.attribute_id}`}
            label={attr.attribute_name}
            showSearch
            rules={[
              { required: true, message: `请选择${attr.attribute_name}` },
            ]}
            placeholder={`请选择${attr.attribute_name}`}
            options={(attr.values || []).map((v) => ({
              label: v.value || '',
              value: v.value_id || 0,
            }))}
            fieldProps={{
              filterOption: (input, option) =>
                (option?.label ?? '')
                  .toLowerCase()
                  .includes(input.toLowerCase()),
              onChange: handleAttrChange(attr.attribute_id!),
            }}
          />
        ))}

        <ProFormText
          name="name"
          label="SKU 名称"
          rules={[{ required: true, message: '请输入 SKU 名称' }]}
          placeholder="如：红色-128G"
          tooltip="选择属性后自动生成，可手动修改"
        />
        <ProFormText
          name="sku_code"
          label="SKU 编码"
          rules={[{ required: true, message: '请输入 SKU 编码' }]}
          placeholder="如：R-128G-BLACK"
        />
        <ProFormDigit
          name="price"
          label="价格（元）"
          min={0}
          rules={[{ required: true, message: '请输入价格' }]}
          fieldProps={{ precision: 2, prefix: '¥' }}
          placeholder="0.00"
        />
        <ProFormText
          name="image"
          label="图片 URL"
          placeholder="https://example.com/image.png"
        />
      </ProForm>
    </Modal>
  );
};

export default CreateForm;
