
'use client';

import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

export const languages = {
  en: 'English',
  sw: 'Swahili',
  ki: 'Gikuyu',
  luo: 'Dholuo',
  luh: 'Luhya',
};

type LanguageCode = keyof typeof languages;

interface LanguageContextType {
  language: LanguageCode;
  setLanguage: (language: LanguageCode) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<LanguageCode>('en');

  useEffect(() => {
    const storedLang = localStorage.getItem('afya-ai-lang') as LanguageCode;
    if (storedLang && languages[storedLang]) {
      setLanguage(storedLang);
    }
  }, []);

  const handleSetLanguage = (lang: LanguageCode) => {
    setLanguage(lang);
    localStorage.setItem('afya-ai-lang', lang);
    // You might want to reload or force a re-render to apply changes globally
    window.location.reload(); 
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
