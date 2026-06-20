import {
  ProForm,
  ProFormDigit,
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
} from '@ant-design/pro-components';
import { Modal } from 'antd';
import React from 'react';

export type FormValueType = {
  id?: number;
  display_name?: string;
  description?: string;
  sort?: number;
  status?: number;
};

export interface UpdateFormProps {
  onCancel: () => void;
  onSubmit: (values: FormValueType) => Promise<void>;
  updateModalVisible: boolean;
  values: Partial<API.Role>;
}

const UpdateForm: React.FC<UpdateFormProps> = (props) => {
  const { values } = props;

  return (
    <Modal
      title="编辑角色"
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
          display_name: values.display_name,
          description: values.description,
          sort: values.sort,
          status: values.status,
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
          label="角色名称"
          width="md"
          initialValue={values.name}
          disabled
        />
        <ProFormText
          name="display_name"
          label="显示名称"
          width="md"
          rules={[{ required: true, message: '请输入显示名称' }]}
        />
        <ProFormDigit
          name="sort"
          label="排序"
          width="md"
          fieldProps={{ min: 0 }}
        />
        <ProFormSelect
          name="status"
          label="状态"
          width="md"
          options={[
            { label: '启用', value: 1 },
            { label: '禁用', value: 2 },
          ]}
        />
        <ProFormTextArea name="description" label="描述" width="md" />
      </ProForm>
    </Modal>
  );
};

export default UpdateForm;
