'use client';

/** 统一的卡片包装器 — 所有图表模块共用，支持 h-full 拉伸等高 */
export function Card({ title, children, className = '' }: { title?: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={`bg-white rounded-xl border border-slate-200 p-5 h-full ${className}`}>
      {title && (
        <div className="flex items-center gap-2 mb-4">
          <span className="w-1 h-4 bg-primary-600 rounded-full flex-shrink-0" />
          <h3 className="text-sm font-bold text-slate-700">{title}</h3>
        </div>
      )}
      {children}
    </div>
  );
}
