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
  name?: string;
  english_name?: string;
  first_letter?: string;
  logo_url?: string;
  description?: string;
  sort_order?: number;
  status?: number;
};

export interface UpdateFormProps {
  onCancel: () => void;
  onSubmit: (values: FormValueType) => Promise<void>;
  updateModalVisible: boolean;
  values: Partial<API.Brand>;
}

const UpdateForm: React.FC<UpdateFormProps> = (props) => {
  const { values } = props;

  return (
    <Modal
      title="编辑品牌"
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
          english_name: values.english_name,
          first_letter: values.first_letter,
          logo_url: values.logo_url,
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
          name="name"
          label="品牌名称"
          width="md"
          rules={[{ required: true, message: '请输入品牌名称' }]}
        />
        <ProFormText name="english_name" label="英文名" width="md" />
        <ProFormText
          name="first_letter"
          label="首字母"
          width="md"
          maxLength={1}
        />
        <ProFormText
          name="logo_url"
          label="Logo 地址"
          width="md"
          tooltip="品牌 Logo 图片 URL"
        />
        <ProFormDigit
          name="sort_order"
          label="排序"
          width="md"
          min={0}
          fieldProps={{ precision: 0 }}
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
