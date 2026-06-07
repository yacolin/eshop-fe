// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** 获取购物车 根据用户ID或会话ID获取购物车详情 GET /api/v1/carts */
export async function getCarts(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getCartsParams,
  options?: { [key: string]: any },
) {
  return request<API.Response & { data?: API.CartResponse }>('/api/v1/carts', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 清空购物车 清空购物车中的所有商品 DELETE /api/v1/carts */
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

/** 添加商品到购物车 将商品添加到购物车，支持指定数量和SKU POST /api/v1/carts/items */
export async function postCartsItems(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.postCartsItemsParams,
  body: API.AddToCartDTO,
  options?: { [key: string]: any },
) {
  return request<API.Response & { data?: API.CartResponse }>(
    '/api/v1/carts/items',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      params: {
        ...params,
      },
      data: body,
      ...(options || {}),
    },
  );
}

/** 更新购物车项 更新购物车项的数量 PUT /api/v1/carts/items/${param0} */
export async function putCartsItemsItemId(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.putCartsItemsItemIdParams,
  body: API.UpdateCartItemDTO,
  options?: { [key: string]: any },
) {
  const { item_id: param0, ...queryParams } = params;
  return request<API.Response & { data?: API.CartResponse }>(
    `/api/v1/carts/items/${param0}`,
    {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      params: {
        ...queryParams,
      },
      data: body,
      ...(options || {}),
    },
  );
}

/** 删除购物车项 从购物车中删除指定的商品 DELETE /api/v1/carts/items/${param0} */
export async function deleteCartsItemsItemId(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.deleteCartsItemsItemIdParams,
  options?: { [key: string]: any },
) {
  const { item_id: param0, ...queryParams } = params;
  return request<API.Response & { data?: API.CartResponse }>(
    `/api/v1/carts/items/${param0}`,
    {
      method: 'DELETE',
      params: {
        ...queryParams,
      },
      ...(options || {}),
    },
  );
}
