import React, { useState, useEffect } from 'react';
import { useTranslation } from '../locales/i18nContext';
import {
  X, Plus, Link, Image as ImageIcon, ExternalLink, Trash2, Edit3,
  CheckCircle2, Sparkles, Megaphone, Eye, MousePointerClick, ToggleLeft,
  ToggleRight, Layout, Tag, Globe, RefreshCw, AlertCircle, Check,
  Zap, Code, Settings, DollarSign, HelpCircle, Shield, Copy, CheckCheck
} from 'lucide-react';
import { api } from '../services/api';
import { AdvertisementItem } from './AdBannerBox';

interface AdManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultPosition?: string;
  onAdUpdated?: () => void;
}

const PRESET_BANNERS = [
  {
    name: 'আইটি ও এডুকেশন ব্যানার',
    url: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1200&auto=format&fit=crop&q=80'
  },
  {
    name: 'চ্যারিটি ও মানবিক সহায়তা',
    url: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=1200&auto=format&fit=crop&q=80'
  },
  {
    name: 'স্বাস্থ্য ও মেডিকেল ক্যাম্পেইন',
    url: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=1200&auto=format&fit=crop&q=80'
  },
  {
    name: 'জরুরি রক্তদান ও অ্যাম্বুলেন্স',
    url: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?w=600&auto=format&fit=crop&q=80'
  },
  {
    name: 'অর্গানিক ফুড ও এগ্রো বাজার',
    url: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=1200&auto=format&fit=crop&q=80'
  },
  {
    name: 'রিয়েল এস্টেট ও গৃহায়ন প্রজেক্ট',
    url: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1200&auto=format&fit=crop&q=80'
  },
  {
    name: 'ইসলামিক বিবাহ ও ম্যাট্রিমনি',
    url: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=1200&auto=format&fit=crop&q=80'
  }
];

