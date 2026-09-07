import React, { useState } from 'react';
import {
  ShieldCheck, Heart, DollarSign, Users, Plus,
  Search, Filter, CheckCircle2, XCircle, FileText,
  Calendar, Download, Edit3, Trash2, ArrowUpRight, Lock
} from 'lucide-react';
import { SYF_FEATURED_CAMPAIGNS, SYF_6_CAUSES } from '../../data/sajedaCharityData';
import { EmergencyAppeal, VolunteerRegistration, DonationRecord } from '../../types/donationTypes';

export const SajedaAdminPortal: React.FC = () => {
  const [activeAdminTab, setActiveAdminTab] = useState<'overview' | 'donations' | 'campaigns' | 'volunteers' | 'audit'>('overview');
  
  // Realtime state for campaigns
  const [campaignList, setCampaignList] = useState<EmergencyAppeal[]>(SYF_FEATURED_CAMPAIGNS);
  const [showAddCampaignModal, setShowAddCampaignModal] = useState(false);
  const [newCampTitle, setNewCampTitle] = useState('');
  const [newCampTarget, setNewCampTarget] = useState(500000);
  const [newCampLocation, setNewCampLocation] = useState('সিলেট');

  // Realtime volunteers state
  const [volunteers, setVolunteers] = useState<VolunteerRegistration[]>([
    {
      id: 'vol_1',
      volunteerId: 'SYF-VOL-2026-1011',
      fullName: 'তানভীর আহমেদ',
      mobile: '01711000111',
      email: 'tanvir@gmail.com',
      address: 'মিরপুর, ঢাকা',
      district: 'ঢাকা',
      occupation: 'বিশ্ববিদ্যালয় শিক্ষার্থী',
      skills: ['লজিস্টিকস ও ত্রাণ বিতরণ'],
      preferredActivity: 'দুর্যোগ ও জরুরি খাদ্য বিতরণ',
      availability: 'weekends',
      status: 'approved',
      joinedAt: '২০২৬-০৮-১০',
      hoursContributed: 24,
      activitiesCount: 3
    },
    {
      id: 'vol_2',
      volunteerId: 'SYF-VOL-2026-1012',
      fullName: 'নুসরাত জাহান',
      mobile: '01811223344',
      email: 'nusrat@gmail.com',
      address: 'হালিশহর, চট্টগ্রাম',
      district: 'চট্টগ্রাম',
      occupation: 'এমবিবিএস ইন্টার্ন ডাক্তার',
      skills: ['প্রাথমিক চিকিৎসা ও স্বাস্থ্যসেবা'],
      preferredActivity: 'ফ্রি মেডিকেল ও রক্তদান ক্যাম্প',
      availability: 'emergency_only',
      status: 'pending',
      joinedAt: '২০২৬-০৮-২০',
      hoursContributed: 0,
      activitiesCount: 0
    }
  ]);

  // Demo Live Donations State
  const [donations, setDonations] = useState<DonationRecord[]>([
    {
      id: 'don_1',
      receiptNumber: 'SYF-DON-998811',
      donorName: 'ইঞ্জিনিয়ার মোস্তফা কামাল',
      donorPhone: '01712345678',
      donorDistrict: 'ঢাকা',
      isAnonymous: false,
      amount: 25000,
      currency: 'BDT',
      donationFrequency: 'one_time',
      donationType: 'zakat',
      causeId: 'flood',
      paymentMethod: 'bkash',
      transactionId: 'TRX99881122',
      paymentStatus: 'completed',
      donatedAt: '2026-08-27T09:00:00Z',
      donatedAtBn: '২৭ আগস্ট ২০২৬, সকাল ০৯:০০'
    },
    {
      id: 'don_2',
      receiptNumber: 'SYF-DON-998812',
      donorName: 'গোপন শুভাকাঙ্ক্ষী (Anonymous)',
      donorPhone: '01899887766',
      donorDistrict: 'সিলেট',
      isAnonymous: true,
      amount: 10000,
      currency: 'BDT',
      donationFrequency: 'one_time',
      donationType: 'general',
      causeId: 'education',
      paymentMethod: 'card',
      transactionId: 'SSL-44883311',
      paymentStatus: 'completed',
      donatedAt: '2026-08-27T10:15:00Z',
      donatedAtBn: '২৭ আগস্ট ২০২৬, সকাল ১০:১৫'
    },
    {
      id: 'don_3',
      receiptNumber: 'SYF-DON-998813',
      donorName: 'বেগম রোকেয়া ট্রাস্ট',
      donorPhone: '01911445566',
      donorDistrict: 'চট্টগ্রাম',
      isAnonymous: false,
      amount: 50000,
      currency: 'BDT',
      donationFrequency: 'monthly',
      donationType: 'zakat',
      causeId: 'healthcare',
      paymentMethod: 'bank_transfer',
      transactionId: 'EBL-TRX-5566',
      paymentStatus: 'completed',
      donatedAt: '2026-08-27T11:45:00Z',
      donatedAtBn: '২৭ আগস্ট ২০২৬, সকাল ১১:৪৫'
    }
  ]);

  const totalCollectedToday = donations.reduce((sum, d) => sum + d.amount, 0);

  const handleApproveVolunteer = (id: string) => {
    setVolunteers(prev => prev.map(v => v.id === id ? { ...v, status: 'approved' } : v));
  };

  const handleRejectVolunteer = (id: string) => {
    setVolunteers(prev => prev.map(v => v.id === id ? { ...v, status: 'rejected' } : v));
  };

  const handleAddCampaign = (e: React.FormEvent) => {
    e.preventDefault();
    const newCamp: EmergencyAppeal = {
      id: `camp_${Date.now()}`,
      title: newCampTitle,
      titleBn: newCampTitle,
      category: 'flood_relief',
      categoryBn: 'জরুরি ত্রাণ',
      patientOrCauseName: newCampTitle,
      storyBn: 'মাঠপর্যায়ে জরুরি ভিত্তিতে ত্রাণ ও মানবিক সহায়তা কার্যক্রম চলমান।',
      targetAmount: newCampTarget,
      raisedAmount: 0,
      donorCount: 0,
      isEmergency: true,
      imageUrl: 'https://images.unsplash.com/photo-1547082299-de196ea013d6?auto=format&fit=crop&q=80&w=800',
      hospitalOrLocation: newCampLocation,
      locationBn: newCampLocation,
      daysLeft: 30
    };

    setCampaignList([newCamp, ...campaignList]);
    setShowAddCampaignModal(false);
    setNewCampTitle('');
  };

  return (
    <div className="py-10 bg-slate-100 min-h-screen text-slate-900 text-left">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-6">
        
        {/* Admin Top Banner */}
        <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-600 flex items-center justify-center text-white">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-black">সাজেদা ইয়ুথ ফাউন্ডেশন - সেন্ট্রাল কন্ট্রোল প্যানেল</h1>
                <span className="bg-emerald-500/20 text-emerald-300 font-mono text-[10px] px-2 py-0.5 rounded border border-emerald-500/30">
                  SUPER ADMIN
                </span>
              </div>
              <p className="text-xs text-slate-400 font-medium">সরাসরি অনুদান খতিয়ান, ক্যাম্পেইন পরিচালনা ও ভলান্টিয়ার অনুমোদন ড্যাশবোর্ড</p>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex flex-wrap items-center gap-1.5 bg-slate-800 p-1.5 rounded-2xl border border-slate-700">
            <button
              onClick={() => setActiveAdminTab('overview')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                activeAdminTab === 'overview' ? 'bg-emerald-600 text-white' : 'text-slate-300 hover:text-white'
              }`}
            >
              ওভারভিউ
            </button>
            <button
              onClick={() => setActiveAdminTab('donations')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                activeAdminTab === 'donations' ? 'bg-emerald-600 text-white' : 'text-slate-300 hover:text-white'
              }`}
            >
              অনুদান খতিয়ান ({donations.length})
            </button>
            <button
              onClick={() => setActiveAdminTab('campaigns')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                activeAdminTab === 'campaigns' ? 'bg-emerald-600 text-white' : 'text-slate-300 hover:text-white'
              }`}
            >
              ক্যাম্পেইন ম্যানেজার ({campaignList.length})
            </button>
            <button
              onClick={() => setActiveAdminTab('volunteers')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                activeAdminTab === 'volunteers' ? 'bg-emerald-600 text-white' : 'text-slate-300 hover:text-white'
              }`}
            >
              ভলান্টিয়ার আবেদন ({volunteers.length})
            </button>
          </div>
        </div>

        {/* Tab 1: OVERVIEW */}
        {activeAdminTab === 'overview' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-1">
                <span className="text-xs text-slate-500 font-bold">আজকের সংগৃহীত অনুদান</span>
                <div className="text-2xl font-black text-emerald-700 font-mono">
                  ৳{(totalCollectedToday || 0).toLocaleString('bn-BD')}
                </div>
                <span className="text-[11px] text-emerald-700 font-semibold block">✓ ৩টি সফল লেনদেন</span>
              </div>

              <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-1">
                <span className="text-xs text-slate-500 font-bold">মোট নিবন্ধিত ভলান্টিয়ার</span>
                <div className="text-2xl font-black text-blue-700 font-mono">
                  ১৮২ জন
                </div>
                <span className="text-[11px] text-slate-500 block">১টি আবেদন অপেক্ষমান</span>
              </div>

              <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-1">
                <span className="text-xs text-slate-500 font-bold">চলমান ক্যাম্পেইন সংখ্যা</span>
                <div className="text-2xl font-black text-amber-700 font-mono">
                  {campaignList.length} টি
                </div>
                <span className="text-[11px] text-amber-700 font-semibold block">২টি লক্ষ্যমাত্রার ৮০%+ পূর্ণ</span>
              </div>

              <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-1">
                <span className="text-xs text-slate-500 font-bold">চলতি মাসের সাহায্য বণ্টন</span>
                <div className="text-2xl font-black text-purple-700 font-mono">
                  ৳ ৭,২০,০০০
                </div>
                <span className="text-[11px] text-purple-700 font-semibold block">৮৪.৭% সামগ্রিক বরাদ্দ</span>
              </div>
            </div>

            {/* Recent Donations Snapshot */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-black text-slate-900">সাম্প্রতিক সংগৃহীত অনুদান তালিকা (Live Ledger)</h3>
                <button
                  onClick={() => setActiveAdminTab('donations')}
                  className="text-xs font-bold text-emerald-700 hover:underline"
                >
                  সব দেখুন →
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-500 font-bold bg-slate-50">
                      <th className="p-2.5">রসিদ নম্বর</th>
                      <th className="p-2.5">দাতার নাম</th>
                      <th className="p-2.5">পরিমাণ</th>
                      <th className="p-2.5">খাত</th>
                      <th className="p-2.5">মেথড</th>
                      <th className="p-2.5">সময়</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium">
                    {donations.map((d) => (
                      <tr key={d.id} className="hover:bg-slate-50">
                        <td className="p-2.5 font-mono font-bold text-slate-900">{d.receiptNumber}</td>
                        <td className="p-2.5">{d.donorName}</td>
                        <td className="p-2.5 font-mono font-black text-emerald-700">৳{(d?.amount || 0).toLocaleString('bn-BD')}</td>
                        <td className="p-2.5">{d.causeId}</td>
                        <td className="p-2.5 font-mono uppercase">{d.paymentMethod}</td>
                        <td className="p-2.5 text-slate-500">{d.donatedAtBn}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: DONATIONS FULL LEDGER */}
        {activeAdminTab === 'donations' && (
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <h3 className="text-base font-black text-slate-900">অনুদানের কেন্দ্রীয় লেজার ও ডিজিটাল অডিট বুক</h3>
              <button
                onClick={() => window.print()}
                className="px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                <span>লেজার রিপোর্ট এক্সপোর্ট (CSV / PDF)</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500 font-bold bg-slate-50">
                    <th className="p-3">রসিদ নং</th>
                    <th className="p-3">দাতার নাম ও যোগাযোগ</th>
                    <th className="p-3">জেলা</th>
                    <th className="p-3">অনুদানের ধরন</th>
                    <th className="p-3">পরিমাণ (BDT)</th>
                    <th className="p-3">পেমেন্ট মেথড ও TrxID</th>
                    <th className="p-3">স্ট্যাটাস</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {donations.map((d) => (
                    <tr key={d.id} className="hover:bg-slate-50">
                      <td className="p-3 font-mono font-bold text-slate-900">{d.receiptNumber}</td>
                      <td className="p-3">
                        <div className="font-bold text-slate-900">{d.donorName}</div>
                        <div className="text-[11px] text-slate-500 font-mono">{d.donorPhone}</div>
                      </td>
                      <td className="p-3 text-slate-600">{d.donorDistrict}</td>
                      <td className="p-3">
                        <span className="font-bold text-emerald-800">{d.donationType === 'zakat' ? 'যাকাত' : 'সাধারণ'}</span>
                        <span className="text-slate-400 text-[10px] block font-mono">({d.donationFrequency})</span>
                      </td>
                      <td className="p-3 font-mono font-black text-emerald-700 text-sm">
                        ৳{(d?.amount || 0).toLocaleString('bn-BD')}
                      </td>
                      <td className="p-3 font-mono text-[11px]">
                        <span className="uppercase font-bold text-slate-900">{d.paymentMethod}</span>
                        <span className="text-slate-500 block">{d.transactionId}</span>
                      </td>
                      <td className="p-3">
                        <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                          ✓ সম্পন্ন
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 3: CAMPAIGNS MANAGER */}
        {activeAdminTab === 'campaigns' && (
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-black text-slate-900">ক্যাম্পেইন পরিচালনা ও নতুন ক্যাম্পেইন তৈরি</h3>
              <button
                onClick={() => setShowAddCampaignModal(true)}
                className="px-4 py-2.5 rounded-xl bg-emerald-700 text-white text-xs font-black hover:bg-emerald-800 flex items-center gap-1.5 shadow-xs"
              >
                <Plus className="w-4 h-4" />
                <span>নতুন ক্যাম্পেইন যোগ করুন</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {campaignList.map((c) => (
                <div key={c.id} className="bg-slate-50 p-4 rounded-2xl border border-slate-200 flex gap-4 items-center">
                  <img src={c.imageUrl} alt={c.titleBn} className="w-20 h-20 rounded-xl object-cover shrink-0" />
                  <div className="space-y-1 overflow-hidden flex-1">
                    <h4 className="font-bold text-xs sm:text-sm text-slate-900 truncate">{c.titleBn}</h4>
                    <p className="text-[11px] text-slate-500">{c.locationBn} • লক্ষ্যমাত্রা: ৳{(c?.targetAmount || 0).toLocaleString('bn-BD')}</p>
                    <div className="flex items-center justify-between text-[11px] font-mono font-bold text-emerald-700">
                      <span>সংগৃহীত: ৳{(c?.raisedAmount || 0).toLocaleString('bn-BD')}</span>
                      <span>{c.donorCount} জন দাতা</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 4: VOLUNTEERS MANAGER */}
        {activeAdminTab === 'volunteers' && (
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-base font-black text-slate-900">স্বেচ্ছাসেবক আবেদনপত্র ও অনুমোদন তালিকা</h3>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500 font-bold bg-slate-50">
                    <th className="p-3">আইডি</th>
                    <th className="p-3">নাম ও পেশা</th>
                    <th className="p-3">যোগাযোগ</th>
                    <th className="p-3">পছন্দের কাজ</th>
                    <th className="p-3">স্ট্যাটাস</th>
                    <th className="p-3 text-right">পদক্ষেপ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {volunteers.map((v) => (
                    <tr key={v.id} className="hover:bg-slate-50">
                      <td className="p-3 font-mono font-bold text-slate-900">{v.volunteerId}</td>
                      <td className="p-3">
                        <div className="font-bold text-slate-900">{v.fullName}</div>
                        <div className="text-[11px] text-slate-500">{v.occupation} ({v.district})</div>
                      </td>
                      <td className="p-3 font-mono text-slate-600">
                        <div>{v.mobile}</div>
                        <div className="text-[10px] text-slate-400">{v.email}</div>
                      </td>
                      <td className="p-3 text-emerald-800 font-semibold">{v.preferredActivity}</td>
                      <td className="p-3">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          v.status === 'approved'
                            ? 'bg-emerald-100 text-emerald-800'
                            : v.status === 'rejected'
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}>
                          {v.status === 'approved' ? '✓ অনুমোদিত' : v.status === 'rejected' ? '✕ বাতিল' : '⏳ অপেক্ষমান'}
                        </span>
                      </td>
                      <td className="p-3 text-right">
                        {v.status === 'pending' && (
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => handleApproveVolunteer(v.id)}
                              className="px-2.5 py-1 rounded-lg bg-emerald-600 text-white text-[11px] font-bold hover:bg-emerald-700"
                            >
                              অনুমোদন
                            </button>
                            <button
                              onClick={() => handleRejectVolunteer(v.id)}
                              className="px-2.5 py-1 rounded-lg bg-rose-100 text-rose-700 text-[11px] font-bold hover:bg-rose-200"
                            >
                              বাতিল
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>

      {/* Add Campaign Modal */}
      {showAddCampaignModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl animate-in zoom-in-95 text-left text-xs">
            <h3 className="text-base font-black text-slate-900">নতুন ক্যাম্পেইন তৈরি করুন</h3>

            <form onSubmit={handleAddCampaign} className="space-y-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">ক্যাম্পেইনের শিরোনাম *</label>
                <input
                  type="text"
                  required
                  placeholder="উদাঃ কুড়িগ্রাম শীতার্ত মানুষের পাশে দাঁড়ান"
                  value={newCampTitle}
                  onChange={(e) => setNewCampTitle(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">লক্ষ্যমাত্রা (BDT) *</label>
                <input
                  type="number"
                  required
                  value={newCampTarget}
                  onChange={(e) => setNewCampTarget(Number(e.target.value))}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 font-mono"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">অবস্থান / জেলা *</label>
                <input
                  type="text"
                  required
                  value={newCampLocation}
                  onChange={(e) => setNewCampLocation(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddCampaignModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-bold"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-700 text-white font-bold hover:bg-emerald-800"
                >
                  সংরক্ষণ করুন
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
