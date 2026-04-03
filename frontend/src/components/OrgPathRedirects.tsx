import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

/** Maps legacy `/org/...` URLs to `/org-admin/...`. */
export const OrgLegacyRedirect: React.FC = () => {
  const { pathname } = useLocation();
  const rest = pathname.replace(/^\/org\/?/, '') || 'dashboard';
  return <Navigate to={`/org-admin/${rest}`} replace />;
};

/** Old `/organadmin/...` paths → `/org-admin/...`. */
export const OrganAdminLegacyRedirect: React.FC = () => {
  const { pathname } = useLocation();
  const rest = pathname.replace(/^\/organadmin\/?/, '') || 'dashboard';
  return <Navigate to={`/org-admin/${rest}`} replace />;
};