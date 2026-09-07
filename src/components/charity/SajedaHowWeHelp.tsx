import React from 'react';
import { Search, ShieldCheck, HeartHandshake, FileCheck, ArrowRight, Sparkles } from 'lucide-react';
import { SYF_HOW_WE_HELP_STEPS } from '../../data/sajedaCharityData';

export const SajedaHowWeHelp: React.FC = () => {
  const getStepIcon = (iconName: string) => {
    switch (iconName) {
      case 'Search':
        return <Search className="w-6 h-6 text-emerald-600" />;
      case 'ShieldCheck':
        return <ShieldCheck className="w-6 h-6 text-emerald-600" />;
      case 'HeartHandshake':
        return <HeartHandshake className="w-6 h-6 text-emerald-600" />;
      case 'FileCheck':
        return <FileCheck className="w-6 h-6 text-emerald-600" />;
      default:
        return <Sparkles className="w-6 h-6 text-emerald-600" />;
    }
  };

  return (
    <section className="py-16 lg:py-24 bg-white text-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-100 text-teal-800 text-xs font-bold">
            <Sparkles className="w-4 h-4 text-teal-700" />
            <span>Structured 4-Step Process</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
            আমরা যেভাবে কাজ সম্পন্ন করি
          </h2>
          <p className="text-sm sm:text-base text-slate-600 font-medium">
            নিখুঁত যাচাই-বাছাই এবং মধ্যস্বত্বভোগীহীন সরাসরি প্রক্রিয়ায় প্রতিটি অর্থ পৌঁছে দেওয়া হয়।
          </p>
        </div>

        {/* 4 Steps Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          {SYF_HOW_WE_HELP_STEPS.map((step, idx) => (
            <div
              key={idx}
              className="bg-slate-50 rounded-3xl p-6 border border-slate-200/80 shadow-xs hover:shadow-md transition transform hover:-translate-y-1 text-left space-y-4 relative group"
            >
              {/* Step Number Watermark */}
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition duration-300">
                  {getStepIcon(step.icon)}
                </div>
                <span className="text-3xl font-black text-slate-300 font-mono group-hover:text-emerald-300 transition">
                  {step.step}
                </span>
              </div>

              <div className="space-y-1.5">
                <h3 className="text-base font-black text-slate-900 group-hover:text-emerald-800 transition">
                  {step.titleBn}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed font-medium">
                  {step.descBn}
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
