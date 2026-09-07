import React, { useState, useEffect } from 'react';
import { useTranslation } from '../locales/i18nContext';
import {
  Users, ShieldCheck, Award, MapPin, CheckCircle, HeartHandshake,
  UserPlus, Phone, Mail, Sparkles, ArrowRight, Star, Calendar,
  Clock, CheckCircle2, ChevronRight, Share2, Compass, Droplet,
  GraduationCap, HelpCircle, Send, Heart, Play
} from 'lucide-react';
import { api } from '../services/api';
import { BANGLADESH_DISTRICTS } from '../data/bangladeshLocations';

export const VolunteerPage: React.FC = () => {
  const { isBn } = useTranslation();
  const [volunteers, setVolunteers] = useState<any[]>([]);
  const [showRegForm, setShowRegForm] = useState(false);
  const [activeTab, setActiveTab] = useState<'home' | 'mission' | 'fleet' | 'projects' | 'stories' | 'events'>('home');

  // Form states
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [district, setDistrict] = useState('Dhaka');
  const [upazila, setUpazila] = useState('Dhanmondi');
  const [rolePreference, setRolePreference] = useState('Disaster & Relief Force');
  const [skills, setSkills] = useState('First Aid, Blood Coordination');
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchVols = async () => {
      try {
        const res = await api.getVolunteers();
        setVolunteers(res || []);
      } catch (err) {
        console.error(err);
      }
    };
    fetchVols();
  }, []);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const skillsArray = skills.split(',').map((s) => s.trim());
      await api.registerVolunteer({
        fullName,
        phone,
        email,
        district,
        upazila,
        skills: [...skillsArray, rolePreference]
      });
      setSubmitted(true);
      setShowRegForm(false);
      const updated = await api.getVolunteers();
      setVolunteers(updated || []);
    } catch (err) {
      alert('Registration failed');
    } finally {
      setSubmitting(false);
    }
  };

  const currentDistrictInfo = Object.values(BANGLADESH_DISTRICTS).find(
    (d) => d.name.toLowerCase() === district.toLowerCase()
  );

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-teal-600 selection:text-white">
      
      {/* 1. DEDICATED VOLUNTEER PORTAL TOP NAVBAR */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          
          {/* Logo & Portal Identity */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-teal-600 to-emerald-500 text-white flex items-center justify-center shadow-md font-black">
              <HeartHandshake className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
                  {isBn ? 'আসকাডো ভলান্টিয়ার ফোর্স' : 'ASCADO Volunteer Network'}
                </span>
                <span className="bg-teal-100 text-teal-800 text-[10px] font-black px-2 py-0.5 rounded-full uppercase">
                  {isBn ? 'যুব সমাজসেবা' : 'Youth Force'}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium">
                {isBn ? '৬৪ জেলায় সক্রিয় সমাজকর্মী ও ত্রাণ ব্রিগেড' : 'Active Humanitarian Volunteer Network'}
              </p>
            </div>
          </div>

          {/* Sub Navigation Links */}
          <nav className="hidden lg:flex items-center gap-6 text-xs font-bold text-slate-600">
            <button
              onClick={() => { setActiveTab('home'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              className={`hover:text-teal-600 transition ${activeTab === 'home' ? 'text-teal-600 font-black' : ''}`}
            >
              {isBn ? 'হোম' : 'Home'}
            </button>
            <a href="#mission" className="hover:text-teal-600 transition">
              {isBn ? 'আমাদের লক্ষ্য' : 'Our Mission'}
            </a>
            <a href="#join" className="hover:text-teal-600 transition">
              {isBn ? 'নিবন্ধন ফরম' : 'Volunteer Form'}
            </a>
            <a href="#projects" className="hover:text-teal-600 transition">
              {isBn ? 'সেবামূলক প্রজেক্ট' : 'Our Projects'}
            </a>
            <a href="#stories" className="hover:text-teal-600 transition">
              {isBn ? 'বাস্তব গল্প' : 'Impact Stories'}
            </a>
            <a href="#fleet" className="hover:text-teal-600 transition">
              {isBn ? 'সক্রিয় সদস্য তালিকা' : 'Active Fleet'}
            </a>
          </nav>

          {/* Top Action CTA Button */}
          <div className="flex items-center gap-2.5">
            <a
              href="#join"
              onClick={() => setShowRegForm(true)}
              className="bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white text-xs font-black px-4 sm:px-5 py-2.5 rounded-xl shadow-md transition transform hover:-translate-y-0.5 flex items-center gap-1.5 cursor-pointer"
            >
              <UserPlus className="w-4 h-4" />
              <span>{isBn ? 'স্বেচ্ছাসেবক হোন' : 'Join as Volunteer'}</span>
            </a>
          </div>

        </div>
      </header>

      {/* 2. DEDICATED HERO SECTION (Matching User Template Style) */}
      <section className="relative bg-gradient-to-r from-slate-950 via-teal-950 to-slate-900 text-white overflow-hidden py-14 sm:py-20 lg:py-24">
        {/* Background Emotional Photo with Gradient Mask */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&q=80&w=1600"
            alt="Volunteers Helping Community"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-center opacity-30 scale-105 filter blur-[0.5px]"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/80 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl space-y-5">
            
            <div className="inline-flex items-center gap-2 bg-teal-500/20 border border-teal-400/40 text-teal-300 text-xs font-black px-3.5 py-1.5 rounded-full uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-teal-400" />
              <span>TOGETHER WE CAN BUILD A BETTER TOMORROW</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-[1.15]">
              মানবতার সেবায় <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-300 via-emerald-300 to-amber-300">
                নিবেদিত তরুণ নেতৃত্ব গড়ে তুলুন
              </span>
            </h1>

            <p className="text-slate-300 text-xs sm:text-sm lg:text-base leading-relaxed">
              {isBn
                ? 'বন্যা-দুর্যোগে জরুরি ত্রাণ বিতরণ, অসহায় রোগীর পাশে দাঁড়ানো, রক্তদান সহায়তা এবং সমাজ বিনির্মাণে আপনিও হোন গর্বিত সমাজকর্মী। ডিজিটাল আইডি কার্ড, অভিজ্ঞতা সনদ ও লিডারশিপ ট্রেনিং সুবিধা।'
                : 'Join our mission to empower communities, provide disaster relief, education, healthcare, and essential resources to those in need.'}
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <a
                href="#join"
                onClick={() => setShowRegForm(true)}
                className="bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-slate-950 font-black text-xs sm:text-sm px-6 py-3.5 rounded-2xl shadow-xl shadow-teal-900/40 transition transform hover:-translate-y-0.5 flex items-center gap-2 cursor-pointer"
              >
                <Heart className="w-4 h-4 fill-slate-950 text-slate-950" />
                <span>{isBn ? 'স্বেচ্ছাসেবক হিসেবে যোগ দিন' : 'Become A Volunteer'}</span>
              </a>

              <a
                href="#mission"
                className="bg-white/10 hover:bg-white/20 text-white font-bold text-xs sm:text-sm px-5 py-3.5 rounded-2xl transition flex items-center gap-2 border border-white/20"
              >
                <span>{isBn ? 'আমাদের লক্ষ্য জানুন' : 'Learn More'}</span>
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>

          </div>
        </div>
      </section>

      {/* 3. OUR MISSION & 4 CORE IMPACT METRICS (Like the user image) */}
      <section id="mission" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          {/* Left: Video / Emotive Photo Frame */}
          <div className="lg:col-span-5 relative group">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-slate-200 aspect-4/3">
              <img
                src="https://images.unsplash.com/photo-1542810634-71277d95dcbb?auto=format&fit=crop&q=80&w=800"
                alt="Volunteers planting trees and helping children"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
              />
              <div className="absolute inset-0 bg-teal-950/20 group-hover:bg-teal-950/10 transition" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-16 h-16 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center shadow-xl ring-8 ring-white/40 cursor-pointer transform group-hover:scale-110 transition">
                  <Play className="w-6 h-6 fill-slate-950 ml-1" />
                </div>
              </div>
            </div>
            <div className="absolute -bottom-4 -right-4 bg-white p-3.5 rounded-2xl shadow-xl border border-slate-100 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center font-black">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-black text-slate-900">{isBn ? 'স্বীকৃত ডিজিটাল সনদ' : 'Verified Certificates'}</p>
                <p className="text-[10px] text-slate-500">{isBn ? 'কিউআর কোড ভেরিফায়েড' : 'Official QR Verifiable'}</p>
              </div>
            </div>
          </div>

          {/* Center-Right: Mission Text + 4 Key Metrics */}
          <div className="lg:col-span-7 space-y-6">
            
            <div className="space-y-2">
              <span className="text-[11px] font-black uppercase text-teal-600 tracking-wider block">
                OUR MISSION & VISION
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-snug">
                {isBn
                  ? 'আমরা বিশ্বাস করি প্রতিটি মানুষের একটি সুন্দর ভবিষ্যৎ প্রাপ্য'
                  : 'We Believe Every Child & Community Deserves A Better Future'}
              </h2>
              <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                {isBn
                  ? 'আমাদের লক্ষ্য সারাদেশে সুবিধাবঞ্চিত মানুষের পাশে দাঁড়ানো, জরুরি চিকিৎসা ও রক্তদান নিশ্চিত করা, মানসম্মত শিক্ষা সহায়তা এবং সমাজকল্যাণমূলক কর্মসূচি পরিচালনা করা।'
                  : 'Our mission is to empower communities, provide education, healthcare, and essential resources to those in need.'}
              </p>
            </div>

            {/* Feature Checklist */}
            <div className="space-y-2.5">
              <div className="flex items-center gap-2.5 text-xs sm:text-sm font-bold text-slate-800">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{isBn ? 'জরুরি দুর্যোগ ও বন্যা মোকাবিলায় সার্বক্ষণিক মাঠপর্যায়ে সেবা' : 'Disaster Relief & Flood Emergency Response'}</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs sm:text-sm font-bold text-slate-800">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{isBn ? 'বিনামূল্যে স্বাস্থ্য ক্যাম্প ও তাৎক্ষণিক রক্তদান সমন্বয়' : 'Healthcare Support & Emergency Blood Coordination'}</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs sm:text-sm font-bold text-slate-800">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{isBn ? 'যুব সমাজ উন্নয়ন, দক্ষতা বৃদ্ধি ও কারিগরি প্রশিক্ষণ' : 'Youth Leadership & Community Empowerment Programs'}</span>
              </div>
            </div>

            {/* 4 Key Metrics Grid (Exactly like the user reference) */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-slate-200">
              <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs text-center space-y-1">
                <div className="w-8 h-8 mx-auto rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center font-bold">
                  <GraduationCap className="w-4 h-4" />
                </div>
                <div className="text-xl sm:text-2xl font-black text-slate-900">25,000+</div>
                <div className="text-[10px] text-slate-500 font-bold">{isBn ? 'সেবাপ্রাপ্ত মানুষ' : 'People Impacted'}</div>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs text-center space-y-1">
                <div className="w-8 h-8 mx-auto rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center font-bold">
                  <Heart className="w-4 h-4" />
                </div>
                <div className="text-xl sm:text-2xl font-black text-slate-900">15,500+</div>
                <div className="text-[10px] text-slate-500 font-bold">{isBn ? 'খাদ্য ও ত্রাণ সহায়তা' : 'Meals & Aid Kits'}</div>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs text-center space-y-1">
                <div className="w-8 h-8 mx-auto rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center font-bold">
                  <MapPin className="w-4 h-4" />
                </div>
                <div className="text-xl sm:text-2xl font-black text-slate-900">340+</div>
                <div className="text-[10px] text-slate-500 font-bold">{isBn ? 'উপজেলা ও ইউনিয়ন' : 'Communities'}</div>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs text-center space-y-1">
                <div className="w-8 h-8 mx-auto rounded-xl bg-rose-50 text-rose-700 flex items-center justify-center font-bold">
                  <Users className="w-4 h-4" />
                </div>
                <div className="text-xl sm:text-2xl font-black text-slate-900">120+</div>
                <div className="text-[10px] text-slate-500 font-bold">{isBn ? 'সক্রিয় সমাজকর্মী' : 'Active Volunteers'}</div>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 4. INTERACTIVE SPLIT ACTION SECTION (Left: Impact / Donation, Right: Volunteer Form) */}
      <section id="join" className="bg-gradient-to-r from-blue-900 via-teal-900 to-emerald-900 text-white py-14 sm:py-20 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            {/* Left: Make An Impact / Support Card */}
            <div className="lg:col-span-5 space-y-5">
              <span className="text-[11px] font-black uppercase text-teal-300 tracking-wider block">
                MAKE AN IMPACT
              </span>
              <h2 className="text-2xl sm:text-3xl font-black leading-tight">
                {isBn ? 'আপনার সক্রিয় অংশগ্রহণ বদলাতে পারে একটি জীবন' : 'Your Participation & Support Can Change Lives'}
              </h2>
              <p className="text-slate-200 text-xs sm:text-sm leading-relaxed">
                {isBn
                  ? 'মাসিক সমাজকল্যাণ কার্যক্রমে অর্থ অনুদান কিংবা শারীরিক শ্রমে সেবাদান—আপনার প্রতিটি অবদান অসহায় মানুষের মুখে হাসি ফোটায়।'
                  : 'Every contribution helps us bring hope and create lasting change in communities.'}
              </p>

              {/* Quick Perks of Joining */}
              <div className="space-y-3 bg-white/10 backdrop-blur-md p-5 rounded-2xl border border-white/20">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-teal-400/20 flex items-center justify-center text-teal-300 font-bold">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-white">{isBn ? 'স্মার্ট ভলান্টিয়ার আইডি কার্ড' : 'Smart Digital Volunteer ID'}</h4>
                    <p className="text-[10px] text-slate-300">{isBn ? 'অনলাইন কিউআর কোড স্ক্যানযোগ্য পরিচিতিপত্র' : 'With online verifiable credentials'}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-emerald-400/20 flex items-center justify-center text-emerald-300 font-bold">
                    <Award className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-white">{isBn ? 'সার্টিফিকেট ও অভিজ্ঞতা সনদ' : 'Appreciation & Service Certificate'}</h4>
                    <p className="text-[10px] text-slate-300">{isBn ? 'চাকরি ও উচ্চশিক্ষায় সহায়ক অফিসিয়াল সনদ' : 'Recognized for career & education'}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-amber-400/20 flex items-center justify-center text-amber-300 font-bold">
                    <Users className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-white">{isBn ? 'দেশব্যাপী যুব নেটওয়ার্ক' : 'National Youth Force'}</h4>
                    <p className="text-[10px] text-slate-300">{isBn ? '৬৪ জেলার সক্রিয় তরুণদের সাথে সংযোগ' : 'Connect across 64 districts'}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Volunteer Application Form (Like user template) */}
            <div className="lg:col-span-7 bg-white text-slate-900 rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-4">
              
              <div className="space-y-1">
                <span className="text-[11px] font-black uppercase text-teal-600 tracking-wider block">
                  JOIN OUR MISSION
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-slate-900">
                  {isBn ? 'স্বেচ্ছাসেবক আবেদন ফরম' : 'Become A Volunteer'}
                </h3>
                <p className="text-xs text-slate-500">
                  {isBn ? 'নিচের তথ্যগুলো পূরণ করে সমাজকর্মী হিসেবে যুক্ত হোন' : 'Join our team of dedicated volunteers and help us make a bigger impact.'}
                </p>
              </div>

              {submitted && (
                <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl flex items-center justify-between text-xs font-bold animate-in fade-in">
                  <span>{isBn ? 'আপনার নিবন্ধন সফল হয়েছে! শীঘ্রই সেন্ট্রাল কোঅর্ডিনেটর যোগাযোগ করবেন।' : 'Application submitted successfully! Our coordinator will reach out.'}</span>
                  <button onClick={() => setSubmitted(false)} className="text-emerald-700 underline text-xs">OK</button>
                </div>
              )}

              <form onSubmit={handleRegister} className="space-y-3.5 text-xs">
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">{isBn ? 'আপনার পূর্ণ নাম' : 'Full Name'} *</label>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="যেমন: তানভীর হোসেন"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-teal-500 font-medium"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">{isBn ? 'ইমেইল অ্যাড্রেস' : 'Email Address'} *</label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@example.com"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-teal-500 font-medium"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">{isBn ? 'মোবাইল নম্বর (হোয়াটসঅ্যাপ)' : 'Phone Number'} *</label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="017XXXXXXXX"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-teal-500 font-medium"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">{isBn ? 'আগ্রহের দায়িত্ব / রোল' : 'Select Role'}</label>
                    <select
                      value={rolePreference}
                      onChange={(e) => setRolePreference(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-teal-500 bg-white font-medium"
                    >
                      <option value="Disaster & Relief Force">জরুরি ত্রাণ ও দুর্যোগ উদ্ধার কর্মী</option>
                      <option value="Blood Coordination Force">ব্লাড ডোনেশন ও রোগী সমন্বয়ক</option>
                      <option value="Education & Child Care">শিক্ষা সহায়তা ও সুবিধাবঞ্চিত শিশু সেবা</option>
                      <option value="Media, ICT & Social Camp">মিডিয়া, আইসিটি ও ইভেন্ট ম্যানেজমেন্ট</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">{isBn ? 'জেলা (District)' : 'District'} *</label>
                    <select
                      value={district}
                      onChange={(e) => {
                        setDistrict(e.target.value);
                        const found = Object.values(BANGLADESH_DISTRICTS).find(d => d.name === e.target.value);
                        if (found && found.upazilas.length > 0) setUpazila(found.upazilas[0]);
                      }}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white font-medium"
                    >
                      {Object.values(BANGLADESH_DISTRICTS).map((d) => (
                        <option key={d.name} value={d.name}>{isBn ? d.nameBn : d.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">{isBn ? 'উপজেলা (Upazila)' : 'Upazila'} *</label>
                    <select
                      value={upazila}
                      onChange={(e) => setUpazila(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white font-medium"
                    >
                      {(currentDistrictInfo?.upazilas || []).map((u) => (
                        <option key={u} value={u}>{u}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">{isBn ? 'আপনার পূর্ব অভিজ্ঞতা বা বিশেষ দক্ষতা' : 'Skills & Special Talents'}</label>
                  <input
                    type="text"
                    value={skills}
                    onChange={(e) => setSkills(e.target.value)}
                    placeholder="যেমন: First Aid, Photography, Teaching, Logistics"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-teal-500 font-medium"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-black text-xs sm:text-sm shadow-lg transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>{submitting ? (isBn ? 'আবেদন পাঠানো হচ্ছে...' : 'Submitting...') : (isBn ? 'আবেদন জমা দিন (Submit Application)' : 'Submit Application')}</span>
                </button>

              </form>

            </div>

          </div>
        </div>
      </section>

      {/* 5. OUR PROJECTS: PROJECTS THAT CREATE REAL CHANGE (Like user template) */}
      <section id="projects" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20 space-y-8">
        
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-[11px] font-black uppercase text-teal-600 tracking-wider">
            OUR ACTIVE PROJECTS
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
            {isBn ? 'যে প্রজেক্টগুলোতে সমাজকর্মীরা কাজ করছেন' : 'Projects That Create Real Change'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            {isBn ? 'সারা বাংলাদেশে আমাদের স্বেচ্ছাসেবী দলগুলো সরাসরি মাঠে যেসব কাজ বাস্তবায়ন করছে' : 'Direct humanitarian work led by our passionate youth force'}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* Project 1 */}
          <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-xl transition group flex flex-col justify-between">
            <div>
              <div className="aspect-4/3 overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&q=80&w=600"
                  alt="Education For All"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                />
              </div>
              <div className="p-5 space-y-2">
                <span className="text-[10px] font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-full">
                  Education & Literacy
                </span>
                <h3 className="font-black text-base text-slate-900 group-hover:text-teal-600 transition">
                  {isBn ? 'সবার জন্য শিক্ষা ও উপকরণ বিতরণ' : 'Education For All'}
                </h3>
                <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                  {isBn ? 'সুবিধাবঞ্চিত শিশুদের বিনামূল্যে বই, খাতা, ব্যাগ ও পাঠদান কর্মসূচি পরিচালনা।' : 'Providing quality education and learning materials to children in underprivileged areas.'}
                </p>
              </div>
            </div>
            <div className="px-5 pb-5 pt-2 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-400">৮২০+ শিশু শিক্ষিত</span>
              <a href="#join" className="text-xs font-black text-teal-600 hover:text-teal-700 flex items-center gap-1">
                <span>{isBn ? 'যুক্ত হোন' : 'Join'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Project 2 */}
          <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-xl transition group flex flex-col justify-between">
            <div>
              <div className="aspect-4/3 overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=600"
                  alt="Healthcare Support"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                />
              </div>
              <div className="p-5 space-y-2">
                <span className="text-[10px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full">
                  Healthcare & Medical
                </span>
                <h3 className="font-black text-base text-slate-900 group-hover:text-rose-600 transition">
                  {isBn ? 'ফ্রি মেডিকেল ও রক্তদান ক্যাম্প' : 'Healthcare Support'}
                </h3>
                <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                  {isBn ? 'প্রত্যন্ত অঞ্চলে বিনামূল্যে চিকিৎসা পরামর্শ ও জরুরি রক্তদান সহায়তা প্রদান।' : 'Offering free healthcare camps and medical support to families in need.'}
                </p>
              </div>
            </div>
            <div className="px-5 pb-5 pt-2 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-400">৩,৪০০+ রোগী চিকিৎসাপ্রাপ্ত</span>
              <a href="#join" className="text-xs font-black text-rose-600 hover:text-rose-700 flex items-center gap-1">
                <span>{isBn ? 'যুক্ত হোন' : 'Join'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Project 3 */}
          <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-xl transition group flex flex-col justify-between">
            <div>
              <div className="aspect-4/3 overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1541976590-713941681591?auto=format&fit=crop&q=80&w=600"
                  alt="Clean Water Initiative"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                />
              </div>
              <div className="p-5 space-y-2">
                <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full">
                  Clean Water & Health
                </span>
                <h3 className="font-black text-base text-slate-900 group-hover:text-blue-600 transition">
                  {isBn ? 'নিরাপদ সুপেয় পানি প্রজেক্ট' : 'Clean Water Initiative'}
                </h3>
                <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                  {isBn ? 'উপকূলীয় ও প্রত্যন্ত অঞ্চলে আর্সেনিকমুক্ত গভীর নলকূপ স্থাপন ও রক্ষণাবেক্ষণ।' : 'Building deep tubewells and providing clean drinking water to rural communities.'}
                </p>
              </div>
            </div>
            <div className="px-5 pb-5 pt-2 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-400">৪৫+ নলকূপ কার্যকর</span>
              <a href="#join" className="text-xs font-black text-blue-600 hover:text-blue-700 flex items-center gap-1">
                <span>{isBn ? 'যুক্ত হোন' : 'Join'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Project 4 */}
          <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-xl transition group flex flex-col justify-between">
            <div>
              <div className="aspect-4/3 overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80&w=600"
                  alt="Environmental Care"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                />
              </div>
              <div className="p-5 space-y-2">
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                  Environment & Climate
                </span>
                <h3 className="font-black text-base text-slate-900 group-hover:text-emerald-600 transition">
                  {isBn ? 'পরিবেশ সংরক্ষণ ও বৃক্ষরোপণ' : 'Environmental Care'}
                </h3>
                <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                  {isBn ? 'গ্রিন বাংলাদেশ ক্যাম্পেইন ও জলবায়ু পরিবর্তনের ক্ষয়ক্ষতি রোধে সবুজায়ন।' : 'Planting trees and promoting environmental sustainability for a better tomorrow.'}
                </p>
              </div>
            </div>
            <div className="px-5 pb-5 pt-2 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-400">১০,০০০+ চারা রোপিত</span>
              <a href="#join" className="text-xs font-black text-emerald-600 hover:text-emerald-700 flex items-center gap-1">
                <span>{isBn ? 'যুক্ত হোন' : 'Join'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

        </div>

      </section>

      {/* 6. WHAT PEOPLE SAY / STORIES OF HOPE AND CHANGE (Like user template) */}
      <section id="stories" className="bg-slate-100 py-14 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-[11px] font-black uppercase text-teal-600 tracking-wider">
              WHAT PEOPLE SAY
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
              {isBn ? 'সমাজসেবার বাস্তব গল্প ও অভিজ্ঞতা' : 'Stories of Hope and Change'}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Review 1 */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-4 relative">
              <span className="text-3xl text-teal-500 font-serif font-black leading-none block">“</span>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed italic">
                {isBn
                  ? 'বন্যা পরিস্থিতিতে আসকাডো ভলান্টিয়ার টিমের সাথে দুর্গম চরাঞ্চলে খাবার ও ওষুধ পৌঁছে দেওয়ার অনুভূতি আমার জীবনের সেরা অভিজ্ঞতা।'
                  : 'Volunteering with this network changed my perspective completely. Being able to serve flood victims directly was truly life-changing.'}
              </p>
              <div className="flex items-center gap-3 pt-3 border-t border-slate-100">
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=120"
                  alt="Volunteer Avatar"
                  referrerPolicy="no-referrer"
                  className="w-10 h-10 rounded-full object-cover ring-2 ring-teal-500"
                />
                <div>
                  <h4 className="font-black text-xs text-slate-900">ফারহানা ইয়াসমিন</h4>
                  <p className="text-[10px] text-teal-700 font-bold">সিলেট জেলা ভলান্টিয়ার লিডার</p>
                </div>
              </div>
            </div>

            {/* Review 2 */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-4 relative">
              <span className="text-3xl text-emerald-500 font-serif font-black leading-none block">“</span>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed italic">
                {isBn
                  ? 'আমাদের এলাকায় আর্সেনিকমুক্ত টিউবওয়েল ও বাচ্চাদের জন্য পাঠাগার করে দেওয়ায় পুরো গ্রামের মানুষ এখন আনন্দিত ও কৃতজ্ঞ।'
                  : 'Their clean water initiative and community learning camps in our village have been a great blessing for our children.'}
              </p>
              <div className="flex items-center gap-3 pt-3 border-t border-slate-100">
                <img
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=120"
                  alt="Beneficiary Avatar"
                  referrerPolicy="no-referrer"
                  className="w-10 h-10 rounded-full object-cover ring-2 ring-emerald-500"
                />
                <div>
                  <h4 className="font-black text-xs text-slate-900">মো: রফিকুল ইসলাম</h4>
                  <p className="text-[10px] text-emerald-700 font-bold">স্থানীয় সমাজকর্মী, কুড়িগ্রাম</p>
                </div>
              </div>
            </div>

            {/* Review 3 */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-4 relative">
              <span className="text-3xl text-blue-500 font-serif font-black leading-none block">“</span>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed italic">
                {isBn
                  ? 'ডিজিটাল আইডি কার্ড ও সুসংগঠিত টিম লিডারশিপের কারণে আমরা যেকোনো জরুরি রক্তদান কল ২ ঘণ্টার মধ্যে নিশ্চিত করতে পারছি।'
                  : 'The verified digital ID badge and rapid coordination framework help us respond to emergency hospital cases in no time.'}
              </p>
              <div className="flex items-center gap-3 pt-3 border-t border-slate-100">
                <img
                  src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=120"
                  alt="Volunteer Avatar"
                  referrerPolicy="no-referrer"
                  className="w-10 h-10 rounded-full object-cover ring-2 ring-blue-500"
                />
                <div>
                  <h4 className="font-black text-xs text-slate-900">আসিফ মাহমুদ</h4>
                  <p className="text-[10px] text-blue-700 font-bold">মেডিকেল উইং কোঅর্ডিনেটর</p>
                </div>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 7. UPCOMING EVENTS & LATEST UPDATES (Side by Side like user template) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left: Upcoming Events */}
          <div className="lg:col-span-6 space-y-5">
            <div>
              <span className="text-[11px] font-black uppercase text-teal-600 tracking-wider">UPCOMING EVENTS</span>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900">{isBn ? 'আসন্ন সমাজসেবা ইভেন্টস' : 'Join Us At Our Events'}</h3>
            </div>

            <div className="space-y-3">
              <div className="bg-white p-4 rounded-2xl border border-slate-200 flex items-center gap-4 shadow-xs hover:border-teal-500 transition">
                <div className="w-14 h-14 rounded-2xl bg-teal-50 text-teal-700 flex flex-col items-center justify-center font-black shrink-0 border border-teal-200">
                  <span className="text-base leading-none">15</span>
                  <span className="text-[10px] uppercase text-teal-600">SEP</span>
                </div>
                <div className="space-y-0.5">
                  <h4 className="font-black text-sm text-slate-900">{isBn ? 'দেশব্যাপী ফ্রি ব্লাড গ্রুপিং ও হেলথ ড্রাইভ' : 'Nationwide Free Blood Grouping & Health Drive'}</h4>
                  <p className="text-[11px] text-slate-500 flex items-center gap-2">
                    <span className="flex items-center gap-1"><MapPin className="w-3 h-3 text-rose-500" /> ঢাকা, চট্টগ্রাম ও রাজশাহী</span>
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3 text-teal-600" /> সকাল ০৯:০০ - বিকাল ০৫:০০</span>
                  </p>
                </div>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-slate-200 flex items-center gap-4 shadow-xs hover:border-teal-500 transition">
                <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-700 flex flex-col items-center justify-center font-black shrink-0 border border-emerald-200">
                  <span className="text-base leading-none">22</span>
                  <span className="text-[10px] uppercase text-emerald-600">SEP</span>
                </div>
                <div className="space-y-0.5">
                  <h4 className="font-black text-sm text-slate-900">{isBn ? 'যুব লিডারশিপ ও ফাস্ট এইড রেসকিউ কর্মশালা' : 'Youth Leadership & First-Aid Rescue Workshop'}</h4>
                  <p className="text-[11px] text-slate-500 flex items-center gap-2">
                    <span className="flex items-center gap-1"><MapPin className="w-3 h-3 text-rose-500" /> সেন্ট্রাল অডিটোরিয়াম</span>
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3 text-teal-600" /> সকাল ১০:০০ - দুপুর ০১:০০</span>
                  </p>
                </div>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-slate-200 flex items-center gap-4 shadow-xs hover:border-teal-500 transition">
                <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-700 flex flex-col items-center justify-center font-black shrink-0 border border-amber-200">
                  <span className="text-base leading-none">28</span>
                  <span className="text-[10px] uppercase text-amber-600">SEP</span>
                </div>
                <div className="space-y-0.5">
                  <h4 className="font-black text-sm text-slate-900">{isBn ? 'উপকূলীয় চরাঞ্চলে বৃক্ষরোপণ কর্মসূচি ২০২৬' : 'Coastal Green Belt Tree Plantation 2026'}</h4>
                  <p className="text-[11px] text-slate-500 flex items-center gap-2">
                    <span className="flex items-center gap-1"><MapPin className="w-3 h-3 text-rose-500" /> নোয়াখালী ও ভোলা অঞ্চল</span>
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3 text-teal-600" /> সারাদিনব্যাপী</span>
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Latest News & Updates */}
          <div className="lg:col-span-6 space-y-5">
            <div>
              <span className="text-[11px] font-black uppercase text-teal-600 tracking-wider">FROM OUR BLOG & PRESS</span>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900">{isBn ? 'সর্বশেষ সংবাদ ও কার্যক্রম' : 'Latest News & Updates'}</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs group">
                <div className="aspect-16/9 overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&q=80&w=400"
                    alt="News 1"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition"
                  />
                </div>
                <div className="p-4 space-y-1.5">
                  <span className="text-[10px] font-bold text-slate-400">১০ সেপ্টেম্বর, ২০২৬</span>
                  <h4 className="font-black text-xs text-slate-900 group-hover:text-teal-600 transition line-clamp-2">
                    {isBn ? 'কীভাবে তরুণরা সমাজের শিক্ষা ব্যবস্থার ইতিবাচক পরিবর্তন আনছে' : 'How Youth Volunteers are Transforming Community Education'}
                  </h4>
                  <a href="#join" className="text-[11px] font-black text-teal-600 flex items-center gap-1 pt-1">
                    <span>{isBn ? 'আরও পড়ুন' : 'Read More'}</span>
                    <ArrowRight className="w-3 h-3" />
                  </a>
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs group">
                <div className="aspect-16/9 overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1532629345422-7515f3d16bb9?auto=format&fit=crop&q=80&w=400"
                    alt="News 2"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition"
                  />
                </div>
                <div className="p-4 space-y-1.5">
                  <span className="text-[10px] font-bold text-slate-400">০৫ সেপ্টেম্বর, ২০২৬</span>
                  <h4 className="font-black text-xs text-slate-900 group-hover:text-teal-600 transition line-clamp-2">
                    {isBn ? '৫টি সহজ উপায় যার মাধ্যমে আপনিও সমাজসেবায় ভূমিকা রাখতে পারেন' : '5 Easy Ways You Can Help Your Local Community'}
                  </h4>
                  <a href="#join" className="text-[11px] font-black text-teal-600 flex items-center gap-1 pt-1">
                    <span>{isBn ? 'আরও পড়ুন' : 'Read More'}</span>
                    <ArrowRight className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 8. ACTIVE FLEET DIRECTORY */}
      <section id="fleet" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-[11px] font-black uppercase text-teal-600 tracking-wider block">OFFICIAL ROSTER</span>
              <h3 className="text-xl font-black text-slate-900 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
                <span>{isBn ? 'সক্রিয় সমাজকর্মী ও লিডার ডিরেক্টরি' : 'Active Volunteer Fleet Directory'}</span>
              </h3>
            </div>
            <span className="bg-teal-100 text-teal-800 text-xs font-black px-3 py-1 rounded-full">
              মোট সদস্য: {volunteers.length} জন
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {volunteers.map((vol) => (
              <div key={vol.id} className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 flex flex-col justify-between space-y-3 hover:border-teal-500 hover:shadow-md transition">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] bg-slate-200 text-slate-800 px-2 py-0.5 rounded-md font-bold">
                      {vol.idCardNumber}
                    </span>
                    <span className="text-[10px] bg-teal-100 text-teal-800 font-bold px-2 py-0.5 rounded-full">
                      {vol.status || 'Active'}
                    </span>
                  </div>
                  <h4 className="font-black text-sm text-slate-900 mt-2">{vol.fullName}</h4>
                  <div className="flex items-center gap-1 text-slate-500 text-xs mt-1">
                    <MapPin className="w-3.5 h-3.5 text-teal-600" />
                    <span>{vol.upazila}, {vol.district}</span>
                  </div>

                  <div className="flex flex-wrap gap-1 mt-2.5">
                    {vol.skills?.map((sk: string) => (
                      <span key={sk} className="bg-white border border-slate-200 text-slate-600 text-[10px] px-2 py-0.5 rounded-md font-medium">
                        {sk}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-200 flex justify-between text-[11px] text-slate-500 font-semibold">
                  <span>{isBn ? 'সেবাদান:' : 'Hours:'} {vol.hoursServed || 12} {isBn ? 'ঘণ্টা' : 'hrs'}</span>
                  <span>{isBn ? 'ইভেন্ট:' : 'Events:'} {vol.eventsCount || 4}</span>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 9. NEWSLETTER / CONNECT BAR (Like user template) */}
      <section className="bg-emerald-950 text-white py-10 border-t border-emerald-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center md:text-left">
            <span className="text-[10px] font-black uppercase text-teal-400 tracking-wider">STAY CONNECTED</span>
            <h4 className="text-xl font-black">{isBn ? 'স্বেচ্ছাসেবা ও মানবিক আপডেটে যুক্ত থাকুন' : 'Subscribe To Our Volunteer Bulletin'}</h4>
            <p className="text-xs text-slate-300">{isBn ? 'সর্বশেষ সমাজসেবামূলক ইভেন্ট ও জরুরি আহ্বানের নোটিফিকেশন পান' : 'Get instant alerts for emergency relief and youth drives.'}</p>
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto">
            <input
              type="email"
              placeholder={isBn ? 'আপনার ইমেইল লিখুন' : 'Enter your email'}
              className="px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs w-full sm:w-64 text-white focus:outline-hidden focus:border-teal-400"
            />
            <button className="px-5 py-2.5 bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs rounded-xl shrink-0 cursor-pointer shadow">
              {isBn ? 'সাবস্ক্রাইব' : 'Subscribe'}
            </button>
          </div>
        </div>
      </section>

      {/* 10. DEDICATED VOLUNTEER PORTAL FOOTER */}
      <footer className="bg-slate-950 text-slate-400 text-xs py-10 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-teal-600 text-white flex items-center justify-center font-bold">
                <HeartHandshake className="w-4 h-4" />
              </div>
              <span className="font-black text-sm text-white">ASCADO Volunteer Force</span>
            </div>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              {isBn ? 'বাংলাদেশ সরকারের সমাজসেবা ও যুব অধিদপ্তরের নীতিমালা অনুসরণে পরিচালিত অরাজনৈতিক স্বেচ্ছাসেবী সংগঠন।' : 'A non-profit youth organization working for emergency response, education, and social empowerment.'}
            </p>
          </div>

          <div className="space-y-2">
            <h5 className="font-black text-white text-xs uppercase tracking-wider">{isBn ? 'জরুরি যোগাযোগ' : 'Contact & Helpline'}</h5>
            <p className="text-[11px]">কেন্দ্রীয় হেল্পলাইন: 01973817167</p>
            <p className="text-[11px]">জরুরি ত্রাণ ইমেইল: volunteer@ascado.org</p>
            <p className="text-[11px]">হেড অফিস: ঢাকা, বাংলাদেশ</p>
          </div>

          <div className="space-y-2">
            <h5 className="font-black text-white text-xs uppercase tracking-wider">{isBn ? 'কুইক লিংক' : 'Quick Links'}</h5>
            <ul className="space-y-1 text-[11px]">
              <li><a href="#mission" className="hover:text-teal-400">আমাদের লক্ষ্য ও উদ্দেশ্য</a></li>
              <li><a href="#join" className="hover:text-teal-400">অনলাইন নিবন্ধন ফরম</a></li>
              <li><a href="#projects" className="hover:text-teal-400">চলমান প্রজেক্ট সমূহ</a></li>
              <li><a href="#fleet" className="hover:text-teal-400">সদস্য ডিরেক্টরি ও আইডি</a></li>
            </ul>
          </div>

          <div className="space-y-2">
            <h5 className="font-black text-white text-xs uppercase tracking-wider">{isBn ? 'স্বীকৃতি ও সনদ' : 'Accreditation'}</h5>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              সক্রিয় সেবাদানকারী সকল সমাজকর্মীকে ডিজিটাল ভলান্টিয়ার আইডি কার্ড এবং প্রাতিষ্ঠানিক অভিজ্ঞতা সনদ প্রদান করা হয়।
            </p>
          </div>

        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 pt-4 border-t border-slate-900 text-center text-[10px] text-slate-500">
          © {new Date().getFullYear()} ASCADO Volunteer & Humanitarian Network. All Rights Reserved.
        </div>
      </footer>

    </div>
  );
};
