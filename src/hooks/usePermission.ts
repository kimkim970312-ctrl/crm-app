'use client';

import { useAuth, UserPagePerm } from '@/context/AuthContext';

/** 页面权限检查结果 */
export interface PagePerms {
  canView: boolean;
  canCreate: boolean;
  canEdit: boolean;
  canDelete: boolean;
  dataScope: 'all' | 'self';
  hasPagePerm: boolean;
}

/** 根据 pageKey 获取当前用户的页面权限 */
export function usePermission(pageKey: string): PagePerms {
  const { user } = useAuth();
  const perm: UserPagePerm | undefined = user?.permissions?.find((p) => p.pageKey === pageKey);

  if (!perm) {
    return { canView: false, canCreate: false, canEdit: false, canDelete: false, dataScope: 'self', hasPagePerm: false };
  }

  const features = perm.features || [];
  return {
    canView: features.includes('view'),
    canCreate: features.includes('create'),
    canEdit: features.includes('edit'),
    canDelete: features.includes('delete'),
    dataScope: (perm.dataScope as 'all' | 'self') || 'self',
    hasPagePerm: true,
  };
}

/** 判断用户是否有某个 pageKey 的 view 权限 */
export function hasPagePermission(user: { permissions?: UserPagePerm[] } | null, pageKey: string): boolean {
  if (!user?.permissions) return false;
  const perm = user.permissions.find((p) => p.pageKey === pageKey);
  return perm?.features?.includes('view') ?? false;
}
