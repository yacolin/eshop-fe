// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** 获取角色列表 分页获取角色列表，支持按页码和每页数量查询 GET /api/v1/roles */
export async function getRoles(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getRolesParams,
  options?: { [key: string]: any },
) {
  return request<API.Response & { data?: API.ListRolesResponse }>(
    '/api/v1/roles',
    {
      method: 'GET',
      params: {
        // page has a default value: 1
        page: '1',
        // page_size has a default value: 20
        page_size: '20',
        ...params,
      },
      ...(options || {}),
    },
  );
}

/** 创建角色 创建新角色（需要管理员权限） POST /api/v1/roles */
export async function postRoles(
  body: API.CreateRoleRequest,
  options?: { [key: string]: any },
) {
  return request<API.Response & { data?: API.Role }>('/api/v1/roles', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 获取角色详情 根据ID获取角色详情，包含角色的权限列表 GET /api/v1/roles/${param0} */
export async function getRolesId(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getRolesIdParams,
  options?: { [key: string]: any },
) {
  const { id: param0, ...queryParams } = params;
  return request<API.Response & { data?: API.Role }>(
    `/api/v1/roles/${param0}`,
    {
      method: 'GET',
      params: { ...queryParams },
      ...(options || {}),
    },
  );
}

/** 更新角色 更新角色信息（需要管理员权限）。注意：系统内置角色（is_system=true）不能被修改。 PUT /api/v1/roles/${param0} */
export async function putRolesId(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.putRolesIdParams,
  body: API.UpdateRoleRequest,
  options?: { [key: string]: any },
) {
  const { id: param0, ...queryParams } = params;
  return request<API.Response & { data?: API.Role }>(
    `/api/v1/roles/${param0}`,
    {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      params: { ...queryParams },
      data: body,
      ...(options || {}),
    },
  );
}

/** 删除角色 删除角色（需要管理员权限）。注意：系统内置角色（is_system=true）不能被删除。 DELETE /api/v1/roles/${param0} */
export async function deleteRolesId(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.deleteRolesIdParams,
  options?: { [key: string]: any },
) {
  const { id: param0, ...queryParams } = params;
  return request<API.Response & { data?: Record<string, any> }>(
    `/api/v1/roles/${param0}`,
    {
      method: 'DELETE',
      params: { ...queryParams },
      ...(options || {}),
    },
  );
}

/** 为角色分配权限 为指定角色分配权限（需要管理员权限） POST /api/v1/roles/${param0}/permissions */
export async function postRolesIdPermissions(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.postRolesIdPermissionsParams,
  body: Record<string, any>,
  options?: { [key: string]: any },
) {
  const { id: param0, ...queryParams } = params;
  return request<API.Response>(`/api/v1/roles/${param0}/permissions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    params: { ...queryParams },
    data: body,
    ...(options || {}),
  });
}

/** 移除角色的权限 移除指定角色的权限（需要管理员权限） DELETE /api/v1/roles/${param0}/permissions */
export async function deleteRolesIdPermissions(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.deleteRolesIdPermissionsParams,
  body: Record<string, any>,
  options?: { [key: string]: any },
) {
  const { id: param0, ...queryParams } = params;
  return request<API.Response>(`/api/v1/roles/${param0}/permissions`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    params: { ...queryParams },
    data: body,
    ...(options || {}),
  });
}

/** 根据名称获取角色 根据角色名称获取角色详情 GET /api/v1/roles/name/${param0} */
export async function getRolesNameName(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getRolesNameNameParams,
  options?: { [key: string]: any },
) {
  const { name: param0, ...queryParams } = params;
  return request<API.Response & { data?: API.Role }>(
    `/api/v1/roles/name/${param0}`,
    {
      method: 'GET',
      params: { ...queryParams },
      ...(options || {}),
    },
  );
}

/** 获取用户的角色列表 获取指定用户的角色列表 GET /api/v1/users/${param0}/roles */
export async function getUsersUserIdRoles(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getUsersUserIdRolesParams,
  options?: { [key: string]: any },
) {
  const { user_id: param0, ...queryParams } = params;
  return request<API.Response & { data?: API.Role[] }>(
    `/api/v1/users/${param0}/roles`,
    {
      method: 'GET',
      params: { ...queryParams },
      ...(options || {}),
    },
  );
}

/** 分配角色给用户 为指定用户分配角色（需要管理员权限） POST /api/v1/users/${param0}/roles */
export async function postUsersUserIdRoles(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.postUsersUserIdRolesParams,
  body: {
    role_id?: string;
  },
  options?: { [key: string]: any },
) {
  const { user_id: param0, ...queryParams } = params;
  return request<API.Response & { data?: Record<string, any> }>(
    `/api/v1/users/${param0}/roles`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      params: { ...queryParams },
      data: body,
      ...(options || {}),
    },
  );
}

/** 移除用户的角色 移除指定用户的角色（需要管理员权限） DELETE /api/v1/users/${param0}/roles/${param1} */
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
