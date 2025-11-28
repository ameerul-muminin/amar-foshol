'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { divisions } from '@/lib/locations';
import { toBanglaNumber, formatTemperatureBn, formatPercentageBn, formatDateBn } from '@/lib/bangla-numbers';
import { 
  ArrowLeft,
  Globe,
  CloudRain,
  Sun,
  Cloud,
  Drop,
  Thermometer,
  Warning,
  CheckCircle,
  MapPin,
  Calendar,
  Wind
} from '@phosphor-icons/react';

interface WeatherResponse {
  location: {
    latitude: number;
    longitude: number;
    timezone: string;
  };
  forecasts: Array<{
    date: string;
    tempMax: number;
    tempMin: number;
    humidity: number;
    rainProbability: number;
  }>;
  lastUpdated: string;
  isMockData?: boolean;
}

export default function WeatherPage() {
  const router = useRouter();
  const [lang, setLang] = useState<'bn' | 'en'>('bn');
  const [selectedDivisionIndex, setSelectedDivisionIndex] = useState(0);
  const [selectedDistrictIndex, setSelectedDistrictIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [weatherData, setWeatherData] = useState<WeatherResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const currentDivision = divisions[selectedDivisionIndex];
  const currentDistricts = currentDivision.districts;

  // Translations
  const t = {
    bn: {
      title: 'আবহাওয়া',
      subtitle: 'আপনার এলাকার আবহাওয়া পূর্বাভাস',
      selectLocation: 'অবস্থান নির্বাচন',
      division: 'বিভাগ',
      district: 'জেলা',
      fetchWeather: 'আবহাওয়া দেখুন',
      loading: 'লোড হচ্ছে...',
      forecast: '৫ দিনের পূর্বাভাস',
      maxTemp: 'সর্বোচ্চ',
      minTemp: 'সর্বনিম্ন',
      humidity: 'আর্দ্রতা',
      rain: 'বৃষ্টি',
      offlineMode: 'অফলাইন মোড',
      offlineDesc: 'সার্ভারে সংযোগ করা যায়নি। অনুমানমূলক তথ্য দেখানো হচ্ছে।',
      error: 'ত্রুটি',
      emptyState: 'আপনার এলাকা নির্বাচন করে আবহাওয়া দেখুন',
      locationInfo: 'অবস্থান তথ্য',
      latitude: 'অক্ষাংশ',
      longitude: 'দ্রাঘিমাংশ',
      timezone: 'সময় অঞ্চল',
      lastUpdated: 'আপডেট'
    },
    en: {
      title: 'Weather',
      subtitle: 'Weather forecast for your area',
      selectLocation: 'Select Location',
      division: 'Division',
      district: 'District',
      fetchWeather: 'View Weather',
      loading: 'Loading...',
      forecast: '5-Day Forecast',
      maxTemp: 'Max',
      minTemp: 'Min',
      humidity: 'Humidity',
      rain: 'Rain',
      offlineMode: 'Offline Mode',
      offlineDesc: 'Unable to connect to server. Showing estimated data.',
      error: 'Error',
      emptyState: 'Select your area to view weather',
      locationInfo: 'Location Info',
      latitude: 'Latitude',
      longitude: 'Longitude',
      timezone: 'Timezone',
      lastUpdated: 'Updated'
    }
  };

  const text = t[lang];

  // Load saved language preference
  useEffect(() => {
    const loadLang = async () => {
      try {
        const { getCurrentFarmer } = await import('@/lib/auth');
        const farmer = await getCurrentFarmer();
        if (farmer) {
          setLang(farmer.language);
        }
      } catch (error) {
        console.error('Error loading language:', error);
      }
    };
    loadLang();
  }, []);

  const handleDivisionChange = (divIndex: number) => {
    setSelectedDivisionIndex(divIndex);
    setSelectedDistrictIndex(0); // Reset to first district
    setWeatherData(null);
    setError(null);
  };

  const handleFetchWeather = async () => {
    setLoading(true);
    setError(null);
    setWeatherData(null);

    try {
      const division = currentDivision.name;
      const district = currentDistricts[selectedDistrictIndex].name;
      
      const params = new URLSearchParams({
        division,
        district,
      });

      const response = await fetch(`/api/weather?${params}`);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch weather');
      }

      const data: WeatherResponse = await response.json();
      setWeatherData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  const getWeatherIcon = (temp: number, rain: number) => {
    if (rain > 70) return <CloudRain size={32} weight="duotone" className="text-blue-500" />;
    if (temp > 32) return <Sun size={32} weight="duotone" className="text-yellow-500" />;
    return <Cloud size={32} weight="duotone" className="text-gray-400" />;
  };

  const formatDate = (dateStr: string) => {
    if (lang === 'bn') {
      return formatDateBn(dateStr);
    }
    return new Date(dateStr).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  };

  const formatTemp = (temp: number) => {
    if (lang === 'bn') {
      return formatTemperatureBn(temp);
    }
    return `${temp.toFixed(1)}°C`;
  };

  const formatPercent = (val: number) => {
    if (lang === 'bn') {
      return formatPercentageBn(val);
    }
    return `${val}%`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => router.push('/dashboard')}
                className="w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-xl flex items-center justify-center text-gray-600 transition-colors"
              >
                <ArrowLeft size={20} weight="bold" />
              </button>
              <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center text-white">
                <CloudRain size={24} weight="fill" />
              </div>
              <div>
                <h1 className="font-bold text-lg text-gray-900">{text.title}</h1>
                <p className="text-xs text-gray-500">{text.subtitle}</p>
              </div>
            </div>

            <button
              onClick={() => setLang(prev => prev === 'bn' ? 'en' : 'bn')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-gray-200 hover:border-emerald-500 transition-colors text-sm font-medium"
            >
              <Globe size={14} weight="bold" />
              {lang === 'bn' ? 'EN' : 'BN'}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Location Selection Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6 mb-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <MapPin size={20} weight="duotone" className="text-emerald-600" />
            {text.selectLocation}
          </h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            {/* Division */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {text.division}
              </label>
              <select
                value={selectedDivisionIndex}
                onChange={(e) => handleDivisionChange(parseInt(e.target.value))}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-colors bg-white text-gray-900"
              >
                {divisions.map((div, index) => (
                  <option key={div.name} value={index}>
                    {lang === 'bn' ? div.nameBn : div.name}
                  </option>
                ))}
              </select>
            </div>

            {/* District */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {text.district}
              </label>
              <select
                value={selectedDistrictIndex}
                onChange={(e) => setSelectedDistrictIndex(parseInt(e.target.value))}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-colors bg-white text-gray-900"
              >
                {currentDistricts.map((dist, index) => (
                  <option key={dist.name} value={index}>
                    {lang === 'bn' ? dist.nameBn : dist.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Fetch Button */}
          <button
            onClick={handleFetchWeather}
            disabled={loading}
            className="w-full sm:w-auto px-6 py-3 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-white font-semibold rounded-xl transition-colors flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                {text.loading}
              </>
            ) : (
              <>
                <CloudRain size={20} weight="duotone" />
                {text.fetchWeather}
              </>
            )}
          </button>
        </div>

        {/* Offline Warning */}
        {weatherData?.isMockData && (
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 mb-6 flex items-start gap-3">
            <Warning size={24} weight="duotone" className="text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-amber-900">{text.offlineMode}</p>
              <p className="text-sm text-amber-700">{text.offlineDesc}</p>
            </div>
          </div>
        )}

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-4 mb-6 flex items-start gap-3">
            <Warning size={24} weight="duotone" className="text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-red-900">{text.error}</p>
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        )}

        {/* Weather Data */}
        {weatherData && (
          <>
            {/* Location Info */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6 mb-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <CheckCircle size={20} weight="duotone" className="text-emerald-600" />
                {text.locationInfo}
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3 bg-gray-50 rounded-xl">
                  <p className="text-xs text-gray-500 mb-1">{text.latitude}</p>
                  <p className="font-semibold text-gray-900">
                    {lang === 'bn' 
                      ? toBanglaNumber(weatherData.location.latitude.toFixed(4))
                      : weatherData.location.latitude.toFixed(4)}
                  </p>
                </div>
                <div className="p-3 bg-gray-50 rounded-xl">
                  <p className="text-xs text-gray-500 mb-1">{text.longitude}</p>
                  <p className="font-semibold text-gray-900">
                    {lang === 'bn'
                      ? toBanglaNumber(weatherData.location.longitude.toFixed(4))
                      : weatherData.location.longitude.toFixed(4)}
                  </p>
                </div>
                <div className="p-3 bg-gray-50 rounded-xl">
                  <p className="text-xs text-gray-500 mb-1">{text.timezone}</p>
                  <p className="font-semibold text-gray-900 text-sm">
                    {lang === 'bn' ? 'এশিয়া/ঢাকা' : weatherData.location.timezone}
                  </p>
                </div>
                <div className="p-3 bg-gray-50 rounded-xl">
                  <p className="text-xs text-gray-500 mb-1">{text.lastUpdated}</p>
                  <p className="font-semibold text-gray-900 text-sm">
                    {new Date(weatherData.lastUpdated).toLocaleTimeString(lang === 'bn' ? 'bn-BD' : 'en-US', { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            </div>

            {/* 5-Day Forecast */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Calendar size={20} weight="duotone" className="text-blue-600" />
                {text.forecast}
              </h3>
              
              {/* Mobile: Vertical cards, Desktop: Horizontal cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                {weatherData.forecasts.map((forecast, index) => (
                  <div
                    key={index}
                    className="bg-gradient-to-br from-gray-50 to-white border border-gray-100 rounded-2xl p-4 hover:shadow-md transition-shadow"
                  >
                    {/* Date */}
                    <div className="text-center pb-3 border-b border-gray-100 mb-3">
                      <p className="font-bold text-emerald-700">{formatDate(forecast.date)}</p>
                    </div>

                    {/* Weather Icon */}
                    <div className="flex justify-center py-3">
                      {getWeatherIcon(forecast.tempMax, forecast.rainProbability)}
                    </div>

                    {/* Temperature */}
                    <div className="space-y-2 mb-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Thermometer size={16} weight="duotone" className="text-red-500" />
                          <span className="text-xs text-gray-600">{text.maxTemp}</span>
                        </div>
                        <span className="font-bold text-red-600">{formatTemp(forecast.tempMax)}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Wind size={16} weight="duotone" className="text-blue-500" />
                          <span className="text-xs text-gray-600">{text.minTemp}</span>
                        </div>
                        <span className="font-bold text-blue-600">{formatTemp(forecast.tempMin)}</span>
                      </div>
                    </div>

                    {/* Humidity & Rain */}
                    <div className="space-y-2 pt-3 border-t border-gray-100">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Drop size={16} weight="duotone" className="text-cyan-500" />
                          <span className="text-xs text-gray-600">{text.humidity}</span>
                        </div>
                        <span className="font-semibold text-cyan-600">{formatPercent(forecast.humidity)}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <CloudRain size={16} weight="duotone" className="text-slate-500" />
                          <span className="text-xs text-gray-600">{text.rain}</span>
                        </div>
                        <span className="font-semibold text-slate-600">{formatPercent(forecast.rainProbability)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Empty State */}
        {!weatherData && !loading && !error && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 sm:p-12 text-center">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Cloud size={40} weight="duotone" className="text-gray-400" />
            </div>
            <p className="text-gray-600 font-medium">{text.emptyState}</p>
          </div>
        )}
      </main>
    </div>
  );
}
