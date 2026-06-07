import { ProForm, ProFormDigit, ProFormText } from '@ant-design/pro-components';
import { Modal } from 'antd';
import React from 'react';

export type FormValueType = {
  quantity?: number;
  reserved?: number;
  threshold?: number;
} & Partial<API.Inventory>;

export interface UpdateFormProps {
  onCancel: () => void;
  onSubmit: (values: FormValueType) => Promise<void>;
  updateModalVisible: boolean;
  values: Partial<API.Inventory>;
}

const UpdateForm: React.FC<UpdateFormProps> = (props) => {
  const { values } = props;
  return (
    <Modal
      width={480}
      destroyOnClose
      title="编辑库存"
      open={props.updateModalVisible}
      onCancel={() => props.onCancel()}
      footer={null}
    >
      <ProForm
        onFinish={props.onSubmit}
        initialValues={{
          quantity: values.quantity,
          reserved: values.reserved,
          threshold: values.threshold,
        }}
      >
        <ProFormText
          width="md"
          name="product_id"
          label="产品 ID"
          disabled
          tooltip="产品 ID 创建后不可修改"
          initialValue={values.product_id}
        />
        <ProFormDigit
          width="md"
          name="quantity"
          label="库存数量"
          min={0}
          rules={[{ required: true, message: '请输入库存数量' }]}
          fieldProps={{ precision: 0 }}
        />
        <ProFormDigit
          width="md"
          name="reserved"
          label="已预订数量"
          min={0}
          tooltip="谨慎调整，通常由系统自动管理"
          fieldProps={{ precision: 0 }}
        />
        <ProFormDigit
          width="md"
          name="threshold"
          label="预警阈值"
          min={0}
          tooltip="低于此值时自动标记为低库存"
          fieldProps={{ precision: 0 }}
        />
      </ProForm>
    </Modal>
  );
};

export default UpdateForm;
