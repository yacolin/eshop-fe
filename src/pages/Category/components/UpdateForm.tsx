import {
  ProForm,
  ProFormText,
  ProFormTextArea,
} from '@ant-design/pro-components';
import { Modal } from 'antd';
import React from 'react';

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
  return (
    <Modal
      width={480}
      destroyOnClose
      title="编辑分类"
      open={props.updateModalVisible}
      onCancel={() => props.onCancel()}
      footer={null}
    >
      <ProForm
        onFinish={props.onSubmit}
        initialValues={{
          name: values.name,
          description: values.description,
        }}
      >
        <ProFormText
          width="md"
          name="name"
          label="分类名称"
          rules={[{ required: true, message: '请输入分类名称' }]}
        />
        <ProFormTextArea
          width="lg"
          name="description"
          label="分类描述"
          placeholder="请输入分类描述"
        />
      </ProForm>
    </Modal>
  );
};

export default UpdateForm;
