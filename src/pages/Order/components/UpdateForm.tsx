import {
  ProForm,
  ProFormSelect,
  ProFormText,
} from '@ant-design/pro-components';
import { Modal } from 'antd';
import React from 'react';

import { ORDER_STATUS_MAP } from '@/constants';

export type FormValueType = {
  id?: number;
  order_no?: string;
  status?: string;
  customer_id?: string;
  total_amount?: number;
};

export interface UpdateFormProps {
  onCancel: () => void;
  onSubmit: (values: FormValueType) => Promise<void>;
  updateModalVisible: boolean;
  values: FormValueType;
}

const orderStatusOptions = Object.entries(ORDER_STATUS_MAP).map(
  ([key, val]) => ({
    label: val.text,
    value: key,
  }),
);

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
        style={{ width: '90%', margin: '0 auto', paddingTop: 24 }}
        onFinish={props.onSubmit}
        initialValues={{
          order_no: values.order_no,
          customer_id: values.customer_id,
          total_amount:
            values.total_amount !== undefined && values.total_amount !== null
              ? (values.total_amount / 100).toFixed(2)
              : '-',
          status: values.status,
        }}
        submitter={{
          render: (_, dom) => (
            <div
              style={{
                width: '100%',
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
        <ProFormText name="order_no" label="订单号" width="md" disabled />
        <ProFormText name="customer_id" label="客户ID" width="md" disabled />
        <ProFormText
          name="total_amount"
          label="总金额"
          width="md"
          disabled
          fieldProps={{ prefix: '¥' }}
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
