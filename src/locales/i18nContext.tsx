import React, { createContext, useContext, useState, useEffect } from 'react';
import { bn } from './bn';
import { en } from './en';
import { ar } from './ar';
import { Language } from '../types';

interface I18nContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: typeof bn;
  isBn: boolean;
  isEn: boolean;
  isAr: boolean;
  dir: 'rtl' | 'ltr';
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export const I18nProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('ascado_lang');
    return (saved === 'en' || saved === 'bn' || saved === 'ar') ? (saved as Language) : 'bn';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('ascado_lang', lang);
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  };

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
  }, [language]);

  const t = language === 'ar' ? (ar as unknown as typeof bn) : language === 'en' ? en : bn;
  const isBn = language === 'bn';
  const isEn = language === 'en';
  const isAr = language === 'ar';
  const dir = language === 'ar' ? 'rtl' : 'ltr';

  return (
    <I18nContext.Provider value={{ language, setLanguage, t, isBn, isEn, isAr, dir }}>
      {children}
    </I18nContext.Provider>
  );
};

export const useTranslation = () => {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useTranslation must be used within an I18nProvider');
  }
  return context;
};

