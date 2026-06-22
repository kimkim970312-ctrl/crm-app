/** 账号 */
export interface Account {
  id: string;
  createdAt: string;
  phone: string;
  name: string;
  roleId: string;
  roleName: string;
  password: string;
}

/** 筛选条件 */
export interface AccountFilter {
  createdAtStart?: string;
  createdAtEnd?: string;
  phone?: string;
  name?: string;
  roleName?: string;
  page?: number;
  pageSize?: number;
}

/** API 响应 */
export interface AccountListResponse {
  items: Account[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
