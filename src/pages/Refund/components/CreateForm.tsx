import {
  ProForm,
  ProFormDigit,
  ProFormTextArea,
} from '@ant-design/pro-components';
import { Modal } from 'antd';
import React from 'react';

interface CreateFormProps {
  modalVisible: boolean;
  onCancel: () => void;
  onSubmit: (values: API.CreateRefundRequest) => Promise<boolean>;
}

const CreateForm: React.FC<CreateFormProps> = (props) => {
  const { modalVisible, onCancel, onSubmit } = props;

  return (
    <Modal
      title="新建退款"
      width={600}
      open={modalVisible}
      onCancel={() => onCancel()}
      footer={null}
    >
      <ProForm<API.CreateRefundRequest>
        layout="horizontal"
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 18 }}
        style={{ width: '90%', margin: '0 auto' }}
        onFinish={async (values) => {
          const success = await onSubmit(values);
          if (success) onCancel();
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
        <ProFormDigit
          name="order_id"
          label="订单ID"
          width="md"
          rules={[{ required: true, message: '请输入订单ID' }]}
          min={1}
          fieldProps={{ precision: 0 }}
        />
        <ProFormDigit
          name="payment_id"
          label="支付ID"
          width="md"
          rules={[{ required: true, message: '请输入支付ID' }]}
          min={1}
          fieldProps={{ precision: 0 }}
        />
        <ProFormDigit
          name="refund_amount"
          label="退款金额（元）"
          width="md"
          rules={[{ required: true, message: '请输入退款金额' }]}
          min={0.01}
          fieldProps={{ precision: 2 }}
        />
        <ProFormTextArea
          name="refund_reason"
          label="退款原因"
          width="md"
          rules={[{ required: true, message: '请输入退款原因' }]}
        />
      </ProForm>
    </Modal>
  );
};

export default CreateForm;
