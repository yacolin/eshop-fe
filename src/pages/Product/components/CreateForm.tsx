import {
  ProForm,
  ProFormDigit,
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
} from '@ant-design/pro-components';
import { Modal } from 'antd';
import React from 'react';

import useCategoryOptions from '@/pages/Category/hooks/useCategoryOptions';
import useBrandOptions from '../hooks/useBrandOptions';

interface CreateFormProps {
  modalVisible: boolean;
  onCancel: () => void;
  onSubmit: (values: API.CreateSPUReq) => Promise<boolean>;
}

const CreateForm: React.FC<CreateFormProps> = (props) => {
  const { modalVisible, onCancel, onSubmit } = props;
  const categories = useCategoryOptions(modalVisible);
  const brands = useBrandOptions(modalVisible);

  return (
    <Modal
      title="新建商品"
      width={640}
      open={modalVisible}
      onCancel={() => onCancel()}
      footer={null}
      destroyOnHidden
    >
      <ProForm<API.CreateSPUReq>
        layout="horizontal"
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 18 }}
        style={{ width: '90%', margin: '0 auto' }}
        onFinish={async (values) => {
          const success = await onSubmit({
            ...values,
            skus: [],
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
          name="name"
          label="商品名称"
          width="md"
          rules={[{ required: true, message: '请输入商品名称' }]}
        />
        <ProFormText
          name="subtitle"
          label="副标题"
          width="md"
          placeholder="可选"
        />
        <ProFormSelect
          name="category_id"
          label="所属分类"
          width="md"
          showSearch
          rules={[{ required: true, message: '请选择分类' }]}
          options={categories}
          placeholder="选择分类"
          fieldProps={{
            filterOption: (input: any, option: any) =>
              (option?.label ?? '').toLowerCase().includes(input.toLowerCase()),
          }}
        />
        <ProFormSelect
          name="brand_id"
          label="品牌"
          width="md"
          showSearch
          options={brands}
          placeholder="选择品牌（可选）"
          fieldProps={{
            filterOption: (input: any, option: any) =>
              (option?.label ?? '').toLowerCase().includes(input.toLowerCase()),
          }}
        />
        <ProFormText
          name="main_image"
          label="主图 URL"
          width="md"
          rules={[{ required: true, message: '请输入主图地址' }]}
        />
        <ProFormText
          name="unit"
          label="单位"
          width="md"
          placeholder="如: 件, 箱"
        />
        <ProFormDigit
          name="sort_order"
          label="排序"
          width="md"
          min={0}
          initialValue={0}
          fieldProps={{ precision: 0 }}
        />
        <ProFormTextArea
          name="description"
          label="商品描述"
          width="md"
          placeholder="可选"
        />
      </ProForm>
    </Modal>
  );
};

export default CreateForm;
