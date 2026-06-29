// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** 创建支付 POST /api/v1/payments */
export async function postPayments(
  body: API.CreatePaymentReq,
  options?: { [key: string]: any },
) {
  return request<API.Response & { data?: API.Payment }>('/api/v1/payments', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 查询支付 GET /api/v1/payments/${param0} */
export async function getPaymentsId(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getPaymentsIdParams,
  options?: { [key: string]: any },
) {
  const { id: param0, ...queryParams } = params;
  return request<API.Response & { data?: API.Payment }>(
    `/api/v1/payments/${param0}`,
    {
      method: 'GET',
      params: { ...queryParams },
      ...(options || {}),
    },
  );
}

/** 支付回调 POST /api/v1/payments/callback */
export async function postPaymentsCallback(
  body: API.PaymentCallbackReq,
  options?: { [key: string]: any },
) {
  return request<API.Response>('/api/v1/payments/callback', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 创建退款 POST /api/v1/payments/refund */
export async function postPaymentsRefund(
  body: API.CreateRefundReq,
  options?: { [key: string]: any },
) {
  return request<API.Response>('/api/v1/payments/refund', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}
