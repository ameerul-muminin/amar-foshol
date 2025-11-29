"use client";

import { Plant, Globe, SignOut, ArrowLeft } from '@phosphor-icons/react';
import { type Dispatch, type SetStateAction } from 'react';

interface Props {
  subtitle?: string;
  lang: 'bn' | 'en';
  setLang: Dispatch<SetStateAction<'bn' | 'en'>>;
  onLogout: () => void;
  onBack?: () => void;
}

export default function Header({ subtitle, lang, setLang, onLogout, onBack }: Props) {
  return (
    <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {onBack ? (
              <button
                onClick={onBack}
                aria-label="Back"
                className="p-2 rounded-md hover:bg-gray-100"
              >
                <ArrowLeft size={18} />
              </button>
            ) : null}

            <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center text-white">
              <Plant size={24} weight="fill" />
            </div>
            <div>
              <h1 className="font-bold text-lg">আমার ফসল</h1>
              {subtitle ? <p className="text-xs text-gray-500">{subtitle}</p> : null}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setLang(prev => prev === 'bn' ? 'en' : 'bn')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-gray-200 hover:border-emerald-500 transition-colors text-sm font-medium"
            >
              <Globe size={14} weight="bold" />
              {lang === 'bn' ? 'EN' : 'BN'}
            </button>

            <button
              onClick={onLogout}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-100 hover:bg-red-50 text-gray-700 hover:text-red-600 transition-colors text-sm font-medium"
            >
              <SignOut size={16} weight="bold" />
              <span className="hidden sm:inline">লগ আউট</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
