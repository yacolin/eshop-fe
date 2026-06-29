// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** 密码登录 POST /api/v1/auth/login/password */
export async function postAuthLoginPassword(
  body: API.PasswordLoginReq,
  options?: { [key: string]: any },
) {
  return request<API.Response & { data?: API.LoginResponse }>(
    '/api/v1/auth/login/password',
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

/** 刷新令牌 POST /api/v1/auth/refresh */
export async function postAuthRefresh(
  body: API.RefreshTokenReq,
  options?: { [key: string]: any },
) {
  return request<API.Response & { data?: API.TokenResponse }>(
    '/api/v1/auth/refresh',
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

/** 注册 POST /api/v1/auth/register */
export async function postAuthRegister(
  body: API.RegisterReq,
  options?: { [key: string]: any },
) {
  return request<API.Response & { data?: API.LoginResponse }>(
    '/api/v1/auth/register',
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
