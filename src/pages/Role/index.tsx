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
  deleteRolesId,
  getRoles,
  postRoles,
  putRolesId,
} from '@/services/api/roles';
import { history } from '@umijs/max';
import CreateForm from './components/CreateForm';
import type { FormValueType } from './components/UpdateForm';
import UpdateForm from './components/UpdateForm';

const handleAdd = async (fields: API.CreateRoleRequest) => {
  const hide = message.loading('正在创建');
  try {
    await postRoles(fields);
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
    await putRolesId(
      { id: String(fields.id) },
      {
        display_name: fields.display_name,
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

const handleRemove = async (selectedRows: API.Role[]) => {
  const hide = message.loading('正在删除');
  if (!selectedRows.length) return true;

  try {
    await Promise.all(
      selectedRows.map((row) => deleteRolesId({ id: String(row.id) })),
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

const RoleList: React.FC = () => {
  const [createModalVisible, handleModalVisible] = useState<boolean>(false);
  const [updateModalVisible, handleUpdateModalVisible] =
    useState<boolean>(false);
  const [stepFormValues, setStepFormValues] = useState<FormValueType>({});
  const actionRef = useRef<ActionType>();
  const [row, setRow] = useState<API.Role>();
  const [selectedRowsState, setSelectedRows] = useState<API.Role[]>([]);

  const columns: ProColumns<API.Role>[] = [
    {
      title: 'ID',
      dataIndex: 'id',
      hideInForm: true,
      hideInSearch: true,
      width: 60,
      fixed: 'left',
    },
    {
      title: '角色名称',
      dataIndex: 'name',
      width: 150,
      ellipsis: true,
    },
    {
      title: '显示名称',
      dataIndex: 'display_name',
      width: 150,
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
      title: '系统角色',
      dataIndex: 'is_system',
      width: 100,
      hideInSearch: true,
      render: (_, record) =>
        record.is_system ? (
          <Tag color="red">系统内置</Tag>
        ) : (
          <Tag color="default">自定义</Tag>
        ),
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
      width: 260,
      fixed: 'right',
      render: (_, record) => (
        <div style={{ paddingLeft: 8, whiteSpace: 'nowrap' }}>
          <a onClick={() => setRow(record)}>查看</a>
          <Auth permission="canUpdateRole">
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
          <Auth permission="canUpdateRole">
            <Divider type="vertical" />
            <a
              onClick={() =>
                history.push(
                  `/user/role/assign-permission?roleId=${
                    record.id
                  }&roleName=${encodeURIComponent(
                    record.display_name || record.name || '',
                  )}`,
                )
              }
            >
              分配权限
            </a>
          </Auth>
          <Auth permission="canDeleteRole">
            <Divider type="vertical" />
            {record.is_system ? (
              <a style={{ color: '#ccc', cursor: 'not-allowed' }}>删除</a>
            ) : (
              <Popconfirm
                title="确认删除"
                description={`确定要删除角色「${
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
            )}
          </Auth>
        </div>
      ),
    },
  ];

  return (
    <PageContainer
      header={{
        title: '角色管理',
        breadcrumb: {
          items: [{ title: '首页' }, { title: '角色管理' }],
        },
      }}
    >
      <ProTable<API.Role>
        headerTitle="角色列表"
        actionRef={actionRef}
        rowKey="id"
        scroll={{ x: 1300 }}
        search={{
          labelWidth: 100,
          defaultCollapsed: false,
        }}
        toolBarRender={() => [
          <Auth key="create" permission="canCreateRole">
            <Button type="primary" onClick={() => handleModalVisible(true)}>
              新建角色
            </Button>
          </Auth>,
        ]}
        request={async (params) => {
          const { current, pageSize, ...rest } = params;
          const res = await getRoles({
            page: current || 1,
            page_size: pageSize || 10,
            ...rest,
          });
          const data = (res as any).data || {};
          return {
            data: data.roles || [],
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
        <Auth permission="canDeleteRole">
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
              description={`确定要删除选中的 ${selectedRowsState.length} 个角色吗？`}
              onConfirm={async () => {
                const hasSystem = selectedRowsState.some((r) => r.is_system);
                if (hasSystem) {
                  message.warning('系统内置角色不可删除');
                  return;
                }
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
          values={stepFormValues as API.Role}
        />
      ) : null}

      <Drawer
        width={600}
        open={!!row}
        onClose={() => setRow(undefined)}
        closable
        title={row?.display_name || '角色详情'}
      >
        {row?.name && (
          <ProDescriptions<API.Role>
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

export default RoleList;
