import React, { useState, useEffect } from 'react';
import { I18nProvider } from './locales/i18nContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { HubBrandingProvider, useHubBranding } from './context/HubBrandingContext';
import { HubSwitcherModal } from './components/hub/HubSwitcherModal';
import { TopHeader } from './components/TopHeader';
import { NoticeTicker } from './components/NoticeTicker';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { AuthModal } from './components/AuthModal';
import { PasswordChangeModal } from './components/PasswordChangeModal';
import { PaymentModal } from './components/PaymentModal';
import { BloodRequestModal } from './components/BloodRequestModal';
import { AdBannerBox } from './components/AdBannerBox';
import { AdManagerModal } from './components/AdManagerModal';
import { AdsterraGlobalScripts } from './components/AdsterraGlobalScripts';
import { MobileAppBottomNav } from './components/MobileAppBottomNav';
import { MobileAppLauncherSheet } from './components/MobileAppLauncherSheet';
import { MobileInstallPrompt } from './components/MobileInstallPrompt';
import { WordPressThemeModal } from './components/WordPressThemeModal';
import { SEOHead } from './components/SEOHead';

import { HomePage } from './pages/HomePage';
import { BloodBankPage } from './pages/BloodBankPage';
import { SchoolPage } from './pages/SchoolPage';
import { DonationPage } from './pages/DonationPage';
import { VolunteerPage } from './pages/VolunteerPage';
import { TrainingPage } from './pages/TrainingPage';
import { SomitiPage } from './pages/SomitiPage';
import { MarketplacePage } from './pages/MarketplacePage';
import { RealEstatePage } from './pages/RealEstatePage';
import { MarriageMediaPage } from './pages/MarriageMediaPage';
import { MedicalCoursesPage } from './pages/MedicalCoursesPage';
import { ConstitutionPage } from './pages/ConstitutionPage';
import { NewsEventsPage } from './pages/NewsEventsPage';
import { ContactPage } from './pages/ContactPage';
import { BranchesPage } from './pages/BranchesPage';
import { UserDashboard } from './pages/UserDashboard';
import { AdminDashboard } from './pages/AdminDashboard';
import { SajedaCharityPage } from './pages/SajedaCharityPage';

