import React, { createContext, useContext, useState, useEffect } from 'react';
import { HubBranding, HubId, HubBannerSlide } from '../types/hubTypes';
import { DEFAULT_HUBS_DATA } from '../data/defaultHubsData';

interface HubBrandingContextType {
  hubsData: Record<HubId, HubBranding>;
  activeHubId: HubId | null;
  setActiveHubId: (id: HubId | null) => void;
  getHubBranding: (id: HubId) => HubBranding;
  updateHubBranding: (id: HubId, updated: Partial<HubBranding>) => void;
  addHubBanner: (id: HubId, banner: Omit<HubBannerSlide, 'id'>) => void;
  updateHubBanner: (id: HubId, bannerId: string, banner: Partial<HubBannerSlide>) => void;
  deleteHubBanner: (id: HubId, bannerId: string) => void;
  resetHubToDefault: (id: HubId) => void;
  isHubSwitcherOpen: boolean;
  setIsHubSwitcherOpen: (open: boolean) => void;
}

const STORAGE_KEY = 'ascado_hubs_branding_v2';

const HubBrandingContext = createContext<HubBrandingContextType | undefined>(undefined);

export const HubBrandingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [hubsData, setHubsData] = useState<Record<HubId, HubBranding>>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        // Merge with defaults to ensure all keys exist
        return { ...DEFAULT_HUBS_DATA, ...parsed };
      }
    } catch (e) {
      console.error('Error loading hubs branding from storage', e);
    }
    return DEFAULT_HUBS_DATA;
  });

  const [activeHubId, setActiveHubId] = useState<HubId | null>(null);
  const [isHubSwitcherOpen, setIsHubSwitcherOpen] = useState<boolean>(false);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(hubsData));
    } catch (e) {
      console.error('Error saving hubs branding to storage', e);
    }
  }, [hubsData]);

  // Sync WordPress Multi-NGO configuration if embedded in WordPress
  useEffect(() => {
    try {
      const wpConfig = (window as any).ascadoWP?.ngoConfig;
      if (wpConfig && wpConfig.name) {
        setHubsData((prev) => {
          const updated = { ...prev };
          (Object.keys(updated) as HubId[]).forEach((k) => {
            if (updated[k]) {
              updated[k] = {
                ...updated[k],
                ...(wpConfig.primaryColor ? { primaryColor: wpConfig.primaryColor } : {}),
                ...(wpConfig.secondaryColor ? { secondaryColor: wpConfig.secondaryColor } : {}),
                ...(wpConfig.accentColor ? { accentColor: wpConfig.accentColor } : {}),
                ...(wpConfig.phone ? { contactNumber: wpConfig.phone } : {}),
                ...(wpConfig.email ? { email: wpConfig.email } : {}),
                ...(wpConfig.address ? { address: wpConfig.address } : {}),
                ...(wpConfig.addressBn ? { addressBn: wpConfig.addressBn } : {}),
                ...(wpConfig.logoUrl ? { logoUrl: wpConfig.logoUrl } : {}),
              };
            }
          });
          return updated;
        });
      }
    } catch (e) {
      console.error('Error applying WordPress Multi-NGO configuration', e);
    }
  }, []);

  const getHubBranding = (id: HubId): HubBranding => {
    return hubsData[id] || DEFAULT_HUBS_DATA[id] || DEFAULT_HUBS_DATA.somiti;
  };

  const updateHubBranding = (id: HubId, updated: Partial<HubBranding>) => {
    setHubsData((prev) => {
      const current = prev[id] || DEFAULT_HUBS_DATA[id];
      return {
        ...prev,
        [id]: {
          ...current,
          ...updated
        }
      };
    });
  };

  const addHubBanner = (id: HubId, bannerData: Omit<HubBannerSlide, 'id'>) => {
    const newBanner: HubBannerSlide = {
      ...bannerData,
      id: `banner_${id}_${Date.now()}`
    };
    setHubsData((prev) => {
      const current = prev[id] || DEFAULT_HUBS_DATA[id];
      return {
        ...prev,
        [id]: {
          ...current,
          banners: [newBanner, ...current.banners]
        }
      };
    });
  };

  const updateHubBanner = (id: HubId, bannerId: string, bannerUpdate: Partial<HubBannerSlide>) => {
    setHubsData((prev) => {
      const current = prev[id] || DEFAULT_HUBS_DATA[id];
      return {
        ...prev,
        [id]: {
          ...current,
          banners: (current?.banners || []).map((b) => (b.id === bannerId ? { ...b, ...bannerUpdate } : b))
        }
      };
    });
  };

  const deleteHubBanner = (id: HubId, bannerId: string) => {
    setHubsData((prev) => {
      const current = prev[id] || DEFAULT_HUBS_DATA[id];
      return {
        ...prev,
        [id]: {
          ...current,
          banners: (current?.banners || []).filter((b) => b.id !== bannerId)
        }
      };
    });
  };

  const resetHubToDefault = (id: HubId) => {
    setHubsData((prev) => ({
      ...prev,
      [id]: DEFAULT_HUBS_DATA[id]
    }));
  };

  return (
    <HubBrandingContext.Provider
      value={{
        hubsData,
        activeHubId,
        setActiveHubId,
        getHubBranding,
        updateHubBranding,
        addHubBanner,
        updateHubBanner,
        deleteHubBanner,
        resetHubToDefault,
        isHubSwitcherOpen,
        setIsHubSwitcherOpen
      }}
    >
      {children}
    </HubBrandingContext.Provider>
  );
};

export const useHubBranding = (): HubBrandingContextType => {
  const context = useContext(HubBrandingContext);
  if (!context) {
    throw new Error('useHubBranding must be used within a HubBrandingProvider');
  }
  return context;
};
