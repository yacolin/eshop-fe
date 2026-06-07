// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** 列出所有分类 获取所有分类的列表，支持分页 GET /api/v1/categories */
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

/** 创建分类 创建一个新的分类 POST /api/v1/categories */
export async function postCategories(
  body: API.CreateCategoryDTO,
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

/** 获取分类详情 根据ID获取分类详细信息 GET /api/v1/categories/${param0} */
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

/** 更新分类 根据ID更新分类信息 PUT /api/v1/categories/${param0} */
export async function putCategoriesId(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.putCategoriesIdParams,
  body: API.UpdateCategoryDTO,
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

/** 删除分类 根据ID删除分类 DELETE /api/v1/categories/${param0} */
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

/** 列出子分类 根据父分类ID获取子分类列表 GET /api/v1/categories/${param0}/children */
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

/** 列出根分类 获取所有根分类的列表 GET /api/v1/categories/root */
export async function getCategoriesRoot(options?: { [key: string]: any }) {
  return request<API.Response & { data?: API.Category[] }>(
    '/api/v1/categories/root',
    {
      method: 'GET',
      ...(options || {}),
    },
  );
}
