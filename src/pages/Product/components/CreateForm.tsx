import type { ProFormInstance } from '@ant-design/pro-components';
import {
  ProForm,
  ProFormDigit,
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
} from '@ant-design/pro-components';
import { Modal } from 'antd';
import React, { useEffect, useRef, useState } from 'react';

import useCategoryOptions from '@/pages/Category/hooks/useCategoryOptions';
import { getCategoriesIdBrands } from '@/services/api/categories';

interface CreateFormProps {
  modalVisible: boolean;
  onCancel: () => void;
  onSubmit: (values: API.CreateSPUReq) => Promise<boolean>;
}

const CreateForm: React.FC<CreateFormProps> = (props) => {
  const { modalVisible, onCancel, onSubmit } = props;
  const categories = useCategoryOptions(modalVisible);
  const formRef = useRef<ProFormInstance>();
  const [brandOptions, setBrandOptions] = useState<
    { label: string; value: number }[]
  >([]);
  const [brandLoading, setBrandLoading] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState<
    number | undefined
  >();

  // 类目变化时加载关联品牌
  useEffect(() => {
    if (!selectedCategoryId) {
      setBrandOptions([]);
      return;
    }
    setBrandLoading(true);
    getCategoriesIdBrands({ id: selectedCategoryId })
      .then((res) => {
        const list = (res as any).data || [];
        setBrandOptions(
          list.map((b: API.CategoryBrandDetail) => ({
            label: b.brand_name || '',
            value: b.brand_id || 0,
          })),
        );
      })
      .catch(() => setBrandOptions([]))
      .finally(() => setBrandLoading(false));
  }, [selectedCategoryId]);

  // 弹窗关闭时重置品牌选项
  useEffect(() => {
    if (!modalVisible) {
      setSelectedCategoryId(undefined);
      setBrandOptions([]);
    }
  }, [modalVisible]);

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
        formRef={formRef}
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
        onValuesChange={(changedValues) => {
          if ('category_id' in changedValues) {
            formRef.current?.setFieldsValue({ brand_id: undefined });
          }
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
            onChange: (val: number) => setSelectedCategoryId(val),
            filterOption: (input: any, option: any) =>
              (option?.label ?? '').toLowerCase().includes(input.toLowerCase()),
          }}
        />
        <ProFormSelect
          name="brand_id"
          label="品牌"
          width="md"
          showSearch
          options={brandOptions}
          placeholder={selectedCategoryId ? '选择品牌（可选）' : '请先选择分类'}
          disabled={!selectedCategoryId}
          fieldProps={{
            loading: brandLoading,
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
