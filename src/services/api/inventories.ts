// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** 支付扣减库存 POST /api/v1/inventories/deduct */
export async function postInventoriesDeduct(
  body: API.DeductStockReq,
  options?: { [key: string]: any },
) {
  return request<API.Response & { data?: API.Inventory }>(
    '/api/v1/inventories/deduct',
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

/** 下单预占库存 POST /api/v1/inventories/lock */
export async function postInventoriesLock(
  body: API.LockStockReq,
  options?: { [key: string]: any },
) {
  return request<API.Response & { data?: API.Inventory }>(
    '/api/v1/inventories/lock',
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

/** 查询库存变更流水 GET /api/v1/inventories/logs */
export async function getInventoriesLogs(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getInventoriesLogsParams,
  options?: { [key: string]: any },
) {
  return request<API.Response & { data?: API.InventoryLogListResult }>(
    '/api/v1/inventories/logs',
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

/** 入库/补货 POST /api/v1/inventories/restock */
export async function postInventoriesRestock(
  body: API.RestockReq,
  options?: { [key: string]: any },
) {
  return request<API.Response & { data?: API.Inventory }>(
    '/api/v1/inventories/restock',
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

/** 查询库存 GET /api/v1/inventories/stock */
export async function getInventoriesStock(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getInventoriesStockParams,
  options?: { [key: string]: any },
) {
  return request<API.Response & { data?: API.Inventory }>(
    '/api/v1/inventories/stock',
    {
      method: 'GET',
      params: {
        ...params,
      },
      ...(options || {}),
    },
  );
}

/** 取消释放库存 POST /api/v1/inventories/unlock */
export async function postInventoriesUnlock(
  body: API.UnlockStockReq,
  options?: { [key: string]: any },
) {
  return request<API.Response & { data?: API.Inventory }>(
    '/api/v1/inventories/unlock',
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
