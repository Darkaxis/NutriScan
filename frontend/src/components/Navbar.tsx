'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useLanguage } from '../i18n/LanguageContext';
import { LanguageSelector } from './LanguageSelector';
import { UserProfile } from '../types';
import { Package, Crown, User, LogOut, LogIn, ChevronDown } from 'lucide-react';

export interface NavbarProps {
  user: UserProfile | null;
  isSubscribed: boolean;
  onOpenAuth?: (mode: 'signin' | 'signup') => void;
  onLogout?: () => void;
  onOpenProfile?: () => void;
  onUpgradeClick?: () => void;
  onOpenUpgrade?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  user,
  isSubscribed,
  onOpenAuth,
  onLogout,
  onOpenProfile,
  onUpgradeClick,
  onOpenUpgrade,
}) => {
  const { t } = useLanguage();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleUpgrade = () => {
    if (onUpgradeClick) onUpgradeClick();
    else if (onOpenUpgrade) onOpenUpgrade();
  };

  const displayName = user?.name || user?.email?.split('@')[0] || '';
  const userInitials = displayName
    ? displayName
        .split(' ')
        .map((n) => n[0])
        .join('')
        .slice(0, 2)
        .toUpperCase()
    : 'U';

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-zinc-200 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-6">
        {/* Brand Logo & Title: Clean, Human & Minimal */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-lg bg-zinc-900 flex items-center justify-center text-white transition-colors group-hover:bg-zinc-800">
            <span className="font-semibold text-sm">N</span>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="font-sans font-bold text-base tracking-tight text-zinc-950">
              NutriScan
            </span>
            <span className="text-[11px] text-zinc-400 font-normal">
              food facts
            </span>
          </div>
        </Link>


        {/* Right Section: Auth & Locale */}
        <div className="flex items-center gap-2 sm:gap-3">
          {user ? (
            /* Logged-In User Profile Menu */
            <div className="relative">
              <button
                type="button"
                id="user-profile-menu-button"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="flex items-center gap-2 px-2.5 py-1.5 rounded-full bg-white hover:bg-zinc-50 border border-zinc-200 shadow-soft-sm transition-all cursor-pointer"
              >
                <div className="w-6 h-6 rounded-full bg-zinc-950 text-white flex items-center justify-center font-bold text-[10px]">
                  {userInitials}
                </div>
                <span className="text-xs text-zinc-800 font-medium max-w-[110px] truncate hidden sm:inline">
                  {displayName}
                </span>
                {isSubscribed ? (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 font-semibold text-[10px] border border-emerald-200">
                    <Crown className="w-2.5 h-2.5 text-emerald-700" />
                    <span>Pro</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center px-1.5 py-0.5 rounded-full bg-zinc-100 text-zinc-600 font-medium text-[10px]">
                    Member
                  </span>
                )}
                <ChevronDown className={`w-3.5 h-3.5 text-zinc-400 transition-transform duration-200 ${isMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* User Dropdown Menu */}
              {isMenuOpen && (
                <>
                  <div className="fixed inset-0 z-30" onClick={() => setIsMenuOpen(false)} />
                  <div className="absolute right-0 mt-2 w-60 rounded-2xl bg-white border border-zinc-200 shadow-soft-xl py-2 z-40 text-xs animate-fade-in">
                    <div className="px-4 py-2.5 border-b border-zinc-100 flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-zinc-950 text-white flex items-center justify-center font-bold text-xs">
                        {userInitials}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-semibold text-zinc-950 truncate">{user.name}</p>
                        <p className="text-[11px] text-zinc-400 truncate">{user.email}</p>
                      </div>
                    </div>

                    <div className="p-1.5 border-b border-zinc-100">
                      <button
                        type="button"
                        onClick={() => {
                          setIsMenuOpen(false);
                          onOpenProfile?.();
                        }}
                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-zinc-700 hover:text-zinc-950 hover:bg-zinc-50 font-medium transition cursor-pointer"
                      >
                        <User className="w-4 h-4 text-zinc-400" />
                        <span>Account & Subscription</span>
                      </button>
                    </div>

                    {!isSubscribed && (
                      <div className="p-1.5 border-b border-zinc-100">
                        <button
                          type="button"
                          onClick={() => {
                            setIsMenuOpen(false);
                            handleUpgrade();
                          }}
                          className="w-full flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs shadow-soft-sm transition cursor-pointer"
                        >
                          <Crown className="w-3.5 h-3.5 text-emerald-200" />
                          <span>Upgrade to Pro — $9.99</span>
                        </button>
                      </div>
                    )}

                    <div className="p-1.5">
                      <button
                        type="button"
                        id="navbar-signout-button"
                        onClick={() => {
                          setIsMenuOpen(false);
                          onLogout?.();
                        }}
                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-zinc-500 hover:text-rose-600 hover:bg-rose-50/60 transition font-medium cursor-pointer"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>{t('nav.signOut') || 'Sign Out'}</span>
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          ) : (
            /* Unauthenticated Guest Actions */
            <div className="flex items-center gap-2">
              <button
                id="navbar-signin-button"
                type="button"
                onClick={() => onOpenAuth?.('signin')}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-zinc-800 hover:text-zinc-950 transition cursor-pointer"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>{t('nav.signIn') || 'Sign In'}</span>
              </button>

              <button
                id="navbar-signup-button"
                type="button"
                onClick={() => onOpenAuth?.('signup')}
                className="flex items-center gap-1.5 px-4 py-2 rounded-md text-xs font-bold uppercase tracking-wider bg-zinc-950 hover:bg-zinc-800 text-white transition-all cursor-pointer"
              >
                <span>{t('nav.getStarted') || 'Get Started'}</span>
              </button>
            </div>
          )}

          {/* Upgrade CTA for Logged-In Free Members */}
          {user && !isSubscribed && (
            <button
              id="navbar-upgrade-button"
              type="button"
              onClick={handleUpgrade}
              className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 rounded-md text-xs font-bold uppercase tracking-wider bg-rose-600 hover:bg-rose-700 text-white shadow-soft-sm transition cursor-pointer"
            >
              <Crown className="w-3.5 h-3.5 text-rose-200" />
              <span>{t.upgradeCta || 'Upgrade'}</span>
            </button>
          )}

          {/* Language Switcher */}
          <LanguageSelector />
        </div>
      </div>
    </header>
  );
};
