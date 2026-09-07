import React from 'react';
import { useTranslation } from '../../locales/i18nContext';
import {
  ShieldCheck, Lock, Smartphone, Laptop, Globe,
  AlertTriangle, CheckCircle, Clock, Eye, Key
} from 'lucide-react';
import { AuditLogEntry } from '../../types/somitiTypes';

interface SecurityAuditViewProps {
  auditLogs: AuditLogEntry[];
}

export const SecurityAuditView: React.FC<SecurityAuditViewProps> = ({
  auditLogs
}) => {
  const { isBn } = useTranslation();

  return (
    <div className="space-y-6">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-5 rounded-3xl border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
            <h3 className="text-base font-black text-slate-900">
              {isBn ? 'নিরাপত্তা, রোল পারমিশন ও অডিট ট্রেইল' : 'Security, RBAC Matrix & Tamper-Proof Audit Trail'}
            </h3>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            প্রতিটি লেনদেন ও পরিবর্তনের রিয়েল-টাইম লগ, আইপি ট্র্যাকিং ও এনক্রিপশন স্ট্যাটাস
          </p>
        </div>

        <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 px-3.5 py-1.5 rounded-xl text-xs font-black text-emerald-900">
          <Lock className="w-4 h-4 text-emerald-700" />
          <span>256-Bit SSL Enforced</span>
        </div>
      </div>

      {/* 3 Security Pillars Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
        
        <div className="p-4 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="font-black text-slate-800 text-sm">2FA দ্বি-স্তরীয় প্রমাণীকরণ</span>
            <Smartphone className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-slate-500 leading-relaxed">
            সকল অ্যাডমিন, ম্যানেজার ও ক্যাশিয়ারের জন্য OTP / 2FA লগইন সক্রিয় করা হয়েছে।
          </p>
          <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold inline-block text-[10px]">
            সক্রিয় (Enforced)
          </span>
        </div>

        <div className="p-4 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="font-black text-slate-800 text-sm">IP ও ডিভাইস রেস্ট্রিকশন</span>
            <Laptop className="w-4 h-4 text-indigo-600" />
          </div>
          <p className="text-slate-500 leading-relaxed">
            শাখা ক্যাশ কাউন্টার ও ভল্ট শুধুমাত্র অনুমোদিত ম্যাক অ্যাড্রেস ও আইপি থেকে অ্যাক্সেসযোগ্য।
          </p>
          <span className="px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-800 font-bold inline-block text-[10px]">
            জিও-লক সক্রিয়
          </span>
        </div>

        <div className="p-4 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="font-black text-slate-800 text-sm">অ্যান্টি-ফ্রড লেজার গার্ড</span>
            <ShieldCheck className="w-4 h-4 text-purple-600" />
          </div>
          <p className="text-slate-500 leading-relaxed">
            কোনো পূর্ববর্তী ভাউচার পরিবর্তন বা ব্যাকডেট এন্ট্রি প্রচেষ্টা স্বয়ংক্রিয় লক ও সতর্কবার্তা দেয়।
          </p>
          <span className="px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 font-bold inline-block text-[10px]">
            জিরো-টলারেন্স প্রোটেকশন
          </span>
        </div>

      </div>

      {/* Live Tamper-Proof Audit Trail Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden space-y-3">
        <div className="p-4 bg-slate-900 text-white flex justify-between items-center text-xs">
          <h4 className="font-black flex items-center gap-2 text-sm">
            <Clock className="w-4 h-4 text-emerald-400" />
            <span>লাইভ সিস্টেম অডিট লগ (Live Security Audit Trail)</span>
          </h4>
          <span className="text-[10px] text-slate-400 font-mono">Total {auditLogs.length} Events Logged</span>
        </div>

        <div className="overflow-x-auto p-2">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-700 font-black border-y border-slate-200">
              <tr>
                <th className="p-3">অ্যাকশন ও বিভাগ</th>
                <th className="p-3">ব্যবহারকারী ও রোল</th>
                <th className="p-3">বিবরণ (Audit Event)</th>
                <th className="p-3 font-mono">IP Address</th>
                <th className="p-3">সময় ও তারিখ</th>
                <th className="p-3 text-center">স্ট্যাটাস</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {auditLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50 font-medium">
                  <td className="p-3">
                    <span className="font-black text-slate-900 block">{log.action}</span>
                    <span className="text-[10px] text-indigo-700 font-bold">{log.entityType || 'SYSTEM'}</span>
                  </td>
                  <td className="p-3">
                    <span className="font-bold text-slate-800 block">{log.userName}</span>
                    <span className="text-[10px] text-slate-400">{log.userRole}</span>
                  </td>
                  <td className="p-3 text-slate-600 max-w-sm">{log.details}</td>
                  <td className="p-3 font-mono text-[11px] text-slate-500">{log.ipAddress}</td>
                  <td className="p-3 text-slate-500 whitespace-nowrap">{log.timestamp}</td>
                  <td className="p-3 text-center">
                    <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black">
                      PASSED
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>

    </div>
  );
};
