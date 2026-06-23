// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** 创建属性值 为指定属性维度创建一个可选值 POST /api/v1/attribute-values */
export async function postAttributeValues(
  body: API.CreateAttributeValueDTO,
  options?: { [key: string]: any },
) {
  return request<API.Response & { data?: API.AttributeValueResponse }>(
    '/api/v1/attribute-values',
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

/** 更新属性值 根据ID更新属性可选值信息 PUT /api/v1/attribute-values/${param0} */
export async function putAttributeValuesId(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.putAttributeValuesIdParams,
  body: API.UpdateAttributeValueDTO,
  options?: { [key: string]: any },
) {
  const { id: param0, ...queryParams } = params;
  return request<API.Response & { data?: API.AttributeValueResponse }>(
    `/api/v1/attribute-values/${param0}`,
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

/** 删除属性值 根据ID删除属性可选值 DELETE /api/v1/attribute-values/${param0} */
export async function deleteAttributeValuesId(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.deleteAttributeValuesIdParams,
  options?: { [key: string]: any },
) {
  const { id: param0, ...queryParams } = params;
  return request<API.Response>(`/api/v1/attribute-values/${param0}`, {
    method: 'DELETE',
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** 获取属性值列表 获取指定属性维度的所有可选值 GET /api/v1/attributes/${param0}/values */
export async function getAttributesIdValues(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getAttributesIdValuesParams,
  options?: { [key: string]: any },
) {
  const { id: param0, ...queryParams } = params;
  return request<API.Response & { data?: API.AttributeValueResponse[] }>(
    `/api/v1/attributes/${param0}/values`,
    {
      method: 'GET',
      params: { ...queryParams },
      ...(options || {}),
    },
  );
}
