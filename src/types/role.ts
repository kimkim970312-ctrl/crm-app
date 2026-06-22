/** 页面权限 key — 同统一导航配置一致 */
export type PageKey = 'leads' | 'products' | 'orders' | 'reports' | 'roles' | 'accounts';

/** 页面导航选项 — 从统一导航配置导入 */
export { PAGE_OPTIONS } from '@/config/navigation';

/** 功能权限 */
export type FeaturePerm = 'view' | 'create' | 'edit' | 'delete';

/** 数据权限 */
export type DataScope = 'all' | 'self';

/** 单个页面的权限配置 */
export interface PagePermission {
  pageKey: PageKey;
  pageName: string;
  features: FeaturePerm[];
  dataScope: DataScope;
}

/** 角色 */
export interface Role {
  id: string;
  createdAt: string;
  name: string;
  permissions: PagePermission[];
}

/** 筛选条件 */
export interface RoleFilter {
  name?: string;
  page?: number;
  pageSize?: number;
}

/** API 响应 */
export interface RoleListResponse {
  items: Role[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

/** 功能权限选项 */
export const FEATURE_OPTIONS: { key: FeaturePerm; label: string }[] = [
  { key: 'view', label: '查看' },
  { key: 'create', label: '增加' },
  { key: 'edit', label: '修改' },
  { key: 'delete', label: '删除' },
];

/** 数据权限选项 */
export const DATA_SCOPE_OPTIONS: { key: DataScope; label: string }[] = [
  { key: 'all', label: '全部' },
  { key: 'self', label: '仅自己' },
];

/** 功能权限中文映射 */
export const FEATURE_LABELS: Record<FeaturePerm, string> = {
  view: '查看',
  create: '增加',
  edit: '修改',
  delete: '删除',
};
