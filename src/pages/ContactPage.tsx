import React, { useState } from 'react';
import { useTranslation } from '../locales/i18nContext';
import { MapPin, Phone, Mail, Clock, Building2, Send, CheckCircle } from 'lucide-react';
import { BANGLADESH_DISTRICTS } from '../data/bangladeshLocations';

export const ContactPage: React.FC = () => {
  const { isBn } = useTranslation();
  const [ngoName, setNgoName] = useState('');
  const [repName, setRepName] = useState('');
  const [repPhone, setRepPhone] = useState('');
  const [district, setDistrict] = useState('Dhaka');
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 text-white rounded-3xl p-8 sm:p-10 shadow-xl space-y-3">
        <span className="bg-emerald-500/20 text-emerald-300 text-xs font-bold px-3 py-1 rounded-full uppercase">
          {isBn ? 'যোগাযোগ ও নতুন শাখা/এনজিও অন্তর্ভুক্তি' : 'Contact & Organization Affiliation'}
        </span>
        <h1 className="text-2xl sm:text-4xl font-black">
          {isBn ? 'সেন্ট্রাল প্রধান কার্যালয় ও দেশব্যাপী শাখা নেটওয়ার্ক' : 'Headquarters & Nationwide Branch Network'}
        </h1>
        <p className="text-slate-300 text-xs sm:text-sm leading-relaxed max-w-2xl">
          {isBn
            ? 'এসকাডো প্ল্যাটফর্মের সাথে আপনার এনজিও যুক্ত করতে অথবা আপনার এলাকায় নতুন অনুমোদিত শাখা খুলতে আজই যোগাযোগ করুন।'
            : 'Get in touch with central management or submit an affiliation proposal to integrate your NGO or establish a branch under ASCAHDO.'}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Contact Info & Branches */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
            <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
              <Building2 className="w-5 h-5 text-emerald-600" />
              <span>{isBn ? 'সেন্ট্রাল হেড অফিস' : 'Central Head Office'}</span>
            </h3>

            <div className="space-y-3 text-xs text-slate-600">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span className="font-medium text-slate-800">{isBn ? 'বসুরহাট, কোম্পানীগঞ্জ, নোয়াখালী, বাংলাদেশ' : 'Basurhat, Companiganj, Noakhali, Bangladesh'}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="font-bold text-slate-800">01813817167</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="font-medium text-slate-800">ascahdo@gmail.com</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{isBn ? 'শনিবার - বৃহস্পতিবার: সকাল ৯:০০ - সন্ধ্যা ৬:০০ (জরুরি সেবা ২৪/৭)' : 'Sat - Thu: 9:00 AM - 6:00 PM (Emergency 24/7)'}</span>
              </div>
            </div>
          </div>

          <div className="bg-slate-50 rounded-2xl border border-slate-200 p-6 space-y-3">
            <h4 className="font-bold text-sm text-slate-900">{isBn ? 'বিভাগীয় প্রধান সমন্বয়কগণ' : 'Divisional Coordinators'}</h4>
            <div className="text-xs space-y-2 text-slate-600">
              <p>• <span className="font-semibold text-slate-800">ঢাকা ও ময়মনসিংহ বিভাগ:</span> ০১৭০০-১১২২৩৩</p>
              <p>• <span className="font-semibold text-slate-800">চট্টগ্রাম ও সিলেট বিভাগ:</span> ০১৮০০-১১২২৩৩</p>
              <p>• <span className="font-semibold text-slate-800">রাজশাহী ও রংপুর বিভাগ:</span> ০১৯০০-১১২২৩৩</p>
              <p>• <span className="font-semibold text-slate-800">খুলনা ও বরিশাল বিভাগ:</span> ০১৬০০-১১২২৩৩</p>
            </div>
          </div>
        </div>

        {/* Affiliation / Contact Form */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm">
          {sent ? (
            <div className="p-8 bg-emerald-50 border border-emerald-200 rounded-2xl text-center space-y-3">
              <CheckCircle className="w-12 h-12 text-emerald-600 mx-auto" />
              <h4 className="font-bold text-lg text-emerald-900">{isBn ? 'আপনার বার্তা সফলভাবে গৃহীত হয়েছে!' : 'Message Received Successfully!'}</h4>
              <p className="text-xs text-slate-600">{isBn ? 'আমাদের সেন্ট্রাল অ্যাডমিন দল দ্রুততম সময়ের মধ্যে আপনার সাথে যোগাযোগ করবে।' : 'Our management team will get back to you shortly.'}</p>
              <button
                onClick={() => setSent(false)}
                className="bg-emerald-600 text-white font-bold px-5 py-2 rounded-xl text-xs"
              >
                {isBn ? 'আরেকটি বার্তা পাঠান' : 'Send Another'}
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <h3 className="font-bold text-base text-slate-900">
                {isBn ? 'এনজিও অন্তর্ভুক্তি বা শাখা গঠনের প্রস্তাবনা ফরম' : 'Organization Affiliation & Inquiry Form'}
              </h3>

              <div>
                <label className="block font-bold text-slate-700 mb-1">{isBn ? 'এনজিও / প্রতিষ্ঠানের নাম (যদি থাকে)' : 'NGO / Organization Name'}</label>
                <input
                  type="text"
                  value={ngoName}
                  onChange={(e) => setNgoName(e.target.value)}
                  placeholder={isBn ? 'যেমন: সীমান্ত মানবকল্যাণ সংস্থা' : 'Organization Name'}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">{isBn ? 'দায়িত্বপ্রাপ্ত ব্যক্তির নাম' : 'Representative Name'}</label>
                  <input
                    type="text"
                    required
                    value={repName}
                    onChange={(e) => setRepName(e.target.value)}
                    placeholder={isBn ? 'নাম লিখুন' : 'Name'}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">{isBn ? 'মোবাইল নম্বর' : 'Phone Number'}</label>
                  <input
                    type="tel"
                    required
                    value={repPhone}
                    onChange={(e) => setRepPhone(e.target.value)}
                    placeholder="017XXXXXXXX"
                    className="w-full px-3 py-2 rounded-lg border border-slate-300"
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">{isBn ? 'জেলা নির্বাচন করুন' : 'District'}</label>
                <select
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white"
                >
                  {Object.values(BANGLADESH_DISTRICTS).map((d) => (
                    <option key={d.name} value={d.name}>{isBn ? d.nameBn : d.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">{isBn ? 'আপনার প্রস্তাবনা বা বার্তা' : 'Proposal / Message Details'}</label>
                <textarea
                  required
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder={isBn ? 'বিস্তারিত লিখুন...' : 'Write details...'}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl text-xs flex items-center justify-center gap-2 shadow transition"
              >
                <Send className="w-4 h-4" />
                <span>{isBn ? 'প্রস্তাবনা দাখিল করুন' : 'Submit Affiliation Proposal'}</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
