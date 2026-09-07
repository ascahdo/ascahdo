import React, { useState } from 'react';
import { MatrimonyLanguageProvider, useMatrimonyLanguage } from '../context/MatrimonyLanguageContext';
import { MatrimonyAuthProvider, useMatrimonyAuth } from '../context/MatrimonyAuthContext';
import { MatrimonyProvider, useMatrimony } from '../context/MatrimonyContext';
import { MatrimonyProfile } from '../types/matrimonyTypes';

// Layout & Common Components
import { Header } from '../components/matrimony/common/Header';
import { Footer } from '../components/matrimony/common/Footer';
import { MobileBottomNav } from '../components/matrimony/common/MobileBottomNav';
import { NotificationDrawer } from '../components/matrimony/common/NotificationDrawer';
import { InvoiceModal } from '../components/matrimony/common/InvoiceModal';
import { LiveChatWidget } from '../components/matrimony/common/LiveChatWidget';

// Public Landing Sections
import { Hero } from '../components/matrimony/public/Hero';
import { FeaturedProfiles } from '../components/matrimony/public/FeaturedProfiles';
import { HowItWorks } from '../components/matrimony/public/HowItWorks';
import { WhyChooseUs } from '../components/matrimony/public/WhyChooseUs';
import { SuccessStories } from '../components/matrimony/public/SuccessStories';
import { MembershipPlans } from '../components/matrimony/public/MembershipPlans';
import { MarriageAdviceBlog } from '../components/matrimony/public/MarriageAdviceBlog';
import { SafetyGuidelines } from '../components/matrimony/public/SafetyGuidelines';
import { FAQSection } from '../components/matrimony/public/FAQSection';
import { ContactSection } from '../components/matrimony/public/ContactSection';

// Profile Modals
import { ProfileDetailModal } from '../components/matrimony/profiles/ProfileDetailModal';
import { AdvancedSearchModal } from '../components/matrimony/profiles/AdvancedSearchModal';
import { ReportModal } from '../components/matrimony/profiles/ReportModal';

// Auth Modals
import { LoginModal } from '../components/matrimony/auth/LoginModal';
import { RegisterWizard } from '../components/matrimony/auth/RegisterWizard';
import { ForgotPasswordModal } from '../components/matrimony/auth/ForgotPasswordModal';

// Dashboard & Control Modals
import { UserDashboard } from '../components/matrimony/dashboard/UserDashboard';
import { UpgradeSubscriptionModal } from '../components/matrimony/dashboard/UpgradeSubscriptionModal';
import { EditBiodataModal } from '../components/matrimony/dashboard/EditBiodataModal';
import { VerificationUploadModal } from '../components/matrimony/dashboard/VerificationUploadModal';
import { PartnerPreferenceModal } from '../components/matrimony/dashboard/PartnerPreferenceModal';
import { ConversationsDrawer } from '../components/matrimony/dashboard/ConversationsDrawer';
import { MatrimonyAdminPanel } from '../components/matrimony/admin/MatrimonyAdminPanel';

