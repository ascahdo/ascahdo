import React from 'react';
import { Bell, X, Heart, Phone, ShieldCheck, Sparkles } from 'lucide-react';
import { useMatrimony } from '../../../context/MatrimonyContext';
import { useMatrimonyLanguage } from '../../../context/MatrimonyLanguageContext';

interface NotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateToDashboard: (tab?: string) => void;
}

export const NotificationDrawer: React.FC<NotificationDrawerProps> = ({
  isOpen,
  onClose,
  onNavigateToDashboard,
}) => {
  const { notifications = [] } = useMatrimony();
  const { lang } = useMatrimonyLanguage();

  if (!isOpen) return null;

  const getIcon = (type: string) => {
    switch (type) {
      case 'interest_received':
      case 'interest_accepted':
        return <Heart className="w-4 h-4 text-rose-600" />;
      case 'contact_approved':
        return <Phone className="w-4 h-4 text-emerald-600" />;
      case 'verification':
        return <ShieldCheck className="w-4 h-4 text-blue-600" />;
      case 'membership':
        return <Sparkles className="w-4 h-4 text-amber-600" />;
      default:
        return <Bell className="w-4 h-4 text-slate-600" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/50 backdrop-blur-xs animate-in fade-in">
      <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-rose-50/50">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-rose-700" />
            <h3 className="font-semibold text-slate-900">
              {lang === 'bn' ? 'বিজ্ঞপ্তিসমূহ' : 'Notifications'}
            </h3>
            <span className="text-xs bg-rose-100 text-rose-800 font-semibold px-2 py-0.5 rounded-full">
              {notifications.length}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-slate-500 hover:bg-slate-200 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {notifications.length === 0 ? (
            <div className="text-center py-12 text-slate-400 text-sm">
              <Bell className="w-8 h-8 mx-auto mb-2 text-slate-300" />
              {lang === 'bn' ? 'কোনো নতুন বিজ্ঞপ্তি নেই' : 'No new notifications'}
            </div>
          ) : (
            notifications.map(notif => (
              <div
                key={notif.id}
                onClick={() => {
                  onClose();
                  onNavigateToDashboard(
                    notif.type.includes('interest')
                      ? 'interests'
                      : notif.type.includes('contact')
                      ? 'contacts'
                      : notif.type.includes('membership')
                      ? 'upgrade'
                      : 'overview'
                  );
                }}
                className={`p-3.5 rounded-xl border transition cursor-pointer flex gap-3 items-start ${
                  !notif.isRead
                    ? 'bg-rose-50/60 border-rose-200 hover:border-rose-300'
                    : 'bg-white border-slate-100 hover:border-slate-200'
                }`}
              >
                <div className="p-2 rounded-lg bg-white shadow-xs border border-slate-100 shrink-0">
                  {getIcon(notif.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-0.5">
                    <h4 className="text-xs font-semibold text-slate-900 truncate">
                      {lang === 'bn' ? notif.titleBn : notif.titleEn}
                    </h4>
                    <span className="text-[10px] text-slate-400 shrink-0 ml-2">
                      {notif.createdAt}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {lang === 'bn' ? notif.messageBn : notif.messageEn}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-slate-200 bg-slate-50 text-center">
          <button
            onClick={() => {
              onClose();
              onNavigateToDashboard('overview');
            }}
            className="text-xs text-rose-700 hover:underline font-medium"
          >
            {lang === 'bn' ? 'ড্যাশবোর্ডের সকল আপডেট দেখুন' : 'View all dashboard updates'}
          </button>
        </div>
      </div>
    </div>
  );
};
