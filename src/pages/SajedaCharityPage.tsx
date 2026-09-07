import React, { useState } from 'react';
import { SajedaHeaderNav } from '../components/charity/SajedaHeaderNav';
import { SajedaHeroSection } from '../components/charity/SajedaHeroSection';
import { SajedaStatsBar } from '../components/charity/SajedaStatsBar';
import { SajedaTrustSection } from '../components/charity/SajedaTrustSection';
import { SajedaCausesSection } from '../components/charity/SajedaCausesSection';
import { SajedaFeaturedCampaigns } from '../components/charity/SajedaFeaturedCampaigns';
import { SajedaImpactCounter } from '../components/charity/SajedaImpactCounter';
import { SajedaImpactStoriesSection } from '../components/charity/SajedaImpactStoriesSection';
import { SajedaBeforeAfterSlider } from '../components/charity/SajedaBeforeAfterSlider';
import { SajedaHowWeHelp } from '../components/charity/SajedaHowWeHelp';
import { SajedaTransparencyDashboard } from '../components/charity/SajedaTransparencyDashboard';
import { SajedaDonorWallSection } from '../components/charity/SajedaDonorWallSection';
import { SajedaVolunteerSection } from '../components/charity/SajedaVolunteerSection';
import { SajedaEventsSection } from '../components/charity/SajedaEventsSection';
import { SajedaNewsSection } from '../components/charity/SajedaNewsSection';
import { SajedaGallerySection } from '../components/charity/SajedaGallerySection';
import { SajedaPartnersSection } from '../components/charity/SajedaPartnersSection';
import { SajedaNewsletterSection } from '../components/charity/SajedaNewsletterSection';
import { SajedaContactSection } from '../components/charity/SajedaContactSection';
import { SajedaFooter } from '../components/charity/SajedaFooter';

// Subviews
import { SajedaAboutView } from '../components/charity/SajedaAboutView';
import { SajedaCausesView } from '../components/charity/SajedaCausesView';
import { SajedaCampaignsView } from '../components/charity/SajedaCampaignsView';
import { SajedaImpactView } from '../components/charity/SajedaImpactView';
import { SajedaDonorDashboard } from '../components/charity/SajedaDonorDashboard';
import { SajedaAdminPortal } from '../components/charity/SajedaAdminPortal';
import { SajedaDonationModal } from '../components/charity/SajedaDonationModal';
import { ZakatCalculatorModal } from '../components/donations/ZakatCalculatorModal';

interface SajedaCharityPageProps {
  onBackToMainPortal?: () => void;
}

