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
import {
  Button,
  Divider,
  Drawer,
  Dropdown,
  message,
  Modal,
  Popconfirm,
  Tag,
} from 'antd';
import dayjs from 'dayjs';
import React, { useRef, useState } from 'react';

import {
  getPromotions,
  postAdminPromotions,
  putAdminPromotionsId,
  putAdminPromotionsIdStatus,
} from '@/services/api/promotions';

const formatTime = (t?: string | number) => {
  if (t === undefined || t === null) return '-';
  if (typeof t === 'number') return dayjs(t).format('YYYY-MM-DD HH:mm');
  return t ? t.slice(0, 16).replace('T', ' ') : '-';
};

const promoTypeMap: Record<string, { text: string; color: string }> = {
  time_discount: { text: '限时折扣', color: 'volcano' },
  full_reduce: { text: '满减活动', color: 'blue' },
};

const promoStatusMap: Record<string, { text: string; color: string }> = {
  pending: { text: '待开始', color: 'default' },
  active: { text: '进行中', color: 'green' },
  finished: { text: '已结束', color: 'purple' },
  cancelled: { text: '已取消', color: 'red' },
};

const scopeMap: Record<string, string> = {
  all: '全部商品',
  category: '指定分类',
  product: '指定商品',
};

const PromotionList: React.FC = () => {
  const [createModalVisible, handleCreateModalVisible] =
    useState<boolean>(false);
  const [updateModalVisible, handleUpdateModalVisible] =
    useState<boolean>(false);
  const [editRecord, setEditRecord] = useState<API.PromotionResponse>();
  const actionRef = useRef<ActionType>();
  const [row, setRow] = useState<API.PromotionResponse>();

  const handleStatusChange = async (id: number, status: string) => {
    try {
      await putAdminPromotionsIdStatus({ id }, { status });
      message.success('状态更新成功');
      actionRef.current?.reload();
      return true;
    } catch {
      message.error('状态更新失败');
      return false;
    }
  };

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
      title: '类型',
      dataIndex: 'promo_type',
      width: 100,
      valueType: 'select',
      valueEnum: {
        time_discount: { text: '限时折扣' },
        full_reduce: { text: '满减活动' },
      },
      render: (_, record) => {
        const cfg = promoTypeMap[record.promo_type || ''];
        return cfg ? <Tag color={cfg.color}>{cfg.text}</Tag> : '-';
      },
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 100,
      valueType: 'select',
      valueEnum: {
        pending: { text: '待开始', status: 'Default' },
        active: { text: '进行中', status: 'Success' },
        finished: { text: '已结束', status: 'Processing' },
        cancelled: { text: '已取消', status: 'Error' },
      },
      render: (_, record) => {
        const cfg = promoStatusMap[record.status || ''];
        return cfg ? <Tag color={cfg.color}>{cfg.text}</Tag> : '-';
      },
    },
    {
      title: '适用范围',
      dataIndex: 'scope',
      width: 100,
      valueType: 'select',
      valueEnum: {
        all: { text: '全部商品' },
        category: { text: '指定分类' },
        product: { text: '指定商品' },
      },
      render: (_, record) => scopeMap[record.scope || ''] || '-',
    },
    {
      title: '排序',
      dataIndex: 'sort_order',
      hideInSearch: true,
      width: 60,
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
                handleStatusChange(record.id!, key);
              },
              items: [
                { key: 'pending', label: '待开始' },
                { key: 'active', label: '进行中' },
                { key: 'finished', label: '已结束' },
                { key: 'cancelled', label: '已取消' },
              ],
            }}
          >
            <a onClick={(e) => e.preventDefault()}>改状态</a>
          </Dropdown>
          <Divider type="vertical" />
          <Popconfirm
            title="确认删除"
            description={`确定要将活动「${record.name}」取消吗？`}
            onConfirm={async () => {
              await handleStatusChange(record.id!, 'cancelled');
            }}
          >
            <a style={{ color: '#ff4d4f' }}>取消</a>
          </Popconfirm>
        </div>
      ),
    },
  ];

  return (
    <PageContainer
      header={{
        title: '促销管理',
        breadcrumb: {
          items: [{ title: '首页' }, { title: '促销管理' }],
        },
      }}
    >
      <ProTable<API.PromotionResponse>
        headerTitle="促销活动列表"
        actionRef={actionRef}
        rowKey="id"
        scroll={{ x: 1300 }}
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
            新建活动
          </Button>,
        ]}
        request={async (params) => {
          const { current, pageSize, ...rest } = params;
          const res = await getPromotions({
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
        title="新建促销活动"
        width={640}
        open={createModalVisible}
        onCancel={() => handleCreateModalVisible(false)}
        footer={null}
        destroyOnHidden
      >
        <ProForm<API.CreatePromotionReq>
          layout="horizontal"
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 16 }}
          style={{ width: '90%', margin: '0 auto' }}
          onFinish={async (values) => {
            try {
              await postAdminPromotions({
                ...values,
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
            label="活动名称"
            rules={[{ required: true, message: '请输入活动名称' }]}
          />
          <ProFormSelect
            name="promo_type"
            label="类型"
            rules={[{ required: true, message: '请选择类型' }]}
            options={[
              { label: '限时折扣', value: 'time_discount' },
              { label: '满减活动', value: 'full_reduce' },
            ]}
          />
          <ProFormSelect
            name="scope"
            label="适用范围"
            rules={[{ required: true, message: '请选择范围' }]}
            options={[
              { label: '全部商品', value: 'all' },
              { label: '指定分类', value: 'category' },
              { label: '指定商品', value: 'product' },
            ]}
          />
          <ProFormText
            name="scope_value"
            label="范围值"
            placeholder="分类ID或商品ID"
          />
          <ProFormTextArea
            name="rule"
            label="规则说明（JSON）"
            rules={[{ required: true, message: '请输入规则' }]}
            placeholder='例如：{"discount": 0.8} 或 {"reduce": 1000, "threshold": 5000}'
          />
          <ProFormDigit
            name="sort_order"
            label="排序"
            fieldProps={{ min: 0, precision: 0 }}
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
        title="编辑促销活动"
        width={640}
        open={updateModalVisible}
        onCancel={() => {
          handleUpdateModalVisible(false);
          setEditRecord(undefined);
        }}
        footer={null}
        destroyOnHidden
      >
        <ProForm<API.UpdatePromotionReq>
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
              await putAdminPromotionsId({ id: editRecord!.id! }, {
                ...values,
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
            label="活动名称"
            rules={[{ required: true, message: '请输入活动名称' }]}
          />
          <ProFormSelect
            name="scope"
            label="适用范围"
            options={[
              { label: '全部商品', value: 'all' },
              { label: '指定分类', value: 'category' },
              { label: '指定商品', value: 'product' },
            ]}
          />
          <ProFormText name="scope_value" label="范围值" />
          <ProFormTextArea name="rule" label="规则说明（JSON）" />
          <ProFormDigit
            name="sort_order"
            label="排序"
            fieldProps={{ min: 0, precision: 0 }}
          />
          <ProFormSelect
            name="status"
            label="状态"
            options={[
              { label: '待开始', value: 'pending' },
              { label: '进行中', value: 'active' },
              { label: '已取消', value: 'cancelled' },
            ]}
          />
          <ProFormDateTimePicker name="start_time" label="开始时间" />
          <ProFormDateTimePicker name="end_time" label="结束时间" />
          <ProFormTextArea name="description" label="描述" />
        </ProForm>
      </Modal>

      {/* 详情 */}
      <Drawer
        width={600}
        open={!!row}
        onClose={() => setRow(undefined)}
        closable
        title={row?.name || '促销活动详情'}
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

export default PromotionList;
