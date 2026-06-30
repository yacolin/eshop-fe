// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** 类目列表 GET /api/v1/categories */
export async function getCategories(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getCategoriesParams,
  options?: { [key: string]: any },
) {
  return request<API.Response & { data?: API.CategoryListResult }>(
    '/api/v1/categories',
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

/** 创建类目 POST /api/v1/categories */
export async function postCategories(
  body: API.CreateCategoryReq,
  options?: { [key: string]: any },
) {
  return request<API.Response & { data?: API.Category }>('/api/v1/categories', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 获取类目详情 GET /api/v1/categories/${param0} */
export async function getCategoriesId(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getCategoriesIdParams,
  options?: { [key: string]: any },
) {
  const { id: param0, ...queryParams } = params;
  return request<API.Response & { data?: API.Category }>(
    `/api/v1/categories/${param0}`,
    {
      method: 'GET',
      params: { ...queryParams },
      ...(options || {}),
    },
  );
}

/** 更新类目 PUT /api/v1/categories/${param0} */
export async function putCategoriesId(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.putCategoriesIdParams,
  body: API.UpdateCategoryReq,
  options?: { [key: string]: any },
) {
  const { id: param0, ...queryParams } = params;
  return request<API.Response & { data?: API.Category }>(
    `/api/v1/categories/${param0}`,
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

/** 删除类目 DELETE /api/v1/categories/${param0} */
export async function deleteCategoriesId(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.deleteCategoriesIdParams,
  options?: { [key: string]: any },
) {
  const { id: param0, ...queryParams } = params;
  return request<API.Response & { data?: Record<string, any> }>(
    `/api/v1/categories/${param0}`,
    {
      method: 'DELETE',
      params: { ...queryParams },
      ...(options || {}),
    },
  );
}

/** 查类目下的品牌列表 GET /api/v1/categories/${param0}/brands */
export async function getCategoriesIdBrands(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getCategoriesIdBrandsParams,
  options?: { [key: string]: any },
) {
  const { id: param0, ...queryParams } = params;
  return request<API.Response & { data?: API.CategoryBrandDetail[] }>(
    `/api/v1/categories/${param0}/brands`,
    {
      method: 'GET',
      params: { ...queryParams },
      ...(options || {}),
    },
  );
}

/** 设置类目关联的品牌 PUT /api/v1/categories/${param0}/brands */
export async function putCategoriesIdBrands(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.putCategoriesIdBrandsParams,
  body: API.SetCategoryBrandsReq,
  options?: { [key: string]: any },
) {
  const { id: param0, ...queryParams } = params;
  return request<API.Response>(`/api/v1/categories/${param0}/brands`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    params: { ...queryParams },
    data: body,
    ...(options || {}),
  });
}

/** 子类目列表 GET /api/v1/categories/${param0}/children */
export async function getCategoriesIdChildren(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getCategoriesIdChildrenParams,
  options?: { [key: string]: any },
) {
  const { id: param0, ...queryParams } = params;
  return request<API.Response & { data?: API.Category[] }>(
    `/api/v1/categories/${param0}/children`,
    {
      method: 'GET',
      params: { ...queryParams },
      ...(options || {}),
    },
  );
}

/** 全部分类 GET /api/v1/categories/all */
export async function getCategoriesAll(options?: { [key: string]: any }) {
  return request<API.Response & { data?: API.Category[] }>(
    '/api/v1/categories/all',
    {
      method: 'GET',
      ...(options || {}),
    },
  );
}

/** 按层级查询 GET /api/v1/categories/level/${param0} */
export async function getCategoriesLevelLevel(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getCategoriesLevelLevelParams,
  options?: { [key: string]: any },
) {
  const { level: param0, ...queryParams } = params;
  return request<API.Response & { data?: API.Category[] }>(
    `/api/v1/categories/level/${param0}`,
    {
      method: 'GET',
      params: { ...queryParams },
      ...(options || {}),
    },
  );
}

/** 根类目列表 GET /api/v1/categories/root */
export async function getCategoriesRoot(options?: { [key: string]: any }) {
  return request<API.Response & { data?: API.Category[] }>(
    '/api/v1/categories/root',
    {
      method: 'GET',
      ...(options || {}),
    },
  );
}
