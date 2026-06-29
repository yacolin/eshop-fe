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
      title="新建活动"
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
          label="活动名称"
          width="md"
          rules={[{ required: true, message: '请输入活动名称' }]}
        />
        <ProFormDigit
          name="discount"
          label="折扣比例"
          width="md"
          min={0}
          max={1}
          fieldProps={{ precision: 2 }}
          tooltip="0.01~0.99"
        />
      </ProForm>
    </Modal>
  );
};

export default CreateForm;
