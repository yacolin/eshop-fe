// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** 按类目查询属性 GET /api/v1/attributes */
export async function getAttributes(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getAttributesParams,
  options?: { [key: string]: any },
) {
  return request<API.Response & { data?: API.Attribute[] }>(
    '/api/v1/attributes',
    {
      method: 'GET',
      params: {
        ...params,
      },
      ...(options || {}),
    },
  );
}

/** 创建属性 POST /api/v1/attributes */
export async function postAttributes(
  body: API.CreateAttributeReq,
  options?: { [key: string]: any },
) {
  return request<API.Response & { data?: API.Attribute }>(
    '/api/v1/attributes',
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

/** 获取属性详情 GET /api/v1/attributes/${param0} */
export async function getAttributesId(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getAttributesIdParams,
  options?: { [key: string]: any },
) {
  const { id: param0, ...queryParams } = params;
  return request<API.Response & { data?: API.Attribute }>(
    `/api/v1/attributes/${param0}`,
    {
      method: 'GET',
      params: { ...queryParams },
      ...(options || {}),
    },
  );
}

/** 更新属性 PUT /api/v1/attributes/${param0} */
export async function putAttributesId(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.putAttributesIdParams,
  body: API.UpdateAttributeReq,
  options?: { [key: string]: any },
) {
  const { id: param0, ...queryParams } = params;
  return request<API.Response & { data?: API.Attribute }>(
    `/api/v1/attributes/${param0}`,
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

/** 删除属性 DELETE /api/v1/attributes/${param0} */
export async function deleteAttributesId(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.deleteAttributesIdParams,
  options?: { [key: string]: any },
) {
  const { id: param0, ...queryParams } = params;
  return request<API.Response & { data?: Record<string, any> }>(
    `/api/v1/attributes/${param0}`,
    {
      method: 'DELETE',
      params: { ...queryParams },
      ...(options || {}),
    },
  );
}

/** 按类目查询可筛选项 GET /api/v1/attributes/searchable */
export async function getAttributesSearchable(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getAttributesSearchableParams,
  options?: { [key: string]: any },
) {
  return request<API.Response & { data?: API.Attribute[] }>(
    '/api/v1/attributes/searchable',
    {
      method: 'GET',
      params: {
        ...params,
      },
      ...(options || {}),
    },
  );
}

/** 按类目查询 SKU 规格 GET /api/v1/attributes/sku-spec */
export async function getAttributesSkuSpec(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getAttributesSkuSpecParams,
  options?: { [key: string]: any },
) {
  return request<API.Response & { data?: API.Attribute[] }>(
    '/api/v1/attributes/sku-spec',
    {
      method: 'GET',
      params: {
        ...params,
      },
      ...(options || {}),
    },
  );
}
