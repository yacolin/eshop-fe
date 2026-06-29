// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** 促销列表 GET /api/v1/promotions */
export async function getPromotions(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getPromotionsParams,
  options?: { [key: string]: any },
) {
  return request<API.Response & { data?: API.PromotionListResult }>(
    '/api/v1/promotions',
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

/** 创建促销 POST /api/v1/promotions */
export async function postPromotions(
  body: API.CreatePromotionReq,
  options?: { [key: string]: any },
) {
  return request<API.Response & { data?: API.Promotion }>(
    '/api/v1/promotions',
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

/** 获取促销详情 GET /api/v1/promotions/${param0} */
export async function getPromotionsId(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getPromotionsIdParams,
  options?: { [key: string]: any },
) {
  const { id: param0, ...queryParams } = params;
  return request<API.Response & { data?: API.Promotion }>(
    `/api/v1/promotions/${param0}`,
    {
      method: 'GET',
      params: { ...queryParams },
      ...(options || {}),
    },
  );
}

/** 更新促销 PUT /api/v1/promotions/${param0} */
export async function putPromotionsId(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.putPromotionsIdParams,
  body: API.UpdatePromotionReq,
  options?: { [key: string]: any },
) {
  const { id: param0, ...queryParams } = params;
  return request<API.Response & { data?: API.Promotion }>(
    `/api/v1/promotions/${param0}`,
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

/** 删除促销 DELETE /api/v1/promotions/${param0} */
export async function deletePromotionsId(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.deletePromotionsIdParams,
  options?: { [key: string]: any },
) {
  const { id: param0, ...queryParams } = params;
  return request<API.Response>(`/api/v1/promotions/${param0}`, {
    method: 'DELETE',
    params: { ...queryParams },
    ...(options || {}),
  });
}
