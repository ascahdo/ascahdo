import React from 'react';
import {
  Globe,
  Phone,
  Mail,
  MapPin,
  ChevronDown,
  Sparkles,
  Layers,
  ArrowRight,
  ShieldCheck,
  User,
  LogIn
} from 'lucide-react';
import { useHubBranding } from '../../context/HubBrandingContext';
import { HubId, HubMenuItem } from '../../types/hubTypes';

export const HubHeader: React.FC<{
  hubId: HubId;
  activeMenuRoute?: string;
  onSelectMenu?: (route: string) => void;
  onOpenPortalLogin?: () => void;
  onBackToMasterPortal: () => void;
}> = ({
  hubId,
  activeMenuRoute = 'home',
  onSelectMenu,
  onOpenPortalLogin,
  onBackToMasterPortal
}) => {
  const { getHubBranding, setIsHubSwitcherOpen } = useHubBranding();
  const hub = getHubBranding(hubId);

  return (
    <header className="w-full bg-white border-b border-slate-200 sticky top-0 z-40 shadow-xs">
      {/* 1. Top Mini Switcher & Master NGO Bar */}
      <div className="bg-slate-900 text-white text-xs px-4 sm:px-6 lg:px-8 py-1.5 flex flex-wrap items-center justify-between gap-2 border-b border-slate-800">
        {/* Left: Master NGO Link & Hub Switcher */}
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
          <button
            onClick={onBackToMasterPortal}
            className="flex items-center gap-1.5 text-slate-300 hover:text-emerald-400 font-semibold transition"
          >
            <Globe className="w-3.5 h-3.5 text-emerald-400" />
            <span>মাস্টার এনজিও পোর্টাল</span>
          </button>
          <span className="text-slate-600">/</span>
          <button
            onClick={() => setIsHubSwitcherOpen(true)}
            className="flex items-center gap-1 text-amber-300 hover:text-amber-200 font-bold bg-white/10 hover:bg-white/15 px-2 py-0.5 rounded transition"
          >
            <Layers className="w-3 h-3" />
            <span>অন্যান্য হাব পরিবর্তন করুন</span>
            <ChevronDown className="w-3 h-3" />
          </button>
        </div>

        {/* Right: Hub Contact Info */}
        <div className="hidden md:flex items-center gap-4 text-[11px] text-slate-300">
          {hub.contactNumber && (
            <a
              href={`tel:${hub.contactNumber}`}
              className="flex items-center gap-1 hover:text-white transition"
            >
              <Phone className="w-3 h-3 text-emerald-400" />
              <span>{hub.contactNumber}</span>
            </a>
          )}
          {hub.email && (
            <a
              href={`mailto:${hub.email}`}
              className="flex items-center gap-1 hover:text-white transition"
            >
              <Mail className="w-3 h-3 text-sky-400" />
              <span>{hub.email}</span>
            </a>
          )}
        </div>
      </div>

      {/* 2. Main Hub Branding Showcase Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="flex items-center justify-between gap-4">
          {/* Logo & Hub Identity */}
          <div className="flex items-center gap-3.5 cursor-pointer" onClick={() => onSelectMenu && onSelectMenu('home')}>
            {hub.logoUrl ? (
              <img
                src={hub.logoUrl}
                alt={hub.name}
                className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl object-cover border border-slate-200 shadow-sm"
              />
            ) : (
              <div
                className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-sm"
                style={{ backgroundColor: hub.primaryColor || '#059669' }}
              >
                {hub.name.charAt(0)}
              </div>
            )}

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-xl font-black text-slate-900 font-serif leading-tight">
                  {hub.nameBn}
                </h1>
                <span
                  className="hidden sm:inline-flex text-[10px] font-bold px-2 py-0.5 rounded border"
                  style={{
                    color: hub.primaryColor || '#059669',
                    borderColor: `${hub.primaryColor}30`,
                    backgroundColor: `${hub.primaryColor}10`
                  }}
                >
                  {hub.badgeTextBn || hub.badgeText}
                </span>
              </div>
              <p className="text-xs text-slate-500 font-mono hidden sm:block">
                {hub.name}
              </p>
              <p className="text-[11px] sm:text-xs text-slate-600 font-medium line-clamp-1 mt-0.5">
                {hub.taglineBn || hub.tagline}
              </p>
            </div>
          </div>

          {/* Right Action: Hub Portal Access / Login */}
          <div className="flex items-center gap-2">
            {onOpenPortalLogin && (
              <button
                onClick={onOpenPortalLogin}
                className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-white px-3.5 sm:px-4 py-2 rounded-xl shadow-sm transition hover:opacity-90 active:scale-95"
                style={{ backgroundColor: hub.primaryColor || '#059669' }}
              >
                <LogIn className="w-4 h-4" />
                <span className="hidden sm:inline">পোর্টাল লগইন</span>
                <span className="sm:hidden">লগইন</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 3. Hub-Specific Navigation Menu Bar */}
      {hub.menuItems && hub.menuItems.length > 0 && (
        <div
          className="border-t border-slate-200"
          style={{ backgroundColor: `${hub.primaryColor}08` }}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <nav className="flex items-center gap-1 overflow-x-auto py-1 scrollbar-none text-xs sm:text-sm font-semibold">
              {(hub.menuItems || []).map((item) => {
                const isActive = activeMenuRoute === item.route;
                return (
                  <button
                    key={item.id}
                    onClick={() => onSelectMenu && onSelectMenu(item.route)}
                    className={`px-3.5 py-2 rounded-lg whitespace-nowrap transition flex items-center gap-1.5 ${
                      isActive
                        ? 'text-white shadow-xs font-bold'
                        : 'text-slate-700 hover:text-slate-900 hover:bg-black/5'
                    }`}
                    style={
                      isActive
                        ? { backgroundColor: hub.primaryColor || '#059669' }
                        : {}
                    }
                  >
                    <span>{item.titleBn || item.title}</span>
                    {item.badgeBn && (
                      <span className="text-[10px] bg-amber-400 text-slate-950 font-bold px-1.5 py-0.2 rounded-full">
                        {item.badgeBn}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>
      )}
    </header>
  );
};
