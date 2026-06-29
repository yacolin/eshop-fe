// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** 获取仪表盘汇总数据 GET /api/v1/dashboard/stats */
export async function getDashboardStats(options?: { [key: string]: any }) {
  return request<API.Response & { data?: API.DashboardResponse }>(
    '/api/v1/dashboard/stats',
    {
      method: 'GET',
      ...(options || {}),
    },
  );
}
