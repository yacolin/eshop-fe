export const DEFAULT_NAME = 'Eshop Admin';

export const ORDER_STATUS_MAP: Record<string, { color: string; text: string }> =
  {
    pending: { color: 'gold', text: '待处理' },
    processing: { color: 'cyan', text: '处理中' },
    paid: { color: 'lime', text: '已支付' },
    confirmed: { color: 'blue', text: '已确认' },
    shipped: { color: 'purple', text: '已发货' },
    delivered: { color: 'green', text: '已送达' },
    cancelled: { color: 'red', text: '已取消' },
    refunded: { color: 'orange', text: '已退款' },
  };
