'use client';

import React from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import { RecentSearch } from '../types';
import { History, X, Trash2 } from 'lucide-react';

interface Props {
  searches: RecentSearch[];
  onSelectSearch: (query: string) => void;
  onDeleteSearch: (id: string) => void;
  onClearAll: () => void;
}

export const RecentSearches: React.FC<Props> = ({
  searches,
  onSelectSearch,
  onDeleteSearch,
  onClearAll,
}) => {
  const { t } = useLanguage();

  if (searches.length === 0) return null;

  return (
    <div className="w-full max-w-3xl mx-auto mt-4 px-2">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500">
          <History className="w-3.5 h-3.5" />
          <span>{t.recentSearches}</span>
          <span className="text-[10px] bg-slate-200/80 text-slate-700 px-1.5 py-0.2 rounded-full font-mono">
            {searches.length}
          </span>
        </div>
        <button
          onClick={onClearAll}
          className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-rose-600 transition font-medium"
          title={t.clearHistory}
        >
          <Trash2 className="w-3 h-3" />
          <span>{t.clearHistory}</span>
        </button>
      </div>

      <div className="flex flex-wrap gap-2 items-center">
        {searches.map((item) => (
          <div
            key={item.id}
            className="group inline-flex items-center gap-1.5 pl-3 pr-1.5 py-1 rounded-full bg-slate-100 hover:bg-slate-200/80 text-slate-700 text-xs font-medium border border-slate-200/70 transition-all shadow-2xs hover:shadow-xs"
          >
            <button
              onClick={() => onSelectSearch(item.query)}
              className="hover:text-emerald-700 transition max-w-[180px] truncate text-left"
            >
              {item.query}
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDeleteSearch(item.id);
              }}
              className="w-4 h-4 rounded-full flex items-center justify-center text-slate-400 hover:bg-slate-300 hover:text-slate-800 transition"
              aria-label={`Remove ${item.query} from history`}
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