export const AdManagerModal: React.FC<AdManagerModalProps> = ({
  isOpen,
  onClose,
  defaultPosition,
  onAdUpdated
}) => {
  const { isBn } = useTranslation();
  const [activeTab, setActiveTab] = useState<'custom_ads' | 'adsterra_config' | 'adsterra_guide'>('custom_ads');
  const [ads, setAds] = useState<AdvertisementItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [filterPosition, setFilterPosition] = useState<string>(defaultPosition || 'all');
  const [isCreating, setIsCreating] = useState<boolean>(false);
  const [editingAdId, setEditingAdId] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Adsterra Global Configuration State
  const [adsterraConfig, setAdsterraConfig] = useState<any>({
    isEnabled: true,
    publisherId: 'pub-94817290',
    directSmartlinkUrl: 'https://www.highperformancegate.com/smartlink/ascado_direct',
    defaultBannerKey: 'e4d77b8cf650b91e921d74a00508b1a3',
    popunderScriptUrl: '',
    socialBarScriptUrl: '',
    autoFillEmptySlots: true,
    slots: {
      top_leaderboard: { enabled: true, networkType: 'adsterra_banner', key: 'e4d77b8cf650b91e921d74a00508b1a3', width: 728, height: 90 },
      home_mid_banner: { enabled: true, networkType: 'adsterra_direct_link', smartlink: 'https://www.highperformancegate.com/smartlink/ascado_direct' },
      sidebar_box: { enabled: true, networkType: 'adsterra_banner', key: '300x250_adsterra_key_sample', width: 300, height: 250 },
      content_banner: { enabled: true, networkType: 'adsterra_banner', key: 'e4d77b8cf650b91e921d74a00508b1a3', width: 728, height: 90 },
      footer_banner: { enabled: true, networkType: 'adsterra_banner', key: 'e4d77b8cf650b91e921d74a00508b1a3', width: 728, height: 90 }
    }
  });

  // Custom Ad Form State
  const [formData, setFormData] = useState<{
    title: string;
    titleBn: string;
    subtitle: string;
    subtitleBn: string;
    imageUrl: string;
    targetUrl: string;
    internalRoute: string;
    position: 'top_leaderboard' | 'home_mid_banner' | 'sidebar_box' | 'content_banner' | 'footer_banner' | 'all';
    badgeText: string;
    badgeTextEn: string;
    advertiserName: string;
    ctaText: string;
    ctaTextEn: string;
    isActive: boolean;
    networkType: 'custom' | 'adsterra_direct_link' | 'adsterra_banner' | 'adsterra_smartlink';
    adsterraKey: string;
    adsterraScriptCode: string;
    adsterraWidth: number;
    adsterraHeight: number;
  }>({
    title: '',
    titleBn: '',
    subtitle: '',
    subtitleBn: '',
    imageUrl: '',
    targetUrl: '',
    internalRoute: '',
    position: (defaultPosition as any) || 'home_mid_banner',
    badgeText: 'বিজ্ঞাপন',
    badgeTextEn: 'Sponsored',
    advertiserName: '',
    ctaText: 'ওয়েবসাইট দেখুন',
    ctaTextEn: 'Visit Website',
    isActive: true,
    networkType: 'custom',
    adsterraKey: 'e4d77b8cf650b91e921d74a00508b1a3',
    adsterraScriptCode: '',
    adsterraWidth: 728,
    adsterraHeight: 90
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [adsData, astConfig] = await Promise.all([
        api.getAdvertisements('all', false).catch(() => []),
        api.getAdsterraConfig().catch(() => null)
      ]);

      if (Array.isArray(adsData)) {
        setAds(adsData);
      }
      if (astConfig) {
        setAdsterraConfig(astConfig);
      }
    } catch (err) {
      console.error('Failed to load ad manager data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchData();
      setIsCreating(false);
      setEditingAdId(null);
      setSuccessMsg('');
      setErrorMsg('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const resetForm = () => {
    setFormData({
      title: '',
      titleBn: '',
      subtitle: '',
      subtitleBn: '',
      imageUrl: '',
      targetUrl: '',
      internalRoute: '',
      position: 'home_mid_banner',
      badgeText: 'বিজ্ঞাপন',
      badgeTextEn: 'Sponsored',
      advertiserName: '',
      ctaText: 'ওয়েবসাইট দেখুন',
      ctaTextEn: 'Visit Website',
      isActive: true,
      networkType: 'custom',
      adsterraKey: 'e4d77b8cf650b91e921d74a00508b1a3',
      adsterraScriptCode: '',
      adsterraWidth: 728,
      adsterraHeight: 90
    });
    setIsCreating(false);
    setEditingAdId(null);
  };

  const handleEdit = (ad: AdvertisementItem) => {
    setFormData({
      title: ad.title || '',
      titleBn: ad.titleBn || '',
      subtitle: ad.subtitle || '',
      subtitleBn: ad.subtitleBn || '',
      imageUrl: ad.imageUrl || '',
      targetUrl: ad.targetUrl || '',
      internalRoute: ad.internalRoute || '',
      position: ad.position || 'home_mid_banner',
      badgeText: ad.badgeText || 'বিজ্ঞাপন',
      badgeTextEn: ad.badgeTextEn || 'Sponsored',
      advertiserName: ad.advertiserName || '',
      ctaText: ad.ctaText || 'ওয়েবসাইট দেখুন',
      ctaTextEn: ad.ctaTextEn || 'Visit Website',
      isActive: ad.isActive !== false,
      networkType: (ad.networkType as any) || 'custom',
      adsterraKey: ad.adsterraKey || 'e4d77b8cf650b91e921d74a00508b1a3',
      adsterraScriptCode: ad.adsterraScriptCode || '',
      adsterraWidth: ad.adsterraWidth || 728,
      adsterraHeight: ad.adsterraHeight || 90
    });
    setEditingAdId(ad.id);
    setIsCreating(true);
    setActiveTab('custom_ads');
  };

  const handleToggleStatus = async (ad: AdvertisementItem) => {
    try {
      const newStatus = !ad.isActive;
      await api.updateAdvertisement(ad.id, { isActive: newStatus });
      setAds(prev => prev.map(item => item.id === ad.id ? { ...item, isActive: newStatus } : item));
      setSuccessMsg(isBn ? 'বিজ্ঞাপনের স্ট্যাটাস আপডেট হয়েছে' : 'Ad status updated');
      window.dispatchEvent(new CustomEvent('ascado_ads_updated'));
      if (onAdUpdated) onAdUpdated();
    } catch (err) {
      setErrorMsg(isBn ? 'স্ট্যাটাস পরিবর্তন ব্যর্থ হয়েছে' : 'Failed to update status');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm(isBn ? 'আপনি কি এই বিজ্ঞাপনটি মুছে ফেলতে চান?' : 'Are you sure you want to delete this ad?')) return;
    try {
      await api.deleteAdvertisement(id);
      setAds(prev => prev.filter(item => item.id !== id));
      setSuccessMsg(isBn ? 'বিজ্ঞাপন সফলভাবে মুছে ফেলা হয়েছে' : 'Advertisement deleted successfully');
      window.dispatchEvent(new CustomEvent('ascado_ads_updated'));
      if (onAdUpdated) onAdUpdated();
    } catch (err) {
      setErrorMsg(isBn ? 'বিজ্ঞাপন মুছতে সমস্যা হয়েছে' : 'Failed to delete advertisement');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!formData.titleBn && !formData.title) {
      setErrorMsg(isBn ? 'বিজ্ঞাপনের শিরোনাম প্রদান করুন' : 'Please provide an ad title');
      return;
    }

    if (formData.networkType === 'custom' && !formData.imageUrl) {
      setErrorMsg(isBn ? 'ছবির লিংক (Image URL) প্রদান করুন' : 'Please provide an image link');
      return;
    }

    if (formData.networkType === 'custom' && !formData.targetUrl && !formData.internalRoute) {
      setErrorMsg(isBn ? 'ক্লিক করার টার্গেট লিংক (Target URL) দিন' : 'Please provide a target link URL');
      return;
    }

    try {
      if (editingAdId) {
        await api.updateAdvertisement(editingAdId, formData);
        setSuccessMsg(isBn ? 'বিজ্ঞাপন সফলভাবে আপডেট করা হয়েছে!' : 'Advertisement updated successfully!');
      } else {
        await api.createAdvertisement(formData);
        setSuccessMsg(isBn ? 'নতুন বিজ্ঞাপন সফলভাবে যুক্ত করা হয়েছে!' : 'New advertisement created successfully!');
      }

      await fetchData();
      resetForm();
      window.dispatchEvent(new CustomEvent('ascado_ads_updated'));
      if (onAdUpdated) onAdUpdated();
    } catch (err) {
      setErrorMsg(isBn ? 'বিজ্ঞাপন সেভ করতে ব্যর্থ হয়েছে' : 'Failed to save advertisement');
    }
  };

  const handleSaveAdsterraConfig = async () => {
    setErrorMsg('');
    setSuccessMsg('');
    try {
      const res = await api.updateAdsterraConfig(adsterraConfig);
      setAdsterraConfig(res);
      setSuccessMsg(isBn ? 'Adsterra কনফিগারেশন সফলভাবে সেভ হয়েছে!' : 'Adsterra settings saved successfully!');
      window.dispatchEvent(new CustomEvent('ascado_adsterra_updated'));
      if (onAdUpdated) onAdUpdated();
    } catch (err) {
      setErrorMsg(isBn ? 'Adsterra কনফিগারেশন সেভ করতে ব্যর্থ হয়েছে' : 'Failed to save Adsterra settings');
    }
  };

  const copyToClipboard = (text: string, keyName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(keyName);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const filteredAds = filterPosition === 'all'
    ? ads
    : ads.filter(a => a.position === filterPosition || a.position === 'all');

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-5xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="p-5 sm:p-6 bg-gradient-to-r from-slate-950 via-emerald-950 to-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-400 shadow-inner">
              <Megaphone className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg sm:text-xl font-black">
                  {isBn ? 'বিজ্ঞাপন ও Adsterra অ্যাড নেটওয়ার্ক কন্ট্রোল' : 'Advertisement & Adsterra Network Hub'}
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-amber-400 text-slate-950 text-[10px] font-black uppercase flex items-center gap-1">
                  <Zap className="w-3 h-3" />
                  <span>Adsterra Ready</span>
                </span>
              </div>
              <p className="text-xs text-slate-300">
                {isBn
                  ? 'নিজস্ব বিজ্ঞাপন লিংক ও Adsterra ব্যানার / স্মার্টলিংক কোড দিয়ে ওয়েবসাইটে মনিটাইজেশন নিয়ন্ত্রণ করুন'
                  : 'Manage custom sponsor banners and Adsterra monetization codes across website slots'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Navigation Tabs */}
        <div className="flex border-b border-slate-200 bg-slate-100/80 px-4 sm:px-6 gap-2 pt-2">
          <button
            onClick={() => { setActiveTab('custom_ads'); setIsCreating(false); }}
            className={`px-4 py-2.5 rounded-t-xl text-xs font-black transition flex items-center gap-2 cursor-pointer ${
              activeTab === 'custom_ads'
                ? 'bg-white text-emerald-800 border-t-2 border-x border-emerald-600 border-b-white -mb-[1px] shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <Megaphone className="w-4 h-4 text-emerald-600" />
            <span>{isBn ? 'সাধারণ বিজ্ঞাপন ও লিংক' : 'Direct Link Ads'}</span>
            <span className="px-1.5 py-0.2 rounded-full bg-emerald-100 text-emerald-800 text-[10px]">
              {ads.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('adsterra_config')}
            className={`px-4 py-2.5 rounded-t-xl text-xs font-black transition flex items-center gap-2 cursor-pointer ${
              activeTab === 'adsterra_config'
                ? 'bg-white text-emerald-800 border-t-2 border-x border-emerald-600 border-b-white -mb-[1px] shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <DollarSign className="w-4 h-4 text-amber-500" />
            <span>{isBn ? 'Adsterra নেটওয়ার্ক ও কোড সেটিংস' : 'Adsterra Network & Codes'}</span>
            <span className={`w-2 h-2 rounded-full ${adsterraConfig.isEnabled ? 'bg-emerald-500 animate-pulse' : 'bg-slate-300'}`} />
          </button>

          <button
            onClick={() => setActiveTab('adsterra_guide')}
            className={`px-4 py-2.5 rounded-t-xl text-xs font-black transition flex items-center gap-2 cursor-pointer ${
              activeTab === 'adsterra_guide'
                ? 'bg-white text-emerald-800 border-t-2 border-x border-emerald-600 border-b-white -mb-[1px] shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <HelpCircle className="w-4 h-4 text-blue-500" />
            <span>{isBn ? 'Adsterra কোড ব্যবহারের গাইড' : 'Adsterra Quick Guide'}</span>
          </button>
        </div>

        {/* Status Alerts */}
        {successMsg && (
          <div className="bg-emerald-100 border-b border-emerald-200 px-6 py-2.5 flex items-center justify-between text-emerald-800 text-xs font-bold">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>{successMsg}</span>
            </div>
            <button onClick={() => setSuccessMsg('')} className="text-emerald-700 hover:text-emerald-950">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {errorMsg && (
          <div className="bg-rose-100 border-b border-rose-200 px-6 py-2.5 flex items-center justify-between text-rose-800 text-xs font-bold">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600" />
              <span>{errorMsg}</span>
            </div>
            <button onClick={() => setErrorMsg('')} className="text-rose-700 hover:text-rose-950">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Main Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">

          {/* ===================== TAB 1: CUSTOM ADS & LINKS ===================== */}
          {activeTab === 'custom_ads' && (
            <div className="space-y-6">
              {/* Modal Toolbar */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-bold text-slate-600 mr-1">
                    {isBn ? 'স্লট নির্বাচন:' : 'Slot Filter:'}
                  </span>
                  {[
                    { id: 'all', labelBn: 'সকল স্লট', labelEn: 'All Slots' },
                    { id: 'top_leaderboard', labelBn: 'হেডার ব্যানার', labelEn: 'Top Banner' },
                    { id: 'home_mid_banner', labelBn: 'হোমপেজ মিড', labelEn: 'Home Mid' },
                    { id: 'sidebar_box', labelBn: 'সাইডবার বক্স', labelEn: 'Sidebar' },
                    { id: 'content_banner', labelBn: 'ইন-কন্টেন্ট', labelEn: 'In-Content' },
                    { id: 'footer_banner', labelBn: 'প্রি-ফুটার', labelEn: 'Pre-Footer' }
                  ].map(tab => (
                    <button
                      key={tab.id}
                      onClick={() => setFilterPosition(tab.id)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                        filterPosition === tab.id
                          ? 'bg-emerald-700 text-white shadow-sm'
                          : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      {isBn ? tab.labelBn : tab.labelEn}
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      if (isCreating) resetForm();
                      else {
                        resetForm();
                        setIsCreating(true);
                      }
                    }}
                    className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-black shadow flex items-center gap-1.5 transition cursor-pointer"
                  >
                    {isCreating ? (
                      <>
                        <X className="w-4 h-4" />
                        <span>{isBn ? 'ফর্ম বন্ধ করুন' : 'Close Form'}</span>
                      </>
                    ) : (
                      <>
                        <Plus className="w-4 h-4" />
                        <span>{isBn ? 'নতুন বিজ্ঞাপন যোগ করুন' : 'Add New Ad'}</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={fetchData}
                    title={isBn ? 'রিফ্রেশ করুন' : 'Refresh'}
                    className="p-2 rounded-xl bg-white border border-slate-200 text-slate-600 hover:bg-slate-100 transition cursor-pointer"
                  >
                    <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                  </button>
                </div>
              </div>

              {/* Create / Edit Form */}
              {isCreating && (
                <div className="p-5 sm:p-6 rounded-3xl bg-slate-50 border-2 border-emerald-500/50 shadow-md">
                  <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-200">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-black">
                        {editingAdId ? <Edit3 className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                      </div>
                      <h4 className="text-base font-black text-slate-900">
                        {editingAdId
                          ? (isBn ? 'বিজ্ঞাপন সম্পাদনা করুন' : 'Edit Advertisement')
                          : (isBn ? 'নতুন বিজ্ঞাপন ও লিংক তৈরি করুন' : 'Create New Ad with Link')}
                      </h4>
                    </div>

                    {/* Network Type Selector */}
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-600">{isBn ? 'বিজ্ঞাপনের ধরন:' : 'Ad Type:'}</span>
                      <select
                        value={formData.networkType}
                        onChange={e => setFormData({ ...formData, networkType: e.target.value as any })}
                        className="px-2.5 py-1.5 rounded-lg border border-emerald-300 bg-emerald-50 text-emerald-900 text-xs font-black"
                      >
                        <option value="custom">🖼️ সাধারণ ইমেজ ও টার্গেট লিংক</option>
                        <option value="adsterra_direct_link">🔗 Adsterra ডিরেক্ট স্মার্টলিংক</option>
                        <option value="adsterra_banner">⚡ Adsterra ব্যানার (Zone Key)</option>
                      </select>
                    </div>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Title Bangla */}
                      <div>
                        <label className="block text-xs font-black text-slate-700 mb-1">
                          {isBn ? 'বিজ্ঞাপনের শিরোনাম (বাংলা) *' : 'Ad Title (Bengali) *'}
                        </label>
                        <input
                          type="text"
                          required
                          placeholder={isBn ? 'উদাঃ এসকাডো আইটি ডিপ্লোমা কোর্স - ৫০% স্কলারশিপ' : 'e.g. Special Discount Admission'}
                          value={formData.titleBn}
                          onChange={e => setFormData({ ...formData, titleBn: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white"
                        />
                      </div>

                      {/* Title English */}
                      <div>
                        <label className="block text-xs font-black text-slate-700 mb-1">
                          {isBn ? 'শিরোনাম (English)' : 'Ad Title (English)'}
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. ASCADO Professional IT Diploma 2026"
                          value={formData.title}
                          onChange={e => setFormData({ ...formData, title: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white"
                        />
                      </div>

                      {/* Subtitle Bangla */}
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          {isBn ? 'সংক্ষিপ্ত বর্ণনা / ট্যাগলাইন (বাংলা)' : 'Subtitle / Tagline (Bengali)'}
                        </label>
                        <input
                          type="text"
                          placeholder={isBn ? 'উদাঃ লাইভ মেন্টরিং ও ইন্টার্নশিপ সুবিধা' : 'e.g. Live mentoring with internship'}
                          value={formData.subtitleBn}
                          onChange={e => setFormData({ ...formData, subtitleBn: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-500 bg-white"
                        />
                      </div>

                      {/* Slot Position */}
                      <div>
                        <label className="block text-xs font-black text-slate-700 mb-1">
                          {isBn ? 'বিজ্ঞাপন প্রদর্শনের স্থান (Ad Placement Slot) *' : 'Ad Slot Placement *'}
                        </label>
                        <select
                          value={formData.position}
                          onChange={e => setFormData({ ...formData, position: e.target.value as any })}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-500 bg-white font-bold"
                        >
                          <option value="top_leaderboard">🔝 টপ হেডার ব্যানার (Top Leaderboard 728x90)</option>
                          <option value="home_mid_banner">🏠 হোমপেজ মিড ব্যানার (Homepage Mid Banner)</option>
                          <option value="sidebar_box">📌 সাইডবার বিজ্ঞাপন বক্স (Sidebar Ad Box 300x250)</option>
                          <option value="content_banner">📄 ইন-কন্টেন্ট ব্যানার (In-Content Banner)</option>
                          <option value="footer_banner">🔻 প্রি-ফুটার ব্যানার (Pre-Footer Banner)</option>
                          <option value="all">🌐 সর্বত্র (All Positions)</option>
                        </select>
                      </div>
                    </div>

                    {/* ADSTERRA SPECIFIC FIELDS */}
                    {formData.networkType === 'adsterra_banner' ? (
                      <div className="p-4 bg-emerald-50/80 rounded-2xl border border-emerald-300 space-y-3">
                        <div className="flex items-center gap-2">
                          <Zap className="w-4 h-4 text-emerald-600" />
                          <h5 className="text-xs font-black text-emerald-950 uppercase tracking-wide">
                            {isBn ? 'Adsterra ব্যানার কি (Zone Key) সেটিংস' : 'Adsterra Banner Unit Settings'}
                          </h5>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          <div className="sm:col-span-2">
                            <label className="block text-[11px] font-bold text-slate-700 mb-1">
                              {isBn ? 'Adsterra ব্যানার Zone Key *' : 'Adsterra Banner Key *'}
                            </label>
                            <input
                              type="text"
                              required
                              placeholder="e.g. e4d77b8cf650b91e921d74a00508b1a3"
                              value={formData.adsterraKey}
                              onChange={e => setFormData({ ...formData, adsterraKey: e.target.value })}
                              className="w-full px-3 py-2 rounded-xl border border-emerald-300 text-xs font-mono bg-white"
                            />
                            <p className="text-[10px] text-slate-500 mt-1">
                              {isBn ? 'Adsterra ড্যাশবোর্ড থেকে কপি করা Banner Key এখানে দিন' : 'Paste the Zone Key from Adsterra Publisher Dashboard'}
                            </p>
                          </div>

                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <label className="block text-[11px] font-bold text-slate-700 mb-1">Width (px)</label>
                              <input
                                type="number"
                                value={formData.adsterraWidth}
                                onChange={e => setFormData({ ...formData, adsterraWidth: parseInt(e.target.value) || 728 })}
                                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-bold bg-white"
                              />
                            </div>
                            <div>
                              <label className="block text-[11px] font-bold text-slate-700 mb-1">Height (px)</label>
                              <input
                                type="number"
                                value={formData.adsterraHeight}
                                onChange={e => setFormData({ ...formData, adsterraHeight: parseInt(e.target.value) || 90 })}
                                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-bold bg-white"
                              />
                            </div>
                          </div>
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold text-slate-700 mb-1">
                            {isBn ? 'অথবা সম্পূর্ণ Adsterra Script কোড পেস্ট করুন (ঐচ্ছিক):' : 'Or Paste Full Adsterra Script Snippet (Optional):'}
                          </label>
                          <textarea
                            rows={2}
                            placeholder="<script type='text/javascript'>...</script>"
                            value={formData.adsterraScriptCode}
                            onChange={e => setFormData({ ...formData, adsterraScriptCode: e.target.value })}
                            className="w-full p-2.5 rounded-xl border border-slate-300 text-xs font-mono bg-white"
                          />
                        </div>
                      </div>
                    ) : (
                      /* DIRECT IMAGE & TARGET LINK FIELDS */
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Target URL */}
                        <div>
                          <label className="block text-xs font-black text-slate-700 mb-1 flex items-center justify-between">
                            <span className="flex items-center gap-1">
                              <Link className="w-3.5 h-3.5 text-emerald-600" />
                              <span>
                                {formData.networkType === 'adsterra_direct_link'
                                  ? (isBn ? 'Adsterra স্মার্টলিংক URL *' : 'Adsterra Smartlink URL *')
                                  : (isBn ? 'টার্গেট লিঙ্ক (ক্লিক করলে যেখানে যাবে) *' : 'Target Click URL *')}
                              </span>
                            </span>
                          </label>
                          <input
                            type="text"
                            required
                            placeholder={formData.networkType === 'adsterra_direct_link' ? 'https://www.highperformancegate.com/smartlink/...' : 'https://example.com or /school'}
                            value={formData.targetUrl}
                            onChange={e => setFormData({ ...formData, targetUrl: e.target.value })}
                            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-500 bg-white font-mono"
                          />
                        </div>

                        {/* Image Link */}
                        <div>
                          <label className="block text-xs font-black text-slate-700 mb-1 flex items-center justify-between">
                            <span className="flex items-center gap-1">
                              <ImageIcon className="w-3.5 h-3.5 text-emerald-600" />
                              <span>{isBn ? 'বিজ্ঞাপনের ছবির লিঙ্ক (Image URL) *' : 'Banner Image URL *'}</span>
                            </span>
                          </label>
                          <input
                            type="text"
                            required={formData.networkType === 'custom'}
                            placeholder="https://images.unsplash.com/... or image link"
                            value={formData.imageUrl}
                            onChange={e => setFormData({ ...formData, imageUrl: e.target.value })}
                            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-500 bg-white font-mono"
                          />
                        </div>
                      </div>
                    )}

                    {/* Quick Presets for Image if custom */}
                    {formData.networkType === 'custom' && (
                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 mb-1.5">
                          {isBn ? 'অথবা নিচের রেডিমেড ব্যানার ছবি থেকে বেছে নিন:' : 'Or choose from high-res ready banners:'}
                        </label>
                        <div className="flex flex-wrap gap-2">
                          {PRESET_BANNERS.map((preset, idx) => (
                            <button
                              type="button"
                              key={idx}
                              onClick={() => setFormData({ ...formData, imageUrl: preset.url })}
                              className={`px-2.5 py-1 rounded-lg text-xs border transition cursor-pointer ${
                                formData.imageUrl === preset.url
                                  ? 'bg-emerald-600 text-white border-emerald-600'
                                  : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                              }`}
                            >
                              {preset.name}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Advertiser Name & Badge & CTA */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          {isBn ? 'প্রতিষ্ঠান / ব্র্যান্ডের নাম' : 'Advertiser / Brand Name'}
                        </label>
                        <input
                          type="text"
                          placeholder={isBn ? 'উদাঃ Adsterra / এসকাডো' : 'e.g. Adsterra'}
                          value={formData.advertiserName}
                          onChange={e => setFormData({ ...formData, advertiserName: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          {isBn ? 'ব্যাজ লেখা' : 'Badge Label'}
                        </label>
                        <input
                          type="text"
                          placeholder="বিজ্ঞাপন / স্পন্সরড"
                          value={formData.badgeText}
                          onChange={e => setFormData({ ...formData, badgeText: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          {isBn ? 'বাটন লেখা (CTA)' : 'Button CTA Text'}
                        </label>
                        <input
                          type="text"
                          placeholder="ওয়েবসাইট দেখুন / অফার নিন"
                          value={formData.ctaText}
                          onChange={e => setFormData({ ...formData, ctaText: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white"
                        />
                      </div>
                    </div>

                    {/* Form Action Buttons */}
                    <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
                      <button
                        type="button"
                        onClick={resetForm}
                        className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 text-xs font-bold hover:bg-slate-100 transition cursor-pointer"
                      >
                        {isBn ? 'বাতিল' : 'Cancel'}
                      </button>
                      <button
                        type="submit"
                        className="px-6 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-black shadow-lg transition cursor-pointer flex items-center gap-1.5"
                      >
                        <Check className="w-4 h-4" />
                        <span>{editingAdId ? (isBn ? 'আপডেট সম্পন্ন করুন' : 'Update Ad') : (isBn ? 'বিজ্ঞাপন প্রকাশ করুন' : 'Publish Ad')}</span>
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* List of Current Ads */}
              <div className="space-y-4">
                <h4 className="text-sm font-black text-slate-900 flex items-center justify-between">
                  <span>{isBn ? 'বর্তমান সক্রিয় বিজ্ঞাপনের তালিকা:' : 'Active Advertisements List:'}</span>
                  <span className="text-xs text-slate-500 font-normal">
                    {isBn ? `মোট ${filteredAds.length} টি বিজ্ঞাপন পাওয়া গেছে` : `Total ${filteredAds.length} ads found`}
                  </span>
                </h4>

                {filteredAds.length === 0 ? (
                  <div className="text-center py-12 bg-slate-50 rounded-3xl border border-slate-200">
                    <Megaphone className="w-10 h-10 text-slate-400 mx-auto mb-2" />
                    <p className="text-sm font-bold text-slate-600">
                      {isBn ? 'এই স্লটে কোন বিজ্ঞাপন নেই' : 'No advertisements in this slot'}
                    </p>
                    <button
                      onClick={() => setIsCreating(true)}
                      className="mt-3 px-4 py-2 rounded-xl bg-emerald-700 text-white text-xs font-black"
                    >
                      {isBn ? 'বিজ্ঞাপন যোগ করুন' : 'Add Advertisement'}
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-3.5">
                    {filteredAds.map((ad) => (
                      <div
                        key={ad.id}
                        className={`p-4 rounded-2xl border transition-all ${
                          ad.isActive !== false
                            ? 'bg-white border-slate-200 hover:border-emerald-300 shadow-sm'
                            : 'bg-slate-100/80 border-slate-200 opacity-60'
                        } flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4`}
                      >
                        {/* Left: Thumbnail & Info */}
                        <div className="flex items-center gap-3.5 flex-1 min-w-0">
                          <div className="w-16 h-16 rounded-xl overflow-hidden bg-slate-900 flex-shrink-0 border border-slate-200 flex items-center justify-center">
                            {ad.networkType === 'adsterra_banner' ? (
                              <div className="w-full h-full bg-gradient-to-br from-emerald-900 to-slate-900 flex flex-col items-center justify-center text-emerald-400">
                                <Zap className="w-6 h-6" />
                                <span className="text-[9px] font-black text-amber-400">ADSTERRA</span>
                              </div>
                            ) : (
                              <img
                                src={ad.imageUrl}
                                alt={ad.titleBn}
                                className="w-full h-full object-cover"
                              />
                            )}
                          </div>

                          <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap items-center gap-2 mb-1">
                              <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-black uppercase">
                                {isBn ? (ad.badgeText || 'বিজ্ঞাপন') : (ad.badgeTextEn || 'Sponsored')}
                              </span>
                              <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[10px] font-bold">
                                {ad.position === 'top_leaderboard' && (isBn ? '🔝 হেডার ব্যানার' : 'Top Banner')}
                                {ad.position === 'home_mid_banner' && (isBn ? '🏠 হোম মিড ব্যানার' : 'Home Mid')}
                                {ad.position === 'sidebar_box' && (isBn ? '📌 সাইডবার বক্স' : 'Sidebar')}
                                {ad.position === 'content_banner' && (isBn ? '📄 ইন-কন্টেন্ট' : 'In-Content')}
                                {ad.position === 'footer_banner' && (isBn ? '🔻 প্রি-ফুটার' : 'Pre-Footer')}
                                {ad.position === 'all' && (isBn ? '🌐 সর্বত্র' : 'All Slots')}
                              </span>
                              {ad.networkType && ad.networkType.startsWith('adsterra') && (
                                <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-900 text-[10px] font-black flex items-center gap-1">
                                  <Zap className="w-3 h-3 text-amber-600" />
                                  <span>Adsterra Network</span>
                                </span>
                              )}
                              {ad.advertiserName && (
                                <span className="text-[11px] text-slate-600 font-bold">
                                  • {ad.advertiserName}
                                </span>
                              )}
                            </div>

                            <h5 className="text-sm font-black text-slate-900 truncate">
                              {isBn ? ad.titleBn : ad.title || ad.titleBn}
                            </h5>

                            <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
                              <a
                                href={ad.targetUrl || '#'}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-emerald-700 hover:underline flex items-center gap-1 truncate max-w-xs font-mono text-[11px]"
                              >
                                <Link className="w-3 h-3 flex-shrink-0" />
                                <span className="truncate">{ad.targetUrl || (ad.adsterraKey ? `Key: ${ad.adsterraKey}` : 'Adsterra Ad')}</span>
                              </a>

                              <span className="flex items-center gap-1 text-[11px] text-slate-600">
                                <Eye className="w-3 h-3 text-slate-400" />
                                <span>{ad.impressionsCount || 0} ভিউ</span>
                              </span>

                              <span className="flex items-center gap-1 text-[11px] text-emerald-700 font-bold">
                                <MousePointerClick className="w-3 h-3 text-emerald-600" />
                                <span>{ad.clicksCount || 0} ক্লিক</span>
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Right: Actions */}
                        <div className="flex items-center gap-2 self-end sm:self-center flex-shrink-0">
                          {/* Live Link Test Button */}
                          {ad.targetUrl && (
                            <a
                              href={ad.targetUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1 transition"
                              title={isBn ? 'লিঙ্ক টেস্ট করুন' : 'Test Link'}
                            >
                              <ExternalLink className="w-4 h-4" />
                            </a>
                          )}

                          {/* Toggle Active Button */}
                          <button
                            onClick={() => handleToggleStatus(ad)}
                            className={`p-2 rounded-xl text-xs font-bold transition flex items-center gap-1 cursor-pointer ${
                              ad.isActive !== false
                                ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                                : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
                            }`}
                            title={ad.isActive !== false ? (isBn ? 'সক্রিয় (বন্ধ করতে ক্লিক করুন)' : 'Active') : (isBn ? 'নিষ্ক্রিয় (চালু করতে ক্লিক করুন)' : 'Inactive')}
                          >
                            {ad.isActive !== false ? (
                              <ToggleRight className="w-5 h-5 text-emerald-600" />
                            ) : (
                              <ToggleLeft className="w-5 h-5 text-slate-500" />
                            )}
                          </button>

                          {/* Edit Button */}
                          <button
                            onClick={() => handleEdit(ad)}
                            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition cursor-pointer"
                            title={isBn ? 'সম্পাদনা' : 'Edit'}
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>

                          {/* Delete Button */}
                          <button
                            onClick={() => handleDelete(ad.id)}
                            className="p-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 transition cursor-pointer"
                            title={isBn ? 'মুছে ফেলুন' : 'Delete'}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ===================== TAB 2: ADSTERRA NETWORK & CODES ===================== */}
          {activeTab === 'adsterra_config' && (
            <div className="space-y-6">
              {/* Adsterra Header & Global Master Toggle */}
              <div className="p-5 rounded-3xl bg-gradient-to-r from-emerald-900 via-slate-900 to-emerald-950 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-lg border border-emerald-700/50">
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-amber-400/20 border border-amber-400/40 flex items-center justify-center text-amber-400">
                    <DollarSign className="w-7 h-7" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-base sm:text-lg font-black text-white">
                        {isBn ? 'Adsterra অ্যাড নেটওয়ার্ক মনিটাইজেশন' : 'Adsterra Ad Network Monetization'}
                      </h4>
                      <span className="px-2 py-0.5 rounded-full bg-emerald-500 text-slate-950 text-[10px] font-black uppercase">
                        Global Active
                      </span>
                    </div>
                    <p className="text-xs text-emerald-200 mt-0.5">
                      {isBn
                        ? 'আপনার Adsterra একাউন্টের ব্যানার কী, ডিরেক্ট স্মার্টলিংক এবং গ্লোবাল স্ক্রিপ্ট কনফিগার করুন'
                        : 'Configure your Adsterra direct links, banner zone keys, and popunder/social bar tags'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <label className="flex items-center gap-2 cursor-pointer bg-black/40 px-3.5 py-2 rounded-xl border border-white/20">
                    <input
                      type="checkbox"
                      checked={adsterraConfig.isEnabled}
                      onChange={e => setAdsterraConfig({ ...adsterraConfig, isEnabled: e.target.checked })}
                      className="w-4 h-4 text-emerald-600 rounded"
                    />
                    <span className="text-xs font-black text-white">
                      {isBn ? 'Adsterra বিজ্ঞাপন সক্রিয়' : 'Enable Adsterra Ads'}
                    </span>
                  </label>
                </div>
              </div>

              {/* 1. Direct Smartlink Setting */}
              <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center font-black">
                      <Link className="w-4 h-4" />
                    </div>
                    <div>
                      <h5 className="text-sm font-black text-slate-900">
                        {isBn ? 'Adsterra Direct Link (Smartlink) URL' : 'Adsterra Direct Link (Smartlink) URL'}
                      </h5>
                      <p className="text-xs text-slate-500">
                        {isBn ? 'এটি সর্বোচ্চ CPM আয়ের স্মার্টলিঙ্ক, যা ব্যানার বা বাটনে ক্লিক করলে কাজ করে' : 'High CPM smartlink triggered upon banner/button interactions'}
                      </p>
                    </div>
                  </div>

                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                    High eCPM
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={adsterraConfig.directSmartlinkUrl || ''}
                    onChange={e => setAdsterraConfig({ ...adsterraConfig, directSmartlinkUrl: e.target.value })}
                    placeholder="https://www.highperformancegate.com/smartlink/..."
                    className="flex-1 px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-mono focus:ring-2 focus:ring-emerald-500 bg-slate-50"
                  />
                  <button
                    onClick={() => copyToClipboard(adsterraConfig.directSmartlinkUrl || '', 'smartlink')}
                    className="px-3 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1 transition cursor-pointer"
                  >
                    {copiedKey === 'smartlink' ? <CheckCheck className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                    <span>{isBn ? 'কপি' : 'Copy'}</span>
                  </button>
                  <a
                    href={adsterraConfig.directSmartlinkUrl || '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3.5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold flex items-center gap-1 transition"
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span>{isBn ? 'টেস্ট' : 'Test'}</span>
                  </a>
                </div>
              </div>

              {/* 2. Default Banner Key & Auto-Fill Empty Slots */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3">
                  <div className="flex items-center gap-2">
                    <Zap className="w-5 h-5 text-emerald-600" />
                    <h5 className="text-sm font-black text-slate-900">
                      {isBn ? 'ডিফল্ট ব্যানার কী (Default Zone Key)' : 'Default Banner Zone Key'}
                    </h5>
                  </div>
                  <p className="text-xs text-slate-500">
                    {isBn ? 'Adsterra 728x90 বা অন্যান্য ব্যানারের ডিফল্ট কোড কী' : 'Used as the default zone invocation key for banners'}
                  </p>
                  <input
                    type="text"
                    value={adsterraConfig.defaultBannerKey || ''}
                    onChange={e => setAdsterraConfig({ ...adsterraConfig, defaultBannerKey: e.target.value })}
                    placeholder="e.g. e4d77b8cf650b91e921d74a00508b1a3"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs font-mono bg-slate-50"
                  />
                </div>

                <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Layout className="w-5 h-5 text-emerald-600" />
                      <h5 className="text-sm font-black text-slate-900">
                        {isBn ? 'ফাঁকা স্লট অটো-পূরণ (Auto-Fill)' : 'Auto-Fill Empty Ad Slots'}
                      </h5>
                    </div>
                    <input
                      type="checkbox"
                      checked={adsterraConfig.autoFillEmptySlots}
                      onChange={e => setAdsterraConfig({ ...adsterraConfig, autoFillEmptySlots: e.target.checked })}
                      className="w-4 h-4 text-emerald-600 rounded"
                    />
                  </div>
                  <p className="text-xs text-slate-500">
                    {isBn
                      ? 'কোন স্থানে নিজস্ব স্পন্সর বিজ্ঞাপন না থাকলে স্বয়ংক্রিয়ভাবে Adsterra ব্যানার বা স্মার্টলিংক দেখাবে'
                      : 'Automatically display Adsterra ads when no direct sponsor campaign is active in a slot'}
                  </p>
                  <span className="inline-block px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 text-[11px] font-bold">
                    {adsterraConfig.autoFillEmptySlots
                      ? (isBn ? '✅ ফাঁকা স্থানে Adsterra বিজ্ঞাপন দেখানো হচ্ছে' : '✅ Active: Monetizing all empty positions')
                      : (isBn ? '❌ শুধুমাত্র নির্ধারিত বিজ্ঞাপন স্থানে সক্রিয়' : '❌ Inactive')}
                  </span>
                </div>
              </div>

              {/* 3. Global Scripts (Popunder & Social Bar) */}
              <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
                <div className="flex items-center gap-2">
                  <Code className="w-5 h-5 text-emerald-600" />
                  <h5 className="text-sm font-black text-slate-900">
                    {isBn ? 'Adsterra গ্লোবাল স্ক্রিপ্ট কোড (পপআন্ডার / সোশ্যাল বার)' : 'Global Scripts (Popunder / Social Bar)'}
                  </h5>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      {isBn ? 'Popunder Script URL / Tag' : 'Popunder Script URL / Tag'}
                    </label>
                    <input
                      type="text"
                      value={adsterraConfig.popunderScriptUrl || ''}
                      onChange={e => setAdsterraConfig({ ...adsterraConfig, popunderScriptUrl: e.target.value })}
                      placeholder="https://.../popunder.js"
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-mono bg-slate-50"
                    />
                    <p className="text-[10px] text-slate-500 mt-1">
                      {isBn ? 'Adsterra ড্যাশবোর্ড থেকে Popunder স্ক্রিপ্ট লিঙ্ক দিন' : 'Injects popunder code globally across all views'}
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      {isBn ? 'Social Bar / In-Page Push Script URL' : 'Social Bar / In-Page Push URL'}
                    </label>
                    <input
                      type="text"
                      value={adsterraConfig.socialBarScriptUrl || ''}
                      onChange={e => setAdsterraConfig({ ...adsterraConfig, socialBarScriptUrl: e.target.value })}
                      placeholder="https://.../socialbar.js"
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-mono bg-slate-50"
                    />
                    <p className="text-[10px] text-slate-500 mt-1">
                      {isBn ? 'Adsterra Social Bar স্ক্রিপ্ট কোড দিন' : 'Injects interactive social bar notices for visitors'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Save Settings Button */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={handleSaveAdsterraConfig}
                  className="px-6 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-black shadow-lg transition cursor-pointer flex items-center gap-2"
                >
                  <Check className="w-4 h-4" />
                  <span>{isBn ? 'Adsterra সেটিংস সংরক্ষণ করুন' : 'Save Adsterra Settings'}</span>
                </button>
              </div>
            </div>
          )}

          {/* ===================== TAB 3: ADSTERRA QUICK GUIDE ===================== */}
          {activeTab === 'adsterra_guide' && (
            <div className="space-y-6">
              <div className="p-6 rounded-3xl bg-slate-900 text-white space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-black">
                    <HelpCircle className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-base font-black text-white">
                      {isBn ? 'Adsterra বিজ্ঞাপন সেটআপ করার সহজ নিয়মাবলী' : 'How to Setup Adsterra Ads in 4 Easy Steps'}
                    </h4>
                    <p className="text-xs text-slate-300">
                      {isBn ? 'আপনার Adsterra পাবলিশার একাউন্ট থেকে কোড সংগ্রহ ও বসানোর নির্দেশিকা' : 'Step by step instructions for Adsterra integration'}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                  <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="w-6 h-6 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center text-xs font-black">1</span>
                      <h5 className="text-xs font-black text-emerald-300">
                        {isBn ? 'Adsterra-তে ওয়েবসাইট যোগ করুন' : '1. Add Website in Adsterra'}
                      </h5>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {isBn
                        ? 'Adsterra Publisher একাউন্টে লগইন করে "Websites" > "Add Website" এ ক্লিক করুন এবং আপনার ডোমেইন বা লিঙ্ক সাবমিট করুন।'
                        : 'Log in to your Adsterra Publisher Dashboard, click "Add Website", and submit your domain URL.'}
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="w-6 h-6 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center text-xs font-black">2</span>
                      <h5 className="text-xs font-black text-emerald-300">
                        {isBn ? 'ব্যানার ইউনিট তৈরি করুন (728x90, 300x250)' : '2. Create Banner Units'}
                      </h5>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {isBn
                        ? '"Add Unit" এ ক্লিক করে 728x90 (হেডার/ফুটার) অথবা 300x250 (সাইডবার) নির্বাচন করে কোড তৈরি করুন। সেখান থেকে "key" টি কপি করুন।'
                        : 'Generate 728x90 or 300x250 banners. Copy the generated "key" attribute and paste it in our settings.'}
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="w-6 h-6 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center text-xs font-black">3</span>
                      <h5 className="text-xs font-black text-emerald-300">
                        {isBn ? 'Direct Link (Smartlink) তৈরি করুন' : '3. Generate Direct Smartlink'}
                      </h5>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {isBn
                        ? '"Direct Links" মেনু থেকে একটি নতুন স্মার্টলিঙ্ক তৈরি করুন এবং লিঙ্কটি এখানে Adsterra সেটিংস ট্যাবে সংরক্ষণ করুন।'
                        : 'From the "Direct Links" menu, create a smartlink URL and save it in the Adsterra Settings tab.'}
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="w-6 h-6 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center text-xs font-black">4</span>
                      <h5 className="text-xs font-black text-emerald-300">
                        {isBn ? 'পপআন্ডার ও সোশ্যাল বার (ঐচ্ছিক)' : '4. Popunder & Social Bar (Optional)'}
                      </h5>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {isBn
                        ? 'Popunder বা Social Bar কোড তৈরি করে স্ক্রিপ্ট ট্যাগের লিঙ্কটি এখানে ইনপুট দিলে পুরো সাইটে স্বয়ংক্রিয়ভাবে সক্রিয় হবে।'
                        : 'Generate Popunder or Social Bar script code and paste the script URL to activate network-wide.'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-100 border-t border-slate-200 flex items-center justify-between">
          <div className="text-xs text-slate-500 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>
              {isBn
                ? 'বিজ্ঞাপনে ক্লিক করলে সরাসরি আপনার প্রদানকৃত টার্গেট লিংক বা Adsterra স্মার্টলিংক নতুন ট্যাবে খুলবে'
                : 'Ad clicks will automatically redirect users to your target link URL or Adsterra offer in a new tab'}
            </span>
          </div>

          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold cursor-pointer"
          >
            {isBn ? 'বন্ধ করুন' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
};
