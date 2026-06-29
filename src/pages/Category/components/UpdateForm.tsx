import {
  ProForm,
  ProFormDigit,
  ProFormSelect,
  ProFormText,
} from '@ant-design/pro-components';
import { Modal } from 'antd';
import React, { useEffect, useState } from 'react';

import { getCategoriesAll } from '@/services/api/categories';

export type FormValueType = {
  id?: number;
  name?: string;
  sort_order?: number;
  status?: number;
} & Partial<API.Category>;

export interface UpdateFormProps {
  onCancel: () => void;
  onSubmit: (values: FormValueType) => Promise<void>;
  updateModalVisible: boolean;
  values: Partial<API.Category>;
}

const levelTextMap: Record<number, string> = {
  1: '一级',
  2: '二级',
  3: '三级',
};

const UpdateForm: React.FC<UpdateFormProps> = (props) => {
  const { values } = props;
  const [parentName, setParentName] = useState<string>('-');

  useEffect(() => {
    if (!props.updateModalVisible || !values.parent_id) {
      setParentName('-');
      return;
    }
    getCategoriesAll().then((res) => {
      const list = (res as any).data || [];
      const parent = list.find((c: API.Category) => c.id === values.parent_id);
      setParentName(parent?.name || '-');
    });
  }, [props.updateModalVisible, values.parent_id]);

  return (
    <Modal
      title="编辑分类"
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
          name: values.name,
          sort_order: values.sort_order,
          status: values.status,
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
          label="分类名称"
          width="md"
          rules={[{ required: true, message: '请输入分类名称' }]}
        />
        <ProFormText
          label="层级"
          width="md"
          disabled
          tooltip="层级创建后不可修改"
          initialValue={levelTextMap[values.level ?? -1] || '-'}
        />
        <ProFormText
          label="父分类"
          width="md"
          disabled
          initialValue={parentName}
        />
        <ProFormDigit
          name="sort_order"
          label="排序"
          width="md"
          min={0}
          fieldProps={{ precision: 0 }}
        />
        <ProFormSelect
          name="status"
          label="状态"
          width="md"
          options={[
            { label: '启用', value: 1 },
            { label: '禁用', value: 0 },
          ]}
        />
      </ProForm>
    </Modal>
  );
};

export default UpdateForm;
