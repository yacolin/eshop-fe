// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** 商品列表（keyset 游标分页） GET /api/v1/products */
export async function getProducts(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getProductsParams,
  options?: { [key: string]: any },
) {
  return request<API.Response & { data?: API.SPUListResult }>(
    '/api/v1/products',
    {
      method: 'GET',
      params: {
        // size has a default value: 10
        size: '10',

        ...params,
      },
      ...(options || {}),
    },
  );
}

/** 创建商品 POST /api/v1/products */
export async function postProducts(
  body: API.CreateSPUReq,
  options?: { [key: string]: any },
) {
  return request<API.Response & { data?: API.SPU }>('/api/v1/products', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 获取商品详情 GET /api/v1/products/${param0} */
export async function getProductsId(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getProductsIdParams,
  options?: { [key: string]: any },
) {
  const { id: param0, ...queryParams } = params;
  return request<API.Response & { data?: API.SPU }>(
    `/api/v1/products/${param0}`,
    {
      method: 'GET',
      params: { ...queryParams },
      ...(options || {}),
    },
  );
}

/** 更新商品 PUT /api/v1/products/${param0} */
export async function putProductsId(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.putProductsIdParams,
  body: API.UpdateSPUReq,
  options?: { [key: string]: any },
) {
  const { id: param0, ...queryParams } = params;
  return request<API.Response & { data?: API.SPU }>(
    `/api/v1/products/${param0}`,
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

/** 删除商品 DELETE /api/v1/products/${param0} */
export async function deleteProductsId(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.deleteProductsIdParams,
  options?: { [key: string]: any },
) {
  const { id: param0, ...queryParams } = params;
  return request<API.Response & { data?: Record<string, any> }>(
    `/api/v1/products/${param0}`,
    {
      method: 'DELETE',
      params: { ...queryParams },
      ...(options || {}),
    },
  );
}
