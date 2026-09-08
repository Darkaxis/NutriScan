'use client';

import React from 'react';
import Link from 'next/link';
import { useLanguage } from '@/i18n/LanguageContext';
import { AlertCircle, ArrowLeft } from 'lucide-react';

export default function SubscriptionCancelPage() {
  const { t } = useLanguage();

  return (
    <main className="min-h-screen flex items-center justify-center p-4 bg-[#FAFAFA] text-zinc-900">
      <div className="w-full max-w-md rounded-3xl bg-white shadow-soft-xl border border-zinc-200/90 p-8 text-center space-y-6 animate-slide-up">
        <div className="w-14 h-14 mx-auto rounded-2xl bg-zinc-100 text-zinc-600 flex items-center justify-center">
          <AlertCircle className="w-7 h-7" />
        </div>

        <div className="space-y-1.5">
          <h1 className="text-2xl font-serif font-normal text-zinc-950 tracking-tight">
            {t('subscription.canceledTitle') || 'Checkout Canceled'}
          </h1>
          <p className="text-xs sm:text-sm text-zinc-500 leading-relaxed font-sans">
            {t('subscription.canceledSubtitle') || 'Your payment was not processed and no charge was made. You retain free access to the catalog.'}
          </p>
        </div>

        <div className="pt-2">
          <Link
            href="/"
            className="w-full inline-flex items-center justify-center space-x-2 py-3 px-6 rounded-full bg-zinc-950 hover:bg-zinc-800 text-white font-medium text-xs shadow-soft-sm transition-all hover:scale-[1.01]"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{t('subscription.tryAgain') || 'Return to Food Catalog'}</span>
          </Link>
        </div>
      </div>
    </main>
  );
}
