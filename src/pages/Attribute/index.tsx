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
  Table,
} from 'antd';
import React, { useEffect, useRef, useState } from 'react';

import Auth from '@/components/Auth';

import {
  deleteAttributesId,
  getAttributes,
  postAttributes,
  putAttributesId,
} from '@/services/api/attributes';
import {
  deleteAttributeValuesId,
  getAttributesIdValues,
  postAttributeValues,
  putAttributeValuesId,
} from '@/services/api/attributeValues';
import CreateForm from './components/CreateForm';
import UpdateForm from './components/UpdateForm';

import type { FormValueType } from './components/UpdateForm';

/**
 * 新增属性
 */
const handleAdd = async (fields: API.CreateAttributeDTO) => {
  const hide = message.loading('正在创建');
  try {
    await postAttributes(fields);
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
const handleUpdate = async (fields: FormValueType) => {
  const hide = message.loading('正在更新');
  try {
    await putAttributesId(
      { id: fields.id || 0 },
      { name: fields.name, sort_order: fields.sort_order },
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
const handleRemove = async (selectedRows: API.AttributeResponse[]) => {
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
  const actionRef = useRef<ActionType>();
  const [row, setRow] = useState<API.AttributeResponse>();
  const [selectedRowsState, setSelectedRows] = useState<
    API.AttributeResponse[]
  >([]);

  // 属性值管理状态
  const [attrValues, setAttrValues] = useState<API.AttributeValueResponse[]>(
    [],
  );
  const [valuesLoading, setValuesLoading] = useState(false);
  const [valueModalVisible, setValueModalVisible] = useState(false);
  const [editingValue, setEditingValue] =
    useState<API.AttributeValueResponse | null>(null);
  const [valueInput, setValueInput] = useState('');
  const [valueSortOrder, setValueSortOrder] = useState<number | undefined>(
    undefined,
  );
  const [savingValue, setSavingValue] = useState(false);

  const fetchAttrValues = async (attributeId: number) => {
    setValuesLoading(true);
    try {
      const res = await getAttributesIdValues({ id: attributeId });
      const data = (res as any).data || [];
      setAttrValues(data);
    } catch {
      message.error('获取属性值列表失败');
    } finally {
      setValuesLoading(false);
    }
  };

  useEffect(() => {
    if (row?.id) {
      fetchAttrValues(row.id);
    } else {
      setAttrValues([]);
    }
  }, [row?.id]);

  // 新建/编辑属性值
  const handleValueSubmit = async () => {
    if (!valueInput.trim()) {
      message.warning('请输入属性值');
      return;
    }
    setSavingValue(true);
    try {
      if (editingValue) {
        await putAttributeValuesId(
          { id: editingValue.id || 0 },
          {
            value: valueInput.trim(),
            sort_order: valueSortOrder,
          },
        );
        message.success('属性值更新成功');
      } else {
        await postAttributeValues({
          attribute_id: row!.id!,
          value: valueInput.trim(),
          sort_order: valueSortOrder,
        });
        message.success('属性值创建成功');
      }
      setValueModalVisible(false);
      setEditingValue(null);
      setValueInput('');
      setValueSortOrder(undefined);
      if (row?.id) fetchAttrValues(row.id);
    } catch {
      message.error(
        editingValue ? '属性值更新失败，请重试' : '属性值创建失败，请重试',
      );
    } finally {
      setSavingValue(false);
    }
  };

  // 删除属性值
  const handleValueRemove = async (valueRecord: API.AttributeValueResponse) => {
    const hide = message.loading('正在删除');
    try {
      await deleteAttributeValuesId({ id: valueRecord.id || 0 });
      hide();
      message.success('属性值删除成功');
      if (row?.id) fetchAttrValues(row.id);
    } catch {
      hide();
      message.error('属性值删除失败，请重试');
    }
  };

  const openValueModal = (record?: API.AttributeValueResponse) => {
    if (record) {
      setEditingValue(record);
      setValueInput(record.value || '');
      setValueSortOrder(record.sort_order);
    } else {
      setEditingValue(null);
      setValueInput('');
      setValueSortOrder(undefined);
    }
    setValueModalVisible(true);
  };

  const columns: ProColumns<API.AttributeResponse>[] = [
    {
      title: 'ID',
      dataIndex: 'id',
      hideInForm: true,
      hideInSearch: true,
      width: 60,
      fixed: 'left',
    },
    {
      title: '属性名称',
      dataIndex: 'name',
      ellipsis: true,
      width: 200,
      formItemProps: {
        rules: [{ required: true, message: '属性名称为必填项' }],
      },
    },
    {
      title: '排序',
      dataIndex: 'sort_order',
      hideInSearch: true,
      width: 100,
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

  // 属性值表格列
  const valueColumns = [
    {
      title: 'ID',
      dataIndex: 'id',
      width: 60,
    },
    {
      title: '属性值',
      dataIndex: 'value',
    },
    {
      title: '排序',
      dataIndex: 'sort_order',
      width: 80,
    },
    {
      title: '创建时间',
      dataIndex: 'created_at',
      render: (v: string) => (v ? new Date(v).toLocaleString() : '-'),
      width: 160,
    },
    {
      title: '操作',
      width: 160,
      render: (_: any, record: API.AttributeValueResponse) => (
        <span>
          <a onClick={() => openValueModal(record)}>编辑</a>
          <Divider type="vertical" />
          <Popconfirm
            title="确认删除"
            description={`确定要删除属性值「${record.value}」吗？`}
            onConfirm={() => handleValueRemove(record)}
          >
            <a style={{ color: '#ff4d4f' }}>删除</a>
          </Popconfirm>
        </span>
      ),
    },
  ];

  return (
    <PageContainer
      header={{
        title: '属性管理',
        breadcrumb: {
          items: [{ title: '首页' }, { title: '属性管理' }],
        },
      }}
    >
      <ProTable<API.AttributeResponse>
        headerTitle="属性列表"
        actionRef={actionRef}
        rowKey="id"
        scroll={{ x: 1300 }}
        search={{
          labelWidth: 100,
          defaultCollapsed: false,
        }}
        toolBarRender={() => [
          <Auth key="create" permission="canCreateAttribute">
            <Button type="primary" onClick={() => handleModalVisible(true)}>
              新建属性
            </Button>
          </Auth>,
        ]}
        request={async (params) => {
          const { current, pageSize, ...rest } = params;
          const res = await getAttributes({
            page: current || 1,
            size: pageSize || 10,
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
        pagination={{
          defaultPageSize: 10,
          showSizeChanger: true,
          showQuickJumper: true,
          pageSizeOptions: ['10', '20', '50'],
          showTotal: (total) => `共 ${total} 条`,
        }}
      />

      {selectedRowsState?.length > 0 && (
        <Auth permission="canDeleteAttribute">
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
              description={`确定要删除选中的 ${selectedRowsState.length} 个属性吗？`}
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
          values={stepFormValues as API.AttributeResponse}
        />
      ) : null}

      {/* 查看详情抽屉（含属性值管理） */}
      <Drawer
        width={700}
        open={!!row}
        onClose={() => setRow(undefined)}
        closable
        title={row?.name || '属性详情'}
      >
        {row?.name && (
          <>
            <ProDescriptions<API.AttributeResponse>
              column={2}
              title="基本信息"
              request={async () => ({ data: row || {} })}
              params={{ id: row?.name }}
              columns={columns as any}
            />
            <Divider />
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 12,
              }}
            >
              <strong>属性值列表</strong>
              <Button
                type="primary"
                size="small"
                onClick={() => openValueModal()}
              >
                新增属性值
              </Button>
            </div>
            <Table
              rowKey="id"
              loading={valuesLoading}
              dataSource={attrValues}
              columns={valueColumns}
              pagination={false}
              locale={{ emptyText: '暂无属性值' }}
            />
          </>
        )}
      </Drawer>

      {/* 新建/编辑属性值弹窗 */}
      <Modal
        title={editingValue ? '编辑属性值' : '新增属性值'}
        width={480}
        open={valueModalVisible}
        onOk={handleValueSubmit}
        onCancel={() => {
          setValueModalVisible(false);
          setEditingValue(null);
          setValueInput('');
          setValueSortOrder(undefined);
        }}
        confirmLoading={savingValue}
        destroyOnClose
      >
        <div style={{ padding: '16px 0' }}>
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', marginBottom: 6, color: '#666' }}>
              属性值名称
            </label>
            <input
              style={{
                width: '100%',
                height: 40,
                padding: '4px 12px',
                border: '1px solid #d9d9d9',
                borderRadius: 6,
                outline: 'none',
                fontSize: 14,
              }}
              placeholder="请输入属性值，如：红色"
              value={valueInput}
              onChange={(e) => setValueInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleValueSubmit();
              }}
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: 6, color: '#666' }}>
              排序
            </label>
            <input
              type="number"
              style={{
                width: '100%',
                height: 40,
                padding: '4px 12px',
                border: '1px solid #d9d9d9',
                borderRadius: 6,
                outline: 'none',
                fontSize: 14,
              }}
              placeholder="数字越小越靠前"
              value={valueSortOrder ?? ''}
              onChange={(e) =>
                setValueSortOrder(
                  e.target.value ? Number(e.target.value) : undefined,
                )
              }
            />
          </div>
        </div>
      </Modal>
    </PageContainer>
  );
};

export default AttributeList;
