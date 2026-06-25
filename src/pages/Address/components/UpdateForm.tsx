import {
  ProForm,
  ProFormSwitch,
  ProFormText,
  ProFormTextArea,
} from '@ant-design/pro-components';
import { Modal } from 'antd';
import React from 'react';

export type FormValueType = {
  id?: number;
  consignee?: string;
  phone?: string;
  province?: string;
  city?: string;
  district?: string;
  detail?: string;
  zip_code?: string;
  is_default?: boolean;
};

export interface UpdateFormProps {
  onCancel: () => void;
  onSubmit: (values: FormValueType) => Promise<boolean | void>;
  updateModalVisible: boolean;
  values: Partial<API.AddressResp>;
}

const UpdateForm: React.FC<UpdateFormProps> = (props) => {
  const { values } = props;

  return (
    <Modal
      title="编辑地址"
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
        style={{ width: '90%', margin: '0 auto', paddingTop: 24 }}
        onFinish={props.onSubmit}
        initialValues={{
          consignee: values.consignee,
          phone: values.phone,
          province: values.province,
          city: values.city,
          district: values.district,
          detail: values.detail,
          zip_code: values.zip_code,
          is_default: values.is_default,
        }}
        submitter={{
          render: (_, dom) => (
            <div
              style={{
                width: '100%',
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
        <ProFormText
          name="province"
          label="省份"
          width="md"
          rules={[{ required: true, message: '请输入省份' }]}
        />
        <ProFormText
          name="city"
          label="城市"
          width="md"
          rules={[{ required: true, message: '请输入城市' }]}
        />
        <ProFormText
          name="district"
          label="区/县"
          width="md"
          rules={[{ required: true, message: '请输入区/县' }]}
        />
        <ProFormTextArea
          name="detail"
          label="详细地址"
          width="md"
          rules={[{ required: true, message: '请输入详细地址' }]}
        />
        <ProFormText name="zip_code" label="邮编" width="md" />
        <ProFormSwitch name="is_default" label="设为默认" />
      </ProForm>
    </Modal>
  );
};

export default UpdateForm;
