/**
 * JWT 工具函数
 * 从 localStorage 的 access_token 中解码 payload 获取 roles 等信息。
 * 后端 JWT claims 结构见 eshop-monolith/internal/user/service/token_service.go：
 *   type TokenClaims struct {
 *     UserID     int64    json:"user_id"
 *     Roles      []string json:"roles"
 *     ...
 *   }
 */

/**
 * 解码 JWT token 的 payload 部分
 * JWT 格式: header.payload.signature
 */
export function parseToken(): Record<string, any> | null {
  const token = localStorage.getItem('access_token');
  if (!token) return null;

  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;

    // JWT payload 是 base64 编码的 JSON
    const payload = parts[1];
    // 处理 base64url → base64
    const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
    const jsonStr = atob(base64);
    return JSON.parse(jsonStr);
  } catch {
    return null;
  }
}

/**
 * 从 JWT token 中提取角色名列表
 */
export function getTokenRoles(): string[] {
  const claims = parseToken();
  if (!claims || !Array.isArray(claims.roles)) return [];
  return claims.roles as string[];
}

/**
 * 从 JWT token 中提取用户 ID
 */
export function getTokenUserId(): number | null {
  const claims = parseToken();
  if (!claims || typeof claims.user_id !== 'number') return null;
  return claims.user_id;
}

/**
 * 判断当前用户是否拥有指定角色
 */
export function hasRole(role: string): boolean {
  return getTokenRoles().includes(role);
}

/**
 * 判断当前用户是否拥有任意一个指定角色
 */
export function hasAnyRole(roles: string[]): boolean {
  const userRoles = getTokenRoles();
  return roles.some((r) => userRoles.includes(r));
}
