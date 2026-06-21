import type { ActionType, ProColumns } from '@ant-design/pro-components';
import {
  PageContainer,
  ProDescriptions,
  ProTable,
} from '@ant-design/pro-components';
import {
  Button,
  Divider,
  Drawer,
  Dropdown,
  message,
  Popconfirm,
  Tag,
} from 'antd';
import dayjs from 'dayjs';
import React, { useRef, useState } from 'react';

import Auth from '@/components/Auth';
import {
  getPromotions,
  postAdminPromotions,
  putAdminPromotionsId,
  putAdminPromotionsIdStatus,
} from '@/services/api/promotions';
import CreateForm from './components/CreateForm';
import type { FormValueType } from './components/UpdateForm';
import UpdateForm from './components/UpdateForm';

const formatTime = (t?: string | number) => {
  if (t === undefined || t === null) return '-';
  if (typeof t === 'number') return dayjs(t).format('YYYY-MM-DD HH:mm');
  return t ? t.slice(0, 16).replace('T', ' ') : '-';
};

const flashStatusMap: Record<string, { text: string; color: string }> = {
  pending: { text: '待开始', color: 'default' },
  active: { text: '抢购中', color: 'volcano' },
  finished: { text: '已结束', color: 'purple' },
  cancelled: { text: '已取消', color: 'red' },
};

/**
 * 解析 rule JSON，提取折扣信息
 */
const parseRule = (rule?: string): Record<string, any> => {
  if (!rule) return {};
  try {
    return JSON.parse(rule);
  } catch {
    return {};
  }
};

const formatDiscount = (rule?: string) => {
  const r = parseRule(rule);
  if (r.discount) {
    return `${(r.discount * 100).toFixed(0)}%`;
  }
  return '-';
};

const formatStockLimit = (rule?: string) => {
  const r = parseRule(rule);
  return r.stock_limit ?? r.max_quantity ?? '-';
};

/**
 * 新增秒杀活动
 */
