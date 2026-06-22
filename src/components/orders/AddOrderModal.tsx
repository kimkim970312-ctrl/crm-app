'use client';

import { useState, useEffect, useCallback } from 'react';
import SearchableSelect from '@/components/SearchableSelect';
import type { SearchableOption } from '@/components/SearchableSelect';

interface LeadOption {
  name: string;
  phone: string;
}

interface ProductOption {
  code: string;
  name: string;
  price: number;
}

interface AddOrderModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: { customerName: string; customerPhone: string; productCode: string; productName: string; amount: number }) => void;
}

export default function AddOrderModal({ open, onClose, onSubmit }: AddOrderModalProps) {
  const [leads, setLeads] = useState<LeadOption[]>([]);
  const [products, setProducts] = useState<ProductOption[]>([]);
  const [loadingData, setLoadingData] = useState(false);

  const [customerPhone, setCustomerPhone] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [productName, setProductName] = useState('');
  const [productCode, setProductCode] = useState('');
  const [amount, setAmount] = useState('');
  const [amountError, setAmountError] = useState('');

  // 构建 SearchableSelect 所需的数据
  const leadOptions: SearchableOption[] = leads.map((l) => ({
    value: l.phone,
    label: `${l.phone} - ${l.name}`,
    searchText: `${l.phone} ${l.name}`.toLowerCase(),
  }));

  const productOptions: SearchableOption[] = products.map((p) => ({
    value: p.name,
    label: `${p.name}（¥${p.price.toFixed(2)}）`,
    searchText: `${p.name} ${p.code}`.toLowerCase(),
  }));

  // 加载客户和商品数据
  useEffect(() => {
    if (!open) return;
    setLoadingData(true);
    Promise.all([
      fetch('/api/orders?type=leads').then((r) => r.json()),
      fetch('/api/orders?type=products').then((r) => r.json()),
    ])
      .then(([leadsRes, productsRes]) => {
        setLeads(leadsRes.data || []);
        setProducts(productsRes.data || []);
      })
      .catch(console.error)
      .finally(() => setLoadingData(false));
  }, [open]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => { if (e.key === 'Escape') handleClose(); },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  useEffect(() => {
    if (open) {
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [open, handleKeyDown]);

  // 选择客户电话 → 自动填充客户名称
  const handleCustomerPhoneChange = (phone: string) => {
    setCustomerPhone(phone);
    const lead = leads.find((l) => l.phone === phone);
    setCustomerName(lead ? lead.name : '');
  };

  // 选择商品 → 自动填充商品编号和金额
  const handleProductChange = (name: string) => {
    setProductName(name);
    const product = products.find((p) => p.name === name);
    if (product) {
      setProductCode(product.code);
      setAmount(String(product.price));
    } else {
      setProductCode('');
      setAmount('');
    }
  };

  const handleSubmit = () => {
    if (!customerName || !customerPhone || !productName || !amount) return;
    const numAmount = Number(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      setAmountError('请输入有效的金额');
      return;
    }
    onSubmit({
      customerName,
      customerPhone,
      productCode,
      productName,
      amount: numAmount,
    });
    resetForm();
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const resetForm = () => {
    setCustomerPhone('');
    setCustomerName('');
    setProductName('');
    setProductCode('');
    setAmount('');
    setAmountError('');
  };

  const inputClass =
    'w-full h-[38px] px-3 text-[13px] border border-slate-200 rounded-md bg-white text-slate-700 placeholder-slate-400 outline-none transition-all duration-150 focus:border-primary-500 focus:shadow-[0_0_0_3px_rgba(37,99,235,0.1)]';

  if (!open) return null;

  return (
    <>
      <div className="fixed inset-0 bg-slate-900/30 backdrop-blur-sm z-50" onClick={handleClose} />
      <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
        <div className="bg-white rounded-xl shadow-2xl w-[520px] max-w-[90vw] max-h-[85vh] overflow-y-auto pointer-events-auto">
          {/* 头部 */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
            <h2 className="text-base font-bold text-slate-800">添加新订单</h2>
            <button onClick={handleClose} className="w-8 h-8 flex items-center justify-center rounded-md text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors duration-150">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>

          {/* 表单 */}
          <div className="px-6 py-5 space-y-4">
            {loadingData ? (
              <div className="flex items-center justify-center py-8 text-slate-400">
                <svg className="animate-spin w-5 h-5 mr-2" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                加载数据中...
              </div>
            ) : (
              <>
                {/* 客户电话 */}
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1.5">
                    客户电话 <span className="text-red-400">*</span>
                  </label>
                  <SearchableSelect
                    options={leadOptions}
                    value={customerPhone}
                    onChange={handleCustomerPhoneChange}
                    placeholder="搜索客户电话或姓名..."
                    displayValue={customerPhone ? `${customerPhone} - ${customerName}` : ''}
                  />
                </div>

                {/* 客户名称（自动填充，只读） */}
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1.5">客户名称</label>
                  <p className="text-sm font-semibold text-primary-600 py-[9px]">{customerName || '选择客户电话后自动填充'}</p>
                </div>

                {/* 商品选择 */}
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1.5">
                    下单商品 <span className="text-red-400">*</span>
                  </label>
                  <SearchableSelect
                    options={productOptions}
                    value={productName}
                    onChange={handleProductChange}
                    placeholder="搜索商品名称..."
                    displayValue={productName ? `${productName}（¥${Number(amount || 0).toFixed(2)}）` : ''}
                  />
                </div>

                {/* 商品编号（自动填充，只读） */}
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1.5">商品编号</label>
                  <p className="text-sm font-semibold text-primary-600 py-[9px]">{productCode || '选择商品后自动填充'}</p>
                </div>

                {/* 下单金额（自动填充商品价格，可手动修改） */}
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1.5">
                    下单金额 <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={amount}
                    onChange={(e) => { setAmount(e.target.value); setAmountError(''); }}
                    onBlur={() => {
                      const n = Number(amount);
                      if (amount.trim() && (isNaN(n) || n <= 0)) {
                        setAmountError('请输入有效的金额');
                      } else {
                        setAmountError('');
                      }
                    }}
                    placeholder="选择商品后自动填充"
                    className={`${inputClass} ${amountError ? 'border-red-300 focus:border-red-500 focus:shadow-[0_0_0_3px_rgba(239,68,68,0.1)]' : ''}`}
                  />
                  {amountError && <p className="text-[11px] text-red-500 mt-1">{amountError}</p>}
                </div>
              </>
            )}
          </div>

          {/* 底部按钮 */}
          <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-200">
            <button onClick={handleClose} className="h-[38px] px-4 text-[13px] font-semibold rounded-md bg-white text-slate-600 border border-slate-200 cursor-pointer transition-all duration-150 hover:bg-slate-50">
              取消
            </button>
            <button
              onClick={handleSubmit}
              disabled={!customerName || !customerPhone || !productName || !amount}
              className="inline-flex items-center gap-2 h-[38px] px-4 text-[13px] font-semibold rounded-md bg-primary-600 text-white border border-primary-600 cursor-pointer transition-all duration-150 hover:bg-primary-700 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              确认添加
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
