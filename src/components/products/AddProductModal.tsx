'use client';

import { useState, useEffect, useCallback } from 'react';
import type { ProductStatus } from '@/types/product';
import { CATEGORY_OPTIONS } from '@/types/product';

interface AddProductModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: { name: string; price: number; status: ProductStatus; category: string; description: string }) => void;
}

export default function AddProductModal({ open, onClose, onSubmit }: AddProductModalProps) {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [priceError, setPriceError] = useState('');
  const [status, setStatus] = useState<ProductStatus>('active');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => { if (e.key === 'Escape') handleClose(); },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  useEffect(() => {
    if (open) {
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [open, handleKeyDown]);

  const handleSubmit = () => {
    if (!name.trim() || !price.trim()) return;
    const numPrice = Number(price);
    if (isNaN(numPrice) || numPrice <= 0) {
      setPriceError('请输入有效的价格');
      return;
    }
    onSubmit({
      name: name.trim(),
      price: numPrice,
      status,
      category,
      description: description.trim(),
    });
    resetForm();
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const resetForm = () => {
    setName('');
    setPrice('');
    setPriceError('');
    setStatus('active');
    setCategory('');
    setDescription('');
  };

  const inputClass =
    'w-full h-[38px] px-3 text-[13px] border border-slate-200 rounded-md bg-white text-slate-700 placeholder-slate-400 outline-none transition-all duration-150 focus:border-primary-500 focus:shadow-[0_0_0_3px_rgba(37,99,235,0.1)]';

  if (!open) return null;

  return (
    <>
      <div className="fixed inset-0 bg-slate-900/30 backdrop-blur-sm z-50" onClick={handleClose} />
      <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
        <div className="bg-white rounded-xl shadow-2xl w-[520px] max-w-[90vw] max-h-[85vh] overflow-y-auto pointer-events-auto">
          {/* 头部 */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
            <h2 className="text-base font-bold text-slate-800">添加新商品</h2>
            <button onClick={handleClose} className="w-8 h-8 flex items-center justify-center rounded-md text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors duration-150">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>

          {/* 表单 */}
          <div className="px-6 py-5 space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1.5">
                商品名称 <span className="text-red-400">*</span>
              </label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="请输入商品名称" className={inputClass} />
            </div>

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

            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1.5">状态</label>
              <select value={status} onChange={(e) => setStatus(e.target.value as ProductStatus)} className={inputClass + ' appearance-none'}>
                <option value="active">在售</option>
                <option value="inactive">下架</option>
                <option value="discontinued">停产</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1.5">分类</label>
              <select value={category} onChange={(e) => setCategory(e.target.value)} className={inputClass + ' appearance-none'}>
                <option value="">请选择分类</option>
                {CATEGORY_OPTIONS.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

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
          </div>

          {/* 底部按钮 */}
          <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-200">
            <button onClick={handleClose} className="h-[38px] px-4 text-[13px] font-semibold rounded-md bg-white text-slate-600 border border-slate-200 cursor-pointer transition-all duration-150 hover:bg-slate-50">
              取消
            </button>
            <button
              onClick={handleSubmit}
              disabled={!name.trim() || !price.trim()}
              className="inline-flex items-center gap-2 h-[38px] px-4 text-[13px] font-semibold rounded-md bg-primary-600 text-white border border-primary-600 cursor-pointer transition-all duration-150 hover:bg-primary-700 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              确认添加
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
