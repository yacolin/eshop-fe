// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** 获取属性维度列表 分页查询规格属性维度列表 GET /api/v1/attributes */
export async function getAttributes(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getAttributesParams,
  options?: { [key: string]: any },
) {
  return request<API.Response & { data?: API.AttributeListResult }>(
    '/api/v1/attributes',
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

/** 创建属性维度 创建一个新的规格属性维度，如"颜色"、"尺寸" POST /api/v1/attributes */
export async function postAttributes(
  body: API.CreateAttributeDTO,
  options?: { [key: string]: any },
) {
  return request<API.Response & { data?: API.AttributeResponse }>(
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

/** 获取属性维度详情 根据ID获取规格属性维度详情 GET /api/v1/attributes/${param0} */
export async function getAttributesId(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getAttributesIdParams,
  options?: { [key: string]: any },
) {
  const { id: param0, ...queryParams } = params;
  return request<API.Response & { data?: API.AttributeResponse }>(
    `/api/v1/attributes/${param0}`,
    {
      method: 'GET',
      params: { ...queryParams },
      ...(options || {}),
    },
  );
}

/** 更新属性维度 根据ID更新规格属性维度信息 PUT /api/v1/attributes/${param0} */
export async function putAttributesId(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.putAttributesIdParams,
  body: API.UpdateAttributeDTO,
  options?: { [key: string]: any },
) {
  const { id: param0, ...queryParams } = params;
  return request<API.Response & { data?: API.AttributeResponse }>(
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

/** 删除属性维度 根据ID删除规格属性维度 DELETE /api/v1/attributes/${param0} */
export async function deleteAttributesId(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.deleteAttributesIdParams,
  options?: { [key: string]: any },
) {
  const { id: param0, ...queryParams } = params;
  return request<API.Response>(`/api/v1/attributes/${param0}`, {
    method: 'DELETE',
    params: { ...queryParams },
    ...(options || {}),
  });
}
