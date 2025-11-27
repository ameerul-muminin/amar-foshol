'use client';

import React, { useState, useEffect } from 'react';
import WeatherDisplayPure from './weather-display-pure';
import AdvisoryPanel from './advisory-panel';
import OfflineIndicator from './offline-indicator';
import { WeatherData } from '@/lib/advisory-service';
import { generateAdvisories, Advisory, saveAdvisoryHistory } from '@/lib/advisory-service';
import { initializeDB, cacheWeatherData } from '@/lib/cache-service';
import { syncManager } from '@/lib/sync-manager';

export default function WeatherDisplay() {
  const [weatherData, setWeatherData] = useState<WeatherData[]>([]);
  const [advisories, setAdvisories] = useState<Advisory[]>([]);
  const [isOnline, setIsOnline] = useState(true);
  const [isCached, setIsCached] = useState(false);

  // Initialize offline support
  useEffect(() => {
    const setupOffline = async () => {
      try {
        await initializeDB();
        console.log('[Weather] IndexedDB initialized');

        // Initialize sync manager
        syncManager.initialize((status) => {
          console.log('[Weather] Sync status:', status);
        });
      } catch (err) {
        console.error('[Weather] Error initializing offline support:', err);
      }
    };

    setupOffline();

    // Track online/offline status
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Handle weather data from child component
  const handleWeatherDataFetched = async (
    division: string,
    district: string,
    forecasts: WeatherData[]
  ) => {
    setWeatherData(forecasts);

    // Generate advisories
    const advs = generateAdvisories(forecasts);
    advs.forEach((adv) => {
      saveAdvisoryHistory(adv);
    });
    setAdvisories(advs);

    // Cache the data for offline access
    try {
      const response = await fetch(
        `/api/weather?division=${encodeURIComponent(division)}&district=${encodeURIComponent(district)}`
      );
      const data = await response.json();
      await cacheWeatherData(division, district, data, advs);
    } catch (cacheErr) {
      console.error('[Weather] Error caching data:', cacheErr);
    }
  };

  return (
    <>
      <OfflineIndicator isSyncing={false} syncStatus={isCached ? 'ক্যাশড ডেটা' : ''} />
      {/* A3.3: Weather Display (Pure) */}
      <WeatherDisplayPure onDataFetched={handleWeatherDataFetched} />

      {/* A3.4: Smart Advisories */}
      {advisories.length > 0 && (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-2 sm:p-4 md:p-6 lg:p-8">
          <div className="w-full max-w-7xl mx-auto px-0">
            <AdvisoryPanel advisories={advisories} />
          </div>
        </div>
      )}
    </>
  );
}
