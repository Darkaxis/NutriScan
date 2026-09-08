'use client';

import React, { useState } from 'react';
import { useLanguage } from '@/i18n/LanguageContext';
import { ApiClient } from '@/lib/api';
import { ShieldCheck, Zap, X, CreditCard, ArrowRight, Lock, Crown } from 'lucide-react';

interface PaywallModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubscriptionUpdated?: () => void;
}

export const PaywallModal: React.FC<PaywallModalProps> = ({
  isOpen,
  onClose,
  onSubscriptionUpdated,
}) => {
  const { t } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [devLoading, setDevLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCheckout = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await ApiClient.createCheckoutSession();
      if (res.checkoutUrl) {
        window.location.href = res.checkoutUrl;
      } else {
        throw new Error('No checkout URL received from server');
      }
    } catch (err: any) {
      setError(err.message || 'Could not initiate Stripe Checkout');
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-zinc-900/50 backdrop-blur-xs animate-fade-in">
      <div
        className="relative w-full max-w-lg rounded-3xl bg-white shadow-soft-xl border border-zinc-200/90 overflow-hidden animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 transition-colors z-20 cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="p-7 sm:p-8 bg-zinc-50 border-b border-zinc-200/80 relative">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold uppercase tracking-wider mb-3">
            <Crown className="w-3.5 h-3.5 text-emerald-600" />
            <span>NutriScan Pro</span>
          </div>

          <h3 className="text-2xl sm:text-3xl font-serif font-normal tracking-tight text-zinc-950 mb-1.5">
            {t('subscription.modalTitle') || 'Upgrade to NutriScan Pro'}
          </h3>
          <p className="text-xs sm:text-sm text-zinc-500 leading-relaxed font-sans">
            {t('subscription.modalSubtitle') || 'Access complete laboratory nutritional analysis, saturated fats, sugars, and sodium metrics across all European products.'}
          </p>

          <div className="mt-5 flex items-baseline space-x-1.5">
            <span className="text-3xl sm:text-4xl font-semibold tracking-tight text-zinc-950">
              {t('subscription.price') || '$9.99'}
            </span>
            <span className="text-zinc-400 text-xs font-medium">
              / {t('subscription.interval') || 'month'}
            </span>
          </div>
        </div>

        {/* Benefits List & Action */}
        <div className="p-7 sm:p-8 space-y-5">
          {error && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs">
              {error}
            </div>
          )}

          <div className="space-y-3 text-xs sm:text-sm text-zinc-700">
            <div className="flex items-start space-x-3">
              <div className="p-1 rounded-full bg-emerald-50 text-emerald-700 shrink-0 mt-0.5 border border-emerald-200/60">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
              </div>
              <span className="font-medium">
                {t('nutrition.unlockBenefit1') || 'Full Clinical Macronutrient Matrix (Energy, Lipids, Sugars, Sodium)'}
              </span>
            </div>

            <div className="flex items-start space-x-3">
              <div className="p-1 rounded-full bg-emerald-50 text-emerald-700 shrink-0 mt-0.5 border border-emerald-200/60">
                <Zap className="w-3.5 h-3.5 text-emerald-700" />
              </div>
              <span className="font-medium">
                {t('nutrition.unlockBenefit2') || 'Instant Real-time Barcode Decryption & Live Cloud Sync'}
              </span>
            </div>

            <div className="flex items-start space-x-3">
              <div className="p-1 rounded-full bg-emerald-50 text-emerald-700 shrink-0 mt-0.5 border border-emerald-200/60">
                <Lock className="w-3.5 h-3.5 text-emerald-700" />
              </div>
              <span className="font-medium">
                {t('nutrition.unlockBenefit3') || 'Unrestricted 24-Item Search Pagination & Priority Verification'}
              </span>
            </div>
          </div>

          {/* Security Guarantee */}
          <div className="p-3.5 rounded-xl bg-zinc-50 border border-zinc-200/80 text-zinc-600 text-xs flex items-center space-x-3">
            <CreditCard className="w-4 h-4 text-zinc-400 shrink-0" />
            <div className="text-[11px] leading-relaxed">
              <span className="font-semibold text-zinc-900">Bank-Grade 256-Bit SSL: </span>
              Secure recurring billing processed by Stripe. Instant activation.
            </div>
          </div>

          {/* Checkout CTA */}
          <div className="space-y-3 pt-1">
            <button
              id="paywall-checkout-button"
              type="button"
              onClick={handleCheckout}
              disabled={loading}
              className="w-full flex items-center justify-center space-x-2 py-3 px-5 rounded-full bg-zinc-950 hover:bg-zinc-800 text-white font-semibold text-xs sm:text-sm shadow-soft-sm transition-all hover:scale-[1.01] disabled:opacity-50 cursor-pointer"
            >
              <span>{loading ? t('nutrition.processingCheckout') || 'Redirecting to Stripe...' : t('subscription.checkoutBtn') || 'Continue to Stripe Checkout — $9.99'}</span>
              {!loading && <ArrowRight className="w-3.5 h-3.5" />}
            </button>
          </div>

          <p className="text-[11px] text-center text-zinc-400">
            {t('subscription.cancelAnytime') || 'Cancel anytime with 1 click in your account portal.'}
          </p>
        </div>
      </div>
    </div>
  );
};
