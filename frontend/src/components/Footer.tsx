'use client';

import React from 'react';
import { useLanguage } from '../i18n/LanguageContext';

export const Footer: React.FC = () => {
  const { t } = useLanguage();

  return (
    <footer className="w-full mt-28 border-t border-zinc-200/80 bg-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-400">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-zinc-800">NutriScan</span>
          <span>•</span>
          <span>{t('footer.testProject') || 'Packaged Food Discovery & Nutrition Database'}</span>
        </div>
        <p>{t('footer.attribution') || 'Data sourced under Open Database License (ODbL) via Open Food Facts contributors.'}</p>
      </div>
    </footer>
  );
};
