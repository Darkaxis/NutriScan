'use client';

import React from 'react';
import { Leaf } from 'lucide-react';

interface Props {
  grade?: string;
}

const ecoColors: Record<string, { bg: string; text: string; border: string }> = {
  a: { bg: 'bg-emerald-50', text: 'text-emerald-800', border: 'border-emerald-200' },
  b: { bg: 'bg-teal-50', text: 'text-teal-800', border: 'border-teal-200' },
  c: { bg: 'bg-yellow-50', text: 'text-yellow-800', border: 'border-yellow-200' },
  d: { bg: 'bg-amber-50', text: 'text-amber-800', border: 'border-amber-200' },
  e: { bg: 'bg-rose-50', text: 'text-rose-800', border: 'border-rose-200' },
  unknown: { bg: 'bg-zinc-50', text: 'text-zinc-500', border: 'border-zinc-200' },
};

export const EcoScoreBadge: React.FC<Props> = ({ grade = 'unknown' }) => {
  const normalized = grade.toLowerCase();
  const theme = ecoColors[normalized] || ecoColors.unknown;

  return (
    <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold border shadow-soft-sm ${theme.bg} ${theme.text} ${theme.border}`}>
      <Leaf className="w-3 h-3 text-emerald-600" />
      <span className="uppercase font-bold">ECO {normalized !== 'unknown' ? normalized.toUpperCase() : 'N/A'}</span>
    </div>
  );
};
