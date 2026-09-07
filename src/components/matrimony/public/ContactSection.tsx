import React, { useState } from 'react';
import { Phone, Mail, MapPin, Send, MessageSquare, CheckCircle2 } from 'lucide-react';
import { useMatrimonyLanguage } from '../../../context/MatrimonyLanguageContext';
import { useMatrimony } from '../../../context/MatrimonyContext';

export const ContactSection: React.FC = () => {
  const { lang } = useMatrimonyLanguage();
  const { siteSettings } = useMatrimony();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setName('');
      setPhone('');
      setMessage('');
      setSubmitted(false);
    }, 3000);
  };

  return (
    <section className="py-16 sm:py-20 bg-white" id="contact">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Info Column (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-100 text-rose-900 text-xs font-bold mb-3">
                <Phone className="w-3.5 h-3.5 text-rose-700" />
                <span>{lang === 'bn' ? 'সরাসরি যোগাযোগ' : 'Get in Touch'}</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-serif">
                {lang === 'bn' ? 'আমাদের অফিসে আসুন বা সরাসরি কথা বলুন' : 'Visit Our Office or Call Anytime'}
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
                {lang === 'bn'
                  ? 'পাত্র-পাত্রী নির্বাচন বা মেম্বারশিপ সংক্রান্ত যেকোনো সহায়তায় আমাদের সিনিয়র ম্যাচমেকার টিম সর্বদা প্রস্তুত।'
                  : 'Our senior matchmaking consultants are available to assist you in person or over phone.'}
              </p>
            </div>

            <div className="space-y-4 text-xs sm:text-sm">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900">{lang === 'bn' ? 'ঢাকা প্রধান কার্যালয়' : 'Dhaka Main Office'}</h4>
                  <p className="text-slate-600 text-xs mt-0.5">{siteSettings.dhakaOfficeAddress}</p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900">{lang === 'bn' ? '২৪/৭ সাপোর্ট হটলাইন' : '24/7 Helpline'}</h4>
                  <p className="font-mono text-rose-700 font-bold text-xs mt-0.5">{siteSettings.helplinePhone}</p>
                  <p className="text-slate-500 text-[11px]">সকাল ৯টা - রাত ১০টা</p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900">{lang === 'bn' ? 'অফিসিয়াল ইমেইল' : 'Email Us'}</h4>
                  <p className="text-slate-600 text-xs mt-0.5">{siteSettings.contactEmail}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Form Column (7 cols) */}
          <div className="lg:col-span-7">
            <div className="bg-slate-50 border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs">
              <h3 className="text-lg font-bold text-slate-900 font-serif mb-1">
                {lang === 'bn' ? 'সরাসরি বার্তা পাঠান' : 'Send Us a Quick Message'}
              </h3>
              <p className="text-xs text-slate-500 mb-6">
                {lang === 'bn' ? 'আমাদের প্রতিনিধি দ্রুত আপনার নম্বরে যোগাযোগ করবেন।' : 'We will respond within few hours.'}
              </p>

              {submitted ? (
                <div className="p-8 text-center bg-white rounded-2xl border border-emerald-200 space-y-2">
                  <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                  <h4 className="font-bold text-slate-900 text-base">
                    {lang === 'bn' ? 'বার্তা সফলভাবে পাঠানো হয়েছে!' : 'Message Sent Successfully!'}
                  </h4>
                  <p className="text-xs text-slate-500">
                    {lang === 'bn' ? 'আমাদের টিম শীঘ্রই আপনার সাথে যোগাযোগ করবে।' : 'Our team will contact you shortly.'}
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4 text-xs sm:text-sm">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        {lang === 'bn' ? 'আপনার নাম' : 'Your Name'}
                      </label>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={e => setName(e.target.value)}
                        placeholder={lang === 'bn' ? 'যেমন: মো: কামরুল হাসান' : 'Your full name'}
                        className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        {lang === 'bn' ? 'মোবাইল নম্বর' : 'Mobile Number'}
                      </label>
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={e => setPhone(e.target.value)}
                        placeholder="01712-XXXXXX"
                        className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      {lang === 'bn' ? 'আপনার বার্তা বা পাত্র/পাত্রীর চাহিদা' : 'Message or Requirement'}
                    </label>
                    <textarea
                      rows={4}
                      required
                      value={message}
                      onChange={e => setMessage(e.target.value)}
                      placeholder={lang === 'bn' ? 'আপনার জিজ্ঞাসা বা পাত্র-পাত্রীর পছন্দ বিস্তারিত লিখুন...' : 'Describe what kind of match you are looking for...'}
                      className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500 resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 px-6 rounded-xl bg-rose-700 hover:bg-rose-800 text-white font-bold text-xs sm:text-sm shadow-md shadow-rose-700/20 transition flex items-center justify-center gap-2"
                  >
                    <Send className="w-4 h-4" />
                    <span>{lang === 'bn' ? 'বার্তা পাঠান' : 'Send Message'}</span>
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
