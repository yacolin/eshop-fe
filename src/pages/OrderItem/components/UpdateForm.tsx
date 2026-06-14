import { ProForm, ProFormDigit } from '@ant-design/pro-components';
import { Modal, message } from 'antd';
import React from 'react';

import { putOrdersId } from '@/services/api/orders';

export type FormValueType = {
  id?: number;
  order_id?: number;
  quantity?: number;
  unit_price?: number;
};

export interface UpdateFormProps {
  onCancel: () => void;
  onSubmit: (values: FormValueType) => Promise<void>;
  updateModalVisible: boolean;
  values: FormValueType;
}

const UpdateForm: React.FC<UpdateFormProps> = (props) => {
  const { values } = props;

  return (
    <Modal
      title="编辑订单项"
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
        onFinish={async (formValues) => {
          const hide = message.loading('正在更新');
          try {
            await putOrdersId(
              { id: values.order_id || 0 },
              {
                quantity: formValues.quantity,
                product_id: values.id,
              },
            );
            hide();
            message.success('更新成功');
            props.onSubmit({ ...formValues, id: values.id });
          } catch {
            hide();
            message.error('更新失败，请重试');
          }
        }}
        initialValues={{
          quantity: values.quantity,
          unit_price: values.unit_price ? values.unit_price / 100 : undefined,
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
          name="quantity"
          label="数量"
          width="md"
          min={1}
          rules={[{ required: true, message: '请输入数量' }]}
        />
      </ProForm>
    </Modal>
  );
};

export default UpdateForm;
