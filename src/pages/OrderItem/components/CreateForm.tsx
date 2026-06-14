import { ProForm, ProFormDigit, ProFormText } from '@ant-design/pro-components';
import { Modal, message } from 'antd';
import React from 'react';

import { postOrders } from '@/services/api/orders';

interface CreateFormProps {
  modalVisible: boolean;
  onCancel: () => void;
  onSubmit: (values: any) => Promise<boolean>;
}

const CreateForm: React.FC<CreateFormProps> = (props) => {
  const { modalVisible, onCancel, onSubmit } = props;

  return (
    <Modal
      title="新建订单项"
      width={600}
      open={modalVisible}
      onCancel={() => onCancel()}
      footer={null}
      destroyOnHidden={true}
    >
      <ProForm<{
        customer_id: string;
        product_id: string;
        quantity: number;
        unit_price: number;
      }>
        layout="horizontal"
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 18 }}
        style={{ width: '90%', margin: '0 auto' }}
        onFinish={async (values) => {
          const hide = message.loading('正在创建');
          try {
            await postOrders({
              customer_id: values.customer_id,
              items: [
                {
                  product_id: values.product_id,
                  quantity: values.quantity,
                  unit_price: Math.round(values.unit_price * 100),
                },
              ],
            });
            hide();
            message.success('创建成功');
            onSubmit(values);
            return true;
          } catch {
            hide();
            message.error('创建失败，请重试');
            return false;
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
        <ProFormText
          name="product_id"
          label="商品ID"
          width="md"
          rules={[{ required: true, message: '请输入商品ID' }]}
        />
        <ProFormDigit
          name="quantity"
          label="数量"
          width="md"
          min={1}
          initialValue={1}
          rules={[{ required: true, message: '请输入数量' }]}
        />
        <ProFormDigit
          name="unit_price"
          label="单价（元）"
          width="md"
          min={0}
          rules={[{ required: true, message: '请输入单价' }]}
          fieldProps={{
            precision: 2,
            prefix: '¥',
          }}
        />
      </ProForm>
    </Modal>
  );
};

export default CreateForm;
