import React, { useState } from 'react';
import { X, Sparkles, CheckCircle2, ShieldCheck, ArrowRight } from 'lucide-react';
import { useMatrimonyLanguage } from '../../../context/MatrimonyLanguageContext';
import { useMatrimony } from '../../../context/MatrimonyContext';
import { useMatrimonyAuth } from '../../../context/MatrimonyAuthContext';
import { PaymentMethod } from '../../../types/matrimonyTypes';

interface UpgradeSubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedPlanId?: string;
  onSuccessPayment?: (invoiceId: string) => void;
}

export const UpgradeSubscriptionModal: React.FC<UpgradeSubscriptionModalProps> = ({
  isOpen,
  onClose,
  selectedPlanId = 'standard',
  onSuccessPayment,
}) => {
  const { lang } = useMatrimonyLanguage();
  const { subscriptionPlans = [], upgradeSubscription } = useMatrimony();
  const { currentUser } = useMatrimonyAuth();

  const [activePlanId, setActivePlanId] = useState<string>(selectedPlanId);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('bkash');
  const [transactionId, setTransactionId] = useState('TRX-98837194');
  const [loading, setLoading] = useState(false);
  const [completedInvoiceId, setCompletedInvoiceId] = useState<string | null>(null);

  if (!isOpen) return null;

  const currentPlan = subscriptionPlans.find(p => p.id === activePlanId) || subscriptionPlans[1];

  const handlePay = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      const inv = upgradeSubscription(activePlanId, paymentMethod, transactionId);
      setLoading(false);
      setCompletedInvoiceId(inv.id);
      onSuccessPayment?.(inv.id);
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-xl w-full shadow-2xl overflow-hidden border border-slate-200 animate-in zoom-in-95">
        {/* Header */}
        <div className="bg-slate-900 text-white p-6 pb-4 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-400" />
            <h3 className="text-lg font-bold font-serif">
              {lang === 'bn' ? 'মেম্বারশিপ প্যাকেজ আপগ্রেড' : 'Upgrade Membership'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {completedInvoiceId ? (
          <div className="p-8 text-center space-y-4">
            <div className="w-14 h-14 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h4 className="text-xl font-bold font-serif text-slate-900">
              {lang === 'bn' ? 'পেমেন্ট সফলভাবে সম্পন্ন হয়েছে!' : 'Payment Completed Successfully!'}
            </h4>
            <p className="text-xs sm:text-sm text-slate-600">
              {lang === 'bn'
                ? `আপনার অ্যাকাউন্টটি ${currentPlan.nameBn} এ সফলভাবে উন্নীত করা হয়েছে।`
                : `Your membership has been upgraded to ${currentPlan.nameEn}.`}
            </p>
            <div className="pt-2 flex justify-center gap-2">
              <button
                onClick={onClose}
                className="px-6 py-2.5 rounded-xl bg-rose-700 hover:bg-rose-800 text-white font-bold text-xs"
              >
                {lang === 'bn' ? 'ঠিক আছে' : 'Got it'}
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handlePay} className="p-6 space-y-6 text-xs sm:text-sm">
            {/* Plan Selector */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2 uppercase tracking-wider">
                {lang === 'bn' ? 'প্যাকেজ নির্বাচন করুন:' : 'Select Plan:'}
              </label>
              <div className="grid grid-cols-2 gap-3">
                {subscriptionPlans.filter(p => p.id !== 'free').map(p => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setActivePlanId(p.id)}
                    className={`p-4 rounded-2xl border text-left transition ${
                      activePlanId === p.id
                        ? 'border-rose-700 bg-rose-50/70 ring-2 ring-rose-200'
                        : 'border-slate-200 bg-slate-50'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-slate-900 text-sm font-serif">
                        {lang === 'bn' ? p.nameBn : p.nameEn}
                      </span>
                      {p.isPopular && (
                        <span className="text-[9px] bg-amber-500 text-slate-950 font-bold px-1.5 py-0.2 rounded">
                          VIP
                        </span>
                      )}
                    </div>
                    <p className="text-base font-extrabold text-rose-700 font-serif mt-1">
                      ৳ {(p.priceBdt || 0).toLocaleString()}
                    </p>
                    <p className="text-[10px] text-slate-500 mt-0.5">{p.durationMonths} মাস মেয়াদ</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Payment Method Selector */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2 uppercase tracking-wider">
                {lang === 'bn' ? 'পেমেন্ট মেথড (বাংলাদেশ গেটওয়ে):' : 'Payment Gateway:'}
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'bkash', name: 'bKash', color: 'bg-pink-50 border-pink-200 text-pink-700' },
                  { id: 'nagad', name: 'Nagad', color: 'bg-orange-50 border-orange-200 text-orange-700' },
                  { id: 'rocket', name: 'Rocket', color: 'bg-purple-50 border-purple-200 text-purple-700' },
                ].map(gw => (
                  <button
                    key={gw.id}
                    type="button"
                    onClick={() => setPaymentMethod(gw.id as PaymentMethod)}
                    className={`py-3 px-2 rounded-xl border text-center font-bold text-xs transition ${
                      paymentMethod === gw.id
                        ? 'border-rose-700 bg-rose-900 text-white shadow-xs'
                        : `${gw.color} hover:bg-slate-100`
                    }`}
                  >
                    {gw.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Merchant Account Details */}
            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 text-xs space-y-1">
              <p className="text-slate-600">
                আমাদের <strong>{paymentMethod.toUpperCase()} Merchant No:</strong>{' '}
                <span className="font-mono font-bold text-rose-700">01813-817167</span> (Make Payment)
              </p>
              <p className="text-[11px] text-slate-500">
                পেমেন্ট সম্পন্ন করার পর প্রাপ্ত ট্রানজেকশন আইডি নিচে প্রবেশ করান।
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {lang === 'bn' ? 'ট্রানজেকশন আইডি (TrxID)' : 'Transaction ID (TrxID)'}
              </label>
              <input
                type="text"
                required
                value={transactionId}
                onChange={e => setTransactionId(e.target.value)}
                placeholder="e.g. 9J83KX91A"
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono text-slate-900"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-rose-700 hover:bg-rose-800 text-white font-bold text-xs sm:text-sm shadow-md shadow-rose-700/20 transition flex items-center justify-center gap-2"
            >
              {loading ? (
                <span>যাচাই করা হচ্ছে...</span>
              ) : (
                <>
                  <span>৳ {currentPlan.priceBdt} টাকা পরিশোধ নিশ্চিত করুন</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
