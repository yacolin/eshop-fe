import type { ActionType, ProColumns } from '@ant-design/pro-components';
import {
  FooterToolbar,
  PageContainer,
  ProTable,
} from '@ant-design/pro-components';
import {
  Button,
  Divider,
  Input,
  message,
  Popconfirm,
  Select,
  Space,
  Tag,
} from 'antd';
import React, { useCallback, useEffect, useRef, useState } from 'react';

import Auth from '@/components/Auth';
import LinkText from '@/components/LinkText';

import { getCategoriesIdBrands } from '@/services/api/categories';
import {
  deleteProductsId,
  getProducts,
  getProductsId,
  postProducts,
  putProductsId,
} from '@/services/api/products';
import CreateForm from './components/CreateForm';
import DetailForm from './components/DetailForm';
import UpdateForm from './components/UpdateForm';

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
const handleAdd = async (fields: API.CreateSPUReq) => {
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
        subtitle: fields.subtitle,
        main_image: fields.main_image,
        unit: fields.unit,
        sort_order: fields.sort_order,
        status: fields.status as 0 | 1 | 2 | 3 | 4,
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
const handleRemove = async (selectedRows: API.SPU[]) => {
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
  category_id?: number;
  brand_id?: number;
}

interface BrandOption {
  label: string;
  value: number;
}

const ProductList: React.FC = () => {
  const [createModalVisible, handleModalVisible] = useState<boolean>(false);
  const [updateModalVisible, handleUpdateModalVisible] =
    useState<boolean>(false);
  const [stepFormValues, setStepFormValues] = useState<FormValueType>({});
  const actionRef = useRef<ActionType>();
  const [row, setRow] = useState<API.SPU>();
  const [detailData, setDetailData] = useState<API.SPUDetailResponse>();
  const [selectedRowsState, setSelectedRows] = useState<API.SPU[]>([]);

  const categories = useCategoryOptions(true);

  // 品牌筛选联动：选中类目后加载对应品牌的选项
  const [brandOptions, setBrandOptions] = useState<BrandOption[]>([]);
  const [brandLoading, setBrandLoading] = useState(false);

  // 游标分页状态
  const [dataSource, setDataSource] = useState<API.SPU[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [cursor, setCursor] = useState<string | undefined>(undefined);
  const [hasMore, setHasMore] = useState(true);
  const [searchFilters, setSearchFilters] = useState<SearchFilters>({});

  /** 防重复请求锁 */
  const loadingRef = useRef(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const stateRef = useRef({
    hasMore: true,
    cursor: undefined as string | undefined,
    searchFilters: {} as SearchFilters,
  });

  useEffect(() => {
    stateRef.current = { hasMore, cursor, searchFilters };
  }, [hasMore, cursor, searchFilters]);

  const fetchData = useCallback(
    async (
      cursorVal: string | undefined,
      filters: SearchFilters,
      replace: boolean,
    ) => {
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
        const res = await getProducts({
          cursor: cursorVal,
          size: 20,
          ...filters,
        });
        const result: API.SPUListResult = (res as any).data || {};
        const list = result.list || [];
        if (replace) {
          setDataSource(list);
        } else {
          setDataSource((prev) => [...prev, ...list]);
        }
        setCursor(result.cursor || undefined);
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

  /** 挂载时给 wrapper 加 capture 阶段 scroll 监听 */
  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;
    let prevScrollTop = 0;

    const onScroll = (e: Event) => {
      const target = e.target as HTMLElement;
      // 过滤横向滚动：scrollTop 未变化时跳过
      if (target.scrollTop === prevScrollTop) return;
      prevScrollTop = target.scrollTop;

      const s = stateRef.current;
      if (!s.hasMore || loadingRef.current) return;
      if (target.scrollHeight - target.scrollTop - target.clientHeight < 100) {
        fetchDataRef.current(s.cursor, s.searchFilters, false);
      }
    };

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
    fetchData(undefined, searchFilters, true);
  }, [searchFilters, fetchData]);

  /** 类目变化时加载关联品牌选项，并清除已选品牌 */
  useEffect(() => {
    const catId = searchFilters.category_id;
    if (!catId) {
      setBrandOptions([]);
      setSearchFilters((prev) => ({ ...prev, brand_id: undefined }));
      return;
    }
    setBrandLoading(true);
    getCategoriesIdBrands({ id: catId })
      .then((res) => {
        const list = (res as any).data || [];
        setBrandOptions(
          list.map((b: API.CategoryBrandDetail) => ({
            label: b.brand_name || '',
            value: b.brand_id || 0,
          })),
        );
      })
      .catch(() => setBrandOptions([]))
      .finally(() => setBrandLoading(false));
  }, [searchFilters.category_id]);

  /** 搜索 */
  const handleSearch = (val: any, key: keyof SearchFilters) => {
    setSearchFilters((prev) => ({
      ...prev,
      [key]: val || undefined,
      ...(key === 'category_id' ? { brand_id: undefined } : {}),
    }));
  };

  /** 打开详情抽屉时拉取完整数据 */
  useEffect(() => {
    if (!row?.id) {
      setDetailData(undefined);
      return;
    }
    getProductsId({ id: row.id }).then((res) => {
      setDetailData((res as any).data);
    });
  }, [row?.id]);

  /** 刷新（重置到第一页） */
  const handleRefresh = (resetSelected = true) => {
    setCursor(undefined);
    setHasMore(true);
    if (resetSelected) {
      setSelectedRows([]);
    }
    fetchData(undefined, searchFilters, true);
  };

  const columns: ProColumns<API.SPU>[] = [
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
          path="/product/sku"
          state={{ product_id: record.id, product_name: record.name }}
        />
      ),
      formItemProps: {
        rules: [{ required: true, message: '商品名称为必填项' }],
      },
    },
    {
      title: '价格区间',
      dataIndex: 'min_price',
      hideInSearch: true,
      width: 250,
      render: (_, record) => {
        if (record.min_price === record.max_price) {
          return formatPrice(record.min_price);
        }
        return `${formatPrice(record.min_price)} ~ ${formatPrice(
          record.max_price,
        )}`;
      },
    },
    {
      title: '分类',
      dataIndex: 'category_id',
      hideInSearch: true,
      width: 150,
      render: (_, record) => {
        const cat = categories.find((c) => c.value === record.category_id);
        return cat ? <Tag>{cat.label}</Tag> : <Tag color="default">未分类</Tag>;
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
      width: 160,
      fixed: 'right',
      render: (_, record) => (
        <div style={{ paddingLeft: 8, whiteSpace: 'nowrap' }}>
          <a onClick={() => setRow(record)}>查看</a>
          <Auth permission="canUpdateProduct">
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
          <Auth permission="canDeleteProduct">
            <Divider type="vertical" />
            <Popconfirm
              title="确认删除"
              description={`确定要删除商品「${record.name}」吗？`}
              onConfirm={async () => {
                const success = await handleRemove([record]);
                if (success) {
                  handleRefresh();
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
      <div ref={wrapperRef}>
        <ProTable<API.SPU>
          headerTitle={
            <Space wrap>
              <Input.Search
                placeholder="商品名称"
                allowClear
                onSearch={(val) => handleSearch(val || undefined, 'name')}
                style={{ width: 200 }}
              />
              <Select
                placeholder="分类筛选"
                allowClear
                style={{ width: 150 }}
                options={categories}
                onChange={(val) => handleSearch(val, 'category_id')}
              />
              <Select
                placeholder="品牌筛选"
                allowClear
                style={{ width: 150 }}
                loading={brandLoading}
                options={brandOptions}
                disabled={!searchFilters.category_id}
                value={searchFilters.brand_id}
                onChange={(val) => handleSearch(val, 'brand_id')}
              />
            </Space>
          }
          actionRef={actionRef}
          rowKey="id"
          dataSource={dataSource}
          loading={loading}
          virtual
          scroll={{ x: 1300, y: 500 }}
          search={false}
          options={false}
          toolBarRender={() => [
            <Auth key="create" permission="canCreateProduct">
              <Button type="primary" onClick={() => handleModalVisible(true)}>
                新建商品
              </Button>
            </Auth>,
          ]}
          columns={columns}
          rowSelection={{
            columnWidth: 40,
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
                  handleRefresh(true);
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
          values={stepFormValues as API.SPU}
        />
      ) : null}

      {/* 查看详情抽屉 */}
      <DetailForm
        open={!!row}
        data={detailData}
        onClose={() => setRow(undefined)}
      />
    </PageContainer>
  );
};

export default ProductList;
