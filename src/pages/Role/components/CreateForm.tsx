import {
  ProForm,
  ProFormDigit,
  ProFormSelect,
  ProFormSwitch,
  ProFormText,
  ProFormTextArea,
} from '@ant-design/pro-components';
import { Modal } from 'antd';
import React from 'react';

interface CreateFormProps {
  modalVisible: boolean;
  onCancel: () => void;
  onSubmit: (values: API.CreateRoleReq) => Promise<boolean>;
}

const CreateForm: React.FC<CreateFormProps> = (props) => {
  const { modalVisible, onCancel, onSubmit } = props;

  return (
    <Modal
      title="新建角色"
      width={600}
      destroyOnHidden
      open={modalVisible}
      onCancel={() => onCancel()}
      footer={null}
    >
      <ProForm<API.CreateRoleReq>
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
          label="角色名称"
          width="md"
          rules={[{ required: true, message: '请输入角色名称' }]}
          placeholder="例如：admin, editor"
        />
        <ProFormText
          name="display_name"
          label="显示名称"
          width="md"
          rules={[{ required: true, message: '请输入显示名称' }]}
          placeholder="例如：管理员, 编辑者"
        />
        <ProFormDigit
          name="sort"
          label="排序"
          width="md"
          placeholder="输入排序值（可选）"
          fieldProps={{ min: 0 }}
        />
        <ProFormSelect
          name="status"
          label="状态"
          width="md"
          initialValue={1}
          options={[
            { label: '启用', value: 1 },
            { label: '禁用', value: 2 },
          ]}
        />
        <ProFormSwitch
          name="is_system"
          label="系统内置"
          width="md"
          initialValue={false}
          fieldProps={{ checkedChildren: '是', unCheckedChildren: '否' }}
        />
        <ProFormTextArea
          name="description"
          label="描述"
          width="md"
          placeholder="请输入角色描述（可选）"
        />
      </ProForm>
    </Modal>
  );
};

export default CreateForm;
