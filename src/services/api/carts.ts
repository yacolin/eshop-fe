// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** 获取购物车 GET /api/v1/carts */
export async function getCarts(options?: { [key: string]: any }) {
  return request<API.Response & { data?: API.Cart }>('/api/v1/carts', {
    method: 'GET',
    ...(options || {}),
  });
}

/** 更新购物车商品 PUT /api/v1/carts */
export async function putCarts(
  body: API.UpdateItemReq,
  options?: { [key: string]: any },
) {
  return request<API.Response>('/api/v1/carts', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 添加商品到购物车 POST /api/v1/carts */
export async function postCarts(
  body: API.AddItemReq,
  options?: { [key: string]: any },
) {
  return request<API.Response>('/api/v1/carts', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 删除购物车商品 DELETE /api/v1/carts */
export async function deleteCarts(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.deleteCartsParams,
  options?: { [key: string]: any },
) {
  return request<API.Response>('/api/v1/carts', {
    method: 'DELETE',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 清空购物车 POST /api/v1/carts/clear */
export async function postCartsClear(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.postCartsClearParams,
  options?: { [key: string]: any },
) {
  return request<API.Response>('/api/v1/carts/clear', {
    method: 'POST',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}
