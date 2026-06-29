import type { ActionType, ProColumns } from '@ant-design/pro-components';
import {
  FooterToolbar,
  PageContainer,
  ProDescriptions,
  ProTable,
} from '@ant-design/pro-components';
import { Button, Divider, Drawer, message, Popconfirm } from 'antd';
import React, { useRef, useState } from 'react';

import Auth from '@/components/Auth';
import CacheWarmup from '@/components/CacheWarmup';

import {
  deleteCategoriesId,
  getCategoriesAll,
  postCategories,
  postCategoriesCacheWarmup,
  putCategoriesId,
} from '@/services/api/categories';
import CreateForm from './components/CreateForm';
import UpdateForm from './components/UpdateForm';

import CategoryAttributeModal from './components/CategoryAttributeModal';
import type { FormValueType } from './components/UpdateForm';
import useRootCategory from './hooks/useRootCategories';

/**
 * 新增分类
 */
const handleAdd = async (fields: API.CreateCategoryReq) => {
  const hide = message.loading('正在创建');
  try {
    await postCategories({
      name: fields.name,
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
  const [attrModalVisible, setAttrModalVisible] = useState(false);
  const [attrCategoryId, setAttrCategoryId] = useState(0);
  const [attrCategoryName, setAttrCategoryName] = useState('');

  const rootCategories = useRootCategory(true);

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
      title: '父分类',
      dataIndex: 'parent_id',
      width: 150,
      render: (_, record) => {
        const parent = rootCategories.find((c) => c.value === record.parent_id);
        return parent ? parent.label : '-';
      },
      valueType: 'select',
      valueEnum: rootCategories.reduce((acc, cat) => {
        acc[cat.value] = cat.label;
        return acc;
      }, {} as Record<number, string>),
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
          <Auth permission="canUpdateCategory">
            <Divider type="vertical" />
            <a
              onClick={() => {
                setAttrCategoryId(record.id || 0);
                setAttrCategoryName(record.name || '');
                setAttrModalVisible(true);
              }}
            >
              配置属性
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
          <CacheWarmup
            key="warmup"
            label="预热分类"
            request={postCategoriesCacheWarmup}
          />,
          <Auth key="create" permission="canCreateCategory">
            <Button type="primary" onClick={() => handleModalVisible(true)}>
              新建分类
            </Button>
          </Auth>,
        ]}
        request={async (params) => {
          const { current, pageSize, name, parent_id } = params;
          const res = await getCategoriesAll();
          const data = (res as any).data || [];
          let list = data;
          if (name) {
            list = list.filter((c: API.Category) => c.name?.includes(name));
          }
          if (parent_id) {
            list = list.filter((c: API.Category) => c.parent_id === parent_id);
          }
          const total = list.length;
          const start = ((current || 1) - 1) * (pageSize || 10);
          return {
            data: list.slice(start, start + (pageSize || 10)),
            total,
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

      {/* 配置品类属性弹窗 */}
      <CategoryAttributeModal
        key={attrCategoryId}
        categoryId={attrCategoryId}
        categoryName={attrCategoryName}
        visible={attrModalVisible}
        onCancel={() => setAttrModalVisible(false)}
        onSuccess={() => actionRef.current?.reload()}
      />
    </PageContainer>
  );
};

export default CategoryList;
