import {
  PageContainer,
  ProForm,
  ProFormDatePicker,
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
} from '@ant-design/pro-components';
import { Button, Descriptions, message, Modal, Spin, Tag } from 'antd';
import React, { useEffect, useState } from 'react';

import { getUsersProfile, putUsersInfo } from '@/services/api/users';

import Auth from '@/components/Auth';

const genderMap: Record<number | string, string> = {
  0: '未知',
  1: '男',
  2: '女',
};

const UserInfoPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<any>();
  const [editVisible, setEditVisible] = useState(false);

  const fetchUser = async () => {
    setLoading(true);
    try {
      const res = await getUsersProfile();
      setUser((res as any).data);
    } catch {
      message.error('获取用户信息失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const handleUpdate = async (fields: API.UpdateUserInfoReq) => {
    const hide = message.loading('正在更新');
    try {
      await putUsersInfo(fields);
      hide();
      message.success('更新成功');
      setEditVisible(false);
      fetchUser();
      return true;
    } catch {
      hide();
      message.error('更新失败，请重试');
      return false;
    }
  };

  const userInfo = user?.user_info;

  return (
    <PageContainer
      header={{
        title: '用户信息',
        breadcrumb: {
          items: [{ title: '首页' }, { title: '用户信息' }],
        },
      }}
    >
      <Spin spinning={loading}>
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
          <Descriptions
            title="基本资料"
            bordered
            column={2}
            size="middle"
            extra={
              <Auth permission="canUpdateUser">
                <Button type="primary" onClick={() => setEditVisible(true)}>
                  编辑资料
                </Button>
              </Auth>
            }
          >
            <Descriptions.Item label="用户ID">
              {user?.id ?? '-'}
            </Descriptions.Item>
            <Descriptions.Item label="状态">
              {user?.status === 1 ? (
                <Tag color="green">正常</Tag>
              ) : (
                <Tag color="red">禁用</Tag>
              )}
            </Descriptions.Item>
            <Descriptions.Item label="昵称">
              {user?.nickname || '-'}
            </Descriptions.Item>
            <Descriptions.Item label="用户名">
              {user?.username || '-'}
            </Descriptions.Item>
            <Descriptions.Item label="邮箱">
              {user?.email || '-'}
            </Descriptions.Item>
            <Descriptions.Item label="手机号">
              {user?.phone || '-'}
            </Descriptions.Item>
            <Descriptions.Item label="性别">
              {userInfo?.gender !== undefined
                ? genderMap[userInfo.gender] || '未知'
                : '-'}
            </Descriptions.Item>
            <Descriptions.Item label="生日">
              {userInfo?.birthday || '-'}
            </Descriptions.Item>
            <Descriptions.Item label="个人简介">
              {userInfo?.bio || '-'}
            </Descriptions.Item>
            <Descriptions.Item label="国家">
              {userInfo?.country || '-'}
            </Descriptions.Item>
            <Descriptions.Item label="省份">
              {userInfo?.province || '-'}
            </Descriptions.Item>
            <Descriptions.Item label="城市">
              {userInfo?.city || '-'}
            </Descriptions.Item>
            <Descriptions.Item label="邮编">
              {userInfo?.zip_code || '-'}
            </Descriptions.Item>
            <Descriptions.Item label="语言">
              {userInfo?.language || '-'}
            </Descriptions.Item>
            <Descriptions.Item label="时区">
              {userInfo?.timezone || '-'}
            </Descriptions.Item>
            <Descriptions.Item label="头像">
              {user?.avatar ? <Tag>{user.avatar}</Tag> : '-'}
            </Descriptions.Item>
          </Descriptions>
        </div>
      </Spin>

      <Modal
        title="编辑资料"
        width={640}
        open={editVisible}
        onCancel={() => setEditVisible(false)}
        footer={null}
        destroyOnHidden
      >
        <ProForm<API.UpdateUserInfoReq>
          layout="horizontal"
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 18 }}
          style={{ width: '100%', margin: '0 auto' }}
          onFinish={async (values) => {
            await handleUpdate(values);
          }}
          initialValues={{
            nickname: user?.nickname,
            gender: userInfo?.gender,
            birthday: userInfo?.birthday,
            bio: userInfo?.bio,
            country: userInfo?.country,
            province: userInfo?.province,
            city: userInfo?.city,
            zip_code: userInfo?.zip_code,
            language: userInfo?.language,
            timezone: userInfo?.timezone,
            avatar: user?.avatar,
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
            name="nickname"
            label="昵称"
            width="md"
            placeholder="请输入昵称"
          />
          <ProFormSelect
            name="gender"
            label="性别"
            width="md"
            options={[
              { label: '未知', value: 0 },
              { label: '男', value: 1 },
              { label: '女', value: 2 },
            ]}
          />
          <ProFormDatePicker name="birthday" label="生日" width="md" />
          <ProFormTextArea
            name="bio"
            label="个人简介"
            width="md"
            placeholder="请输入个人简介"
          />
          <ProFormText
            name="country"
            label="国家"
            width="md"
            placeholder="请输入国家"
          />
          <ProFormText
            name="province"
            label="省份"
            width="md"
            placeholder="请输入省份"
          />
          <ProFormText
            name="city"
            label="城市"
            width="md"
            placeholder="请输入城市"
          />
          <ProFormText
            name="zip_code"
            label="邮编"
            width="md"
            placeholder="请输入邮编"
          />
          <ProFormText
            name="language"
            label="语言"
            width="md"
            placeholder="请输入语言"
          />
          <ProFormText
            name="timezone"
            label="时区"
            width="md"
            placeholder="请输入时区"
          />
        </ProForm>
      </Modal>
    </PageContainer>
  );
};

export default UserInfoPage;
