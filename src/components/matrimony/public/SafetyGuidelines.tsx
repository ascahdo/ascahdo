import React from 'react';
import { ShieldCheck, AlertTriangle, Lock, Eye, CheckCircle2, Phone } from 'lucide-react';
import { useMatrimonyLanguage } from '../../../context/MatrimonyLanguageContext';

export const SafetyGuidelines: React.FC = () => {
  const { lang } = useMatrimonyLanguage();

  const rules = [
    {
      titleBn: '১. আর্থিক লেনদেন থেকে সম্পূর্ণ বিরত থাকুন',
      titleEn: '1. Never Transfer Money',
      descBn: 'বিবাহের আলোচনার নামে কেউ কখনো টাকা, গিফট বা জরুরি সাহায্যের দাবি করলে সাথে সাথে আমাদের অ্যাডমিনকে জানান।',
      descEn: 'Never send money or financial assistance to anyone under matrimonial pretexts.',
    },
    {
      titleBn: '২. অভিভাবককে সম্পৃক্ত রেখে কথা বলুন',
      titleEn: '2. Involve Parents & Guardians',
      descBn: 'প্রথম থেকেই উভয় পরিবারের সিনিয়র সদস্যদের অবহিত রেখে আনুষ্ঠানিক আলোচনা এগিয়ে নিন।',
      descEn: 'Always ensure conversations and matchmaking are carried out with guardian knowledge.',
    },
    {
      titleBn: '৩. পারিবারিক ও প্রাতিষ্ঠানিক তথ্য যাচাই করুন',
      titleEn: '3. Verify Academic & Job Credentials',
      descBn: 'বায়োডাটার শিক্ষাগত সার্টিফিকেট ও কর্মক্ষেত্র সম্পর্কে নিজেদের পক্ষ থেকে নির্ভরযোগ্য তথ্য সংগ্রহ করুন।',
      descEn: 'Cross-verify professional designations, education, and family background independently.',
    },
    {
      titleBn: '৪. পাবলিক স্থানে পরিবারের সাথে দেখা করুন',
      titleEn: '4. Meet in Safe Family Settings',
      descBn: 'পাত্র-পাত্রী সরাসরি দেখা করতে চাইলে সর্বদা পরিবারের অভিভাবকদের সাথে নিয়ে খোলামেলা ও নিরাপদ স্থানে সাক্ষাৎ করুন।',
      descEn: 'First personal meetings should always occur in open family-attended environments.',
    },
  ];

  return (
    <section className="py-16 sm:py-20 bg-white" id="safety">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto bg-rose-50/70 border border-rose-200 rounded-3xl p-6 sm:p-10 shadow-xs">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-rose-700 text-white flex items-center justify-center shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 font-serif">
                {lang === 'bn' ? 'নিরাপত্তা ও সতর্কতা নীতিমালা' : 'Matrimonial Safety & Trust Guidelines'}
              </h2>
              <p className="text-xs text-slate-600">
                {lang === 'bn' ? 'একটি নিরাপদ ও বিশ্বস্ত ম্যাচমেকিং অভিজ্ঞতার জন্য এই নিয়মগুলো মেনে চলুন' : 'Essential rules to ensure your safety'}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm">
            {rules.map((rule, idx) => (
              <div key={idx} className="bg-white p-4 rounded-2xl border border-rose-100 space-y-1.5 shadow-2xs">
                <h4 className="font-bold text-slate-900 text-sm">
                  {lang === 'bn' ? rule.titleBn : rule.titleEn}
                </h4>
                <p className="text-slate-600 text-xs leading-relaxed">
                  {lang === 'bn' ? rule.descBn : rule.descEn}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-6 pt-6 border-t border-rose-200/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-700">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
              <span>
                {lang === 'bn' ? 'যেকোনো সন্দেহজনক কার্যকলাপ দেখলেই রিপোর্ট করুন' : 'Report suspicious activity immediately'}
              </span>
            </div>
            <div className="flex items-center gap-2 font-bold text-rose-900">
              <Phone className="w-4 h-4 text-rose-700" />
              <span>{lang === 'bn' ? 'জরুরি কল: +৮৮০ ১৮১৩-৮১৭১৬৭' : 'Call: +880 1813-817167'}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
