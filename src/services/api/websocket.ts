// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** 升级WebSocket连接 将HTTP连接升级为WebSocket连接，支持断线重连时携带last_seq参数 GET /api/v1/ws */
export async function getWs(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getWsParams,
  options?: { [key: string]: any },
) {
  return request<any>('/api/v1/ws', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** WebSocket重连接口 客户端重连时提交lastSeq，服务端返回需要补发的消息 POST /api/v1/ws/reconnect */
export async function postWsReconnect(
  body: API.ReconnectRequest,
  options?: { [key: string]: any },
) {
  return request<API.Response & { data?: API.ReconnectResponse }>(
    '/api/v1/ws/reconnect',
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

/** 获取用户会话信息 获取当前用户的WebSocket会话信息，包括最后收到的消息序列号等 GET /api/v1/ws/session */
export async function getWsSession(options?: { [key: string]: any }) {
  return request<API.Response & { data?: API.SessionResponse }>(
    '/api/v1/ws/session',
    {
      method: 'GET',
      ...(options || {}),
    },
  );
}

/** 获取在线统计 获取当前WebSocket在线用户数和连接数 GET /api/v1/ws/stats */
export async function getWsStats(options?: { [key: string]: any }) {
  return request<API.Response & { data?: API.OnlineStatsResponse }>(
    '/api/v1/ws/stats',
    {
      method: 'GET',
      ...(options || {}),
    },
  );
}
