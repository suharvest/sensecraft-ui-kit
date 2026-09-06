import type { ReactElement, ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { meetsRole, type UserRole } from './roles';

export interface ProtectedRouteProps {
  isAuthenticated: boolean;
  /** 未登录时跳转的路由，默认 /login */
  redirectTo?: string;
  /** 认证状态仍在加载时展示的内容 */
  loading?: boolean;
  loadingFallback?: ReactNode;
  /** 访问该分支所需的最低角色 */
  requiredRole?: UserRole;
  /** 当前用户角色；缺失（如用户信息尚未加载）时按最低权限处理，不放行 requiredRole 分支 */
  currentUserRole?: UserRole;
  forbiddenFallback?: ReactNode;
  children: ReactElement;
}

export function ProtectedRoute(props: ProtectedRouteProps) {
  const {
    isAuthenticated,
    redirectTo = '/login',
    loading = false,
    loadingFallback = null,
    requiredRole,
    currentUserRole,
    forbiddenFallback = null,
    children,
  } = props;
  const location = useLocation();

  if (loading) return <>{loadingFallback}</>;
  if (!isAuthenticated) return <Navigate to={redirectTo} replace state={{ from: location }} />;
  if (requiredRole && !meetsRole(currentUserRole, requiredRole)) {
    return <>{forbiddenFallback}</>;
  }
  return children;
}

export default ProtectedRoute;
