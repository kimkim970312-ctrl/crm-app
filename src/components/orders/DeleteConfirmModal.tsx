'use client';

import { useEffect, useCallback } from 'react';

interface DeleteConfirmModalProps {
  open: boolean;
  orderName: string;
  orderId: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function DeleteConfirmModal({ open, orderName, orderId, onConfirm, onCancel }: DeleteConfirmModalProps) {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCancel();
    },
    [onCancel]
  );

  useEffect(() => {
    if (open) {
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [open, handleKeyDown]);

  if (!open) return null;

  return (
    <>
      {/* 遮罩 */}
      <div className="fixed inset-0 bg-slate-900/30 backdrop-blur-sm z-50" onClick={onCancel} />

      {/* 弹窗 */}
      <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
        <div className="bg-white rounded-xl shadow-2xl w-[400px] max-w-[90vw] pointer-events-auto p-6">
          {/* 删除图标 */}
          <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4">
            <svg viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
              <polyline points="3 6 5 6 21 6" />
              <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
            </svg>
          </div>

          <h3 className="text-center text-base font-bold text-slate-800 mb-2">确认删除</h3>
          <p className="text-center text-sm text-slate-500 mb-1">
            确定要删除订单 <span className="font-semibold text-slate-700">{orderName}</span> 吗？
          </p>
          <p className="text-center text-xs text-slate-400 mb-6">
            编号：{orderId} · 此操作不可撤销
          </p>

          <div className="flex items-center gap-3">
            <button
              onClick={onCancel}
              className="flex-1 h-[38px] text-[13px] font-semibold rounded-md bg-white text-slate-600 border border-slate-200 cursor-pointer transition-all duration-150 hover:bg-slate-50"
            >
              取消
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 h-[38px] text-[13px] font-semibold rounded-md bg-red-500 text-white border border-red-500 cursor-pointer transition-all duration-150 hover:bg-red-600"
            >
              确认删除
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
