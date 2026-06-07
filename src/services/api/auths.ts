// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** 密码登录 使用用户名和密码登录 POST /api/v1/auth/login/password */
export async function postAuthLoginPassword(
  body: API.PasswordLoginRequest,
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

/** 手机号登录 使用手机号和验证码登录 POST /api/v1/auth/login/phone */
export async function postAuthLoginPhone(
  body: API.PhoneLoginRequest,
  options?: { [key: string]: any },
) {
  return request<API.Response & { data?: API.LoginResponse }>(
    '/api/v1/auth/login/phone',
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

/** 微信登录 使用微信code登录 POST /api/v1/auth/login/wechat */
export async function postAuthLoginWechat(
  body: API.WechatLoginRequest,
  options?: { [key: string]: any },
) {
  return request<API.Response & { data?: API.LoginResponse }>(
    '/api/v1/auth/login/wechat',
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

/** 登出 用户登出，撤销token POST /api/v1/auth/logout */
export async function postAuthLogout(options?: { [key: string]: any }) {
  return request<API.Response>('/api/v1/auth/logout', {
    method: 'POST',
    ...(options || {}),
  });
}

/** 获取当前用户信息 获取当前登录用户信息 GET /api/v1/auth/me */
export async function getAuthMe(options?: { [key: string]: any }) {
  return request<API.Response>('/api/v1/auth/me', {
    method: 'GET',
    ...(options || {}),
  });
}

/** 刷新Token 使用refresh token获取新的access token POST /api/v1/auth/refresh */
export async function postAuthRefresh(
  body: API.RefreshTokenRequest,
  options?: { [key: string]: any },
) {
  return request<API.Response & { data?: API.LoginResponse }>(
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

/** 用户注册 用户注册 POST /api/v1/auth/register */
export async function postAuthRegister(
  body: API.RegisterRequest,
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
