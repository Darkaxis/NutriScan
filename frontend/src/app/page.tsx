'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useLanguage } from '@/i18n/LanguageContext';
import { Product, User, SearchHistoryItem } from '@/types';
import { ApiClient } from '@/lib/api';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { SearchBar } from '@/components/SearchBar';
import { SearchHistoryChips } from '@/components/SearchHistoryChips';
import { ProductCard } from '@/components/ProductCard';
import { ProductDetailModal } from '@/components/ProductDetailModal';
import { PaywallModal } from '@/components/PaywallModal';
import { AuthModal } from '@/components/AuthModal';
import { ProfileModal } from '@/components/ProfileModal';
import { AlertTriangle, ArrowRight, Lock, UserPlus, Sparkles } from 'lucide-react';

export default function HomePage() {
  const { t, language } = useLanguage();

  // Application State
  const [user, setUser] = useState<User | null>(null);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [totalResults, setTotalResults] = useState(0);
  const [activeQuery, setActiveQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<SearchHistoryItem[]>([]);

  // Modals
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [isPaywallOpen, setIsPaywallOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'signin' | 'signup'>('signin');
  const [authPromptMessage, setAuthPromptMessage] = useState<string | undefined>(undefined);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  // 1. Fetch User & History on initial load
  const loadUserData = useCallback(async () => {
    try {
      const data = await ApiClient.getCurrentUser();
      setUser(data.user);
      setIsSubscribed(data.isSubscribed);
    } catch (err) {
      console.warn('Could not load user profile:', err);
    }
  }, []);

  const loadHistory = useCallback(async () => {
    try {
      const items = await ApiClient.getRecentSearches(8);
      setHistory(items);
    } catch (err) {
      console.warn('Could not load search history:', err);
    }
  }, []);

  // 2. Perform search
  const handleSearch = useCallback(
    async (queryText: string) => {
      if (!queryText.trim()) return;

      setIsLoading(true);
      setError(null);
      setActiveQuery(queryText);

      try {
        const res = await ApiClient.searchProducts(queryText, language, 1, 24);
        setProducts(res.products);
        setTotalResults(res.total);
        loadHistory();
      } catch (err: any) {
        setError(err.message || 'Error occurred while searching food products.');
        setProducts([]);
      } finally {
        setIsLoading(false);
      }
    },
    [language, loadHistory]
  );

  // Initial mount
  useEffect(() => {
    loadUserData();
    loadHistory();
  }, [loadUserData, loadHistory]);

  // Re-run search when language changes
  useEffect(() => {
    if (activeQuery) {
      handleSearch(activeQuery);
    }
  }, [language, activeQuery, handleSearch]);

  // Select product and fetch full barcode data
  const handleSelectProduct = async (product: Product) => {
    try {
      const fresh = await ApiClient.getProductByBarcode(product.code, language);
      setSelectedProduct(fresh);
    } catch {
      setSelectedProduct(product);
    }
    setIsProductModalOpen(true);
  };

  // Clear search history
  const handleClearHistory = async () => {
    await ApiClient.clearSearchHistory();
    setHistory([]);
  };

  // Refresh user state after checkout or cancellation
  const handleSubscriptionUpdated = async () => {
    await loadUserData();
    if (activeQuery) {
      handleSearch(activeQuery);
    }
  };

  const handleAuthSuccess = async (authUser: User, authSubscribed: boolean) => {
    setUser(authUser);
    setIsSubscribed(authSubscribed);
    setIsAuthModalOpen(false);
    loadHistory();
    if (activeQuery) {
      handleSearch(activeQuery);
    }
  };

  const handleLogout = async () => {
    await ApiClient.logout();
    setUser(null);
    setIsSubscribed(false);
    setHistory([]);
    setIsProfileModalOpen(false);
    if (activeQuery) {
      handleSearch(activeQuery);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAFA] text-zinc-900 selection:bg-zinc-900 selection:text-white">
      {/* Navigation */}
      <Navbar
        user={user}
        isSubscribed={isSubscribed}
        onOpenAuth={(mode) => {
          setAuthModalMode(mode);
          setAuthPromptMessage(undefined);
          setIsAuthModalOpen(true);
        }}
        onLogout={handleLogout}
        onOpenProfile={() => setIsProfileModalOpen(true)}
        onOpenUpgrade={() => setIsPaywallOpen(true)}
      />

      {/* Hero Section: Clean Editorial Layout with Food Art Centerpiece */}
      <section className="relative bg-white border-b border-zinc-200 px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left Column (7 cols): Clean Editorial Typography & Search */}
            <div className="lg:col-span-7 space-y-6">

              {/* Editorial Headline */}
              <div className="space-y-3">
                <h1 className="text-4xl sm:text-6xl lg:text-7xl font-sans font-black tracking-tight text-zinc-950 leading-[1.05]">
                  {t('hero.title') || 'Understand what you eat,'}
                  <br />
                  <span className="text-zinc-500 font-normal">{t('hero.titleHighlight') || 'in complete clarity.'}</span>
                </h1>
                <p className="text-base sm:text-lg text-zinc-600 font-sans leading-relaxed max-w-xl">
                  {t('hero.description') || 'Explore ingredients, official Nutri-Scores, and nutritional breakdowns across millions of everyday foods. Transparent, independent, and completely uncluttered.'}
                </p>
              </div>

              {/* Minimal Search Console */}
              <div className="pt-2 max-w-xl">
                <SearchBar
                  onSearch={handleSearch}
                  isLoading={isLoading}
                  initialQuery={activeQuery}
                />
              </div>

              {/* Search History Chips */}
              <div className="max-w-xl pt-1">
                <SearchHistoryChips
                  history={history}
                  onSelectQuery={handleSearch}
                  onClearHistory={handleClearHistory}
                />
              </div>
            </div>

            {/* Right Column (5 cols): Fine Art Culinary Still Life Centerpiece */}
            <div className="lg:col-span-5">
              <div className="relative border border-zinc-200 bg-white p-3 sm:p-4 rounded-2xl shadow-soft-sm group">
                {/* Visual Art Container */}
                <div className="relative aspect-[4/5] overflow-hidden rounded-xl bg-zinc-50 border border-zinc-100">
                  <img
                    src="/food-art.jpg"
                    alt="Still life with blood orange, fresh fig, rosemary and olive oil"
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.02]"
                  />
                </div>

                {/* Photo Caption */}
                <div className="pt-3 flex items-center justify-end text-xs text-zinc-400">
                  <span>{t('hero.pureIngredients') || 'Pure ingredients'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Metric Ribbon: Clean, Human & Informative */}
      <section className="w-full bg-[#FAFAFA] border-b border-zinc-200">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-zinc-200 text-left">
          <div className="p-6 space-y-1">
            <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">{t('hero.metricCatalogLabel') || 'Catalog'}</span>
            <p className="text-2xl sm:text-3xl font-black tracking-tight text-zinc-950">{t('hero.metricCatalogCount') || '3,200,000+'}</p>
            <p className="text-xs text-zinc-600 font-sans">{t('hero.metricCatalogDesc') || 'Packaged food products indexed'}</p>
          </div>
          <div className="p-6 space-y-1">
            <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">{t('hero.metricScoringLabel') || 'Scoring'}</span>
            <p className="text-2xl sm:text-3xl font-black tracking-tight text-zinc-950">{t('hero.metricScoringTitle') || 'Nutri-Score'}</p>
            <p className="text-xs text-zinc-600 font-sans">{t('hero.metricScoringDesc') || 'Official European grades A through E'}</p>
          </div>
          <div className="p-6 space-y-1">
            <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">{t('hero.metricIntegrityLabel') || 'Integrity'}</span>
            <p className="text-2xl sm:text-3xl font-black tracking-tight text-emerald-700">{t('hero.metricIntegrityTitle') || '100% Open'}</p>
            <p className="text-xs text-zinc-600 font-sans">{t('hero.metricIntegrityDesc') || 'Community-driven, zero brand bias'}</p>
          </div>
          <div className="p-6 space-y-1">
            <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">{t('hero.metricLanguagesLabel') || 'Languages'}</span>
            <p className="text-2xl sm:text-3xl font-black tracking-tight text-zinc-950">{t('hero.metricLanguagesTitle') || '4 Locales'}</p>
            <p className="text-xs text-zinc-600 font-sans">{t('hero.metricLanguagesDesc') || 'English, French, German, and Dutch'}</p>
          </div>
        </div>
      </section>

      {/* Subscription Banner for Free users: Clean Modern Box */}
      {!isSubscribed && (
        <aside aria-label="Subscription offer" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 w-full">
          <div className="rounded-xl bg-white border border-zinc-200 p-5 sm:p-6 shadow-soft-sm flex flex-col sm:flex-row items-center justify-between gap-5">
            <div className="flex items-center space-x-4">
              <div className="w-11 h-11 rounded-lg bg-zinc-950 text-white flex items-center justify-center shrink-0">
                <Sparkles className="w-5 h-5 text-amber-400" />
              </div>

              <div className="text-left space-y-0.5">
                <h2 className="text-base font-bold text-zinc-950 tracking-tight font-sans">
                  {t('nutrition.lockedTitle') || 'Unlock Complete Nutrition Facts'}
                </h2>
                <p className="text-xs text-zinc-500 font-sans leading-relaxed">
                  {t('nutrition.lockedSubtitle') || 'Access full macronutrient breakdowns, saturated fats, sugars, sodium, and portion details.'}
                </p>
              </div>
            </div>

            <button
              id="banner-unlock-button"
              type="button"
              onClick={() => setIsPaywallOpen(true)}
              className="inline-flex items-center space-x-2 py-2.5 px-6 rounded-lg bg-zinc-950 hover:bg-zinc-800 text-white font-semibold text-xs transition-all shrink-0 cursor-pointer shadow-soft-sm"
            >
              <span>{t('nutrition.unlockCta') || 'Unlock Pro — $9.99/mo'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </aside>
      )}

      {/* When No Search Active: Curated Food Collections */}
      {!activeQuery && !isLoading && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 pb-4 border-b border-zinc-200">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400">{t('collections.tag') || 'Discover'}</span>
              <h2 className="text-2xl font-bold tracking-tight text-zinc-950 font-sans">
                {t('collections.title') || 'Popular Food Collections'}
              </h2>
            </div>
            <p className="text-xs text-zinc-500">
              {t('collections.subtitle') || 'Click any collection to instantly explore products and ingredients'}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              {
                id: '01',
                query: 'chocolat',
                label: t('collections.c1.label') || 'Dark Chocolate & Cocoa',
                category: t('collections.c1.category') || 'Confectionery',
                highlight: '70% — 85% Cocoa',
              },
              {
                id: '02',
                query: 'oatly',
                label: t('collections.c2.label') || 'Oat Milk & Plant-Based',
                category: t('collections.c2.category') || 'Dairy Alternatives',
                highlight: 'Enriched Plant Drinks',
              },
              {
                id: '03',
                query: 'barilla',
                label: t('collections.c3.label') || 'Pasta & Whole Grains',
                category: t('collections.c3.category') || 'Grains & Cereals',
                highlight: 'Italian Durum Wheat',
              },
              {
                id: '04',
                query: 'nutella',
                label: t('collections.c4.label') || 'Hazelnut & Sweet Spreads',
                category: t('collections.c4.category') || 'Breakfast',
                highlight: 'Popular Morning Treats',
              },
              {
                id: '05',
                query: 'gouda',
                label: t('collections.c5.label') || 'Artisan Cheeses',
                category: t('collections.c5.category') || 'Dairy & Cheese',
                highlight: 'Protein & Calcium',
              },
              {
                id: '06',
                query: 'amande',
                label: t('collections.c6.label') || 'Nuts & Dried Fruits',
                category: t('collections.c6.category') || 'Snacks & Seeds',
                highlight: 'Healthy Fats & Fiber',
              },
            ].map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => handleSearch(item.query)}
                className="group text-left p-5 rounded-xl bg-white border border-zinc-200 hover:border-zinc-400 hover:shadow-soft-sm transition-all duration-200 space-y-2 cursor-pointer"
              >
                <div className="flex items-center justify-between text-xs text-zinc-400">
                  <span className="font-medium text-zinc-500">{item.category}</span>
                  <span className="text-zinc-600 font-semibold group-hover:text-zinc-950 transition-colors">{t('collections.explore') || 'Explore'} &rarr;</span>
                </div>
                <div>
                  <h3 className="text-base font-bold text-zinc-950 font-sans group-hover:text-zinc-800 transition-colors">
                    {item.label}
                  </h3>
                  <p className="text-xs text-zinc-500 font-sans mt-0.5">Search term: &ldquo;{item.query}&rdquo;</p>
                </div>
                <div className="pt-2 border-t border-zinc-100 flex items-center justify-between text-xs text-zinc-400">
                  <span>Category collection</span>
                  <span className="font-medium text-zinc-700">{item.highlight}</span>
                </div>
              </button>
            ))}
          </div>
        </section>
      )}

      {/* Main Content Area: Only displayed when searching or loading */}
      {(activeQuery || isLoading) && (
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 animate-fade-in">
          {/* Results Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-200">
            <div className="space-y-1">
              <h2 className="text-xl sm:text-2xl font-bold font-sans text-zinc-950 tracking-tight">
                {t('search.foundResults', { count: totalResults, query: activeQuery })}
              </h2>
              <p className="text-xs text-zinc-500">
                {user
                  ? `Showing ${products.length} of ${totalResults.toLocaleString()} products`
                  : `Free preview: showing 2 of ${totalResults.toLocaleString()} products`}
              </p>
            </div>

            <div className="flex items-center space-x-2">
              <span className="text-xs text-zinc-400">Access:</span>
              <span
                className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  isSubscribed
                    ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                    : user
                    ? 'bg-zinc-100 text-zinc-900 border border-zinc-300'
                    : 'bg-amber-100 text-amber-950 border border-amber-300'
                }`}
              >
                {isSubscribed ? 'Pro Unlocked' : user ? 'Member' : 'Free Preview'}
              </span>
            </div>
          </div>

          {/* Error State */}
          {error && (
            <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm flex items-center space-x-3">
              <AlertTriangle className="w-5 h-5 shrink-0 text-rose-500" />
              <span>{error}</span>
            </div>
          )}

          {/* Loading Skeleton */}
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className="rounded-2xl bg-white border border-zinc-200/80 p-5 space-y-4 animate-pulse shadow-soft-sm"
                >
                  <div className="w-full h-52 bg-zinc-100 rounded-xl" />
                  <div className="space-y-2">
                    <div className="h-4 bg-zinc-100 rounded w-3/4" />
                    <div className="h-3 bg-zinc-100 rounded w-1/2" />
                  </div>
                  <div className="h-9 bg-zinc-100 rounded-lg" />
                </div>
              ))}
            </div>
          ) : products.length > 0 ? (
            <div className="relative">
              {/* Product Grid: Cards 0 & 1 clear, subsequent cards blurred for guests */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-7">
                {(!user && products.length < 4 && totalResults > 2
                  ? [...products, ...products.slice(0, 4 - products.length)]
                  : products
                ).map((product, idx) => {
                  const isBlurred = !user && idx >= 2;
                  return (
                    <div
                      key={`${product.code}-${idx}`}
                      className={`relative rounded-2xl transition-all duration-300 ${
                        isBlurred
                          ? 'filter blur-[8px] opacity-35 select-none pointer-events-none'
                          : ''
                      }`}
                      aria-hidden={isBlurred ? 'true' : undefined}
                    >
                      <ProductCard
                        product={product}
                        isSubscribed={isSubscribed}
                        onSelect={isBlurred ? () => {} : handleSelectProduct}
                        onOpenUpgrade={() => setIsPaywallOpen(true)}
                      />
                    </div>
                  );
                })}
              </div>

              {/* Limited Guest Access Overlay: Swiss Exhibition Paywall Card */}
              {!user && (totalResults > 2 || products.length > 2) && (
                <div className="absolute inset-0 bg-gradient-to-t from-[#FAFAFA] via-[#FAFAFA]/80 to-transparent flex items-end sm:items-center justify-center p-4 z-20 pointer-events-none">
                  <div className="max-w-md w-full rounded-lg bg-white border border-zinc-950 shadow-2xl p-7 text-center space-y-5 animate-slide-up pointer-events-auto">
                    <div className="w-12 h-12 mx-auto rounded-xl bg-zinc-950 text-white flex items-center justify-center shadow-soft-sm">
                      <Lock className="w-5 h-5 text-amber-400" />
                    </div>

                    <div className="space-y-1.5">
                      <h3 className="text-lg sm:text-xl font-sans font-bold text-zinc-950 tracking-tight">
                        {t('guestPaywall.title', { count: totalResults.toLocaleString() }) || `Sign In to See All ${totalResults.toLocaleString()} Products`}
                      </h3>
                      <p className="text-xs text-zinc-500 font-sans leading-relaxed">
                        {t('guestPaywall.previewDesc', { query: activeQuery }) || `You're viewing a free preview of 2 products for "${activeQuery}". Create a free account or sign in to browse all search results.`}
                      </p>
                    </div>

                    <div className="space-y-2 pt-1">
                      <button
                        type="button"
                        onClick={() => {
                          setAuthModalMode('signup');
                          setAuthPromptMessage(t('guestPaywall.cta') || 'Sign in or create a free account to unlock full catalog results.');
                          setIsAuthModalOpen(true);
                        }}
                        className="w-full flex items-center justify-center gap-2 py-3 px-5 rounded-lg bg-zinc-950 hover:bg-zinc-800 text-white font-semibold text-xs transition-all cursor-pointer shadow-soft-sm"
                      >
                        <UserPlus className="w-4 h-4 text-amber-400" />
                        <span>{t('guestPaywall.cta') || 'Sign In / Create Free Account'}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setAuthModalMode('signin');
                          setAuthPromptMessage('Sign in to view all search results.');
                          setIsAuthModalOpen(true);
                        }}
                        className="w-full py-2 px-4 rounded text-zinc-500 hover:text-zinc-950 text-xs font-medium transition-colors hover:bg-zinc-100 cursor-pointer"
                      >
                        {t('guestPaywall.alreadyHaveAccount') || 'Already have an account? Sign In'}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* Empty State */
            <div className="rounded-2xl bg-white border border-zinc-200/80 p-14 text-center space-y-3 max-w-md mx-auto shadow-soft-sm">
              <div className="w-14 h-14 mx-auto rounded-2xl bg-zinc-100 flex items-center justify-center text-zinc-400 text-2xl">
                🔍
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-serif text-zinc-950 font-medium">
                  {t('search.noResultsTitle') || 'No products found'}
                </h3>
                <p className="text-xs text-zinc-500 font-sans leading-relaxed">
                  {t('search.noResultsDesc') || 'Try searching for common brands like Nutella, Oatly, or Barilla.'}
                </p>
              </div>
            </div>
          )}
        </main>
      )}

      {/* Footer */}
      <Footer />

      {/* Product Detail Modal */}
      <ProductDetailModal
        product={selectedProduct}
        isOpen={isProductModalOpen}
        onClose={() => setIsProductModalOpen(false)}
        isSubscribed={isSubscribed}
        onOpenUpgrade={() => {
          setIsProductModalOpen(false);
          setIsPaywallOpen(true);
        }}
      />

      {/* Paywall & Stripe Upgrade Modal */}
      <PaywallModal
        isOpen={isPaywallOpen}
        onClose={() => setIsPaywallOpen(false)}
        onSubscriptionUpdated={handleSubscriptionUpdated}
      />

      {/* Auth Modal: Email, Username & Password */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onAuthSuccess={handleAuthSuccess}
        initialMode={authModalMode}
        promptMessage={authPromptMessage}
      />

      {/* User Profile & Account Benefits Modal */}
      <ProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        user={user}
        isSubscribed={isSubscribed}
        onLogout={handleLogout}
        onOpenUpgrade={() => setIsPaywallOpen(true)}
        onSubscriptionCanceled={loadUserData}
      />
    </div>
  );
}
