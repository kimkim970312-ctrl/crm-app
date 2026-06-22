'use client';

import { useState } from 'react';
import type { ProductFilter, ProductStatus } from '@/types/product';
import { statusLabels, CATEGORY_OPTIONS } from '@/types/product';

interface FilterBarProps {
  onFilter: (filter: ProductFilter) => void;
}

export default function FilterBar({ onFilter }: FilterBarProps) {
  const [createdAtStart, setCreatedAtStart] = useState('');
  const [createdAtEnd, setCreatedAtEnd] = useState('');
  const [code, setCode] = useState('');
  const [name, setName] = useState('');

  const handleSearch = () => {
    onFilter({
      createdAtStart: createdAtStart || undefined,
      createdAtEnd: createdAtEnd || undefined,
      code: code || undefined,
      name: name || undefined,
    });
  };

  const handleReset = () => {
    setCreatedAtStart('');
    setCreatedAtEnd('');
    setCode('');
    setName('');
    onFilter({});
  };

  const inputClass =
    'h-[38px] px-3 text-[13px] border border-slate-200 rounded-md bg-white text-slate-700 placeholder-slate-400 outline-none transition-all duration-150 focus:border-primary-500 focus:shadow-[0_0_0_3px_rgba(37,99,235,0.1)]';

  return (
    <div className="bg-white rounded-xl border border-slate-200 px-6 py-5 mb-5">
      {/* 标题行 + 操作按钮 */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-[18px] h-[18px] text-slate-400">
            <line x1="4" y1="21" x2="4" y2="14" />
            <line x1="4" y1="10" x2="4" y2="3" />
            <line x1="12" y1="21" x2="12" y2="12" />
            <line x1="12" y1="8" x2="12" y2="3" />
            <line x1="20" y1="21" x2="20" y2="16" />
            <line x1="20" y1="12" x2="20" y2="3" />
            <line x1="2" y1="14" x2="6" y2="14" />
            <line x1="10" y1="12" x2="14" y2="12" />
            <line x1="18" y1="16" x2="22" y2="16" />
          </svg>
          筛选条件
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleReset}
            className="inline-flex items-center justify-center gap-2 h-[30px] px-[10px] text-[12px] font-semibold rounded-md bg-white text-slate-600 border border-slate-200 cursor-pointer transition-all duration-150 hover:bg-slate-50"
          >
            重置
          </button>
          <button
            onClick={handleSearch}
            className="inline-flex items-center justify-center gap-2 h-[30px] px-[10px] text-[12px] font-semibold rounded-md bg-primary-600 text-white border border-primary-600 cursor-pointer transition-all duration-150 hover:bg-primary-700"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            查询
          </button>
        </div>
      </div>

      {/* 筛选字段：一行排列 */}
      <div className="flex flex-wrap gap-3 items-end">
        {/* 创建时间 */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[12px] font-semibold text-slate-400 uppercase tracking-wide">创建时间</label>
          <div className="flex items-center gap-2">
            <input
              type="date"
              value={createdAtStart}
              onChange={(e) => setCreatedAtStart(e.target.value)}
              className={inputClass + ' w-[180px]'}
            />
            <span className="text-slate-400 text-sm flex-shrink-0">至</span>
            <input
              type="date"
              value={createdAtEnd}
              onChange={(e) => setCreatedAtEnd(e.target.value)}
              className={inputClass + ' w-[180px]'}
            />
          </div>
        </div>

        {/* 商品编号 */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[12px] font-semibold text-slate-400 uppercase tracking-wide">商品编号</label>
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="请输入商品编号"
            className={inputClass + ' w-[160px]'}
            onKeyDown={(e) => { if (e.key === 'Enter') handleSearch(); }}
          />
        </div>

        {/* 商品名称 */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[12px] font-semibold text-slate-400 uppercase tracking-wide">商品名称</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="请输入商品名称"
            className={inputClass + ' w-[160px]'}
            onKeyDown={(e) => { if (e.key === 'Enter') handleSearch(); }}
          />
        </div>
      </div>
    </div>
  );
}
