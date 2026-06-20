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

    // ── Role ──
    canCreateRole: permissions.includes('role:create'),
    canUpdateRole: permissions.includes('role:update'),
    canDeleteRole: permissions.includes('role:delete'),

    // ── Permission ──
    canCreatePermission: permissions.includes('permission:create'),
    canUpdatePermission: permissions.includes('permission:update'),
    canDeletePermission: permissions.includes('permission:delete'),

    // ── Review ──
    // 审核/回复统一使用 review:moderate（数据库权限定义）
    canModerateReview: permissions.includes('review:moderate'),
    canDeleteReview: permissions.includes('review:delete'),

    // ── User ──
    canUpdateUser: permissions.includes('user:update'),
  };
};
