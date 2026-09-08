'use client';

import React from 'react';

interface NutriScoreBadgeProps {
  grade?: string;
  size?: 'sm' | 'md' | 'lg';
  showAllLetters?: boolean;
}

const scores = [
  { grade: 'a', color: 'bg-emerald-600', text: 'text-white' },
  { grade: 'b', color: 'bg-lime-500', text: 'text-white' },
  { grade: 'c', color: 'bg-yellow-400', text: 'text-zinc-950' },
  { grade: 'd', color: 'bg-orange-500', text: 'text-white' },
  { grade: 'e', color: 'bg-rose-600', text: 'text-white' },
];

export const NutriScoreBadge: React.FC<NutriScoreBadgeProps> = ({
  grade = 'unknown',
  size = 'md',
  showAllLetters = true,
}) => {
  const normalized = grade.toLowerCase();

  if (normalized === 'unknown' || !['a', 'b', 'c', 'd', 'e'].includes(normalized)) {
    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-zinc-100 text-zinc-500 border border-zinc-200">
        Nutri-Score N/A
      </span>
    );
  }

  if (!showAllLetters) {
    const item = scores.find((s) => s.grade === normalized)!;
    return (
      <span
        className={`inline-flex items-center justify-center font-bold uppercase rounded-md shadow-xs ${item.color} ${item.text} ${
          size === 'sm' ? 'w-6 h-6 text-xs' : size === 'lg' ? 'w-10 h-10 text-lg' : 'w-8 h-8 text-sm'
        }`}
      >
        {normalized}
      </span>
    );
  }

  return (
    <div className="inline-flex items-center p-1 rounded-xl bg-zinc-100/80 border border-zinc-200/80 shadow-soft-sm">
      <span className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider mr-1 px-1">
        Nutri-Score
      </span>
      <div className="flex items-center space-x-0.5">
        {scores.map((s) => {
          const isActive = s.grade === normalized;
          return (
            <div
              key={s.grade}
              className={`flex items-center justify-center font-bold uppercase transition-all duration-200 ${
                s.color
              } ${s.text} ${
                isActive
                  ? size === 'sm'
                    ? 'w-5 h-5 text-xs scale-110 rounded shadow-sm ring-2 ring-white z-10'
                    : 'w-6 h-6 text-xs scale-115 rounded-md shadow-md ring-2 ring-white z-10'
                  : 'w-3.5 h-4 text-[9px] opacity-40 rounded-xs'
              }`}
            >
              {s.grade}
            </div>
          );
        })}
      </div>
    </div>
  );
};
