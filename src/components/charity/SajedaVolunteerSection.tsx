import React, { useState } from 'react';
import {
  Users, CheckCircle2, Award, Sparkles, Send,
  ShieldCheck, Heart, User, Phone, Mail, MapPin, Briefcase, FileCheck
} from 'lucide-react';
import { VolunteerRegistration } from '../../types/donationTypes';

export const SajedaVolunteerSection: React.FC = () => {
  const [showRegForm, setShowRegForm] = useState<boolean>(false);
  const [registeredVolunteer, setRegisteredVolunteer] = useState<VolunteerRegistration | null>(null);

  // Form Fields
  const [fullName, setFullName] = useState('');
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [district, setDistrict] = useState('ঢাকা');
  const [occupation, setOccupation] = useState('ছাত্র / শিক্ষার্থী');
  const [skills, setSkills] = useState('জরুরি ত্রাণ বিতরণ ও লজিস্টিকস');
  const [preferredActivity, setPreferredActivity] = useState('দুর্যোগ ও জরুরি খাদ্য বিতরণ');
  const [availability, setAvailability] = useState<'weekends' | 'weekdays' | 'emergency_only' | 'full_time'>('weekends');
  const [emergencyContact, setEmergencyContact] = useState('');
  const [agreement, setAgreement] = useState(false);
  const [submittedMessage, setSubmittedMessage] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreement) {
      alert('অনুগ্রহ করে স্বেচ্ছাসেবা অঙ্গীকারনামা বক্সে টিক দিন।');
      return;
    }

    const randomId = Math.floor(1000 + Math.random() * 9000);
    const newVol: VolunteerRegistration = {
      id: `vol_${Date.now()}`,
      volunteerId: `SYF-VOL-2026-${randomId}`,
      fullName,
      mobile,
      email,
      address,
      district,
      occupation,
      skills: [skills],
      preferredActivity,
      preferredActivityBn: preferredActivity,
      availability,
      emergencyContact,
      status: 'approved',
      joinedAt: '২০২৬-০৮-২৭',
      certificateNumber: `SYF-CERT-VOL-${randomId}`,
      hoursContributed: 0,
      activitiesCount: 1
    };

    setRegisteredVolunteer(newVol);
    setSubmittedMessage('আপনার স্বেচ্ছাসেবী নিবন্ধন সফলভাবে সম্পন্ন হয়েছে!');
  };

  return (
    <section className="py-16 lg:py-24 bg-gradient-to-br from-teal-950 via-slate-900 to-emerald-950 text-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        
        {/* Large Emotional CTA Banner */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold">
            <Users className="w-4 h-4 text-amber-300" />
            <span>Join Our Youth Network</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
            পরিবর্তনের কারণ হয়ে উঠুন
          </h2>

          <p className="text-sm sm:text-lg text-slate-200 leading-relaxed font-medium">
            “শুধু অর্থ দিয়ে নয়—আপনার সময়, দক্ষতা ও ভালোবাসা দিয়েও একজন অসহায় মানুষের পাশে দাঁড়াতে পারেন।”
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={() => {
                setShowRegForm(true);
                setRegisteredVolunteer(null);
              }}
              className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-black px-6 sm:px-8 py-3.5 rounded-2xl shadow-xl transition transform hover:-translate-y-0.5 flex items-center gap-2 text-sm sm:text-base cursor-pointer"
            >
              <Users className="w-5 h-5" />
              <span>Become a Volunteer (স্বেচ্ছাসেবক হোন)</span>
            </button>
          </div>
        </div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto mb-8 text-left">
          <div className="bg-white/5 backdrop-blur-md p-6 rounded-3xl border border-white/10 space-y-2">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-300 flex items-center justify-center font-bold">
              <Award className="w-5 h-5" />
            </div>
            <h4 className="text-base font-black text-white">অফিসিয়াল ভলান্টিয়ার আইডি</h4>
            <p className="text-xs text-slate-300 font-medium">
              নিবন্ধনের পরপরই পাবেন সাজেদা ইয়ুথ ফাউন্ডেশনের কিউআর ভেরিফাইড ডিজিটাল আইডি কার্ড ও সার্টিফিকেট।
            </p>
          </div>

          <div className="bg-white/5 backdrop-blur-md p-6 rounded-3xl border border-white/10 space-y-2">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-300 flex items-center justify-center font-bold">
              <Sparkles className="w-5 h-5" />
            </div>
            <h4 className="text-base font-black text-white">মাঠপর্যায়ে কাজের অভিজ্ঞতা</h4>
            <p className="text-xs text-slate-300 font-medium">
              বন্যা ত্রাণ, ফ্রি মেডিকেল ক্যাম্প ও সুবিধাবঞ্চিত শিশুদের পাঠশালায় সরাসরি যুক্ত হয়ে নেতৃত্ব বিকাশের সুযোগ।
            </p>
          </div>

          <div className="bg-white/5 backdrop-blur-md p-6 rounded-3xl border border-white/10 space-y-2">
            <div className="w-10 h-10 rounded-xl bg-teal-500/20 text-teal-300 flex items-center justify-center font-bold">
              <Heart className="w-5 h-5" />
            </div>
            <h4 className="text-base font-black text-white">মানবিক তৃপ্তি ও সদকায়ে জারিয়া</h4>
            <p className="text-xs text-slate-300 font-medium">
              আপনার সময় ও শ্রমের মাধ্যমে অসহায় মুখে এক চিলতে হাসি ফুটিয়ে আত্মতৃপ্তি লাভ করুন।
            </p>
          </div>
        </div>

        {/* Volunteer Registration Modal / Form */}
        {showRegForm && !registeredVolunteer && (
          <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white text-slate-900 rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto text-left animate-in zoom-in-95">
              
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div>
                  <h3 className="text-lg font-black text-slate-900">স্বেচ্ছাসেবক আবেদন ফরম ২০২৬</h3>
                  <p className="text-xs text-slate-500">সাজেদা ইয়ুথ ফাউন্ডেশন যুব নেটওয়ার্ক</p>
                </div>
                <button
                  onClick={() => setShowRegForm(false)}
                  className="text-xs font-bold text-slate-400 hover:text-slate-700"
                >
                  ✕ বন্ধ করুন
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">পূর্ণ নাম *</label>
                    <input
                      type="text"
                      required
                      placeholder="আপনার নাম"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">মোবাইল নম্বর *</label>
                    <input
                      type="tel"
                      required
                      placeholder="০১৭১১-XXXXXX"
                      value={mobile}
                      onChange={(e) => setMobile(e.target.value)}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">ইমেইল ঠিকানা *</label>
                    <input
                      type="email"
                      required
                      placeholder="example@mail.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">জেলা *</label>
                    <input
                      type="text"
                      required
                      placeholder="ঢাকা / চট্টগ্রাম / কুড়িগ্রাম ইত্যাদি"
                      value={district}
                      onChange={(e) => setDistrict(e.target.value)}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">বর্তমান ঠিকানা</label>
                  <input
                    type="text"
                    placeholder="থানা, রোড বা এলাকা"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">পেশা</label>
                    <input
                      type="text"
                      value={occupation}
                      onChange={(e) => setOccupation(e.target.value)}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">আপনার প্রধান দক্ষতা</label>
                    <input
                      type="text"
                      placeholder="গ্রাফিক ডিজাইন / ফার্স্ট এইড / লজিস্টিকস"
                      value={skills}
                      onChange={(e) => setSkills(e.target.value)}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">পছন্দের সেবামূলক কাজ</label>
                    <select
                      value={preferredActivity}
                      onChange={(e) => setPreferredActivity(e.target.value)}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500"
                    >
                      <option value="দুর্যোগ ও জরুরি খাদ্য বিতরণ">দুর্যোগ ও জরুরি খাদ্য বিতরণ</option>
                      <option value="ফ্রি মেডিকেল ও রক্তদান ক্যাম্প">ফ্রি মেডিকেল ও রক্তদান ক্যাম্প</option>
                      <option value="সুবিধাবঞ্চিত শিশুদের পাঠদান">সুবিধাবঞ্চিত শিশুদের পাঠদান</option>
                      <option value="বৃক্ষরোপণ ও পরিবেশ রক্ষা">বৃক্ষরোপণ ও পরিবেশ রক্ষা</option>
                      <option value="আইটি, কন্টেন্ট ও মিডিয়া সেল">আইটি, কন্টেন্ট ও মিডিয়া সেল</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">কখন সময় দিতে পারবেন?</label>
                    <select
                      value={availability}
                      onChange={(e) => setAvailability(e.target.value as any)}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500"
                    >
                      <option value="weekends">শুধু ছুটির দিনে (শুক্রবার/শনিবার)</option>
                      <option value="weekdays">সপ্তাহের যেকোনো দিন</option>
                      <option value="emergency_only">শুধু জরুরি দুর্যোগে (Emergency)</option>
                      <option value="full_time">পূর্ণকালীন (Full-Time)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">জরুরি যোগাযোগের মোবাইল (অভিভাবক/বন্ধু)</label>
                  <input
                    type="tel"
                    placeholder="০১XXXXXXXXX"
                    value={emergencyContact}
                    onChange={(e) => setEmergencyContact(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div className="flex items-start gap-2 bg-emerald-50 p-3 rounded-xl border border-emerald-100">
                  <input
                    type="checkbox"
                    id="vol_agree"
                    checked={agreement}
                    onChange={(e) => setAgreement(e.target.checked)}
                    className="mt-0.5 w-4 h-4 text-emerald-600 rounded"
                  />
                  <label htmlFor="vol_agree" className="text-[11px] text-emerald-950 font-semibold cursor-pointer">
                    আমি স্বেচ্ছায়, নিষ্ঠার সাথে এবং নিঃস্বার্থভাবে মানবকল্যাণে সাজেদা ইয়ুথ ফাউন্ডেশনের কার্যক্রমে সময় দিতে অঙ্গীকারবদ্ধ।
                  </label>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowRegForm(false)}
                    className="px-4 py-2.5 rounded-xl bg-slate-100 text-slate-700 font-bold hover:bg-slate-200"
                  >
                    বাতিল
                  </button>

                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-black shadow-md flex items-center gap-1.5 cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>নিবন্ধন সম্পন্ন করুন</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Volunteer ID Card & Certificate Preview on Submission */}
        {registeredVolunteer && (
          <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white text-slate-900 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 text-left animate-in zoom-in-95">
              
              <div className="text-center space-y-1">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto mb-2">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-black text-slate-900">অভিনন্দন! নিবন্ধন সম্পন্ন হয়েছে</h3>
                <p className="text-xs text-slate-500">আপনার ডিজিটাল ভলান্টিয়ার আইডি কার্ড নিচে দেওয়া হলো:</p>
              </div>

              {/* ID Card Graphic */}
              <div className="bg-gradient-to-br from-emerald-800 via-teal-900 to-slate-950 text-white p-5 rounded-3xl shadow-xl border border-emerald-500/30 space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-emerald-700/50">
                  <div>
                    <span className="font-black text-xs block text-amber-300">সাজেদা ইয়ুথ ফাউন্ডেশন</span>
                    <span className="text-[10px] text-slate-300 font-mono">VOLUNTEER IDENTITY CARD</span>
                  </div>
                  <ShieldCheck className="w-5 h-5 text-emerald-300" />
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded-2xl bg-white/10 border-2 border-amber-300 flex items-center justify-center text-amber-300 font-black text-lg">
                    {registeredVolunteer.fullName.slice(0, 1)}
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-white">{registeredVolunteer.fullName}</h4>
                    <p className="text-[11px] text-emerald-200">{registeredVolunteer.district} • {registeredVolunteer.preferredActivity}</p>
                    <span className="text-[10px] font-mono text-amber-300 font-bold bg-white/10 px-2 py-0.5 rounded mt-1 inline-block">
                      ID: {registeredVolunteer.volunteerId}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[10px] pt-2 border-t border-emerald-700/50 text-slate-300">
                  <span>যোগদানের তারিখ: {registeredVolunteer.joinedAt}</span>
                  <span className="text-emerald-400 font-bold">✓ Approved Member</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <button
                  onClick={() => window.print()}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold hover:bg-slate-200"
                >
                  প্রিন্ট / সেভ করুন
                </button>

                <button
                  onClick={() => {
                    setRegisteredVolunteer(null);
                    setShowRegForm(false);
                  }}
                  className="px-5 py-2 rounded-xl bg-emerald-700 text-white text-xs font-black hover:bg-emerald-800"
                >
                  ধন্যবাদ
                </button>
              </div>

            </div>
          </div>
        )}

      </div>
    </section>
  );
};
