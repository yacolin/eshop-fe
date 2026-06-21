import {
  ProForm,
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
} from '@ant-design/pro-components';
import { Modal } from 'antd';
import React from 'react';

interface CreateFormProps {
  modalVisible: boolean;
  onCancel: () => void;
  onSubmit: (values: {
    title: string;
    message: string;
    level: string;
    target?: string;
  }) => Promise<boolean>;
}

const CreateForm: React.FC<CreateFormProps> = (props) => {
  const { modalVisible, onCancel, onSubmit } = props;

  return (
    <Modal
      title="发送通知"
      width={600}
      open={modalVisible}
      onCancel={() => onCancel()}
      footer={null}
      destroyOnClose
    >
      <ProForm<{
        title: string;
        message: string;
        level: string;
        target?: string;
      }>
        layout="horizontal"
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 18 }}
        style={{ width: '90%', margin: '0 auto' }}
        onFinish={async (values) => {
          const success = await onSubmit(values);
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
          name="title"
          label="通知标题"
          width="md"
          rules={[{ required: true, message: '请输入通知标题' }]}
          placeholder="系统维护通知"
        />
        <ProFormTextArea
          name="message"
          label="通知内容"
          width="md"
          rules={[{ required: true, message: '请输入通知内容' }]}
          placeholder="请输入通知内容..."
        />
        <ProFormSelect
          name="level"
          label="消息级别"
          width="md"
          rules={[{ required: true, message: '请选择消息级别' }]}
          initialValue="info"
          valueEnum={{
            info: '信息',
            success: '成功',
            warning: '警告',
            error: '错误',
          }}
        />
        <ProFormText
          name="target"
          label="目标用户"
          width="md"
          tooltip="留空或填 all 表示全部用户，指定 user_id 推送给特定用户"
          placeholder="all"
        />
      </ProForm>
    </Modal>
  );
};

export default CreateForm;
