import React, { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { useMatrimonyLanguage } from '../../../context/MatrimonyLanguageContext';
import { useMatrimony } from '../../../context/MatrimonyContext';

export const FAQSection: React.FC = () => {
  const { lang } = useMatrimonyLanguage();
  const { faqItems = [] } = useMatrimony();
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section className="py-16 sm:py-20 bg-slate-50 border-t border-slate-200/70" id="faq">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-100 text-rose-900 text-xs font-bold">
            <HelpCircle className="w-3.5 h-3.5 text-rose-700" />
            <span>{lang === 'bn' ? 'সাধারণ জিজ্ঞাসা' : 'FAQ'}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 font-serif tracking-tight">
            {lang === 'bn' ? 'সাধারণ প্রশ্ন ও উত্তর (FAQ)' : 'Frequently Asked Questions'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-600">
            {lang === 'bn'
              ? 'বায়োডাটা তৈরি, গোপনীয়তা ও মেম্বারশিপ সম্পর্কিত সচরাচর প্রশ্নের উত্তর।'
              : 'Answers to common questions about registration, privacy, and matchmaking.'}
          </p>
        </div>

        <div className="space-y-3">
          {faqItems.map((item, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={item.id}
                className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden transition"
              >
                <button
                  onClick={() => toggle(idx)}
                  className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 font-bold text-slate-900 text-sm sm:text-base hover:text-rose-700 transition"
                >
                  <span className="font-serif">{lang === 'bn' ? item.questionBn : item.questionEn}</span>
                  <div className="p-1 rounded-lg bg-slate-50 text-slate-500 shrink-0">
                    {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </div>
                </button>

                {isOpen && (
                  <div className="px-4 sm:px-5 pb-5 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-3 animate-in fade-in">
                    {lang === 'bn' ? item.answerBn : item.answerEn}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
