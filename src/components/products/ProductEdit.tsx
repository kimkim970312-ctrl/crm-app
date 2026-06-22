'use client';

import { useState } from 'react';
import type { Product, ProductStatus } from '@/types/product';
import { CATEGORY_OPTIONS } from '@/types/product';

interface ProductEditProps {
  product: Product;
  onSave: (data: { name: string; price: number; status: ProductStatus; category: string; description: string }) => void;
  onCancel: () => void;
}

export default function ProductEdit({ product, onSave, onCancel }: ProductEditProps) {
  const [name, setName] = useState(product.name);
  const [price, setPrice] = useState(String(product.price));
  const [priceError, setPriceError] = useState('');
  const [status, setStatus] = useState<ProductStatus>(product.status);
  const [category, setCategory] = useState(product.category);
  const [description, setDescription] = useState(product.description);

  const handleSubmit = () => {
    if (!name.trim() || !price.trim()) return;
    const numPrice = Number(price);
    if (isNaN(numPrice) || numPrice <= 0) {
      setPriceError('请输入有效的价格');
      return;
    }
    onSave({
      name: name.trim(),
      price: numPrice,
      status,
      category,
      description: description.trim(),
    });
  };

  const inputClass =
    'w-full h-[38px] px-3 text-[13px] border border-slate-200 rounded-md bg-white text-slate-700 placeholder-slate-400 outline-none transition-all duration-150 focus:border-primary-500 focus:shadow-[0_0_0_3px_rgba(37,99,235,0.1)]';

  return (
    <div className="space-y-5">
      {/* 商品 ID（只读） */}
      <div>
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1">商品ID</p>
        <p className="text-sm font-semibold text-primary-600">{product.id}</p>
      </div>

      {/* 商品编码（自动生成，只读显示） */}
      <div>
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1">商品编码</p>
        <p className="text-sm font-semibold text-primary-600">{product.code}</p>
      </div>

      {/* 商品名称 */}
      <div>
        <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1.5">
          商品名称 <span className="text-red-400">*</span>
        </label>
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="请输入商品名称" className={inputClass} />
      </div>

      {/* 价格 */}
      <div>
        <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1.5">
          商品价格 <span className="text-red-400">*</span>
        </label>
        <input
          type="number"
          step="0.01"
          min="0"
          value={price}
          onChange={(e) => { setPrice(e.target.value); setPriceError(''); }}
          onBlur={() => {
            const n = Number(price);
            if (price.trim() && (isNaN(n) || n <= 0)) {
              setPriceError('请输入有效的价格');
            } else {
              setPriceError('');
            }
          }}
          placeholder="请输入商品价格"
          className={`${inputClass} ${priceError ? 'border-red-300 focus:border-red-500 focus:shadow-[0_0_0_3px_rgba(239,68,68,0.1)]' : ''}`}
        />
        {priceError && <p className="text-[11px] text-red-500 mt-1">{priceError}</p>}
      </div>

      {/* 状态 */}
      <div>
        <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1.5">状态</label>
        <select value={status} onChange={(e) => setStatus(e.target.value as ProductStatus)} className={inputClass + ' appearance-none'}>
          <option value="active">在售</option>
          <option value="inactive">下架</option>
          <option value="discontinued">停产</option>
        </select>
      </div>

      {/* 分类 */}
      <div>
        <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1.5">分类</label>
        <select value={category} onChange={(e) => setCategory(e.target.value)} className={inputClass + ' appearance-none'}>
          <option value="">请选择分类</option>
          {CATEGORY_OPTIONS.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>

      {/* 描述 */}
      <div>
        <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1.5">商品描述</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="请输入商品描述"
          rows={3}
          className="w-full px-3 py-2 text-[13px] border border-slate-200 rounded-md bg-white text-slate-700 placeholder-slate-400 outline-none transition-all duration-150 focus:border-primary-500 focus:shadow-[0_0_0_3px_rgba(37,99,235,0.1)] resize-none"
        />
      </div>

      {/* 操作按钮 */}
      <div className="flex items-center gap-3 pt-2">
        <button onClick={onCancel} className="flex-1 h-[38px] text-[13px] font-semibold rounded-md bg-white text-slate-600 border border-slate-200 cursor-pointer transition-all duration-150 hover:bg-slate-50">
          取消
        </button>
        <button
          onClick={handleSubmit}
          disabled={!name.trim() || !price.trim()}
          className="flex-1 h-[38px] text-[13px] font-semibold rounded-md bg-primary-600 text-white border border-primary-600 cursor-pointer transition-all duration-150 hover:bg-primary-700 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          保存修改
        </button>
      </div>
    </div>
  );
}
