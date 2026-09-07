import React, { useState } from 'react';
import {
  Phone, Mail, MapPin, Send, MessageSquare,
  Facebook, Youtube, Instagram, Linkedin, CheckCircle2,
  Clock, ShieldCheck, Heart
} from 'lucide-react';
import { SYF_BRAND } from '../../data/sajedaCharityData';

export const SajedaContactSection: React.FC = () => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setName('');
    setPhone('');
    setEmail('');
    setSubject('');
    setMessage('');
    setTimeout(() => setSubmitted(false), 5000);
  };

  return (
    <section className="py-16 lg:py-24 bg-slate-50 text-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
            <MessageSquare className="w-4 h-4 text-emerald-700" />
            <span>24/7 Helpline & Contact Desk</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
            আমাদের সাথে সরাসরি যোগাযোগ করুন
          </h2>
          <p className="text-sm sm:text-base text-slate-600 font-medium">
            যে কোনো মানবিক আবেদন, পরামর্শ, ডোনেশন কিংবা ভলান্টিয়ার সংক্রান্ত তথ্যের জন্য যোগাযোগ করুন।
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-left">
          
          {/* Left Column: Contact Cards & Info (5 columns) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
              <h3 className="text-lg font-black text-slate-900">সাজেদা ইয়ুথ ফাউন্ডেশন সচিবালয়</h3>

              <div className="space-y-4 text-xs font-medium text-slate-700">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold text-slate-900 block text-xs">অফিস ঠিকানা:</span>
                    <p className="text-slate-600 leading-relaxed">{SYF_BRAND.addressBn}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold text-slate-900 block text-xs">জরুরি হটলাইন:</span>
                    <a href={`tel:${SYF_BRAND.helpline}`} className="text-emerald-700 font-bold hover:underline font-mono">
                      {SYF_BRAND.helpline}
                    </a>
                    <span className="text-slate-500 block text-[11px]">২৪ ঘণ্টা ২৪ দিন খোলা</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold text-slate-900 block text-xs">ইমেইল যোগাযোগ:</span>
                    <a href={`mailto:${SYF_BRAND.email}`} className="text-emerald-700 font-bold hover:underline font-mono">
                      {SYF_BRAND.email}
                    </a>
                  </div>
                </div>
              </div>

              {/* Social links */}
              <div className="pt-4 border-t border-slate-100">
                <span className="text-[11px] font-bold text-slate-500 block mb-2">সামাজিক মাধ্যমে যুক্ত থাকুন:</span>
                <div className="flex items-center gap-2">
                  <a
                    href={SYF_BRAND.facebook}
                    target="_blank"
                    rel="noreferrer"
                    className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center hover:bg-blue-600 hover:text-white transition"
                  >
                    <Facebook className="w-4 h-4" />
                  </a>
                  <a
                    href={SYF_BRAND.youtube}
                    target="_blank"
                    rel="noreferrer"
                    className="w-9 h-9 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center hover:bg-rose-600 hover:text-white transition"
                  >
                    <Youtube className="w-4 h-4" />
                  </a>
                  <a
                    href={SYF_BRAND.instagram}
                    target="_blank"
                    rel="noreferrer"
                    className="w-9 h-9 rounded-xl bg-pink-50 text-pink-600 flex items-center justify-center hover:bg-pink-600 hover:text-white transition"
                  >
                    <Instagram className="w-4 h-4" />
                  </a>
                  <a
                    href={`https://wa.me/${SYF_BRAND.whatsapp}`}
                    target="_blank"
                    rel="noreferrer"
                    className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center hover:bg-emerald-600 hover:text-white transition"
                  >
                    <MessageSquare className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </div>

            {/* Google Map Embed / Location Card */}
            <div className="bg-white rounded-3xl p-4 border border-slate-200 shadow-sm overflow-hidden space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-slate-700 px-1">
                <span>📍 গুগল ম্যাপে আমাদের অবস্থান</span>
                <span className="text-emerald-700 text-[11px]">ধানমন্ডি, ঢাকা</span>
              </div>
              <div className="h-44 rounded-2xl overflow-hidden bg-slate-100 relative">
                <iframe
                  title="Sajeda Youth Foundation Map"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3652.170364956799!2d90.3725893!3d23.7413069!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755b8b7a55cd917%3A0x280e557b7705191f!2sDhanmondi%2C%20Dhaka!5e0!3m2!1sen!2sbd!4v1700000000000!5m2!1sen!2sbd"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </div>
          </div>

          {/* Right Column: Contact Message Form (7 columns) */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-5">
            <div>
              <h3 className="text-lg font-black text-slate-900">সরাসরি বার্তা পাঠান</h3>
              <p className="text-xs text-slate-500 font-medium">আমরা দ্রুততম সময়ে আপনার বার্তার উত্তর দেব</p>
            </div>

            {submitted && (
              <div className="bg-emerald-50 border border-emerald-200 text-emerald-900 p-4 rounded-2xl flex items-center gap-2 text-xs font-bold animate-in fade-in">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <span>আপনার বার্তাটি সফলভাবে পৌঁছেছে। আমাদের প্রতিনিধি দ্রুত আপনার সাথে যোগাযোগ করবেন।</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">আপনার নাম *</label>
                  <input
                    type="text"
                    required
                    placeholder="উদাঃ আরিফুল ইসলাম"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">মোবাইল নম্বর *</label>
                  <input
                    type="tel"
                    required
                    placeholder="০১৭১১-XXXXXX"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">ইমেইল ঠিকানা</label>
                  <input
                    type="email"
                    placeholder="example@mail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">বিষয় *</label>
                  <input
                    type="text"
                    required
                    placeholder="মানবিক আবেদন / পরামর্শ / অনুদান তথ্য"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">আপনার বার্তা / বিস্তারিত বিবরণ *</label>
                <textarea
                  rows={4}
                  required
                  placeholder="আপনার বার্তাটি বিস্তারিত লিখুন..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white font-black text-sm shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>বার্তা পাঠান (Send Message)</span>
              </button>
            </form>
          </div>

        </div>

      </div>
    </section>
  );
};
