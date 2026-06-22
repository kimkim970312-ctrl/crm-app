'use client';

import { Role } from '@/types/role';

interface Props {
  visible: boolean;
  role: Role | null;
  onClose: () => void;
  onConfirm: (id: string) => Promise<void>;
}

export default function DeleteConfirmModal({ visible, role, onClose, onConfirm }: Props) {
  if (!visible || !role) return null;

  const isAdmin = role.name === '超级管理员';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-sm mx-4 overflow-hidden">
        {/* 头部 */}
        <div className="px-6 pt-6 pb-4 text-center">
          <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-3">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-red-500">
              <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
              <line x1="12" y1="9" x2="12" y2="13" />
              <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
          </div>
          <h2 className="text-base font-bold text-slate-800 mb-2">确认删除</h2>
          <p className="text-[13px] text-slate-500">
            {isAdmin
              ? '管理员角色为系统内置角色，不能删除'
              : `确定要删除角色「${role.name}」吗？此操作不可撤销。`
            }
          </p>
        </div>

        {/* 底部 */}
        <div className="flex items-center justify-center gap-3 px-6 pb-6">
          <button
            onClick={onClose}
            className="h-10 px-6 rounded-lg border border-slate-200 text-[13px] font-semibold text-slate-600 hover:bg-slate-50 transition-all duration-150"
          >
            取消
          </button>
          {!isAdmin && (
            <button
              onClick={() => onConfirm(role.id)}
              className="h-10 px-6 rounded-lg bg-red-600 text-white text-[13px] font-semibold hover:bg-red-500 transition-all duration-150"
            >
              确认删除
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