const handleAdd = async (fields: any) => {
  const hide = message.loading('正在创建');
  try {
    await postAdminPromotions({
      ...fields,
      promo_type: 'flash_sale',
      start_time: dayjs(fields.start_time).valueOf(),
      end_time: dayjs(fields.end_time).valueOf(),
      scope: fields.scope || 'all',
    } as any);
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
 * 更新秒杀活动
 */
const handleUpdate = async (fields: FormValueType) => {
  const hide = message.loading('正在更新');
  try {
    await putAdminPromotionsId({ id: fields.id || 0 }, {
      ...fields,
      start_time: fields.start_time
        ? dayjs(fields.start_time as any).valueOf()
        : undefined,
      end_time: fields.end_time
        ? dayjs(fields.end_time as any).valueOf()
        : undefined,
    } as any);
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
 * 更新状态
 */
const handleStatusChange = async (id: number, status: string) => {
  try {
    await putAdminPromotionsIdStatus({ id }, { status });
    message.success('状态更新成功');
    return true;
  } catch {
    message.error('状态更新失败');
    return false;
  }
};

const FlashSaleList: React.FC = () => {
  const [createModalVisible, handleCreateModalVisible] =
    useState<boolean>(false);
  const [updateModalVisible, handleUpdateModalVisible] =
    useState<boolean>(false);
  const [editRecord, setEditRecord] = useState<API.PromotionResponse>();
  const actionRef = useRef<ActionType>();
  const [row, setRow] = useState<API.PromotionResponse>();

  const columns: ProColumns<API.PromotionResponse>[] = [
    {
      title: 'ID',
      dataIndex: 'id',
      hideInSearch: true,
      width: 60,
    },
    {
      title: '活动名称',
      dataIndex: 'name',
      width: 200,
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 100,
      valueType: 'select',
      valueEnum: {
        pending: { text: '待开始', status: 'Default' },
        active: { text: '抢购中', status: 'Processing' },
        finished: { text: '已结束', status: 'Success' },
        cancelled: { text: '已取消', status: 'Error' },
      },
      render: (_, record) => {
        const cfg = flashStatusMap[record.status || ''];
        return cfg ? <Tag color={cfg.color}>{cfg.text}</Tag> : '-';
      },
    },
    {
      title: '折扣',
      dataIndex: 'rule',
      hideInSearch: true,
      width: 80,
      render: (_, record) => formatDiscount(record.rule),
    },
    {
      title: '限量',
      dataIndex: 'rule',
      hideInSearch: true,
      width: 80,
      render: (_, record) => formatStockLimit(record.rule),
    },
    {
      title: '开始时间',
      dataIndex: 'start_time',
      hideInSearch: true,
      width: 150,
      render: (_, record) => formatTime(record.start_time),
    },
    {
      title: '结束时间',
      dataIndex: 'end_time',
      hideInSearch: true,
      width: 150,
      render: (_, record) => formatTime(record.end_time),
    },
    {
      title: '创建时间',
      dataIndex: 'created_at',
      hideInForm: true,
      hideInSearch: true,
      width: 150,
      render: (_, record) => formatTime(record.created_at),
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
          <Auth permission="canUpdateFlashSale">
            <Divider type="vertical" />
            <a
              onClick={() => {
                setEditRecord(record);
                handleUpdateModalVisible(true);
              }}
            >
              编辑
            </a>
            <Divider type="vertical" />
            <Dropdown
              menu={{
                onClick: ({ key }) => {
                  handleStatusChange(record.id!, key).then((ok) => {
                    if (ok) actionRef.current?.reload();
                  });
                },
                items: [
                  { key: 'pending', label: '待开始' },
                  { key: 'active', label: '开启抢购' },
                  { key: 'finished', label: '结束' },
                  { key: 'cancelled', label: '取消' },
                ],
              }}
            >
              <a onClick={(e) => e.preventDefault()}>改状态</a>
            </Dropdown>
            <Divider type="vertical" />
            <Popconfirm
              title="确认取消"
              description={`确定要取消秒杀活动「${record.name}」吗？`}
              onConfirm={async () => {
                const ok = await handleStatusChange(record.id!, 'cancelled');
                if (ok) actionRef.current?.reload();
              }}
            >
              <a style={{ color: '#ff4d4f' }}>取消</a>
            </Popconfirm>
          </Auth>
        </div>
      ),
    },
  ];

  return (
    <PageContainer
      header={{
        title: '秒杀管理',
        breadcrumb: {
          items: [{ title: '首页' }, { title: '秒杀管理' }],
        },
      }}
    >
      <ProTable<API.PromotionResponse>
        headerTitle="秒杀活动列表"
        actionRef={actionRef}
        rowKey="id"
        scroll={{ x: 1200 }}
        search={{
          labelWidth: 100,
          defaultCollapsed: false,
        }}
        toolBarRender={() => [
          <Auth key="create" permission="canCreateFlashSale">
            <Button
              type="primary"
              onClick={() => handleCreateModalVisible(true)}
            >
              新建秒杀
            </Button>
          </Auth>,
        ]}
        request={async (params) => {
          const { current, pageSize, ...rest } = params;
          const res = await getPromotions({
            page: current || 1,
            page_size: pageSize || 10,
            ...rest,
          });
          const data = (res as any).data || {};
          let list = data.list || [];
          // 客户端过滤 promo_type=flash_sale（服务端未来支持后移除）
          list = list.filter((item: any) => item.promo_type === 'flash_sale');
          return {
            data: list,
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

      {/* 新建 */}
      <CreateForm
        modalVisible={createModalVisible}
        onCancel={() => handleCreateModalVisible(false)}
        onSubmit={async (value) => {
          const success = await handleAdd(value);
          if (success) {
            handleCreateModalVisible(false);
            actionRef.current?.reload();
          }
          return success;
        }}
      />

      {/* 编辑 */}
      {editRecord && (
        <UpdateForm
          onSubmit={async (value) => {
            const success = await handleUpdate({
              ...value,
              id: editRecord.id,
            });
            if (success) {
              handleUpdateModalVisible(false);
              setEditRecord(undefined);
              actionRef.current?.reload();
            }
          }}
          onCancel={() => {
            handleUpdateModalVisible(false);
            setEditRecord(undefined);
          }}
          updateModalVisible={updateModalVisible}
          values={editRecord}
        />
      )}

      {/* 详情 */}
      <Drawer
        width={600}
        open={!!row}
        onClose={() => setRow(undefined)}
        closable
        title={row?.name || '秒杀活动详情'}
      >
        {row?.id && (
          <ProDescriptions<API.PromotionResponse>
            column={2}
            title={row.name}
            request={async () => ({ data: row || {} })}
            params={{ id: row?.id }}
            columns={columns as any}
          />
        )}
      </Drawer>
    </PageContainer>
  );
};

export default FlashSaleList;
