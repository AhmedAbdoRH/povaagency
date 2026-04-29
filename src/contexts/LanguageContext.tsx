import React, { createContext, useState, useEffect, ReactNode } from 'react';
import ar from '../i18n/ar.json';
import en from '../i18n/en.json';

export type Language = 'ar' | 'en';

interface LanguageContextType {
  language: Language;
  toggleLanguage: () => void;
  t: (key: string) => string;
  translations: Record<string, any>;
}

export const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

interface LanguageProviderProps {
  children: ReactNode;
}

export function LanguageProvider({ children }: LanguageProviderProps) {
  const [language, setLanguage] = useState<Language>('ar');

  useEffect(() => {
    // Get language from localStorage or browser default
    const savedLanguage = localStorage.getItem('language') as Language | null;
    const browserLanguage = navigator.language.split('-')[0] as Language;
    const defaultLanguage = savedLanguage || (browserLanguage === 'en' ? 'en' : 'ar');
    
    setLanguage(defaultLanguage);
    updateHtmlDirection(defaultLanguage);
  }, []);

  const toggleLanguage = () => {
    const newLanguage = language === 'ar' ? 'en' : 'ar';
    setLanguage(newLanguage);
    localStorage.setItem('language', newLanguage);
    updateHtmlDirection(newLanguage);
  };

  const updateHtmlDirection = (lang: Language) => {
    const html = document.documentElement;
    html.dir = lang === 'ar' ? 'rtl' : 'ltr';
    html.lang = lang;
    document.body.style.direction = lang === 'ar' ? 'rtl' : 'ltr';
  };

  // Get translation with nested key support (e.g., "header.home")
  const t = (key: string): string => {
    const translations = language === 'ar' ? ar : en;
    const keys = key.split('.');
    let value: any = translations;
    
    for (const k of keys) {
      value = value?.[k];
    }
    
    return typeof value === 'string' ? value : key;
  };

  const translations = language === 'ar' ? ar : en;

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, t, translations }}>
      {children}
    </LanguageContext.Provider>
  );
}
