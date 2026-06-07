import type { ActionType, ProColumns } from '@ant-design/pro-components';
import {
  FooterToolbar,
  PageContainer,
  ProDescriptions,
  ProTable,
} from '@ant-design/pro-components';
import { Button, Divider, Drawer, message, Popconfirm } from 'antd';
import React, { useRef, useState } from 'react';

import {
  deleteCategoriesId,
  getCategories,
  postCategories,
  putCategoriesId,
} from '@/services/api/categories';
import CreateForm from './components/CreateForm';
import UpdateForm from './components/UpdateForm';

import type { FormValueType } from './components/UpdateForm';

/**
 * 新增分类
 */
const handleAdd = async (fields: API.CreateCategoryDTO) => {
  const hide = message.loading('正在创建');
  try {
    await postCategories({
      name: fields.name,
      description: fields.description,
      parent_id: fields.parent_id,
    });
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
 * 更新分类
 */
const handleUpdate = async (fields: FormValueType) => {
  const hide = message.loading('正在更新');
  try {
    await putCategoriesId(
      { id: fields.id || 0 },
      {
        name: fields.name,
        description: fields.description,
        parent_id: fields.parent_id,
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
 * 删除分类
 */
const handleRemove = async (selectedRows: API.Category[]) => {
  const hide = message.loading('正在删除');
  if (!selectedRows.length) return true;

  try {
    await Promise.all(
      selectedRows.map((row) => deleteCategoriesId({ id: row.id || 0 })),
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

const CategoryList: React.FC = () => {
  const [createModalVisible, handleModalVisible] = useState<boolean>(false);
  const [updateModalVisible, handleUpdateModalVisible] =
    useState<boolean>(false);
  const [stepFormValues, setStepFormValues] = useState<FormValueType>({});
  const actionRef = useRef<ActionType>();
  const [row, setRow] = useState<API.Category>();
  const [selectedRowsState, setSelectedRows] = useState<API.Category[]>([]);

  const columns: ProColumns<API.Category>[] = [
    {
      title: 'ID',
      dataIndex: 'id',
      hideInForm: true,
      hideInSearch: true,
      width: 60,
    },
    {
      title: '分类名称',
      dataIndex: 'name',
      ellipsis: true,
      formItemProps: {
        rules: [{ required: true, message: '分类名称为必填项' }],
      },
    },
    {
      title: '描述',
      dataIndex: 'description',
      hideInSearch: true,
      ellipsis: true,
    },
    {
      title: '父分类',
      dataIndex: 'parent_id',
      hideInSearch: true,
      width: 120,
      render: (_, record) => record.parent?.name || '-',
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
      title: '更新时间',
      dataIndex: 'updated_at',
      hideInForm: true,
      hideInSearch: true,
      valueType: 'dateTime',
      width: 160,
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      width: 200,
      render: (_, record) => (
        <>
          <a onClick={() => setRow(record)}>查看</a>
          <Divider type="vertical" />
          <a
            onClick={() => {
              setStepFormValues(record as FormValueType);
              handleUpdateModalVisible(true);
            }}
          >
            编辑
          </a>
          <Divider type="vertical" />
          <Popconfirm
            title="确认删除"
            description={`确定要删除分类「${record.name}」吗？`}
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
        </>
      ),
    },
  ];

  return (
    <PageContainer
      header={{
        title: '分类管理',
        breadcrumb: {
          items: [{ title: '首页' }, { title: '分类管理' }],
        },
      }}
    >
      <ProTable<API.Category>
        headerTitle="分类列表"
        actionRef={actionRef}
        rowKey="id"
        search={{
          labelWidth: 100,
          defaultCollapsed: false,
        }}
        toolBarRender={() => [
          <Button
            key="create"
            type="primary"
            onClick={() => handleModalVisible(true)}
          >
            新建分类
          </Button>,
        ]}
        request={async (params) => {
          const { current, pageSize, name, ...rest } = params;
          const res = await getCategories({
            page: current || 1,
            size: pageSize || 10,
            name,
            ...rest,
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
            description={`确定要删除选中的 ${selectedRowsState.length} 个分类吗？`}
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
      )}

      {/* 新建弹窗 */}
      <CreateForm
        onCancel={() => handleModalVisible(false)}
        modalVisible={createModalVisible}
      >
        <ProTable<API.Category, API.CreateCategoryDTO>
          onSubmit={async (value) => {
            const success = await handleAdd(value);
            if (success) {
              handleModalVisible(false);
              actionRef.current?.reload();
            }
          }}
          rowKey="id"
          type="form"
          columns={columns}
        />
      </CreateForm>

      {/* 编辑弹窗 */}
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
          values={stepFormValues as API.Category}
        />
      ) : null}

      {/* 查看详情抽屉 */}
      <Drawer
        width={600}
        open={!!row}
        onClose={() => setRow(undefined)}
        closable
        title={row?.name || '分类详情'}
      >
        {row?.name && (
          <ProDescriptions<API.Category>
            column={2}
            title={row?.name}
            request={async () => ({ data: row || {} })}
            params={{ id: row?.name }}
            columns={columns as any}
          />
        )}
      </Drawer>
    </PageContainer>
  );
};

export default CategoryList;
