/** 页面唯一标识 */
export type PageKey = 'leads' | 'products' | 'orders' | 'reports' | 'roles' | 'accounts';

/** 导航条目 */
export interface NavItem {
  key: PageKey;
  label: string;
  href: string;
  group: 'business' | 'system';
}

/** 所有导航菜单 — 统一数据源 */
export const allNavItems: NavItem[] = [
  // ====== 业务管理 ======
  { key: 'leads',    label: '线索管理',       href: '/leads',    group: 'business' },
  { key: 'products', label: '商品管理',       href: '/products', group: 'business' },
  { key: 'orders',   label: '订单管理',       href: '/orders',   group: 'business' },
  // ====== 系统 ======
  { key: 'reports',  label: '数据仪表盘',     href: '/reports',  group: 'system' },
  { key: 'roles',    label: '角色与权限管理',  href: '/roles',    group: 'system' },
  { key: 'accounts', label: '账号管理',       href: '/accounts', group: 'system' },
];

/** 按组分组的导航 (Sidebar 使用) */
export const businessNav = allNavItems.filter((n) => n.group === 'business');
export const systemNav = allNavItems.filter((n) => n.group === 'system');

/** 页面权限列表（角色权限弹窗使用） */
export const PAGE_OPTIONS: { key: PageKey; label: string }[] = allNavItems.map((n) => ({
  key: n.key,
  label: n.label,
}));
