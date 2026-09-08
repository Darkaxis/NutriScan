'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useLanguage, SUPPORTED_LANGUAGES } from '@/i18n/LanguageContext';
import { ChevronDown, Check } from 'lucide-react';

export const LanguageSelector: React.FC = () => {
  const { language, setLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentOption = SUPPORTED_LANGUAGES.find((opt) => opt.code === language) || SUPPORTED_LANGUAGES[0];

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        id="language-selector-button"
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-2.5 py-1.5 rounded-full bg-white hover:bg-zinc-50 text-zinc-700 hover:text-zinc-950 text-xs font-medium border border-zinc-200 shadow-soft-sm transition-all duration-150 cursor-pointer"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <span className="text-sm leading-none">{currentOption.flag}</span>
        <span className="font-semibold text-zinc-900">{currentOption.code.toUpperCase()}</span>
        <ChevronDown className={`w-3.5 h-3.5 text-zinc-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 rounded-2xl bg-white shadow-soft-xl border border-zinc-200/90 py-1.5 z-50 animate-fade-in divide-y divide-zinc-100">
          <div className="px-3.5 py-1.5 text-[10px] font-semibold text-zinc-400 uppercase tracking-wider">
            Language
          </div>
          <div className="py-1">
            {SUPPORTED_LANGUAGES.map((opt) => {
              const isSelected = opt.code === language;
              return (
                <button
                  key={opt.code}
                  id={`language-option-${opt.code}`}
                  onClick={() => {
                    setLanguage(opt.code);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-2 text-xs transition-colors cursor-pointer ${
                    isSelected
                      ? 'bg-zinc-100 text-zinc-950 font-semibold'
                      : 'text-zinc-600 hover:bg-zinc-50 hover:text-zinc-950'
                  }`}
                >
                  <div className="flex items-center space-x-2.5">
                    <span className="text-base leading-none">{opt.flag}</span>
                    <div className="text-left">
                      <div className="leading-tight text-zinc-900 text-xs font-medium">{opt.nativeName}</div>
                      <div className="text-[10px] text-zinc-400 leading-tight">{opt.label}</div>
                    </div>
                  </div>
                  {isSelected && <Check className="w-3.5 h-3.5 text-emerald-600" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
