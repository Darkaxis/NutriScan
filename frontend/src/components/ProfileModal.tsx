'use client';

import React, { useState } from 'react';
import { UserProfile } from '../types';
import { X, Crown, Shield, Mail, LogOut, CheckCircle2, AlertTriangle, Loader2 } from 'lucide-react';
import { ApiClient } from '../lib/api';
import { useLanguage } from '@/i18n/LanguageContext';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile | null;
  isSubscribed: boolean;
  onLogout: () => void;
  onOpenUpgrade?: () => void;
  onSubscriptionCanceled?: () => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  onClose,
  user,
  isSubscribed,
  onLogout,
  onOpenUpgrade,
  onSubscriptionCanceled,
}) => {
  const { t } = useLanguage();
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [isCanceling, setIsCanceling] = useState(false);
  const [cancelError, setCancelError] = useState<string | null>(null);

  if (!isOpen || !user) return null;

  const displayName = user.name || user.email.split('@')[0] || 'Member';
  const username = user.username || user.email.split('@')[0];
  const userInitials = displayName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  const handleSignOut = () => {
    onClose();
    onLogout();
  };

  const handleCancelSubscription = async () => {
    setIsCanceling(true);
    setCancelError(null);
    try {
      await ApiClient.cancelSubscription();
      setShowCancelConfirm(false);
      if (onSubscriptionCanceled) {
        onSubscriptionCanceled();
      }
    } catch (err: any) {
      setCancelError(err.message || 'Failed to cancel subscription.');
    } finally {
      setIsCanceling(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-zinc-900/50 backdrop-blur-xs animate-fade-in">
      <div
        className="relative w-full max-w-md rounded-3xl bg-white shadow-soft-xl border border-zinc-200/90 overflow-hidden animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 transition-colors z-20 cursor-pointer"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header Profile Banner */}
        <div className="pt-8 pb-6 px-6 sm:px-8 text-center bg-zinc-50 border-b border-zinc-100 relative">
          <div className="relative inline-block mb-3">
            <div className="w-16 h-16 rounded-full bg-zinc-950 text-white flex items-center justify-center font-bold text-xl shadow-soft-sm">
              {userInitials}
            </div>

            {isSubscribed ? (
              <span className="absolute -bottom-1 -right-1 p-1.5 rounded-full bg-emerald-600 text-white shadow-soft-sm">
                <Crown className="w-3.5 h-3.5" />
              </span>
            ) : (
              <span className="absolute -bottom-1 -right-1 p-1.5 rounded-full bg-zinc-200 text-zinc-700">
                <Shield className="w-3 h-3" />
              </span>
            )}
          </div>

          <h2 className="text-xl font-serif text-zinc-950 font-medium tracking-tight">{displayName}</h2>
          {username && (
            <p className="text-xs text-zinc-500 font-mono mt-0.5">@{username}</p>
          )}
          <p className="text-xs text-zinc-400 flex items-center justify-center gap-1.5 mt-1.5">
            <Mail className="w-3.5 h-3.5 text-zinc-400" />
            <span>{user.email}</span>
          </p>

          <div className="mt-3 flex items-center justify-center gap-1.5">
            {isSubscribed ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-semibold">
                <Crown className="w-3.5 h-3.5" />
                <span>Pro Subscriber Active</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-zinc-100 text-zinc-600 border border-zinc-200 text-xs font-medium">
                <span>Free Plan</span>
              </span>
            )}
          </div>
        </div>

        {/* Account Details & Actions */}
        <div className="p-6 sm:p-7 space-y-4">
          <div className="bg-zinc-50 rounded-2xl p-4 border border-zinc-200/80 space-y-2.5 text-xs text-zinc-600">
            <div className="flex items-center justify-between">
              <span className="text-zinc-500">Catalog Access:</span>
              <span className="font-semibold text-emerald-800 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                Full Catalog (24/page)
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-zinc-500">Clinical Nutrition Macros:</span>
              <span className={`font-semibold ${isSubscribed ? 'text-emerald-800' : 'text-zinc-500'}`}>
                {isSubscribed ? 'Unlocked' : 'Locked (Pro only)'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-zinc-500">Search History Tracking:</span>
              <span className="font-semibold text-zinc-800">Enabled</span>
            </div>
          </div>

          {/* Cancel Confirmation Prompt */}
          {isSubscribed && showCancelConfirm && (
            <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200/80 space-y-3 animate-fade-in text-left">
              <div className="flex items-start space-x-2.5">
                <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <p className="text-xs text-rose-900 leading-relaxed">
                  {t('subscription.cancelConfirm') ||
                    'Are you sure you want to cancel your Pro subscription? You will lose access to detailed nutritional macro tables.'}
                </p>
              </div>

              {cancelError && (
                <p className="text-xs text-rose-700 font-medium">{cancelError}</p>
              )}

              <div className="flex items-center gap-2 pt-1">
                <button
                  type="button"
                  disabled={isCanceling}
                  onClick={handleCancelSubscription}
                  className="flex-1 py-2 px-3 rounded-lg bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white font-medium text-xs transition cursor-pointer flex items-center justify-center gap-1.5"
                >
                  {isCanceling ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>{t('subscription.canceling') || 'Canceling...'}</span>
                    </>
                  ) : (
                    <span>{t('subscription.confirmCancelBtn') || 'Yes, Cancel Pro'}</span>
                  )}
                </button>
                <button
                  type="button"
                  disabled={isCanceling}
                  onClick={() => {
                    setShowCancelConfirm(false);
                    setCancelError(null);
                  }}
                  className="py-2 px-3 rounded-lg bg-white hover:bg-zinc-100 border border-zinc-200 text-zinc-700 text-xs font-medium transition cursor-pointer"
                >
                  {t('subscription.keepSubscription') || 'Keep'}
                </button>
              </div>
            </div>
          )}

          {/* Pro Cancellation Trigger Button */}
          {isSubscribed && !showCancelConfirm && (
            <button
              type="button"
              onClick={() => setShowCancelConfirm(true)}
              className="w-full flex items-center justify-center gap-2 py-2 px-4 rounded-full border border-zinc-200 hover:border-rose-200 hover:bg-rose-50 text-zinc-500 hover:text-rose-700 font-medium text-xs transition cursor-pointer"
            >
              <span>{t('subscription.cancelSubscription') || 'Cancel Subscription'}</span>
            </button>
          )}

          {/* Upgrade Button for Free Users */}
          {!isSubscribed && onOpenUpgrade && (
            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenUpgrade();
              }}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-full bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs shadow-soft-sm transition cursor-pointer"
            >
              <Crown className="w-3.5 h-3.5 text-emerald-200" />
              <span>Upgrade to Pro ($9.99/mo)</span>
            </button>
          )}

          {/* Sign Out Button */}
          <button
            type="button"
            onClick={handleSignOut}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-full border border-zinc-200 hover:border-zinc-300 bg-white hover:bg-zinc-50 text-zinc-600 hover:text-zinc-950 font-semibold text-xs transition cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    </div>
  );
};
