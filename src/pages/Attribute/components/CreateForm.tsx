import { ProForm, ProFormDigit, ProFormText } from '@ant-design/pro-components';
import { Modal } from 'antd';
import React from 'react';

interface CreateFormProps {
  modalVisible: boolean;
  onCancel: () => void;
  onSubmit: (values: API.CreateAttributeDTO) => Promise<boolean>;
}

const CreateForm: React.FC<CreateFormProps> = (props) => {
  const { modalVisible, onCancel, onSubmit } = props;

  return (
    <Modal
      title="新建属性"
      width={600}
      open={modalVisible}
      onCancel={() => onCancel()}
      footer={null}
    >
      <ProForm<API.CreateAttributeDTO>
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
          label="属性名称"
          width="md"
          rules={[{ required: true, message: '请输入属性名称' }]}
          placeholder="例如：颜色、尺寸"
        />
        <ProFormDigit
          name="sort_order"
          label="排序"
          width="md"
          placeholder="数字越小越靠前"
          fieldProps={{ precision: 0 }}
        />
      </ProForm>
    </Modal>
  );
};

export default CreateForm;
