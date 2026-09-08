'use client';

import React, { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useLanguage } from '../../../i18n/LanguageContext';
import { ApiClient } from '../../../lib/api';
import confetti from 'canvas-confetti';
import { CheckCircle2, ArrowRight, ShieldCheck, Crown } from 'lucide-react';

function SuccessContent() {
  const { t } = useLanguage();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id') || '';

  const [activated, setActivated] = useState(false);

  useEffect(() => {
    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#059669', '#10b981', '#fbbf24', '#18181b'],
      });
    } catch {
      // ignore
    }

    // Verify session for authenticated user
    if (sessionId) {
      ApiClient.verifyCheckoutSession(sessionId)
        .then(() => setActivated(true))
        .catch(() => setActivated(true));
    } else {
      setActivated(true);
    }
  }, [sessionId]);

  return (
    <main className="min-h-screen flex items-center justify-center p-4 bg-[#FAFAFA] text-zinc-900">
      <div className="w-full max-w-lg rounded-3xl bg-white shadow-soft-xl border border-zinc-200/90 p-8 text-center space-y-6 animate-slide-up">
        <div className="w-16 h-16 mx-auto rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center border border-emerald-200">
          <CheckCircle2 className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold uppercase tracking-wider">
            <Crown className="w-3.5 h-3.5 text-emerald-700" />
            <span>Active Monthly Pro Plan</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-serif font-normal text-zinc-950 tracking-tight">
            Subscription Activated
          </h1>

          <p className="text-xs sm:text-sm text-zinc-500 leading-relaxed font-sans">
            Welcome to NutriScan Pro. Your monthly membership is active. Detailed clinical macronutrient analysis and full catalog features are unlocked across all products.
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200 text-xs text-zinc-700 font-medium flex items-center justify-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Pro membership active • All clinical nutrition tables unlocked</span>
        </div>

        <div className="pt-2">
          <Link
            href="/"
            className="w-full inline-flex items-center justify-center gap-2 py-3.5 px-6 rounded-full bg-zinc-950 hover:bg-zinc-800 text-white font-medium text-xs shadow-soft-sm transition-all hover:scale-[1.01]"
          >
            <span>Return to Food Catalog</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </main>
  );
}

export default function SubscriptionSuccessPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-[#FAFAFA] text-zinc-500">Loading...</div>}>
      <SuccessContent />
    </Suspense>
  );
}
