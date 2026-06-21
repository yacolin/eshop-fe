import {
  ProForm,
  ProFormDateTimePicker,
  ProFormDigit,
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
} from '@ant-design/pro-components';
import { Modal } from 'antd';
import dayjs from 'dayjs';
import React from 'react';

export type FormValueType = {
  id?: number;
  name?: string;
  min_amount?: number;
  max_discount?: number;
  scope?: string;
  scope_value?: string;
  status?: string;
  start_time?: string;
  end_time?: string;
  user_limit?: number;
  description?: string;
};

export interface UpdateFormProps {
  onCancel: () => void;
  onSubmit: (values: FormValueType) => Promise<void>;
  updateModalVisible: boolean;
  values: Partial<API.CouponResponse>;
}

const UpdateForm: React.FC<UpdateFormProps> = (props) => {
  const { values } = props;

  return (
    <Modal
      title="编辑优惠券"
      width={640}
      destroyOnHidden
      open={props.updateModalVisible}
      onCancel={() => props.onCancel()}
      footer={null}
    >
      <ProForm
        layout="horizontal"
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 16 }}
        style={{ width: '90%', margin: '0 auto' }}
        onFinish={props.onSubmit}
        initialValues={{
          ...values,
          start_time: values.start_time ? dayjs(values.start_time) : undefined,
          end_time: values.end_time ? dayjs(values.end_time) : undefined,
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
        <ProFormText
          name="name"
          label="优惠券名称"
          rules={[{ required: true, message: '请输入名称' }]}
        />
        <ProFormDigit
          name="min_amount"
          label="最低金额（分）"
          fieldProps={{ min: 0, precision: 0 }}
        />
        <ProFormDigit
          name="max_discount"
          label="最大优惠（分）"
          fieldProps={{ min: 0, precision: 0 }}
        />
        <ProFormSelect
          name="scope"
          label="适用场景"
          options={[
            { label: '全局', value: 'global' },
            { label: '指定分类', value: 'category' },
            { label: '指定商品', value: 'product' },
          ]}
        />
        <ProFormText name="scope_value" label="场景值" />
        <ProFormSelect
          name="status"
          label="状态"
          options={[
            { label: '启用', value: 'active' },
            { label: '禁用', value: 'inactive' },
          ]}
        />
        <ProFormDateTimePicker name="start_time" label="开始时间" />
        <ProFormDateTimePicker name="end_time" label="结束时间" />
        <ProFormDigit
          name="user_limit"
          label="每人限领"
          fieldProps={{ min: 0, precision: 0 }}
        />
        <ProFormTextArea name="description" label="描述" />
      </ProForm>
    </Modal>
  );
};

export default UpdateForm;
