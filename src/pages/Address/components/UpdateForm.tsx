import {
  ProForm,
  ProFormRadio,
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
  tag?: 'home' | 'office' | 'company' | 'other';
  is_default?: boolean;
};

export interface UpdateFormProps {
  onCancel: () => void;
  onSubmit: (values: FormValueType) => Promise<void>;
  updateModalVisible: boolean;
  values: Partial<API.Address>;
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
        style={{ width: '90%', margin: '0 auto' }}
        onFinish={props.onSubmit}
        initialValues={{
          consignee: values.consignee,
          phone: values.phone,
          province: values.province,
          city: values.city,
          district: values.district,
          detail: values.detail,
          zip_code: values.zip_code,
          tag: values.tag,
          is_default: values.is_default,
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
          options={[
            { label: '家', value: 'home' },
            { label: '公司', value: 'office' },
            { label: '其他', value: 'other' },
          ]}
        />
        <ProFormSwitch name="is_default" label="设为默认" />
      </ProForm>
    </Modal>
  );
};

export default UpdateForm;
