import React, { useState } from 'react';
import {
  X, Truck, ArrowRight, ShieldCheck, Thermometer,
  AlertCircle, Check, Clock, Droplet
} from 'lucide-react';
import { BloodBankOrganization } from '../../types/bloodHubTypes';

interface BloodTransferModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (transfer: any) => void;
  organizations: BloodBankOrganization[];
  selectedBloodBankId?: string;
  isBn: boolean;
}

export const BloodTransferModal: React.FC<BloodTransferModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  organizations,
  selectedBloodBankId,
  isBn
}) => {
  const [fromBloodBankId, setFromBloodBankId] = useState(selectedBloodBankId || (organizations[0]?.id || ''));
  const [toBloodBankId, setToBloodBankId] = useState(organizations[1]?.id || '');
  const [bloodGroup, setBloodGroup] = useState<'A+' | 'A-' | 'B+' | 'B-' | 'O+' | 'O-' | 'AB+' | 'AB-'>('O+');
  const [component, setComponent] = useState<'whole_blood' | 'prbc' | 'ffp' | 'platelets'>('whole_blood');
  const [unitsCount, setUnitsCount] = useState<number>(2);
  const [courierName, setCourierName] = useState('মেডিকেল কোল্ড-চেইন এক্সপ্রেস');
  const [courierPhone, setCourierPhone] = useState('01813817167');
  const [coldBoxTemp, setColdBoxTemp] = useState('+4.0°C (Monitored Cold-Box)');
  const [purpose, setPurpose] = useState('জরুরি সংকট নিরসনে আঞ্চলিক ইন্টার-ব্যাংক ট্রান্সফার');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (fromBloodBankId === toBloodBankId) {
      setError(isBn ? 'প্রেরক ও প্রাপক ব্লাড ব্যাংক একই হতে পারবে না।' : 'Source and destination blood banks cannot be identical.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const payload = {
        fromBloodBankId,
        toBloodBankId,
        bloodGroup,
        component,
        unitsCount: Number(unitsCount),
        courierName,
        courierPhone,
        coldBoxTemp,
        purpose
      };

      const res = await fetch('/api/v1/blood-hub/transfers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        throw new Error('Failed to create blood transfer order');
      }

      const created = await res.json();
      onSuccess(created);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Transfer order failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-xl w-full shadow-2xl border border-slate-200 overflow-hidden my-6 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-blue-300">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold">
                {isBn ? 'ইন্টার-ব্যাংক ব্লাড ট্রান্সফার অর্ডার' : 'Inter-Hub Blood Unit Transfer'}
              </h3>
              <p className="text-xs text-blue-200">
                {isBn ? 'কোল্ড-চেইন নিয়ন্ত্রিত নিরাপদ রক্ত পরিবহন' : 'Cold-chain tracked inter-facility transfer'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* From -> To Blood Banks */}
          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {isBn ? 'প্রেরক ব্লাড ব্যাংক (Source Hub) *' : 'Source Blood Bank *'}
              </label>
              <select
                value={fromBloodBankId}
                onChange={(e) => setFromBloodBankId(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs sm:text-sm font-semibold text-slate-800"
              >
                {organizations.map((org) => (
                  <option key={org.id} value={org.id}>
                    {org.name} ({org.district})
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center justify-center -my-1 text-slate-400">
              <ArrowRight className="w-4 h-4" />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {isBn ? 'প্রাপক ব্লাড ব্যাংক / হাসপাতাল ইউনিট (Destination) *' : 'Destination Facility *'}
              </label>
              <select
                value={toBloodBankId}
                onChange={(e) => setToBloodBankId(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs sm:text-sm font-semibold text-slate-800"
              >
                {organizations.map((org) => (
                  <option key={org.id} value={org.id}>
                    {org.name} ({org.district})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {isBn ? 'রক্তের গ্রুপ *' : 'Blood Group *'}
              </label>
              <select
                value={bloodGroup}
                onChange={(e) => setBloodGroup(e.target.value as any)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-rose-700"
              >
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="O+">O+</option>
                <option value="O-">O-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {isBn ? 'কম্পোনেন্ট' : 'Component'}
              </label>
              <select
                value={component}
                onChange={(e) => setComponent(e.target.value as any)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm"
              >
                <option value="whole_blood">Whole Blood</option>
                <option value="prbc">PRBC</option>
                <option value="platelets">Platelets</option>
                <option value="ffp">FFP Plasma</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {isBn ? 'ব্যাগের সংখ্যা *' : 'Units Count *'}
              </label>
              <input
                type="number"
                min={1}
                max={20}
                value={unitsCount}
                onChange={(e) => setUnitsCount(Number(e.target.value))}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {isBn ? 'কুরিয়ার / বাহকের নাম' : 'Courier / Dispatcher'}
              </label>
              <input
                type="text"
                value={courierName}
                onChange={(e) => setCourierName(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {isBn ? 'বাহকের ফোন' : 'Courier Phone'}
              </label>
              <input
                type="tel"
                value={courierPhone}
                onChange={(e) => setCourierPhone(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm"
              />
            </div>
          </div>

          <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-xs flex items-center gap-2 text-blue-900">
            <Thermometer className="w-4 h-4 text-blue-600 shrink-0" />
            <span>
              {isBn
                ? 'কোল্ড-বক্স তাপমাত্রা সেন্সর সক্রিয়: +৪.০°C এ রক্ত ইউনিট সিল করা হবে।'
                : 'Cold box temperature locked at +4.0°C compliant with national standards.'}
            </span>
          </div>

          {/* Footer */}
          <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-medium text-sm hover:bg-slate-50"
            >
              {isBn ? 'বাতিল' : 'Cancel'}
            </button>

            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm transition shadow-md disabled:opacity-50 flex items-center gap-2"
            >
              {loading ? (
                <span>{isBn ? 'প্রেরণ করা হচ্ছে...' : 'Dispatching...'}</span>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  <span>{isBn ? 'ডিসপ্যাচ অর্ডার কনফার্ম করুন' : 'Dispatch Blood Transfer'}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
