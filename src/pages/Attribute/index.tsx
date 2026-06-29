import type { ActionType } from '@ant-design/pro-components';
import { PageContainer, ProTable } from '@ant-design/pro-components';
import {
  Button,
  Divider,
  Drawer,
  message,
  Popconfirm,
  Select,
  Space,
  Tag,
  Typography,
} from 'antd';
import React, { useRef, useState } from 'react';

import Auth from '@/components/Auth';

import {
  deleteAttributesId,
  getAttributes,
  postAttributes,
  putAttributesId,
} from '@/services/api/attributes';
import { getCategoriesAll } from '@/services/api/categories';
import CreateForm from './components/CreateForm';
import UpdateForm from './components/UpdateForm';

import type { FormValueType } from './components/UpdateForm';

const inputTypeMap: Record<number, { text: string; color: string }> = {
  1: { text: '文本', color: 'blue' },
  2: { text: '单选', color: 'green' },
  3: { text: '多选', color: 'orange' },
  4: { text: '数字', color: 'purple' },
};

const statusMap: Record<number, { text: string; color: string }> = {
  1: { text: '启用', color: '#52c41a' },
  0: { text: '禁用', color: '#ff4d4f' },
};

/**
 * 创建属性
 */
const handleAdd = async (fields: API.CreateAttributeReq): Promise<boolean> => {
  const hide = message.loading('正在创建');
  try {
    await postAttributes({
      ...fields,
      values: fields.values || undefined,
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
 * 更新属性
 */
const handleUpdate = async (fields: FormValueType): Promise<boolean> => {
  const hide = message.loading('正在更新');
  try {
    await putAttributesId(
      { id: fields.id || 0 },
      {
        name: fields.name,
        input_type: fields.input_type as 1 | 2 | 3 | 4,
        is_sku_spec: fields.is_sku_spec as 0 | 1,
        required: fields.required as 0 | 1,
        searchable: fields.searchable as 0 | 1,
        sort_order: fields.sort_order,
        status: fields.status as 0 | 1,
        unit: fields.unit,
        values: fields.values,
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
 * 删除属性
 */
const handleRemove = async (
  selectedRows: API.Attribute[],
): Promise<boolean> => {
  const hide = message.loading('正在删除');
  if (!selectedRows.length) return true;
  try {
    await Promise.all(
      selectedRows.map((row) => deleteAttributesId({ id: row.id || 0 })),
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

const AttributeList: React.FC = () => {
  const [createModalVisible, handleModalVisible] = useState<boolean>(false);
  const [updateModalVisible, handleUpdateModalVisible] =
    useState<boolean>(false);
  const [stepFormValues, setStepFormValues] = useState<FormValueType>({});
  const [row, setRow] = useState<API.Attribute>();
  const [selectedCategory, setSelectedCategory] = useState<
    number | undefined
  >();
  const [categoryOptions, setCategoryOptions] = useState<
    { label: string; value: number }[]
  >([]);
  const actionRef = useRef<ActionType>();

  // 加载分类选项
  const loadCategoryOptions = async () => {
    const res = await getCategoriesAll();
    const list = (res as any).data || [];
    setCategoryOptions(
      list.map((c: API.Category) => ({
        label: c.name || '',
        value: c.id || 0,
      })),
    );
  };

  // 初始化分类选项
  React.useEffect(() => {
    loadCategoryOptions();
  }, []);

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      hideInForm: true,
      width: 60,
    },
    {
      title: '属性名',
      dataIndex: 'name',
      width: 150,
      formItemProps: {
        rules: [{ required: true, message: '请输入属性名称' }],
      },
    },
    {
      title: '输入类型',
      dataIndex: 'input_type',
      width: 100,
      render: (_: any, record: API.Attribute) => {
        const cfg = inputTypeMap[record.input_type ?? -1];
        return cfg ? <Tag color={cfg.color}>{cfg.text}</Tag> : '-';
      },
    },
    {
      title: '必填',
      dataIndex: 'required',
      width: 60,
      render: (_: any, record: API.Attribute) =>
        record.required ? <Tag color="blue">是</Tag> : <Tag>否</Tag>,
    },
    {
      title: '可搜索',
      dataIndex: 'searchable',
      width: 70,
      render: (_: any, record: API.Attribute) =>
        record.searchable ? <Tag color="green">是</Tag> : <Tag>否</Tag>,
    },
    {
      title: 'SKU规格',
      dataIndex: 'is_sku_spec',
      width: 80,
      render: (_: any, record: API.Attribute) =>
        record.is_sku_spec ? <Tag color="volcano">是</Tag> : <Tag>否</Tag>,
    },
    {
      title: '排序',
      dataIndex: 'sort_order',
      width: 60,
    },
    {
      title: '单位',
      dataIndex: 'unit',
      width: 60,
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 80,
      render: (_: any, record: API.Attribute) => {
        const cfg = statusMap[record.status ?? -1];
        return cfg ? <Tag color={cfg.color}>{cfg.text}</Tag> : '-';
      },
    },
    {
      title: '创建时间',
      dataIndex: 'created_at',
      hideInForm: true,
      valueType: 'dateTime',
      width: 160,
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      width: 140,
      fixed: 'right',
      render: (_: any, record: API.Attribute) => (
        <div style={{ paddingLeft: 8, whiteSpace: 'nowrap' }}>
          <a onClick={() => setRow(record)}>查看</a>
          <Auth permission="canUpdateAttribute">
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
          <Auth permission="canDeleteAttribute">
            <Divider type="vertical" />
            <Popconfirm
              title="确认删除"
              description={`确定要删除属性「${record.name}」吗？`}
              onConfirm={async () => {
                const success = await handleRemove([record]);
                if (success) {
                  actionRef.current?.reload();
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
        title: '属性管理',
        breadcrumb: { items: [{ title: '首页' }, { title: '属性管理' }] },
      }}
    >
      <ProTable<API.Attribute>
        headerTitle={
          <Select
            placeholder="选择分类查看属性"
            allowClear
            showSearch
            style={{ width: 300 }}
            value={selectedCategory}
            onChange={(val) => {
              setSelectedCategory(val);
              actionRef.current?.reload();
            }}
            options={categoryOptions}
            filterOption={(input, option) =>
              (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
            }
          />
        }
        actionRef={actionRef}
        rowKey="id"
        scroll={{ x: 1200 }}
        search={false}
        options={false}
        params={{ category_id: selectedCategory }}
        request={async (params) => {
          const { category_id } = params as { category_id?: number };
          if (!category_id) {
            return { data: [], total: 0, success: true };
          }
          const res = await getAttributes({ category_id });
          const list = (res as any).data || [];
          return { data: list, total: list.length, success: true };
        }}
        toolBarRender={() =>
          selectedCategory
            ? [
                <Auth key="create" permission="canCreateAttribute">
                  <Button
                    type="primary"
                    onClick={() => handleModalVisible(true)}
                  >
                    新建属性
                  </Button>
                </Auth>,
              ]
            : []
        }
        columns={columns}
        pagination={{
          defaultPageSize: 10,
          showSizeChanger: true,
          pageSizeOptions: ['10', '20', '50'],
          showTotal: (total) => `共 ${total} 条`,
        }}
      />

      <CreateForm
        categoryId={selectedCategory}
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
          values={stepFormValues as API.Attribute}
        />
      ) : null}

      <Drawer
        width={600}
        open={!!row}
        onClose={() => setRow(undefined)}
        closable
        title={row?.name || '属性详情'}
      >
        {row && (
          <Space direction="vertical">
            <Typography.Text strong>属性名: </Typography.Text>
            <Typography.Text>{row.name}</Typography.Text>
            <Typography.Text strong>输入类型: </Typography.Text>
            <Typography.Text>
              {inputTypeMap[row.input_type ?? -1]?.text || '-'}
            </Typography.Text>
            <Typography.Text strong>必填: </Typography.Text>
            <Typography.Text>{row.required ? '是' : '否'}</Typography.Text>
            <Typography.Text strong>可搜索: </Typography.Text>
            <Typography.Text>{row.searchable ? '是' : '否'}</Typography.Text>
            <Typography.Text strong>SKU规格: </Typography.Text>
            <Typography.Text>{row.is_sku_spec ? '是' : '否'}</Typography.Text>
            <Typography.Text strong>单位: </Typography.Text>
            <Typography.Text>{row.unit || '-'}</Typography.Text>
            <Typography.Text strong>可选值: </Typography.Text>
            <Typography.Text>{row.values || '-'}</Typography.Text>
            <Typography.Text strong>排序: </Typography.Text>
            <Typography.Text>{row.sort_order ?? '-'}</Typography.Text>
            <Typography.Text strong>状态: </Typography.Text>
            {(() => {
              const c = statusMap[row.status ?? -1];
              return c ? <Tag color={c.color}>{c.text}</Tag> : '-';
            })()}
          </Space>
        )}
      </Drawer>
    </PageContainer>
  );
};

export default AttributeList;
