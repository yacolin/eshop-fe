import {
  ProForm,
  ProFormDigit,
  ProFormRadio,
  ProFormText,
  ProFormTextArea,
} from '@ant-design/pro-components';
import { Modal } from 'antd';
import React from 'react';

export type FormValueType = {
  id?: number;
  name?: string;
  input_type?: 1 | 2 | 3 | 4;
  is_sku_spec?: 0 | 1;
  required?: 0 | 1;
  searchable?: 0 | 1;
  sort_order?: number;
  status?: 0 | 1;
  unit?: string;
  values?: string;
};

export interface UpdateFormProps {
  onCancel: () => void;
  onSubmit: (values: FormValueType) => Promise<void>;
  updateModalVisible: boolean;
  values: Partial<API.Attribute>;
}

const UpdateForm: React.FC<UpdateFormProps> = (props) => {
  const { values } = props;

  return (
    <Modal
      title="编辑属性"
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
          input_type: values.input_type,
          required: values.required,
          searchable: values.searchable,
          is_sku_spec: values.is_sku_spec,
          sort_order: values.sort_order,
          status: values.status,
          unit: values.unit,
          values: values.values,
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
          label="属性名称"
          width="md"
          rules={[{ required: true, message: '请输入属性名称' }]}
        />
        <ProFormRadio.Group
          name="input_type"
          label="输入类型"
          width="md"
          options={[
            { label: '文本', value: 1 },
            { label: '单选', value: 2 },
            { label: '多选', value: 3 },
            { label: '数字', value: 4 },
          ]}
        />
        <ProFormRadio.Group
          name="required"
          label="是否必填"
          width="md"
          options={[
            { label: '否', value: 0 },
            { label: '是', value: 1 },
          ]}
        />
        <ProFormRadio.Group
          name="searchable"
          label="是否可搜索"
          width="md"
          options={[
            { label: '否', value: 0 },
            { label: '是', value: 1 },
          ]}
        />
        <ProFormRadio.Group
          name="is_sku_spec"
          label="SKU规格"
          width="md"
          options={[
            { label: '否', value: 0 },
            { label: '是', value: 1 },
          ]}
        />
        <ProFormRadio.Group
          name="status"
          label="状态"
          width="md"
          options={[
            { label: '启用', value: 1 },
            { label: '禁用', value: 0 },
          ]}
        />
        <ProFormText name="unit" label="单位" width="md" />
        <ProFormTextArea
          name="values"
          label="可选值"
          width="md"
          placeholder='JSON 数组格式如 ["红","蓝"]'
        />
        <ProFormDigit
          name="sort_order"
          label="排序"
          width="md"
          min={0}
          fieldProps={{ precision: 0 }}
        />
      </ProForm>
    </Modal>
  );
};

export default UpdateForm;
