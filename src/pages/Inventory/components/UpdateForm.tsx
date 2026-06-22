import {
  ProForm,
  ProFormDigit,
  ProFormSelect,
  ProFormText,
} from '@ant-design/pro-components';
import { Modal } from 'antd';
import React from 'react';

import useSkuOptions from '../hooks/useSkuOptions';

export type FormValueType = {
  quantity?: number;
  threshold?: number;
} & Partial<API.Inventory>;

export interface UpdateFormProps {
  onCancel: () => void;
  onSubmit: (values: FormValueType) => Promise<void>;
  updateModalVisible: boolean;
  values: Partial<API.Inventory>;
}

const statusMap: Record<string, string> = {
  instock: '有货',
  lowstock: '低库存',
  outofstock: '缺货',
};

const UpdateForm: React.FC<UpdateFormProps> = (props) => {
  const { values } = props;
  const skus = useSkuOptions(props.updateModalVisible);

  const available = (values.quantity || 0) - (values.reserved || 0);

  return (
    <Modal
      width={600}
      destroyOnHidden
      title="编辑库存"
      open={props.updateModalVisible}
      onCancel={() => props.onCancel()}
      footer={null}
    >
      <div></div>
      <ProForm
        layout="horizontal"
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 18 }}
        style={{ width: '90%', margin: '0 auto' }}
        onFinish={props.onSubmit}
        initialValues={{
          sku_id: values.sku_id,
          quantity: values.quantity,
          threshold: values.threshold,
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
        <ProFormSelect
          name="sku_id"
          label="关联 SKU"
          width="md"
          disabled
          showSearch
          options={skus}
          tooltip="当前库存关联的 SKU，不可修改"
        />
        <ProFormDigit
          name="quantity"
          label="调整库存数量"
          width="md"
          min={0}
          rules={[{ required: true, message: '请输入调整后的库存数量' }]}
          fieldProps={{ precision: 0 }}
          tooltip="手动修正物理库存。正常由订单系统自动扣减，此处用于盘点纠偏"
        />
        <ProFormDigit
          name="threshold"
          label="低库存预警阈值"
          width="md"
          min={0}
          fieldProps={{ precision: 0 }}
          tooltip="库存数量低于此值时自动标记为低库存"
        />
        <ProFormText
          name="reserved"
          label="已预订数量"
          width="md"
          disabled
          initialValue={values.reserved ?? 0}
          tooltip="已预订数量由订单系统自动管理，不可手动修改"
        />
        <ProFormText
          name="status"
          label="库存状态"
          width="md"
          disabled
          initialValue={
            values.status ? statusMap[values.status] || values.status : '-'
          }
          tooltip="库存状态由系统根据数量与阈值自动计算"
        />
        <ProFormText
          name="available"
          label="可用库存"
          width="md"
          disabled
          initialValue={available}
          tooltip="可用库存 = 库存数量 - 已预订数量"
        />
      </ProForm>
    </Modal>
  );
};

export default UpdateForm;
