import type { ActionType, ProColumns } from '@ant-design/pro-components';
import {
  PageContainer,
  ProDescriptions,
  ProForm,
  ProFormDateTimePicker,
  ProFormDigit,
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
  ProTable,
} from '@ant-design/pro-components';
import { Button, Divider, Drawer, message, Modal, Popconfirm, Tag } from 'antd';
import dayjs from 'dayjs';
import React, { useRef, useState } from 'react';

import {
  getCoupons,
  postAdminCoupons,
  putAdminCouponsId,
} from '@/services/api/coupons';

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
      <Modal
        title="新建优惠券"
        width={640}
        open={createModalVisible}
        onCancel={() => handleCreateModalVisible(false)}
        footer={null}
        destroyOnHidden
      >
        <ProForm<API.CreateCouponReq>
          layout="horizontal"
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 16 }}
          style={{ width: '90%', margin: '0 auto' }}
          onFinish={async (values) => {
            try {
              await postAdminCoupons({
                ...values,
                min_amount: values.min_amount,
                max_discount: values.max_discount,
                total_stock: values.total_stock,
                start_time: dayjs(values.start_time).valueOf(),
                end_time: dayjs(values.end_time).valueOf(),
              } as any);
              message.success('创建成功');
              handleCreateModalVisible(false);
              actionRef.current?.reload();
              return true;
            } catch {
              message.error('创建失败');
              return false;
            }
          }}
          submitter={{
            render: (_, dom) => (
              <div
                style={{
                  width: '100%',
                  display: 'flex',
                  justifyContent: 'flex-end',
                  gap: 8,
                }}
              >
                {dom}
              </div>
            ),
          }}
        >
          <ProFormText
            name="name"
            label="优惠券名称"
            rules={[{ required: true, message: '请输入名称' }]}
          />
          <ProFormSelect
            name="coupon_type"
            label="类型"
            rules={[{ required: true, message: '请选择类型' }]}
            options={[
              { label: '满减券', value: 'fixed' },
              { label: '折扣券', value: 'percentage' },
              { label: '代金券', value: 'voucher' },
            ]}
          />
          <ProFormDigit
            name="min_amount"
            label="最低金额（分）"
            rules={[{ required: true, message: '请输入最低金额' }]}
            fieldProps={{ min: 0, precision: 0 }}
            placeholder="单位：分"
          />
          <ProFormDigit
            name="max_discount"
            label="最大优惠（分）"
            fieldProps={{ min: 0, precision: 0 }}
            placeholder="单位：分，不限制留空"
          />
          <ProFormDigit
            name="total_stock"
            label="总库存"
            rules={[{ required: true, message: '请输入库存' }]}
            fieldProps={{ min: 1, precision: 0 }}
          />
          <ProFormSelect
            name="scope"
            label="适用场景"
            rules={[{ required: true, message: '请选择场景' }]}
            options={[
              { label: '全局', value: 'global' },
              { label: '指定分类', value: 'category' },
              { label: '指定商品', value: 'product' },
            ]}
          />
          <ProFormText
            name="scope_value"
            label="场景值"
            placeholder="分类ID或商品ID"
          />
          <ProFormDateTimePicker
            name="start_time"
            label="开始时间"
            rules={[{ required: true, message: '请选择开始时间' }]}
          />
          <ProFormDateTimePicker
            name="end_time"
            label="结束时间"
            rules={[{ required: true, message: '请选择结束时间' }]}
          />
          <ProFormTextArea name="description" label="描述" />
        </ProForm>
      </Modal>

      {/* 编辑 */}
      <Modal
        title="编辑优惠券"
        width={640}
        open={updateModalVisible}
        onCancel={() => {
          handleUpdateModalVisible(false);
          setEditRecord(undefined);
        }}
        footer={null}
        destroyOnHidden
      >
        <ProForm<API.UpdateCouponReq>
          layout="horizontal"
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 16 }}
          style={{ width: '90%', margin: '0 auto' }}
          initialValues={{
            ...editRecord,
            start_time: editRecord?.start_time
              ? dayjs(editRecord.start_time)
              : undefined,
            end_time: editRecord?.end_time
              ? dayjs(editRecord.end_time)
              : undefined,
          }}
          onFinish={async (values) => {
            try {
              await putAdminCouponsId({ id: editRecord!.id! }, {
                ...values,
                min_amount: values.min_amount,
                max_discount: values.max_discount,
                start_time: values.start_time
                  ? dayjs(values.start_time).valueOf()
                  : undefined,
                end_time: values.end_time
                  ? dayjs(values.end_time).valueOf()
                  : undefined,
              } as any);
              message.success('更新成功');
              handleUpdateModalVisible(false);
              setEditRecord(undefined);
              actionRef.current?.reload();
              return true;
            } catch {
              message.error('更新失败');
              return false;
            }
          }}
          submitter={{
            render: (_, dom) => (
              <div
                style={{
                  width: '100%',
                  display: 'flex',
                  justifyContent: 'flex-end',
                  gap: 8,
                }}
              >
                {dom}
              </div>
            ),
          }}
        >
          <ProFormText
            name="name"
            label="优惠券名称"
            rules={[{ required: true, message: '请输入名称' }]}
          />
          <ProFormDigit
            name="min_amount"
            label="最低金额（分）"
            fieldProps={{ min: 0, precision: 0 }}
          />
          <ProFormDigit
            name="max_discount"
            label="最大优惠（分）"
            fieldProps={{ min: 0, precision: 0 }}
          />
          <ProFormSelect
            name="scope"
            label="适用场景"
            options={[
              { label: '全局', value: 'global' },
              { label: '指定分类', value: 'category' },
              { label: '指定商品', value: 'product' },
            ]}
          />
          <ProFormText name="scope_value" label="场景值" />
          <ProFormSelect
            name="status"
            label="状态"
            options={[
              { label: '启用', value: 'active' },
              { label: '禁用', value: 'inactive' },
            ]}
          />
          <ProFormDateTimePicker name="start_time" label="开始时间" />
          <ProFormDateTimePicker name="end_time" label="结束时间" />
          <ProFormDigit
            name="user_limit"
            label="每人限领"
            fieldProps={{ min: 0, precision: 0 }}
          />
          <ProFormTextArea name="description" label="描述" />
        </ProForm>
      </Modal>

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
