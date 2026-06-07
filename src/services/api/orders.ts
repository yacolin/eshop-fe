// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** 列出所有订单 获取所有订单的列表，支持分页筛选 GET /api/v1/orders */
export async function getOrders(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getOrdersParams,
  options?: { [key: string]: any },
) {
  return request<API.Response & { data?: API.OrderListResult }>(
    '/api/v1/orders',
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

/** 创建订单 创建一个新的订单 POST /api/v1/orders */
export async function postOrders(
  body: API.CreateOrderDTO,
  options?: { [key: string]: any },
) {
  return request<API.Response>('/api/v1/orders', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 获取订单详情 根据订单ID获取订单详情 GET /api/v1/orders/${param0} */
export async function getOrdersId(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getOrdersIdParams,
  options?: { [key: string]: any },
) {
  const { id: param0, ...queryParams } = params;
  return request<API.Response>(`/api/v1/orders/${param0}`, {
    method: 'GET',
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** 更新订单 根据ID更新订单信息 PUT /api/v1/orders/${param0} */
export async function putOrdersId(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.putOrdersIdParams,
  body: API.UpdateOrderDTO,
  options?: { [key: string]: any },
) {
  const { id: param0, ...queryParams } = params;
  return request<API.Response>(`/api/v1/orders/${param0}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    params: { ...queryParams },
    data: body,
    ...(options || {}),
  });
}

/** 删除订单 根据ID删除订单 DELETE /api/v1/orders/${param0} */
export async function deleteOrdersId(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.deleteOrdersIdParams,
  options?: { [key: string]: any },
) {
  const { id: param0, ...queryParams } = params;
  return request<API.Response & { data?: Record<string, any> }>(
    `/api/v1/orders/${param0}`,
    {
      method: 'DELETE',
      params: { ...queryParams },
      ...(options || {}),
    },
  );
}

/** 取消订单 取消指定订单 POST /api/v1/orders/${param0}/cancel */
export async function postOrdersIdCancel(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.postOrdersIdCancelParams,
  options?: { [key: string]: any },
) {
  const { id: param0, ...queryParams } = params;
  return request<API.Response & { data?: Record<string, any> }>(
    `/api/v1/orders/${param0}/cancel`,
    {
      method: 'POST',
      params: { ...queryParams },
      ...(options || {}),
    },
  );
}

/** 更新订单状态 更新指定订单的状态 PATCH /api/v1/orders/${param0}/status */
export async function patchOrdersIdStatus(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.patchOrdersIdStatusParams,
  body: API.UpdateOrderStatusDTO,
  options?: { [key: string]: any },
) {
  const { id: param0, ...queryParams } = params;
  return request<API.Response & { data?: Record<string, any> }>(
    `/api/v1/orders/${param0}/status`,
    {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      params: { ...queryParams },
      data: body,
      ...(options || {}),
    },
  );
}

/** 根据用户ID获取订单列表 根据用户ID获取订单列表，支持分页 GET /api/v1/users/${param0}/orders */
export async function getUsersUserIdOrders(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getUsersUserIdOrdersParams,
  options?: { [key: string]: any },
) {
  const { user_id: param0, ...queryParams } = params;
  return request<API.Response & { data?: API.OrderListResult }>(
    `/api/v1/users/${param0}/orders`,
    {
      method: 'GET',
      params: {
        // page has a default value: 1
        page: '1',
        // size has a default value: 10
        size: '10',
        ...queryParams,
      },
      ...(options || {}),
    },
  );
}
