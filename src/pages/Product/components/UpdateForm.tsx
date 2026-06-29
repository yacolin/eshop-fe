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
  subtitle?: string;
  main_image?: string;
  description?: string;
  unit?: string;
  sort_order?: number;
  status?: number;
};

export interface UpdateFormProps {
  onCancel: () => void;
  onSubmit: (values: FormValueType) => Promise<void>;
  updateModalVisible: boolean;
  values: Partial<API.SPU>;
}

const statusOptions = [
  { label: '草稿', value: 0 },
  { label: '待审', value: 1 },
  { label: '上架', value: 2 },
  { label: '下架', value: 3 },
  { label: '封禁', value: 4 },
];

const UpdateForm: React.FC<UpdateFormProps> = (props) => {
  const { values } = props;

  return (
    <Modal
      title="编辑商品"
      width={640}
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
          subtitle: values.subtitle,
          main_image: values.main_image,
          description: values.description,
          unit: values.unit,
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
          label="商品名称"
          width="md"
          rules={[{ required: true, message: '请输入商品名称' }]}
        />
        <ProFormText name="subtitle" label="副标题" width="md" />
        <ProFormText name="main_image" label="主图 URL" width="md" />
        <ProFormText name="unit" label="单位" width="md" />
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
          options={statusOptions}
        />
        <ProFormTextArea name="description" label="商品描述" width="md" />
      </ProForm>
    </Modal>
  );
};

export default UpdateForm;
