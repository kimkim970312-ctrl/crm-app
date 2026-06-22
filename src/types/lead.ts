/** 线索优先级 */
export type Priority = 'high' | 'medium' | 'low';

/** 客户来源 */
export type Source = 'web' | 'referral' | 'ads' | 'event' | 'social';

/** 跟进人 */
export type Follower = string;

/** 线索数据 */
export interface Lead {
  id: string;
  createdAt: string;
  name: string;
  phone: string;
  priority: Priority;
  source: Source;
  follower: string[];
}

/** 线索筛选条件 */
export interface LeadFilter {
  createdAtStart?: string;
  createdAtEnd?: string;
  name?: string;
  phone?: string;
  priority?: Priority | '';
  source?: Source | '';
}

/** 分页参数 */
export interface PaginationParams {
  page: number;
  pageSize: number;
}

/** API 响应 */
export interface LeadListResponse {
  data: Lead[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

/** 优先级标签 */
export const priorityLabels: Record<Priority, string> = {
  high: '高',
  medium: '中',
  low: '低',
};

/** 来源标签 */
export const sourceLabels: Record<Source, string> = {
  web: '官网',
  referral: '转介绍',
  ads: '广告投放',
  event: '活动',
  social: '社交媒体',
};

/** 跟进人选项列表 */
export const FOLLOWER_OPTIONS = ['张明远', '李思琪', '王浩然', '赵雨萱', '金扶摇'];

/** 验证中国手机号（11位，1开头） */
export function isValidPhone(phone: string): boolean {
  return /^1\d{10}$/.test(phone);
}
