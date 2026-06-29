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
import CreateForm from './components/CreateForm';
import UpdateForm from './components/UpdateForm';

import type { FormValueType } from './components/UpdateForm';

const statusMap: Record<number, { text: string; color: string }> = {
  1: { text: '启用', color: '#52c41a' },
  0: { text: '禁用', color: '#ff4d4f' },
};

const PromotionList: React.FC = () => {
  const [createModalVisible, handleModalVisible] = useState<boolean>(false);
  const [updateModalVisible, handleUpdateModalVisible] =
    useState<boolean>(false);
  const [stepFormValues, setStepFormValues] = useState<FormValueType>({});
  const actionRef = useRef<ActionType>();
  const [row, setRow] = useState<any>();
  const [selectedRowsState, setSelectedRows] = useState<any[]>([]);

  const columns: ProColumns<any>[] = [
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
      dataIndex: 'name',
      width: 200,
      formItemProps: {
        rules: [{ required: true, message: '请输入活动名称' }],
      },
    },
    {
      title: '类型',
      dataIndex: 'promo_type',
      width: 100,
      render: (_, record) => {
        const map: Record<string, string> = {
          flash_sale: '秒杀',
          coupon: '优惠券',
          full_reduction: '满减',
        };
        return <Tag>{map[record.promo_type] || record.promo_type}</Tag>;
      },
    },
    {
      title: '折扣比例',
      dataIndex: 'discount',
      width: 100,
      hideInSearch: true,
      render: (_, record) =>
        record.discount ? `${(record.discount * 100).toFixed(0)}%` : '-',
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 80,
      render: (_, record) => {
        const cfg = statusMap[record.status ?? -1];
        return cfg ? <Tag color={cfg.color}>{cfg.text}</Tag> : '-';
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
              description={`确定要删除活动「${record.name}」吗？`}
              onConfirm={async () => {
                const success = true;
                if (success) {
                  actionRef.current?.reloadAndRest?.();
                  setSelectedRows([]);
                  message.success('删除成功');
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
      <ProTable<any>
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
          console.log('TODO: 接入促销API', {
            page: current,
            size: pageSize,
            ...rest,
          });
          return { data: [], total: 0, success: true };
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
              title="确认批量删除"
              description="确定要删除选中的活动吗？"
              onConfirm={() => {}}
            >
              <Button danger>批量删除</Button>
            </Popconfirm>
          </FooterToolbar>
        </Auth>
      )}

      <CreateForm
        onCancel={() => handleModalVisible(false)}
        modalVisible={createModalVisible}
        onSubmit={async () => true}
      />
      {stepFormValues && Object.keys(stepFormValues).length ? (
        <UpdateForm
          onSubmit={async () => {
            handleUpdateModalVisible(false);
            setStepFormValues({});
            actionRef.current?.reload();
          }}
          onCancel={() => {
            handleUpdateModalVisible(false);
            setStepFormValues({});
          }}
          updateModalVisible={updateModalVisible}
          values={stepFormValues}
        />
      ) : null}
      <Drawer
        width={600}
        open={!!row}
        onClose={() => setRow(undefined)}
        closable
        title={row?.name || '活动详情'}
      >
        {row?.name && (
          <ProDescriptions
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

export default PromotionList;
