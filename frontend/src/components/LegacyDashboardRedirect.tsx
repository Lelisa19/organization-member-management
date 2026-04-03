import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { defaultPathForRole } from '../lib/roleRoutes';

/**
 * Maps old `/dashboard` URLs to the role-specific app shell after the three-dashboard split.
 */
const LegacyDashboardRedirect: React.FC = () => {
  const { user } = useAuth();
  const { pathname } = useLocation();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const rest = pathname.replace(/^\/dashboard/, '') || '/';
  const role = user.role;

  if (role === 'SuperAdmin') {
    const map: Record<string, string> = {
      '/': '/super-admin',
      '/members': '/super-admin/members',
      '/events': '/super-admin',
      '/blogs': '/super-admin',
      '/payments': '/super-admin/payments',
      '/profile': '/super-admin',
      '/admin/organizations': '/super-admin/organizations',
    };
    return <Navigate to={map[rest] ?? '/super-admin'} replace />;
  }

  if (role === 'orgAdmin') {
    const map: Record<string, string> = {
      '/': '/org-admin/dashboard',
      '/members': '/org-admin/members',
      '/events': '/org-admin/events',
      '/blogs': '/org-admin/blogs',
      '/payments': '/org-admin/payments',
      '/profile': '/org-admin/profile',
      '/admin/organizations': '/super-admin/organizations',
    };
    return <Navigate to={map[rest] ?? '/org-admin/dashboard'} replace />;
  }

  const map: Record<string, string> = {
    '/': '/member/dashboard',
    '/members': '/member/profile',
    '/events': '/member/events',
    '/blogs': '/member/blog',
    '/payments': '/member/payments',
    '/profile': '/member/profile',
  };
  return <Navigate to={map[rest] ?? defaultPathForRole(role)} replace />;
};

export default LegacyDashboardRedirect;
