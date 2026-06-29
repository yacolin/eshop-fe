// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** 更新个人信息 PUT /api/v1/users/info */
export async function putUsersInfo(
  body: API.UpdateUserInfoReq,
  options?: { [key: string]: any },
) {
  return request<API.Response>('/api/v1/users/info', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 获取当前用户资料 GET /api/v1/users/profile */
export async function getUsersProfile(options?: { [key: string]: any }) {
  return request<API.Response & { data?: API.UserProfileResponse }>(
    '/api/v1/users/profile',
    {
      method: 'GET',
      ...(options || {}),
    },
  );
}
