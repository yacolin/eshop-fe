import { ProForm, ProFormDigit, ProFormText } from '@ant-design/pro-components';
import { Modal } from 'antd';
import React from 'react';

export type FormValueType = Record<string, any>;

export interface UpdateFormProps {
  onCancel: () => void;
  onSubmit: (values: FormValueType) => Promise<void>;
  updateModalVisible: boolean;
  values: any;
}

const UpdateForm: React.FC<UpdateFormProps> = (props) => {
  const { values } = props;

  return (
    <Modal
      title="编辑活动"
      width={600}
      destroyOnHidden
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
        initialValues={{ name: values.name, discount: values.discount }}
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
          label="活动名称"
          width="md"
          rules={[{ required: true, message: '请输入活动名称' }]}
        />
        <ProFormDigit
          name="discount"
          label="折扣比例"
          width="md"
          min={0}
          max={1}
          fieldProps={{ precision: 2 }}
        />
      </ProForm>
    </Modal>
  );
};

export default UpdateForm;
