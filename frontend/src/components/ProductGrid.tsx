'use client';

import React from 'react';
import { Product } from '../types';
import { ProductCard } from './ProductCard';
import { useLanguage } from '../i18n/LanguageContext';
import { PackageSearch, AlertCircle } from 'lucide-react';

interface Props {
  products: Product[];
  total: number;
  isLoading: boolean;
  isSubscribed: boolean;
  onSelectProduct: (product: Product) => void;
  searched: boolean;
}

export const ProductGrid: React.FC<Props> = ({
  products,
  total,
  isLoading,
  isSubscribed,
  onSelectProduct,
  searched,
}) => {
  const { t } = useLanguage();

  if (isLoading) {
    return (
      <div className="w-full max-w-7xl mx-auto mt-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="rounded-3xl bg-white/95 border border-slate-200/80 overflow-hidden flex flex-col h-full animate-pulse shadow-xs"
            >
              <div className="w-full h-52 sm:h-56 bg-slate-100/90 relative" />
              <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="h-4 bg-slate-100 rounded-lg w-4/5" />
                  <div className="h-3.5 bg-slate-100 rounded-lg w-1/2" />
                </div>
                <div className="space-y-3 pt-2">
                  <div className="h-8 bg-slate-100 rounded-2xl w-full" />
                  <div className="h-9 bg-slate-100 rounded-2xl w-full" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (searched && products.length === 0) {
    return (
      <div className="w-full max-w-md mx-auto mt-16 text-center p-8 bg-white rounded-2xl border border-slate-200 shadow-sm">
        <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center mb-3">
          <PackageSearch className="w-6 h-6 stroke-1.5" />
        </div>
        <h3 className="font-bold text-slate-800 text-base">{t.noProductsFound}</h3>
        <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">{t.noProductsSubtext}</p>
      </div>
    );
  }

  if (products.length === 0) {
    return null;
  }

  return (
    <div className="w-full max-w-7xl mx-auto mt-8">
      {/* Result Count Header */}
      <div className="flex items-center justify-between mb-4 px-2">
        <p className="text-xs font-semibold text-slate-500">
          <span className="font-bold text-slate-900">{total}</span> {t.resultsFound}
        </p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard
            key={product.code || product.name}
            product={product}
            isSubscribed={isSubscribed}
            onSelect={onSelectProduct}
          />
        ))}
      </div>
    </div>
  );
};
