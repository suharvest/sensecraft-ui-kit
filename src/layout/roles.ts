/** 角色与权重的单一来源：菜单过滤（AppShell）与路由守卫（ProtectedRoute）共用同一套判定。 */
export type UserRole = 'view' | 'operate' | 'admin';

export const ROLE_WEIGHT: Record<UserRole, number> = { view: 0, operate: 1, admin: 2 };

/** current 是否满足 required 的最低角色要求；current 缺失或不认识时按最低权限处理。 */
export function meetsRole(current: UserRole | undefined, required: UserRole): boolean {
  return (ROLE_WEIGHT[current as UserRole] ?? 0) >= ROLE_WEIGHT[required];
}
