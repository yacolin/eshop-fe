import { useAccess } from '@umijs/max';
import React from 'react';

interface AuthProps {
  /** access.ts 中定义的权限键，如 'canCreateProduct' */
  permission: string;
  /** 无权限时的兜底渲染，默认不渲染任何内容 */
  fallback?: React.ReactNode;
  /** 有权限时渲染的内容 */
  children: React.ReactNode;
}

/**
 * 权限守卫组件
 *
 * 用法：
 *   <Auth permission="canCreateProduct">
 *     <Button type="primary">新建商品</Button>
 *   </Auth>
 *
 *   <Auth permission="canDeleteProduct" fallback={<Button disabled>删除</Button>}>
 *     <Popconfirm ...><a>删除</a></Popconfirm>
 *   </Auth>
 */
const Auth: React.FC<AuthProps> = ({ permission, fallback, children }) => {
  const access = useAccess();
  const hasPermission = (access as any)[permission];

  if (hasPermission) {
    return <>{children}</>;
  }

  return fallback ? <>{fallback}</> : null;
};

export default Auth;
