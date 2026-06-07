// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** 根据订单ID获取支付 根据订单ID获取支付记录 GET /api/v1/orders/payment/${param0} */
export async function getOrdersPaymentOrderId(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getOrdersPaymentOrderIdParams,
  options?: { [key: string]: any },
) {
  const { order_id: param0, ...queryParams } = params;
  return request<API.Response & { data?: API.PaymentResponse }>(
    `/api/v1/orders/payment/${param0}`,
    {
      method: 'GET',
      params: { ...queryParams },
      ...(options || {}),
    },
  );
}

/** 获取支付列表 根据查询条件获取支付记录列表 GET /api/v1/payments */
export async function getPayments(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getPaymentsParams,
  options?: { [key: string]: any },
) {
  return request<API.Response & { data?: API.PaymentListResponse }>(
    '/api/v1/payments',
    {
      method: 'GET',
      params: {
        ...params,
      },
      ...(options || {}),
    },
  );
}

/** 创建支付 创建新的支付记录 POST /api/v1/payments */
export async function postPayments(
  body: API.CreatePaymentRequest,
  options?: { [key: string]: any },
) {
  return request<API.Response & { data?: API.PaymentResponse }>(
    '/api/v1/payments',
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

/** 获取支付详情 根据ID获取支付记录详情 GET /api/v1/payments/${param0} */
export async function getPaymentsId(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getPaymentsIdParams,
  options?: { [key: string]: any },
) {
  const { id: param0, ...queryParams } = params;
  return request<API.Response & { data?: API.PaymentResponse }>(
    `/api/v1/payments/${param0}`,
    {
      method: 'GET',
      params: { ...queryParams },
      ...(options || {}),
    },
  );
}

/** 更新支付状态 更新支付记录的状态 PATCH /api/v1/payments/${param0}/status */
export async function patchPaymentsIdStatus(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.patchPaymentsIdStatusParams,
  body: API.UpdatePaymentStatusRequest,
  options?: { [key: string]: any },
) {
  const { id: param0, ...queryParams } = params;
  return request<API.Response>(`/api/v1/payments/${param0}/status`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    params: { ...queryParams },
    data: body,
    ...(options || {}),
  });
}
