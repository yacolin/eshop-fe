// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** 通知列表 分页查询当前用户的通知列表 GET /api/v1/notifications */
export async function getNotifications(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getNotificationsParams,
  options?: { [key: string]: any },
) {
  return request<API.Response & { data?: API.NotificationListResult }>(
    '/api/v1/notifications',
    {
      method: 'GET',
      params: {
        // page has a default value: 1
        page: '1',
        // page_size has a default value: 20
        page_size: '20',
        ...params,
      },
      ...(options || {}),
    },
  );
}

/** 删除通知 删除指定通知 DELETE /api/v1/notifications/${param0} */
export async function deleteNotificationsId(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.deleteNotificationsIdParams,
  options?: { [key: string]: any },
) {
  const { id: param0, ...queryParams } = params;
  return request<API.Response>(`/api/v1/notifications/${param0}`, {
    method: 'DELETE',
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** 标记已读 标记指定通知为已读 PUT /api/v1/notifications/${param0}/read */
export async function putNotificationsIdRead(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.putNotificationsIdReadParams,
  options?: { [key: string]: any },
) {
  const { id: param0, ...queryParams } = params;
  return request<API.Response>(`/api/v1/notifications/${param0}/read`, {
    method: 'PUT',
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** 全部已读 标记当前用户所有通知为已读 PUT /api/v1/notifications/read-all */
export async function putNotificationsReadAll(options?: {
  [key: string]: any;
}) {
  return request<API.Response>('/api/v1/notifications/read-all', {
    method: 'PUT',
    ...(options || {}),
  });
}

/** 发送系统通知 发送系统通知给指定用户（管理员接口） POST /api/v1/notifications/system */
export async function postNotificationsSystem(
  body: API.SendSystemNotificationDTO,
  options?: { [key: string]: any },
) {
  return request<API.Response>('/api/v1/notifications/system', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 未读通知数 获取当前用户的未读通知数量 GET /api/v1/notifications/unread */
export async function getNotificationsUnread(options?: { [key: string]: any }) {
  return request<API.Response & { data?: API.UnreadCountResponse }>(
    '/api/v1/notifications/unread',
    {
      method: 'GET',
      ...(options || {}),
    },
  );
}
