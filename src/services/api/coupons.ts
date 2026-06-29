// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** 领取优惠券 POST /api/v1/coupons/claim */
export async function postCouponsClaim(
  body: API.ClaimCouponReq,
  options?: { [key: string]: any },
) {
  return request<API.Response>('/api/v1/coupons/claim', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 用户优惠券列表 GET /api/v1/coupons/me */
export async function getCouponsMe(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getCouponsMeParams,
  options?: { [key: string]: any },
) {
  return request<API.Response & { data?: API.UserPromotionListResult }>(
    '/api/v1/coupons/me',
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

/** 使用优惠券 POST /api/v1/coupons/use */
export async function postCouponsUse(
  body: API.UseCouponReq,
  options?: { [key: string]: any },
) {
  return request<API.Response>('/api/v1/coupons/use', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}
