'use client';

import { Role, FEATURE_LABELS } from '@/types/role';

interface Props {
  roles: Role[];
  loading: boolean;
  onRename: (role: Role) => void;
  onPermission: (role: Role) => void;
  onDelete: (role: Role) => void;
}

export default function RoleTable({ roles, loading, onRename, onPermission, onDelete }: Props) {
  if (loading) {
    return (
      <div className="p-12 text-center">
        <div className="w-8 h-8 border-2 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-[13px] text-slate-400">加载中...</p>
      </div>
    );
  }

  if (roles.length === 0) {
    return (
      <div className="p-12 text-center">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-10 h-10 text-slate-300 mx-auto mb-3">
          <path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4-4v2" />
          <circle cx="8.5" cy="7" r="4" />
          <line x1="20" y1="8" x2="20" y2="14" />
          <line x1="23" y1="11" x2="17" y2="11" />
        </svg>
        <p className="text-[13px] text-slate-400">暂无角色数据</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-slate-100 bg-slate-50/50">
            <th className="text-left text-[12px] font-semibold text-slate-500 px-5 py-3.5 whitespace-nowrap">创建时间</th>
            <th className="text-left text-[12px] font-semibold text-slate-500 px-5 py-3.5 whitespace-nowrap">角色名</th>
            <th className="text-left text-[12px] font-semibold text-slate-500 px-5 py-3.5 whitespace-nowrap">角色权限</th>
            <th className="text-right text-[12px] font-semibold text-slate-500 px-5 py-3.5 whitespace-nowrap">操作</th>
          </tr>
        </thead>
        <tbody>
          {roles.map((role) => (
            <tr key={role.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors duration-100">
              <td className="px-5 py-4 text-[13px] text-slate-600 whitespace-nowrap">{role.createdAt}</td>
              <td className="px-5 py-4">
                <span className="text-[13px] font-semibold text-slate-800">{role.name}</span>
              </td>
              <td className="px-5 py-4">
                <div className="flex flex-wrap gap-1.5 max-w-[420px]">
                  {role.permissions.length === 0 ? (
                    <span className="text-[12px] text-slate-400 italic">未配置权限</span>
                  ) : (
                    role.permissions.map((perm) => (
                      <span
                        key={perm.pageKey}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-medium bg-primary-50 text-primary-700 border border-primary-100"
                        title={`${perm.pageName}: ${perm.features.map((f) => FEATURE_LABELS[f]).join('、')} | 数据权限: ${perm.dataScope === 'all' ? '全部' : '仅自己'}`}
                      >
                        {perm.pageName}
                      </span>
                    ))
                  )}
                </div>
              </td>
              <td className="px-5 py-4 text-right whitespace-nowrap">
                <div className="inline-flex items-center gap-1">
                  <button
                    onClick={() => onRename(role)}
                    className="px-3 py-1.5 rounded-md text-[12px] font-semibold text-primary-600 hover:bg-primary-50 transition-all duration-150"
                  >
                    修改角色名
                  </button>
                  <button
                    onClick={() => onPermission(role)}
                    className="px-3 py-1.5 rounded-md text-[12px] font-semibold text-amber-600 hover:bg-amber-50 transition-all duration-150"
                  >
                    修改权限
                  </button>
                  <button
                    onClick={() => onDelete(role)}
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
