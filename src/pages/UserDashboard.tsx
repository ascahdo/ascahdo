import React, { useState } from 'react';
import { useTranslation } from '../locales/i18nContext';
import { useAuth } from '../context/AuthContext';
import { User, Heart, HeartPulse, Landmark, BookOpen, Shield, Download, CheckCircle, Clock } from 'lucide-react';

interface UserDashboardProps {
  onNavigate: (view: string) => void;
  onOpenDonationModal: () => void;
  onOpenBloodSOS: () => void;
}

export const UserDashboard: React.FC<UserDashboardProps> = ({
  onNavigate,
  onOpenDonationModal,
  onOpenBloodSOS
}) => {
  const { isBn } = useTranslation();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'profile' | 'donations' | 'blood' | 'loans' | 'courses'>('profile');

  if (!user) {
    return (
      <div className="max-w-md mx-auto my-20 p-8 bg-white rounded-2xl border border-slate-200 text-center space-y-4">
        <p className="text-slate-600 text-sm">{isBn ? 'ড্যাশবোর্ড দেখতে অনুগ্রহ করে লগইন করুন।' : 'Please login to view your user dashboard.'}</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header Profile Card */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-emerald-600 flex items-center justify-center text-2xl font-black text-white shadow-lg">
            {user.fullName.charAt(0)}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-bold">{user.fullName}</h2>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-bold px-2.5 py-0.5 rounded-full uppercase">
                {user.role}
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-1">
              {user.phone} • {user.email || (isBn ? 'ইমেইল সংযুক্ত নেই' : 'No email')} • {user.district}
            </p>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={onOpenBloodSOS}
            className="bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow transition"
          >
            {isBn ? 'রক্তের আবেদন' : 'Blood Request'}
          </button>
          <button
            onClick={() => onOpenDonationModal()}
            className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow transition"
          >
            {isBn ? 'অনুদান দিন' : 'Donate'}
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 gap-6 text-xs sm:text-sm font-bold overflow-x-auto">
        <button
          onClick={() => setActiveTab('profile')}
          className={`pb-3 whitespace-nowrap transition ${
            activeTab === 'profile' ? 'border-b-2 border-emerald-600 text-emerald-700' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          {isBn ? 'প্রোফাইল বিবরণ' : 'Profile Info'}
        </button>
        <button
          onClick={() => setActiveTab('donations')}
          className={`pb-3 whitespace-nowrap transition ${
            activeTab === 'donations' ? 'border-b-2 border-emerald-600 text-emerald-700' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          {isBn ? 'অনুদান হিস্ট্রি ও রসিদ' : 'Donation History & Receipts'}
        </button>
        <button
          onClick={() => setActiveTab('loans')}
          className={`pb-3 whitespace-nowrap transition ${
            activeTab === 'loans' ? 'border-b-2 border-emerald-600 text-emerald-700' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          {isBn ? 'সঞ্চয় ও ঋণ হিস্ট্রি' : 'Savings & Loans'}
        </button>
        <button
          onClick={() => setActiveTab('courses')}
          className={`pb-3 whitespace-nowrap transition ${
            activeTab === 'courses' ? 'border-b-2 border-emerald-600 text-emerald-700' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          {isBn ? 'এনরোলকৃত কোর্স' : 'My Courses'}
        </button>
      </div>

      {/* Tab 1: Profile */}
      {activeTab === 'profile' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4 max-w-2xl">
          <h3 className="font-bold text-base text-slate-900">{isBn ? 'ব্যক্তিগত পরিচিতি ও নিরাপত্তা' : 'Account Details'}</h3>
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div className="p-3 bg-slate-50 rounded-xl">
              <span className="text-slate-400 font-medium">{isBn ? 'ইউজারনেম' : 'Username'}</span>
              <p className="font-bold text-slate-800 mt-0.5">{user.username}</p>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl">
              <span className="text-slate-400 font-medium">{isBn ? 'রক্তের গ্রুপ' : 'Blood Group'}</span>
              <p className="font-bold text-rose-600 mt-0.5">{user.bloodGroup || 'Not Specified'}</p>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl">
              <span className="text-slate-400 font-medium">{isBn ? 'জেলা' : 'District'}</span>
              <p className="font-bold text-slate-800 mt-0.5">{user.district || 'Dhaka'}</p>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl">
              <span className="text-slate-400 font-medium">{isBn ? 'উপজেলা' : 'Upazila'}</span>
              <p className="font-bold text-slate-800 mt-0.5">{user.upazila || 'Dhanmondi'}</p>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Donations */}
      {activeTab === 'donations' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
          <h3 className="font-bold text-base text-slate-900">{isBn ? 'আমার অনুদানের হিসাব ও ডিজিটাল রসিদ' : 'My Donations Ledger'}</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase">
                  <th className="py-3 px-4">ট্রানজাকশন আইডি</th>
                  <th className="py-3 px-4">ক্যাম্পেইন</th>
                  <th className="py-3 px-4">পরিমাণ</th>
                  <th className="py-3 px-4">পেমেন্ট মাধ্যম</th>
                  <th className="py-3 px-4">তারিখ</th>
                  <th className="py-3 px-4">রসিদ ডাউনলোড</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                <tr className="hover:bg-slate-50">
                  <td className="py-3 px-4 font-mono font-bold text-slate-800">TXN-8871923</td>
                  <td className="py-3 px-4 font-bold text-slate-900">{isBn ? 'বন্যা দুর্গতদের জন্য জরুরি ত্রাণ তহবিল' : 'Flood Relief Fund'}</td>
                  <td className="py-3 px-4 font-black text-emerald-700">৳ ১,৫০০ BDT</td>
                  <td className="py-3 px-4 uppercase font-bold text-pink-600">bKash</td>
                  <td className="py-3 px-4 text-slate-500">2026-08-15</td>
                  <td className="py-3 px-4">
                    <button
                      onClick={() => alert(isBn ? 'ডিজিটাল অনুদান রসিদ ডাউনলোড হচ্ছে (PDF)...' : 'Downloading receipt PDF...')}
                      className="flex items-center gap-1 text-emerald-600 hover:text-emerald-800 font-bold"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>{isBn ? 'রসিদ (PDF)' : 'Receipt'}</span>
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: Loans */}
      {activeTab === 'loans' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
          <h3 className="font-bold text-base text-slate-900">{isBn ? 'আমার সঞ্চয় ও কিস্তি ট্র্যাকার' : 'My Somiti Loans & Savings'}</h3>
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between text-xs">
            <div>
              <p className="font-bold text-slate-900">{isBn ? 'সক্রিয় ক্ষুদ্র ঋণ: পল্ট্রি ও খামার' : 'Active Loan: Farm Expansion'}</p>
              <p className="text-slate-500">{isBn ? 'পরিশোধিত: ৳ ১২,০০০ / ৳ ৫০,০০০ | অবশিষ্ট কিস্তি: ৮ মাস' : 'Paid: ৳ 12,000 / ৳ 50,000 | 8 Mos remaining'}</p>
            </div>
            <span className="bg-emerald-100 text-emerald-800 font-bold px-2.5 py-1 rounded-full text-[10px] uppercase">
              Regular Active
            </span>
          </div>
        </div>
      )}

      {/* Tab 4: Courses */}
      {activeTab === 'courses' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
          <h3 className="font-bold text-base text-slate-900">{isBn ? 'এনরোলকৃত কারিগরি কোর্স' : 'My Enrolled Courses'}</h3>
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between text-xs">
            <div>
              <p className="font-bold text-emerald-950">{isBn ? 'প্রফেশনাল ওয়েব ডেভেলপমেন্ট ও ফ্রিল্যান্সিং' : 'Professional Web Development'}</p>
              <p className="text-slate-600">{isBn ? 'অগ্রগতি: ৬০% সম্পন্ন | পরবর্তী লাইভ ক্লাস: শনিবার রাত ৯:০০' : 'Progress: 60% completed'}</p>
            </div>
            <button
              onClick={() => onNavigate('training')}
              className="bg-emerald-600 text-white font-bold px-4 py-2 rounded-xl"
            >
              {isBn ? 'ক্লাসরুমে যান' : 'Go to Class'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
