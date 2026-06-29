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
  deleteCategoriesId,
  getCategories,
  getCategoriesAll,
  postCategories,
  putCategoriesId,
} from '@/services/api/categories';
import CreateForm from './components/CreateForm';
import type { FormValueType } from './components/UpdateForm';
import UpdateForm from './components/UpdateForm';

/**
 * 新增分类
 */
const handleAdd = async (fields: API.CreateCategoryReq) => {
  const hide = message.loading('正在创建');
  try {
    await postCategories({
      name: fields.name,
      parent_id: fields.parent_id,
      sort_order: fields.sort_order,
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
        sort_order: fields.sort_order,
        status: fields.status as 0 | 1,
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

const levelMap: Record<number, { text: string; color: string }> = {
  1: { text: '一级', color: 'blue' },
  2: { text: '二级', color: 'green' },
  3: { text: '三级', color: 'orange' },
};

const statusMap: Record<number, { text: string; color: string }> = {
  1: { text: '启用', color: '#52c41a' },
  0: { text: '禁用', color: '#ff4d4f' },
};

const CategoryList: React.FC = () => {
  const [createModalVisible, handleModalVisible] = useState<boolean>(false);
  const [updateModalVisible, handleUpdateModalVisible] =
    useState<boolean>(false);
  const [stepFormValues, setStepFormValues] = useState<FormValueType>({});
  const actionRef = useRef<ActionType>();
  const [row, setRow] = useState<API.Category>();
  const [selectedRowsState, setSelectedRows] = useState<API.Category[]>([]);
  const [categoryMap, setCategoryMap] = useState<Record<number, string>>({});

  // 加载全部分类用于父分类名称展示
  React.useEffect(() => {
    getCategoriesAll().then((res) => {
      const list = (res as any).data || [];
      const map: Record<number, string> = {};
      list.forEach((c: API.Category) => {
        if (c.id && c.name) map[c.id] = c.name;
      });
      setCategoryMap(map);
    });
  }, []);

  const columns: ProColumns<API.Category>[] = [
    {
      title: 'ID',
      dataIndex: 'id',
      hideInForm: true,
      hideInSearch: true,
      width: 60,
      fixed: 'left',
    },
    {
      title: '分类名称',
      dataIndex: 'name',
      ellipsis: true,
      width: 200,
      formItemProps: {
        rules: [{ required: true, message: '分类名称为必填项' }],
      },
    },
    {
      title: '层级',
      dataIndex: 'level',
      width: 80,
      hideInForm: true,
      render: (_, record) => {
        const cfg = levelMap[record.level ?? -1];
        return cfg ? <Tag color={cfg.color}>{cfg.text}</Tag> : '-';
      },
      valueType: 'select',
      valueEnum: {
        1: { text: '一级', status: 'Default' },
        2: { text: '二级', status: 'Processing' },
        3: { text: '三级', status: 'Warning' },
      },
    },
    {
      title: '父分类',
      dataIndex: 'parent_id',
      width: 150,
      hideInSearch: true,
      render: (_, record) => {
        return record.parent_id && categoryMap[record.parent_id]
          ? categoryMap[record.parent_id]
          : '-';
      },
    },
    {
      title: '排序',
      dataIndex: 'sort_order',
      hideInSearch: true,
      width: 60,
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 70,
      hideInForm: true,
      hideInSearch: true,
      render: (_, record) => {
        const cfg = statusMap[record.status ?? -1];
        return cfg ? <Tag color={cfg.color}>{cfg.text}</Tag> : '-';
      },
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
      width: 260,
      fixed: 'right',
      render: (_, record) => (
        <div style={{ paddingLeft: 8, whiteSpace: 'nowrap' }}>
          <a onClick={() => setRow(record)}>查看</a>
          <Auth permission="canUpdateCategory">
            <Divider type="vertical" />
            <a
              onClick={() => {
                setStepFormValues(record as FormValueType);
                handleUpdateModalVisible(true);
              }}
            >
              编辑
            </a>
          </Auth>
          <Auth permission="canDeleteCategory">
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
          </Auth>
        </div>
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
        scroll={{ x: 1300 }}
        search={{
          labelWidth: 100,
          defaultCollapsed: false,
        }}
        toolBarRender={() => [
          <Auth key="create" permission="canCreateCategory">
            <Button type="primary" onClick={() => handleModalVisible(true)}>
              新建分类
            </Button>
          </Auth>,
        ]}
        request={async (params) => {
          const { current, pageSize } = params;
          const { name, level } = params as {
            name?: string;
            level?: number;
          };
          const res = await getCategories({
            page: current || 1,
            size: pageSize || 10,
            ...(name ? { name } : {}),
            ...(level ? { level: Number(level) } : {}),
          });
          const result = (res as any).data as
            | { list?: API.Category[]; total?: number }
            | undefined;
          return {
            data: result?.list || [],
            total: result?.total || 0,
            success: true,
          };
        }}
        columns={columns}
        // rowSelection={{
        //   onChange: (_, selectedRows) => setSelectedRows(selectedRows),
        // }}
        pagination={{
          defaultPageSize: 10,
          showSizeChanger: true,
          showQuickJumper: true,
          pageSizeOptions: ['10', '20', '50'],
          showTotal: (total) => `共 ${total} 条`,
        }}
      />

      {selectedRowsState?.length > 0 && (
        <Auth permission="canDeleteCategory">
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
        </Auth>
      )}

      {/* 新建弹窗 */}
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
