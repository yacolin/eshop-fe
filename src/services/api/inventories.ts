// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** 列出所有库存 获取所有库存的列表，支持分页筛选 GET /api/v1/inventories */
export async function getInventories(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getInventoriesParams,
  options?: { [key: string]: any },
) {
  return request<API.Response & { data?: API.InventoryListResult }>(
    '/api/v1/inventories',
    {
      method: 'GET',
      params: {
        // page has a default value: 1
        page: '1',
        // size has a default value: 10
        size: '10',

        ...params,
      },
      ...(options || {}),
    },
  );
}

/** 创建库存 创建一个新的库存记录 POST /api/v1/inventories */
export async function postInventories(
  body: API.CreateInventoryDTO,
  options?: { [key: string]: any },
) {
  return request<API.Response & { data?: API.Inventory }>(
    '/api/v1/inventories',
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

/** 更新库存 根据ID更新库存信息 PUT /api/v1/inventories/${param0} */
export async function putInventoriesId(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.putInventoriesIdParams,
  body: API.UpdateInventoryDTO,
  options?: { [key: string]: any },
) {
  const { id: param0, ...queryParams } = params;
  return request<API.Response & { data?: API.Inventory }>(
    `/api/v1/inventories/${param0}`,
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

/** 根据产品ID获取库存 根据产品ID获取库存信息 GET /api/v1/inventories/product/${param0} */
export async function getInventoriesProductProductId(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getInventoriesProductProductIdParams,
  options?: { [key: string]: any },
) {
  const { productId: param0, ...queryParams } = params;
  return request<API.Response & { data?: API.Inventory }>(
    `/api/v1/inventories/product/${param0}`,
    {
      method: 'GET',
      params: { ...queryParams },
      ...(options || {}),
    },
  );
}

/** 释放库存 释放之前预订的库存 POST /api/v1/inventories/release */
export async function postInventoriesRelease(
  body: API.ReleaseInventoryDTO,
  options?: { [key: string]: any },
) {
  return request<API.Response & { data?: Record<string, any> }>(
    '/api/v1/inventories/release',
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

/** 预订库存 预订指定产品的库存 POST /api/v1/inventories/reserve */
export async function postInventoriesReserve(
  body: API.ReserveInventoryDTO,
  options?: { [key: string]: any },
) {
  return request<API.Response & { data?: Record<string, any> }>(
    '/api/v1/inventories/reserve',
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
