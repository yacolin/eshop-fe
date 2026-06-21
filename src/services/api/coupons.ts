// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** 创建优惠券模板 创建新的优惠券模板，支持满减券、折扣券、代金券 POST /api/v1/admin/coupons */
export async function postAdminCoupons(
  body: API.CreateCouponDTO,
  options?: { [key: string]: any },
) {
  return request<API.Response & { data?: API.CouponResponse }>(
    '/api/v1/admin/coupons',
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

/** 更新优惠券模板 更新指定优惠券模板的信息 PUT /api/v1/admin/coupons/${param0} */
export async function putAdminCouponsId(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.putAdminCouponsIdParams,
  body: API.UpdateCouponDTO,
  options?: { [key: string]: any },
) {
  const { id: param0, ...queryParams } = params;
  return request<API.Response & { data?: API.CouponResponse }>(
    `/api/v1/admin/coupons/${param0}`,
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

/** 优惠券模板列表 分页查询优惠券模板列表 GET /api/v1/coupons */
export async function getCoupons(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getCouponsParams,
  options?: { [key: string]: any },
) {
  return request<API.Response & { data?: API.CouponListResult }>(
    '/api/v1/coupons',
    {
      method: 'GET',
      params: {
        // page has a default value: 1
        page: '1',
        // page_size has a default value: 20
        page_size: '20',
        ...params,
      },
      ...(options || {}),
    },
  );
}

/** 获取优惠券详情 根据ID获取优惠券模板详情 GET /api/v1/coupons/${param0} */
export async function getCouponsId(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getCouponsIdParams,
  options?: { [key: string]: any },
) {
  const { id: param0, ...queryParams } = params;
  return request<API.Response & { data?: API.CouponResponse }>(
    `/api/v1/coupons/${param0}`,
    {
      method: 'GET',
      params: { ...queryParams },
      ...(options || {}),
    },
  );
}

/** 领取优惠券 当前登录用户领取指定优惠券 POST /api/v1/coupons/claim */
export async function postCouponsClaim(
  body: API.ClaimCouponDTO,
  options?: { [key: string]: any },
) {
  return request<API.Response & { data?: API.UserCouponResponse }>(
    '/api/v1/coupons/claim',
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

/** 获取用户优惠券列表 当前登录用户的优惠券列表，可按状态筛选 GET /api/v1/coupons/mine */
export async function getCouponsMine(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getCouponsMineParams,
  options?: { [key: string]: any },
) {
  return request<API.Response & { data?: API.UserCouponListResult }>(
    '/api/v1/coupons/mine',
    {
      method: 'GET',
      params: {
        // page has a default value: 1
        page: '1',
        // page_size has a default value: 20
        page_size: '20',
        ...params,
      },
      ...(options || {}),
    },
  );
}

/** 获取用户可用优惠券 当前登录用户所有未使用且未过期的优惠券 GET /api/v1/coupons/usable */
export async function getCouponsUsable(options?: { [key: string]: any }) {
  return request<API.Response & { data?: API.UserCouponResponse[] }>(
    '/api/v1/coupons/usable',
    {
      method: 'GET',
      ...(options || {}),
    },
  );
}

/** 使用优惠券 结算时使用优惠券，标记为已使用并返回抵扣金额 POST /api/v1/coupons/use */
export async function postCouponsUse(
  body: API.UseCouponDTO,
  options?: { [key: string]: any },
) {
  return request<API.Response & { data?: Record<string, any> }>(
    '/api/v1/coupons/use',
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

/** 预校验优惠券 结算前校验优惠券是否可用，返回预估抵扣金额 POST /api/v1/coupons/validate */
export async function postCouponsValidate(
  body: {
    order_amount?: number;
    user_coupon_id?: number;
  },
  options?: { [key: string]: any },
) {
  return request<API.Response & { data?: Record<string, any> }>(
    '/api/v1/coupons/validate',
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