const AppContent: React.FC = () => {
  const { user } = useAuth();
  const { isHubSwitcherOpen, setIsHubSwitcherOpen, activeHubId, setActiveHubId } = useHubBranding();
  const [currentView, setCurrentView] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      const defaultView = (window as any).ascadoDefaultView;
      if (defaultView) return defaultView;
      const hash = window.location.hash.replace('#', '').trim();
      if (hash) return hash;
    }
    return 'home';
  });
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState<any | null>(null);
  const [isBloodSosOpen, setIsBloodSosOpen] = useState(false);
  const [isAdManagerOpen, setIsAdManagerOpen] = useState(false);
  const [isMobileLauncherOpen, setIsMobileLauncherOpen] = useState(false);
  const [isWPThemeOpen, setIsWPThemeOpen] = useState(false);
  const [wpModalInitialTab, setWpModalInitialTab] = useState<'apk' | 'download' | 'modules' | 'admin' | 'multisite' | 'connect' | 'guide'>('apk');
  const [adRefreshKey, setAdRefreshKey] = useState(0);

  const handleOpenApkModal = () => {
    setWpModalInitialTab('apk');
    setIsWPThemeOpen(true);
  };

  const handleOpenWPTheme = () => {
    setWpModalInitialTab('download');
    setIsWPThemeOpen(true);
  };

  // Sync with URL hash / deep links for Hub routing
  useEffect(() => {
    const handleHashRouting = () => {
      const hash = window.location.hash.replace('#', '').trim();
      if (hash) {
        setCurrentView(hash);
      } else if ((window as any).ascadoDefaultView) {
        setCurrentView((window as any).ascadoDefaultView);
      }
    };

    handleHashRouting();
    window.addEventListener('hashchange', handleHashRouting);
    return () => window.removeEventListener('hashchange', handleHashRouting);
  }, []);

  const navigateToView = (view: string) => {
    setCurrentView(view);
    window.location.hash = view === 'home' ? '' : view;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenDonation = (campaign?: any) => {
    setSelectedCampaign(campaign || null);
    setIsPaymentOpen(true);
  };

  const handleOpenBloodSOS = () => {
    setIsBloodSosOpen(true);
  };

  const handleOpenAdManager = () => {
    setIsAdManagerOpen(true);
  };

  const renderCurrentView = () => {
    switch (currentView) {
      case 'home':
        return (
          <HomePage
            onNavigate={navigateToView}
            onOpenDonationModal={handleOpenDonation}
            onOpenBloodSOS={handleOpenBloodSOS}
          />
        );
      case 'charity':
      case 'sajeda-charity':
        return <SajedaCharityPage onBackToMainPortal={() => navigateToView('home')} />;
      case 'branches':
        return <BranchesPage onNavigate={navigateToView} />;
      case 'blood-bank':
        return <BloodBankPage onOpenBloodSOS={handleOpenBloodSOS} />;
      case 'school':
        return <SchoolPage />;
      case 'donation':
      case 'donations':
        return <DonationPage onOpenDonationModal={handleOpenDonation} onNavigate={navigateToView} />;
      case 'volunteer':
        return <VolunteerPage />;
      case 'training':
        return <TrainingPage onNavigateHome={() => navigateToView('home')} />;
      case 'somiti':
        return <SomitiPage onNavigateHome={() => navigateToView('home')} />;
      case 'marketplace':
        return <MarketplacePage />;
      case 'real-estate':
        return <RealEstatePage />;
      case 'marriage':
        return <MarriageMediaPage />;
      case 'medical-courses':
        return <MedicalCoursesPage />;
      case 'constitution':
      case 'organizational-law':
        return <ConstitutionPage onNavigate={navigateToView} />;
      case 'news':
      case 'news_events':
        return <NewsEventsPage />;
      case 'contact':
        return <ContactPage />;
      case 'dashboard':
        return (
          <UserDashboard
            onNavigate={navigateToView}
            onOpenDonationModal={() => handleOpenDonation()}
            onOpenBloodSOS={handleOpenBloodSOS}
          />
        );
      case 'admin':
        return <AdminDashboard />;
      default:
        return (
          <HomePage
            onNavigate={navigateToView}
            onOpenDonationModal={handleOpenDonation}
            onOpenBloodSOS={handleOpenBloodSOS}
          />
        );
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans selection:bg-emerald-500 selection:text-white pb-16 md:pb-0">
      {/* Dynamic SEO Meta & Document Title for Search Engines */}
      <SEOHead currentView={currentView} />

      {/* 1. Universal Top Header */}
      <TopHeader
        onOpenBloodSOS={handleOpenBloodSOS}
        onOpenAdManager={handleOpenAdManager}
        onOpenWPTheme={handleOpenWPTheme}
        onOpenApkModal={handleOpenApkModal}
        onNavigate={navigateToView}
      />

      {/* Mobile PWA App Install Banner */}
      <MobileInstallPrompt />

      {/* 2. Breaking Notice Ticker */}
      <NoticeTicker
        onSelectNotice={() => navigateToView('news_events')}
      />

      {/* 3. Universal Top Leaderboard Ad Slot */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pt-3">
        <AdBannerBox
          key={`top-${adRefreshKey}`}
          position="top_leaderboard"
          onNavigate={navigateToView}
          onOpenAdManager={handleOpenAdManager}
        />
      </div>

      {/* 4. Main Navigation Bar */}
      <Navbar
        currentView={currentView}
        onNavigate={navigateToView}
        onOpenDonationModal={() => handleOpenDonation()}
        onOpenBloodSOS={handleOpenBloodSOS}
      />

      {/* 5. Main Page View Container */}
      <main className="flex-1">
        {renderCurrentView()}
      </main>

      {/* 6. Universal Pre-Footer Ad Banner Slot */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-6">
        <AdBannerBox
          key={`footer-${adRefreshKey}`}
          position="footer_banner"
          onNavigate={navigateToView}
          onOpenAdManager={handleOpenAdManager}
        />
      </div>

      {/* 7. Enterprise Footer */}
      <Footer
        onNavigate={navigateToView}
        onOpenWPTheme={handleOpenWPTheme}
        onOpenApkModal={handleOpenApkModal}
      />

      {/* 8. Mobile App Bottom Navigation Bar */}
      <MobileAppBottomNav
        currentView={currentView}
        onNavigate={navigateToView}
        onOpenDonationModal={() => handleOpenDonation()}
        onOpenBloodSOS={handleOpenBloodSOS}
        onOpenServicesDrawer={() => setIsMobileLauncherOpen(true)}
      />

      {/* 9. Mobile App Services Launcher Sheet */}
      <MobileAppLauncherSheet
        isOpen={isMobileLauncherOpen}
        onClose={() => setIsMobileLauncherOpen(false)}
        currentView={currentView}
        onNavigate={navigateToView}
        onOpenDonationModal={() => handleOpenDonation()}
        onOpenBloodSOS={handleOpenBloodSOS}
        onOpenAdManager={handleOpenAdManager}
        onOpenWPTheme={handleOpenWPTheme}
        onOpenApkModal={handleOpenApkModal}
      />

      {/* 10. Hub Switcher Modal for Multi-NGO Mini Portals */}
      <HubSwitcherModal
        isOpen={isHubSwitcherOpen}
        onClose={() => setIsHubSwitcherOpen(false)}
        onNavigate={navigateToView}
        currentHubId={activeHubId}
      />

      {/* 11. Global Modals & Scripts */}
      <AdsterraGlobalScripts />
      <AuthModal />
      <PasswordChangeModal />
      <PaymentModal
        isOpen={isPaymentOpen}
        onClose={() => setIsPaymentOpen(false)}
        campaign={selectedCampaign}
      />
      <BloodRequestModal
        isOpen={isBloodSosOpen}
        onClose={() => setIsBloodSosOpen(false)}
      />
      <AdManagerModal
        isOpen={isAdManagerOpen}
        onClose={() => setIsAdManagerOpen(false)}
        onAdUpdated={() => setAdRefreshKey(k => k + 1)}
      />
      <WordPressThemeModal
        isOpen={isWPThemeOpen}
        onClose={() => setIsWPThemeOpen(false)}
        initialTab={wpModalInitialTab}
      />
    </div>
  );
};

export default function App() {
  return (
    <I18nProvider>
      <AuthProvider>
        <HubBrandingProvider>
          <AppContent />
        </HubBrandingProvider>
      </AuthProvider>
    </I18nProvider>
  );
}
