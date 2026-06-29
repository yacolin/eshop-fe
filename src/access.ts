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
    canModerateReview: permissions.includes('review:moderate'),
    canDeleteReview: permissions.includes('review:delete'),

    // ── User ──
    canUpdateUser: permissions.includes('user:update'),

    // ── Brand ──
    canCreateBrand:
      roles.includes('admin') || permissions.includes('brand:create'),
    canUpdateBrand:
      roles.includes('admin') || permissions.includes('brand:update'),
    canDeleteBrand:
      roles.includes('admin') || permissions.includes('brand:delete'),

    // ── Notification ──
    canCreateNotification:
      roles.includes('admin') || permissions.includes('notification:create'),
    canDeleteNotification:
      roles.includes('admin') || permissions.includes('notification:delete'),
  };
};
