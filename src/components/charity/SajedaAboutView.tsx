import React from 'react';
import {
  Heart, ShieldCheck, Target, Eye, Award,
  Users, CheckCircle2, Building2, BookOpen, Sparkles
} from 'lucide-react';
import { SYF_BRAND } from '../../data/sajedaCharityData';

interface SajedaAboutViewProps {
  onOpenDonate?: () => void;
  onOpenVolunteer?: () => void;
}

export const SajedaAboutView: React.FC<SajedaAboutViewProps> = ({
  onOpenDonate,
  onOpenVolunteer
}) => {
  const teamMembers = [
    { name: 'ড. মুহাম্মদ আব্দুল্লাহ', roleBn: 'প্রতিষ্ঠাতা ও চেয়ারম্যান', descBn: 'আন্তর্জাতিক উন্নয়ন বিশেষজ্ঞ ও শিক্ষাবিদ', image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400' },
    { name: 'তানজিলা হক সাজেদা', roleBn: 'প্রধান নির্বাহী কর্মকর্তা (CEO)', descBn: 'সামাজিক উদ্যোক্তা ও সমাজকর্মী', image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400' },
    { name: 'ইঞ্জিনিয়ার রেজওয়ান কবীর', roleBn: 'পরিচালক (ফিল্ড অপারেশনস)', descBn: 'দুর্যোগ ব্যবস্থাপনা ও লজিস্টিকস বিশেষজ্ঞ', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400' },
    { name: 'মাওলানা মুফতি ফয়সাল মাহমুদ', roleBn: 'প্রধান, শরীয়াহ বোর্ড', descBn: 'ইসলামিক ফিন্যান্স ও যাকাত বিশেষজ্ঞ', image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=400' }
  ];

  return (
    <div className="py-12 lg:py-20 bg-slate-50 text-slate-900 space-y-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-16 text-left">
        
        {/* Banner Section */}
        <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 text-white rounded-3xl p-8 sm:p-12 shadow-xl relative overflow-hidden">
          <div className="max-w-3xl space-y-4 relative z-10">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30">
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>About Sajeda Youth Foundation</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
              মানবতার পাশে, পরিবর্তনের পথে।
            </h1>
            <p className="text-sm sm:text-base text-slate-200 leading-relaxed font-medium">
              সাজেদা ইয়ুথ ফাউন্ডেশন (SYF) একটি অরাজনৈতিক, অলাভজনক এবং তারুণ্যনির্ভর আন্তর্জাতিক মানের মানবিক সংস্থা। ২০১৫ সাল থেকে আমরা বাংলাদেশের সুবিধাবঞ্চিত ও দুর্যোগকবলিত মানুষের মৌলিক অধিকার নিশ্চিত করতে নিরলসভাবে কাজ করে যাচ্ছি।
            </p>
          </div>
        </div>

        {/* Vision & Mission Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <Eye className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-black text-slate-900">আমাদের রূপকল্প (Our Vision)</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
              একটি দারিদ্র্যমুক্ত, আত্মনির্ভরশীল ও সমতাভিত্তিক মানবিক সমাজ গঠন করা—যেখানে প্রতিটি মানুষ আত্মমর্যাদার সাথে স্বাস্থ্য, শিক্ষা, পুষ্টিকর খাদ্য ও নিরাপদ আশ্রয়ে বাস করতে পারবে।
            </p>
          </div>

          <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-teal-100 text-teal-800 flex items-center justify-center">
              <Target className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-black text-slate-900">আমাদের লক্ষ্য (Our Mission)</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
              তারুণ্যের শক্তি ও সম্মানিত দাতাদের আমানতকে শতভাগ সততা ও শরীয়াহসম্মত নিয়মে কাজে লাগিয়ে জরুরি খাদ্য সহায়তা, মানসম্মত শিক্ষা, সুচিকিৎসা এবং দুর্যোগ পুনর্বাসন নিশ্চিত করা।
            </p>
          </div>
        </div>

        {/* Core Values */}
        <div className="space-y-6">
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900">আমাদের মূল নীতিমালা ও মূল্যবোধ</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-3xl border border-slate-200 space-y-2">
              <div className="text-emerald-700 font-black text-lg">১. শতভাগ সততা (Integrity)</div>
              <p className="text-xs text-slate-600 leading-relaxed">প্রতিটি অনুদানের ডিজিটাল অডিট ট্রেইল ও স্বচ্ছতা নিশ্চিত করা।</p>
            </div>
            <div className="bg-white p-6 rounded-3xl border border-slate-200 space-y-2">
              <div className="text-emerald-700 font-black text-lg">২. মানবমর্যাদা (Dignity)</div>
              <p className="text-xs text-slate-600 leading-relaxed">সহায়তা বিতরণে সুবিধাভোগীর আত্মসম্মান ও মানবিক মর্যাদা সমুন্নত রাখা।</p>
            </div>
            <div className="bg-white p-6 rounded-3xl border border-slate-200 space-y-2">
              <div className="text-emerald-700 font-black text-lg">৩. দ্রুততম সাড়া (Agility)</div>
              <p className="text-xs text-slate-600 leading-relaxed">বন্যা ও প্রাকৃতিক দুর্যোগে ২৪ ঘণ্টার মধ্যে ত্রাণ পৌঁছানো।</p>
            </div>
            <div className="bg-white p-6 rounded-3xl border border-slate-200 space-y-2">
              <div className="text-emerald-700 font-black text-lg">৪. শরীয়াহ অনুশাসন (Shariah)</div>
              <p className="text-xs text-slate-600 leading-relaxed">যাকাত ও ফিতরাহ ফান্ড সম্পূর্ণ পৃথক ও শরীয়াহসম্মত উপায়ে বণ্টন।</p>
            </div>
          </div>
        </div>

        {/* Executive Board & Shariah Advisors */}
        <div className="space-y-6">
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900">কার্যনির্বাহী পর্ষদ ও শরীয়াহ উপদেষ্টা</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {teamMembers.map((member, idx) => (
              <div key={idx} className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-sm p-4 text-center space-y-3">
                <img src={member.image} alt={member.name} className="w-24 h-24 rounded-full mx-auto object-cover border-4 border-emerald-100" />
                <div>
                  <h4 className="text-sm font-black text-slate-900">{member.name}</h4>
                  <span className="text-xs font-bold text-emerald-700 block">{member.roleBn}</span>
                  <p className="text-[11px] text-slate-500 pt-1">{member.descBn}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="bg-emerald-50 rounded-3xl p-8 border border-emerald-100 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-lg sm:text-xl font-black text-emerald-950">আমাদের সাথে পরিবর্তনের সারথি হোন</h3>
            <p className="text-xs sm:text-sm text-emerald-800 font-medium">আপনার দান ও অংশগ্রহণ একটি পরিবারকে নতুন জীবনের দিশা দেয়।</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => onOpenVolunteer && onOpenVolunteer()}
              className="px-5 py-3 rounded-2xl bg-white text-emerald-900 font-black text-xs hover:bg-emerald-100 transition border border-emerald-200"
            >
              স্বেচ্ছাসেবক হোন
            </button>
            <button
              onClick={() => onOpenDonate && onOpenDonate()}
              className="px-6 py-3 rounded-2xl bg-emerald-700 text-white font-black text-xs hover:bg-emerald-800 transition shadow-md"
            >
              অনুদানের মাধ্যমে পাশে থাকুন
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
