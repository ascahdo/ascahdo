import React, { useState } from 'react';
import {
  Globe,
  Sliders,
  Image as ImageIcon,
  Sparkles,
  Save,
  Plus,
  Trash2,
  Edit2,
  CheckCircle2,
  RotateCcw,
  Palette,
  Layers,
  Phone,
  Mail,
  MapPin,
  Eye,
  ExternalLink,
  ShieldCheck,
  Type,
  Share2,
  Search
} from 'lucide-react';
import { useHubBranding } from '../../context/HubBrandingContext';
import { HubBranding, HubId, HubBannerSlide } from '../../types/hubTypes';
import { HubBannerSlider } from './HubBannerSlider';

export const HubAdminBrandingManager: React.FC = () => {
  const {
    hubsData,
    updateHubBranding,
    addHubBanner,
    updateHubBanner,
    deleteHubBanner,
    resetHubToDefault
  } = useHubBranding();

  const [selectedHubId, setSelectedHubId] = useState<HubId>('somiti');
  const [activeTab, setActiveTab] = useState<'branding' | 'banners' | 'preview'>('branding');
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string | null>(null);

  // Active Hub Data
  const currentHub: HubBranding = hubsData[selectedHubId];

  // Editable Form State
  const [formState, setFormState] = useState<HubBranding>(currentHub);

  // Sync state when selectedHubId changes
  React.useEffect(() => {
    setFormState(hubsData[selectedHubId]);
  }, [selectedHubId, hubsData]);

  // New Banner Modal State
  const [showAddBannerModal, setShowAddBannerModal] = useState(false);
  const [newBanner, setNewBanner] = useState<Omit<HubBannerSlide, 'id'>>({
    imageUrl: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=1400&auto=format&fit=crop&q=80',
    title: '',
    titleBn: '',
    subtitle: '',
    subtitleBn: '',
    buttonText: 'Explore More',
    buttonTextBn: 'বিস্তারিত দেখুন',
    buttonLink: '#',
    badge: 'Special Feature',
    badgeBn: 'নতুন ফিচার',
    isActive: true,
    order: (currentHub.banners?.length || 0) + 1
  });

  const handleSaveBranding = (e: React.FormEvent) => {
    e.preventDefault();
    updateHubBranding(selectedHubId, formState);
    setSaveSuccessMsg(`"${formState.nameBn}" এর ব্র্যান্ডিং ও তথ্য সফলভাবে সংরক্ষিত হয়েছে!`);
    setTimeout(() => setSaveSuccessMsg(null), 4000);
  };

  const handleResetToDefault = () => {
    if (window.confirm(`আপনি কি "${currentHub.nameBn}" এর সকল ব্র্যান্ডিং সেটিংস পূর্বাবস্থায় ফিরিয়ে নিতে চান?`)) {
      resetHubToDefault(selectedHubId);
      setSaveSuccessMsg('ডিফল্ট সেটিংসে রিস্টোর করা হয়েছে!');
      setTimeout(() => setSaveSuccessMsg(null), 4000);
    }
  };

  const handleCreateBanner = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBanner.imageUrl || !newBanner.titleBn) {
      alert('অনুগ্রহ করে ব্যানারের ছবি এবং বাংলা শিরোনাম লিখুন');
      return;
    }
    addHubBanner(selectedHubId, newBanner);
    setShowAddBannerModal(false);
    setSaveSuccessMsg('নতুন ব্যানার সফলভাবে যুক্ত হয়েছে!');
    setTimeout(() => setSaveSuccessMsg(null), 4000);
    // Reset banner form
    setNewBanner({
      imageUrl: '',
      title: '',
      titleBn: '',
      subtitle: '',
      subtitleBn: '',
      buttonText: '',
      buttonTextBn: '',
      buttonLink: '',
      badge: '',
      badgeBn: '',
      isActive: true,
      order: 1
    });
  };

  const hubOptions: { id: HubId; labelBn: string; labelEn: string }[] = [
    { id: 'somiti', labelBn: '🏢 মাল্টি-সমিতি হাব', labelEn: 'Multi Somiti Hub' },
    { id: 'training', labelBn: '🎓 কারিগরি ও আইসিটি ট্রেনিং হাব', labelEn: 'Training Hub' },
    { id: 'donation', labelBn: '❤️ সাজেদা চ্যারিটি ও অনুদান হাব', labelEn: 'Donation Hub' },
    { id: 'volunteer', labelBn: '👥 ইয়ুথ ভলান্টিয়ার হাব', labelEn: 'Volunteer Hub' },
    { id: 'blood-bank', labelBn: '🩸 সেন্ট্রাল ব্লাড ব্যাংক ও ডোনার হাব', labelEn: 'Blood Bank Hub' },
    { id: 'school', labelBn: '🏫 একাডেমি ও ডিজিটাল স্কুল হাব', labelEn: 'School Hub' },
    { id: 'medical-courses', labelBn: '🏥 প্যারামেডিকেল ও হেলথকেয়ার হাব', labelEn: 'Medical Hub' },
    { id: 'marriage', labelBn: '💍 শরিয়াহ ম্যারেজ মিডিয়া হাব', labelEn: 'Matrimony Hub' },
    { id: 'marketplace', labelBn: '🛒 হালাল ও অর্গানিক মার্কেটপ্লেস', labelEn: 'Marketplace Hub' },
    { id: 'real-estate', labelBn: '🏢 রিয়েল এস্টেট ও প্লটিং হাব', labelEn: 'Real Estate Hub' },
    { id: 'constitution', labelBn: '📜 সাংগঠনিক গঠনতন্ত্র ও আইন হাব', labelEn: 'Constitution Hub' },
    { id: 'branches', labelBn: '🗺️ ৬৪ জেলা সেন্ট্রাল শাখা নেটওয়ার্ক', labelEn: 'Branch Network Hub' }
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner & Hub Selector Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-200 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2 bg-emerald-100 text-emerald-700 rounded-xl">
                <Sliders className="w-5 h-5" />
              </span>
              <h2 className="text-xl font-bold text-slate-900 font-serif">
                Dynamic Hub Branding & Banner Manager
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              প্রতিটি Hub-এর নাম, লোগো, ব্যানার স্লাইডার, থিম কালার ও কন্টাক্ট ডাইনামিকালি পরিবর্তন করুন
            </p>
          </div>

          {/* Quick Hub Selector Dropdown */}
          <div className="flex items-center gap-3">
            <label className="text-xs font-bold text-slate-700 whitespace-nowrap">
              টার্গেট হাব নির্বাচন:
            </label>
            <select
              value={selectedHubId}
              onChange={(e) => setSelectedHubId(e.target.value as HubId)}
              className="bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs sm:text-sm font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-xs"
            >
              {hubOptions.map((opt) => (
                <option key={opt.id} value={opt.id}>
                  {opt.labelBn}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Sub Tabs: Branding Config, Banner Manager, Live Preview */}
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('branding')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-1.5 ${
                activeTab === 'branding'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <Palette className="w-4 h-4" />
              <span>ব্র্যান্ডিং ও তথ্য সেটিংস</span>
            </button>

            <button
              onClick={() => setActiveTab('banners')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-1.5 ${
                activeTab === 'banners'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <ImageIcon className="w-4 h-4" />
              <span>ব্যানার স্লাইডার ম্যানেজার ({formState.banners?.length || 0})</span>
            </button>

            <button
              onClick={() => setActiveTab('preview')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-1.5 ${
                activeTab === 'preview'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <Eye className="w-4 h-4" />
              <span>লাইভ স্লাইডার প্রিভিউ</span>
            </button>
          </div>

          <button
            onClick={handleResetToDefault}
            className="text-xs text-rose-600 hover:text-rose-700 hover:bg-rose-50 px-3 py-1.5 rounded-lg font-bold transition flex items-center gap-1"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>ডিফল্ট রিস্টোর</span>
          </button>
        </div>

        {saveSuccessMsg && (
          <div className="p-3 bg-emerald-50 border border-emerald-300 text-emerald-800 rounded-xl text-xs font-bold flex items-center gap-2 animate-fadeIn">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{saveSuccessMsg}</span>
          </div>
        )}
      </div>

      {/* TAB 1: BRANDING & CONTACT SETTINGS */}
      {activeTab === 'branding' && (
        <form onSubmit={handleSaveBranding} className="space-y-6">
          {/* Identity & Names */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-4">
            <h3 className="text-sm font-bold text-slate-900 font-serif border-b border-slate-200 pb-2 flex items-center gap-2">
              <Type className="w-4 h-4 text-emerald-600" />
              <span>১. হাব পরিচিতি ও নাম (Identity & Name)</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  বাংলা নাম (Bangla Name) *
                </label>
                <input
                  type="text"
                  value={formState.nameBn}
                  onChange={(e) => setFormState({ ...formState, nameBn: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs text-slate-900 font-semibold focus:ring-2 focus:ring-emerald-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  English Name *
                </label>
                <input
                  type="text"
                  value={formState.name}
                  onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs text-slate-900 font-semibold focus:ring-2 focus:ring-emerald-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  বাংলা ট্যাগলাইন (Tagline Bangla)
                </label>
                <input
                  type="text"
                  value={formState.taglineBn}
                  onChange={(e) => setFormState({ ...formState, taglineBn: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs text-slate-900 focus:ring-2 focus:ring-emerald-500"
                  placeholder="যেমন: স্বচ্ছ হিসাব • নিরাপদ সঞ্চয় • ডিজিটাল ব্যবস্থাপনা"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  English Tagline
                </label>
                <input
                  type="text"
                  value={formState.tagline}
                  onChange={(e) => setFormState({ ...formState, tagline: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs text-slate-900 focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  বাংলা বিবরণ (Hub Description BN)
                </label>
                <textarea
                  rows={2}
                  value={formState.descriptionBn}
                  onChange={(e) => setFormState({ ...formState, descriptionBn: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs text-slate-900 focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>
          </div>

          {/* Visual Assets & Colors */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-4">
            <h3 className="text-sm font-bold text-slate-900 font-serif border-b border-slate-200 pb-2 flex items-center gap-2">
              <Palette className="w-4 h-4 text-emerald-600" />
              <span>২. লোগো ও থিম কালার (Visuals & Colors)</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Hub Logo Image URL
                </label>
                <input
                  type="text"
                  value={formState.logoUrl}
                  onChange={(e) => setFormState({ ...formState, logoUrl: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs text-slate-900 focus:ring-2 focus:ring-emerald-500"
                  placeholder="https://..."
                />
                {formState.logoUrl && (
                  <div className="mt-2 flex items-center gap-2">
                    <img src={formState.logoUrl} alt="Logo Preview" className="w-8 h-8 rounded-lg object-cover border" />
                    <span className="text-[11px] text-slate-500">লোগো প্রিভিউ</span>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Primary Theme Color (Hex)
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={formState.primaryColor}
                    onChange={(e) => setFormState({ ...formState, primaryColor: e.target.value })}
                    className="w-10 h-9 rounded-lg border border-slate-300 cursor-pointer p-0.5"
                  />
                  <input
                    type="text"
                    value={formState.primaryColor}
                    onChange={(e) => setFormState({ ...formState, primaryColor: e.target.value })}
                    className="flex-1 bg-slate-50 border border-slate-300 rounded-xl p-2 text-xs font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  ব্যাজ টেক্সট (Badge Bangla)
                </label>
                <input
                  type="text"
                  value={formState.badgeTextBn}
                  onChange={(e) => setFormState({ ...formState, badgeTextBn: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs text-slate-900 focus:ring-2 focus:ring-emerald-500"
                  placeholder="যেমন: সমবায় ইআরপি"
                />
              </div>
            </div>
          </div>

          {/* Contact & Helplines */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-4">
            <h3 className="text-sm font-bold text-slate-900 font-serif border-b border-slate-200 pb-2 flex items-center gap-2">
              <Phone className="w-4 h-4 text-emerald-600" />
              <span>৩. যোগাযোগ ও হেল্পলাইন (Contact & Social)</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  হটলাইন নম্বর (Contact Phone)
                </label>
                <input
                  type="text"
                  value={formState.contactNumber}
                  onChange={(e) => setFormState({ ...formState, contactNumber: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs text-slate-900 focus:ring-2 focus:ring-emerald-500"
                  placeholder="+880 1711-XXXXXX"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  অফিসিয়াল ইমেইল (Email)
                </label>
                <input
                  type="email"
                  value={formState.email}
                  onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs text-slate-900 focus:ring-2 focus:ring-emerald-500"
                  placeholder="somiti@ascado-ngo.org"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  অফিসের ঠিকানা (Address)
                </label>
                <input
                  type="text"
                  value={formState.addressBn}
                  onChange={(e) => setFormState({ ...formState, addressBn: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs text-slate-900 focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Facebook Page URL
                </label>
                <input
                  type="text"
                  value={formState.socialLinks?.facebook || ''}
                  onChange={(e) =>
                    setFormState({
                      ...formState,
                      socialLinks: { ...formState.socialLinks, facebook: e.target.value }
                    })
                  }
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs text-slate-900 focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  WhatsApp Number
                </label>
                <input
                  type="text"
                  value={formState.socialLinks?.whatsapp || ''}
                  onChange={(e) =>
                    setFormState({
                      ...formState,
                      socialLinks: { ...formState.socialLinks, whatsapp: e.target.value }
                    })
                  }
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs text-slate-900 focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  YouTube Channel URL
                </label>
                <input
                  type="text"
                  value={formState.socialLinks?.youtube || ''}
                  onChange={(e) =>
                    setFormState({
                      ...formState,
                      socialLinks: { ...formState.socialLinks, youtube: e.target.value }
                    })
                  }
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs text-slate-900 focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>
          </div>

          {/* SEO & Meta */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-4">
            <h3 className="text-sm font-bold text-slate-900 font-serif border-b border-slate-200 pb-2 flex items-center gap-2">
              <Globe className="w-4 h-4 text-emerald-600" />
              <span>৪. এসইও ও মেটা ডেটা (SEO & Meta)</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  SEO Meta Title
                </label>
                <input
                  type="text"
                  value={formState.seoTitle}
                  onChange={(e) => setFormState({ ...formState, seoTitle: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs text-slate-900 focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  SEO Meta Description
                </label>
                <input
                  type="text"
                  value={formState.seoDescription}
                  onChange={(e) => setFormState({ ...formState, seoDescription: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs text-slate-900 focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>
          </div>

          {/* Save Action Bar */}
          <div className="flex items-center justify-end gap-3 sticky bottom-4 z-30 bg-white/95 backdrop-blur-md p-4 rounded-2xl border border-slate-200 shadow-xl">
            <button
              type="submit"
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm px-6 py-2.5 rounded-xl shadow-md transition flex items-center gap-2 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>পরিবর্তন সংরক্ষণ করুন (Save Branding)</span>
            </button>
          </div>
        </form>
      )}

      {/* TAB 2: BANNER SLIDER MANAGER */}
      {activeTab === 'banners' && (
        <div className="space-y-6">
          {/* Action Header */}
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900 font-serif">
                {formState.nameBn} - ব্যানার স্লাইডার লিস্ট
              </h3>
              <p className="text-xs text-slate-500">
                হোমপেজের হিরো সেকশনে প্রদর্শিত ব্যানারসমূহ পরিচালনা করুন
              </p>
            </div>
            <button
              onClick={() => setShowAddBannerModal(true)}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm px-4 py-2 rounded-xl shadow-xs transition flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>নতুন ব্যানার যুক্ত করুন</span>
            </button>
          </div>

          {/* Banners Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {formState.banners?.map((banner, idx) => (
              <div
                key={banner.id}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm flex flex-col justify-between"
              >
                {/* Banner Thumbnail */}
                <div className="relative aspect-[16/8] bg-slate-950 overflow-hidden">
                  <img
                    src={banner.imageUrl}
                    alt={banner.titleBn}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-3 flex flex-col justify-between text-white">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold bg-black/60 px-2 py-0.5 rounded backdrop-blur-xs text-amber-300">
                        স্লাইড #{idx + 1}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                          banner.isActive ? 'bg-emerald-600' : 'bg-slate-600'
                        }`}
                      >
                        {banner.isActive ? 'সক্রিয়' : 'নিষ্ক্রিয়'}
                      </span>
                    </div>

                    <div>
                      <span className="text-[10px] bg-sky-600/80 px-2 py-0.5 rounded font-bold">
                        {banner.badgeBn || banner.badge}
                      </span>
                      <h4 className="font-bold text-sm line-clamp-1 mt-1 text-white">
                        {banner.titleBn || banner.title}
                      </h4>
                    </div>
                  </div>
                </div>

                {/* Banner Meta & Actions */}
                <div className="p-4 space-y-3">
                  <p className="text-xs text-slate-600 line-clamp-2">
                    {banner.subtitleBn || banner.subtitle}
                  </p>

                  <div className="flex items-center justify-between text-xs text-slate-500 border-t border-slate-100 pt-2">
                    <span>বাটন: {banner.buttonTextBn || 'নাই'}</span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() =>
                          updateHubBanner(selectedHubId, banner.id, {
                            isActive: !banner.isActive
                          })
                        }
                        className={`text-xs font-bold px-2 py-1 rounded transition ${
                          banner.isActive
                            ? 'bg-amber-100 text-amber-800 hover:bg-amber-200'
                            : 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                        }`}
                      >
                        {banner.isActive ? 'পজ করুন' : 'চালু করুন'}
                      </button>

                      <button
                        onClick={() => {
                          if (window.confirm('আপনি কি এই ব্যানারটি মুছে ফেলতে চান?')) {
                            deleteHubBanner(selectedHubId, banner.id);
                          }
                        }}
                        className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition"
                        title="মুছে ফেলুন"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: LIVE SLIDER PREVIEW */}
      {activeTab === 'preview' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-4">
          <div className="border-b border-slate-200 pb-3">
            <h3 className="text-base font-bold text-slate-900 font-serif">
              {formState.nameBn} - লাইভ হিরো ব্যানার স্লাইডার প্রিভিউ
            </h3>
            <p className="text-xs text-slate-500">
              হোমপেজে ইউজাররা ব্যানারটি যেভাবে দেখবে তার লাইভ ইন্টারঅ্যাক্টিভ প্রিভিউ
            </p>
          </div>

          <HubBannerSlider
            banners={formState.banners || []}
            primaryColor={formState.primaryColor}
          />
        </div>
      )}

      {/* MODAL: ADD NEW BANNER */}
      {showAddBannerModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-xl w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="text-base font-bold text-slate-900 font-serif">
                নতুন স্লাইডার ব্যানার যুক্ত করুন
              </h3>
              <button
                onClick={() => setShowAddBannerModal(false)}
                className="text-slate-400 hover:text-slate-700"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateBanner} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  ব্যানারের ছবি URL *
                </label>
                <input
                  type="text"
                  value={newBanner.imageUrl}
                  onChange={(e) => setNewBanner({ ...newBanner, imageUrl: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs text-slate-900"
                  placeholder="https://images.unsplash.com/..."
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  বাংলা প্রধান শিরোনাম (Title BN) *
                </label>
                <input
                  type="text"
                  value={newBanner.titleBn}
                  onChange={(e) => setNewBanner({ ...newBanner, titleBn: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs text-slate-900"
                  placeholder="যেমন: নিরাপদ সঞ্চয় ও সহজ ঋণ"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  English Title
                </label>
                <input
                  type="text"
                  value={newBanner.title}
                  onChange={(e) => setNewBanner({ ...newBanner, title: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs text-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  বাংলা উপ-শিরোনাম / বিবরণ (Subtitle BN)
                </label>
                <textarea
                  rows={2}
                  value={newBanner.subtitleBn}
                  onChange={(e) => setNewBanner({ ...newBanner, subtitleBn: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs text-slate-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    বাটন টেক্সট (বাংলা)
                  </label>
                  <input
                    type="text"
                    value={newBanner.buttonTextBn}
                    onChange={(e) => setNewBanner({ ...newBanner, buttonTextBn: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs text-slate-900"
                    placeholder="সদস্য লগইন"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    বাটন লিঙ্ক (Route/URL)
                  </label>
                  <input
                    type="text"
                    value={newBanner.buttonLink}
                    onChange={(e) => setNewBanner({ ...newBanner, buttonLink: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs text-slate-900"
                    placeholder="#erp বা https://..."
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowAddBannerModal(false)}
                  className="px-4 py-2 bg-slate-200 text-slate-700 font-bold rounded-xl text-xs"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs shadow-md"
                >
                  ব্যানার সেভ করুন
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
