import React from 'react';
import {
  X,
  Globe,
  Landmark,
  GraduationCap,
  Heart,
  Users,
  HeartPulse,
  BookOpen,
  ShoppingBag,
  Home,
  FileText,
  Building2,
  Sparkles,
  ArrowRight,
  ExternalLink,
  CheckCircle2
} from 'lucide-react';
import { useHubBranding } from '../../context/HubBrandingContext';
import { HubId } from '../../types/hubTypes';

const HUB_ICONS: Record<HubId, React.ElementType> = {
  somiti: Landmark,
  training: GraduationCap,
  donation: Heart,
  volunteer: Users,
  'blood-bank': HeartPulse,
  school: BookOpen,
  'medical-courses': HeartPulse,
  marriage: Sparkles,
  marketplace: ShoppingBag,
  'real-estate': Home,
  constitution: FileText,
  branches: Building2
};

export const HubSwitcherModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (route: string) => void;
  currentHubId?: HubId | null;
}> = ({ isOpen, onClose, onNavigate, currentHubId }) => {
  const { hubsData, setActiveHubId } = useHubBranding();

  if (!isOpen) return null;

  const handleSelectHub = (hubId: HubId) => {
    setActiveHubId(hubId);
    onClose();
    // Route mapping
    const routeMap: Record<HubId, string> = {
      somiti: 'somiti',
      training: 'training',
      donation: 'charity',
      volunteer: 'volunteer',
      'blood-bank': 'blood-bank',
      school: 'school',
      'medical-courses': 'medical-courses',
      marriage: 'marriage',
      marketplace: 'marketplace',
      'real-estate': 'real-estate',
      constitution: 'constitution',
      branches: 'branches'
    };
    onNavigate(routeMap[hubId] || 'home');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleGoMasterHome = () => {
    setActiveHubId(null);
    onClose();
    onNavigate('home');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const hubList = Object.values(hubsData);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header Bar */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white px-6 py-4 flex items-center justify-between border-b border-slate-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600/30 border border-emerald-400/30 flex items-center justify-center text-emerald-400">
              <Globe className="w-5 h-5 animate-spin-slow" />
            </div>
            <div>
              <h2 className="text-lg font-bold font-serif flex items-center gap-2">
                <span>Multi-NGO Hub Portal Architecture</span>
                <span className="text-[11px] bg-emerald-500/20 text-emerald-300 font-mono px-2 py-0.5 rounded border border-emerald-400/20">
                  ১২টি ইনডিপেনডেন্ট হাব
                </span>
              </h2>
              <p className="text-xs text-slate-300">
                যেকোনো মিনি পোর্টালে প্রবেশ করতে নিচে ক্লিক করুন (প্রতিটি হাবের রয়েছে নিজস্ব ব্র্যান্ডিং ও হোমপেজ)
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Master Home Shortcut Bar */}
        <div className="bg-slate-100 px-6 py-3 border-b border-slate-200 flex items-center justify-between flex-wrap gap-2">
          <button
            onClick={handleGoMasterHome}
            className="flex items-center gap-2 text-sm font-bold text-slate-800 hover:text-emerald-700 bg-white hover:bg-emerald-50 px-4 py-2 rounded-lg border border-slate-300 shadow-xs transition"
          >
            <Globe className="w-4 h-4 text-emerald-600" />
            <span>🏠 মাস্টার এনজিও হোমপেজ (Central Portal)</span>
          </button>
          <span className="text-xs text-slate-500">
            বর্তমানে আপনি {currentHubId ? `"${hubsData[currentHubId]?.nameBn}"` : 'সেন্ট্রাল পোর্টালে'} আছেন
          </span>
        </div>

        {/* 12 Hubs Grid */}
        <div className="p-6 overflow-y-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {hubList.map((hub) => {
            const Icon = HUB_ICONS[hub.hubId] || Globe;
            const isCurrent = currentHubId === hub.hubId;

            return (
              <div
                key={hub.hubId}
                onClick={() => handleSelectHub(hub.hubId)}
                className={`relative rounded-xl border p-4 cursor-pointer transition-all duration-200 flex flex-col justify-between group ${
                  isCurrent
                    ? 'bg-emerald-50/70 border-emerald-500 shadow-md ring-2 ring-emerald-500/20'
                    : 'bg-white border-slate-200 hover:border-slate-400 hover:shadow-lg hover:-translate-y-0.5'
                }`}
              >
                {/* Top Badge & Active Indicator */}
                <div className="flex items-center justify-between mb-2.5">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-xs group-hover:scale-110 transition-transform"
                    style={{ backgroundColor: hub.primaryColor || '#059669' }}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex items-center gap-1">
                    {isCurrent && (
                      <span className="text-[10px] bg-emerald-600 text-white font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>সক্রিয়</span>
                      </span>
                    )}
                    <span
                      className="text-[11px] font-bold px-2 py-0.5 rounded border"
                      style={{
                        color: hub.primaryColor || '#059669',
                        borderColor: `${hub.primaryColor}30`,
                        backgroundColor: `${hub.primaryColor}10`
                      }}
                    >
                      {hub.badgeTextBn || hub.badgeText}
                    </span>
                  </div>
                </div>

                {/* Hub Names & Tagline */}
                <div className="space-y-1 my-1">
                  <h3 className="font-bold text-sm text-slate-900 font-serif group-hover:text-emerald-700 transition-colors line-clamp-1">
                    {hub.nameBn}
                  </h3>
                  <p className="text-[11px] font-mono text-slate-400 line-clamp-1">
                    {hub.name}
                  </p>
                  <p className="text-xs text-slate-600 line-clamp-2 mt-1 leading-relaxed">
                    {hub.taglineBn}
                  </p>
                </div>

                {/* Bottom Action Strip */}
                <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-slate-500 group-hover:text-emerald-600 transition-colors">
                  <span className="text-[11px]">{hub.banners?.length || 0}টি স্লাইডার ব্যানার</span>
                  <div className="flex items-center gap-1">
                    <span>হাবে যান</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="bg-slate-50 px-6 py-3 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <span>সুপার অ্যাডমিন ড্যাশবোর্ড থেকে প্রতিটি হাবের নাম, লোগো, ব্যানার ও রঙ পরিবর্তন করা যায়।</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold rounded-lg transition"
          >
            বন্ধ করুন
          </button>
        </div>
      </div>
    </div>
  );
};
