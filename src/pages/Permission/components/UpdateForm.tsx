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
  display_name?: string;
  category?: string;
  description?: string;
  sort_order?: number;
  status?: number;
} & Partial<API.Permission>;

export interface UpdateFormProps {
  onCancel: () => void;
  onSubmit: (values: FormValueType) => Promise<void>;
  updateModalVisible: boolean;
  values: Partial<API.Permission>;
}

const UpdateForm: React.FC<UpdateFormProps> = (props) => {
  const { values } = props;

  return (
    <Modal
      title="编辑权限"
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
          category: values.category,
          description: values.description,
          sort_order: values.sort_order,
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
          name="display_name"
          label="显示名称"
          width="md"
          rules={[{ required: true, message: '请输入显示名称' }]}
        />
        <ProFormSelect
          name="category"
          label="分类"
          width="md"
          options={[
            { label: '业务', value: 'business' },
            { label: '系统', value: 'system' },
            { label: '管理', value: 'admin' },
          ]}
        />
        <ProFormDigit
          name="sort_order"
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
            { label: '禁用', value: 0 },
          ]}
        />
        <ProFormTextArea name="description" label="描述" width="md" />
      </ProForm>
    </Modal>
  );
};

export default UpdateForm;
