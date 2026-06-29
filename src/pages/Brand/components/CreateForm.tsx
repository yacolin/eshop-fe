import {
  ProForm,
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
  onSubmit: (values: API.CreateBrandReq) => Promise<boolean>;
}

const CreateForm: React.FC<CreateFormProps> = (props) => {
  const { modalVisible, onCancel, onSubmit } = props;

  return (
    <Modal
      title="新建品牌"
      width={600}
      open={modalVisible}
      onCancel={() => onCancel()}
      footer={null}
    >
      <ProForm<API.CreateBrandReq>
        layout="horizontal"
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 18 }}
        style={{ width: '90%', margin: '0 auto' }}
        onFinish={async (values) => {
          const success = await onSubmit(values);
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
          label="品牌名称"
          width="md"
          rules={[{ required: true, message: '请输入品牌名称' }]}
        />
        <ProFormText
          name="english_name"
          label="英文名"
          width="md"
          placeholder="可选"
        />
        <ProFormText
          name="first_letter"
          label="首字母"
          width="md"
          maxLength={1}
          placeholder="如 A"
          rules={[{ max: 1, message: '首字母只能输入一个字符' }]}
        />
        <ProFormText
          name="logo_url"
          label="Logo 地址"
          width="md"
          placeholder="可选"
        />
        <ProFormDigit
          name="sort_order"
          label="排序"
          width="md"
          min={0}
          initialValue={0}
          fieldProps={{ precision: 0 }}
        />
        <ProFormSelect
          name="status"
          label="状态"
          width="md"
          initialValue={1}
          options={[
            { label: '启用', value: 1 },
            { label: '禁用', value: 0 },
          ]}
        />
        <ProFormTextArea
          name="description"
          label="描述"
          width="md"
          placeholder="可选"
        />
      </ProForm>
    </Modal>
  );
};

export default CreateForm;
