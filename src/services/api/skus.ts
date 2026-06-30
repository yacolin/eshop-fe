// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** 获取 SKU 列表 GET /api/v1/skus */
export async function getSkus(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getSkusParams,
  options?: { [key: string]: any },
) {
  return request<API.Response & { data?: API.SKU[] }>('/api/v1/skus', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 创建 SKU POST /api/v1/skus */
export async function postSkus(
  body: API.CreateSKUReq,
  options?: { [key: string]: any },
) {
  return request<API.Response & { data?: API.SKU }>('/api/v1/skus', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 获取 SKU 详情 GET /api/v1/skus/${param0} */
export async function getSkusId(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getSkusIdParams,
  options?: { [key: string]: any },
) {
  const { id: param0, ...queryParams } = params;
  return request<API.Response & { data?: API.SKU }>(`/api/v1/skus/${param0}`, {
    method: 'GET',
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** 更新 SKU PUT /api/v1/skus/${param0} */
export async function putSkusId(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.putSkusIdParams,
  body: API.UpdateSKUReq,
  options?: { [key: string]: any },
) {
  const { id: param0, ...queryParams } = params;
  return request<API.Response & { data?: API.SKU }>(`/api/v1/skus/${param0}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    params: { ...queryParams },
    data: body,
    ...(options || {}),
  });
}

/** 删除 SKU DELETE /api/v1/skus/${param0} */
export async function deleteSkusId(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.deleteSkusIdParams,
  options?: { [key: string]: any },
) {
  const { id: param0, ...queryParams } = params;
  return request<API.Response>(`/api/v1/skus/${param0}`, {
    method: 'DELETE',
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** 根据编码获取 SKU GET /api/v1/skus/code/${param0} */
export async function getSkusCodeCode(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getSkusCodeCodeParams,
  options?: { [key: string]: any },
) {
  const { code: param0, ...queryParams } = params;
  return request<API.Response & { data?: API.SKU }>(
    `/api/v1/skus/code/${param0}`,
    {
      method: 'GET',
      params: { ...queryParams },
      ...(options || {}),
    },
  );
}
