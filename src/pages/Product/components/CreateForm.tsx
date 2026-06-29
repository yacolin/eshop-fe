import {
  ProForm,
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
} from '@ant-design/pro-components';
import { Modal } from 'antd';
import React from 'react';

import useNonRootCategoryOptions from '@/pages/Category/hooks/useNonRootCategoryOptions';

interface CreateFormProps {
  modalVisible: boolean;
  onCancel: () => void;
  onSubmit: (values: API.CreateSPUReq) => Promise<boolean>;
}

const CreateForm: React.FC<CreateFormProps> = (props) => {
  const { modalVisible, onCancel, onSubmit } = props;
  const categories = useNonRootCategoryOptions(modalVisible);

  return (
    <Modal
      title="新建商品"
      width={600}
      open={modalVisible}
      onCancel={() => onCancel()}
      footer={null}
      destroyOnHidden
    >
      <ProForm<{ name: string; category_id: number; description?: string }>
        layout="horizontal"
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 18 }}
        style={{ width: '90%', margin: '0 auto' }}
        onFinish={async (values) => {
          const success = await onSubmit({
            name: values.name,
            category_id: values.category_id,
            description: values.description,
            skus: [],
          } as API.CreateSPUReq);
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
        <ProFormSelect
          name="category_id"
          label="所属分类"
          width="md"
          showSearch
          options={categories}
          placeholder="选择分类"
          rules={[{ required: true, message: '请选择分类' }]}
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
