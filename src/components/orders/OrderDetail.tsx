'use client';

import type { Order } from '@/types/order';

interface OrderDetailProps {
  order: Order;
}

export default function OrderDetail({ order }: OrderDetailProps) {
  return (
    <div className="space-y-5">
      {/* 订单 ID */}
      <div>
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1">订单ID</p>
        <p className="text-sm font-semibold text-primary-600">{order.id}</p>
      </div>

      {/* 创建时间 */}
      <div>
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1">创建时间</p>
        <p className="text-sm text-slate-700">{order.createdAt}</p>
      </div>

      {/* 订单编号 */}
      <div>
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1">订单编号</p>
        <p className="text-sm font-semibold text-primary-600">{order.orderNo}</p>
      </div>

      {/* 客户信息 */}
      <div className="grid grid-cols-2 gap-5">
        <div>
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1">客户名称</p>
          <p className="text-sm font-semibold text-slate-800">{order.customerName}</p>
        </div>
        <div>
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1">客户电话</p>
          <p className="text-sm text-slate-700 tabular-nums">{order.customerPhone}</p>
        </div>
      </div>

      {/* 商品信息 */}
      <div className="grid grid-cols-2 gap-5">
        <div>
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1">商品编号</p>
          <p className="text-sm font-semibold text-slate-800">{order.productCode}</p>
        </div>
        <div>
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1">商品名称</p>
          <p className="text-sm text-slate-700">{order.productName}</p>
        </div>
      </div>

      {/* 下单金额 */}
      <div>
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1">下单金额</p>
        <p className="text-lg font-bold text-slate-800">¥{order.amount.toFixed(2)}</p>
      </div>
    </div>
  );
}
