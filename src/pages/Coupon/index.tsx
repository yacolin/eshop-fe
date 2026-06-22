import type { ActionType, ProColumns } from '@ant-design/pro-components';
import {
  PageContainer,
  ProDescriptions,
  ProTable,
} from '@ant-design/pro-components';
import { Button, Divider, Drawer, message, Popconfirm, Tag } from 'antd';
import dayjs from 'dayjs';
import React, { useRef, useState } from 'react';

import {
  getCoupons,
  postAdminCoupons,
  putAdminCouponsId,
} from '@/services/api/coupons';

import CreateForm from './components/CreateForm';
import type { FormValueType } from './components/UpdateForm';
import UpdateForm from './components/UpdateForm';

const formatPrice = (price?: number) => {
  if (price === undefined || price === null) return '-';
  return `¥${(price / 100).toFixed(2)}`;
};

const formatTime = (t?: string | number) => {
  if (t === undefined || t === null) return '-';
  if (typeof t === 'number') return dayjs(t).format('YYYY-MM-DD HH:mm');
  return t ? t.slice(0, 16).replace('T', ' ') : '-';
};

const couponTypeMap: Record<string, { text: string; color: string }> = {
  fixed: { text: '满减券', color: 'blue' },
  percentage: { text: '折扣券', color: 'green' },
  voucher: { text: '代金券', color: 'orange' },
};

const statusMap: Record<string, { text: string; color: string }> = {
  active: { text: '启用', color: 'green' },
  inactive: { text: '禁用', color: 'default' },
};

const scopeMap: Record<string, string> = {
  global: '全局',
  category: '指定分类',
  product: '指定商品',
};

/**
 * 新增优惠券
 */
const handleAdd = async (fields: API.CreateCouponDTO) => {
  try {
    await postAdminCoupons({
      ...fields,
      start_time: dayjs(fields.start_time as any).valueOf(),
      end_time: dayjs(fields.end_time as any).valueOf(),
    } as any);
    message.success('创建成功');
    return true;
  } catch {
    message.error('创建失败');
    return false;
  }
};

/**
 * 更新优惠券
 */
const handleUpdate = async (fields: FormValueType) => {
  try {
    await putAdminCouponsId({ id: fields.id || 0 }, {
      ...fields,
      start_time: fields.start_time
        ? dayjs(fields.start_time as any).valueOf()
        : undefined,
      end_time: fields.end_time
        ? dayjs(fields.end_time as any).valueOf()
        : undefined,
    } as any);
    message.success('更新成功');
    return true;
  } catch {
    message.error('更新失败');
    return false;
  }
};

const CouponList: React.FC = () => {
  const [createModalVisible, handleCreateModalVisible] =
    useState<boolean>(false);
  const [updateModalVisible, handleUpdateModalVisible] =
    useState<boolean>(false);
  const [editRecord, setEditRecord] = useState<API.CouponResponse>();
  const actionRef = useRef<ActionType>();
  const [row, setRow] = useState<API.CouponResponse>();

  const columns: ProColumns<API.CouponResponse>[] = [
    {
      title: 'ID',
      dataIndex: 'id',
      hideInSearch: true,
      width: 60,
    },
    {
      title: '名称',
      dataIndex: 'name',
      width: 180,
    },
    {
      title: '类型',
      dataIndex: 'coupon_type',
      width: 100,
      valueType: 'select',
      valueEnum: {
        fixed: { text: '满减券' },
        percentage: { text: '折扣券' },
        voucher: { text: '代金券' },
      },
      render: (_, record) => {
        const cfg = couponTypeMap[record.coupon_type || ''];
        return cfg ? <Tag color={cfg.color}>{cfg.text}</Tag> : '-';
      },
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 80,
      valueType: 'select',
      valueEnum: {
        active: { text: '启用', status: 'Success' },
        inactive: { text: '禁用', status: 'Default' },
      },
      render: (_, record) => {
        const cfg = statusMap[record.status || ''];
        return cfg ? <Tag color={cfg.color}>{cfg.text}</Tag> : '-';
      },
    },
    {
      title: '最低金额',
      dataIndex: 'min_amount',
      hideInSearch: true,
      width: 100,
      render: (_, record) => formatPrice(record.min_amount),
    },
    {
      title: '最大优惠',
      dataIndex: 'max_discount',
      hideInSearch: true,
      width: 100,
      render: (_, record) => formatPrice(record.max_discount),
    },
    {
      title: '总库存',
      dataIndex: 'total_stock',
      hideInSearch: true,
      width: 80,
      render: (_, record) => record.total_stock ?? '-',
    },
    {
      title: '剩余库存',
      dataIndex: 'remain_stock',
      hideInSearch: true,
      width: 80,
    },
    {
      title: '适用场景',
      dataIndex: 'scope',
      width: 100,
      valueType: 'select',
      valueEnum: {
        global: { text: '全局' },
        category: { text: '指定分类' },
        product: { text: '指定商品' },
      },
      render: (_, record) => scopeMap[record.scope || ''] || '-',
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
      width: 120,
      fixed: 'right',
      render: (_, record) => (
        <div style={{ paddingLeft: 8, whiteSpace: 'nowrap' }}>
          <a onClick={() => setRow(record)}>查看</a>
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
          <Popconfirm
            title="确认删除"
            description={`确定要删除优惠券「${record.name}」吗？`}
            onConfirm={async () => {
              try {
                await putAdminCouponsId(
                  { id: record.id! },
                  { status: 'inactive' },
                );
                message.success('已禁用');
                actionRef.current?.reload();
              } catch {
                message.error('操作失败');
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
        title: '优惠券管理',
        breadcrumb: {
          items: [{ title: '首页' }, { title: '优惠券管理' }],
        },
      }}
    >
      <ProTable<API.CouponResponse>
        headerTitle="优惠券列表"
        actionRef={actionRef}
        rowKey="id"
        scroll={{ x: 1400 }}
        search={{
          labelWidth: 100,
          defaultCollapsed: false,
        }}
        toolBarRender={() => [
          <Button
            key="create"
            type="primary"
            onClick={() => handleCreateModalVisible(true)}
          >
            新建优惠券
          </Button>,
        ]}
        request={async (params) => {
          const { current, pageSize, ...rest } = params;
          const res = await getCoupons({
            page: current || 1,
            page_size: pageSize || 10,
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
        title={row?.name || '优惠券详情'}
      >
        {row?.id && (
          <ProDescriptions<API.CouponResponse>
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

export default CouponList;
