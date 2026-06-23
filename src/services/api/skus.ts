// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** SKU列表查询 分页查询SKU列表，支持按产品ID/名称/SKU编码/价格范围筛选 GET /api/v1/skus */
export async function getSkus(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getSkusParams,
  options?: { [key: string]: any },
) {
  return request<API.Response & { data?: API.SkuListResult }>('/api/v1/skus', {
    method: 'GET',
    params: {
      // page has a default value: 1
      page: '1',
      // size has a default value: 10
      size: '10',

      // order has a default value: asc
      order: 'asc',
      ...params,
    },
    ...(options || {}),
  });
}

/** 创建SKU 创建一个新的SKU POST /api/v1/skus */
export async function postSkus(
  body: API.CreateSkuDTO,
  options?: { [key: string]: any },
) {
  return request<API.Response & { data?: API.SkuResponse }>('/api/v1/skus', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 获取SKU详情 根据ID获取SKU详情 GET /api/v1/skus/${param0} */
export async function getSkusId(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getSkusIdParams,
  options?: { [key: string]: any },
) {
  const { id: param0, ...queryParams } = params;
  return request<API.Response & { data?: API.SkuResponse }>(
    `/api/v1/skus/${param0}`,
    {
      method: 'GET',
      params: { ...queryParams },
      ...(options || {}),
    },
  );
}

/** 更新SKU 根据ID更新SKU信息 PUT /api/v1/skus/${param0} */
export async function putSkusId(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.putSkusIdParams,
  body: API.UpdateSkuDTO,
  options?: { [key: string]: any },
) {
  const { id: param0, ...queryParams } = params;
  return request<API.Response & { data?: API.SkuResponse }>(
    `/api/v1/skus/${param0}`,
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

/** 删除SKU 根据ID删除SKU DELETE /api/v1/skus/${param0} */
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
