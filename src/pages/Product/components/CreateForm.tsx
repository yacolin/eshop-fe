import {
  ProForm,
  ProFormDigit,
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
} from '@ant-design/pro-components';
import { Modal } from 'antd';
import React from 'react';

import useCategoryOptions from '@/pages/Category/hooks/useCategoryOptions';

interface CreateFormProps {
  modalVisible: boolean;
  onCancel: () => void;
  onSubmit: (values: API.CreateProductDTO) => Promise<boolean>;
}

const CreateForm: React.FC<CreateFormProps> = (props) => {
  const { modalVisible, onCancel, onSubmit } = props;
  const categories = useCategoryOptions(modalVisible);

  return (
    <Modal
      title="新建商品"
      width={600}
      open={modalVisible}
      onCancel={() => onCancel()}
      footer={null}
      destroyOnHidden={true}
    >
      <ProForm<API.CreateProductDTO>
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
        <ProFormText
          name="name"
          label="商品名称"
          width="md"
          rules={[{ required: true, message: '请输入商品名称' }]}
        />
        <ProFormText
          name="sku"
          label="SKU"
          width="md"
          rules={[{ required: true, message: '请输入 SKU' }]}
        />
        <ProFormDigit
          name="price"
          label="价格（元）"
          width="md"
          min={0}
          rules={[{ required: true, message: '请输入价格' }]}
          fieldProps={{
            precision: 2,
            prefix: '¥',
          }}
        />
        <ProFormSelect
          name="category_ids"
          label="所属分类"
          width="md"
          mode="multiple"
          showSearch
          options={categories}
          placeholder="选择分类（可多选）"
          fieldProps={{
            filterOption: (input, option) =>
              (option?.label ?? '').toLowerCase().includes(input.toLowerCase()),
          }}
        />
        <ProFormTextArea
          name="description"
          label="商品描述"
          width="md"
          placeholder="请输入商品描述"
        />
      </ProForm>
    </Modal>
  );
};

export default CreateForm;
