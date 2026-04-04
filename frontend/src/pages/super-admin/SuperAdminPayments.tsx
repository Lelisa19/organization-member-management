import React, { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '../../services/api';
import { Search, MoreVertical, X } from 'lucide-react';

const SuperAdminPayments: React.FC = () => {
  const { data: payments, isLoading } = useQuery({
    queryKey: ['payments'],
    queryFn: () => api.get('/payments').then((r) => r.data),
  });

  const [activeTab, setActiveTab] = useState<'transactions' | 'invoices'>('transactions');
  const [q, setQ] = useState('');
  const [selected, setSelected] = useState<any | null>(null);

  const filtered = useMemo(() => {
    const list = payments ?? [];
    const term = q.trim().toLowerCase();
    if (!term) return list;
    return list.filter((p: any) => {
      const plan = p.plan?.name ?? '';
      const member = p.user?.name ?? p.user_id ?? '';
      const tx = p.transaction_id ?? '';
      return (
        String(plan).toLowerCase().includes(term) ||
        String(member).toLowerCase().includes(term) ||
        String(tx).toLowerCase().includes(term)
      );
    });
  }, [payments, q]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-slate-900">Payments &amp; Subscriptions</h1>
        <p className="text-sm text-slate-500">Organization plans and payment activity</p>
      </div>

      <div className="flex border-b border-slate-200">
        <button
          type="button"
          onClick={() => setActiveTab('transactions')}
          className={`px-4 py-2 text-sm font-bold border-b-2 ${
            activeTab === 'transactions'
              ? 'text-sky-600 border-sky-600'
              : 'text-slate-500 border-transparent'
          }`}
        >
          Payment Transactions
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('invoices')}
          className={`px-4 py-2 text-sm font-medium border-b-2 ${
            activeTab === 'invoices' ? 'border-sky-600 text-sky-600' : 'border-transparent text-slate-500'
          }`}
        >
          Invoices &amp; Receipts
        </button>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
        <input
          placeholder="Search…"
          className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 text-sm"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              {activeTab === 'transactions' ? (
                <>
                  <th className="text-left p-3 font-bold text-slate-600">Plan</th>
                  <th className="text-left p-3 font-bold text-slate-600">Amount</th>
                  <th className="text-left p-3 font-bold text-slate-600">Billing</th>
                  <th className="text-left p-3 font-bold text-slate-600">Member</th>
                </>
              ) : (
                <>
                  <th className="text-left p-3 font-bold text-slate-600">Invoice</th>
                  <th className="text-left p-3 font-bold text-slate-600">Member</th>
                  <th className="text-left p-3 font-bold text-slate-600">Amount</th>
                  <th className="text-left p-3 font-bold text-slate-600">Method</th>
                </>
              )}
              <th className="w-10 p-3" />
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={5} className="p-8 text-center text-slate-500">
                  Loading…
                </td>
              </tr>
            ) : !filtered?.length ? (
              <tr>
                <td colSpan={5} className="p-8 text-center text-slate-500">
                  No payments yet
                </td>
              </tr>
            ) : (
              filtered.map((p: any) => (
                <tr key={p.id} className="border-t border-slate-100">
                  {activeTab === 'transactions' ? (
                    <>
                      <td className="p-3 font-medium">{p.plan?.name ?? '—'}</td>
                      <td className="p-3">${p.amount ?? 0}</td>
                      <td className="p-3 text-slate-600">{p.plan?.billing_cycle ?? '—'}</td>
                      <td className="p-3 text-slate-600">{p.user?.name ?? p.user_id ?? '—'}</td>
                    </>
                  ) : (
                    <>
                      <td className="p-3 font-medium">{p.transaction_id ?? '—'}</td>
                      <td className="p-3 text-slate-600">{p.user?.name ?? p.user_id ?? '—'}</td>
                      <td className="p-3">${p.amount ?? 0}</td>
                      <td className="p-3 text-slate-600">{p.payment_method ?? '—'}</td>
                    </>
                  )}
                  <td className="p-3">
                    <button
                      type="button"
                      className="p-1 text-slate-400 hover:text-slate-600"
                      aria-label="Payment actions"
                      onClick={() => setSelected(p)}
                    >
                      <MoreVertical size={18} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {selected ? (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50"
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden">
            <div className="p-4 border-b flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-slate-900">Payment details</p>
                <p className="text-xs text-slate-500">
                  {selected.transaction_id ? `Invoice: ${selected.transaction_id}` : 'Invoice: —'}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelected(null)}
                className="p-2 rounded hover:bg-gray-50"
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </div>
            <div className="p-4 space-y-3 text-sm">
              <div className="flex justify-between gap-4">
                <span className="text-slate-600">Member</span>
                <span className="font-semibold text-slate-900">
                  {selected.user?.name ?? selected.user_id ?? '—'}
                </span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-slate-600">Plan</span>
                <span className="font-semibold text-slate-900">{selected.plan?.name ?? '—'}</span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-slate-600">Amount</span>
                <span className="font-semibold text-slate-900">${selected.amount ?? 0}</span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-slate-600">Billing</span>
                <span className="font-semibold text-slate-900">
                  {selected.plan?.billing_cycle ?? '—'}
                </span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-slate-600">Payment method</span>
                <span className="font-semibold text-slate-900">{selected.payment_method ?? '—'}</span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-slate-600">Status</span>
                <span className="font-semibold text-slate-900">{selected.status ?? '—'}</span>
              </div>
              {selected.createdAt ? (
                <div className="flex justify-between gap-4">
                  <span className="text-slate-600">Created</span>
                  <span className="font-semibold text-slate-900">
                    {new Date(selected.createdAt).toLocaleString()}
                  </span>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default SuperAdminPayments;
