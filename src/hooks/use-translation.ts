
'use client';

import { useLanguage } from './use-language';
import en from '@/locales/en.json';
import sw from '@/locales/sw.json';

const translations = {
  en,
  sw,
};

type TranslationKey = keyof typeof en | keyof typeof sw;

export function useTranslation() {
  const { language } = useLanguage();

  const t = (key: TranslationKey): string => {
    return translations[language][key as keyof typeof translations[typeof language]] || (key as string);
  };

  return { t, language };
}
