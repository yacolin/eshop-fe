import {
  ProForm,
  ProFormDigit,
  ProFormRadio,
  ProFormText,
  ProFormTextArea,
} from '@ant-design/pro-components';
import { Modal } from 'antd';
import React from 'react';

interface CreateFormProps {
  modalVisible: boolean;
  onCancel: () => void;
  categoryId?: number;
  onSubmit: (values: API.CreateAttributeReq) => Promise<boolean>;
}

const CreateForm: React.FC<CreateFormProps> = (props) => {
  const { modalVisible, onCancel, categoryId, onSubmit } = props;

  return (
    <Modal
      title="新建属性"
      width={600}
      open={modalVisible}
      onCancel={() => onCancel()}
      footer={null}
    >
      <ProForm<API.CreateAttributeReq>
        layout="horizontal"
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 18 }}
        style={{ width: '90%', margin: '0 auto' }}
        onFinish={async (values) => {
          const success = await onSubmit({
            ...values,
            category_id: categoryId || 0,
          });
          if (success) {
            onCancel();
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
          label="属性名称"
          width="md"
          rules={[{ required: true, message: '请输入属性名称' }]}
        />
        <ProFormRadio.Group
          name="input_type"
          label="输入类型"
          width="md"
          initialValue={1}
          options={[
            { label: '文本', value: 1 },
            { label: '单选', value: 2 },
            { label: '多选', value: 3 },
            { label: '数字', value: 4 },
          ]}
        />
        <ProFormRadio.Group
          name="required"
          label="是否必填"
          width="md"
          initialValue={0}
          options={[
            { label: '否', value: 0 },
            { label: '是', value: 1 },
          ]}
        />
        <ProFormRadio.Group
          name="searchable"
          label="是否可搜索"
          width="md"
          initialValue={0}
          options={[
            { label: '否', value: 0 },
            { label: '是', value: 1 },
          ]}
        />
        <ProFormRadio.Group
          name="is_sku_spec"
          label="SKU规格"
          width="md"
          initialValue={0}
          options={[
            { label: '否', value: 0 },
            { label: '是', value: 1 },
          ]}
        />
        <ProFormText
          name="unit"
          label="单位"
          width="md"
          placeholder="如: g, ml, 个"
        />
        <ProFormTextArea
          name="values"
          label="可选值"
          width="md"
          placeholder='单选/多选时填写，JSON 数组格式如 ["红","蓝"]'
        />
        <ProFormDigit
          name="sort_order"
          label="排序"
          width="md"
          min={0}
          initialValue={0}
          fieldProps={{ precision: 0 }}
        />
      </ProForm>
    </Modal>
  );
};

export default CreateForm;
