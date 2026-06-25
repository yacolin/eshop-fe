import type { ActionType, ProColumns } from '@ant-design/pro-components';
import {
  FooterToolbar,
  PageContainer,
  ProDescriptions,
  ProTable,
} from '@ant-design/pro-components';
import { Button, Divider, Drawer, message, Popconfirm, Tag } from 'antd';
import React, { useRef, useState } from 'react';

import Auth from '@/components/Auth';
import {
  deleteAddressesId,
  getAddresses,
  postAddresses,
  putAddressesId,
} from '@/services/api/addresses';
import CreateForm from './components/CreateForm';
import type { FormValueType } from './components/UpdateForm';
import UpdateForm from './components/UpdateForm';

const formatFullAddress = (record: API.AddressResp) => {
  return [record.province, record.city, record.district, record.detail]
    .filter(Boolean)
    .join(' ');
};

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

const handleRemove = async (
  selectedRows: API.AddressResp[],
): Promise<boolean> => {
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
  const [row, setRow] = useState<API.AddressResp>();
  const [selectedRowsState, setSelectedRows] = useState<API.AddressResp[]>([]);
  const actionRef = useRef<ActionType>();

  const columns: ProColumns<API.AddressResp>[] = [
    {
      title: 'ID',
      dataIndex: 'id',
      hideInForm: true,
      hideInSearch: true,
      width: 60,
      fixed: 'left',
    },
    {
      title: '收货人',
      dataIndex: 'consignee',
      width: 100,
    },
    {
      title: '手机号',
      dataIndex: 'phone',
      width: 130,
    },
    {
      title: '详细地址',
      dataIndex: 'detail',
      hideInSearch: true,
      width: 280,
      render: (_, record) => formatFullAddress(record),
    },
    {
      title: '邮编',
      dataIndex: 'zip_code',
      hideInSearch: true,
      width: 100,
    },
    {
      title: '默认地址',
      dataIndex: 'is_default',
      hideInSearch: true,
      width: 100,
      render: (_, record) =>
        record.is_default ? <Tag color="#52c41a">默认</Tag> : <Tag>否</Tag>,
    },
    {
      title: '创建时间',
      dataIndex: 'created_at',
      valueType: 'dateTime',
      hideInForm: true,
      hideInSearch: true,
      width: 160,
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      width: 180,
      fixed: 'right',
      render: (_, record) => (
        <div style={{ paddingLeft: 8, whiteSpace: 'nowrap' }}>
          <a onClick={() => setRow(record)}>查看</a>
          <Auth permission="canUpdateAddress">
            <Divider type="vertical" />
            <a
              onClick={() => {
                handleUpdateModalVisible(true);
                setStepFormValues(record as FormValueType);
              }}
            >
              编辑
            </a>
          </Auth>
          <Auth permission="canDeleteAddress">
            <Divider type="vertical" />
            <Popconfirm
              title="确认删除"
              description={`确定要删除「${record.consignee}」的地址吗？`}
              onConfirm={() =>
                handleRemove([record]).then((ok) => {
                  if (ok) {
                    actionRef.current?.reloadAndRest?.();
                    setSelectedRows([]);
                  }
                })
              }
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
        breadcrumb: {
          items: [{ title: '首页' }, { title: '地址管理' }],
        },
      }}
    >
      <ProTable<API.AddressResp>
        headerTitle="地址列表"
        actionRef={actionRef}
        rowKey="id"
        scroll={{ x: 1100 }}
        search={{
          labelWidth: 100,
          defaultCollapsed: false,
        }}
        toolBarRender={() => [
          <Auth key="create" permission="canCreateAddress">
            <Button type="primary" onClick={() => handleModalVisible(true)}>
              新建地址
            </Button>
          </Auth>,
        ]}
        request={async (params) => {
          const { current, pageSize, ...rest } = params;
          const res = await getAddresses({
            params: { page: current || 1, size: pageSize || 10, ...rest },
          });
          const data = (res as any).data || {};
          return {
            data: data.list || [],
            total: data.total || 0,
            success: true,
          };
        }}
        columns={columns}
        rowSelection={{
          onChange: (_, selectedRows) => setSelectedRows(selectedRows),
        }}
        pagination={{
          defaultPageSize: 10,
          showSizeChanger: true,
          showQuickJumper: true,
          pageSizeOptions: ['10', '20', '50'],
          showTotal: (total) => `共 ${total} 条`,
        }}
      />

      {selectedRowsState?.length > 0 && (
        <Auth permission="canDeleteAddress">
          <FooterToolbar extra={`已选择 ${selectedRowsState.length} 项`}>
            <Popconfirm
              title="确认删除"
              description="确定要删除选中的地址吗？"
              onConfirm={() => {
                handleRemove(selectedRowsState).then((ok) => {
                  if (ok) {
                    actionRef.current?.reloadAndRest?.();
                    setSelectedRows([]);
                  }
                });
              }}
            >
              <Button danger>批量删除</Button>
            </Popconfirm>
          </FooterToolbar>
        </Auth>
      )}

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

      {stepFormValues && Object.keys(stepFormValues).length && (
        <UpdateForm
          onCancel={() => {
            handleUpdateModalVisible(false);
            setStepFormValues({});
          }}
          onSubmit={async (value) => {
            const success = await handleUpdate(value);
            if (success) {
              handleUpdateModalVisible(false);
              setStepFormValues({});
              actionRef.current?.reload();
            }
            return success;
          }}
          updateModalVisible={updateModalVisible}
          values={stepFormValues}
        />
      )}

      <Drawer
        width={600}
        open={!!row}
        onClose={() => setRow(undefined)}
        closable
        title={row ? `地址 #${row.id}` : '地址详情'}
      >
        {row?.id && (
          <ProDescriptions<API.AddressResp>
            column={2}
            title={`地址 #${row.id}`}
            request={async () => ({ data: row || {} })}
            params={{ id: row?.id }}
            columns={columns as any}
          />
        )}
      </Drawer>
    </PageContainer>
  );
};

export default AddressList;
