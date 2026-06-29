// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** 地址列表 GET /api/v1/addresses */
export async function getAddresses(options?: { [key: string]: any }) {
  return request<API.Response & { data?: API.AddressListResult }>(
    '/api/v1/addresses',
    {
      method: 'GET',
      ...(options || {}),
    },
  );
}

/** 创建地址 POST /api/v1/addresses */
export async function postAddresses(
  body: API.CreateAddressReq,
  options?: { [key: string]: any },
) {
  return request<API.Response & { data?: API.Address }>('/api/v1/addresses', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 获取地址详情 GET /api/v1/addresses/${param0} */
export async function getAddressesId(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getAddressesIdParams,
  options?: { [key: string]: any },
) {
  const { id: param0, ...queryParams } = params;
  return request<API.Response & { data?: API.Address }>(
    `/api/v1/addresses/${param0}`,
    {
      method: 'GET',
      params: { ...queryParams },
      ...(options || {}),
    },
  );
}

/** 更新地址 PUT /api/v1/addresses/${param0} */
export async function putAddressesId(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.putAddressesIdParams,
  body: API.UpdateAddressReq,
  options?: { [key: string]: any },
) {
  const { id: param0, ...queryParams } = params;
  return request<API.Response & { data?: API.Address }>(
    `/api/v1/addresses/${param0}`,
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

/** 删除地址 DELETE /api/v1/addresses/${param0} */
export async function deleteAddressesId(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.deleteAddressesIdParams,
  options?: { [key: string]: any },
) {
  const { id: param0, ...queryParams } = params;
  return request<API.Response>(`/api/v1/addresses/${param0}`, {
    method: 'DELETE',
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** 获取默认地址 GET /api/v1/addresses/default */
export async function getAddressesOpenApiDefault(options?: {
  [key: string]: any;
}) {
  return request<API.Response & { data?: API.Address }>(
    '/api/v1/addresses/default',
    {
      method: 'GET',
      ...(options || {}),
    },
  );
}
