import { ReactNode } from 'react';

export type HubId =
  | 'somiti'
  | 'training'
  | 'donation'
  | 'volunteer'
  | 'blood-bank'
  | 'school'
  | 'medical-courses'
  | 'marriage'
  | 'marketplace'
  | 'real-estate'
  | 'constitution'
  | 'branches';

export interface HubBannerSlide {
  id: string;
  imageUrl: string;
  title: string;
  titleBn: string;
  subtitle: string;
  subtitleBn: string;
  buttonText: string;
  buttonTextBn: string;
  buttonLink: string;
  badge: string;
  badgeBn: string;
  isActive: boolean;
  order: number;
}

export interface HubMenuItem {
  id: string;
  title: string;
  titleBn: string;
  route: string;
  iconName?: string;
  badge?: string;
  badgeBn?: string;
  isExternal?: boolean;
  externalUrl?: string;
}

export interface HubStatItem {
  id: string;
  label: string;
  labelBn: string;
  value: string;
  iconName: string;
  color?: string;
}

export interface HubSocialLinks {
  facebook?: string;
  youtube?: string;
  twitter?: string;
  linkedin?: string;
  whatsapp?: string;
}

export interface HubBranding {
  hubId: HubId;
  name: string;
  nameBn: string;
  tagline: string;
  taglineBn: string;
  description: string;
  descriptionBn: string;
  logoUrl: string;
  faviconUrl?: string;
  coverBannerUrl?: string;
  primaryColor: string; // e.g. '#059669' (hex)
  secondaryColor: string;
  accentColor: string;
  badgeText: string;
  badgeTextBn: string;
  contactNumber: string;
  email: string;
  address: string;
  addressBn: string;
  socialLinks: HubSocialLinks;
  footerText: string;
  footerTextBn: string;
  copyright: string;
  seoTitle: string;
  seoDescription: string;
  banners: HubBannerSlide[];
  menuItems: HubMenuItem[];
  stats: HubStatItem[];
}
