import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { PageContainer, ProTable } from '@ant-design/pro-components';
import { Button, Divider, message, Popconfirm, Tag } from 'antd';
import React, { useRef, useState } from 'react';

import Auth from '@/components/Auth';

import {
  deleteAddressesId,
  getAddresses,
  postAddresses,
  putAddressesId,
} from '@/services/api/addresses';
import CreateForm from './components/CreateForm';
import UpdateForm from './components/UpdateForm';

import type { FormValueType } from './components/UpdateForm';

const tagColorMap: Record<string, string> = {
  home: 'blue',
  office: 'green',
  company: 'purple',
  other: 'default',
};

/**
 * 新增地址
 */
const handleAdd = async (fields: API.CreateAddressReq): Promise<boolean> => {
  const hide = message.loading('正在创建');
  try {
    await postAddresses(fields);
    hide();
    message.success('创建成功');
    return true;
  } catch {
    hide();
    message.error('创建失败，请重试');
    return false;
  }
};

/**
 * 更新地址
 */
const handleUpdate = async (fields: FormValueType): Promise<boolean> => {
  const hide = message.loading('正在更新');
  try {
    await putAddressesId(
      { id: fields.id || 0 },
      {
        consignee: fields.consignee,
        phone: fields.phone,
        province: fields.province,
        city: fields.city,
        district: fields.district,
        detail: fields.detail,
        zip_code: fields.zip_code,
        tag: fields.tag as 'home' | 'office' | 'company' | 'other',
        is_default: fields.is_default,
      },
    );
    hide();
    message.success('更新成功');
    return true;
  } catch {
    hide();
    message.error('更新失败，请重试');
    return false;
  }
};

/**
 * 删除地址
 */
const handleRemove = async (selectedRows: API.Address[]): Promise<boolean> => {
  const hide = message.loading('正在删除');
  if (!selectedRows.length) return true;
  try {
    await Promise.all(
      selectedRows.map((row) => deleteAddressesId({ id: row.id || 0 })),
    );
    hide();
    message.success('删除成功');
    return true;
  } catch {
    hide();
    message.error('删除失败，请重试');
    return false;
  }
};

const AddressList: React.FC = () => {
  const [createModalVisible, handleModalVisible] = useState<boolean>(false);
  const [updateModalVisible, handleUpdateModalVisible] =
    useState<boolean>(false);
  const [stepFormValues, setStepFormValues] = useState<FormValueType>({});
  const actionRef = useRef<ActionType>();

  const columns: ProColumns<API.Address>[] = [
    {
      title: 'ID',
      dataIndex: 'id',
      hideInForm: true,
      hideInSearch: true,
      width: 60,
    },
    {
      title: '收货人',
      dataIndex: 'consignee',
      width: 100,
      formItemProps: { rules: [{ required: true, message: '请输入收货人' }] },
    },
    {
      title: '手机号',
      dataIndex: 'phone',
      width: 130,
    },
    {
      title: '所在地区',
      dataIndex: 'province',
      width: 200,
      hideInSearch: true,
      render: (_, record) =>
        [record.province, record.city, record.district]
          .filter(Boolean)
          .join(' '),
    },
    {
      title: '详细地址',
      dataIndex: 'detail',
      ellipsis: true,
      hideInSearch: true,
    },
    {
      title: '标签',
      dataIndex: 'tag',
      width: 80,
      render: (_, record) => {
        const color = tagColorMap[record.tag || ''] || 'default';
        return record.tag ? <Tag color={color}>{record.tag}</Tag> : '-';
      },
    },
    {
      title: '默认',
      dataIndex: 'is_default',
      width: 60,
      render: (_, record) =>
        record.is_default ? <Tag color="blue">是</Tag> : '-',
    },
    {
      title: '创建时间',
      dataIndex: 'created_at',
      hideInForm: true,
      hideInSearch: true,
      valueType: 'dateTime',
      width: 160,
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      width: 160,
      fixed: 'right',
      render: (_, record) => (
        <div style={{ paddingLeft: 8, whiteSpace: 'nowrap' }}>
          <a
            onClick={() => {
              setStepFormValues(record);
              handleUpdateModalVisible(true);
            }}
          >
            编辑
          </a>
          <Auth permission="canDeleteAddress">
            <Divider type="vertical" />
            <Popconfirm
              title="确认删除"
              description={`确定要删除该地址吗？`}
              onConfirm={async () => {
                const success = await handleRemove([record]);
                if (success) {
                  actionRef.current?.reloadAndRest?.();
                }
              }}
            >
              <a style={{ color: '#ff4d4f' }}>删除</a>
            </Popconfirm>
          </Auth>
        </div>
      ),
    },
  ];

  return (
    <PageContainer
      header={{
        title: '地址管理',
        breadcrumb: { items: [{ title: '首页' }, { title: '地址管理' }] },
      }}
    >
      <ProTable<API.Address>
        headerTitle="地址列表"
        actionRef={actionRef}
        rowKey="id"
        scroll={{ x: 1100 }}
        search={false}
        toolBarRender={() => [
          <Auth key="create" permission="canCreateAddress">
            <Button type="primary" onClick={() => handleModalVisible(true)}>
              新建地址
            </Button>
          </Auth>,
        ]}
        request={async () => {
          const res = await getAddresses();
          const data = (res as any).data || {};
          return {
            data: data.list || [],
            total: data.total || 0,
            success: true,
          };
        }}
        columns={columns}
        pagination={{
          defaultPageSize: 10,
          showSizeChanger: true,
          pageSizeOptions: ['10', '20', '50'],
          showTotal: (total) => `共 ${total} 条`,
        }}
      />
      <CreateForm
        onCancel={() => handleModalVisible(false)}
        modalVisible={createModalVisible}
        onSubmit={async (value) => {
          const success = await handleAdd(value);
          if (success) {
            handleModalVisible(false);
            actionRef.current?.reload();
          }
          return success;
        }}
      />
      {stepFormValues && Object.keys(stepFormValues).length ? (
        <UpdateForm
          onSubmit={async (value) => {
            const success = await handleUpdate({
              ...value,
              id: stepFormValues.id,
            });
            if (success) {
              handleUpdateModalVisible(false);
              setStepFormValues({});
              actionRef.current?.reload();
            }
          }}
          onCancel={() => {
            handleUpdateModalVisible(false);
            setStepFormValues({});
          }}
          updateModalVisible={updateModalVisible}
          values={stepFormValues as API.Address}
        />
      ) : null}
    </PageContainer>
  );
};

export default AddressList;
