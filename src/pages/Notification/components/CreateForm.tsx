import {
  ProForm,
  ProFormDigit,
  ProFormText,
  ProFormTextArea,
} from '@ant-design/pro-components';
import { message, Modal } from 'antd';
import React from 'react';

import { postNotificationsSystem } from '@/services/api/notifications';

interface CreateFormProps {
  modalVisible: boolean;
  onCancel: () => void;
  onSubmit: () => Promise<boolean>;
}

const CreateForm: React.FC<CreateFormProps> = (props) => {
  const { modalVisible, onCancel, onSubmit } = props;

  return (
    <Modal
      title="发送系统通知"
      width={600}
      open={modalVisible}
      onCancel={() => onCancel()}
      footer={null}
      destroyOnClose
    >
      <ProForm<{ title: string; content: string; user_id?: number }>
        layout="horizontal"
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 18 }}
        style={{ width: '90%', margin: '0 auto' }}
        onFinish={async (values) => {
          const hide = message.loading('正在发送');
          try {
            await postNotificationsSystem({
              title: values.title,
              content: values.content,
              user_id: values.user_id || 0,
            });
            hide();
            message.success('发送成功');
            onSubmit();
            return true;
          } catch {
            hide();
            message.error('发送失败，请重试');
            return false;
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
          name="title"
          label="通知标题"
          width="md"
          rules={[{ required: true, message: '请输入通知标题' }]}
          placeholder="系统维护通知"
        />
        <ProFormTextArea
          name="content"
          label="通知内容"
          width="md"
          rules={[{ required: true, message: '请输入通知内容' }]}
          placeholder="请输入通知内容..."
        />
        <ProFormDigit
          name="user_id"
          label="目标用户"
          width="md"
          tooltip="留空或填 0 表示发送给全体用户"
          placeholder="0 表示全体"
          min={0}
          fieldProps={{ precision: 0 }}
        />
      </ProForm>
    </Modal>
  );
};

export default CreateForm;
