import type { ActionType, ProColumns } from '@ant-design/pro-components';
import {
  FooterToolbar,
  PageContainer,
  ProDescriptions,
  ProTable,
} from '@ant-design/pro-components';
import {
  Button,
  Divider,
  Drawer,
  message,
  Modal,
  Popconfirm,
  Tag,
  Tooltip,
} from 'antd';
import React, { useRef, useState } from 'react';

import Auth from '@/components/Auth';
import LinkText from '@/components/LinkText';

import {
  deleteProductsId,
  getProductsEnriched,
  postProducts,
  postProductsCacheWarmup,
  putProductsId,
} from '@/services/api/products';
import CreateForm from './components/CreateForm';
import UpdateForm from './components/UpdateForm';

import CacheWarmup from '@/components/CacheWarmup';
import useCategoryOptions from '../Category/hooks/useCategoryOptions';
import SkuMatrixEditor from './components/SkuMatrixEditor';
import type { FormValueType } from './components/UpdateForm';

/**
 * 格式化价格：分 → 元
 */
const formatPrice = (price?: number) => {
  if (price === undefined || price === null) return '-';
  return `¥${(price / 100).toFixed(2)}`;
};

/**
 * 新增商品
 */
const handleAdd = async (fields: API.CreateProductDTO) => {
  const hide = message.loading('正在创建');
  try {
    await postProducts(fields);
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
 * 更新商品
 */
const handleUpdate = async (fields: FormValueType) => {
  const hide = message.loading('正在更新');
  try {
    await putProductsId(
      { id: fields.id || 0 },
      {
        name: fields.name,
        description: fields.description,
        category_ids: fields.category_ids,
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
 * 删除商品
 */
const handleRemove = async (selectedRows: API.Product[]) => {
  const hide = message.loading('正在删除');
  if (!selectedRows.length) return true;

  try {
    await Promise.all(
      selectedRows.map((row) => deleteProductsId({ id: row.id || 0 })),
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

const ProductList: React.FC = () => {
  const [createModalVisible, handleModalVisible] = useState<boolean>(false);
  const [updateModalVisible, handleUpdateModalVisible] =
    useState<boolean>(false);
  const [stepFormValues, setStepFormValues] = useState<FormValueType>({});
  const actionRef = useRef<ActionType>();
  const [row, setRow] = useState<API.ProductWithCategoryDTO>();
  const [selectedRowsState, setSelectedRows] = useState<
    API.ProductWithCategoryDTO[]
  >([]);
  const [skuModalVisible, setSkuModalVisible] = useState(false);

  const categories = useCategoryOptions(true);

  const columns: ProColumns<API.ProductWithCategoryDTO>[] = [
    {
      title: 'ID',
      dataIndex: 'id',
      hideInForm: true,
      hideInSearch: true,
      width: 60,
      fixed: 'left',
    },
    {
      title: '商品名称',
      dataIndex: 'name',
      width: 200,
      ellipsis: true,
      render: (_, record) => (
        <LinkText
          value={record.name}
          path="/inventory/sku"
          state={{ product_id: record.id }}
        />
      ),
      formItemProps: {
        rules: [{ required: true, message: '商品名称为必填项' }],
      },
    },
    {
      title: '最低价格',
      dataIndex: 'min_price',
      hideInSearch: true,
      width: 120,
      render: (_, record) => formatPrice(record.min_price),
    },
    {
      title: '分类',
      dataIndex: 'categories',
      hideInSearch: true,
      width: 300,
      render: (_, record) => {
        if (!record.categories || record.categories.length === 0) {
          return <Tag color="default">未分类</Tag>;
        }
        const COLORS = [
          'blue',
          'gold',
          'green',
          'purple',
          'red',
          'cyan',
          'magenta',
        ];
        const isSingle = record.categories.length === 1;
        return record.categories.map((cat, index) => (
          <Tooltip key={cat.id} title={cat.name}>
            <Tag
              color={COLORS[index % COLORS.length]}
              style={
                isSingle
                  ? undefined
                  : {
                      maxWidth: 80,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }
              }
            >
              {cat.name}
            </Tag>
          </Tooltip>
        ));
      },
    },
    {
      title: '分类',
      dataIndex: 'category_id',
      valueType: 'select',
      valueEnum: categories.reduce((acc, category) => {
        acc[category.value] = category.label;
        return acc;
      }, {} as Record<number, string>),
      hideInTable: true,
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
      width: 160,
      fixed: 'right',
      render: (_, record) => (
        <div style={{ paddingLeft: 8, whiteSpace: 'nowrap' }}>
          <a onClick={() => setRow(record)}>查看</a>
          <Auth permission="canUpdateProduct">
            <Divider type="vertical" />
            <a
              onClick={() => {
                setStepFormValues({
                  ...record,
                  category_ids:
                    record.categories
                      ?.map((c) => c.id)
                      .filter((id): id is number => id !== undefined) ?? [],
                });
                handleUpdateModalVisible(true);
              }}
            >
              编辑
            </a>
          </Auth>
          <Auth permission="canDeleteProduct">
            <Divider type="vertical" />
            <Popconfirm
              title="确认删除"
              description={`确定要删除商品「${record.name}」吗？`}
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
        title: '商品管理',
        breadcrumb: {
          items: [{ title: '首页' }, { title: '商品管理' }],
        },
      }}
    >
      <ProTable<API.ProductWithCategoryDTO>
        headerTitle="商品列表"
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
            label="预热商品"
            request={postProductsCacheWarmup}
          />,
          <Auth key="create" permission="canCreateProduct">
            <Button type="primary" onClick={() => handleModalVisible(true)}>
              新建商品
            </Button>
          </Auth>,
        ]}
        request={async (params) => {
          const { current, pageSize, name, ...rest } = params;
          const res = await getProductsEnriched({
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
        <Auth permission="canDeleteProduct">
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
              description={`确定要删除选中的 ${selectedRowsState.length} 个商品吗？`}
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
          values={stepFormValues as API.ProductWithCategoryDTO}
        />
      ) : null}

      {/* 查看详情抽屉 */}
      <Drawer
        width={600}
        open={!!row}
        onClose={() => setRow(undefined)}
        closable
        title={row?.name || '商品详情'}
      >
        {row?.name && (
          <>
            <ProDescriptions<API.ProductWithCategoryDTO>
              column={2}
              title={row?.name}
              request={async () => ({ data: row || {} })}
              params={{ id: row?.name }}
              columns={columns as any}
            />
            <Divider />
            <div style={{ textAlign: 'center' }}>
              <Auth permission="canCreateSku">
                <Button type="primary" onClick={() => setSkuModalVisible(true)}>
                  SKU 管理
                </Button>
              </Auth>
            </div>
          </>
        )}
      </Drawer>

      {/* SKU 批量创建弹窗 */}
      <Modal
        title={`SKU 管理 - ${row?.name || ''}`}
        width={900}
        open={skuModalVisible}
        onCancel={() => setSkuModalVisible(false)}
        footer={null}
        destroyOnClose
      >
        {row?.id && (
          <SkuMatrixEditor
            productId={row.id}
            onSuccess={() => setSkuModalVisible(false)}
          />
        )}
      </Modal>
    </PageContainer>
  );
};

export default ProductList;
