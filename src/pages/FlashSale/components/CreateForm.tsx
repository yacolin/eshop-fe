import {
  ProForm,
  ProFormDateTimePicker,
  ProFormDigit,
  ProFormText,
  ProFormTextArea,
} from '@ant-design/pro-components';
import { Modal } from 'antd';
import React from 'react';

interface CreateFormProps {
  modalVisible: boolean;
  onCancel: () => void;
  onSubmit: (values: any) => Promise<boolean>;
}

const CreateForm: React.FC<CreateFormProps> = (props) => {
  const { modalVisible, onCancel, onSubmit } = props;

  return (
    <Modal
      title="新建秒杀活动"
      width={640}
      open={modalVisible}
      onCancel={() => onCancel()}
      footer={null}
      destroyOnClose
    >
      <ProForm<{
        name: string;
        discount: number;
        stock_limit: number;
        sort_order?: number;
        start_time: any;
        end_time: any;
        description?: string;
      }>
        layout="horizontal"
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 16 }}
        style={{ width: '90%', margin: '0 auto' }}
        onFinish={async (values) => {
          // 组装 rule JSON
          const rule = JSON.stringify({
            discount: values.discount,
            stock_limit: values.stock_limit,
          });
          const success = await onSubmit({
            ...values,
            rule,
          });
          if (success) onCancel();
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
          placeholder="例：618限时秒杀"
        />
        <ProFormDigit
          name="discount"
          label="折扣比例"
          width="md"
          rules={[{ required: true, message: '请输入折扣比例' }]}
          min={0.01}
          max={0.99}
          fieldProps={{
            precision: 2,
            addonAfter: '折',
          }}
          placeholder="0.8 表示 8 折"
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
        <ProFormDateTimePicker
          name="start_time"
          label="开始时间"
          rules={[{ required: true, message: '请选择开始时间' }]}
        />
        <ProFormDateTimePicker
          name="end_time"
          label="结束时间"
          rules={[{ required: true, message: '请选择结束时间' }]}
        />
        <ProFormTextArea name="description" label="活动描述" width="md" />
      </ProForm>
    </Modal>
  );
};

export default CreateForm;
