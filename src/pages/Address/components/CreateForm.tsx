import {
  ProForm,
  ProFormRadio,
  ProFormSwitch,
  ProFormText,
  ProFormTextArea,
} from '@ant-design/pro-components';
import { Modal } from 'antd';
import React from 'react';

interface CreateFormProps {
  modalVisible: boolean;
  onCancel: () => void;
  onSubmit: (values: API.CreateAddressReq) => Promise<boolean>;
}

const CreateForm: React.FC<CreateFormProps> = (props) => {
  const { modalVisible, onCancel, onSubmit } = props;

  return (
    <Modal
      title="新建地址"
      width={600}
      open={modalVisible}
      onCancel={() => onCancel()}
      footer={null}
    >
      <ProForm<API.CreateAddressReq>
        layout="horizontal"
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 18 }}
        style={{ width: '90%', margin: '0 auto' }}
        onFinish={async (values) => {
          const ok = await onSubmit(values);
          if (ok) onCancel();
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
          name="consignee"
          label="收货人"
          width="md"
          rules={[{ required: true, message: '请输入收货人' }]}
        />
        <ProFormText
          name="phone"
          label="手机号"
          width="md"
          rules={[{ required: true, message: '请输入手机号' }]}
        />
        <ProFormText name="province" label="省份" width="md" />
        <ProFormText name="city" label="城市" width="md" />
        <ProFormText name="district" label="区县" width="md" />
        <ProFormTextArea
          name="detail"
          label="详细地址"
          width="md"
          rules={[{ required: true, message: '请输入详细地址' }]}
        />
        <ProFormText name="zip_code" label="邮编" width="md" />
        <ProFormRadio.Group
          name="tag"
          label="标签"
          width="md"
          initialValue="other"
          options={[
            { label: '家', value: 'home' },
            { label: '公司', value: 'office' },
            { label: '其他', value: 'other' },
          ]}
        />
        <ProFormSwitch
          name="is_default"
          label="设为默认"
          initialValue={false}
        />
      </ProForm>
    </Modal>
  );
};

export default CreateForm;
