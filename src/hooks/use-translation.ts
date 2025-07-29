
'use client';

import { useLanguage } from './use-language';
import en from '@/locales/en.json';
import sw from '@/locales/sw.json';
import ki from '@/locales/ki.json';
import luo from '@/locales/luo.json';
import luh from '@/locales/luh.json';

const translations = {
  en,
  sw,
  ki,
  luo,
  luh,
};

type TranslationKey = keyof typeof en | keyof typeof sw | keyof typeof ki | keyof typeof luo | keyof typeof luh;

export function useTranslation() {
  const { language } = useLanguage();

  const t = (key: TranslationKey): string => {
    const langFile = translations[language] || translations.en;
    return langFile[key as keyof typeof langFile] || (key as string);
  };

  return { t, language };
}
