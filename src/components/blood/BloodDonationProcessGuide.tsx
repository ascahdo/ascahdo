import React, { useState } from 'react';
import { useTranslation } from '../../locales/i18nContext';
import {
  ClipboardCheck, UserCheck, Coffee, Award, Heart, ShieldCheck,
  ChevronDown, ChevronUp, Sparkles, CheckCircle2, Droplet, Flame,
  Activity, Zap, Info
} from 'lucide-react';

export const BloodDonationProcessGuide: React.FC = () => {
  const { isBn } = useTranslation();
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const steps = [
    {
      step: '০১',
      stepEn: '01',
      titleBn: 'রেজিস্ট্রেশন ও প্রাথমিক স্বাস্থ্য পরীক্ষা',
      titleEn: 'Registration & Mini Health Check',
      descBn: 'ডোনারের ওজন, রক্তচাপ (BP), পালস এবং হিমোগ্লোবিনের মাত্রা সম্পূর্ণ ফ্রিতে অভিজ্ঞ মেডিকেল টেকনোলজিস্ট দ্বারা পরীক্ষা করা হয়।',
      descEn: 'Quick check of blood pressure, hemoglobin count, pulse rate and body weight before donation.',
      icon: ClipboardCheck,
      color: 'from-blue-500 to-indigo-600'
    },
    {
      step: '০২',
      stepEn: '02',
      titleBn: '১০ মিনিটের আরামদায়ক ও নিরাপদ রক্তদান',
      titleEn: '10-Min Safe & Sterile Donation',
      descBn: '১০০% নতুন ও জীবাণুমুক্ত নিডেলের মাধ্যমে সম্পূর্ণ ব্যথামুক্ত উপায়ে মাত্র ৩৫০-৪৫০ মিলি রক্ত সংগ্রহ করা হয়। এটি মোট রক্তের মাত্র ৮-১০%।',
      descEn: 'Sterile single-use kit extracts ~350-450ml of blood safely while you relax on a comfortable recliner.',
      icon: Droplet,
      color: 'from-rose-500 to-red-600'
    },
    {
      step: '০৩',
      stepEn: '03',
      titleBn: 'পুষ্টিকর রিফ্রেশমেন্ট ও ১০ মিনিট বিশ্রাম',
      titleEn: 'Nutritious Refreshment & Rest',
      descBn: 'রক্তদানের পর স্যালাইন, জুস বা বিস্কুট গ্রহণ করে ১০-১৫ মিনিট বিশ্রাম নিলে শরীর সাথে সাথে স্বাভাবিক সতেজতা ফিরে পায়।',
      descEn: 'Enjoy healthy fruit juice, snacks and short rest. Your plasma replenishes within 24-48 hours.',
      icon: Coffee,
      color: 'from-amber-500 to-orange-600'
    },
    {
      step: '০৪',
      stepEn: '04',
      titleBn: 'ডিজিটাল স্মার্ট কার্ড ও আজীবন সম্মাননা',
      titleEn: 'Smart Donor ID & Life Certificate',
      descBn: 'এসকাডো ফাউন্ডেশনের কেন্দ্রীয় ভেরিফাইড স্মার্ট ডোনার কোড, ডিজিটাল মেম্বারশিপ কার্ড ও বিশেষ চিকিৎসা ডিসকাউন্ট প্রদান।',
      descEn: 'Receive instant verifiable digital donor credentials, recognition certificate, and priority hub support.',
      icon: Award,
      color: 'from-emerald-500 to-teal-600'
    }
  ];

  const benefits = [
    {
      titleBn: 'হৃদরোগ ও স্ট্রোকের ঝুঁকি হ্রাস',
      titleEn: 'Reduces Heart Attack & Stroke Risk',
      descBn: 'নিয়মিত রক্তদানে রক্তে অতিরিক্ত আয়রনের ক্ষতিকর মাত্রা কমে এবং রক্তনালীর ব্লকেজ প্রতিরোধে সাহায্য করে।',
      descEn: 'Balancing iron levels reduces arterial blockage and cardiovascular stress.',
      icon: Heart,
      badge: isBn ? 'কার্ডিও সুরক্ষা' : 'Cardio Health'
    },
    {
      titleBn: 'নতুন রক্তকণিকা ও তারুণ্য বৃদ্ধি',
      titleEn: 'Stimulates Fresh Blood Production',
      descBn: 'রক্তদানের ৪৮ ঘণ্টার মধ্যে অস্থিমজ্জা (Bone Marrow) নতুন ও সতেজ লোহিত রক্তকণিকা (RBC) তৈরি করে শরীরকে চাঙ্গা করে।',
      descEn: 'Bone marrow produces fresh, oxygen-rich cells boosting energy and immunity.',
      icon: Sparkles,
      badge: isBn ? 'কোষ পুনরুজ্জীবন' : 'Cell Renewal'
    },
    {
      titleBn: 'বিনামূল্যে ৫টি গুরুত্বপূর্ণ স্ক্রিনিং টেস্ট',
      titleEn: 'Free 5 Mandatory Health Screenings',
      descBn: 'প্রতিটি রক্তদানের পূর্বে হেপাটাইটিস বি, হেপাটাইটিস সি, এইচআইভি, ম্যালেরিয়া ও সিফিলিস সম্পূর্ণ বিনামূল্যে ল্যাবে টেস্ট করা হয়।',
      descEn: 'Complimentary certified laboratory screening for Hepatitis B, C, HIV, Malaria & Syphilis.',
      icon: ShieldCheck,
      badge: isBn ? '৳২,০০০+ ফ্রি ল্যাব টেস্ট' : 'Free Screening'
    },
    {
      titleBn: 'ক্যালোরি বার্ন ও মেটাবলিজম বৃদ্ধি',
      titleEn: 'Calorie Burn & Healthy Metabolism',
      descBn: 'একবার রক্তদানে শরীর প্রায় ৬৫০ ক্যালোরি বার্ন করে এবং কোলেস্টেরল নিয়ন্ত্রণে ইতিবাচক ভূমিকা রাখে।',
      descEn: 'Each 450ml donation burns ~650 calories and enhances metabolic vitality.',
      icon: Flame,
      badge: isBn ? 'ওজন নিয়ন্ত্রণ' : 'Metabolism'
    }
  ];

  const faqs = [
    {
      qBn: 'রক্ত দিলে কি শরীর দুর্বল বা অসুস্থ হয়ে পড়ে?',
      qEn: 'Does blood donation make you weak or sick?',
      aBn: 'না, এটি সম্পূর্ণ ভুল ধারণা। মানবদেহে সাধারণত ৫ থেকে ৬ লিটার রক্ত থাকে, যার মাত্র ১ ব্যাগ (৩৫০-৪৫০ মিলি) নেওয়া হয়। ২৪-৪৮ ঘণ্টার মধ্যে তরল অংশ এবং কয়েক সপ্তাহের মধ্যে নতুন রক্তকণিকা সম্পূর্ণ তৈরি হয়ে যায়।',
      aEn: 'No. The human body holds 5-6 liters of blood. We only collect ~350-450ml (under 10%). Plasma replenishes within 24-48 hours, and red blood cells fully regenerate in a few weeks.'
    },
    {
      qBn: 'কত দিন পর পর রক্তদান করা নিরাপদ?',
      qEn: 'How frequently can I safely donate blood?',
      aBn: 'একজন সুস্থ প্রাপ্তবয়স্ক পুরুষ প্রতি ৩ মাস (৯০ দিন) পর পর এবং সুস্থ নারী প্রতি ৪ মাস (১২০ দিন) পর পর নিয়মিত রক্তদান করতে পারেন।',
      aEn: 'Healthy adult males can donate every 3 months (90 days), and females every 4 months (120 days).'
    },
    {
      qBn: 'রক্তদানের জন্য কী কী শর্ত পূরণ করতে হয়?',
      qEn: 'What are the basic conditions for donation?',
      aBn: 'বয়স ১৮ থেকে ৬০ বছর, ওজন কমপক্ষে ৪৫ কেজি, হিমোগ্লোবিনের মাত্রা ১২.৫ গ্রাম/ডেসিলিটার বা তার বেশি এবং সংক্রামক রোগমুক্ত হতে হবে।',
      aEn: 'Age 18-60, weight at least 45 kg, hemoglobin >= 12.5 g/dL, and free of active infections.'
    },
    {
      qBn: 'রক্তদানের আগে ও পরে কী কী সতর্কতা অবলম্বন করা উচিত?',
      qEn: 'What precautions should be taken before and after donating?',
      aBn: 'রক্তদানের পূর্বে পর্যাপ্ত পানি পান করুন, খালি পেটে থাকবেন না এবং ভালো ঘুম নিশ্চিত করুন। রক্তদানের পর ১৫ মিনিট বিশ্রাম নিন এবং ভারী কাজ পরিহার করুন।',
      aEn: 'Drink plenty of fluids, avoid donating on an empty stomach, and get a good night sleep. Rest 15 mins after donation and avoid heavy lifting for a few hours.'
    }
  ];

  return (
    <div className="space-y-16">
      
      {/* 1. 4-Step Visual Journey */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-xs space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-50 text-rose-700 text-xs font-bold uppercase tracking-wider border border-rose-200">
            <Activity className="w-3.5 h-3.5 text-rose-600" />
            <span>{isBn ? 'সহজ ও নিরাপদ প্রক্রিয়া' : 'Safe & Simple Journey'}</span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-black text-slate-900">
            {isBn ? '৪ ধাপে নিরাপদ রক্তদান প্রক্রিয়া' : '4 Easy Steps to Save a Life'}
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 font-medium">
            {isBn
              ? 'আন্তর্জাতিক WHO ও DGHS মানসম্পন্ন জীবাণুমুক্ত পরিবেশে সর্বোচ্চ সুরক্ষায় রক্ত সংগ্রহ করা হয়।'
              : 'Standardized WHO & DGHS medical protocols ensure absolute hygiene and donor safety.'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {steps.map((s, idx) => {
            const Icon = s.icon;
            return (
              <div
                key={idx}
                className="bg-slate-50/70 hover:bg-white rounded-2xl p-6 border border-slate-200 hover:border-rose-300 hover:shadow-md transition-all text-left flex flex-col justify-between relative group"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-black text-slate-300 font-mono group-hover:text-rose-500 transition">
                      {isBn ? s.step : s.stepEn}
                    </span>
                    <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${s.color} text-white flex items-center justify-center shadow-sm`}>
                      <Icon className="w-6 h-6" />
                    </div>
                  </div>

                  <div>
                    <h4 className="font-bold text-slate-900 text-base leading-snug">
                      {isBn ? s.titleBn : s.titleEn}
                    </h4>
                    <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                      {isBn ? s.descBn : s.descEn}
                    </p>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-200/60 flex items-center gap-1.5 text-[11px] font-bold text-rose-600">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{isBn ? '১০০% জীবাণুমুক্ত' : '100% Sterile'}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. Scientific Health Benefits Grid */}
      <div className="bg-gradient-to-b from-rose-50/40 to-white rounded-3xl border border-rose-100 p-6 sm:p-10 shadow-xs space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold uppercase tracking-wider border border-emerald-200">
            <Heart className="w-3.5 h-3.5 text-emerald-600 fill-emerald-600" />
            <span>{isBn ? 'চিকিৎসাবিজ্ঞান সমর্থিত সুবিধা' : 'Medical Health Benefits'}</span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-black text-slate-900">
            {isBn ? 'নিয়মিত রক্তদানে আপনার স্বাস্থ্যগত লাভ' : 'Why Donating Blood is Good for You'}
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 font-medium">
            {isBn
              ? 'অন্যের জীবন বাঁচানোর পাশাপাশি রক্তদান আপনার হৃদযন্ত্র ও রোগ প্রতিরোধ ক্ষমতাকে বহুগুণে শক্তিশালী করে।'
              : 'Giving blood not only saves emergency patients but also renews your body metabolism.'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {benefits.map((b, idx) => {
            const Icon = b.icon;
            return (
              <div
                key={idx}
                className="bg-white rounded-2xl p-6 border border-slate-200 hover:border-emerald-300 hover:shadow-md transition text-left flex items-start gap-4"
              >
                <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center shrink-0">
                  <Icon className="w-6 h-6" />
                </div>
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <h4 className="font-bold text-slate-900 text-base">
                      {isBn ? b.titleBn : b.titleEn}
                    </h4>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      {b.badge}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {isBn ? b.descBn : b.descEn}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. Frequently Asked Questions (FAQ) Accordion */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-xs space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-4 border-b border-slate-100 pb-5">
          <div>
            <h3 className="text-xl sm:text-2xl font-black text-slate-900">
              {isBn ? 'রক্তদান সম্পর্কিত সাধারণ প্রশ্নোত্তর (FAQ)' : 'Frequently Asked Questions'}
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              {isBn
                ? 'রক্তদান নিয়ে দ্বিধা বা প্রশ্ন থাকলে জেনে নিন সঠিক বৈজ্ঞানিক তথ্য'
                : 'Common questions and medical facts about blood donation'}
            </p>
          </div>
          <div className="px-3.5 py-1.5 rounded-xl bg-slate-100 text-slate-700 text-xs font-semibold flex items-center gap-1.5">
            <Info className="w-4 h-4 text-rose-600" />
            <span>{isBn ? 'মেডিকেল ডিরেক্টর দ্বারা পরীক্ষিত' : 'Clinically Reviewed'}</span>
          </div>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = activeFaq === idx;
            return (
              <div
                key={idx}
                className="border border-slate-200 rounded-2xl overflow-hidden transition"
              >
                <button
                  onClick={() => setActiveFaq(isOpen ? null : idx)}
                  className="w-full p-4 sm:p-5 text-left bg-slate-50/50 hover:bg-slate-50 flex items-center justify-between gap-4 font-bold text-sm sm:text-base text-slate-900 transition"
                >
                  <span>{isBn ? faq.qBn : faq.qEn}</span>
                  {isOpen ? (
                    <ChevronUp className="w-5 h-5 text-rose-600 shrink-0" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-slate-400 shrink-0" />
                  )}
                </button>

                {isOpen && (
                  <div className="p-4 sm:p-5 bg-white border-t border-slate-100 text-xs sm:text-sm text-slate-600 leading-relaxed animate-in fade-in duration-150 text-left">
                    {isBn ? faq.aBn : faq.aEn}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
