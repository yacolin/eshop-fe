import { ProForm, ProFormDigit } from '@ant-design/pro-components';
import { message, Modal } from 'antd';
import React from 'react';

import { postCartsItems } from '@/services/api/carts';

interface CreateFormProps {
  modalVisible: boolean;
  onCancel: () => void;
  onSubmit: () => Promise<boolean>;
  userId?: number;
}

const CreateForm: React.FC<CreateFormProps> = (props) => {
  const { modalVisible, onCancel, onSubmit, userId } = props;

  return (
    <Modal
      title="添加商品到购物车"
      width={600}
      open={modalVisible}
      onCancel={() => onCancel()}
      footer={null}
      destroyOnHidden
    >
      <ProForm<{ sku_id: number; quantity: number }>
        layout="horizontal"
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 18 }}
        style={{ width: '90%', margin: '0 auto' }}
        onFinish={async (values) => {
          const hide = message.loading('正在添加');
          try {
            await postCartsItems(
              { user_id: userId },
              {
                sku_id: values.sku_id,
                quantity: values.quantity,
              },
            );
            hide();
            message.success('添加成功');
            onSubmit();
            return true;
          } catch {
            hide();
            message.error('添加失败，请重试');
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
        <ProFormDigit
          name="sku_id"
          label="商品"
          width="md"
          rules={[{ required: true, message: '请输入商品sku_id' }]}
          min={1}
          fieldProps={{ precision: 0 }}
        />
        <ProFormDigit
          name="quantity"
          label="数量"
          width="md"
          rules={[{ required: true, message: '请输入数量' }]}
          min={1}
          initialValue={1}
          fieldProps={{ precision: 0 }}
        />
      </ProForm>
    </Modal>
  );
};

export default CreateForm;
