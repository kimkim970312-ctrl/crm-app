'use client';

import { Account } from '@/types/account';

interface Props {
  accounts: Account[];
  loading: boolean;
  onEdit: (account: Account) => void;
  onResetPwd: (account: Account) => void;
  onDelete: (account: Account) => void;
}

export default function AccountTable({ accounts, loading, onEdit, onResetPwd, onDelete }: Props) {
  if (loading) {
    return (
      <div className="p-12 text-center">
        <div className="w-8 h-8 border-2 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-[13px] text-slate-400">加载中...</p>
      </div>
    );
  }

  if (accounts.length === 0) {
    return (
      <div className="p-12 text-center">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-10 h-10 text-slate-300 mx-auto mb-3">
          <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4-4v2" />
          <circle cx="9" cy="7" r="4" />
          <line x1="23" y1="11" x2="23" y2="11" />
        </svg>
        <p className="text-[13px] text-slate-400">暂无账号数据</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-slate-100 bg-slate-50/50">
            <th className="text-left text-[12px] font-semibold text-slate-500 px-5 py-3.5 whitespace-nowrap">创建时间</th>
            <th className="text-left text-[12px] font-semibold text-slate-500 px-5 py-3.5 whitespace-nowrap">手机号</th>
            <th className="text-left text-[12px] font-semibold text-slate-500 px-5 py-3.5 whitespace-nowrap">用户姓名</th>
            <th className="text-left text-[12px] font-semibold text-slate-500 px-5 py-3.5 whitespace-nowrap">所属角色</th>
            <th className="text-right text-[12px] font-semibold text-slate-500 px-5 py-3.5 whitespace-nowrap">操作</th>
          </tr>
        </thead>
        <tbody>
          {accounts.map((account) => (
            <tr key={account.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors duration-100">
              <td className="px-5 py-4 text-[13px] text-slate-600 whitespace-nowrap">{account.createdAt}</td>
              <td className="px-5 py-4">
                <span className="text-[13px] font-semibold text-slate-800 tabular-nums">{account.phone}</span>
              </td>
              <td className="px-5 py-4">
                <span className="text-[13px] text-slate-700">{account.name}</span>
              </td>
              <td className="px-5 py-4">
                <span className="inline-flex px-2.5 py-1 rounded-md text-[11px] font-medium bg-primary-50 text-primary-700 border border-primary-100">
                  {account.roleName}
                </span>
              </td>
              <td className="px-5 py-4 text-right whitespace-nowrap">
                <div className="inline-flex items-center gap-1">
                  <button
                    onClick={() => onEdit(account)}
                    className="px-3 py-1.5 rounded-md text-[12px] font-semibold text-primary-600 hover:bg-primary-50 transition-all duration-150"
                  >
                    修改
                  </button>
                  <button
                    onClick={() => onResetPwd(account)}
                    className="px-3 py-1.5 rounded-md text-[12px] font-semibold text-amber-600 hover:bg-amber-50 transition-all duration-150"
                  >
                    重置密码
                  </button>
                  <button
                    onClick={() => onDelete(account)}
                    className="px-3 py-1.5 rounded-md text-[12px] font-semibold text-red-600 hover:bg-red-50 transition-all duration-150"
                  >
                    删除
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
