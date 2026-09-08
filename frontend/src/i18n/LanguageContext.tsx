'use client';
// i18n Language Context Provider

import React, { createContext, useContext, useState, useEffect, ReactNode, useMemo } from 'react';
import { SupportedLanguage } from '../types';
import { translations, Translations } from './translations';
import en from './en.json';
import nl from './nl.json';
import de from './de.json';
import fr from './fr.json';

const jsonDicts: Record<SupportedLanguage, any> = {
  en,
  nl,
  de,
  fr,
};

export interface LanguageOption {
  code: SupportedLanguage;
  label: string;
  nativeName: string;
  flag: string;
}

export const SUPPORTED_LANGUAGES: LanguageOption[] = [
  { code: 'en', label: 'English', nativeName: 'English', flag: '🇬🇧' },
  { code: 'nl', label: 'Dutch', nativeName: 'Nederlands', flag: '🇳🇱' },
  { code: 'de', label: 'German', nativeName: 'Deutsch', flag: '🇩🇪' },
  { code: 'fr', label: 'French', nativeName: 'Français', flag: '🇫🇷' },
];

export type TranslationFunction = {
  (keyPath: string, params?: Record<string, string | number>): string;
} & Translations;

interface LanguageContextType {
  language: SupportedLanguage;
  setLanguage: (lang: SupportedLanguage) => void;
  t: TranslationFunction;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<SupportedLanguage>('en');

  useEffect(() => {
    try {
      const saved = localStorage.getItem('foodsystem_language') as SupportedLanguage;
      if (saved && ['en', 'nl', 'de', 'fr'].includes(saved)) {
        setLanguageState(saved);
      }
    } catch {
      // ignore
    }
  }, []);

  const setLanguage = (lang: SupportedLanguage) => {
    setLanguageState(lang);
    try {
      localStorage.setItem('foodsystem_language', lang);
    } catch {
      // ignore
    }
  };

  const t = useMemo<TranslationFunction>(() => {
    const rawObj = translations[language] || translations.en;
    const jsonDict = jsonDicts[language] || jsonDicts.en;
    const fallbackJson = jsonDicts.en;

    const fn = (keyPath: string, params?: Record<string, string | number>): string => {
      // If key is a direct property on translations object
      if (rawObj && (rawObj as any)[keyPath] !== undefined) {
        let val = (rawObj as any)[keyPath];
        if (typeof val === 'string' && params) {
          Object.entries(params).forEach(([k, v]) => {
            val = val.replace(new RegExp(`\\{${k}\\}`, 'g'), String(v));
          });
        }
        return val;
      }

      // Check json nested dict
      const resolve = (obj: any, path: string) => {
        return path.split('.').reduce((prev, curr) => (prev && prev[curr] !== undefined ? prev[curr] : undefined), obj);
      };

      let val = resolve(jsonDict, keyPath);
      if (val === undefined) {
        val = resolve(fallbackJson, keyPath) || keyPath;
      }

      if (typeof val === 'string' && params) {
        Object.entries(params).forEach(([k, v]) => {
          val = (val as string).replace(new RegExp(`\\{${k}\\}`, 'g'), String(v));
        });
      }

      return typeof val === 'string' ? val : keyPath;
    };

    return Object.assign(fn, rawObj);
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
