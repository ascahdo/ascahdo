import React, { useState, useEffect } from 'react';
import { useTranslation } from '../locales/i18nContext';
import {
  ExternalLink, Sparkles, Tag, PlusCircle, ArrowUpRight,
  Info, Eye, MousePointerClick, ShieldCheck, ChevronRight,
  Megaphone, X, Settings, Zap
} from 'lucide-react';
import { api } from '../services/api';
import { AdsterraAdEmbed } from './AdsterraAdEmbed';

export interface AdvertisementItem {
  id: string;
  title: string;
  titleBn: string;
  subtitle?: string;
  subtitleBn?: string;
  imageUrl: string;
  targetUrl: string;
  internalRoute?: string;
  position: 'top_leaderboard' | 'home_mid_banner' | 'sidebar_box' | 'content_banner' | 'footer_banner' | 'all';
  badgeText?: string;
  badgeTextEn?: string;
  advertiserName?: string;
  ctaText?: string;
  ctaTextEn?: string;
  clicksCount?: number;
  impressionsCount?: number;
  isActive?: boolean;
  startDate?: string;
  endDate?: string;
  // Adsterra Network Extensions
  networkType?: 'custom' | 'adsterra_direct_link' | 'adsterra_banner' | 'adsterra_native' | 'adsterra_smartlink';
  adsterraKey?: string;
  adsterraScriptCode?: string;
  adsterraFormat?: 'iframe' | 'smartlink' | 'native' | 'social_bar';
  adsterraWidth?: number;
  adsterraHeight?: number;
}

interface AdBannerBoxProps {
  position: 'top_leaderboard' | 'home_mid_banner' | 'sidebar_box' | 'content_banner' | 'footer_banner';
  className?: string;
  onNavigate?: (view: string) => void;
  onOpenAdManager?: () => void;
  titleOverride?: string;
  compact?: boolean;
}

