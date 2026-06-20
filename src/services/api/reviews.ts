// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** 管理员删除评论 管理员强制删除指定评论 DELETE /api/v1/admin/reviews/${param0} */
export async function deleteAdminReviewsId(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.deleteAdminReviewsIdParams,
  options?: { [key: string]: any },
) {
  const { id: param0, ...queryParams } = params;
  return request<API.Response & { data?: Record<string, any> }>(
    `/api/v1/admin/reviews/${param0}`,
    {
      method: 'DELETE',
      params: { ...queryParams },
      ...(options || {}),
    },
  );
}

/** 审核评论 管理员审核评论，可设置为通过(approved)、拒绝(rejected)或隐藏(hidden) PATCH /api/v1/admin/reviews/${param0}/moderate */
export async function patchAdminReviewsIdModerate(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.patchAdminReviewsIdModerateParams,
  body: API.ModerateReviewReq,
  options?: { [key: string]: any },
) {
  const { id: param0, ...queryParams } = params;
  return request<API.Response & { data?: Record<string, any> }>(
    `/api/v1/admin/reviews/${param0}/moderate`,
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

/** 商家回复评论 管理员/商家回复指定评论 POST /api/v1/admin/reviews/${param0}/reply */
export async function postAdminReviewsIdReply(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.postAdminReviewsIdReplyParams,
  body: API.ReplyReviewReq,
  options?: { [key: string]: any },
) {
  const { id: param0, ...queryParams } = params;
  return request<API.Response & { data?: Record<string, any> }>(
    `/api/v1/admin/reviews/${param0}/reply`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      params: { ...queryParams },
      data: body,
      ...(options || {}),
    },
  );
}

/** 查询待审核评论列表 管理员查询所有待审核评论列表，支持分页 GET /api/v1/admin/reviews/pending */
export async function getAdminReviewsPending(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getAdminReviewsPendingParams,
  options?: { [key: string]: any },
) {
  return request<API.Response & { data?: API.ReviewListResp }>(
    '/api/v1/admin/reviews/pending',
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

/** 获取产品评分汇总 根据产品ID获取评分汇总，包含平均分和各星级数量 GET /api/v1/products/${param0}/rating */
export async function getProductsIdRating(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getProductsIdRatingParams,
  options?: { [key: string]: any },
) {
  const { id: param0, ...queryParams } = params;
  return request<API.Response & { data?: API.ProductRatingResp }>(
    `/api/v1/products/${param0}/rating`,
    {
      method: 'GET',
      params: { ...queryParams },
      ...(options || {}),
    },
  );
}

/** 查询产品评论列表 根据产品ID查询已审核通过的评论列表，支持分页 GET /api/v1/products/${param0}/reviews */
export async function getProductsIdReviews(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getProductsIdReviewsParams,
  options?: { [key: string]: any },
) {
  const { id: param0, ...queryParams } = params;
  return request<API.Response & { data?: API.ReviewListResp }>(
    `/api/v1/products/${param0}/reviews`,
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

/** 创建评论 已登录用户创建评论或评分，需提供订单项ID以校验已购买 POST /api/v1/reviews */
export async function postReviews(
  body: API.CreateReviewReq,
  options?: { [key: string]: any },
) {
  return request<API.Response & { data?: API.ReviewResp }>('/api/v1/reviews', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 删除我的评论 删除本人发表的评论，需校验评论归属 DELETE /api/v1/reviews/${param0} */
export async function deleteReviewsId(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.deleteReviewsIdParams,
  options?: { [key: string]: any },
) {
  const { id: param0, ...queryParams } = params;
  return request<API.Response & { data?: Record<string, any> }>(
    `/api/v1/reviews/${param0}`,
    {
      method: 'DELETE',
      params: { ...queryParams },
      ...(options || {}),
    },
  );
}

/** 查询我的评论 查询当前登录用户的所有评论（含所有审核状态），支持分页 GET /api/v1/reviews/me */
export async function getReviewsMe(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getReviewsMeParams,
  options?: { [key: string]: any },
) {
  return request<API.Response & { data?: API.ReviewListResp }>(
    '/api/v1/reviews/me',
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
