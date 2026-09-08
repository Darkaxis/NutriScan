'use client';

import React, { useEffect, useState } from 'react';
import { Product } from '../types';
import { useLanguage } from '../i18n/LanguageContext';
import { NutriScoreBadge } from './NutriScoreBadge';
import { EcoScoreBadge } from './EcoScoreBadge';
import { NovaBadge } from './NovaBadge';
import { NutritionTable } from './NutritionTable';
import { PaywallOverlay } from './PaywallOverlay';
import { X, AlertTriangle, Scale, Tag, ImageOff } from 'lucide-react';
import { getProductByBarcode } from '../lib/api';

export interface ProductDetailModalProps {
  product: Product | null;
  isOpen: boolean;
  isSubscribed: boolean;
  onClose: () => void;
  onSimulatePro?: () => void;
  onOpenUpgrade?: () => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product: initialProduct,
  isOpen,
  isSubscribed,
  onClose,
  onSimulatePro = () => {},
  onOpenUpgrade,
}) => {
  const { language, t } = useLanguage();
  const normalizeUrl = (url: string | null | undefined) => {
    if (!url) return null;
    return url.replace('https://images.openfoodfacts.org', 'https://static.openfoodfacts.org');
  };

  const [product, setProduct] = useState<Product | null>(initialProduct);
  const [currentSrc, setCurrentSrc] = useState<string | null>(
    normalizeUrl(initialProduct?.image) || normalizeUrl(initialProduct?.thumbnail) || null
  );
  const [activeTab, setActiveTab] = useState<'nutrition' | 'ingredients'>('nutrition');

  useEffect(() => {
    setProduct(initialProduct);
    setCurrentSrc(normalizeUrl(initialProduct?.image) || normalizeUrl(initialProduct?.thumbnail) || null);

    if (initialProduct?.code) {
      getProductByBarcode(initialProduct.code, language)
        .then((fresh) => {
          if (fresh) {
            setProduct(fresh);
            setCurrentSrc(normalizeUrl(fresh.image) || normalizeUrl(fresh.thumbnail) || null);
          }
        })
        .catch((err) => console.warn('Could not reload product details:', err));
    }
  }, [initialProduct, isSubscribed, language]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !product) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      {/* Dark Subtle Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-zinc-900/50 backdrop-blur-xs transition-opacity animate-fade-in"
      />

      {/* Modal Dialog Content: Clean White Exhibition Dialog */}
      <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-soft-xl border border-zinc-200/90 overflow-hidden z-10 my-auto animate-slide-up max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-100 bg-white shrink-0">
          <div className="flex items-center gap-2.5">
            <span className="text-xs font-semibold uppercase tracking-wider text-zinc-700 bg-zinc-100 px-2.5 py-0.5 rounded-md border border-zinc-200/80">
              {product.brand || 'Brand'}
            </span>
            <span className="text-xs font-mono text-zinc-400">
              #{product.code}
            </span>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 transition cursor-pointer"
            aria-label={t.close || 'Close'}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="overflow-y-auto p-6 sm:p-8 flex-grow space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Column: Packshot, Title, Scores */}
            <div className="lg:col-span-5 flex flex-col gap-5">
              <div className="relative w-full h-64 sm:h-72 bg-zinc-50 rounded-2xl p-6 flex items-center justify-center border border-zinc-200/80 overflow-hidden">
                {currentSrc ? (
                  <img
                    src={currentSrc}
                    alt={product.name}
                    onError={() => {
                      const thumb = normalizeUrl(product.thumbnail);
                      const full = normalizeUrl(product.image);
                      if (currentSrc === full && thumb && thumb !== full) {
                        setCurrentSrc(thumb);
                      } else if (currentSrc === thumb && full && full !== thumb) {
                        setCurrentSrc(full);
                      } else {
                        setCurrentSrc(null);
                      }
                    }}
                    className="relative z-10 max-h-full max-w-full object-contain filter drop-shadow-sm"
                  />
                ) : (
                  <div className="relative z-10 flex flex-col items-center justify-center text-zinc-300 gap-2">
                    <ImageOff className="w-8 h-8 stroke-1" />
                    <span className="text-xs text-zinc-400">No image available</span>
                  </div>
                )}
              </div>

              <div className="space-y-1">
                <div className="flex items-start justify-between gap-2">
                  <h2 className="text-xl font-serif text-zinc-950 font-medium tracking-tight leading-snug flex-1">
                    {product.name}
                  </h2>
                  {(product.fallbackLanguage || product.isFallbackEn) && (
                    <span
                      title={
                        product.fallbackLanguage
                          ? t('product.fallbackNotice', {
                              lang: product.fallbackLanguage.toUpperCase(),
                              currentLang: language.toUpperCase(),
                            }) || `Original packaging recorded in ${product.fallbackLanguage.toUpperCase()}`
                          : t('product.fallbackEnTooltip') || 'English used as fallback'
                      }
                      className="shrink-0 mt-1 inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold tracking-wide bg-zinc-100 text-zinc-700 border border-zinc-200 uppercase"
                    >
                      {(product.fallbackLanguage || 'en').toUpperCase()} {t('product.fallbackEn')?.includes('Fallback') ? 'Fallback' : ''}
                    </span>
                  )}
                </div>
                {product.quantity && (
                  <p className="text-xs text-zinc-500 flex items-center gap-1.5 pt-0.5">
                    <Scale className="w-3.5 h-3.5 text-zinc-400" />
                    <span>{t.quantity || 'Quantity'}: {product.quantity}</span>
                  </p>
                )}

                {/* Subtle Language Availability Notice */}
                {(product.fallbackLanguage || (product.availableLanguages && product.availableLanguages.length > 0 && !product.availableLanguages.includes(language))) && (
                  <div className="mt-2 py-2 px-3 rounded-lg bg-amber-50/70 border border-amber-200/80 text-[11px] text-amber-900 flex items-center justify-between gap-2">
                    <span className="leading-snug">
                      {t('product.fallbackNotice', {
                        lang: (product.fallbackLanguage || 'en').toUpperCase(),
                        currentLang: language.toUpperCase(),
                      }) || `Original packaging recorded in ${(product.fallbackLanguage || 'en').toUpperCase()}.`}
                    </span>
                    {product.availableLanguages && product.availableLanguages.length > 0 && (
                      <span className="shrink-0 font-medium text-[10px] text-amber-800 uppercase tracking-wider">
                        {product.availableLanguages.join(' · ')}
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Clean Score Badges */}
              <div className="p-4 bg-zinc-50 rounded-2xl border border-zinc-200/80 flex flex-wrap items-center justify-between gap-2.5">
                <NutriScoreBadge grade={product.nutriscoreGrade} size="lg" />

                {product.ecoscoreGrade && product.ecoscoreGrade !== 'unknown' && (
                  <div className="flex flex-col items-center">
                    <EcoScoreBadge grade={product.ecoscoreGrade} />
                    <span className="text-[10px] text-zinc-400 font-medium mt-1">Impact</span>
                  </div>
                )}

                {product.novaGroup && (
                  <div className="flex flex-col items-center">
                    <NovaBadge group={product.novaGroup} />
                    <span className="text-[10px] text-zinc-400 font-medium mt-1">Processing</span>
                  </div>
                )}
              </div>

              {/* Categories */}
              {product.categories.length > 0 && (
                <div>
                  <h4 className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <Tag className="w-3 h-3 text-zinc-400" />
                    {t.categories || 'Categories'}
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {product.categories.map((cat, i) => (
                      <span
                        key={i}
                        className="text-xs bg-zinc-100 text-zinc-700 px-2.5 py-1 rounded-lg font-medium capitalize"
                      >
                        {cat}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right Column: Tabs (Nutrition & Ingredients) */}
            <div className="lg:col-span-7 flex flex-col">
              {/* Clean Tab Pills */}
              <div className="flex items-center gap-2 border-b border-zinc-200/80 pb-3.5 mb-5">
                <button
                  onClick={() => setActiveTab('nutrition')}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold transition flex items-center gap-1.5 cursor-pointer ${
                    activeTab === 'nutrition'
                      ? 'bg-zinc-950 text-white shadow-soft-sm'
                      : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200/70'
                  }`}
                >
                  <span>{t.nutritionFacts || 'Nutrition Facts'}</span>
                  {!isSubscribed && (
                    <span className="text-[9px] bg-amber-400 text-zinc-950 px-1.5 py-0.2 rounded font-bold">
                      PRO
                    </span>
                  )}
                </button>

                <button
                  onClick={() => setActiveTab('ingredients')}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold transition flex items-center gap-1.5 cursor-pointer ${
                    activeTab === 'ingredients'
                      ? 'bg-zinc-950 text-white shadow-soft-sm'
                      : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200/70'
                  }`}
                >
                  <span>{t.ingredients || 'Ingredients'}</span>
                </button>
              </div>

              {/* Tab 1: Nutrition */}
              {activeTab === 'nutrition' && (
                <div className="space-y-4">
                  {isSubscribed ? (
                    product.nutriments ? (
                      <NutritionTable nutriments={product.nutriments} servingSize={product.servingSize} />
                    ) : (
                      <div className="p-8 text-center bg-zinc-50 rounded-2xl border border-zinc-200/80 space-y-2">
                        <AlertTriangle className="w-6 h-6 text-amber-500 mx-auto" />
                        <p className="text-xs font-medium text-zinc-600">
                          Nutritional values are not recorded on Open Food Facts for this product.
                        </p>
                      </div>
                    )
                  ) : (
                    <PaywallOverlay onSimulatePro={onSimulatePro || onOpenUpgrade || (() => {})} />
                  )}
                </div>
              )}

              {/* Tab 2: Ingredients & Allergens */}
              {activeTab === 'ingredients' && (
                <div className="space-y-5">
                  <div className="p-5 bg-zinc-50 rounded-2xl border border-zinc-200/80 space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <h4 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                        {t.ingredients || 'Ingredients'}
                      </h4>
                      {(product.fallbackLanguage || product.isFallbackEn) && (
                        <span className="text-[10px] text-zinc-400 font-medium uppercase">
                          {(product.fallbackLanguage || 'en').toUpperCase()} {t('product.fallbackEn')?.includes('Fallback') ? 'Fallback' : ''}
                        </span>
                      )}
                    </div>
                    <p className="text-xs sm:text-sm text-zinc-800 leading-relaxed font-normal whitespace-pre-wrap">
                      {product.ingredientsText || t.noIngredients || 'No ingredients listed in this language.'}
                    </p>
                  </div>

                  {product.allergens.length > 0 && (
                    <div className="p-5 bg-rose-50/70 rounded-2xl border border-rose-200/80 space-y-2">
                      <h4 className="text-xs font-semibold text-rose-800 uppercase tracking-wider flex items-center gap-1.5">
                        <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                        {t.allergens || 'Allergens Detected'} ({product.allergens.length})
                      </h4>
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {product.allergens.map((alg, i) => (
                          <span
                            key={i}
                            className="text-xs font-medium bg-rose-100 text-rose-900 px-2.5 py-1 rounded-lg capitalize"
                          >
                            {alg}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
