/** 订单数据 */
export interface Order {
  id: string;
  createdAt: string;
  orderNo: string;         // 订单编号（自动生成，如 ORD00001）
  customerName: string;    // 客户名称（来自线索表）
  customerPhone: string;   // 客户电话（来自线索表）
  productCode: string;     // 下单商品编号（来自商品表）
  productName: string;     // 下单商品名称（来自商品表）
  amount: number;          // 下单金额
}

/** 订单筛选条件 */
export interface OrderFilter {
  createdAtStart?: string;
  createdAtEnd?: string;
  orderNo?: string;
  customerName?: string;
  customerPhone?: string;
  productName?: string;
}

/** API 响应 */
export interface OrderListResponse {
  data: Order[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
