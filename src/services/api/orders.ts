// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** 订单列表 GET /api/v1/orders */
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

/** 创建订单 POST /api/v1/orders */
export async function postOrders(
  body: API.CreateOrderReq,
  options?: { [key: string]: any },
) {
  return request<API.Response & { data?: API.Order }>('/api/v1/orders', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 根据订单号查询 GET /api/v1/orders/${param0} */
export async function getOrdersOrderNo(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getOrdersOrderNoParams,
  options?: { [key: string]: any },
) {
  const { order_no: param0, ...queryParams } = params;
  return request<API.Response & { data?: API.OrderDetailResponse }>(
    `/api/v1/orders/${param0}`,
    {
      method: 'GET',
      params: { ...queryParams },
      ...(options || {}),
    },
  );
}

/** 更新订单状态 PUT /api/v1/orders/${param0}/status */
export async function putOrdersOrderNoStatus(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.putOrdersOrderNoStatusParams,
  body: API.UpdateOrderStatusReq,
  options?: { [key: string]: any },
) {
  const { order_no: param0, ...queryParams } = params;
  return request<API.Response & { data?: API.Order }>(
    `/api/v1/orders/${param0}/status`,
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
