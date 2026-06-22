'use client';

interface PaginationProps {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({ page, pageSize, total, totalPages, onPageChange }: PaginationProps) {
  const start = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const end = Math.min(page * pageSize, total);

  /** 生成页码列表 */
  function getPageNumbers(): (number | string)[] {
    const pages: (number | string)[] = [];

    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (page > 3) pages.push('...');

      const rangeStart = Math.max(2, page - 1);
      const rangeEnd = Math.min(totalPages - 1, page + 1);

      for (let i = rangeStart; i <= rangeEnd; i++) pages.push(i);

      if (page < totalPages - 2) pages.push('...');
      pages.push(totalPages);
    }

    return pages;
  }

  if (totalPages <= 0) return null;

  return (
    <div className="flex items-center justify-between py-[14px] px-6 border-t border-slate-200">
      <p className="text-[13px] text-slate-400">
        共 <span className="font-medium text-slate-700">{total}</span> 条，显示第 {start}-{end} 条
      </p>

      <div className="flex items-center gap-1">
        {/* 上一页 */}
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          className="w-[34px] h-[34px] flex items-center justify-center text-[13px] font-medium font-sans border border-slate-200 rounded-md bg-white cursor-pointer transition-all duration-150 text-slate-500 hover:bg-primary-50 hover:border-primary-100 hover:text-primary-600 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>

        {/* 页码 */}
        {getPageNumbers().map((p, idx) =>
          typeof p === 'string' ? (
            <span key={`ellipsis-${idx}`} className="w-[34px] h-[34px] flex items-center justify-center text-slate-400 text-[13px] font-medium">
              ...
            </span>
          ) : p === page ? (
            <button
              key={p}
              onClick={() => onPageChange(p)}
              className="w-[34px] h-[34px] flex items-center justify-center text-[13px] font-medium font-sans border border-primary-600 rounded-md bg-primary-600 text-white cursor-pointer transition-all duration-150 hover:bg-primary-700 hover:border-primary-700"
            >
              {p}
            </button>
          ) : (
            <button
              key={p}
              onClick={() => onPageChange(p)}
              className="w-[34px] h-[34px] flex items-center justify-center text-[13px] font-medium font-sans border border-slate-200 rounded-md bg-white text-slate-600 cursor-pointer transition-all duration-150 hover:bg-primary-50 hover:border-primary-100 hover:text-primary-600"
            >
              {p}
            </button>
          )
        )}

        {/* 下一页 */}
        <button
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages}
          className="w-[34px] h-[34px] flex items-center justify-center text-[13px] font-medium font-sans border border-slate-200 rounded-md bg-white cursor-pointer transition-all duration-150 text-slate-500 hover:bg-primary-50 hover:border-primary-100 hover:text-primary-600 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
      </div>
    </div>
  );
}
