import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { ProtectedRoute } from '../src/layout/ProtectedRoute';
import type { UserRole } from '../src/layout/roles';

function renderGuard(props: { currentUserRole?: UserRole; requiredRole?: UserRole; isAuthenticated?: boolean }) {
  return render(
    <MemoryRouter initialEntries={['/admin']}>
      <Routes>
        <Route path="/login" element={<div>login</div>} />
        <Route
          path="/admin"
          element={
            <ProtectedRoute
              isAuthenticated={props.isAuthenticated ?? true}
              requiredRole={props.requiredRole}
              currentUserRole={props.currentUserRole}
              forbiddenFallback={<div>forbidden</div>}
            >
              <div>secret</div>
            </ProtectedRoute>
          }
        />
      </Routes>
    </MemoryRouter>,
  );
}

describe('ProtectedRoute', () => {
  it('未登录跳转到 /login', () => {
    renderGuard({ isAuthenticated: false });
    expect(screen.getByText('login')).toBeTruthy();
  });

  it('角色达标时渲染子节点', () => {
    renderGuard({ requiredRole: 'operate', currentUserRole: 'admin' });
    expect(screen.getByText('secret')).toBeTruthy();
  });

  it('角色不足时渲染 forbiddenFallback', () => {
    renderGuard({ requiredRole: 'admin', currentUserRole: 'view' });
    expect(screen.getByText('forbidden')).toBeTruthy();
  });

  it('currentUserRole 缺失时不放行需要角色的分支（不得默认按 admin 处理）', () => {
    renderGuard({ requiredRole: 'admin' });
    expect(screen.queryByText('secret')).toBeNull();
    expect(screen.getByText('forbidden')).toBeTruthy();
  });

  it('未声明 requiredRole 的分支只看登录态', () => {
    renderGuard({});
    expect(screen.getByText('secret')).toBeTruthy();
  });
});
