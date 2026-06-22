'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';

export interface SearchableOption {
  value: string;
  label: string;
  searchText: string;       // 用于模糊搜索的全部文本
}

interface SearchableSelectProps {
  options: SearchableOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  emptyText?: string;
  /** 选择后显示在输入框中的文本（不传则显示 value 对应的 label） */
  displayValue?: string;
}

export default function SearchableSelect({
  options,
  value,
  onChange,
  placeholder = '请选择',
  emptyText = '无匹配结果',
  displayValue,
}: SearchableSelectProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [dropdownStyle, setDropdownStyle] = useState<React.CSSProperties>({});

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // 过滤选项
  const filtered = search
    ? options.filter((o) => o.searchText.includes(search.toLowerCase()))
    : options;

  // 已选项的 label
  const selectedLabel = displayValue ?? options.find((o) => o.value === value)?.label ?? '';

  // 点击外部关闭
  const handleClickOutside = useCallback((e: MouseEvent) => {
    if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
      setOpen(false);
    }
  }, []);

  useEffect(() => {
    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open, handleClickOutside]);

  // 计算下拉面板位置
  const updateDropdownPosition = useCallback(() => {
    if (!open || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    setDropdownStyle({
      position: 'fixed',
      left: rect.left,
      top: rect.bottom + 4,
      width: rect.width,
      zIndex: 9999,
    });
  }, [open]);

  useEffect(() => {
    updateDropdownPosition();
    window.addEventListener('scroll', updateDropdownPosition, true);
    window.addEventListener('resize', updateDropdownPosition);
    return () => {
      window.removeEventListener('scroll', updateDropdownPosition, true);
      window.removeEventListener('resize', updateDropdownPosition);
    };
  }, [open, updateDropdownPosition]);

  // 打开时聚焦输入框
  const handleToggle = () => {
    if (!open) {
      setOpen(true);
      setSearch('');
      setTimeout(() => {
        inputRef.current?.focus();
        updateDropdownPosition();
      }, 50);
    } else {
      setOpen(false);
    }
  };

  const handleSelect = (opt: SearchableOption) => {
    onChange(opt.value);
    setOpen(false);
    setSearch('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setOpen(false);
      inputRef.current?.blur();
    }
  };

  const dropdown = open && (
    <div
      ref={listRef}
      style={dropdownStyle}
      className="bg-white border border-slate-200 rounded-lg shadow-lg max-h-[240px] flex flex-col"
    >
      {/* 搜索输入框 */}
      <div className="p-2 border-b border-slate-100">
        <input
          ref={inputRef}
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="搜索..."
          className="w-full h-[32px] px-2.5 text-[13px] border border-slate-200 rounded-md bg-slate-50 text-slate-700 placeholder-slate-400 outline-none transition-all duration-150 focus:border-primary-500 focus:bg-white focus:shadow-[0_0_0_3px_rgba(37,99,235,0.1)]"
        />
      </div>

      {/* 选项列表 */}
      <div className="flex-1 overflow-y-auto py-1">
        {filtered.length > 0 ? (
          filtered.map((opt) => {
            const isSelected = opt.value === value;
            return (
              <div
                key={opt.value}
                onMouseDown={(e) => {
                  e.preventDefault();
                  handleSelect(opt);
                }}
                className={`px-3 py-2 text-[13px] cursor-pointer transition-colors duration-100 ${
                  isSelected
                    ? 'bg-primary-50 text-primary-600 font-semibold'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <span className="truncate block">{opt.label}</span>
              </div>
            );
          })
        ) : (
          <div className="px-3 py-6 text-center text-[13px] text-slate-400">{emptyText}</div>
        )}
      </div>
    </div>
  );

  return (
    <div ref={containerRef} className="relative">
      {/* 触发区域：显示当前值，点击展开 */}
      <div
        onClick={handleToggle}
        className="w-full h-[38px] px-3 text-[13px] border border-slate-200 rounded-md bg-white text-slate-700 flex items-center cursor-pointer transition-all duration-150 hover:border-slate-300"
      >
        <span className={`flex-1 truncate ${selectedLabel ? '' : 'text-slate-400'}`}>
          {selectedLabel || placeholder}
        </span>
        <svg
          viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
          className={`w-4 h-4 text-slate-400 transition-transform duration-150 flex-shrink-0 ${open ? 'rotate-180' : ''}`}
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </div>

      {/* 使用 Portal 渲染下拉面板到 body，避免被父容器裁剪 */}
      {typeof document !== 'undefined' && createPortal(dropdown, document.body)}
    </div>
  );
}
