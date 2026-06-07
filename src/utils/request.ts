import type { RequestConfig } from '@umijs/max';
import { message } from 'antd';

/**
 * 业务错误码（与后端 BizError Code 对齐）
 *
 * 域：通用/商品相关  1001-1023
 * 域：权限相关      2001-2999
 * 域：前端本地令牌   4001-4999
 */
enum ErrorCode {
  // HTTP 状态码
  BAD_REQUEST = 400,
  NOT_FOUND = 404,
  INTERNAL_SERVER_ERROR = 500,

  // ===== 域：通用/商品（1001-1023） =====
  PRODUCT_NOT_FOUND = 1001,
  INVALID_PARAMS = 1002,
  PAGINATION_QUERY = 1003,
  UNAUTHORIZED = 1004,
  USER_NOT_FOUND = 1005,
  ORDER_NOT_FOUND = 1006,
  DUPLICATE_ORDER = 1007,
  PAYMENT_FAILED = 1008,
  INVALID_CREDENTIALS = 1009,
  RESOURCE_NOT_FOUND = 1010,
  ACCOUNT_DISABLED = 1011,
  WECHAT_CLIENT_NOT_CONFIGURED = 1012,
  USERNAME_ALREADY_EXISTS = 1013,
  UNSUPPORTED_PROVIDER = 1014,
  IDENTITY_ALREADY_BOUND = 1015,
  INVALID_TOKEN = 1016,
  TOKEN_REVOKED = 1017,
  GENERATE_ACCESS_TOKEN_FAILED = 1018,
  GENERATE_REFRESH_TOKEN_FAILED = 1019,
  SAVE_REFRESH_TOKEN_FAILED = 1020,
  UNEXPECTED_SIGNING_METHOD = 1021,
  PARSE_TOKEN_FAILED = 1022,
  DUPLICATE_SKU = 1023,

  // ===== 域：权限（2001-2999） =====
  PERMISSION_NOT_FOUND = 2001,
  INSUFFICIENT_PERMISSIONS = 2002,
  CANNOT_MODIFY_SYSTEM_ROLE = 2003,
  CANNOT_DELETE_SYSTEM_ROLE = 2004,

  // ===== 域：前端本地令牌校验（4001-4999） =====
  NO_TOKEN_FOUND = 4001,
  TOKEN_ILLEGAL = 4002,
  TOKEN_EXPIRED = 4003,
}

interface ResponseStructure {
  data: any;
  code: number;
  msg: string;
  trace_id?: string;
}

export const request: RequestConfig | any = {
  timeout: 10000,
  headers: { 'X-Requested-with': 'XMLHttpRequest' },

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

    errorHandler: (error: any, opts: any) => {
      if (opts?.skipErrorHandler) throw error;

      if (error.name === 'BizError') {
        const errorInfo: ResponseStructure | undefined = error.info;
        if (!errorInfo) return;

        switch (errorInfo.code) {
          // —— 认证/令牌 ——
          case ErrorCode.UNAUTHORIZED:
          case ErrorCode.INVALID_TOKEN:
          case ErrorCode.TOKEN_REVOKED:
          case ErrorCode.TOKEN_EXPIRED:
          case ErrorCode.TOKEN_ILLEGAL:
          case ErrorCode.NO_TOKEN_FOUND:
            message.warning('登录已过期，请重新登录');
            // 跳转登录页
            window.location.href = '/login';
            break;

          case ErrorCode.INSUFFICIENT_PERMISSIONS:
            message.error('权限不足，无法执行此操作');
            break;

          case ErrorCode.ACCOUNT_DISABLED:
            message.error('账号已被禁用，请联系管理员');
            break;

          case ErrorCode.INVALID_CREDENTIALS:
            message.warning('用户名或密码错误');
            break;

          case ErrorCode.USERNAME_ALREADY_EXISTS:
            message.warning('用户名已存在');
            break;

          // —— 通用兜底 ——
          default:
            message.warning(errorInfo.msg);
            break;
        }
      } else if (error.response) {
        // Axios 的错误：服务器返回了非 2xx 状态码
        message.error(`请求失败 (${error.response.status})`);
      } else if (error.request) {
        // 请求已发出，但没有收到响应
        message.error('网络异常，请检查网络后重试');
      } else {
        // 发送请求时出错
        message.error('请求出错，请稍后重试');
      }
    },
  },

  // 请求拦截器
  requestInterceptors: [
    (config: RequestConfig) => {
      // 请求中加入 access_token
      let token: string = localStorage.getItem('access_token') || '';
      return { ...config, token };
    },
  ],

  // 响应拦截器
  responseInterceptors: [
    (response: Response | any) => {
      // 拦截响应数据，进行个性化处理
      const { data } = response;
      if (data.code !== 0) {
        // 不需要重复弹窗，errorConfig.errorThrower + errorHandler 会处理
        console.warn(`[BizError] code=${data.code} msg=${data.msg}`);
      }
      return response;
    },
  ],
};
