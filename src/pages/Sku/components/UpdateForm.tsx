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

export type FormValueType = {
  id?: number;
  name?: string;
  sku_code?: string;
  price?: number;
  image?: string;
  spec?: Record<string, any>;
};

export interface UpdateFormProps {
  onCancel: () => void;
  onSubmit: (values: FormValueType) => Promise<void>;
  updateModalVisible: boolean;
  values: Partial<API.SkuResponse & { price?: number }>;
}

const specToSelected = (
  spec: Record<string, any> | undefined,
  attributes: API.ProductAttributeItem[],
) => {
  if (!spec) return {};
  const result: Record<number, { valueId: number; value: string }> = {};
  for (const attr of attributes) {
    const val = spec[attr.attribute_name || ''];
    if (!val) continue;
    const valueItem = (attr.values || []).find((v) => v.value === val);
    if (valueItem?.value_id) {
      result[attr.attribute_id || 0] = {
        valueId: valueItem.value_id,
        value: val,
      };
    }
  }
  return result;
};

const UpdateForm: React.FC<UpdateFormProps> = (props) => {
  const { values } = props;
  const formRef = useRef<any>(null);
  const products = useProductOptions(props.updateModalVisible);
  const [attributes, setAttributes] = useState<API.ProductAttributeItem[]>([]);
  const [selectedAttrs, setSelectedAttrs] = useState<
    Record<number, { valueId: number; value: string }>
  >({});

  const productId = values.product_id;

  useEffect(() => {
    if (!props.updateModalVisible || !productId) return;
    const fetchAttrs = async () => {
      try {
        const res = await getProductsIdAttributes({ id: productId });
        const attrs: API.ProductAttributeItem[] = (res as any).data || [];
        setAttributes(attrs);
        const selected = specToSelected(values.spec, attrs);
        setSelectedAttrs(selected);

        // 回填属性 Select 的值
        const formValues: Record<string, any> = {};
        for (const attr of attrs) {
          const sel = selected[attr.attribute_id || 0];
          if (sel) {
            formValues[`attr_${attr.attribute_id}`] = sel.valueId;
          }
        }
        formRef.current?.setFieldsValue(formValues);
      } catch {
        setAttributes([]);
      }
    };
    fetchAttrs();
  }, [props.updateModalVisible, productId]);

  const autoName = Object.values(selectedAttrs)
    .map((s) => s.value)
    .filter(Boolean)
    .join('-');
  const prevAutoNameRef = useRef('');
  const prevAutoCodeRef = useRef('');

  const generateSkuCode = () => {
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
      width={600}
      destroyOnHidden
      title="编辑 SKU"
      open={props.updateModalVisible}
      onCancel={() => props.onCancel()}
      footer={null}
    >
      <ProForm
        formRef={formRef}
        layout="horizontal"
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 18 }}
        style={{ width: '90%', margin: '0 auto' }}
        onFinish={async (formValues) => {
          await props.onSubmit({
            ...formValues,
            spec: buildSpec(),
          });
        }}
        initialValues={{
          product_id: productId,
          name: values.name,
          sku_code: values.sku_code,
          price: values.price,
          image: values.image,
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
          disabled
          options={products}
          placeholder="搜索并选择产品"
          fieldProps={{
            filterOption: (input, option) =>
              (option?.label ?? '').toLowerCase().includes(input.toLowerCase()),
          }}
        />

        {attributes.map((attr) => (
          <ProFormSelect
            key={attr.attribute_id}
            name={`attr_${attr.attribute_id}`}
            label={attr.attribute_name}
            showSearch
            disabled
            options={(attr.values || []).map((v) => ({
              label: v.value || '',
              value: v.value_id || 0,
            }))}
            fieldProps={{
              filterOption: (input, option) =>
                (option?.label ?? '')
                  .toLowerCase()
                  .includes(input.toLowerCase()),
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
          disabled
          tooltip="SKU 编码创建设定后不可修改"
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

export default UpdateForm;
