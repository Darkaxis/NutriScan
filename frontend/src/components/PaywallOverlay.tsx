'use client';

import React, { useState } from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import { Lock, Crown, CheckCircle2, ArrowRight, Loader2, ShieldCheck } from 'lucide-react';
import { createCheckoutSession } from '../lib/api';

interface Props {
  onSimulatePro: () => void;
}

export const PaywallOverlay: React.FC<Props> = ({ onSimulatePro }) => {
  const { t } = useLanguage();
  const [isLoading, setIsLoading] = useState(false);

  const handleCheckout = async () => {
    setIsLoading(true);
    try {
      const checkoutUrl = await createCheckoutSession();
      if (checkoutUrl) {
        window.location.href = checkoutUrl;
      }
    } catch (err: any) {
      console.error('Checkout error:', err);
      onSimulatePro();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative overflow-hidden rounded-2xl border border-zinc-200/90 bg-zinc-50/80 p-6 sm:p-8">
      <div className="relative z-10 max-w-lg mx-auto flex flex-col items-center text-center space-y-4">
        {/* Subtle Pill Tag */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-semibold">
          <Lock className="w-3.5 h-3.5 text-amber-700" />
          <span>Pro Subscriber Feature</span>
        </div>

        {/* Title */}
        <h3 className="text-xl sm:text-2xl font-serif text-zinc-950 font-normal tracking-tight">
          {t.nutritionLockedTitle || 'Nutrition Breakdown is Locked'}
        </h3>

        {/* Description */}
        <p className="text-xs sm:text-sm text-zinc-500 leading-relaxed max-w-md">
          {t.nutritionLockedDesc || 'Unlock clinical laboratory macronutrient values, dietary reference intakes, and complete nutritional analysis.'}
        </p>

        {/* Value Bullet Points */}
        <div className="w-full bg-white rounded-xl p-4 border border-zinc-200/80 text-left shadow-soft-sm">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs text-zinc-700 font-medium">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{t.features?.f1 || 'Detailed Macronutrients'}</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{t.features?.f2 || 'Allergen Surveillance'}</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{t.features?.f3 || 'EU-1169 Serving Sizes'}</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{t.features?.f4 || 'Unlimited Catalog Search'}</span>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-2 w-full flex items-center justify-center">
          <button
            onClick={handleCheckout}
            disabled={isLoading}
            className="w-full sm:w-auto px-7 py-3 rounded-full bg-zinc-950 hover:bg-zinc-800 text-white font-semibold text-xs sm:text-sm shadow-soft-sm transition-all hover:scale-[1.01] flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-white" />
                <span>Redirecting to Stripe...</span>
              </>
            ) : (
              <>
                <Crown className="w-4 h-4 text-amber-300" />
                <span>{t.upgradeCta || 'Unlock with Pro — $9.99/mo'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </div>

        <p className="text-[11px] text-zinc-400 flex items-center justify-center gap-2 pt-1">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>256-Bit SSL Bank Encryption • Cancel anytime</span>
        </p>
      </div>
    </div>
  );
};
