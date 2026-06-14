import {
  ProForm,
  ProFormSelect,
  ProFormText,
} from '@ant-design/pro-components';
import { Modal } from 'antd';
import React from 'react';

export type FormValueType = {
  id?: number;
  status?: string;
  customer_id?: string;
};

export interface UpdateFormProps {
  onCancel: () => void;
  onSubmit: (values: FormValueType) => Promise<void>;
  updateModalVisible: boolean;
  values: FormValueType;
}

const orderStatusOptions = [
  { label: '待处理', value: 'pending' },
  { label: '已确认', value: 'confirmed' },
  { label: '处理中', value: 'processing' },
  { label: '已发货', value: 'shipped' },
  { label: '已送达', value: 'delivered' },
  { label: '已取消', value: 'cancelled' },
  { label: '已退款', value: 'refunded' },
];

const UpdateForm: React.FC<UpdateFormProps> = (props) => {
  const { values } = props;

  return (
    <Modal
      title="编辑订单"
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
          status: values.status,
          customer_id: values.customer_id,
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
          disabled
          tooltip="客户ID不可修改"
        />
        <ProFormSelect
          name="status"
          label="订单状态"
          width="md"
          options={orderStatusOptions}
          rules={[{ required: true, message: '请选择订单状态' }]}
        />
      </ProForm>
    </Modal>
  );
};

export default UpdateForm;
