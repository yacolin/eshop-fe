// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** 基于游标分页查询活动列表 使用游标分页代替传统 OFFSET 分页，解决深分页性能问题 GET /api/v1/flash/activities/cursor */
export async function getFlashActivitiesCursor(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getFlashActivitiesCursorParams,
  options?: { [key: string]: any },
) {
  return request<API.Response & { data?: API.ActivityCursorResult }>(
    '/api/v1/flash/activities/cursor',
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
