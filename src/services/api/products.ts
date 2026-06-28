// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** 列出所有产品 获取所有产品的列表 GET /api/v1/products */
export async function getProducts(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getProductsParams,
  options?: { [key: string]: any },
) {
  return request<API.Response & { data?: API.ProductListResult }>(
    '/api/v1/products',
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

/** 创建产品 创建一个新的产品 POST /api/v1/products */
export async function postProducts(
  body: API.CreateProductDTO,
  options?: { [key: string]: any },
) {
  return request<API.Response & { data?: API.Product }>('/api/v1/products', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 获取产品详情 根据产品ID获取产品详情 GET /api/v1/products/${param0} */
export async function getProductsId(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getProductsIdParams,
  options?: { [key: string]: any },
) {
  const { id: param0, ...queryParams } = params;
  return request<API.Response & { data?: API.Product }>(
    `/api/v1/products/${param0}`,
    {
      method: 'GET',
      params: { ...queryParams },
      ...(options || {}),
    },
  );
}

/** 更新产品 根据ID更新产品信息 PUT /api/v1/products/${param0} */
export async function putProductsId(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.putProductsIdParams,
  body: API.UpdateProductDTO,
  options?: { [key: string]: any },
) {
  const { id: param0, ...queryParams } = params;
  return request<API.Response & { data?: API.Product }>(
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

/** 删除产品 根据ID删除产品 DELETE /api/v1/products/${param0} */
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

/** 获取产品属性定义 获取产品的所有规格属性维度及其可选值 GET /api/v1/products/${param0}/attributes */
export async function getProductsIdAttributes(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getProductsIdAttributesParams,
  options?: { [key: string]: any },
) {
  const { id: param0, ...queryParams } = params;
  return request<API.Response & { data?: API.ProductAttributeItem[] }>(
    `/api/v1/products/${param0}/attributes`,
    {
      method: 'GET',
      params: { ...queryParams },
      ...(options || {}),
    },
  );
}

/** 更新产品属性关联 全量替换产品的规格属性值关联，原有关联会被清除 PUT /api/v1/products/${param0}/attributes */
export async function putProductsIdAttributes(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.putProductsIdAttributesParams,
  body: API.UpdateProductAttributesDTO,
  options?: { [key: string]: any },
) {
  const { id: param0, ...queryParams } = params;
  return request<API.Response>(`/api/v1/products/${param0}/attributes`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    params: { ...queryParams },
    data: body,
    ...(options || {}),
  });
}

/** 获取产品详情（含 SKU） GET /api/v1/products/${param0}/detail */
export async function getProductsIdDetail(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getProductsIdDetailParams,
  options?: { [key: string]: any },
) {
  const { id: param0, ...queryParams } = params;
  return request<API.Response & { data?: API.ProductWithSkusResponse }>(
    `/api/v1/products/${param0}/detail`,
    {
      method: 'GET',
      params: { ...queryParams },
      ...(options || {}),
    },
  );
}

/** 获取产品详情（含分类） 根据产品ID获取产品详情，包含产品信息和所有分类信息 GET /api/v1/products/${param0}/enriched */
export async function getProductsIdEnriched(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getProductsIdEnrichedParams,
  options?: { [key: string]: any },
) {
  const { id: param0, ...queryParams } = params;
  return request<API.Response & { data?: API.ProductWithCategoryDTO }>(
    `/api/v1/products/${param0}/enriched`,
    {
      method: 'GET',
      params: { ...queryParams },
      ...(options || {}),
    },
  );
}

/** 批量创建 SKU 批量创建 SKU，自动生成属性组合关联 POST /api/v1/products/${param0}/skus/batch */
export async function postProductsIdSkusBatch(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.postProductsIdSkusBatchParams,
  body: API.BatchCreateSkuDTO,
  options?: { [key: string]: any },
) {
  const { id: param0, ...queryParams } = params;
  return request<API.Response & { data?: API.BatchCreateSkuResult }>(
    `/api/v1/products/${param0}/skus/batch`,
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

/** 从缓存获取产品列表 从 Redis 缓存中读取产品列表，支持分页、排序和分类筛选 GET /api/v1/products/cache */
export async function getProductsCache(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getProductsCacheParams,
  options?: { [key: string]: any },
) {
  return request<API.Response & { data?: API.ProductListResult }>(
    '/api/v1/products/cache',
    {
      method: 'GET',
      params: {
        // page has a default value: 1
        page: '1',
        // size has a default value: 10
        size: '10',

        // order has a default value: asc
        order: 'asc',
        ...params,
      },
      ...(options || {}),
    },
  );
}

/** 从缓存查询商品 从 Redis 缓存中根据 ID 查询单个商品 GET /api/v1/products/cache/${param0} */
export async function getProductsCacheId(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getProductsCacheIdParams,
  options?: { [key: string]: any },
) {
  const { id: param0, ...queryParams } = params;
  return request<API.Response & { data?: API.Product }>(
    `/api/v1/products/cache/${param0}`,
    {
      method: 'GET',
      params: { ...queryParams },
      ...(options || {}),
    },
  );
}

/** 基于游标从缓存查询商品 从 Redis 缓存中基于游标分页读取商品列表 GET /api/v1/products/cache/cursor */
export async function getProductsCacheCursor(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getProductsCacheCursorParams,
  options?: { [key: string]: any },
) {
  return request<API.Response & { data?: API.ProductCacheCursorResult }>(
    '/api/v1/products/cache/cursor',
    {
      method: 'GET',
      params: {
        // size has a default value: 20
        size: '20',
        ...params,
      },
      ...(options || {}),
    },
  );
}

/** 预热商品缓存 将全量商品数据加载到 Redis 缓存中 POST /api/v1/products/cache/warmup */
export async function postProductsCacheWarmup(options?: {
  [key: string]: any;
}) {
  return request<API.Response & { data?: Record<string, any> }>(
    '/api/v1/products/cache/warmup',
    {
      method: 'POST',
      ...(options || {}),
    },
  );
}

/** 根据分类获取产品列表 根据分类ID获取产品列表 GET /api/v1/products/category/${param0} */
export async function getProductsCategoryCategoryId(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getProductsCategoryCategoryIdParams,
  options?: { [key: string]: any },
) {
  const { category_id: param0, ...queryParams } = params;
  return request<API.Response & { data?: API.Product[] }>(
    `/api/v1/products/category/${param0}`,
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

/** 基于游标分页查询商品 使用游标分页代替传统 OFFSET 分页，解决深分页性能问题 GET /api/v1/products/cursor */
export async function getProductsCursor(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getProductsCursorParams,
  options?: { [key: string]: any },
) {
  return request<API.Response & { data?: API.ProductCursorResult }>(
    '/api/v1/products/cursor',
    {
      method: 'GET',
      params: {
        // size has a default value: 20
        size: '20',

        ...params,
      },
      ...(options || {}),
    },
  );
}

/** 列出所有产品（含分类） 获取所有产品的列表，每个产品附带其所有分类信息，通过一次批量查询补全 GET /api/v1/products/enriched */
export async function getProductsEnriched(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getProductsEnrichedParams,
  options?: { [key: string]: any },
) {
  return request<API.Response & { data?: API.ProductWithCategoryListResult }>(
    '/api/v1/products/enriched',
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
