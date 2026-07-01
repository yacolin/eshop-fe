// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** 后台用户列表 GET /api/v1/users */
export async function getUsers(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getUsersParams,
  options?: { [key: string]: any },
) {
  return request<API.Response & { data?: API.UserListResult }>(
    '/api/v1/users',
    {
      method: 'GET',
      params: {
        // page has a default value: 1
        page: '1',
        // size has a default value: 20
        size: '20',

        ...params,
      },
      ...(options || {}),
    },
  );
}

/** 给用户分配角色 POST /api/v1/users/${param0}/roles */
export async function postUsersUserIdRoles(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.postUsersUserIdRolesParams,
  body: API.AssignRoleReq,
  options?: { [key: string]: any },
) {
  const { user_id: param0, ...queryParams } = params;
  return request<API.Response>(`/api/v1/users/${param0}/roles`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    params: { ...queryParams },
    data: body,
    ...(options || {}),
  });
}

/** 移除用户的角色 DELETE /api/v1/users/${param0}/roles/${param1} */
export async function deleteUsersUserIdRolesRoleId(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.deleteUsersUserIdRolesRoleIdParams,
  options?: { [key: string]: any },
) {
  const { user_id: param0, role_id: param1, ...queryParams } = params;
  return request<API.Response>(`/api/v1/users/${param0}/roles/${param1}`, {
    method: 'DELETE',
    params: { ...queryParams },
    ...(options || {}),
  });
}

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
