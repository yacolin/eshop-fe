import {
  ProForm,
  ProFormDigit,
  ProFormText,
  ProFormTextArea,
} from '@ant-design/pro-components';
import { Modal } from 'antd';
import React from 'react';

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

const UpdateForm: React.FC<UpdateFormProps> = (props) => {
  const { values } = props;

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
        layout="horizontal"
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 18 }}
        style={{ width: '90%', margin: '0 auto' }}
        onFinish={props.onSubmit}
        initialValues={{
          name: values.name,
          sku_code: values.sku_code,
          price: values.price,
          image: values.image,
          spec: values.spec ? JSON.stringify(values.spec) : undefined,
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
          name="name"
          label="SKU 名称"
          width="md"
          rules={[{ required: true, message: '请输入 SKU 名称' }]}
        />
        <ProFormText
          name="sku_code"
          label="SKU 编码"
          width="md"
          rules={[{ required: true, message: '请输入 SKU 编码' }]}
        />
        <ProFormDigit
          name="price"
          label="价格（元）"
          width="md"
          min={0}
          rules={[{ required: true, message: '请输入价格' }]}
          fieldProps={{ precision: 2, prefix: '¥' }}
        />
        <ProFormTextArea
          name="spec"
          label="规格 JSON"
          width="md"
          tooltip="以 JSON 格式输入规格"
          placeholder='{"color": "红色", "size": "128G"}'
        />
        <ProFormText name="image" label="图片 URL" width="md" />
      </ProForm>
    </Modal>
  );
};

export default UpdateForm;
