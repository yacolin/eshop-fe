import {
  ProForm,
  ProFormDigit,
  ProFormSelect,
  ProFormText,
} from '@ant-design/pro-components';
import { Modal } from 'antd';
import React from 'react';

export type FormValueType = {
  price?: number;
  cost_price?: number;
  market_price?: number;
  barcode?: string;
  image?: string;
  status?: 0 | 1;
  weight?: number;
  volume?: number;
  length?: number;
  width?: number;
  height?: number;
};

export interface UpdateFormProps {
  onCancel: () => void;
  onSubmit: (values: FormValueType) => Promise<void>;
  updateModalVisible: boolean;
  values: Partial<API.SKU>;
}

/**
 * 格式化价格显示：分 → 元
 */
const formatPrice = (price?: number) => {
  if (price === undefined || price === null) return undefined;
  return price / 100;
};

/**
 * 转换价格：元 → 分
 */
const toCents = (value?: number) => {
  if (value === undefined || value === null) return undefined;
  return Math.round(value * 100);
};

const UpdateForm: React.FC<UpdateFormProps> = (props) => {
  const { values } = props;

  return (
    <Modal
      title="编辑 SKU"
      width={600}
      destroyOnHidden
      open={props.updateModalVisible}
      onCancel={() => props.onCancel()}
      footer={null}
    >
      <ProForm
        layout="horizontal"
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 18 }}
        style={{ width: '90%', margin: '0 auto' }}
        onFinish={async (formValues) => {
          await props.onSubmit({
            ...formValues,
            price: toCents(formValues.price),
            cost_price: toCents(formValues.cost_price),
            market_price: toCents(formValues.market_price),
          });
        }}
        initialValues={{
          price: formatPrice(values.price),
          cost_price: formatPrice(values.cost_price),
          market_price: formatPrice(values.market_price),
          barcode: values.barcode,
          image: values.image,
          status: values.status,
          weight: values.weight,
          length: values.length,
          width: values.width,
          height: values.height,
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
        <ProFormText
          name="sku_code"
          label="SKU 编码"
          width="md"
          disabled
          initialValue={values.sku_code}
          tooltip="SKU 编码不可修改"
        />
        <ProFormDigit
          name="price"
          label="售价（元）"
          width="md"
          min={0}
          fieldProps={{ precision: 2, prefix: '¥' }}
        />
        <ProFormDigit
          name="cost_price"
          label="成本价（元）"
          width="md"
          min={0}
          fieldProps={{ precision: 2, prefix: '¥' }}
        />
        <ProFormDigit
          name="market_price"
          label="市场价（元）"
          width="md"
          min={0}
          fieldProps={{ precision: 2, prefix: '¥' }}
        />
        <ProFormText name="barcode" label="条码" width="md" />
        <ProFormText name="image" label="图片 URL" width="md" />
        <ProFormSelect
          name="status"
          label="状态"
          width="md"
          options={[
            { label: '启用', value: 1 },
            { label: '禁用', value: 0 },
          ]}
        />
        <ProFormDigit
          name="weight"
          label="重量（g）"
          width="md"
          min={0}
          fieldProps={{ precision: 2 }}
        />
        <ProFormDigit
          name="length"
          label="长（mm）"
          width="md"
          min={0}
          fieldProps={{ precision: 1 }}
        />
        <ProFormDigit
          name="width"
          label="宽（mm）"
          width="md"
          min={0}
          fieldProps={{ precision: 1 }}
        />
        <ProFormDigit
          name="height"
          label="高（mm）"
          width="md"
          min={0}
          fieldProps={{ precision: 1 }}
        />
      </ProForm>
    </Modal>
  );
};

export default UpdateForm;
