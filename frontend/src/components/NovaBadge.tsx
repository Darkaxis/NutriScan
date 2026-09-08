'use client';

import React from 'react';
import { useLanguage } from '@/i18n/LanguageContext';

interface NovaBadgeProps {
  group?: number;
}

export const NovaBadge: React.FC<NovaBadgeProps> = ({ group }) => {
  const { t } = useLanguage();

  if (!group || group < 1 || group > 4) {
    return null;
  }

  const colors = {
    1: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    2: 'bg-yellow-50 text-yellow-800 border-yellow-200',
    3: 'bg-orange-50 text-orange-800 border-orange-200',
    4: 'bg-rose-50 text-rose-800 border-rose-200',
  }[group] || 'bg-zinc-100 text-zinc-700 border-zinc-200';

  const desc = t(`product.novaDesc.${group}`) || `Group ${group}`;

  return (
    <div
      title={desc}
      className={`inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold border shadow-soft-sm ${colors}`}
    >
      <span className="font-bold">NOVA {group}</span>
      <span className="text-[10px] opacity-75 max-w-[130px] truncate hidden sm:inline">
        ({desc})
      </span>
    </div>
  );
};
