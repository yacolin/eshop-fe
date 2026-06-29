import {
  ProForm,
  ProFormDigit,
  ProFormText,
  ProFormTextArea,
} from '@ant-design/pro-components';
import { Modal } from 'antd';
import React from 'react';

interface CreateFormProps {
  modalVisible: boolean;
  onCancel: () => void;
  productId?: number;
  onSubmit: (values: API.CreateSKUReq) => Promise<boolean>;
}

const CreateForm: React.FC<CreateFormProps> = (props) => {
  const { modalVisible, onCancel, productId, onSubmit } = props;

  return (
    <Modal
      title="新建 SKU"
      width={600}
      open={modalVisible}
      onCancel={() => onCancel()}
      footer={null}
      destroyOnClose
    >
      <ProForm<{ sku_code: string; price: number; barcode?: string }>
        layout="horizontal"
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 18 }}
        style={{ width: '90%', margin: '0 auto' }}
        onFinish={async (values) => {
          const success = await onSubmit({
            ...values,
            product_id: productId || 0,
            price: Math.round(values.price * 100),
          });
          if (success) onCancel();
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
          name="sku_code"
          label="SKU 编码"
          width="md"
          rules={[{ required: true, message: '请输入 SKU 编码' }]}
        />
        <ProFormDigit
          name="price"
          label="售价（元）"
          width="md"
          min={0}
          rules={[{ required: true, message: '请输入售价' }]}
          fieldProps={{ precision: 2, prefix: '¥' }}
        />
        <ProFormDigit
          name="cost_price"
          label="成本价（元）"
          width="md"
          min={0}
          fieldProps={{ precision: 2, prefix: '¥' }}
        />
        <ProFormDigit
          name="market_price"
          label="市场价（元）"
          width="md"
          min={0}
          fieldProps={{ precision: 2, prefix: '¥' }}
        />
        <ProFormText name="barcode" label="条码" width="md" />
        <ProFormTextArea
          name="spec"
          label="规格"
          width="md"
          placeholder='JSON 格式，如 {"颜色":"红","尺寸":"L"}'
        />
      </ProForm>
    </Modal>
  );
};

export default CreateForm;
