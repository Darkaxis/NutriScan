'use client';

import React, { useState, FormEvent } from 'react';
import { useLanguage } from '@/i18n/LanguageContext';
import { Search, X, Loader2 } from 'lucide-react';

interface SearchBarProps {
  onSearch: (query: string) => void;
  isLoading: boolean;
  initialQuery?: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  onSearch,
  isLoading,
  initialQuery = '',
}) => {
  const { t } = useLanguage();
  const [query, setQuery] = useState(initialQuery);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
    }
  };

  const handleClear = () => {
    setQuery('');
  };

  const suggestions = ['Nutella', 'Oatly', 'Barilla', 'Gouda', 'Haribo'];

  return (
    <div className="w-full space-y-3">
      <form onSubmit={handleSubmit} className="relative w-full">
        <div className="relative flex items-center w-full rounded-xl bg-white border border-zinc-300 hover:border-zinc-400 focus-within:border-zinc-900 focus-within:ring-2 focus-within:ring-zinc-900/10 transition-all p-1.5 shadow-sm">
          {/* Search Icon */}
          <div className="pl-3 pr-2 text-zinc-400 shrink-0 select-none pointer-events-none">
            <Search className="w-4 h-4" />
          </div>

          {/* Text Input with flex-1, min-w-0, and truncate to prevent any text overflow or overlap */}
          <input
            id="food-search-input"
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t('search.placeholder') || 'Search by product, brand, or barcode (e.g. Nutella)...'}
            className="flex-1 min-w-0 py-2 pl-1.5 pr-3 text-zinc-900 text-sm font-sans placeholder:text-zinc-400 bg-transparent focus:outline-none truncate"
          />

          {/* Clear Button (when query has text) */}
          {query && (
            <button
              type="button"
              onClick={handleClear}
              className="p-1.5 mr-1 text-zinc-400 hover:text-zinc-700 transition-colors shrink-0 cursor-pointer rounded-full hover:bg-zinc-100"
              title="Clear search"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}

          {/* Submit Action Button cleanly docked inside container */}
          <button
            id="food-search-submit"
            type="submit"
            disabled={isLoading || !query.trim()}
            className="shrink-0 inline-flex items-center justify-center space-x-1.5 px-4 sm:px-5 py-2 rounded-lg bg-zinc-950 hover:bg-zinc-800 active:scale-[0.98] disabled:opacity-40 disabled:hover:bg-zinc-950 text-white font-semibold text-xs uppercase tracking-wider transition-all cursor-pointer select-none"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin text-white" />
                <span className="hidden sm:inline">{t('search.searching') || 'Searching'}</span>
              </>
            ) : (
              <span>{t('search.button') || 'Search'}</span>
            )}
          </button>
        </div>
      </form>

      {/* Popular Suggestions as Clean Natural Pills */}
      <div className="flex flex-wrap items-center gap-1.5 text-xs text-zinc-500">
        <span className="text-xs font-medium text-zinc-400 mr-1">
          {t('search.popularSuggestions') || 'Try'}:
        </span>
        {suggestions.map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => {
              setQuery(item);
              onSearch(item);
            }}
            className="px-3 py-1 rounded-full bg-white hover:bg-zinc-100 text-zinc-700 hover:text-zinc-950 text-xs border border-zinc-200 shadow-soft-sm transition-colors cursor-pointer"
          >
            {item}
          </button>
        ))}
      </div>
    </div>
  );
};
