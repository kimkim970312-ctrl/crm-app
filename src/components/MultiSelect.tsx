'use client';

import { useState, useRef, useEffect } from 'react';

interface MultiSelectProps {
  options: string[];
  selected: string[];
  onChange: (selected: string[]) => void;
  placeholder?: string;
  className?: string;
}

export default function MultiSelect({
  options,
  selected,
  onChange,
  placeholder = '请选择',
  className = '',
}: MultiSelectProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // 点击外部关闭
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open]);

  const toggleOption = (name: string) => {
    onChange(
      selected.includes(name)
        ? selected.filter((n) => n !== name)
        : [...selected, name]
    );
  };

  const removeOption = (e: React.MouseEvent, name: string) => {
    e.stopPropagation();
    onChange(selected.filter((n) => n !== name));
  };

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {/* 触发器 */}
      <div
        className="w-full min-h-[38px] px-3 py-1.5 text-[13px] border border-slate-200 rounded-md bg-white text-slate-700 cursor-pointer transition-all duration-150 hover:border-slate-300 flex items-center flex-wrap gap-1"
        onClick={() => setOpen(!open)}
      >
        {selected.length > 0 ? (
          <>
            {selected.map((name) => (
              <span
                key={name}
                className="inline-flex items-center gap-1 bg-primary-50 text-primary-700 text-[12px] font-medium px-2 py-0.5 rounded-md border border-primary-100"
              >
                {name}
                <button
                  onClick={(e) => removeOption(e, name)}
                  className="w-3.5 h-3.5 flex items-center justify-center rounded-full hover:bg-primary-200 transition-colors"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-2.5 h-2.5">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </span>
            ))}
          </>
        ) : (
          <span className="text-slate-400">{placeholder}</span>
        )}
        <span className="ml-auto flex-shrink-0 text-slate-400">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={`w-4 h-4 transition-transform duration-150 ${open ? 'rotate-180' : ''}`}
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </span>
      </div>

      {/* 下拉菜单 */}
      {open && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto">
          {options.map((name) => {
            const isSelected = selected.includes(name);
            return (
              <div
                key={name}
                className={`flex items-center gap-2.5 px-3 py-2.5 cursor-pointer transition-colors duration-100 text-[13px] ${
                  isSelected ? 'bg-primary-50 text-primary-700 font-semibold' : 'text-slate-600 hover:bg-slate-50'
                }`}
                onClick={() => toggleOption(name)}
              >
                {/* 自定义复选框 */}
                <span
                  className={`w-4 h-4 rounded border-2 flex items-center justify-center flex-shrink-0 transition-colors duration-100 ${
                    isSelected ? 'bg-primary-600 border-primary-600' : 'border-slate-300'
                  }`}
                >
                  {isSelected && (
                    <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="w-3 h-3">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  )}
                </span>
                {name}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
