import {
  ProForm,
  ProFormDigit,
  ProFormSelect,
  ProFormText,
} from '@ant-design/pro-components';
import { Modal } from 'antd';
import React, { useEffect, useState } from 'react';

import useProductOptions from '@/pages/Sku/hooks/useProductOptions';
import { getSkus } from '@/services/api/skus';

export type FormValueType = {
  product_id?: number;
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
  const [skuOptions, setSkuOptions] = useState<
    { label: string; value: number }[]
  >([]);
  const products = useProductOptions(props.updateModalVisible);

  const available = (values.quantity || 0) - (values.reserved || 0);
  const productId = (values as any).product_id as number | undefined;

  const loadSkus = async (pid: number) => {
    if (!pid) {
      setSkuOptions([]);
      return;
    }
    try {
      const res = await getSkus({ product_id: pid, page: 1, size: 1000 });
      const data = (res as any).data || {};
      const list: API.SkuResponse[] = data.list || [];
      setSkuOptions(
        list.map((sku) => ({
          label: `${sku.name}（${sku.sku_code}）`,
          value: sku.id || 0,
        })),
      );
    } catch {
      setSkuOptions([]);
    }
  };

  useEffect(() => {
    if (props.updateModalVisible && productId) {
      loadSkus(productId);
    }
  }, [props.updateModalVisible, productId]);

  return (
    <Modal
      width={600}
      destroyOnHidden
      title="编辑库存"
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
          product_id: productId,
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
          name="product_id"
          label="产品"
          showSearch
          disabled
          options={products}
          tooltip="当前库存关联的产品，不可修改"
          fieldProps={{
            filterOption: (input, option) =>
              (option?.label ?? '').toLowerCase().includes(input.toLowerCase()),
          }}
        />
        <ProFormSelect
          name="sku_id"
          label="关联 SKU"
          showSearch
          disabled
          options={skuOptions}
          tooltip="当前库存关联的 SKU，不可修改"
          fieldProps={{
            filterOption: (input, option) =>
              (option?.label ?? '').toLowerCase().includes(input.toLowerCase()),
          }}
        />
        <ProFormDigit
          name="quantity"
          label="调整库存数量"
          min={0}
          rules={[{ required: true, message: '请输入调整后的库存数量' }]}
          fieldProps={{ precision: 0 }}
          tooltip="手动修正物理库存。正常由订单系统自动扣减，此处用于盘点纠偏"
        />
        <ProFormDigit
          name="threshold"
          label="低库存预警阈值"
          min={0}
          fieldProps={{ precision: 0 }}
          tooltip="库存数量低于此值时自动标记为低库存"
        />
        <ProFormText
          name="reserved"
          label="已预订数量"
          disabled
          initialValue={values.reserved ?? 0}
          tooltip="已预订数量由订单系统自动管理，不可手动修改"
        />
        <ProFormText
          name="status"
          label="库存状态"
          disabled
          initialValue={
            values.status ? statusMap[values.status] || values.status : '-'
          }
          tooltip="库存状态由系统根据数量与阈值自动计算"
        />
        <ProFormText
          name="available"
          label="可用库存"
          disabled
          initialValue={available}
          tooltip="可用库存 = 库存数量 - 已预订数量"
        />
      </ProForm>
    </Modal>
  );
};

export default UpdateForm;
