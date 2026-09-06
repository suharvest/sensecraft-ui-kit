import type { ReactElement, ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import type { UserRole } from './AppShell';

const ROLE_WEIGHT: Record<UserRole, number> = { view: 0, operate: 1, admin: 2 };

export interface ProtectedRouteProps {
  isAuthenticated: boolean;
  /** 未登录时跳转的路由，默认 /login */
  redirectTo?: string;
  /** 认证状态仍在加载时展示的内容 */
  loading?: boolean;
  loadingFallback?: ReactNode;
  /** 访问该分支所需的最低角色 */
  requiredRole?: UserRole;
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
    currentUserRole = 'admin',
    forbiddenFallback = null,
    children,
  } = props;
  const location = useLocation();

  if (loading) return <>{loadingFallback}</>;
  if (!isAuthenticated) return <Navigate to={redirectTo} replace state={{ from: location }} />;
  if (requiredRole && ROLE_WEIGHT[currentUserRole] < ROLE_WEIGHT[requiredRole]) {
    return <>{forbiddenFallback}</>;
  }
  return children;
}

export default ProtectedRoute;
