import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../services/api';
import { Payment, Plan } from '../types';
import { CreditCard, CheckCircle, Clock, AlertCircle, Plus, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Payments: React.FC = () => {
  const { user } = useAuth();
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);
  const queryClient = useQueryClient();

  const { data: payments, isLoading: paymentsLoading } = useQuery<any[]>({
    queryKey: ['payments'],
    queryFn: () => api.get('/payments').then(res => res.data),
  });

  const { data: plans, isLoading: plansLoading } = useQuery<Plan[]>({
    queryKey: ['plans'],
    queryFn: () => api.get('/plans').then(res => res.data),
  });

  const upgradeMutation = useMutation({
    mutationFn: (planId: number) => api.post('/payments', {
      plan_id: planId,
      amount: plans?.find(p => p.id === planId)?.price || 0,
      payment_method: 'Credit Card',
      transaction_id: 'TRX-' + Math.random().toString(36).substr(2, 9).toUpperCase(),
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payments'] });
      queryClient.invalidateQueries({ queryKey: ['auth', 'profile'] });
      setIsUpgradeModalOpen(false);
      alert('Plan upgraded successfully!');
    },
  });

  return (
    <div className="space-y-6 font-poppins">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-black text-brand-dark tracking-tight">Payments & Subscription</h1>
        {user?.role === 'organAdmin' && (
          <button
            onClick={() => setIsUpgradeModalOpen(true)}
            className="bg-brand-medium text-white px-5 py-2.5 rounded-2xl flex items-center space-x-2 hover:bg-brand-light transition-all shadow-lg shadow-brand-medium/20 font-bold"
          >
            <Plus size={20} />
            <span>Upgrade Plan</span>
          </button>
        )}
      </div>

      <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b bg-gray-50/50">
          <h2 className="text-lg font-black text-brand-dark tracking-tight">Payment History</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50/30 text-brand-deep text-[10px] font-black uppercase tracking-[0.2em]">
              <tr>
                {user?.role === 'SuperAdmin' && <th className="px-8 py-4">Organization</th>}
                <th className="px-8 py-4">Plan</th>
                <th className="px-8 py-4">Amount</th>
                <th className="px-8 py-4">Method</th>
                <th className="px-8 py-4">Date</th>
                <th className="px-8 py-4">Status</th>
                <th className="px-8 py-4">Transaction ID</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {paymentsLoading ? (
                <tr><td colSpan={user?.role === 'SuperAdmin' ? 7 : 6} className="px-8 py-10 text-center text-gray-400 font-medium">Loading payments...</td></tr>
              ) : payments?.length === 0 ? (
                <tr><td colSpan={user?.role === 'SuperAdmin' ? 7 : 6} className="px-8 py-10 text-center text-gray-400 font-medium">No payment history found</td></tr>
              ) : (
                payments?.map((payment) => (
                  <tr key={payment.id} className="hover:bg-gray-50/50 transition-colors group">
                    {user?.role === 'SuperAdmin' && (
                      <td className="px-8 py-5 text-sm text-brand-dark font-bold">
                        {payment.user?.organization_name || payment.user?.name}
                      </td>
                    )}
                    <td className="px-8 py-5 font-bold text-brand-dark">{payment.plan?.name}</td>
                    <td className="px-8 py-5 text-sm text-brand-deep font-bold">${payment.amount.toFixed(2)}</td>
                    <td className="px-8 py-5 text-sm text-brand-deep font-medium">{payment.payment_method}</td>
                    <td className="px-8 py-5 text-sm text-brand-deep font-medium">
                      {new Date(payment.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </td>
                    <td className="px-8 py-5">
                      <span className="inline-flex items-center space-x-1 text-[10px] font-black text-brand-medium bg-brand-pale/40 px-3 py-1 rounded-lg uppercase tracking-widest">
                        <CheckCircle size={12} />
                        <span>{payment.status}</span>
                      </span>
                    </td>
                    <td className="px-8 py-5 text-[10px] font-black font-mono text-gray-400 uppercase tracking-tighter">{payment.transaction_id}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Upgrade Modal */}
      {isUpgradeModalOpen && (
        <div className="fixed inset-0 bg-brand-dark/40 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-300">
          <div className="bg-white rounded-[3rem] shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-y-auto border border-gray-100">
            <div className="p-8 border-b border-gray-50 flex justify-between items-center sticky top-0 bg-white/90 backdrop-blur-md z-10">
              <h3 className="text-2xl font-black text-brand-dark tracking-tight">Choose Your Plan</h3>
              <button onClick={() => setIsUpgradeModalOpen(false)} className="p-2 hover:bg-gray-50 rounded-xl transition-colors text-gray-400 hover:text-brand-dark">
                <X size={28} />
              </button>
            </div>
            <div className="p-10">
              {plansLoading ? (
                <div className="text-center py-20 text-gray-400 font-medium">Loading available plans...</div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                  {plans?.map((plan) => (
                    <div key={plan.id} className="border-2 border-gray-50 bg-gray-50/30 rounded-[2.5rem] p-10 flex flex-col hover:border-brand-medium hover:bg-white hover:shadow-2xl transition-all duration-500 group">
                      <h4 className="text-xs font-black text-brand-medium mb-4 uppercase tracking-[0.2em]">{plan.name}</h4>
                      <div className="mb-8">
                        <span className="text-5xl font-black text-brand-dark">${plan.price}</span>
                        <span className="text-brand-deep font-bold text-lg opacity-50"> / {plan.billing_cycle}</span>
                      </div>
                      <ul className="space-y-5 mb-12 flex-1">
                         <li className="flex items-center space-x-3 text-brand-deep font-bold text-sm">
                            <div className="w-5 h-5 bg-brand-pale/50 rounded-full flex items-center justify-center">
                               <CheckCircle size={14} className="text-brand-medium" />
                            </div>
                            <span>Up to {plan.max_members} members</span>
                         </li>
                         <li className="flex items-center space-x-3 text-brand-deep font-bold text-sm">
                            <div className="w-5 h-5 bg-brand-pale/50 rounded-full flex items-center justify-center">
                               <CheckCircle size={14} className="text-brand-medium" />
                            </div>
                            <span>{plan.duration_days} days access</span>
                         </li>
                         <li className="flex items-center space-x-3 text-brand-deep font-bold text-sm">
                            <div className="w-5 h-5 bg-brand-pale/50 rounded-full flex items-center justify-center">
                               <CheckCircle size={14} className="text-brand-medium" />
                            </div>
                            <span>{plan.type} platform support</span>
                         </li>
                      </ul>
                      <button
                        onClick={() => upgradeMutation.mutate(plan.id)}
                        disabled={upgradeMutation.isPending}
                        className="w-full py-5 px-6 bg-brand-medium text-white rounded-[1.5rem] font-black text-lg hover:bg-brand-light transition-all shadow-xl shadow-brand-medium/20 disabled:opacity-50"
                      >
                        {upgradeMutation.isPending ? 'Processing...' : 'Get Started'}
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Payments;
