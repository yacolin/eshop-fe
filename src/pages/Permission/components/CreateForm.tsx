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
  onSubmit: (values: API.CreatePermissionReq) => Promise<boolean>;
}

const CreateForm: React.FC<CreateFormProps> = (props) => {
  const { modalVisible, onCancel, onSubmit } = props;

  return (
    <Modal
      title="新建权限"
      width={600}
      open={modalVisible}
      onCancel={() => onCancel()}
      footer={null}
    >
      <ProForm<API.CreatePermissionReq>
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
          label="权限名称"
          width="md"
          rules={[{ required: true, message: '请输入权限名称' }]}
          placeholder="例如：order:create"
        />
        <ProFormText
          name="display_name"
          label="显示名称"
          width="md"
          rules={[{ required: true, message: '请输入显示名称' }]}
          placeholder="例如：创建订单"
        />
        <ProFormText
          name="resource"
          label="资源"
          width="md"
          rules={[{ required: true, message: '请输入资源' }]}
          placeholder="例如：order, product, user"
        />
        <ProFormText
          name="action"
          label="操作"
          width="md"
          rules={[{ required: true, message: '请输入操作' }]}
          placeholder="例如：create, read, update, delete"
        />
        <ProFormSelect
          name="category"
          label="分类"
          width="md"
          placeholder="选择分类（可选）"
          options={[
            { label: '业务', value: 'business' },
            { label: '系统', value: 'system' },
            { label: '管理', value: 'admin' },
          ]}
        />
        <ProFormDigit
          name="sort_order"
          label="排序"
          width="md"
          placeholder="输入排序值（可选）"
          fieldProps={{ min: 0 }}
        />
        <ProFormTextArea
          name="description"
          label="描述"
          width="md"
          placeholder="请输入权限描述（可选）"
        />
      </ProForm>
    </Modal>
  );
};

export default CreateForm;
