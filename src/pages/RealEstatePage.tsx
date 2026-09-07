import React, { useState, useEffect } from 'react';
import { useTranslation } from '../locales/i18nContext';
import {
  Home, ShieldCheck, MapPin, Building, Key, CheckCircle, PlusCircle,
  FileText, Phone, Search, ArrowRight, Building2, Sparkles, Filter,
  CheckCircle2, DollarSign, Calendar, Layers
} from 'lucide-react';
import { api } from '../services/api';
import { BANGLADESH_DISTRICTS } from '../data/bangladeshLocations';

export const RealEstatePage: React.FC = () => {
  const { isBn } = useTranslation();
  const [properties, setProperties] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'all' | 'land' | 'house_rent' | 'flat_sale'>('all');
  const [showAddForm, setShowAddForm] = useState(false);

  // Add form states
  const [title, setTitle] = useState('');
  const [type, setType] = useState('land');
  const [price, setPrice] = useState(2500000);
  const [district, setDistrict] = useState('Dhaka');
  const [upazila, setUpazila] = useState('Dhanmondi');
  const [address, setAddress] = useState('');
  const [areaSize, setAreaSize] = useState('5 Katha');
  const [mouza, setMouza] = useState('');
  const [dagNumber, setDagNumber] = useState('');
  const [khatianNumber, setKhatianNumber] = useState('');
  const [sellerName, setSellerName] = useState('');
  const [sellerPhone, setSellerPhone] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const res = await api.getProperties();
        setProperties(res || []);
      } catch (err) {
        console.error(err);
      }
    };
    fetchProperties();
  }, []);

  const handleAddProperty = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.createProperty({
        title,
        titleBn: title,
        type,
        price: Number(price),
        district,
        upazila,
        address,
        areaSize,
        mouza,
        dagNumber,
        khatianNumber,
        sellerName,
        sellerPhone,
        imageUrl: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&auto=format&fit=crop&q=80'
      });
      setSubmitted(true);
      setShowAddForm(false);
      const updated = await api.getProperties();
      setProperties(updated || []);
    } catch (err) {
      alert('Failed to submit property');
    } finally {
      setLoading(false);
    }
  };

  const filteredProperties = (properties || []).filter(
    (p) => p && (activeTab === 'all' || p.type === activeTab)
  );

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-amber-700 selection:text-white">
      
      {/* 1. DEDICATED TOP NAVBAR FOR REAL ESTATE */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-amber-100 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          
          {/* Logo & Identity */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-700 to-yellow-600 text-white flex items-center justify-center shadow-md font-black">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
                  {isBn ? 'এসকাডো রিয়েল এস্টেট ও প্রপার্টি পয়েন্ট' : 'ASCADO Real Estate & Property Hub'}
                </span>
                <span className="bg-amber-100 text-amber-900 text-[10px] font-black px-2 py-0.5 rounded-full uppercase">
                  {isBn ? 'দলিল যাচাইকৃত' : 'Verified Deeds'}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium">
                {isBn ? 'নিষ্কণ্টক জমি, ফ্ল্যাট বিক্রয় ও পারিবারিক বাসা ভাড়া' : 'Legal Land Records & Verified Rentals'}
              </p>
            </div>
          </div>

          {/* Sub Navigation Links */}
          <nav className="hidden lg:flex items-center gap-6 text-xs font-bold text-slate-600">
            <a href="#listings" className="hover:text-amber-700 transition">
              {isBn ? 'প্রপার্টি লিস্টিং' : 'Listings'}
            </a>
            <a href="#verification" className="hover:text-amber-700 transition">
              {isBn ? 'দলিল ও খতিয়ান যাচাই' : 'Deed Verification'}
            </a>
            <a href="#consultancy" className="hover:text-amber-700 transition">
              {isBn ? 'আইনি পরামর্শ' : 'Legal Advisory'}
            </a>
          </nav>

          {/* Action CTA Button */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="bg-amber-700 hover:bg-amber-800 text-white text-xs font-black px-4 sm:px-5 py-2.5 rounded-xl shadow-md transition flex items-center gap-1.5 cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>{isBn ? 'বিজ্ঞাপন দিন' : 'List Property'}</span>
            </button>
          </div>

        </div>
      </header>

      {/* 2. IMMERSIVE HERO BANNER */}
      <section className="relative bg-gradient-to-r from-slate-950 via-amber-950 to-slate-900 text-white overflow-hidden py-14 sm:py-20 lg:py-24">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=1600"
            alt="Real Estate and Property Architecture"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-center opacity-25 scale-105 filter blur-[0.5px]"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-amber-950/85 to-slate-900/90" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl space-y-5">
            
            <div className="flex flex-wrap items-center gap-2">
              <span className="bg-amber-500/20 text-amber-300 text-xs font-black px-3.5 py-1.5 rounded-full uppercase border border-amber-400/30 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>100% LEGAL & KHATIAN VERIFIED PROPERTIES</span>
              </span>
              <span className="bg-white/10 text-slate-200 text-[11px] font-bold px-3 py-1 rounded-full">
                📞 প্রপার্টি হটলাইন: 01973817167
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-[1.15]">
              নিরাপদ জমি ও আবাসন, <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-200 to-emerald-300">
                ভবিষ্যতের সুদৃঢ় বিনিয়োগ
              </span>
            </h1>

            <p className="text-slate-300 text-xs sm:text-sm lg:text-base leading-relaxed">
              {isBn
                ? 'মৌজা, দাগ ও খতিয়ান যাচাইকৃত শতভাগ নিষ্কণ্টক জমি, আধুনিক আবাসিক ফ্ল্যাট ও পারিবারিক বাসা ভাড়ার প্রিমিয়াম পোর্টাল।'
                : 'Browse verified land plots, commercial buildings, apartment sales, and family rentals with full legal assurance.'}
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => setShowAddForm(!showAddForm)}
                className="bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-500 hover:to-yellow-500 text-white font-black text-xs sm:text-sm px-6 py-3.5 rounded-2xl shadow-xl shadow-amber-950/50 transition transform hover:-translate-y-0.5 flex items-center gap-2 cursor-pointer"
              >
                <PlusCircle className="w-4 h-4" />
                <span>{isBn ? 'আপনার প্রপার্টি পোস্ট করুন' : 'Post Property'}</span>
              </button>

              <a
                href="#listings"
                className="bg-white/10 hover:bg-white/20 text-white font-bold text-xs sm:text-sm px-5 py-3.5 rounded-2xl transition flex items-center gap-2 border border-white/20"
              >
                <span>{isBn ? 'লিস্টিং ব্রাউজ করুন' : 'Browse Listings'}</span>
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>

          </div>
        </div>
      </section>

      {/* 3. 4 KEY METRICS / TRUST COUNTER BAR */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20">
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-200 grid grid-cols-2 lg:grid-cols-4 gap-6 text-center">
          
          <div className="space-y-1">
            <div className="w-10 h-10 mx-auto rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center font-bold">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-slate-900">১০০%</div>
            <div className="text-xs text-slate-500 font-bold">{isBn ? 'দলিল ও খতিয়ান যাচাই' : 'Verified Legal Titles'}</div>
          </div>

          <div className="space-y-1">
            <div className="w-10 h-10 mx-auto rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <Home className="w-5 h-5" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-slate-900">৪৫০+</div>
            <div className="text-xs text-slate-500 font-bold">{isBn ? 'সক্রিয় প্রপার্টি লিস্টিং' : 'Active Properties'}</div>
          </div>

          <div className="space-y-1">
            <div className="w-10 h-10 mx-auto rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
              <Building className="w-5 h-5" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-slate-900">০%</div>
            <div className="text-xs text-slate-500 font-bold">{isBn ? 'হিডেন কোনো চার্জ নেই' : 'No Hidden Charges'}</div>
          </div>

          <div className="space-y-1">
            <div className="w-10 h-10 mx-auto rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold">
              <Phone className="w-5 h-5" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-slate-900">২৪/৭</div>
            <div className="text-xs text-slate-500 font-bold">{isBn ? 'আইনি ও সাইট ভিজিট হেল্প' : 'Support & Site Visit'}</div>
          </div>

        </div>
      </section>

      {/* 4. MAIN LISTINGS & SUBMISSION DRAWER */}
      <section id="listings" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 space-y-8">
        
        {/* Success Alert */}
        {submitted && (
          <div className="p-5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-3xl flex items-center justify-between text-xs font-semibold animate-in fade-in">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>{isBn ? 'ধন্যবাদ! আপনার প্রপার্টির তথ্য সফলভাবে যুক্ত করা হয়েছে।' : 'Property submitted successfully!'}</span>
            </div>
            <button onClick={() => setSubmitted(false)} className="text-emerald-700 underline font-bold">
              ✕
            </button>
          </div>
        )}

        {/* Add Property Form Modal/Collapsible */}
        {showAddForm && (
          <div className="bg-white rounded-3xl border-2 border-amber-400 p-6 sm:p-8 shadow-2xl space-y-4 animate-in fade-in">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <span className="text-[11px] font-black uppercase text-amber-700 tracking-wider">NEW LISTING</span>
                <h3 className="font-black text-xl text-slate-900 flex items-center gap-2">
                  <PlusCircle className="w-5 h-5 text-amber-700" />
                  <span>{isBn ? 'নতুন জমি / ফ্ল্যাট / বাসা ভাড়ার বিজ্ঞাপন' : 'Add New Property Listing'}</span>
                </h3>
              </div>
              <button
                onClick={() => setShowAddForm(false)}
                className="text-slate-400 hover:text-slate-700 font-bold text-xs"
              >
                ✕ {isBn ? 'বন্ধ করুন' : 'Close'}
              </button>
            </div>

            <form onSubmit={handleAddProperty} className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div className="sm:col-span-2">
                <label className="block font-bold text-slate-700 mb-1">{isBn ? 'বিজ্ঞাপনের শিরোনাম' : 'Listing Title'} *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="যেমন: নোয়াখালী মাইজদীতে ৫ শতক নিষ্কণ্টক ভিটি জমি বিক্রয়"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-amber-500 font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">{isBn ? 'ক্যাটাগরি' : 'Type'} *</label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-bold text-slate-800 bg-white"
                >
                  <option value="land">{isBn ? 'জমি / প্লট (Land)' : 'Land / Plot'}</option>
                  <option value="flat_sale">{isBn ? 'ফ্ল্যাট বিক্রয় (Flat Sale)' : 'Flat Sale'}</option>
                  <option value="house_rent">{isBn ? 'বাসা ভাড়া (House Rent)' : 'House Rent'}</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">{isBn ? 'মূল্য / ভাড়া (টাকা)' : 'Price / Rent (BDT)'} *</label>
                <input
                  type="number"
                  required
                  value={price}
                  onChange={(e) => setPrice(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-bold"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">{isBn ? 'আয়তন / পরিমাপ' : 'Area Size'} *</label>
                <input
                  type="text"
                  required
                  value={areaSize}
                  onChange={(e) => setAreaSize(e.target.value)}
                  placeholder="যেমন: ৫ শতক / ১২৫০ স্কয়ারফিট"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">{isBn ? 'মৌজা ও দাগ নং (প্রযোজ্য ক্ষেত্রে)' : 'Mouza & Dag No'}</label>
                <input
                  type="text"
                  value={dagNumber}
                  onChange={(e) => setDagNumber(e.target.value)}
                  placeholder="দাগ নং ১২৩৪, খতিয়ান নং ৫৬"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">{isBn ? 'মালিক / এজেন্টের নাম' : 'Contact Person'} *</label>
                <input
                  type="text"
                  required
                  value={sellerName}
                  onChange={(e) => setSellerName(e.target.value)}
                  placeholder="আপনার নাম"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">{isBn ? 'মোবাইল নম্বর' : 'Phone'} *</label>
                <input
                  type="tel"
                  required
                  value={sellerPhone}
                  onChange={(e) => setSellerPhone(e.target.value)}
                  placeholder="017XXXXXXXX"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-mono"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">{isBn ? 'ঠিকানা / লোকেশন' : 'Address'} *</label>
                <input
                  type="text"
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="মাইজদী কোর্ট, নোয়াখালী"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-medium"
                />
              </div>

              <div className="sm:col-span-3 flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="px-4 py-2.5 text-slate-600 font-bold"
                >
                  {isBn ? 'বাতিল' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2.5 bg-amber-700 hover:bg-amber-800 text-white font-bold rounded-xl shadow cursor-pointer"
                >
                  {loading ? (isBn ? 'সংরক্ষণ হচ্ছে...' : 'Saving...') : (isBn ? 'বিজ্ঞাপন প্রকাশ করুন' : 'Publish Listing')}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Filter Navigation Bar */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-[11px] font-black uppercase text-amber-700 tracking-wider">BROWSE LISTINGS</span>
            <h3 className="text-xl font-black text-slate-900">
              {isBn ? 'যাচাইকৃত প্রপার্টি ও আবাসন সমূহ' : 'Verified Property Catalog'}
            </h3>
          </div>

          <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-2xl">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-4 py-2 rounded-xl text-xs font-black transition ${
                activeTab === 'all' ? 'bg-amber-700 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {isBn ? 'সকল' : 'All'}
            </button>
            <button
              onClick={() => setActiveTab('land')}
              className={`px-4 py-2 rounded-xl text-xs font-black transition ${
                activeTab === 'land' ? 'bg-amber-700 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {isBn ? 'জমি / প্লট' : 'Land'}
            </button>
            <button
              onClick={() => setActiveTab('flat_sale')}
              className={`px-4 py-2 rounded-xl text-xs font-black transition ${
                activeTab === 'flat_sale' ? 'bg-amber-700 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {isBn ? 'ফ্ল্যাট বিক্রয়' : 'Flats'}
            </button>
            <button
              onClick={() => setActiveTab('house_rent')}
              className={`px-4 py-2 rounded-xl text-xs font-black transition ${
                activeTab === 'house_rent' ? 'bg-amber-700 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {isBn ? 'বাসা ভাড়া' : 'Rentals'}
            </button>
          </div>
        </div>

        {/* Property Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProperties.map((p) => (
            <div
              key={p.id}
              className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-xl transition group flex flex-col justify-between"
            >
              <div>
                <div className="h-56 overflow-hidden relative bg-slate-100">
                  <img
                    src={p.imageUrl || 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&auto=format&fit=crop&q=80'}
                    alt={p.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                  />
                  <div className="absolute top-3 left-3 bg-slate-950/80 backdrop-blur-md text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase">
                    {p.type === 'land' ? 'জমি / প্লট' : p.type === 'flat_sale' ? 'ফ্ল্যাট বিক্রয়' : 'বাসা ভাড়া'}
                  </div>
                  <div className="absolute top-3 right-3 bg-emerald-500 text-white text-[10px] font-black px-2.5 py-1 rounded-full flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3" />
                    <span>দলিল যাচাইকৃত</span>
                  </div>
                </div>

                <div className="p-5 space-y-3">
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span className="flex items-center gap-1 font-medium">
                      <MapPin className="w-3.5 h-3.5 text-amber-700" />
                      <span>{p.address || p.district}</span>
                    </span>
                    <span className="font-bold text-slate-700">{p.areaSize || '৫ শতক'}</span>
                  </div>

                  <h4 className="font-black text-base text-slate-900 group-hover:text-amber-700 transition line-clamp-2">
                    {p.title}
                  </h4>

                  {p.dagNumber && (
                    <div className="text-[11px] bg-slate-50 p-2 rounded-xl text-slate-600 font-mono">
                      দাগ নং: {p.dagNumber} | খতিয়ান: {p.khatianNumber || 'যাচাইকৃত'}
                    </div>
                  )}
                </div>
              </div>

              <div className="p-5 pt-3 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 block font-bold">মূল্য / Price</span>
                  <span className="text-lg font-black text-slate-900">৳{(p.price || 0).toLocaleString('bn-BD')}</span>
                </div>
                <a
                  href={`tel:${p.sellerPhone || '01973817167'}`}
                  className="px-4 py-2.5 rounded-xl bg-amber-700 hover:bg-amber-800 text-white font-black text-xs shadow transition cursor-pointer flex items-center gap-1.5"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>{isBn ? 'সরাসরি কল' : 'Call'}</span>
                </a>
              </div>
            </div>
          ))}
        </div>

      </section>

      {/* 5. LEGAL ASSURANCE SECTION */}
      <section id="verification" className="bg-slate-100 py-14 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-[11px] font-black uppercase text-amber-700 tracking-wider">
              LEGAL SECURITY & DUE DILIGENCE
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
              {isBn ? 'জমির নিষ্কণ্টকতা ও লিগ্যাল ভেরিফিকেশন' : 'Title Deed & Land Records Verification'}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center font-black">
                <FileText className="w-5 h-5" />
              </div>
              <h3 className="font-black text-base text-slate-900">{isBn ? 'খতিয়ান ও পরচা তল্লাশি' : 'Khatian & Porcha Audit'}</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                সিএস, এসএ, আরএস ও সিটি জরিপের রেকর্ড পর্যালোচনা করে দাগের শতভাগ ধারাবাহিক মালিকানা যাচাই করা হয়।
              </p>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-black">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="font-black text-base text-slate-900">{isBn ? 'দাখিলা ও খাজনা চেক' : 'Mutation & Tax Check'}</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                নামজারি ও হাল সনের ভূমি উন্নয়ন কর পরিশোধিত কিনা তা স্থানীয় ভূমি অফিস থেকে শতভাগ কনফার্ম করা হয়।
              </p>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-black">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <h3 className="font-black text-base text-slate-900">{isBn ? 'নিষ্কণ্টক সাইট হ্যান্ডওভার' : 'Conflict-Free Handover'}</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                কোনো প্রকার মামলা বা ওয়ারিশান জটিলতা নেই এমন জমিতে সীমানা প্রাচীর দিয়ে নিশ্চিত মালিকানা হস্তান্তর।
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* 6. DEDICATED REAL ESTATE FOOTER */}
      <footer className="bg-slate-950 text-slate-400 text-xs py-10 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-amber-700 text-white flex items-center justify-center font-bold">
                <Building2 className="w-4 h-4" />
              </div>
              <span className="font-black text-sm text-white">ASCADO Real Estate</span>
            </div>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              স্বচ্ছ, দালালমুক্ত ও শতভাগ লিগ্যাল ডকুমেন্টেশন সম্পন্ন জমি ক্রয়-বিক্রয় ও পারিবারিক বাসা ভাড়ার ডিজিটাল প্ল্যাটফর্ম।
            </p>
          </div>

          <div className="space-y-2">
            <h5 className="font-black text-white text-xs uppercase tracking-wider">{isBn ? 'যোগাযোগ ও সাইট ভিজিট' : 'Site Visit Booking'}</h5>
            <p className="text-[11px]">হটলাইন: 01973817167</p>
            <p className="text-[11px]">বিকল্প লাইন: 01813817167</p>
            <p className="text-[11px]">ইমেইল: realestate@ascado.org</p>
          </div>

          <div className="space-y-2">
            <h5 className="font-black text-white text-xs uppercase tracking-wider">{isBn ? 'প্রপার্টি ক্যাটাগরি' : 'Categories'}</h5>
            <ul className="space-y-1 text-[11px]">
              <li><a href="#listings" className="hover:text-amber-400">ভিটি জমি ও প্লট</a></li>
              <li><a href="#listings" className="hover:text-amber-400">রেডি ফ্ল্যাট বিক্রয়</a></li>
              <li><a href="#listings" className="hover:text-amber-400">ফ্যামিলি বাসা ভাড়া</a></li>
            </ul>
          </div>

          <div className="space-y-2">
            <h5 className="font-black text-white text-xs uppercase tracking-wider">{isBn ? 'আমাদের মূলনীতি' : 'Principles'}</h5>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              ভুয়া বা মামলাযুক্ত কোনো প্রপার্টি এখানে লিস্টিং করা হয় না। প্রতিটি লিস্টিং ফিল্ড অফিসার দ্বারা সরেজমিনে যাচাইকৃত।
            </p>
          </div>

        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 pt-4 border-t border-slate-900 text-center text-[10px] text-slate-500">
          © {new Date().getFullYear()} ASCADO Real Estate & Property Point. All Rights Reserved.
        </div>
      </footer>

    </div>
  );
};
