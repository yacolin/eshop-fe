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
  discount?: number;
  stock_limit?: number;
  sort_order?: number;
  start_time?: any;
  end_time?: any;
  description?: string;
  status?: string;
};

export interface UpdateFormProps {
  onCancel: () => void;
  onSubmit: (values: FormValueType) => Promise<void>;
  updateModalVisible: boolean;
  values: Partial<API.PromotionResponse>;
}

const parseRule = (rule?: string) => {
  if (!rule) return {};
  try {
    return JSON.parse(rule);
  } catch {
    return {};
  }
};

const UpdateForm: React.FC<UpdateFormProps> = (props) => {
  const { values } = props;
  const rule = parseRule(values.rule);

  return (
    <Modal
      title="编辑秒杀活动"
      width={640}
      destroyOnClose
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
          discount: rule.discount,
          stock_limit: rule.stock_limit,
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
          label="活动名称"
          width="md"
          rules={[{ required: true, message: '请输入活动名称' }]}
        />
        <ProFormDigit
          name="discount"
          label="折扣比例"
          width="md"
          rules={[{ required: true, message: '请输入折扣比例' }]}
          min={0.01}
          max={0.99}
          fieldProps={{ precision: 2, addonAfter: '折' }}
        />
        <ProFormDigit
          name="stock_limit"
          label="限量数量"
          width="md"
          rules={[{ required: true, message: '请输入限量数量' }]}
          min={1}
          fieldProps={{ precision: 0, addonAfter: '件' }}
        />
        <ProFormDigit
          name="sort_order"
          label="排序"
          width="md"
          fieldProps={{ min: 0, precision: 0 }}
        />
        <ProFormSelect
          name="status"
          label="状态"
          width="md"
          options={[
            { label: '待开始', value: 'pending' },
            { label: '抢购中', value: 'active' },
            { label: '已取消', value: 'cancelled' },
          ]}
        />
        <ProFormDateTimePicker name="start_time" label="开始时间" />
        <ProFormDateTimePicker name="end_time" label="结束时间" />
        <ProFormTextArea name="description" label="活动描述" width="md" />
      </ProForm>
    </Modal>
  );
};

export default UpdateForm;