export const AdBannerBox: React.FC<AdBannerBoxProps> = ({
  position,
  className = '',
  onNavigate,
  onOpenAdManager,
  titleOverride,
  compact = false
}) => {
  const { isBn } = useTranslation();
  const [ads, setAds] = useState<AdvertisementItem[]>([]);
  const [adsterraConfig, setAdsterraConfig] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeAdIndex, setActiveAdIndex] = useState<number>(0);
  const [isDismissed, setIsDismissed] = useState<boolean>(false);

  useEffect(() => {
    let isMounted = true;
    const fetchAds = async () => {
      try {
        const [adsData, astConfig] = await Promise.all([
          api.getAdvertisements(position).catch(() => []),
          api.getAdsterraConfig().catch(() => null)
        ]);

        if (isMounted) {
          if (Array.isArray(adsData)) {
            setAds(adsData);
            if (adsData.length > 0) {
              // Track impression on first load
              api.trackAdImpression(adsData[0].id).catch(() => {});
            }
          }
          if (astConfig) {
            setAdsterraConfig(astConfig);
          }
        }
      } catch (err) {
        console.error('Failed to load advertisement for position:', position, err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchAds();

    const handleAdUpdate = () => {
      fetchAds();
    };

    window.addEventListener('ascado_ads_updated', handleAdUpdate);
    window.addEventListener('ascado_adsterra_updated', handleAdUpdate);

    return () => {
      isMounted = false;
      window.removeEventListener('ascado_ads_updated', handleAdUpdate);
      window.removeEventListener('ascado_adsterra_updated', handleAdUpdate);
    };
  }, [position]);

  // If rotated multiple ads in this position, cycle every 8 seconds
  useEffect(() => {
    if (ads.length > 1) {
      const timer = setInterval(() => {
        setActiveAdIndex((prev) => {
          const next = (prev + 1) % ads.length;
          if (ads[next]) {
            api.trackAdImpression(ads[next].id).catch(() => {});
          }
          return next;
        });
      }, 8000);
      return () => clearInterval(timer);
    }
  }, [ads]);

  if (isDismissed) return null;

  const currentAd = ads[activeAdIndex];

  // Handle ad click
  const handleAdClick = (e?: React.MouseEvent) => {
    if (!currentAd) return;

    // Track click
    api.trackAdClick(currentAd.id).catch(() => {});

    // If internal route exists & onNavigate is provided
    if (currentAd.internalRoute && onNavigate) {
      if (e) e.preventDefault();
      onNavigate(currentAd.internalRoute);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    // Direct link redirection
    if (currentAd.targetUrl) {
      if (!currentAd.targetUrl.startsWith('http')) {
        window.open(`https://${currentAd.targetUrl}`, '_blank', 'noopener,noreferrer');
      } else {
        window.open(currentAd.targetUrl, '_blank', 'noopener,noreferrer');
      }
    }
  };

  // Check if current ad is an Adsterra Banner or Script Unit
  if (currentAd && (currentAd.networkType === 'adsterra_banner' || currentAd.adsterraScriptCode)) {
    const defaultWidth = position === 'sidebar_box' ? 300 : 728;
    const defaultHeight = position === 'sidebar_box' ? 250 : 90;

    return (
      <AdsterraAdEmbed
        adsterraKey={currentAd.adsterraKey || 'e4d77b8cf650b91e921d74a00508b1a3'}
        adsterraScriptCode={currentAd.adsterraScriptCode}
        width={currentAd.adsterraWidth || defaultWidth}
        height={currentAd.adsterraHeight || defaultHeight}
        title={currentAd.title}
        titleBn={currentAd.titleBn}
        isBn={isBn}
        onOpenAdManager={onOpenAdManager}
        onAdClick={() => handleAdClick()}
        className={className}
      />
    );
  }

  // Check if current ad is an Adsterra Direct Smartlink Unit
  if (currentAd && (currentAd.networkType === 'adsterra_direct_link' || currentAd.networkType === 'adsterra_smartlink')) {
    return (
      <AdsterraAdEmbed
        format="smartlink"
        smartlinkUrl={currentAd.targetUrl || adsterraConfig?.directSmartlinkUrl || 'https://www.highperformancegate.com/smartlink/ascado_direct'}
        title={currentAd.title}
        titleBn={currentAd.titleBn}
        isBn={isBn}
        onOpenAdManager={onOpenAdManager}
        onAdClick={() => handleAdClick()}
        className={className}
      />
    );
  }

  // Fallback: If no active ad is available, but Adsterra auto-fill is enabled in config
  if (!loading && (!currentAd || ads.length === 0)) {
    const slotConfig = adsterraConfig?.slots?.[position];
    if (adsterraConfig?.isEnabled && adsterraConfig?.autoFillEmptySlots && slotConfig?.enabled) {
      if (slotConfig.networkType === 'adsterra_direct_link') {
        return (
          <AdsterraAdEmbed
            format="smartlink"
            smartlinkUrl={slotConfig.smartlink || adsterraConfig.directSmartlinkUrl || 'https://www.highperformancegate.com/smartlink/ascado_direct'}
            title="Adsterra Monetization Link"
            titleBn="অ্যাডস্টেরা স্মার্টলিংক অফার"
            isBn={isBn}
            onOpenAdManager={onOpenAdManager}
            className={className}
          />
        );
      } else {
        const slotWidth = slotConfig.width || (position === 'sidebar_box' ? 300 : 728);
        const slotHeight = slotConfig.height || (position === 'sidebar_box' ? 250 : 90);
        return (
          <AdsterraAdEmbed
            adsterraKey={slotConfig.key || adsterraConfig.defaultBannerKey || 'e4d77b8cf650b91e921d74a00508b1a3'}
            width={slotWidth}
            height={slotHeight}
            isBn={isBn}
            onOpenAdManager={onOpenAdManager}
            className={className}
          />
        );
      }
    }

    return (
      <div
        className={`rounded-2xl border-2 border-dashed border-slate-300 bg-gradient-to-r from-slate-50 to-emerald-50/30 p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left transition hover:border-emerald-400 ${className}`}
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center flex-shrink-0">
            <Megaphone className="w-5 h-5 text-emerald-600 animate-bounce" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-black uppercase tracking-wider">
                {isBn ? 'বিজ্ঞাপন স্থান' : 'Ad Space Available'}
              </span>
              <span className="text-xs text-slate-500 font-medium">
                {position === 'top_leaderboard' && (isBn ? 'হেডার ব্যানার / Adsterra 728x90' : 'Top Leaderboard (728x90)')}
                {position === 'home_mid_banner' && (isBn ? 'হোমপেজ ব্যানার / Adsterra Smartlink' : 'Homepage Mid Banner')}
                {position === 'sidebar_box' && (isBn ? 'সাইডবার বক্স / Adsterra 300x250' : 'Sidebar Ad Box (300x250)')}
                {position === 'content_banner' && (isBn ? 'ইন-কন্টেন্ট ব্যানার' : 'In-Content Banner')}
                {position === 'footer_banner' && (isBn ? 'প্রি-ফুটার ব্যানার' : 'Pre-Footer Banner')}
              </span>
            </div>
            <h4 className="text-sm font-bold text-slate-800 mt-0.5">
              {titleOverride || (isBn ? 'আপনার প্রতিষ্ঠান বা Adsterra বিজ্ঞাপনের লিঙ্ক দিন' : 'Promote Your Brand or Add Adsterra Ad Codes')}
            </h4>
          </div>
        </div>

        <button
          onClick={onOpenAdManager}
          className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-black shadow-md flex items-center gap-1.5 transition flex-shrink-0 cursor-pointer"
        >
          <PlusCircle className="w-4 h-4" />
          <span>{isBn ? 'বিজ্ঞাপন বা Adsterra কোড দিন' : 'Add Ad / Adsterra Code'}</span>
        </button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className={`h-24 bg-slate-100 animate-pulse rounded-2xl border border-slate-200 ${className}`} />
    );
  }

  // ==================== 1. TOP LEADERBOARD POSITION ====================
  if (position === 'top_leaderboard') {
    return (
      <div className={`relative group ${className}`}>
        <div
          onClick={handleAdClick}
          className="relative rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-emerald-500/30 bg-gradient-to-r from-slate-950 via-emerald-950 to-slate-900 text-white cursor-pointer"
        >
          {/* Background image preview with overlay */}
          <div className="absolute inset-0 z-0">
            <img
              src={currentAd.imageUrl}
              alt={currentAd.titleBn}
              className="w-full h-full object-cover opacity-25 group-hover:opacity-35 group-hover:scale-105 transition-all duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-emerald-950/80 to-slate-900/90" />
          </div>

          <div className="relative z-10 p-3.5 sm:p-4.5 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3.5 w-full md:w-auto">
              <div className="w-12 h-12 rounded-xl overflow-hidden border border-emerald-400/40 flex-shrink-0 shadow hidden sm:block">
                <img
                  src={currentAd.imageUrl}
                  alt={currentAd.advertiserName || 'Ad'}
                  className="w-full h-full object-cover"
                />
              </div>

              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2 py-0.5 rounded-full bg-amber-400 text-slate-950 text-[10px] font-black uppercase tracking-wider flex items-center gap-1 shadow-sm">
                    <Sparkles className="w-3 h-3 text-slate-950" />
                    {isBn ? (currentAd.badgeText || 'বিজ্ঞাপন') : (currentAd.badgeTextEn || 'Sponsored')}
                  </span>
                  {currentAd.advertiserName && (
                    <span className="text-[11px] text-emerald-300 font-bold">
                      {currentAd.advertiserName}
                    </span>
                  )}
                </div>

                <h4 className="text-sm sm:text-base font-black text-white leading-tight group-hover:text-emerald-300 transition">
                  {isBn ? currentAd.titleBn : currentAd.title || currentAd.titleBn}
                </h4>

                {(currentAd.subtitleBn || currentAd.subtitle) && (
                  <p className="text-xs text-slate-300 line-clamp-1 mt-0.5">
                    {isBn ? currentAd.subtitleBn : currentAd.subtitle || currentAd.subtitleBn}
                  </p>
                )}
              </div>
            </div>

            {/* CTA Button & Manage Icon */}
            <div className="flex items-center justify-between w-full md:w-auto gap-3 flex-shrink-0">
              <div className="flex items-center gap-2">
                <span className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-xs shadow-lg flex items-center gap-1.5 transition transform group-hover:scale-105">
                  <span>{isBn ? (currentAd.ctaText || 'ভিজিট করুন') : (currentAd.ctaTextEn || 'Visit Now')}</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </span>

                {onOpenAdManager && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onOpenAdManager();
                    }}
                    title={isBn ? 'বিজ্ঞাপন পরিবর্তন / Adsterra কোড' : 'Manage Ads & Adsterra'}
                    className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition"
                  >
                    <Settings className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ==================== 2. HOME MID BANNER POSITION ====================
  if (position === 'home_mid_banner') {
    return (
      <div className={`relative group ${className}`}>
        <div
          onClick={handleAdClick}
          className="relative rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 border-2 border-emerald-500/40 bg-slate-950 text-white cursor-pointer"
        >
          {/* Banner Graphic Image */}
          <div className="relative aspect-[21/9] sm:aspect-[24/7] max-h-56 w-full overflow-hidden">
            <img
              src={currentAd.imageUrl}
              alt={currentAd.titleBn}
              className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
            />
            {/* Soft gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/70 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />

            {/* Top Badge */}
            <div className="absolute top-3 left-4 flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-lg bg-emerald-600 text-white text-[10px] font-black uppercase tracking-wider flex items-center gap-1 shadow">
                <Tag className="w-3 h-3" />
                {isBn ? (currentAd.badgeText || 'স্পন্সরড ব্যানার') : (currentAd.badgeTextEn || 'Sponsored Banner')}
              </span>
              {currentAd.advertiserName && (
                <span className="px-2 py-0.5 rounded-lg bg-black/60 backdrop-blur-md text-emerald-300 text-[11px] font-bold">
                  {currentAd.advertiserName}
                </span>
              )}
            </div>

            {/* Bottom Content Area */}
            <div className="absolute bottom-4 left-4 right-4 sm:left-6 sm:right-6 flex flex-col sm:flex-row sm:items-end justify-between gap-3">
              <div className="max-w-2xl">
                <h3 className="text-base sm:text-xl md:text-2xl font-black text-white leading-tight drop-shadow-md">
                  {isBn ? currentAd.titleBn : currentAd.title || currentAd.titleBn}
                </h3>
                {(currentAd.subtitleBn || currentAd.subtitle) && (
                  <p className="text-xs sm:text-sm text-slate-200 mt-1 line-clamp-1 drop-shadow">
                    {isBn ? currentAd.subtitleBn : currentAd.subtitle || currentAd.subtitleBn}
                  </p>
                )}
              </div>

              <div className="flex items-center gap-2 flex-shrink-0">
                <span className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs shadow-lg flex items-center gap-1.5 transition transform group-hover:scale-105">
                  <span>{isBn ? (currentAd.ctaText || 'ওয়েবসাইট দেখুন') : (currentAd.ctaTextEn || 'Explore Now')}</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </span>

                {onOpenAdManager && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onOpenAdManager();
                    }}
                    title={isBn ? 'বিজ্ঞাপন পরিবর্তন / Adsterra কোড' : 'Manage Ads & Adsterra'}
                    className="p-2.5 rounded-xl bg-black/60 hover:bg-slate-800 text-white backdrop-blur-md border border-white/20 transition"
                  >
                    <Settings className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ==================== 3. SIDEBAR BOX POSITION (COMPACT) ====================
  if (position === 'sidebar_box') {
    return (
      <div className={`relative group ${className}`}>
        <div
          onClick={handleAdClick}
          className="rounded-2xl overflow-hidden border border-slate-200 hover:border-emerald-400 bg-white shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col cursor-pointer"
        >
          <div className="relative aspect-[16/10] overflow-hidden bg-slate-900">
            <img
              src={currentAd.imageUrl}
              alt={currentAd.titleBn}
              className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />

            <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-amber-400 text-slate-950 text-[9px] font-black uppercase shadow">
              {isBn ? (currentAd.badgeText || 'বিজ্ঞাপন') : (currentAd.badgeTextEn || 'Sponsored')}
            </span>

            {onOpenAdManager && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onOpenAdManager();
                }}
                className="absolute top-2 right-2 p-1.5 rounded-md bg-black/60 hover:bg-slate-800 text-white transition"
              >
                <Settings className="w-3 h-3" />
              </button>
            )}

            <div className="absolute bottom-2 left-2 right-2 text-white">
              {currentAd.advertiserName && (
                <p className="text-[10px] text-emerald-300 font-bold truncate">
                  {currentAd.advertiserName}
                </p>
              )}
              <h4 className="text-xs font-black line-clamp-2 leading-snug">
                {isBn ? currentAd.titleBn : currentAd.title || currentAd.titleBn}
              </h4>
            </div>
          </div>

          <div className="p-3 bg-slate-50 flex items-center justify-between text-xs">
            <span className="text-[11px] text-slate-500 font-medium truncate max-w-[140px]">
              {currentAd.targetUrl.replace(/^https?:\/\//, '')}
            </span>
            <span className="text-emerald-700 font-extrabold flex items-center gap-0.5 text-[11px]">
              <span>{isBn ? (currentAd.ctaText || 'ভিজিট') : (currentAd.ctaTextEn || 'Visit')}</span>
              <ChevronRight className="w-3 h-3" />
            </span>
          </div>
        </div>
      </div>
    );
  }

  // ==================== 4. IN-CONTENT & FOOTER BANNER ====================
  return (
    <div className={`relative group ${className}`}>
      <div
        onClick={handleAdClick}
        className="rounded-2xl overflow-hidden border border-emerald-200/80 bg-gradient-to-r from-emerald-50/70 via-white to-teal-50/70 p-4 sm:p-5 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col sm:flex-row items-center justify-between gap-4 cursor-pointer"
      >
        <div className="flex items-center gap-4 w-full sm:w-auto">
          <div className="w-14 h-14 rounded-2xl overflow-hidden border border-emerald-300 flex-shrink-0 shadow-sm">
            <img
              src={currentAd.imageUrl}
              alt={currentAd.titleBn}
              className="w-full h-full object-cover"
            />
          </div>

          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black uppercase">
                {isBn ? (currentAd.badgeText || 'বিজ্ঞাপন') : (currentAd.badgeTextEn || 'Sponsored')}
              </span>
              {currentAd.advertiserName && (
                <span className="text-xs text-slate-600 font-bold">
                  {currentAd.advertiserName}
                </span>
              )}
            </div>

            <h4 className="text-sm sm:text-base font-black text-slate-900 leading-snug group-hover:text-emerald-700 transition">
              {isBn ? currentAd.titleBn : currentAd.title || currentAd.titleBn}
            </h4>

            {(currentAd.subtitleBn || currentAd.subtitle) && (
              <p className="text-xs text-slate-600 line-clamp-1 mt-0.5">
                {isBn ? currentAd.subtitleBn : currentAd.subtitle || currentAd.subtitleBn}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-3 flex-shrink-0">
          <span className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-black text-xs shadow flex items-center gap-1.5 transition">
            <span>{isBn ? (currentAd.ctaText || 'ওয়েবসাইট দেখুন') : (currentAd.ctaTextEn || 'Visit Site')}</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </span>

          {onOpenAdManager && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onOpenAdManager();
              }}
              title={isBn ? 'বিজ্ঞাপন পরিবর্তন' : 'Manage Ads'}
              className="p-2 rounded-xl bg-white hover:bg-slate-100 text-slate-600 border border-slate-300 transition"
            >
              <Settings className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

