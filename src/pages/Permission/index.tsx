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
  deletePermissionsId,
  getPermissions,
  postPermissions,
  putPermissionsId,
} from '@/services/api/permissions';
import CreateForm from './components/CreateForm';
import type { FormValueType } from './components/UpdateForm';
import UpdateForm from './components/UpdateForm';

const handleAdd = async (fields: API.CreatePermissionRequest) => {
  const hide = message.loading('正在创建');
  try {
    await postPermissions(fields);
    hide();
    message.success('创建成功');
    return true;
  } catch {
    hide();
    message.error('创建失败，请重试');
    return false;
  }
};

const handleUpdate = async (fields: FormValueType) => {
  const hide = message.loading('正在更新');
  try {
    await putPermissionsId(
      { id: String(fields.id) },
      {
        display_name: fields.display_name,
        category: fields.category,
        description: fields.description,
        sort: fields.sort,
        status: fields.status,
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

const handleRemove = async (selectedRows: API.Permission[]) => {
  const hide = message.loading('正在删除');
  if (!selectedRows.length) return true;

  try {
    await Promise.all(
      selectedRows.map((row) => deletePermissionsId({ id: String(row.id) })),
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

const categoryColor: Record<string, string> = {
  '商品管理': 'blue',
  '分类管理': 'cyan',
  '库存管理': 'gold',
  '订单管理': 'green',
  '购物车管理': 'lime',
  '支付管理': 'purple',
  '退款管理': 'volcano',
  '秒杀管理': 'red',
  '评论管理': 'orange',
  '通知管理': 'geekblue',
  '用户管理': 'magenta',
  '权限管理': 'purple',
};

const PermissionList: React.FC = () => {
  const [createModalVisible, handleModalVisible] = useState<boolean>(false);
  const [updateModalVisible, handleUpdateModalVisible] =
    useState<boolean>(false);
  const [stepFormValues, setStepFormValues] = useState<FormValueType>({});
  const actionRef = useRef<ActionType>();
  const [row, setRow] = useState<API.Permission>();
  const [selectedRowsState, setSelectedRows] = useState<API.Permission[]>([]);

  const columns: ProColumns<API.Permission>[] = [
    {
      title: 'ID',
      dataIndex: 'id',
      hideInForm: true,
      hideInSearch: true,
      width: 60,
      fixed: 'left',
    },
    {
      title: '权限名称',
      dataIndex: 'name',
      width: 180,
      ellipsis: true,
    },
    {
      title: '显示名称',
      dataIndex: 'display_name',
      width: 150,
    },
    {
      title: '资源',
      dataIndex: 'resource',
      width: 100,
    },
    {
      title: '操作',
      dataIndex: 'action',
      width: 100,
    },
    {
      title: '分类',
      dataIndex: 'category',
      width: 100,
      valueType: 'select',
      valueEnum: {
        '商品管理': { text: '商品管理' },
        '分类管理': { text: '分类管理' },
        '库存管理': { text: '库存管理' },
        '订单管理': { text: '订单管理' },
        '购物车管理': { text: '购物车管理' },
        '支付管理': { text: '支付管理' },
        '退款管理': { text: '退款管理' },
        '秒杀管理': { text: '秒杀管理' },
        '评论管理': { text: '评论管理' },
        '通知管理': { text: '通知管理' },
        '用户管理': { text: '用户管理' },
        '权限管理': { text: '权限管理' },
      },
      render: (_, record) =>
        record.category ? (
          <Tag color={categoryColor[record.category] || 'default'}>
            {record.category}
          </Tag>
        ) : (
          '-'
        ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 80,
      valueType: 'select',
      valueEnum: {
        1: { text: '启用', status: 'Success' },
        2: { text: '禁用', status: 'Error' },
      },
    },
    {
      title: '排序',
      dataIndex: 'sort',
      hideInSearch: true,
      width: 60,
    },
    {
      title: '描述',
      dataIndex: 'description',
      ellipsis: true,
      hideInSearch: true,
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
          <a onClick={() => setRow(record)}>查看</a>
          <Auth permission="canUpdatePermission">
            <Divider type="vertical" />
            <a
              onClick={() => {
                setStepFormValues(record);
                handleUpdateModalVisible(true);
              }}
            >
              编辑
            </a>
          </Auth>
          <Auth permission="canDeletePermission">
            <Divider type="vertical" />
            <Popconfirm
              title="确认删除"
              description={`确定要删除权限「${
                record.display_name || record.name
              }」吗？`}
              onConfirm={async () => {
                const success = await handleRemove([record]);
                if (success) {
                  actionRef.current?.reloadAndRest?.();
                  setSelectedRows([]);
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
        title: '权限管理',
        breadcrumb: {
          items: [{ title: '首页' }, { title: '权限管理' }],
        },
      }}
    >
      <ProTable<API.Permission>
        headerTitle="权限列表"
        actionRef={actionRef}
        rowKey="id"
        scroll={{ x: 1300 }}
        search={{
          labelWidth: 100,
          defaultCollapsed: false,
        }}
        toolBarRender={() => [
          <Auth key="create" permission="canCreatePermission">
            <Button
              type="primary"
              onClick={() => handleModalVisible(true)}
            >
              新建权限
            </Button>
          </Auth>,
        ]}
        request={async (params) => {
          const { current, pageSize, ...rest } = params;
          const res = await getPermissions({
            page: current || 1,
            size: pageSize || 10,
            ...rest,
          });
          const data = (res as any).data || {};
          return {
            data: data.permissions || [],
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
        <Auth permission="canDeletePermission">

        <FooterToolbar
          extra={
            <div>
              已选择{' '}
              <a style={{ fontWeight: 600 }}>{selectedRowsState.length}</a>{' '}
              项&nbsp;&nbsp;
            </div>
          }
        >
          <Popconfirm
            title="确认批量删除"
            description={`确定要删除选中的 ${selectedRowsState.length} 个权限吗？`}
            onConfirm={async () => {
              const success = await handleRemove(selectedRowsState);
              if (success) {
                setSelectedRows([]);
                actionRef.current?.reloadAndRest?.();
              }
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
          values={stepFormValues as API.Permission}
        />
      ) : null}

      <Drawer
        width={600}
        open={!!row}
        onClose={() => setRow(undefined)}
        closable
        title={row?.display_name || '权限详情'}
      >
        {row?.name && (
          <ProDescriptions<API.Permission>
            column={2}
            title={row?.display_name}
            request={async () => ({ data: row || {} })}
            params={{ id: row?.name }}
            columns={columns as any}
          />
        )}
      </Drawer>
    </PageContainer>
  );
};

export default PermissionList;
