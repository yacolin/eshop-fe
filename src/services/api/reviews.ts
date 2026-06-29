// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** 管理员删除评价 DELETE /api/v1/admin/reviews/${param0} */
export async function deleteAdminReviewsId(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.deleteAdminReviewsIdParams,
  options?: { [key: string]: any },
) {
  const { id: param0, ...queryParams } = params;
  return request<API.Response>(`/api/v1/admin/reviews/${param0}`, {
    method: 'DELETE',
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** 审核评价 PATCH /api/v1/admin/reviews/${param0}/moderate */
export async function patchAdminReviewsIdModerate(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.patchAdminReviewsIdModerateParams,
  body: API.ModerateReviewReq,
  options?: { [key: string]: any },
) {
  const { id: param0, ...queryParams } = params;
  return request<API.Response>(`/api/v1/admin/reviews/${param0}/moderate`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    params: { ...queryParams },
    data: body,
    ...(options || {}),
  });
}

/** 商家回复 POST /api/v1/admin/reviews/${param0}/reply */
export async function postAdminReviewsIdReply(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.postAdminReviewsIdReplyParams,
  body: API.ReplyReviewReq,
  options?: { [key: string]: any },
) {
  const { id: param0, ...queryParams } = params;
  return request<API.Response>(`/api/v1/admin/reviews/${param0}/reply`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    params: { ...queryParams },
    data: body,
    ...(options || {}),
  });
}

/** 待审核评价列表 GET /api/v1/admin/reviews/pending */
export async function getAdminReviewsPending(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getAdminReviewsPendingParams,
  options?: { [key: string]: any },
) {
  return request<API.Response & { data?: API.ReviewListResult }>(
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

/** 商品评分汇总 GET /api/v1/products/${param0}/rating */
export async function getProductsIdRating(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getProductsIdRatingParams,
  options?: { [key: string]: any },
) {
  const { id: param0, ...queryParams } = params;
  return request<API.Response & { data?: API.ReviewRatingResp }>(
    `/api/v1/products/${param0}/rating`,
    {
      method: 'GET',
      params: { ...queryParams },
      ...(options || {}),
    },
  );
}

/** 商品评价列表 GET /api/v1/products/${param0}/reviews */
export async function getProductsIdReviews(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getProductsIdReviewsParams,
  options?: { [key: string]: any },
) {
  const { id: param0, ...queryParams } = params;
  return request<API.Response & { data?: API.ReviewListResult }>(
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

/** 创建评价 POST /api/v1/reviews */
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

/** 删除我的评价 DELETE /api/v1/reviews/${param0} */
export async function deleteReviewsId(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.deleteReviewsIdParams,
  options?: { [key: string]: any },
) {
  const { id: param0, ...queryParams } = params;
  return request<API.Response>(`/api/v1/reviews/${param0}`, {
    method: 'DELETE',
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** 我的评价 GET /api/v1/reviews/me */
export async function getReviewsMe(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getReviewsMeParams,
  options?: { [key: string]: any },
) {
  return request<API.Response & { data?: API.ReviewListResult }>(
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
