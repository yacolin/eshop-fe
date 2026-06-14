import {
  ProForm,
  ProFormSelect,
  ProFormText,
} from '@ant-design/pro-components';
import { Modal } from 'antd';
import React from 'react';

interface CreateFormProps {
  modalVisible: boolean;
  onCancel: () => void;
  onSubmit: (values: API.CreateOrderDTO) => Promise<boolean>;
}

const CreateForm: React.FC<CreateFormProps> = (props) => {
  const { modalVisible, onCancel, onSubmit } = props;

  return (
    <Modal
      title="新建订单"
      width={600}
      open={modalVisible}
      onCancel={() => onCancel()}
      footer={null}
      destroyOnHidden={true}
    >
      <ProForm<API.CreateOrderDTO>
        layout="horizontal"
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 18 }}
        style={{ width: '90%', margin: '0 auto' }}
        onFinish={async (values) => {
          const success = await onSubmit(values);
          if (success) {
            onCancel();
          }
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
          name="customer_id"
          label="客户ID"
          width="md"
          rules={[{ required: true, message: '请输入客户ID' }]}
        />
        <ProFormSelect
          name="currency"
          label="币种"
          width="md"
          initialValue="CNY"
          options={[
            { label: '人民币 (CNY)', value: 'CNY' },
            { label: '美元 (USD)', value: 'USD' },
            { label: '欧元 (EUR)', value: 'EUR' },
          ]}
        />
      </ProForm>
    </Modal>
  );
};

export default CreateForm;
