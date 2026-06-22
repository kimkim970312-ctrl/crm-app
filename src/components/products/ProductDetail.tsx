'use client';

import type { Product } from '@/types/product';
import { statusLabels, statusColors, CATEGORY_OPTIONS } from '@/types/product';

interface ProductDetailProps {
  product: Product;
}

export default function ProductDetail({ product }: ProductDetailProps) {
  const sCfg = statusColors[product.status] || statusColors.active;

  return (
    <div className="space-y-5">
      {/* 商品 ID */}
      <div>
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1">商品ID</p>
        <p className="text-sm font-semibold text-primary-600">{product.id}</p>
      </div>

      {/* 创建时间 */}
      <div>
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1">创建时间</p>
        <p className="text-sm text-slate-700">{product.createdAt}</p>
      </div>

      {/* 编号 / 名称 */}
      <div className="grid grid-cols-2 gap-5">
        <div>
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1">商品编号</p>
          <p className="text-sm font-semibold text-slate-800">{product.code}</p>
        </div>
        <div>
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1">商品名称</p>
          <p className="text-sm font-semibold text-slate-800">{product.name}</p>
        </div>
      </div>

      {/* 价格 */}
      <div>
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1">商品价格</p>
        <p className="text-sm font-semibold text-slate-800">¥{product.price.toFixed(2)}</p>
      </div>

      {/* 状态 */}
      <div>
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1">状态</p>
        <span
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold"
          style={{ background: sCfg.bg, color: sCfg.text }}
        >
          <span className="w-2 h-2 rounded-full" style={{ background: sCfg.dot }} />
          {statusLabels[product.status]}
        </span>
      </div>

      {/* 分类 */}
      <div>
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1">分类</p>
        <p className="text-sm text-slate-700">{product.category || '未分类'}</p>
      </div>

      {/* 描述 */}
      <div>
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1">商品描述</p>
        <p className="text-sm text-slate-700 leading-relaxed">{product.description || '暂无描述'}</p>
      </div>
    </div>
  );
}
