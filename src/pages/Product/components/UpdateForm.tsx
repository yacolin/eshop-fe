import {
  ProForm,
  ProFormDigit,
  ProFormText,
  ProFormTextArea,
} from '@ant-design/pro-components';
import { Modal } from 'antd';
import React from 'react';

export type FormValueType = {
  name?: string;
  price?: number;
  description?: string;
  category_ids?: number[];
} & Partial<API.Product>;

export interface UpdateFormProps {
  onCancel: () => void;
  onSubmit: (values: FormValueType) => Promise<void>;
  updateModalVisible: boolean;
  values: Partial<API.Product>;
}

const UpdateForm: React.FC<UpdateFormProps> = (props) => {
  const { values } = props;
  return (
    <Modal
      width={480}
      destroyOnClose
      title="编辑商品"
      open={props.updateModalVisible}
      onCancel={() => props.onCancel()}
      footer={null}
    >
      <ProForm
        onFinish={props.onSubmit}
        initialValues={{
          name: values.name,
          sku: values.sku,
          price: values.price ? values.price / 100 : undefined,
          description: values.description,
        }}
      >
        <ProFormText
          width="md"
          name="name"
          label="商品名称"
          rules={[{ required: true, message: '请输入商品名称' }]}
        />
        <ProFormText
          width="md"
          name="sku"
          label="SKU"
          disabled
          tooltip="SKU 创建后不可修改"
        />
        <ProFormDigit
          width="md"
          name="price"
          label="价格（元）"
          min={0}
          rules={[{ required: true, message: '请输入价格' }]}
          fieldProps={{
            precision: 2,
            prefix: '¥',
          }}
        />
        <ProFormTextArea
          width="lg"
          name="description"
          label="商品描述"
          placeholder="请输入商品描述"
        />
      </ProForm>
    </Modal>
  );
};

export default UpdateForm;
