export default (initialState: {
  name: string;
  roles: string[];
  userId?: number;
}) => {
  const roles = initialState?.roles || [];
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
  };
};
