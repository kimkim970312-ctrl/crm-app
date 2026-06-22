'use client';

import { useState } from 'react';
import type { Order } from '@/types/order';
import SearchableSelect from '@/components/SearchableSelect';
import type { SearchableOption } from '@/components/SearchableSelect';

interface OrderEditProps {
  order: Order;
  leads: { name: string; phone: string }[];
  products: { code: string; name: string; price: number }[];
  onSave: (data: { customerName: string; customerPhone: string; productCode: string; productName: string; amount: number }) => void;
  onCancel: () => void;
}

export default function OrderEdit({ order, leads, products, onSave, onCancel }: OrderEditProps) {
  const [customerPhone, setCustomerPhone] = useState(order.customerPhone);
  const [customerName, setCustomerName] = useState(order.customerName);
  const [productName, setProductName] = useState(order.productName);
  const [productCode, setProductCode] = useState(order.productCode);
  const [amount, setAmount] = useState(String(order.amount));
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

  // 选择客户电话 → 自动填充客户名称
  const handleCustomerPhoneChange = (phone: string) => {
    setCustomerPhone(phone);
    const lead = leads.find((l) => l.phone === phone);
    setCustomerName(lead ? lead.name : '');
  };

  // 选择商品 → 自动填充商品编号和金额（取商品价格）
  const handleProductChange = (name: string) => {
    setProductName(name);
    const product = products.find((p) => p.name === name);
    if (product) {
      setProductCode(product.code);
      setAmount(String(product.price));
    } else {
      setProductCode('');
    }
  };

  const handleSubmit = () => {
    if (!customerName || !customerPhone || !productName || !amount) return;
    const numAmount = Number(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      setAmountError('请输入有效的金额');
      return;
    }
    onSave({
      customerName,
      customerPhone,
      productCode,
      productName,
      amount: numAmount,
    });
  };

  const inputClass =
    'w-full h-[38px] px-3 text-[13px] border border-slate-200 rounded-md bg-white text-slate-700 placeholder-slate-400 outline-none transition-all duration-150 focus:border-primary-500 focus:shadow-[0_0_0_3px_rgba(37,99,235,0.1)]';

  return (
    <div className="space-y-5">
      {/* 订单 ID（只读） */}
      <div>
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1">订单ID</p>
        <p className="text-sm font-semibold text-primary-600">{order.id}</p>
      </div>

      {/* 订单编号（只读） */}
      <div>
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1">订单编号</p>
        <p className="text-sm font-semibold text-primary-600">{order.orderNo}</p>
      </div>

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
        <p className="text-sm font-semibold text-slate-800 py-[9px]">{customerName || '请先选择客户电话'}</p>
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
        <p className="text-sm font-semibold text-slate-800 py-[9px]">{productCode || '请先选择商品'}</p>
      </div>

      {/* 下单金额 */}
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
          placeholder="请输入下单金额"
          className={`${inputClass} ${amountError ? 'border-red-300 focus:border-red-500 focus:shadow-[0_0_0_3px_rgba(239,68,68,0.1)]' : ''}`}
        />
        {amountError && <p className="text-[11px] text-red-500 mt-1">{amountError}</p>}
      </div>

      {/* 操作按钮 */}
      <div className="flex items-center gap-3 pt-2">
        <button onClick={onCancel} className="flex-1 h-[38px] text-[13px] font-semibold rounded-md bg-white text-slate-600 border border-slate-200 cursor-pointer transition-all duration-150 hover:bg-slate-50">
          取消
        </button>
        <button
          onClick={handleSubmit}
          disabled={!customerName || !customerPhone || !productName || !amount}
          className="flex-1 h-[38px] text-[13px] font-semibold rounded-md bg-primary-600 text-white border border-primary-600 cursor-pointer transition-all duration-150 hover:bg-primary-700 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          保存修改
        </button>
      </div>
    </div>
  );
}
