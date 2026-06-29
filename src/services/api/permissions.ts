// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** 权限列表 GET /api/v1/permissions */
export async function getPermissions(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getPermissionsParams,
  options?: { [key: string]: any },
) {
  return request<API.Response & { data?: API.PermissionListResult }>(
    '/api/v1/permissions',
    {
      method: 'GET',
      params: {
        ...params,
      },
      ...(options || {}),
    },
  );
}

/** 创建权限 POST /api/v1/permissions */
export async function postPermissions(
  body: API.CreatePermissionReq,
  options?: { [key: string]: any },
) {
  return request<API.Response & { data?: API.Permission }>(
    '/api/v1/permissions',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      data: body,
      ...(options || {}),
    },
  );
}

/** 获取权限 GET /api/v1/permissions/${param0} */
export async function getPermissionsId(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getPermissionsIdParams,
  options?: { [key: string]: any },
) {
  const { id: param0, ...queryParams } = params;
  return request<API.Response & { data?: API.Permission }>(
    `/api/v1/permissions/${param0}`,
    {
      method: 'GET',
      params: { ...queryParams },
      ...(options || {}),
    },
  );
}

/** 更新权限 PUT /api/v1/permissions/${param0} */
export async function putPermissionsId(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.putPermissionsIdParams,
  body: API.UpdatePermissionReq,
  options?: { [key: string]: any },
) {
  const { id: param0, ...queryParams } = params;
  return request<API.Response & { data?: API.Permission }>(
    `/api/v1/permissions/${param0}`,
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

/** 删除权限 DELETE /api/v1/permissions/${param0} */
export async function deletePermissionsId(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.deletePermissionsIdParams,
  options?: { [key: string]: any },
) {
  const { id: param0, ...queryParams } = params;
  return request<API.Response>(`/api/v1/permissions/${param0}`, {
    method: 'DELETE',
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** 检查权限 POST /api/v1/permissions/check */
export async function postPermissionsCheck(
  body: API.CheckPermissionsReq,
  options?: { [key: string]: any },
) {
  return request<API.Response & { data?: API.CheckPermissionsResult }>(
    '/api/v1/permissions/check',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      data: body,
      ...(options || {}),
    },
  );
}
