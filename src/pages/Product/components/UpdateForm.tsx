import {
  ProForm,
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
} from '@ant-design/pro-components';
import { Modal } from 'antd';
import React from 'react';

import useNonRootCategoryOptions from '@/pages/Category/hooks/useNonRootCategoryOptions';

export type FormValueType = {
  name?: string;
  description?: string;
  category_ids?: number[];
  id?: number;
};

export interface UpdateFormProps {
  onCancel: () => void;
  onSubmit: (values: FormValueType) => Promise<void>;
  updateModalVisible: boolean;
  values: FormValueType;
}

const UpdateForm: React.FC<UpdateFormProps> = (props) => {
  const { values } = props;
  const categories = useNonRootCategoryOptions(props.updateModalVisible);

  return (
    <Modal
      title="编辑商品"
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
        onFinish={props.onSubmit}
        initialValues={{
          name: values.name,
          description: values.description,
          category_ids: values.category_ids,
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

export default UpdateForm;
