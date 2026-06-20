// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** 创建促销活动 创建新的促销活动（限时折扣/满减活动） POST /api/v1/admin/promotions */
export async function postAdminPromotions(
  body: API.CreatePromotionReq,
  options?: { [key: string]: any },
) {
  return request<API.Response & { data?: API.PromotionResponse }>(
    '/api/v1/admin/promotions',
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

/** 更新促销活动 更新指定促销活动的信息 PUT /api/v1/admin/promotions/${param0} */
export async function putAdminPromotionsId(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.putAdminPromotionsIdParams,
  body: API.UpdatePromotionReq,
  options?: { [key: string]: any },
) {
  const { id: param0, ...queryParams } = params;
  return request<API.Response & { data?: API.PromotionResponse }>(
    `/api/v1/admin/promotions/${param0}`,
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

/** 关联促销商品 为促销活动关联指定商品，会覆盖原有商品列表 POST /api/v1/admin/promotions/${param0}/products */
export async function postAdminPromotionsIdProducts(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.postAdminPromotionsIdProductsParams,
  body: API.LinkProductsReq,
  options?: { [key: string]: any },
) {
  const { id: param0, ...queryParams } = params;
  return request<API.Response & { data?: Record<string, any> }>(
    `/api/v1/admin/promotions/${param0}/products`,
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

/** 更新促销活动状态 更新指定促销活动的状态（pending/active/finished/cancelled） PUT /api/v1/admin/promotions/${param0}/status */
export async function putAdminPromotionsIdStatus(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.putAdminPromotionsIdStatusParams,
  body: {
    status?: string;
  },
  options?: { [key: string]: any },
) {
  const { id: param0, ...queryParams } = params;
  return request<API.Response & { data?: Record<string, any> }>(
    `/api/v1/admin/promotions/${param0}/status`,
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

/** 促销活动列表 分页查询促销活动列表 GET /api/v1/promotions */
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
        // page_size has a default value: 20
        page_size: '20',
        ...params,
      },
      ...(options || {}),
    },
  );
}

/** 获取促销活动详情 根据ID获取促销活动详情 GET /api/v1/promotions/${param0} */
export async function getPromotionsId(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getPromotionsIdParams,
  options?: { [key: string]: any },
) {
  const { id: param0, ...queryParams } = params;
  return request<API.Response & { data?: API.PromotionResponse }>(
    `/api/v1/promotions/${param0}`,
    {
      method: 'GET',
      params: { ...queryParams },
      ...(options || {}),
    },
  );
}

/** 获取促销关联商品 获取指定促销活动关联的所有商品 GET /api/v1/promotions/${param0}/products */
export async function getPromotionsIdProducts(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getPromotionsIdProductsParams,
  options?: { [key: string]: any },
) {
  const { id: param0, ...queryParams } = params;
  return request<API.Response & { data?: Record<string, any>[] }>(
    `/api/v1/promotions/${param0}/products`,
    {
      method: 'GET',
      params: { ...queryParams },
      ...(options || {}),
    },
  );
}

/** 获取进行中的促销活动 获取所有当前正在进行的促销活动 GET /api/v1/promotions/active */
export async function getPromotionsActive(options?: { [key: string]: any }) {
  return request<API.Response & { data?: API.PromotionResponse[] }>(
    '/api/v1/promotions/active',
    {
      method: 'GET',
      ...(options || {}),
    },
  );
}
