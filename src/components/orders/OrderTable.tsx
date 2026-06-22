'use client';

import type { Order } from '@/types/order';

interface OrderTableProps {
  orders: Order[];
  loading: boolean;
  onView: (order: Order) => void;
  onEdit: (order: Order) => void;
  onDelete: (order: Order) => void;
}

export default function OrderTable({ orders, loading, onView, onEdit, onDelete }: OrderTableProps) {
  if (loading) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="flex items-center justify-center py-20">
          <div className="flex items-center gap-3 text-slate-400">
            <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            加载中...
          </div>
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="flex flex-col items-center justify-center py-20 text-slate-400">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-12 h-12 mb-3 text-slate-300">
            <path d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
          </svg>
          <p className="text-sm">暂无订单数据</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm" style={{ borderCollapse: 'collapse' }}>
          <thead>
            <tr className="bg-slate-50" style={{ position: 'sticky', top: 0 }}>
              <th className="text-left pl-6 pr-4 py-3 font-semibold text-slate-400 text-xs uppercase tracking-wider whitespace-nowrap">创建时间</th>
              <th className="text-left px-4 py-3 font-semibold text-slate-400 text-xs uppercase tracking-wider whitespace-nowrap">订单编号</th>
              <th className="text-left px-4 py-3 font-semibold text-slate-400 text-xs uppercase tracking-wider whitespace-nowrap">客户名称</th>
              <th className="text-left px-4 py-3 font-semibold text-slate-400 text-xs uppercase tracking-wider whitespace-nowrap">客户电话</th>
              <th className="text-left px-4 py-3 font-semibold text-slate-400 text-xs uppercase tracking-wider whitespace-nowrap">商品编号</th>
              <th className="text-left px-4 py-3 font-semibold text-slate-400 text-xs uppercase tracking-wider whitespace-nowrap">商品名称</th>
              <th className="text-right px-4 py-3 font-semibold text-slate-400 text-xs uppercase tracking-wider whitespace-nowrap">下单金额</th>
              <th className="text-center pl-4 pr-6 py-3 font-semibold text-slate-400 text-xs uppercase tracking-wider whitespace-nowrap">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100" style={{ borderTop: '1px solid #E2E8F0' }}>
            {orders.map((order) => (
              <tr key={order.id} className="transition-colors duration-150 hover:bg-primary-50">
                {/* 创建时间 */}
                <td className="pl-6 pr-4 py-[14px] text-[13px] text-slate-500 whitespace-nowrap">{order.createdAt}</td>

                {/* 订单编号 */}
                <td className="px-4 py-[14px] text-[13px] whitespace-nowrap">
                  <span className="text-primary-600 font-semibold cursor-pointer hover:text-primary-700 hover:underline">
                    {order.orderNo}
                  </span>
                </td>

                {/* 客户名称 */}
                <td className="px-4 py-[14px] text-[13px] text-slate-800 font-semibold whitespace-nowrap">{order.customerName}</td>

                {/* 客户电话 */}
                <td className="px-4 py-[14px] text-[13px] text-slate-500 tabular-nums whitespace-nowrap">{order.customerPhone}</td>

                {/* 商品编号 */}
                <td className="px-4 py-[14px] text-[13px] text-slate-700 font-semibold whitespace-nowrap">{order.productCode}</td>

                {/* 商品名称 */}
                <td className="px-4 py-[14px] text-[13px] text-slate-700 whitespace-nowrap">{order.productName}</td>

                {/* 下单金额 */}
                <td className="px-4 py-[14px] text-[13px] text-slate-800 font-semibold tabular-nums whitespace-nowrap text-right">
                  ¥{order.amount.toFixed(2)}
                </td>

                {/* 操作按钮 */}
                <td className="pl-4 pr-6 py-[14px] text-[13px] text-center whitespace-nowrap">
                  <div className="flex items-center justify-center gap-1">
                    <button
                      onClick={() => onView(order)}
                      className="w-8 h-8 flex items-center justify-center rounded-md border-none bg-transparent text-slate-400 cursor-pointer transition-all duration-150 hover:bg-primary-50 hover:text-primary-600"
                      title="详情"
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    </button>
                    <button
                      onClick={() => onEdit(order)}
                      className="w-8 h-8 flex items-center justify-center rounded-md border-none bg-transparent text-slate-400 cursor-pointer transition-all duration-150 hover:bg-primary-50 hover:text-primary-600"
                      title="修改"
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                        <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
                        <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => onDelete(order)}
                      className="w-8 h-8 flex items-center justify-center rounded-md border-none bg-transparent text-slate-400 cursor-pointer transition-all duration-150 hover:bg-red-50 hover:text-red-500"
                      title="删除"
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                        <polyline points="3 6 5 6 21 6" />
                        <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
