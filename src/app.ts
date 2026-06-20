// 运行时配置
import RightContent from '@/components/RightContent';
import { WebSocketProvider } from '@/contexts/WebSocketContext';
import { postAuthLogout } from '@/services/api/auths';
import { parseToken } from '@/utils/auth';
import type { RequestConfig } from '@umijs/max';
import { history, request as umiRequest } from '@umijs/max';
import { message } from 'antd';
import React from 'react';

// 全局 WebSocket 连接，所有页面共享
export function rootContainer(container: React.ReactNode) {
  return React.createElement(WebSocketProvider, null, container);
}

// 全局初始化数据配置，用于 Layout 用户信息和权限初始化
// 更多信息见文档：https://umijs.org/docs/api/runtime-config#getinitialstate
export async function getInitialState(): Promise<{
  name: string;
  roles: string[];
  userId?: number;
}> {
  const savedUsername = localStorage.getItem('savedUsername');
  const claims = parseToken();
  const roles: string[] = claims?.roles || [];
  const userId: number | undefined = claims?.user_id || undefined;
  return {
    name: savedUsername || '未登录',
    roles,
    userId,
  };
}

export const layout = () => {
  const handleLogout = async () => {
    window.dispatchEvent(new Event('app:logout'));
    try {
      await postAuthLogout();
      message.success('登出成功');
    } catch (error) {
      console.error('登出失败:', error);
    } finally {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      history.push('/login');
    }
  };

  return {
    logo: 'https://img.alicdn.com/tfs/TB1YHEpwUT1gK0jSZFhXXaAtVXa-28-27.svg',
    title: 'Eshop Admin',
    layout: 'mix',
    menu: { locale: false },
    siderWidth: 260,
    rightContentRender: () =>
      React.createElement(RightContent, { onLogout: handleLogout }),
    logout: handleLogout,
  };
};

enum ErrorCode {
  BAD_REQUEST = 400,
  NOT_FOUND = 404,
  INTERNAL_SERVER_ERROR = 500,

  NO_TOKEN_FOUND = 4001,
  TOKEN_ILLGEAL = 4002,
  TOKEN_EXPIRED = 4003,
  USER_NOT_EXIST = 1001,
}

interface ResponseStructure {
  data: any;
  code: number;
  msg: string;
}

export const request: RequestConfig | any = {
  timeout: 10000,
  headers: { 'X-Requested-with': 'XMLHttpRequest' },
  baseURL: '',

  errorConfig: {
    errorThrower: (res: ResponseStructure) => {
      const { code, msg, data } = res;
      if (code !== 0) {
        const error: any = new Error(msg);
        error.name = 'BizError';
        error.info = { code, msg, data };
        throw error;
      }
    },

    errorHandler: async (error: any, opts: any) => {
      if (opts?.skipErrorHandler) throw error;
      // 我们的 errorThrower 抛出的错误。
      if (error.name === 'BizError') {
        const errorInfo: ResponseStructure | undefined = error.info;
        if (errorInfo) {
          switch (errorInfo.code) {
            case ErrorCode.BAD_REQUEST:
              message.warning(errorInfo.msg);
              break;

            default:
              message.warning(errorInfo.msg);
              break;
          }
        }
      } else if (error.response) {
        // Axios 的错误
        // 请求成功发出且服务器也响应了状态码，但状态代码超出了 2xx 的范围
        const { status } = error.response;
        if (status !== 401) {
          message.error(`Response status:${error.response.status}`);
        }

        const { response } = error;
        const originalRequest = response.config;

        // 如果响应状态码是401，表示token过期
        if (response.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          try {
            // 获取 refresh_token
            const refreshToken = localStorage.getItem('refresh_token') || '';
            if (!refreshToken) {
              // 如果没有 refresh_token，直接跳转到登录页
              window.location.href = '/login';
              // throw new Error('Refresh token not found');
            }

            // 请求新的 access_token
            const {
              data: { access_token },
            } = await umiRequest('/api/v1/refresh', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${refreshToken}`,
              },
              data: { refresh_token: refreshToken },
            });
            // 更新本地存储的 access_token
            localStorage.setItem('access_token', access_token);
            // 更新原始请求的 Authorization 头
            originalRequest.headers['Authorization'] = `Bearer ${access_token}`;

            // 重新发送原始请求
            return umiRequest(originalRequest.url, {
              method: originalRequest.method,
              headers: originalRequest.headers,
              data: originalRequest.data,
              params: originalRequest.params,
              skipErrorHandler: true,
            });
          } catch (refreshError) {
            // 如果刷新 token 失败，清除本地存储并跳转到登录页
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
            // window.location.href = '/login';
            return Promise.reject(refreshError);
          }
        }
      } else if (error.request) {
        // 请求已经成功发起，但没有收到响应
        // \`error.request\` 在浏览器中是 XMLHttpRequest 的实例，
        // 而在node.js中是 http.ClientRequest 的实例
        message.error('None response! Please retry.');
      } else {
        // 发送请求时出了点问题
        message.error('Request error, please retry.');
      }
    },
  },

  // 请求拦截器
  requestInterceptors: [
    (config: RequestConfig) => {
      // 请求中加入token
      let accessToken: string = localStorage.getItem('access_token') || '';
      if (accessToken) {
        config.headers = config.headers || {};
        config.headers['Authorization'] = `Bearer ${accessToken}`;
      }
      return config;
    },
  ],

  // 响应拦截器
  responseInterceptors: [
    async (response: Response | any) => {
      // 拦截响应数据，进行个性化处理
      const { data } = response;
      if (data.code !== 0) {
        message.error('请求失败！');
      }
      return response;
    },
  ],
};
