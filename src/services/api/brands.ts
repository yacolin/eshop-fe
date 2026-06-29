// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** 品牌列表 GET /api/v1/brands */
export async function getBrands(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getBrandsParams,
  options?: { [key: string]: any },
) {
  return request<API.Response & { data?: API.BrandListResult }>(
    '/api/v1/brands',
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

/** 创建品牌 POST /api/v1/brands */
export async function postBrands(
  body: API.CreateBrandReq,
  options?: { [key: string]: any },
) {
  return request<API.Response & { data?: API.Brand }>('/api/v1/brands', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 获取品牌详情 GET /api/v1/brands/${param0} */
export async function getBrandsId(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getBrandsIdParams,
  options?: { [key: string]: any },
) {
  const { id: param0, ...queryParams } = params;
  return request<API.Response & { data?: API.Brand }>(
    `/api/v1/brands/${param0}`,
    {
      method: 'GET',
      params: { ...queryParams },
      ...(options || {}),
    },
  );
}

/** 更新品牌 PUT /api/v1/brands/${param0} */
export async function putBrandsId(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.putBrandsIdParams,
  body: API.UpdateBrandReq,
  options?: { [key: string]: any },
) {
  const { id: param0, ...queryParams } = params;
  return request<API.Response & { data?: API.Brand }>(
    `/api/v1/brands/${param0}`,
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

/** 删除品牌 DELETE /api/v1/brands/${param0} */
export async function deleteBrandsId(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.deleteBrandsIdParams,
  options?: { [key: string]: any },
) {
  const { id: param0, ...queryParams } = params;
  return request<API.Response & { data?: Record<string, any> }>(
    `/api/v1/brands/${param0}`,
    {
      method: 'DELETE',
      params: { ...queryParams },
      ...(options || {}),
    },
  );
}
