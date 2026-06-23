import {
  ProForm,
  ProFormDigit,
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
} from '@ant-design/pro-components';
import { Modal } from 'antd';
import React from 'react';

import useProductOptions from '../hooks/useProductOptions';

interface CreateFormProps {
  modalVisible: boolean;
  onCancel: () => void;
  onSubmit: (values: API.CreateSkuDTO & { price: number }) => Promise<boolean>;
}

const CreateForm: React.FC<CreateFormProps> = (props) => {
  const { modalVisible, onCancel, onSubmit } = props;
  const products = useProductOptions(modalVisible);

  return (
    <Modal
      title="新建 SKU"
      width={600}
      open={modalVisible}
      onCancel={() => onCancel()}
      footer={null}
    >
      <ProForm<API.CreateSkuDTO & { price: number }>
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
          label="所属产品"
          width="md"
          showSearch
          rules={[{ required: true, message: '请选择所属产品' }]}
          options={products}
          placeholder="搜索并选择产品"
          fieldProps={{
            filterOption: (input, option) =>
              (option?.label ?? '').toLowerCase().includes(input.toLowerCase()),
          }}
        />
        <ProFormText
          name="name"
          label="SKU 名称"
          width="md"
          rules={[{ required: true, message: '请输入 SKU 名称' }]}
          placeholder="如：红色 / 128G"
        />
        <ProFormText
          name="sku_code"
          label="SKU 编码"
          width="md"
          rules={[{ required: true, message: '请输入 SKU 编码' }]}
          placeholder="如：R-128G-BLACK"
        />
        <ProFormDigit
          name="price"
          label="价格（元）"
          width="md"
          min={0}
          rules={[{ required: true, message: '请输入价格' }]}
          fieldProps={{ precision: 2, prefix: '¥' }}
          placeholder="0.00"
        />
        <ProFormTextArea
          name="spec"
          label="规格 JSON"
          width="md"
          tooltip={
            '可选，以 JSON 格式输入规格，如 {"color": "红色", "size": "128G"}'
          }
          placeholder='{"color": "红色", "size": "128G"}'
        />
        <ProFormText
          name="image"
          label="图片 URL"
          width="md"
          placeholder="https://example.com/image.png"
        />
      </ProForm>
    </Modal>
  );
};

export default CreateForm;
