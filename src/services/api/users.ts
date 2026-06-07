// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** 根据ID获取用户 根据用户ID获取用户信息（管理员接口） GET /api/v1/users/${param0} */
export async function getUsersUserId(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getUsersUserIdParams,
  options?: { [key: string]: any },
) {
  const { user_id: param0, ...queryParams } = params;
  return request<API.Response & { data?: API.User }>(
    `/api/v1/users/${param0}`,
    {
      method: 'GET',
      params: { ...queryParams },
      ...(options || {}),
    },
  );
}

/** 获取用户详细信息 获取当前登录用户的详细信息 GET /api/v1/users/info */
export async function getUsersInfo(options?: { [key: string]: any }) {
  return request<API.Response & { data?: API.UserInfo }>('/api/v1/users/info', {
    method: 'GET',
    ...(options || {}),
  });
}

/** 更新用户详细信息 更新当前登录用户的详细信息（Avatar、Nickname 等） PUT /api/v1/users/info */
export async function putUsersInfo(
  body: API.UpdateUserInfoRequest,
  options?: { [key: string]: any },
) {
  return request<API.Response & { data?: API.UserInfo }>('/api/v1/users/info', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 获取用户资料 获取当前登录用户的完整资料（包含 User 和 UserInfo） GET /api/v1/users/profile */
export async function getUsersProfile(options?: { [key: string]: any }) {
  return request<API.Response & { data?: API.User }>('/api/v1/users/profile', {
    method: 'GET',
    ...(options || {}),
  });
}