const MatrimonyInner: React.FC = () => {
  const { lang } = useMatrimonyLanguage();
  const { isAuthenticated, currentUser } = useMatrimonyAuth();
  const { payments = [], siteSettings } = useMatrimony();

  // Active Modals & Drawers
  const [selectedProfile, setSelectedProfile] = useState<MatrimonyProfile | null>(null);
  const [isAdvancedSearchOpen, setIsAdvancedSearchOpen] = useState(false);
  const [reportProfileId, setReportProfileId] = useState<string | null>(null);

  // Auth Modals
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [isForgotOpen, setIsForgotOpen] = useState(false);

  // Dashboards & Drawers
  const [isUserDashboardOpen, setIsUserDashboardOpen] = useState(false);
  const [isAdminPanelOpen, setIsAdminPanelOpen] = useState(false);
  const [isConversationsOpen, setIsConversationsOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);

  // Secondary Modals
  const [isUpgradeOpen, setIsUpgradeOpen] = useState(false);
  const [selectedPlanForUpgrade, setSelectedPlanForUpgrade] = useState('standard');
  const [isEditBiodataOpen, setIsEditBiodataOpen] = useState(false);
  const [isVerificationOpen, setIsVerificationOpen] = useState(false);
  const [isPreferencesOpen, setIsPreferencesOpen] = useState(false);
  const [activeInvoiceId, setActiveInvoiceId] = useState<string | null>(null);

  const handleOpenUpgrade = (planId: string = 'standard') => {
    setSelectedPlanForUpgrade(planId);
    setIsUpgradeOpen(true);
  };

  const handleOpenInvoice = (invId: string) => {
    setActiveInvoiceId(invId);
  };

  const activeInvoice = (payments || []).find(i => i.id === activeInvoiceId) || payments?.[0] || null;

  return (
    <div className="min-h-screen flex flex-col bg-white text-slate-900 selection:bg-rose-600 selection:text-white font-sans">
      {/* 1. Dedicated Top Navigation Header */}
      <Header
        onOpenLogin={() => setIsLoginOpen(true)}
        onOpenRegister={() => setIsRegisterOpen(true)}
        onOpenDashboard={() => setIsUserDashboardOpen(true)}
        onOpenAdmin={() => setIsAdminPanelOpen(true)}
        onOpenNotifications={() => setIsNotificationOpen(true)}
        onOpenAdvancedSearch={() => setIsAdvancedSearchOpen(true)}
        onOpenConversations={() => setIsConversationsOpen(true)}
      />

      {/* 2. Hero Section with Quick Search & Live Stats */}
      <main className="flex-1 pb-16 md:pb-0">
        <Hero
          onOpenAdvancedSearch={() => setIsAdvancedSearchOpen(true)}
          onOpenRegister={() => setIsRegisterOpen(true)}
          onViewProfile={prof => setSelectedProfile(prof)}
        />

        {/* 3. Featured Verified Profiles Showcase */}
        <FeaturedProfiles
          onViewProfile={prof => setSelectedProfile(prof)}
          onOpenAdvancedSearch={() => setIsAdvancedSearchOpen(true)}
          onOpenLogin={() => setIsLoginOpen(true)}
          onOpenRegister={() => setIsRegisterOpen(true)}
        />

        {/* 4. How It Works - 4 Steps */}
        <HowItWorks />

        {/* 5. Why Choose Us (100% NID Verified, Shariah & Family Values) */}
        <WhyChooseUs />

        {/* 6. Success Stories of Real Married Couples */}
        <SuccessStories />

        {/* 7. Membership Pricing & Packages (bKash / Nagad / Rocket) */}
        <MembershipPlans
          onSelectPlan={planId => handleOpenUpgrade(planId)}
          onOpenLogin={() => setIsLoginOpen(true)}
        />

        {/* 8. Matrimonial Guidance & Islamic Marriage Advice */}
        <MarriageAdviceBlog />

        {/* 9. Safety Guidelines & Fraud Prevention */}
        <SafetyGuidelines />

        {/* 10. Frequently Asked Questions (FAQ) */}
        <FAQSection />

        {/* 11. Office Contact & Helpdesk */}
        <ContactSection />
      </main>

      {/* 12. Footer */}
      <Footer
        onOpenRegister={() => setIsRegisterOpen(true)}
        onOpenLogin={() => setIsLoginOpen(true)}
        onOpenAdmin={() => setIsAdminPanelOpen(true)}
        onOpenSafety={() => {
          document.getElementById('safety')?.scrollIntoView({ behavior: 'smooth' });
        }}
      />

      {/* 13. Mobile Bottom Action Nav */}
      <MobileBottomNav
        onOpenSearch={() => setIsAdvancedSearchOpen(true)}
        onOpenRegister={() => setIsRegisterOpen(true)}
        onOpenDashboard={() => (isAuthenticated ? setIsUserDashboardOpen(true) : setIsLoginOpen(true))}
        onOpenConversations={() => (isAuthenticated ? setIsConversationsOpen(true) : setIsLoginOpen(true))}
      />

      {/* 14. Real-time Live Chat Helpdesk */}
      <LiveChatWidget />

      {/* ================= MODALS & DRAWERS ================= */}

      {/* Profile Details Modal */}
      <ProfileDetailModal
        profile={selectedProfile}
        onClose={() => setSelectedProfile(null)}
        onOpenLogin={() => setIsLoginOpen(true)}
        onOpenUpgrade={() => handleOpenUpgrade('standard')}
        onOpenReport={pid => setReportProfileId(pid)}
      />

      {/* Advanced Search Filter Modal */}
      <AdvancedSearchModal
        isOpen={isAdvancedSearchOpen}
        onClose={() => setIsAdvancedSearchOpen(false)}
        onApplySearch={() => {
          document.getElementById('search-results')?.scrollIntoView({ behavior: 'smooth' });
        }}
      />

      {/* Abuse Report Modal */}
      <ReportModal
        profileId={reportProfileId}
        onClose={() => setReportProfileId(null)}
      />

      {/* Login Modal */}
      <LoginModal
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        onOpenRegister={() => setIsRegisterOpen(true)}
        onOpenForgot={() => setIsForgotOpen(true)}
        onSuccessLogin={() => setIsUserDashboardOpen(true)}
      />

      {/* Registration Wizard (4 Steps) */}
      <RegisterWizard
        isOpen={isRegisterOpen}
        onClose={() => setIsRegisterOpen(false)}
        onOpenLogin={() => setIsLoginOpen(true)}
        onSuccessRegister={() => setIsUserDashboardOpen(true)}
      />

      {/* Forgot Password Modal */}
      <ForgotPasswordModal
        isOpen={isForgotOpen}
        onClose={() => setIsForgotOpen(false)}
        onOpenLogin={() => setIsLoginOpen(true)}
      />

      {/* User Dashboard Modal */}
      <UserDashboard
        onClose={() => setIsUserDashboardOpen(false)}
        onViewProfile={p => setSelectedProfile(p)}
        onOpenUpgrade={() => handleOpenUpgrade('standard')}
        onOpenEditBiodata={() => setIsEditBiodataOpen(true)}
        onOpenVerification={() => setIsVerificationOpen(true)}
        onOpenPreferences={() => setIsPreferencesOpen(true)}
        onOpenInvoice={handleOpenInvoice}
        onOpenConversations={() => setIsConversationsOpen(true)}
      />

      {/* Admin Panel Modal */}
      <MatrimonyAdminPanel
        isOpen={isAdminPanelOpen}
        onClose={() => setIsAdminPanelOpen(false)}
        onViewProfile={p => setSelectedProfile(p)}
      />

      {/* Notifications Drawer */}
      <NotificationDrawer
        isOpen={isNotificationOpen}
        onClose={() => setIsNotificationOpen(false)}
      />

      {/* Direct Matrimonial Chat Drawer */}
      <ConversationsDrawer
        isOpen={isConversationsOpen}
        onClose={() => setIsConversationsOpen(false)}
      />

      {/* Upgrade Subscription & Payment Modal */}
      <UpgradeSubscriptionModal
        isOpen={isUpgradeOpen}
        onClose={() => setIsUpgradeOpen(false)}
        selectedPlanId={selectedPlanForUpgrade}
        onSuccessPayment={invId => setActiveInvoiceId(invId)}
      />

      {/* Edit Biodata Modal */}
      <EditBiodataModal
        isOpen={isEditBiodataOpen}
        onClose={() => setIsEditBiodataOpen(false)}
      />

      {/* NID Verification Upload Modal */}
      <VerificationUploadModal
        isOpen={isVerificationOpen}
        onClose={() => setIsVerificationOpen(false)}
      />

      {/* Partner Preferences Modal */}
      <PartnerPreferenceModal
        isOpen={isPreferencesOpen}
        onClose={() => setIsPreferencesOpen(false)}
      />

      {/* Official Receipt / Invoice Modal */}
      <InvoiceModal
        payment={activeInvoiceId ? activeInvoice : null}
        siteSettings={siteSettings}
        onClose={() => setActiveInvoiceId(null)}
      />
    </div>
  );
};

export const MarriageMediaPage: React.FC = () => {
  return (
    <MatrimonyLanguageProvider>
      <MatrimonyAuthProvider>
        <MatrimonyProvider>
          <MatrimonyInner />
        </MatrimonyProvider>
      </MatrimonyAuthProvider>
    </MatrimonyLanguageProvider>
  );
};
