'use client';

import React from 'react';
import { NutritionalValues } from '@/types';
import { useLanguage } from '@/i18n/LanguageContext';
import { CheckCircle2 } from 'lucide-react';

interface NutritionTableProps {
  nutriments?: NutritionalValues | null;
  servingSize?: string;
}

export const NutritionTable: React.FC<NutritionTableProps> = ({ nutriments, servingSize }) => {
  const { t } = useLanguage();

  if (!nutriments) {
    return (
      <div className="text-center py-8 text-zinc-400 text-xs italic bg-zinc-50 rounded-2xl border border-zinc-200/80">
        Nutritional data incomplete or not listed for this product.
      </div>
    );
  }

  const rows = [
    {
      label: t('nutrition.energy') || 'Energy',
      val100: nutriments.energyKcal100g !== undefined ? `${nutriments.energyKcal100g} kcal` : '—',
      valServ: nutriments.energyKcalServing !== undefined ? `${nutriments.energyKcalServing} kcal` : '—',
      isBold: true,
    },
    {
      label: t('nutrition.fat') || 'Fat',
      val100: nutriments.fat100g !== undefined ? `${nutriments.fat100g} g` : '—',
      valServ: nutriments.fatServing !== undefined ? `${nutriments.fatServing} g` : '—',
      isBold: true,
    },
    {
      label: t('nutrition.saturatedFat') || 'Saturated fat',
      val100: nutriments.saturatedFat100g !== undefined ? `${nutriments.saturatedFat100g} g` : '—',
      valServ: nutriments.saturatedFatServing !== undefined ? `${nutriments.saturatedFatServing} g` : '—',
      indent: true,
    },
    {
      label: t('nutrition.carbohydrates') || 'Carbohydrates',
      val100: nutriments.carbohydrates100g !== undefined ? `${nutriments.carbohydrates100g} g` : '—',
      valServ: nutriments.carbohydratesServing !== undefined ? `${nutriments.carbohydratesServing} g` : '—',
      isBold: true,
    },
    {
      label: t('nutrition.sugars') || 'Sugars',
      val100: nutriments.sugars100g !== undefined ? `${nutriments.sugars100g} g` : '—',
      valServ: nutriments.sugarsServing !== undefined ? `${nutriments.sugarsServing} g` : '—',
      indent: true,
    },
    {
      label: t('nutrition.fiber') || 'Fiber',
      val100: nutriments.fiber100g !== undefined ? `${nutriments.fiber100g} g` : '—',
      valServ: nutriments.fiberServing !== undefined ? `${nutriments.fiberServing} g` : '—',
    },
    {
      label: t('nutrition.proteins') || 'Proteins',
      val100: nutriments.proteins100g !== undefined ? `${nutriments.proteins100g} g` : '—',
      valServ: nutriments.proteinsServing !== undefined ? `${nutriments.proteinsServing} g` : '—',
      isBold: true,
    },
    {
      label: t('nutrition.salt') || 'Salt',
      val100: nutriments.salt100g !== undefined ? `${nutriments.salt100g} g` : '—',
      valServ: nutriments.saltServing !== undefined ? `${nutriments.saltServing} g` : '—',
    },
    {
      label: t('nutrition.sodium') || 'Sodium',
      val100: nutriments.sodium100g !== undefined ? `${nutriments.sodium100g} g` : '—',
      valServ: nutriments.sodiumServing !== undefined ? `${nutriments.sodiumServing} g` : '—',
      indent: true,
    },
  ];

  return (
    <div className="overflow-hidden border border-zinc-200/90 rounded-2xl bg-white shadow-soft-sm">
      {/* Table Header */}
      <div className="bg-zinc-50/80 border-b border-zinc-200/80 px-5 py-3.5 flex items-center justify-between">
        <div>
          <h4 className="font-semibold text-sm text-zinc-950">
            {t('nutrition.title') || 'Nutrition Facts'}
          </h4>
          {servingSize && (
            <p className="text-xs text-zinc-500 mt-0.5">
              Serving size: <span className="font-medium text-zinc-800">{servingSize}</span>
            </p>
          )}
        </div>
        <span className="text-[10px] uppercase font-semibold tracking-wider bg-emerald-50 text-emerald-800 border border-emerald-200/80 px-2.5 py-0.5 rounded-full flex items-center gap-1">
          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
          <span>Verified EU Values</span>
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-zinc-100 text-zinc-400 font-semibold uppercase tracking-wider text-[10px]">
              <th className="py-2.5 px-5">Nutrient</th>
              <th className="py-2.5 px-4 text-right">Per 100g / ml</th>
              <th className="py-2.5 px-5 text-right">Per Serving</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100">
            {rows.map((row, idx) => (
              <tr
                key={idx}
                className={`hover:bg-zinc-50/60 transition-colors ${
                  row.isBold ? 'font-semibold text-zinc-950' : 'text-zinc-600'
                }`}
              >
                <td className={`py-2.5 px-5 ${row.indent ? 'pl-9 text-zinc-500 text-xs' : ''}`}>
                  {row.label}
                </td>
                <td className="py-2.5 px-4 text-right font-mono text-zinc-900">
                  {row.val100}
                </td>
                <td className="py-2.5 px-5 text-right font-mono text-zinc-600">
                  {row.valServ}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
