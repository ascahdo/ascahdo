import React from 'react';
import { Users, MapPin, Building2, ShieldCheck, HeartHandshake } from 'lucide-react';
import { SYF_HERO_STATS } from '../../data/sajedaCharityData';

interface SajedaStatsBarProps {
  stats?: typeof SYF_HERO_STATS;
}

export const SajedaStatsBar: React.FC<SajedaStatsBarProps> = ({ stats = SYF_HERO_STATS }) => {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Users':
        return <Users className="w-6 h-6 text-amber-300" />;
      case 'MapPin':
        return <MapPin className="w-6 h-6 text-amber-300" />;
      case 'Building2':
        return <Building2 className="w-6 h-6 text-amber-300" />;
      case 'ShieldCheck':
        return <ShieldCheck className="w-6 h-6 text-amber-300" />;
      default:
        return <HeartHandshake className="w-6 h-6 text-amber-300" />;
    }
  };

  return (
    <div className="relative -mt-6 z-20 max-w-7xl mx-auto px-4 sm:px-6">
      <div className="bg-gradient-to-r from-emerald-800 via-teal-800 to-emerald-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl border border-emerald-600/30">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center divide-y md:divide-y-0 md:divide-x divide-emerald-700/60">
          {stats.map((item, idx) => (
            <div key={idx} className={`space-y-1 ${idx > 1 ? 'pt-4 md:pt-0' : ''} ${idx > 0 ? 'md:px-4' : ''}`}>
              <div className="flex items-center justify-center gap-2 mb-1">
                <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center backdrop-blur-xs">
                  {getIcon(item.icon)}
                </div>
              </div>
              <div className="text-2xl sm:text-4xl font-black text-amber-300 tracking-tight font-mono">
                {item.value}
              </div>
              <div className="text-xs sm:text-sm font-bold text-emerald-100">
                {item.labelBn}
              </div>
              <div className="text-[10px] text-emerald-300/80 font-medium">
                {item.labelEn}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
