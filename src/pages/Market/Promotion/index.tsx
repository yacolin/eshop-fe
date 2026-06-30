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
  deletePromotionsId,
  getPromotions,
  postPromotions,
  putPromotionsId,
} from '@/services/api/promotions';
import CreateForm from './components/CreateForm';
import UpdateForm from './components/UpdateForm';

import type { FormValueType } from './components/UpdateForm';

const promoTypeMap: Record<number, { text: string; color: string }> = {
  1: { text: '满减', color: 'blue' },
  2: { text: '折扣', color: 'green' },
  3: { text: '秒杀', color: 'volcano' },
  4: { text: '优惠券', color: 'purple' },
  5: { text: '包邮', color: 'cyan' },
  6: { text: '赠品', color: 'orange' },
};

const statusMap: Record<number, { text: string; color: string }> = {
  1: { text: '未开始', color: '#999' },
  2: { text: '进行中', color: '#52c41a' },
  3: { text: '已结束', color: '#ff4d4f' },
  4: { text: '已关闭', color: '#999' },
};

/**
 * 新增促销
 */
const handleAdd = async (fields: API.CreatePromotionReq): Promise<boolean> => {
  const hide = message.loading('正在创建');
  try {
    await postPromotions(fields);
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
 * 更新促销
 */
const handleUpdate = async (fields: FormValueType): Promise<boolean> => {
  const hide = message.loading('正在更新');
  try {
    await putPromotionsId(
      { id: fields.id || 0 },
      {
        promo_name: fields.promo_name,
        start_time: fields.start_time,
        end_time: fields.end_time,
        status: fields.status as 1 | 2 | 3 | 4,
        total_quantity: fields.total_quantity,
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
 * 删除促销
 */
const handleRemove = async (
  selectedRows: API.Promotion[],
): Promise<boolean> => {
  const hide = message.loading('正在删除');
  if (!selectedRows.length) return true;
  try {
    await Promise.all(
      selectedRows.map((row) => deletePromotionsId({ id: row.id || 0 })),
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

const PromotionList: React.FC = () => {
  const [createModalVisible, handleModalVisible] = useState<boolean>(false);
  const [updateModalVisible, handleUpdateModalVisible] =
    useState<boolean>(false);
  const [stepFormValues, setStepFormValues] = useState<FormValueType>({});
  const actionRef = useRef<ActionType>();
  const [row, setRow] = useState<API.Promotion>();
  const [selectedRowsState, setSelectedRows] = useState<API.Promotion[]>([]);

  const columns: ProColumns<API.Promotion>[] = [
    {
      title: 'ID',
      dataIndex: 'id',
      hideInForm: true,
      hideInSearch: true,
      width: 60,
      fixed: 'left',
    },
    {
      title: '活动名称',
      dataIndex: 'promo_name',
      width: 200,
      formItemProps: { rules: [{ required: true, message: '请输入活动名称' }] },
    },
    {
      title: '类型',
      dataIndex: 'promo_type',
      width: 100,
      render: (_, record) => {
        const cfg = promoTypeMap[record.promo_type ?? -1];
        return cfg ? <Tag color={cfg.color}>{cfg.text}</Tag> : '-';
      },
      valueType: 'select',
      valueEnum: {
        1: { text: '满减', status: 'Default' },
        2: { text: '折扣', status: 'Processing' },
        3: { text: '秒杀', status: 'Warning' },
        4: { text: '优惠券', status: 'Default' },
        5: { text: '包邮', status: 'Default' },
        6: { text: '赠品', status: 'Default' },
      },
    },
    {
      title: '优惠码',
      dataIndex: 'promo_code',
      width: 120,
      hideInSearch: true,
      copyable: true,
    },
    {
      title: '总量',
      dataIndex: 'total_quantity',
      width: 60,
      hideInSearch: true,
    },
    {
      title: '已用',
      dataIndex: 'used_quantity',
      width: 60,
      hideInSearch: true,
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 100,
      render: (_, record) => {
        const cfg = statusMap[record.status ?? -1];
        return cfg ? <Tag color={cfg.color}>{cfg.text}</Tag> : '-';
      },
      valueType: 'select',
      valueEnum: {
        1: { text: '未开始', status: 'Default' },
        2: { text: '进行中', status: 'Success' },
        3: { text: '已结束', status: 'Error' },
        4: { text: '已关闭', status: 'Default' },
      },
    },
    {
      title: '开始时间',
      dataIndex: 'start_time',
      hideInSearch: true,
      valueType: 'dateTime',
      width: 160,
    },
    {
      title: '结束时间',
      dataIndex: 'end_time',
      hideInSearch: true,
      valueType: 'dateTime',
      width: 160,
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
          <Auth permission="canUpdatePromotion">
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
          <Auth permission="canDeletePromotion">
            <Divider type="vertical" />
            <Popconfirm
              title="确认删除"
              description={`确定要删除「${record.promo_name}」吗？`}
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
        title: '促销活动',
        breadcrumb: {
          items: [
            { title: '首页' },
            { title: '运营管理' },
            { title: '促销活动' },
          ],
        },
      }}
    >
      <ProTable<API.Promotion>
        headerTitle="活动列表"
        actionRef={actionRef}
        rowKey="id"
        scroll={{ x: 1300 }}
        search={{ labelWidth: 100, defaultCollapsed: false }}
        toolBarRender={() => [
          <Auth key="create" permission="canCreatePromotion">
            <Button type="primary" onClick={() => handleModalVisible(true)}>
              新建活动
            </Button>
          </Auth>,
        ]}
        request={async (params) => {
          const { current, pageSize, ...rest } = params;
          const res = await getPromotions({
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
        <Auth permission="canDeletePromotion">
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
              title="确认删除"
              description="确定要删除选中的活动吗？"
              onConfirm={async () => {
                await handleRemove(selectedRowsState);
                setSelectedRows([]);
                actionRef.current?.reloadAndRest?.();
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
          values={stepFormValues as API.Promotion}
        />
      ) : null}
      <Drawer
        width={600}
        open={!!row}
        onClose={() => setRow(undefined)}
        closable
        title={row?.promo_name || '活动详情'}
      >
        {row?.promo_name && (
          <ProDescriptions<API.Promotion>
            column={2}
            title={row?.promo_name}
            request={async () => ({ data: row || {} })}
            params={{ id: row?.id }}
            columns={columns as any}
          />
        )}
      </Drawer>
    </PageContainer>
  );
};

export default PromotionList;
