export const DEFAULT_NAME = 'Eshop Admin';

export const PAYMENT_METHOD_MAP: Record<string, string> = {
  wechat: '微信',
  alipay: '支付宝',
  wallet: '余额',
};

export const ORDER_STATUS_MAP: Record<string, { color: string; text: string }> =
  {
    pending: { color: 'gold', text: '待支付' },
    confirmed: { color: 'blue', text: '已确认' },
    paid: { color: 'cyan', text: '已支付' },
    shipped: { color: 'purple', text: '已发货' },
    delivered: { color: 'green', text: '已签收' },
    completed: { color: 'lime', text: '已完成' },
    cancelled: { color: 'red', text: '已取消' },
    closed: { color: 'default', text: '已关闭' },
    refunding: { color: 'orange', text: '退款中' },
    refunded: { color: 'volcano', text: '已退款' },
  };
