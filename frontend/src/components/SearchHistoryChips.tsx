'use client';

import React from 'react';
import { SearchHistoryItem } from '@/types';
import { useLanguage } from '@/i18n/LanguageContext';
import { Clock, Trash2, ArrowUpRight } from 'lucide-react';

interface SearchHistoryChipsProps {
  history: SearchHistoryItem[];
  onSelectQuery: (query: string) => void;
  onClearHistory: () => void;
}

export const SearchHistoryChips: React.FC<SearchHistoryChipsProps> = ({
  history,
  onSelectQuery,
  onClearHistory,
}) => {
  const { t } = useLanguage();

  if (!history || history.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-wrap items-center gap-2 pt-2">
      <div className="flex items-center space-x-1.5 text-xs text-zinc-400 font-medium mr-1">
        <Clock className="w-3.5 h-3.5 text-zinc-400" />
        <span>Recent:</span>
      </div>

      <div className="flex flex-wrap items-center gap-1.5">
        {history.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => onSelectQuery(item.query)}
            className="group inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-xs bg-white hover:bg-zinc-100 text-zinc-700 hover:text-zinc-950 border border-zinc-200 shadow-soft-sm transition-colors cursor-pointer"
          >
            <span>{item.query}</span>
            <span className="text-[11px] text-zinc-400">({item.resultCount})</span>
            <ArrowUpRight className="w-3 h-3 text-zinc-300 group-hover:text-zinc-600 transition-colors" />
          </button>
        ))}

        <button
          type="button"
          onClick={onClearHistory}
          title="Clear search history"
          className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs text-zinc-400 hover:text-rose-600 hover:bg-rose-50 border border-transparent transition-colors cursor-pointer"
        >
          <Trash2 className="w-3 h-3" />
          <span>{t('search.clearHistory') || 'Clear'}</span>
        </button>
      </div>
    </div>
  );
};
