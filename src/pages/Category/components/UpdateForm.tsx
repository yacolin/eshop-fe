import {
  ProForm,
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
} from '@ant-design/pro-components';
import { Modal } from 'antd';
import React from 'react';

import useCategoryOptions from '../hooks/useCategoryOptions';

export type FormValueType = {
  name?: string;
  description?: string;
  parent_id?: number;
} & Partial<API.Category>;

export interface UpdateFormProps {
  onCancel: () => void;
  onSubmit: (values: FormValueType) => Promise<void>;
  updateModalVisible: boolean;
  values: Partial<API.Category>;
}

const UpdateForm: React.FC<UpdateFormProps> = (props) => {
  const { values } = props;
  const categories = useCategoryOptions(props.updateModalVisible, values.id);

  return (
    <Modal
      title="编辑分类"
      width={600}
      destroyOnClose
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
          parent_id: values.parent_id,
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
          label="分类名称"
          width="md"
          rules={[{ required: true, message: '请输入分类名称' }]}
        />
        <ProFormTextArea
          name="description"
          label="分类描述"
          width="md"
          placeholder="请输入分类描述"
        />
        <ProFormSelect
          name="parent_id"
          label="父分类"
          width="md"
          disabled
          showSearch
          options={categories}
          tooltip="父分类创建后不可修改"
        />
      </ProForm>
    </Modal>
  );
};

export default UpdateForm;
