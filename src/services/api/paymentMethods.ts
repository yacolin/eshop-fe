// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** 获取支付方式列表 获取所有可用的支付方式 GET /api/v1/payment-methods */
export async function getPaymentMethods(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getPaymentMethodsParams,
  options?: { [key: string]: any },
) {
  return request<API.Response & { data?: API.PaymentMethodListResponse }>(
    '/api/v1/payment-methods',
    {
      method: 'GET',
      params: {
        ...params,
      },
      ...(options || {}),
    },
  );
}
