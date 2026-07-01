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
    canCreateProduct:
      roles.includes('admin') || permissions.includes('product:create'),
    canUpdateProduct:
      roles.includes('admin') || permissions.includes('product:update'),
    canDeleteProduct:
      roles.includes('admin') || permissions.includes('product:delete'),

    // ── Inventory ──
    canCreateInventory:
      roles.includes('admin') || permissions.includes('inventory:create'),
    canUpdateInventory:
      roles.includes('admin') || permissions.includes('inventory:update'),

    // ── Category ──
    canCreateCategory:
      roles.includes('admin') || permissions.includes('category:create'),
    canUpdateCategory:
      roles.includes('admin') || permissions.includes('category:update'),
    canDeleteCategory:
      roles.includes('admin') || permissions.includes('category:delete'),

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

    // ── Review ──
    // 审核/回复统一使用 review:moderate（数据库权限定义）
    canModerateReview:
      roles.includes('admin') || permissions.includes('review:moderate'),
    canDeleteReview:
      roles.includes('admin') || permissions.includes('review:delete'),

    // ── User ──
    canManageUsers: roles.includes('admin'),
    canUpdateUser:
      roles.includes('admin') || permissions.includes('user:update'),
    canDeleteUser:
      roles.includes('admin') || permissions.includes('user:delete'),

    // ── SKU ──
    canCreateSku: roles.includes('admin') || permissions.includes('sku:create'),
    canUpdateSku: roles.includes('admin') || permissions.includes('sku:update'),
    canDeleteSku: roles.includes('admin') || permissions.includes('sku:delete'),

    // ── Attribute ──
    canCreateAttribute:
      roles.includes('admin') || permissions.includes('attribute:create'),
    canUpdateAttribute:
      roles.includes('admin') || permissions.includes('attribute:update'),
    canDeleteAttribute:
      roles.includes('admin') || permissions.includes('attribute:delete'),

    // ── Brand ──
    canCreateBrand:
      roles.includes('admin') || permissions.includes('brand:create'),
    canUpdateBrand:
      roles.includes('admin') || permissions.includes('brand:update'),
    canDeleteBrand:
      roles.includes('admin') || permissions.includes('brand:delete'),

    // ── Promotion ──
    canCreatePromotion:
      roles.includes('admin') || permissions.includes('promotion:create'),
    canUpdatePromotion:
      roles.includes('admin') || permissions.includes('promotion:update'),
    canDeletePromotion:
      roles.includes('admin') || permissions.includes('promotion:delete'),

    // ── Coupon ──
    canCreateCoupon:
      roles.includes('admin') || permissions.includes('coupon:create'),
    canUpdateCoupon:
      roles.includes('admin') || permissions.includes('coupon:update'),
    canDeleteCoupon:
      roles.includes('admin') || permissions.includes('coupon:delete'),

    // ── Address ──
    canCreateAddress:
      roles.includes('admin') || permissions.includes('address:create'),
    canDeleteAddress:
      roles.includes('admin') || permissions.includes('address:delete'),

    // ── Notification ──
    canCreateNotification:
      roles.includes('admin') || permissions.includes('notification:create'),
    canDeleteNotification:
      roles.includes('admin') || permissions.includes('notification:delete'),
  };
};
