// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** 秒杀抢购 POST /api/v1/flash/buy */
export async function postFlashBuy(
  body: API.FlashBuyReq,
  options?: { [key: string]: any },
) {
  return request<API.Response>('/api/v1/flash/buy', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 确认秒杀订单 POST /api/v1/flash/confirm */
export async function postFlashConfirm(
  body: API.FlashConfirmReq,
  options?: { [key: string]: any },
) {
  return request<API.Response>('/api/v1/flash/confirm', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}
