import {
  ProForm,
  ProFormDigit,
  ProFormSelect,
  ProFormText,
} from '@ant-design/pro-components';
import { Modal } from 'antd';
import React, { useEffect, useState } from 'react';

import { getCategoriesLevelLevel } from '@/services/api/categories';

interface CreateFormProps {
  modalVisible: boolean;
  onCancel: () => void;
  onSubmit: (values: API.CreateCategoryReq) => Promise<boolean>;
}

const parentLevelMap: Record<number, number> = {
  1: 0, // 一级无父分类
  2: 1, // 二级需要选一级
  3: 2, // 三级需要选二级
};

const CreateForm: React.FC<CreateFormProps> = (props) => {
  const { modalVisible, onCancel, onSubmit } = props;
  const [level, setLevel] = useState<number>(1);
  const [parentOptions, setParentOptions] = useState<
    { label: string; value: number }[]
  >([]);

  useEffect(() => {
    if (!modalVisible) return;
    setLevel(1);
    setParentOptions([]);
  }, [modalVisible]);

  useEffect(() => {
    const parentLevel = parentLevelMap[level];
    if (!parentLevel || !modalVisible) {
      setParentOptions([]);
      return;
    }
    getCategoriesLevelLevel({ level: parentLevel }).then((res) => {
      const list = (res as any).data || [];
      setParentOptions(
        list.map((c: API.Category) => ({
          label: c.name || '',
          value: c.id || 0,
        })),
      );
    });
  }, [level, modalVisible]);

  return (
    <Modal
      title="新建分类"
      width={600}
      open={modalVisible}
      onCancel={() => onCancel()}
      footer={null}
    >
      <ProForm<API.CreateCategoryReq & { _level?: number }>
        layout="horizontal"
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 18 }}
        style={{ width: '90%', margin: '0 auto' }}
        onFinish={async (values) => {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { _level: _, ...submitValues } = values;
          const success = await onSubmit(submitValues);
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
          label="分类名称"
          width="md"
          rules={[{ required: true, message: '请输入分类名称' }]}
        />
        <ProFormSelect
          name="_level"
          label="层级"
          width="md"
          initialValue={1}
          options={[
            { label: '一级', value: 1 },
            { label: '二级', value: 2 },
            { label: '三级', value: 3 },
          ]}
          fieldProps={{ onChange: (val: number) => setLevel(val) }}
        />
        {level > 1 && (
          <ProFormSelect
            name="parent_id"
            label="父分类"
            width="md"
            showSearch
            rules={[{ required: true, message: '请选择父分类' }]}
            options={parentOptions}
            placeholder={`选择${level === 2 ? '一级' : '二级'}分类`}
            fieldProps={{
              filterOption: (input, option) =>
                (option?.label ?? '')
                  .toLowerCase()
                  .includes(input.toLowerCase()),
            }}
          />
        )}
        <ProFormDigit
          name="sort_order"
          label="排序"
          width="md"
          initialValue={0}
          min={0}
          fieldProps={{ precision: 0 }}
        />
      </ProForm>
    </Modal>
  );
};

export default CreateForm;
