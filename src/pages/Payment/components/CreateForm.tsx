import {
  ProForm,
  ProFormDigit,
  ProFormSelect,
  ProFormText,
} from '@ant-design/pro-components';
import { Modal } from 'antd';
import React from 'react';

interface CreateFormProps {
  modalVisible: boolean;
  onCancel: () => void;
  onSubmit: (values: API.CreatePaymentRequest) => Promise<boolean>;
}

const CreateForm: React.FC<CreateFormProps> = (props) => {
  const { modalVisible, onCancel, onSubmit } = props;

  return (
    <Modal
      title="新建支付"
      width={600}
      open={modalVisible}
      onCancel={() => onCancel()}
      footer={null}
    >
      <ProForm<API.CreatePaymentRequest>
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
        <ProFormSelect
          name="payment_method"
          label="支付方式"
          width="md"
          rules={[{ required: true, message: '请选择支付方式' }]}
          valueEnum={{
            alipay: '支付宝',
            wechat: '微信支付',
            card: '银行卡',
          }}
          initialValue="alipay"
        />
        <ProFormDigit
          name="amount"
          label="金额（元）"
          width="md"
          rules={[{ required: true, message: '请输入金额' }]}
          min={0.01}
          fieldProps={{
            precision: 2,
            onChange: undefined,
          }}
        />
        <ProFormSelect
          name="currency"
          label="币种"
          width="md"
          rules={[{ required: true, message: '请选择币种' }]}
          valueEnum={{
            CNY: '人民币',
            USD: '美元',
          }}
          initialValue="CNY"
        />
        <ProFormText name="callback_url" label="回调地址" width="md" />
        <ProFormText name="return_url" label="返回地址" width="md" />
        <ProFormText name="metadata" label="附加信息" width="md" />
      </ProForm>
    </Modal>
  );
};

export default CreateForm;
