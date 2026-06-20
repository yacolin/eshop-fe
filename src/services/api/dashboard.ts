// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** 获取仪表盘汇总数据 获取仪表盘全部汇总数据，包括核心指标、订单趋势、各状态分布、热销商品等 GET /api/v1/dashboard/stats */
export async function getDashboardStats(options?: { [key: string]: any }) {
  return request<API.Response & { data?: API.DashboardResponse }>(
    '/api/v1/dashboard/stats',
    {
      method: 'GET',
      ...(options || {}),
    },
  );
}
