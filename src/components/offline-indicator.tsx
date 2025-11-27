'use client';

import React, { useState, useEffect } from 'react';
import { Wifi, WifiOff, Loader } from 'lucide-react';

interface OfflineIndicatorProps {
  isSyncing?: boolean;
  syncStatus?: string;
}

export default function OfflineIndicator({ isSyncing = false, syncStatus = '' }: OfflineIndicatorProps) {
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    // Set initial state
    setIsOnline(navigator.onLine);

    // Handle online/offline events
    const handleOnline = () => {
      console.log('[Offline] Came online');
      setIsOnline(true);
    };

    const handleOffline = () => {
      console.log('[Offline] Went offline');
      setIsOnline(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Don't show anything if online and not syncing
  if (isOnline && !isSyncing) {
    return null;
  }

  return (
    <div
      className={`fixed bottom-4 right-4 p-3 sm:p-4 rounded-lg shadow-lg backdrop-blur-sm flex items-center gap-2 sm:gap-3 z-50 animate-fade-in ${
        isOnline
          ? 'bg-gradient-to-r from-blue-500/90 to-cyan-500/90 border border-blue-400/50'
          : 'bg-gradient-to-r from-red-500/90 to-orange-500/90 border border-red-400/50'
      }`}
    >
      {/* Icon */}
      <div className="flex-shrink-0">
        {isOnline ? (
          isSyncing ? (
            <Loader className="w-4 h-4 sm:w-5 sm:h-5 text-white animate-spin" />
          ) : (
            <Wifi className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
          )
        ) : (
          <WifiOff className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
        )}
      </div>

      {/* Text */}
      <div className="flex flex-col gap-0.5">
        <p className="text-xs sm:text-sm font-semibold text-white whitespace-nowrap">
          {isOnline ? (isSyncing ? 'সিঙ্ক হচ্ছে...' : 'সংযুক্ত') : 'অফলাইন'}
        </p>
        {syncStatus && (
          <p className="text-xs text-white/80 whitespace-nowrap">{syncStatus}</p>
        )}
        {!isOnline && (
          <p className="text-xs text-white/80">ক্যাশড ডেটা দেখছেন</p>
        )}
      </div>
    </div>
  );
}
