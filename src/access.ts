export default (initialState: {
  name: string;
  roles: string[];
  userId?: number;
  permissions: string[];
}) => {
  const roles = initialState?.roles || [];
  const permissions = initialState?.permissions || [];
  const isLoggedIn = !!initialState?.name && initialState.name !== '未登录';

  return {
    isLoggedIn,
    /** admin 角色 — 全部管理功能 */
    canAdmin: roles.includes('admin'),
    /** merchant 或 admin — 商家级管理 */
    canMerchant: roles.includes('admin') || roles.includes('merchant'),
    /** 评论审核管理 */
    canManageReviews: roles.includes('admin') || roles.includes('merchant'),
    /** 角色管理 */
    canManageRoles: roles.includes('admin'),
    /** 权限管理 */
    canManagePermissions: roles.includes('admin'),

    /** 原始权限列表（供运行时查询） */
    permissions,

    // ── Product ──
    canCreateProduct: permissions.includes('product:create'),
    canUpdateProduct: permissions.includes('product:update'),
    canDeleteProduct: permissions.includes('product:delete'),

    // ── Inventory ──
    canCreateInventory: permissions.includes('inventory:create'),
    canUpdateInventory: permissions.includes('inventory:update'),

    // ── Category ──
    canCreateCategory: permissions.includes('category:create'),
    canUpdateCategory: permissions.includes('category:update'),
    canDeleteCategory: permissions.includes('category:delete'),

    // ── Order ──
    canCreateOrder: permissions.includes('order:create'),
    canUpdateOrder: permissions.includes('order:update'),
    canDeleteOrder: permissions.includes('order:delete'),

    // ── Cart ──
    canCreateCart:
      roles.includes('admin') || permissions.includes('cart:create'),
    canUpdateCart:
      roles.includes('admin') || permissions.includes('cart:update'),
    canDeleteCart:
      roles.includes('admin') || permissions.includes('cart:delete'),

    // ── Role（admin 角色自动拥有所有角色管理能力）──
    canCreateRole:
      roles.includes('admin') || permissions.includes('role:create'),
    canUpdateRole:
      roles.includes('admin') || permissions.includes('role:update'),
    canDeleteRole:
      roles.includes('admin') || permissions.includes('role:delete'),

    // ── Permission（admin 角色自动拥有所有权限管理能力）──
    canCreatePermission:
      roles.includes('admin') || permissions.includes('permission:create'),
    canUpdatePermission:
      roles.includes('admin') || permissions.includes('permission:update'),
    canDeletePermission:
      roles.includes('admin') || permissions.includes('permission:delete'),

    // ── Coupon ──
    canCreateCoupon:
      roles.includes('admin') || permissions.includes('coupon:create'),
    canUpdateCoupon:
      roles.includes('admin') || permissions.includes('coupon:update'),

    // ── Flash Sale ──
    canCreateFlashSale:
      roles.includes('admin') || permissions.includes('flash_sale:create'),
    canUpdateFlashSale:
      roles.includes('admin') || permissions.includes('flash_sale:update'),

    // ── Promotion ──
    canCreatePromotion:
      roles.includes('admin') || permissions.includes('promotion:create'),
    canUpdatePromotion:
      roles.includes('admin') || permissions.includes('promotion:update'),

    // ── Review ──
    // 审核/回复统一使用 review:moderate（数据库权限定义）
    canModerateReview: permissions.includes('review:moderate'),
    canDeleteReview: permissions.includes('review:delete'),

    // ── Payment ──
    canCreatePayment:
      roles.includes('admin') || permissions.includes('payment:create'),
    canUpdatePayment:
      roles.includes('admin') || permissions.includes('payment:update'),

    // ── Refund ──
    canCreateRefund:
      roles.includes('admin') || permissions.includes('refund:create'),
    canUpdateRefund:
      roles.includes('admin') || permissions.includes('refund:update'),

    // ── User ──
    canUpdateUser: permissions.includes('user:update'),
  };
};
