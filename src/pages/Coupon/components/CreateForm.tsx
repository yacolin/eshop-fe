import {
  ProForm,
  ProFormDateTimePicker,
  ProFormDigit,
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
} from '@ant-design/pro-components';
import { Modal } from 'antd';
import React from 'react';

interface CreateFormProps {
  modalVisible: boolean;
  onCancel: () => void;
  onSubmit: (values: API.CreateCouponReq) => Promise<boolean>;
}

const CreateForm: React.FC<CreateFormProps> = (props) => {
  const { modalVisible, onCancel, onSubmit } = props;

  return (
    <Modal
      title="新建优惠券"
      width={640}
      open={modalVisible}
      onCancel={() => onCancel()}
      footer={null}
      destroyOnHidden
    >
      <ProForm<API.CreateCouponReq>
        layout="horizontal"
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 16 }}
        style={{ width: '90%', margin: '0 auto' }}
        onFinish={async (values) => {
          const success = await onSubmit(values as API.CreateCouponReq);
          if (success) {
            onCancel();
          }
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
        <ProFormSelect
          name="coupon_type"
          label="类型"
          rules={[{ required: true, message: '请选择类型' }]}
          options={[
            { label: '满减券', value: 'fixed' },
            { label: '折扣券', value: 'percentage' },
            { label: '代金券', value: 'voucher' },
          ]}
        />
        <ProFormDigit
          name="min_amount"
          label="最低金额（分）"
          rules={[{ required: true, message: '请输入最低金额' }]}
          fieldProps={{ min: 0, precision: 0 }}
          placeholder="单位：分"
        />
        <ProFormDigit
          name="max_discount"
          label="最大优惠（分）"
          fieldProps={{ min: 0, precision: 0 }}
          placeholder="单位：分，不限制留空"
        />
        <ProFormDigit
          name="total_stock"
          label="总库存"
          rules={[{ required: true, message: '请输入库存' }]}
          fieldProps={{ min: 1, precision: 0 }}
        />
        <ProFormSelect
          name="scope"
          label="适用场景"
          rules={[{ required: true, message: '请选择场景' }]}
          options={[
            { label: '全局', value: 'global' },
            { label: '指定分类', value: 'category' },
            { label: '指定商品', value: 'product' },
          ]}
        />
        <ProFormText
          name="scope_value"
          label="场景值"
          placeholder="分类ID或商品ID"
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
        <ProFormTextArea name="description" label="描述" />
      </ProForm>
    </Modal>
  );
};

export default CreateForm;
