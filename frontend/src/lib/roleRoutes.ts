import type { User } from '../types';

export function defaultPathForRole(role: User['role'] | undefined): string {
  switch (role) {
    case 'SuperAdmin':
      return '/super-admin';
    case 'orgAdmin':
      return '/org-admin/dashboard';
    case 'member':
      return '/member/dashboard';
    default:
      return '/';
  }
}
