// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** 获取退款列表 根据查询条件获取退款记录列表 GET /api/v1/refunds */
export async function getRefunds(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getRefundsParams,
  options?: { [key: string]: any },
) {
  return request<API.Response & { data?: API.RefundListResult }>(
    '/api/v1/refunds',
    {
      method: 'GET',
      params: {
        ...params,
      },
      ...(options || {}),
    },
  );
}

/** 创建退款 创建新的退款记录 POST /api/v1/refunds */
export async function postRefunds(
  body: API.CreateRefundRequest,
  options?: { [key: string]: any },
) {
  return request<API.Response & { data?: API.RefundResponse }>(
    '/api/v1/refunds',
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

/** 更新退款状态 更新退款记录的状态 PATCH /api/v1/refunds/${param0}/status */
export async function patchRefundsIdStatus(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.patchRefundsIdStatusParams,
  body: API.UpdatePaymentStatusRequest,
  options?: { [key: string]: any },
) {
  const { id: param0, ...queryParams } = params;
  return request<API.Response>(`/api/v1/refunds/${param0}/status`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    params: { ...queryParams },
    data: body,
    ...(options || {}),
  });
}
