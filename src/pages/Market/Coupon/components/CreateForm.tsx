import { ProForm, ProFormDigit, ProFormText } from '@ant-design/pro-components';
import { Modal } from 'antd';
import React from 'react';

interface CreateFormProps {
  modalVisible: boolean;
  onCancel: () => void;
  onSubmit: (values: any) => Promise<boolean>;
}

const CreateForm: React.FC<CreateFormProps> = (props) => {
  const { modalVisible, onCancel, onSubmit } = props;

  return (
    <Modal
      title="新建优惠券"
      width={600}
      open={modalVisible}
      onCancel={() => onCancel()}
      footer={null}
    >
      <ProForm
        layout="horizontal"
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 18 }}
        style={{ width: '90%', margin: '0 auto' }}
        onFinish={async (values) => {
          const ok = await onSubmit(values);
          if (ok) onCancel();
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
          rules={[{ required: true, message: '请输入面值' }]}
        />
        <ProFormDigit
          name="min_amount"
          label="满减门槛"
          width="md"
          min={0}
          fieldProps={{ precision: 2, prefix: '¥' }}
          initialValue={0}
        />
        <ProFormDigit
          name="stock"
          label="库存"
          width="md"
          min={0}
          fieldProps={{ precision: 0 }}
          initialValue={100}
        />
      </ProForm>
    </Modal>
  );
};

export default CreateForm;