export const SajedaCharityPage: React.FC<SajedaCharityPageProps> = ({ onBackToMainPortal }) => {
  const [activeNav, setActiveNav] = useState<string>('home');
  const [isDonateModalOpen, setIsDonateModalOpen] = useState<boolean>(false);
  const [isZakatModalOpen, setIsZakatModalOpen] = useState<boolean>(false);
  const [selectedCauseId, setSelectedCauseId] = useState<string | undefined>(undefined);
  const [selectedCampaignId, setSelectedCampaignId] = useState<string | undefined>(undefined);

  const handleOpenDonate = (causeIdOrCampaignId?: string) => {
    if (causeIdOrCampaignId) {
      if (causeIdOrCampaignId.startsWith('camp_')) {
        setSelectedCampaignId(causeIdOrCampaignId);
      } else {
        setSelectedCauseId(causeIdOrCampaignId);
      }
    }
    setIsDonateModalOpen(true);
  };

  const handleNavigate = (tab: string) => {
    setActiveNav(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans selection:bg-emerald-600 selection:text-white">
      
      {/* 1. Header Navigation */}
      <SajedaHeaderNav
        activeTab={activeNav}
        onSelectTab={handleNavigate}
        onOpenDonate={(causeId) => handleOpenDonate(causeId)}
        onOpenZakat={() => setIsZakatModalOpen(true)}
        onOpenVerify={() => handleNavigate('donor-dashboard')}
        language="bn"
        onToggleLanguage={() => {}}
        onGlobalSearchClick={() => handleNavigate('causes')}
      />

      {/* 2. Main Page Render based on Active Navigation */}
      <main className="flex-1">
        {activeNav === 'home' && (
          <>
            {/* Section 2: Hero + Quick Donation Card */}
            <SajedaHeroSection
              onOpenDonate={(causeId, amt) => handleOpenDonate(causeId)}
              onOpenDonateModal={() => handleOpenDonate()}
              onOpenZakatModal={() => setIsZakatModalOpen(true)}
              onExploreCauses={() => handleNavigate('causes')}
              onWatchStory={() => handleNavigate('impact')}
            />

            {/* Section 3: Trust Statistics Bar */}
            <SajedaStatsBar />

            {/* Section 4: Trust / Why Us (বিশ্বস্ততা ও দায়বদ্ধতা) */}
            <SajedaTrustSection />

            {/* Section 5: Where Your Support Goes (Core 6 Causes) */}
            <SajedaCausesSection onOpenDonate={handleOpenDonate} />

            {/* Section 6: Featured Campaigns (জরুরি ক্যাম্পেইন) */}
            <SajedaFeaturedCampaigns onOpenDonate={handleOpenDonate} />

            {/* Section 7: Impact Statistics (আমাদের সম্মিলিত প্রভাব) */}
            <SajedaImpactCounter />

            {/* Section 8: Real Stories (বাস্তব গল্প। বাস্তব পরিবর্তন।) */}
            <SajedaImpactStoriesSection onOpenDonate={handleOpenDonate} />

            {/* Section 9: Before & After Interactive Slider */}
            <SajedaBeforeAfterSlider onOpenDonate={() => handleOpenDonate()} />

            {/* Section 10: How We Help (৪ ধাপের কর্মপ্রক্রিয়া) */}
            <SajedaHowWeHelp />

            {/* Section 11: Transparency Dashboard & Audited Reports */}
            <SajedaTransparencyDashboard />

            {/* Section 12: Donor Wall */}
            <SajedaDonorWallSection onOpenDonate={() => handleOpenDonate()} />

            {/* Section 13: Volunteer CTA & Registration */}
            <SajedaVolunteerSection />

            {/* Section 14: Upcoming Events */}
            <SajedaEventsSection />

            {/* Section 15: Latest News & Updates */}
            <SajedaNewsSection />

            {/* Section 16: Gallery */}
            <SajedaGallerySection />

            {/* Section 17: Partners */}
            <SajedaPartnersSection />

            {/* Section 18: Newsletter */}
            <SajedaNewsletterSection />

            {/* Section 19: Contact */}
            <SajedaContactSection />
          </>
        )}

        {activeNav === 'about' && (
          <SajedaAboutView
            onOpenDonate={() => handleOpenDonate()}
            onOpenVolunteer={() => handleNavigate('volunteer')}
          />
        )}

        {activeNav === 'causes' && (
          <SajedaCausesView onOpenDonate={handleOpenDonate} />
        )}

        {activeNav === 'campaigns' && (
          <SajedaCampaignsView onOpenDonate={handleOpenDonate} />
        )}

        {activeNav === 'impact' && (
          <SajedaImpactView onOpenDonate={() => handleOpenDonate()} />
        )}

        {activeNav === 'volunteer' && (
          <div className="py-10">
            <SajedaVolunteerSection />
          </div>
        )}

        {activeNav === 'events' && (
          <div className="py-10">
            <SajedaEventsSection />
          </div>
        )}

        {activeNav === 'news' && (
          <div className="py-10">
            <SajedaNewsSection />
          </div>
        )}

        {activeNav === 'gallery' && (
          <div className="py-10">
            <SajedaGallerySection />
          </div>
        )}

        {activeNav === 'contact' && (
          <div className="py-10">
            <SajedaContactSection />
          </div>
        )}

        {activeNav === 'donor-dashboard' && (
          <SajedaDonorDashboard onOpenDonate={() => handleOpenDonate()} />
        )}

        {activeNav === 'admin-portal' && (
          <SajedaAdminPortal />
        )}
      </main>

      {/* 3. Footer */}
      <SajedaFooter
        onNavigate={handleNavigate}
        onOpenDonate={() => handleOpenDonate()}
      />

      {/* Global Modals */}
      <SajedaDonationModal
        isOpen={isDonateModalOpen}
        onClose={() => {
          setIsDonateModalOpen(false);
          setSelectedCauseId(undefined);
          setSelectedCampaignId(undefined);
        }}
        initialCauseId={selectedCauseId}
        initialCampaignId={selectedCampaignId}
      />

      <ZakatCalculatorModal
        isOpen={isZakatModalOpen}
        onClose={() => setIsZakatModalOpen(false)}
        onProceedToDonate={(calculatedAmount) => {
          setIsZakatModalOpen(false);
          setIsDonateModalOpen(true);
        }}
      />

    </div>
  );
};
