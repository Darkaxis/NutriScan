'use client';

import React, { useState, useEffect } from 'react';
import { Product } from '@/types';
import { useLanguage } from '@/i18n/LanguageContext';
import { NutriScoreBadge } from './NutriScoreBadge';
import { Lock, Eye, Flame, ArrowUpRight } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  isSubscribed: boolean;
  onSelect: (product: Product) => void;
  onOpenUpgrade?: () => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  isSubscribed,
  onSelect,
  onOpenUpgrade,
}) => {
  const { t } = useLanguage();
  const normalizeUrl = (url: string | null | undefined) => {
    if (!url) return null;
    return url.replace('https://images.openfoodfacts.org', 'https://static.openfoodfacts.org');
  };

  const [imgSrc, setImgSrc] = useState<string | null>(
    normalizeUrl(product.thumbnail) || normalizeUrl(product.image) || null
  );

  useEffect(() => {
    setImgSrc(normalizeUrl(product.thumbnail) || normalizeUrl(product.image) || null);
  }, [product.thumbnail, product.image]);

  return (
    <div
      onClick={() => onSelect(product)}
      className="group relative flex flex-col h-full rounded-lg bg-white border border-zinc-200 hover:border-zinc-950 hover:shadow-soft-md transition-all duration-200 overflow-hidden cursor-pointer"
    >
      {/* Packshot Container: Architectural Neutral Stage */}
      <div className="relative w-full h-56 sm:h-60 bg-zinc-50 p-5 flex items-center justify-center overflow-hidden border-b border-zinc-200 shrink-0">
        {imgSrc ? (
          <img
            src={imgSrc}
            alt={product.name}
            onError={() => {
              const mainImg = normalizeUrl(product.image);
              const thumbImg = normalizeUrl(product.thumbnail);
              if (imgSrc === thumbImg && mainImg && mainImg !== thumbImg) {
                setImgSrc(mainImg);
              } else if (imgSrc === mainImg && thumbImg && thumbImg !== mainImg) {
                setImgSrc(thumbImg);
              } else {
                setImgSrc(null);
              }
            }}
            className="relative z-10 max-h-full max-w-full object-contain filter drop-shadow-sm group-hover:scale-105 transition-transform duration-200 ease-out"
            loading="lazy"
          />
        ) : (
          <div className="relative z-10 flex flex-col items-center justify-center text-zinc-300">
            <span className="text-3xl">🥫</span>
            <span className="text-xs text-zinc-400 mt-1">No image available</span>
          </div>
        )}

        {/* Top Badges: Brand & Nutriscore */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2 z-20 pointer-events-none">
          <span className="inline-block px-2.5 py-1 rounded bg-white/95 text-zinc-800 text-xs font-medium border border-zinc-200 shadow-sm truncate max-w-[65%]">
            {product.brand || t('product.unknownBrand') || 'Brand'}
          </span>

          {isSubscribed && product.nutriscoreGrade && (
            <div className="pointer-events-auto rounded bg-white border border-zinc-200 p-0.5 shadow-sm">
              <NutriScoreBadge grade={product.nutriscoreGrade} size="sm" />
            </div>
          )}
        </div>

        {/* Bottom Tag: Quantity */}
        {product.quantity && (
          <div className="absolute bottom-2.5 left-3 z-20 pointer-events-none">
            <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-zinc-900/80 text-white shadow-sm">
              {product.quantity}
            </span>
          </div>
        )}
      </div>

      {/* Card Body */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-1">
          {product.categories?.[0] && (
            <p className="text-xs text-zinc-400 capitalize truncate">
              {product.categories[0]}
            </p>
          )}

          <div className="flex items-start justify-between gap-2">
            <h3
              className="font-bold text-zinc-950 text-sm sm:text-base line-clamp-2 leading-snug group-hover:text-zinc-700 transition-colors min-h-[2.5rem] flex-1"
              title={product.name}
            >
              {product.name || t('product.unnamed') || 'Product'}
            </h3>
            {(product.fallbackLanguage || product.isFallbackEn) && (
              <span
                title={
                  product.fallbackLanguage
                    ? t('product.fallbackNotice', {
                        lang: product.fallbackLanguage.toUpperCase(),
                        currentLang: 'selected language',
                      }) || `Original packaging text in ${product.fallbackLanguage.toUpperCase()}`
                    : t('product.fallbackEnTooltip') || 'English used as fallback'
                }
                className="shrink-0 mt-0.5 inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold tracking-wide bg-zinc-100 text-zinc-700 border border-zinc-200 uppercase"
              >
                {(product.fallbackLanguage || 'en').toUpperCase()}
              </span>
            )}
          </div>
        </div>

        {/* Nutritional Status Row */}
        <div className="pt-0.5">
          {isSubscribed ? (
            <div className="flex items-center justify-between text-xs py-2 px-3 rounded bg-zinc-50 border border-zinc-200 text-zinc-900 font-medium">
              <div className="flex items-center space-x-1.5">
                <Flame className="w-3.5 h-3.5 text-zinc-700 shrink-0" />
                <span className="text-xs text-zinc-500">{t('nutrition.energy') || 'Energy'}:</span>
              </div>
              <span className="font-bold text-zinc-950">
                {product.nutriments?.energyKcal100g !== undefined
                  ? `${product.nutriments.energyKcal100g} kcal`
                  : 'N/A'}
              </span>
            </div>
          ) : (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onOpenUpgrade?.();
              }}
              className="w-full flex items-center justify-between text-xs py-2 px-3 rounded bg-zinc-50 hover:bg-zinc-100 border border-zinc-200 text-zinc-600 hover:text-zinc-950 transition-colors group/lock text-left"
            >
              <div className="flex items-center space-x-1.5">
                <Lock className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                <span className="text-xs font-medium">Nutrition Facts (Pro)</span>
              </div>
              <span className="text-xs font-semibold text-zinc-900 group-hover/lock:underline flex items-center gap-0.5">
                Unlock &rarr;
              </span>
            </button>
          )}
        </div>

        {/* Action Button */}
        <button
          id={`view-product-${product.code}`}
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onSelect(product);
          }}
          className="w-full flex items-center justify-center space-x-2 py-2.5 px-3 rounded-md bg-zinc-950 hover:bg-zinc-800 text-white text-xs font-bold uppercase tracking-wider transition-all cursor-pointer"
        >
          <Eye className="w-3.5 h-3.5" />
          <span>{t('product.viewDetails') || 'View Details'}</span>
          <ArrowUpRight className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100 transition-opacity" />
        </button>
      </div>
    </div>
  );
};
