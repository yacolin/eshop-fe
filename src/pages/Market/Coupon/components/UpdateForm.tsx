import { ProForm, ProFormDigit, ProFormText } from '@ant-design/pro-components';
import { Modal } from 'antd';
import React from 'react';

export type FormValueType = Record<string, any>;

export interface UpdateFormProps {
  onCancel: () => void;
  onSubmit: (values: FormValueType) => Promise<void>;
  updateModalVisible: boolean;
  values: any;
}

const UpdateForm: React.FC<UpdateFormProps> = (props) => {
  const { values } = props;

  return (
    <Modal
      title="编辑优惠券"
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
          value: values.value,
          min_amount: values.min_amount,
          stock: values.stock,
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
          label="优惠券名称"
          width="md"
          rules={[{ required: true, message: '请输入名称' }]}
        />
        <ProFormDigit
          name="value"
          label="面值"
          width="md"
          min={0}
          fieldProps={{ precision: 2, prefix: '¥' }}
        />
        <ProFormDigit
          name="min_amount"
          label="满减门槛"
          width="md"
          min={0}
          fieldProps={{ precision: 2, prefix: '¥' }}
        />
        <ProFormDigit
          name="stock"
          label="库存"
          width="md"
          min={0}
          fieldProps={{ precision: 0 }}
        />
      </ProForm>
    </Modal>
  );
};

export default UpdateForm;
