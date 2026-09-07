import React from 'react';
import { Check, Sparkles, ShieldCheck, Zap, Heart, ArrowRight } from 'lucide-react';
import { useMatrimonyLanguage } from '../../../context/MatrimonyLanguageContext';
import { useMatrimony } from '../../../context/MatrimonyContext';
import { useMatrimonyAuth } from '../../../context/MatrimonyAuthContext';

interface MembershipPlansProps {
  onSelectPlan: (planId: string) => void;
  onOpenLogin: () => void;
}

export const MembershipPlans: React.FC<MembershipPlansProps> = ({
  onSelectPlan,
  onOpenLogin,
}) => {
  const { lang, t } = useMatrimonyLanguage();
  const { subscriptionPlans = [] } = useMatrimony();
  const { isAuthenticated } = useMatrimonyAuth();

  const handleAction = (planId: string) => {
    if (!isAuthenticated && planId !== 'free') {
      onOpenLogin();
      return;
    }
    onSelectPlan(planId);
  };

  return (
    <section className="py-16 sm:py-24 bg-white" id="packages">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14 space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-100 text-rose-900 text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5 text-rose-700" />
            <span>{lang === 'bn' ? 'মেম্বারশিপ প্যাকেজ' : 'Transparent Pricing'}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 font-serif tracking-tight">
            {lang === 'bn' ? 'সাধ্যের মধ্যে সেরা মেম্বারশিপ প্যাকেজ' : 'Simple & Transparent Membership Plans'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-600">
            {lang === 'bn'
              ? 'বায়োডাটা তৈরি সম্পূর্ণ ফ্রি। দ্রুত উপযুক্ত প্রস্তাব ও সরাসরি অভিভাবক নম্বরে যোগাযোগে বেছে নিন প্রিমিয়াম প্যাকেজ।'
              : 'Free registration with optional upgrades for verified direct contacts and matchmaking.'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {subscriptionPlans.map((plan, idx) => {
            const isPopular = plan.isPopular;
            return (
              <div
                key={plan.id}
                className={`relative rounded-3xl p-6 sm:p-8 flex flex-col justify-between transition-all duration-300 ${
                  isPopular
                    ? 'bg-rose-950 text-white shadow-2xl scale-105 border-2 border-rose-500 z-10'
                    : 'bg-slate-50 text-slate-900 border border-slate-200/80 hover:border-rose-200 hover:shadow-lg'
                }`}
              >
                {isPopular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 bg-amber-400 text-slate-950 text-xs font-extrabold rounded-full uppercase tracking-wider shadow-md">
                    {lang === 'bn' ? 'সর্বাধিক জনপ্রিয়' : 'Most Popular'}
                  </div>
                )}

                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-bold font-serif">
                      {lang === 'bn' ? plan.nameBn : plan.nameEn}
                    </h3>
                    <p className={`text-xs mt-1 ${isPopular ? 'text-rose-200' : 'text-slate-500'}`}>
                      {plan.id === 'free'
                        ? (lang === 'bn' ? 'প্রাথমিক পাত্র-পাত্রী খোঁজার জন্য' : 'For initial biodata browsing')
                        : plan.id === 'standard'
                        ? (lang === 'bn' ? 'সরাসরি অভিভাবকের সাথে যোগাযোগের জন্য' : 'For direct phone connect')
                        : (lang === 'bn' ? 'ভিআইপি অগ্রাধিকার ও ব্যক্তিগত ম্যাচমেকার' : 'VIP personal advisor')}
                    </p>
                  </div>

                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl sm:text-4xl font-extrabold font-serif">
                      ৳ {(plan.priceBdt || 0).toLocaleString()}
                    </span>
                    <span className={`text-xs ${isPopular ? 'text-rose-200' : 'text-slate-500'}`}>
                      {(plan.priceBdt || 0) === 0
                        ? (lang === 'bn' ? '/ আজীবন ফ্রি' : '/ Lifetime')
                        : (lang === 'bn' ? `/ ${plan.durationMonths} মাস` : `/ ${plan.durationMonths} Mos`)}
                    </span>
                  </div>

                  {/* Feature Checklist */}
                  <ul className="space-y-3 text-xs sm:text-sm">
                    {(lang === 'bn' ? plan.featuresBn : plan.featuresEn).map((feat, fIdx) => (
                      <li key={fIdx} className="flex items-start gap-2.5">
                        <div
                          className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                            isPopular
                              ? 'bg-rose-700 text-white'
                              : 'bg-emerald-100 text-emerald-700'
                          }`}
                        >
                          <Check className="w-2.5 h-2.5" />
                        </div>
                        <span className={isPopular ? 'text-rose-100' : 'text-slate-700'}>
                          {feat}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-8">
                  <button
                    onClick={() => handleAction(plan.id)}
                    className={`w-full py-3 px-4 rounded-xl font-bold text-xs sm:text-sm transition flex items-center justify-center gap-2 shadow-xs ${
                      isPopular
                        ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-900/40'
                        : 'bg-rose-700 hover:bg-rose-800 text-white'
                    }`}
                  >
                    <span>
                      {plan.id === 'free'
                        ? (lang === 'bn' ? 'ফ্রি শুরু করুন' : 'Get Started Free')
                        : (lang === 'bn' ? 'প্যাকেজটি বেছে নিন' : 'Choose Package')}
                    </span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
