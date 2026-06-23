import { ProForm, ProFormDigit, ProFormText } from '@ant-design/pro-components';
import { Modal } from 'antd';
import React from 'react';

export type FormValueType = {
  id?: number;
  name?: string;
  sort_order?: number;
} & Partial<API.AttributeResponse>;

export interface UpdateFormProps {
  onCancel: () => void;
  onSubmit: (values: FormValueType) => Promise<void>;
  updateModalVisible: boolean;
  values: Partial<API.AttributeResponse>;
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
          sort_order: values.sort_order,
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
          placeholder="例如：颜色、尺寸"
        />
        <ProFormDigit
          name="sort_order"
          label="排序"
          width="md"
          placeholder="数字越小越靠前"
          fieldProps={{ precision: 0 }}
        />
      </ProForm>
    </Modal>
  );
};

export default UpdateForm;
