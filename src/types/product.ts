/** 商品状态 */
export type ProductStatus = 'active' | 'inactive' | 'discontinued';

/** 商品数据 */
export interface Product {
  id: string;
  createdAt: string;
  code: string;        // 商品编号
  name: string;        // 商品名称
  price: number;       // 商品价格
  status: ProductStatus;
  category: string;    // 商品分类
  description: string; // 商品描述
}

/** 商品筛选条件 */
export interface ProductFilter {
  createdAtStart?: string;
  createdAtEnd?: string;
  code?: string;
  name?: string;
  status?: ProductStatus | '';
  category?: string | '';
}

/** 分页参数 */
export interface PaginationParams {
  page: number;
  pageSize: number;
}

/** API 响应 */
export interface ProductListResponse {
  data: Product[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

/** 状态标签 */
export const statusLabels: Record<ProductStatus, string> = {
  active: '在售',
  inactive: '下架',
  discontinued: '停产',
};

/** 状态颜色 */
export const statusColors: Record<ProductStatus, { bg: string; text: string; dot: string }> = {
  active:       { bg: '#ECFDF5', text: '#047857', dot: '#10B981' },
  inactive:     { bg: '#FEF3C7', text: '#B45309', dot: '#F59E0B' },
  discontinued: { bg: '#FEF2F2', text: '#EF4444', dot: '#EF4444' },
};

/** 商品分类列表 */
export const CATEGORY_OPTIONS = [
  '电子产品',
  '家居用品',
  '办公设备',
  '服装配饰',
  '食品饮料',
  '医疗保健',
];

/** 验证商品编号（示例：至少 2 个字符） */
export function isValidProductCode(code: string): boolean {
  return code.trim().length >= 2;
}

/** 验证价格 */
export function isValidPrice(price: number): boolean {
  return !isNaN(price) && price > 0;
}
