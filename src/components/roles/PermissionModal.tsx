'use client';

import { useState, useEffect, useCallback } from 'react';
import { Role, PagePermission, PAGE_OPTIONS, FEATURE_OPTIONS, DATA_SCOPE_OPTIONS, FeaturePerm, DataScope } from '@/types/role';

interface Props {
  visible: boolean;
  role: Role | null;
  onClose: () => void;
  onSubmit: (id: string, permissions: PagePermission[]) => Promise<void>;
}

export default function PermissionModal({ visible, role, onClose, onSubmit }: Props) {
  const [permissions, setPermissions] = useState<PagePermission[]>([]);
  const [submitting, setSubmitting] = useState(false);

  // 初始化权限状态
  useEffect(() => {
    if (role) {
      setPermissions(
        PAGE_OPTIONS.map((page) => {
          const existing = role.permissions.find((p) => p.pageKey === page.key);
          return existing || { pageKey: page.key, pageName: page.label, features: [], dataScope: 'self' as DataScope };
        })
      );
    }
  }, [role]);

  /** 切换页面权限（勾选/取消页面） */
  const togglePage = useCallback((pageKey: string) => {
    setPermissions((prev) =>
      prev.map((p) => {
        if (p.pageKey !== pageKey) return p;
        const checked = p.features.length > 0;
        return {
          ...p,
          features: checked ? [] : (['view'] as FeaturePerm[]),
          dataScope: checked ? 'self' : 'all',
        };
      })
    );
  }, []);

  /** 切换功能权限 */
  const toggleFeature = useCallback((pageKey: string, feature: FeaturePerm) => {
    setPermissions((prev) =>
      prev.map((p) => {
        if (p.pageKey !== pageKey) return p;
        const has = p.features.includes(feature);
        const features = has ? p.features.filter((f) => f !== feature) : [...p.features, feature];
        return { ...p, features };
      })
    );
  }, []);

  /** 修改数据权限 */
  const setDataScope = useCallback((pageKey: string, scope: DataScope) => {
    setPermissions((prev) =>
      prev.map((p) => (p.pageKey === pageKey ? { ...p, dataScope: scope } : p))
    );
  }, []);

  const handleSubmit = async () => {
    if (!role) return;
    setSubmitting(true);
    try {
      // 只提交勾选了权限的页面
      const activePermissions = permissions.filter((p) => p.features.length > 0);
      await onSubmit(role.id, activePermissions);
    } finally {
      setSubmitting(false);
    }
  };

  if (!visible || !role) return null;

  const isPageChecked = (pageKey: string) => permissions.find((p) => p.pageKey === pageKey)?.features.length ?? 0 > 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-2xl mx-4 max-h-[85vh] flex flex-col overflow-hidden">
        {/* 头部 */}
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-slate-100 flex-shrink-0">
          <div>
            <h2 className="text-base font-bold text-slate-800">权限设置</h2>
            <p className="text-[12px] text-slate-400 mt-0.5">角色：<span className="font-semibold text-slate-600">{role.name}</span></p>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all duration-150">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
          </button>
        </div>

        {/* 表头说明 */}
        <div className="grid grid-cols-12 gap-4 px-6 py-3 bg-slate-50/50 border-b border-slate-100 text-[11px] font-semibold text-slate-400 flex-shrink-0">
          <div className="col-span-3">页面权限</div>
          <div className="col-span-5">功能权限</div>
          <div className="col-span-4">数据权限</div>
        </div>

        {/* 权限列表 — 可滚动 */}
        <div className="flex-1 overflow-y-auto">
          {permissions.map((perm) => {
            const checked = perm.features.length > 0;
            return (
              <div key={perm.pageKey} className="border-b border-slate-50 last:border-b-0">
                {/* 主体行 */}
                <div className="grid grid-cols-12 gap-4 px-6 py-3.5 items-start">
                  {/* 页面权限（checkbox + 名称） */}
                  <div className="col-span-3 flex items-center gap-2.5 pt-0.5">
                    <label className="relative flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => togglePage(perm.pageKey)}
                        className="w-4 h-4 rounded border-slate-300 text-primary-600 focus:ring-primary-200 cursor-pointer"
                      />
                    </label>
                    <span className={`text-[13px] font-medium ${checked ? 'text-slate-800' : 'text-slate-400'}`}>
                      {perm.pageName}
                    </span>
                  </div>

                  {/* 功能权限（checkbox 组） */}
                  <div className="col-span-5 flex flex-wrap gap-1.5">
                    {FEATURE_OPTIONS.map((feat) => {
                      const active = perm.features.includes(feat.key);
                      return (
                        <label
                          key={feat.key}
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md cursor-pointer transition-all duration-150 text-[12px] ${
                            checked
                              ? active
                                ? 'bg-primary-50 text-primary-700 border border-primary-200'
                                : 'bg-white text-slate-400 border border-slate-200 hover:border-slate-300'
                              : 'bg-slate-50 text-slate-300 border border-slate-100 cursor-not-allowed'
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={active}
                            disabled={!checked}
                            onChange={() => toggleFeature(perm.pageKey, feat.key)}
                            className="w-3 h-3 rounded border-slate-300 text-primary-600 focus:ring-primary-200 cursor-pointer disabled:cursor-not-allowed disabled:opacity-30"
                          />
                          {feat.label}
                        </label>
                      );
                    })}
                  </div>

                  {/* 数据权限（radio 二选一） */}
                  <div className="col-span-4 flex items-center gap-4">
                    {DATA_SCOPE_OPTIONS.map((scope) => (
                      <label
                        key={scope.key}
                        className={`inline-flex items-center gap-1.5 text-[12px] cursor-pointer ${
                          checked ? 'text-slate-600' : 'text-slate-300 cursor-not-allowed'
                        }`}
                      >
                        <input
                          type="radio"
                          name={`dataScope-${perm.pageKey}`}
                          checked={perm.dataScope === scope.key}
                          disabled={!checked}
                          onChange={() => setDataScope(perm.pageKey, scope.key)}
                          className="w-3.5 h-3.5 border-slate-300 text-primary-600 focus:ring-primary-200 cursor-pointer disabled:cursor-not-allowed disabled:opacity-30"
                        />
                        {scope.label}
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* 底部 */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100 bg-slate-50/50 flex-shrink-0">
          <span className="text-[11px] text-slate-400">
            已勾选 <span className="font-semibold text-slate-600">{permissions.filter((p) => p.features.length > 0).length}</span> 个页面权限
          </span>
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="h-10 px-5 rounded-lg border border-slate-200 text-[13px] font-semibold text-slate-600 hover:bg-slate-50 transition-all duration-150"
            >
              取消
            </button>
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="h-10 px-6 rounded-lg bg-primary-600 text-white text-[13px] font-semibold hover:bg-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-150 flex items-center gap-2"
            >
              {submitting && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
              保存权限
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
