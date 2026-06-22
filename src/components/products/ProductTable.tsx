'use client';

import type { Product } from '@/types/product';
import { statusColors, statusLabels, CATEGORY_OPTIONS } from '@/types/product';

/** 分类配置 — 彩色小方块 + 首字母 */
const categoryConfig: Record<string, { icon: string; bg: string; text: string }> = {
  '电子产品':   { icon: 'E', bg: '#DBEAFE', text: '#1D4ED8' },
  '家居用品':   { icon: 'H', bg: '#F3E8FF', text: '#7C3AED' },
  '办公设备':   { icon: 'O', bg: '#FEF3C7', text: '#B45309' },
  '服装配饰':   { icon: 'C', bg: '#FFE4E6', text: '#BE123C' },
  '食品饮料':   { icon: 'F', bg: '#D1FAE5', text: '#047857' },
  '医疗保健':   { icon: 'M', bg: '#E0E7FF', text: '#4338CA' },
};

function getCategoryConfig(category: string) {
  return categoryConfig[category] || { icon: '?', bg: '#F1F5F9', text: '#475569' };
}

interface ProductTableProps {
  products: Product[];
  loading: boolean;
  onView: (product: Product) => void;
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
}

export default function ProductTable({ products, loading, onView, onEdit, onDelete }: ProductTableProps) {
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

  if (products.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="flex flex-col items-center justify-center py-20 text-slate-400">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-12 h-12 mb-3 text-slate-300">
            <path d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
          </svg>
          <p className="text-sm">暂无商品数据</p>
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
              <th className="text-left pl-6 pr-4 py-3 font-semibold text-slate-400 text-xs uppercase tracking-wider whitespace-nowrap">商品编号</th>
              <th className="text-left px-4 py-3 font-semibold text-slate-400 text-xs uppercase tracking-wider whitespace-nowrap">创建时间</th>
              <th className="text-left px-4 py-3 font-semibold text-slate-400 text-xs uppercase tracking-wider whitespace-nowrap">商品名称</th>
              <th className="text-left px-4 py-3 font-semibold text-slate-400 text-xs uppercase tracking-wider whitespace-nowrap">商品价格</th>
              <th className="text-left px-4 py-3 font-semibold text-slate-400 text-xs uppercase tracking-wider whitespace-nowrap">状态</th>
              <th className="text-left px-4 py-3 font-semibold text-slate-400 text-xs uppercase tracking-wider whitespace-nowrap">分类</th>
              <th className="text-center pl-4 pr-6 py-3 font-semibold text-slate-400 text-xs uppercase tracking-wider whitespace-nowrap">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100" style={{ borderTop: '1px solid #E2E8F0' }}>
            {products.map((product) => {
              const sCfg = statusColors[product.status] || statusColors.active;
              const cCfg = getCategoryConfig(product.category);

              return (
                <tr key={product.id} className="transition-colors duration-150 hover:bg-primary-50">
                  {/* 商品编号 */}
                  <td className="pl-6 pr-4 py-[14px] text-[13px] whitespace-nowrap">
                    <span className="text-primary-600 font-semibold cursor-pointer hover:text-primary-700 hover:underline">
                      {product.code}
                    </span>
                  </td>

                  {/* 创建时间 */}
                  <td className="px-4 py-[14px] text-[13px] text-slate-500 whitespace-nowrap">{product.createdAt}</td>

                  {/* 商品名称 */}
                  <td className="px-4 py-[14px] text-[13px] text-slate-800 font-semibold whitespace-nowrap">{product.name}</td>

                  {/* 商品价格 */}
                  <td className="px-4 py-[14px] text-[13px] text-slate-800 font-semibold tabular-nums whitespace-nowrap">
                    ¥{product.price.toFixed(2)}
                  </td>

                  {/* 状态 — 药丸徽章 + 小圆点 */}
                  <td className="px-4 py-[14px] text-[13px] whitespace-nowrap">
                    <span
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 4,
                        padding: '3px 10px',
                        borderRadius: 20,
                        fontSize: 12,
                        fontWeight: 600,
                        whiteSpace: 'nowrap',
                        background: sCfg.bg,
                        color: sCfg.text,
                      }}
                    >
                      <span
                        style={{
                          width: 6,
                          height: 6,
                          borderRadius: '50%',
                          background: sCfg.dot,
                          flexShrink: 0,
                        }}
                      />
                      {statusLabels[product.status]}
                    </span>
                  </td>

                  {/* 分类 — 彩色小方块 + 首字母 */}
                  <td className="px-4 py-[14px] text-[13px] whitespace-nowrap">
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13 }}>
                      <span
                        style={{
                          width: 18,
                          height: 18,
                          borderRadius: 4,
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: 10,
                          fontWeight: 700,
                          background: cCfg.bg,
                          color: cCfg.text,
                          flexShrink: 0,
                        }}
                      >
                        {cCfg.icon}
                      </span>
                      {product.category}
                    </span>
                  </td>

                  {/* 操作按钮 */}
                  <td className="pl-4 pr-6 py-[14px] text-[13px] text-center whitespace-nowrap">
                    <div className="flex items-center justify-center gap-1">
                      <button
                        onClick={() => onView(product)}
                        className="w-8 h-8 flex items-center justify-center rounded-md border-none bg-transparent text-slate-400 cursor-pointer transition-all duration-150 hover:bg-primary-50 hover:text-primary-600"
                        title="详情"
                      >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                          <circle cx="12" cy="12" r="3" />
                        </svg>
                      </button>
                      <button
                        onClick={() => onEdit(product)}
                        className="w-8 h-8 flex items-center justify-center rounded-md border-none bg-transparent text-slate-400 cursor-pointer transition-all duration-150 hover:bg-primary-50 hover:text-primary-600"
                        title="修改"
                      >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                          <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
                          <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => onDelete(product)}
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
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
