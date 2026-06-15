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
  Input,
  message,
  Popconfirm,
  Select,
  Space,
  Tag,
  Tooltip,
} from 'antd';
import React, { useCallback, useEffect, useRef, useState } from 'react';

import LinkText from '@/components/LinkText';

import {
  deleteProductsId,
  getProductsCursor,
  postProducts,
  postProductsCacheWarmup,
  putProductsId,
} from '@/services/api/products';
import CreateForm from './components/CreateForm';
import UpdateForm from './components/UpdateForm';

import CacheWarmup from '@/components/CacheWarmup';
import useCategoryOptions from '../Category/hooks/useCategoryOptions';
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
    await postProducts({
      ...fields,
      price: Math.round(fields.price * 100),
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
        price: fields.price ? Math.round(fields.price * 100) : undefined,
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

/** 搜索过滤条件 */
interface SearchFilters {
  name?: string;
  sku?: string;
  category_id?: number;
}

const ProductCursorList: React.FC = () => {
  const [createModalVisible, handleModalVisible] = useState<boolean>(false);
  const [updateModalVisible, handleUpdateModalVisible] =
    useState<boolean>(false);
  const [stepFormValues, setStepFormValues] = useState<FormValueType>({});
  const actionRef = useRef<ActionType>();
  const [row, setRow] = useState<API.Product>();
  const [selectedRowsState, setSelectedRows] = useState<API.Product[]>([]);

  const categories = useCategoryOptions(true);

  // 游标分页状态
  const [dataSource, setDataSource] = useState<API.Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [cursor, setCursor] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [searchFilters, setSearchFilters] = useState<SearchFilters>({});

  /** 防重复请求锁 */
  const loadingRef = useRef(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const stateRef = useRef({
    hasMore: true,
    cursor: 0,
    searchFilters: {} as SearchFilters,
  });

  useEffect(() => {
    stateRef.current = { hasMore, cursor, searchFilters };
  }, [hasMore, cursor, searchFilters]);

  const fetchData = useCallback(
    async (cursorVal: number, filters: SearchFilters, replace: boolean) => {
      if (!replace) {
        if (loadingRef.current) return;
        loadingRef.current = true;
      }
      if (replace) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }
      try {
        const res = await getProductsCursor({
          cursor: cursorVal,
          size: 20,
          ...filters,
        });
        const result: API.ProductCursorResult = (res as any).data || {};
        const list = result.list || [];
        if (replace) {
          setDataSource(list);
        } else {
          setDataSource((prev) => [...prev, ...list]);
        }
        setCursor(result.next_cursor || 0);
        setHasMore(result.has_more || false);
      } finally {
        setLoading(false);
        setLoadingMore(false);
        loadingRef.current = false;
      }
    },
    [],
  );
  const fetchDataRef = useRef(fetchData);
  fetchDataRef.current = fetchData;

  /** 挂载时给 wrapper 加 capture 阶段 scroll 监听，捕获内部滚动容器的 scroll 事件 */
  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;

    const onScroll = (e: Event) => {
      const target = e.target as HTMLElement;
      const s = stateRef.current;
      if (!s.hasMore || loadingRef.current) return;
      if (target.scrollHeight - target.scrollTop - target.clientHeight < 100) {
        fetchDataRef.current(s.cursor, s.searchFilters, false);
      }
    };

    // capture: true — scroll 不冒泡但走捕获阶段
    wrapper.addEventListener('scroll', onScroll, {
      capture: true,
      passive: true,
    });

    return () => {
      wrapper.removeEventListener('scroll', onScroll, { capture: true });
    };
  }, []);

  /** 初始加载 & 搜索触发重新加载 */
  useEffect(() => {
    fetchData(0, searchFilters, true);
  }, [searchFilters, fetchData]);

  /** 搜索 */
  const handleSearch = (val: string, key: keyof SearchFilters) => {
    setSearchFilters((prev) => ({ ...prev, [key]: val || undefined }));
  };

  /** 刷新（重置到第一页） */
  const handleRefresh = (resetSelected = true) => {
    setCursor(0);
    setHasMore(true);
    if (resetSelected) {
      setSelectedRows([]);
    }
    fetchData(0, searchFilters, true);
  };

  const columns: ProColumns<API.Product>[] = [
    {
      title: 'ID',
      dataIndex: 'id',
      hideInForm: true,
      width: 60,
      fixed: 'left',
    },
    {
      title: '商品名称',
      dataIndex: 'name',
      ellipsis: true,
      width: 180,
      render: (_, record) => (
        <LinkText
          value={record.name}
          path="/inventory/inventory"
          state={{ product_name: record.name }}
        />
      ),
      formItemProps: {
        rules: [{ required: true, message: '商品名称为必填项' }],
      },
    },
    {
      title: 'SKU',
      dataIndex: 'sku',
      width: 150,
      render: (_, record) => (
        <LinkText
          value={record.sku}
          path="/inventory/inventory"
          state={{ sku: record.sku }}
        />
      ),
      formItemProps: {
        rules: [{ required: true, message: 'SKU 为必填项' }],
      },
    },
    {
      title: '价格',
      dataIndex: 'price',
      width: 100,
      render: (_, record) => formatPrice(record.price),
    },
    {
      title: '分类',
      dataIndex: 'categories',
      width: 170,
      render: (_, record) => {
        const cats = (record as any).categories as
          | API.ProductCategoryBrief[]
          | undefined;
        if (!cats || cats.length === 0) {
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
        const isSingle = cats.length === 1;
        return cats.map((cat, index) => (
          <Tooltip key={cat.id} title={cat.name}>
            <Tag
              color={COLORS[index % COLORS.length]}
              style={
                isSingle
                  ? undefined
                  : {
                      maxWidth: 72,
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
      title: '描述',
      dataIndex: 'description',
      width: 150,
      ellipsis: true,
    },
    {
      title: '创建时间',
      dataIndex: 'created_at',
      valueType: 'dateTime',
      width: 180,
    },
    {
      title: '更新时间',
      dataIndex: 'updated_at',
      valueType: 'dateTime',
      width: 180,
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      width: 140,
      fixed: 'right',
      render: (_, record) => (
        <div style={{ paddingLeft: 8, whiteSpace: 'nowrap' }}>
          <a onClick={() => setRow(record)}>查看</a>
          <Divider type="vertical" />
          <a
            onClick={() => {
              setStepFormValues({
                ...record,
                category_ids: [],
              });
              handleUpdateModalVisible(true);
            }}
          >
            编辑
          </a>
          <Divider type="vertical" />
          <Popconfirm
            title="确认删除"
            description={`确定要删除商品「${record.name}」吗？`}
            onConfirm={async () => {
              const success = await handleRemove([record]);
              if (success) {
                handleRefresh();
              }
            }}
          >
            <a style={{ color: '#ff4d4f' }}>删除</a>
          </Popconfirm>
        </div>
      ),
    },
  ];

  return (
    <PageContainer
      header={{
        title: '商品管理（游标分页）',
        breadcrumb: {
          items: [{ title: '首页' }, { title: '商品管理（游标分页）' }],
        },
      }}
    >
      <div ref={wrapperRef}>
        <ProTable<API.Product>
          headerTitle={
            <Space wrap>
              <Input.Search
                placeholder="商品名称"
                allowClear
                onSearch={(val) => handleSearch(val, 'name')}
                style={{ width: 200 }}
              />
              <Input.Search
                placeholder="SKU"
                allowClear
                onSearch={(val) => handleSearch(val, 'sku')}
                style={{ width: 180 }}
              />
              <Select
                placeholder="分类筛选"
                allowClear
                style={{ width: 150 }}
                options={categories}
                onChange={(val) => handleSearch(val, 'category_id')}
              />
            </Space>
          }
          actionRef={actionRef}
          rowKey="id"
          dataSource={dataSource}
          loading={loading}
          virtual
          scroll={{ x: 1500, y: 500 }}
          search={false}
          options={false}
          toolBarRender={() => [
            <CacheWarmup
              key="warmup"
              label="预热商品"
              request={postProductsCacheWarmup}
            />,
            <Button
              key="create"
              type="primary"
              onClick={() => handleModalVisible(true)}
            >
              新建商品
            </Button>,
          ]}
          columns={columns}
          rowSelection={{
            columnWidth: 48,
            onChange: (_, selectedRows) => setSelectedRows(selectedRows),
          }}
          pagination={false}
          footer={() => (
            <div style={{ textAlign: 'center' }}>
              {loadingMore && (
                <span style={{ color: '#999', fontSize: 13 }}>
                  正在加载更多数据...
                </span>
              )}
              {!hasMore && dataSource.length > 0 && (
                <span style={{ color: '#999', fontSize: 13 }}>
                  已加载全部 {dataSource.length} 条数据
                </span>
              )}
            </div>
          )}
        />
      </div>

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
            description={`确定要删除选中的 ${selectedRowsState.length} 个商品吗？`}
            onConfirm={async () => {
              const success = await handleRemove(selectedRowsState);
              if (success) {
                setSelectedRows([]);
                handleRefresh(true);
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
        onSubmit={async (value) => {
          const success = await handleAdd(value);
          if (success) {
            handleModalVisible(false);
            handleRefresh();
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
              handleRefresh();
            }
          }}
          onCancel={() => {
            handleUpdateModalVisible(false);
            setStepFormValues({});
          }}
          updateModalVisible={updateModalVisible}
          values={stepFormValues as API.Product}
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
          <ProDescriptions<API.Product>
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

export default ProductCursorList;
