'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
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
  Wind,
  Plant,
  Leaf,
  ShieldWarning,
  Lightning
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

interface Advisory {
  type: 'warning' | 'info' | 'success';
  titleBn: string;
  titleEn: string;
  messageBn: string;
  messageEn: string;
  actionBn: string;
  actionEn: string;
  icon: React.ReactNode;
}

export default function WeatherPage() {
  const router = useRouter();
  const [lang, setLang] = useState<'bn' | 'en'>('bn');
  const [selectedDivisionIndex, setSelectedDivisionIndex] = useState(0);
  const [selectedDistrictIndex, setSelectedDistrictIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [weatherData, setWeatherData] = useState<WeatherResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [advisories, setAdvisories] = useState<Advisory[]>([]);
  const [hasShownToasts, setHasShownToasts] = useState(false);

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
      lastUpdated: 'আপডেট',
      farmingAdvice: 'কৃষি পরামর্শ',
      action: 'করণীয়'
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
      lastUpdated: 'Updated',
      farmingAdvice: 'Farming Advice',
      action: 'Action'
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

  // Generate farming advisories based on weather conditions
  const generateAdvisories = (forecasts: WeatherResponse['forecasts']) => {
    const newAdvisories: Advisory[] = [];

    // Get current month for seasonal advice (Bangladesh cropping seasons)
    const currentMonth = new Date().getMonth(); // 0-11
    const isRabiSeason = currentMonth >= 10 || currentMonth <= 2; // Nov-Feb (wheat, mustard, vegetables)
    const isKharifSeason = currentMonth >= 5 && currentMonth <= 9; // Jun-Oct (rice, jute)
    const isPreMonsoon = currentMonth >= 3 && currentMonth <= 4; // Apr-May

    // Check for heavy rain (>70% probability for multiple days)
    const heavyRainDays = forecasts.filter((f) => f.rainProbability > 70).length;
    if (heavyRainDays >= 2) {
      newAdvisories.push({
        type: 'warning',
        titleBn: '🌧️ ভারী বৃষ্টির সতর্কতা',
        titleEn: '🌧️ Heavy Rain Alert',
        messageBn: `আগামী ৫ দিনে ${heavyRainDays} দিন ভারী বৃষ্টির সম্ভাবনা (৭০%+)।`,
        messageEn: `${heavyRainDays} days of heavy rain expected (70%+) in the next 5 days.`,
        actionBn: isKharifSeason 
          ? 'ধান কাটা থাকলে আজই কেটে উঁচু জায়গায় রাখুন। জমিতে পানি নিষ্কাশনের ব্যবস্থা করুন।'
          : 'ফসল ঢেকে রাখুন। শুকনো ফসল ঘরে তুলুন। নিচু জমিতে পানি জমতে পারে।',
        actionEn: isKharifSeason
          ? 'Harvest rice immediately and store in elevated areas. Ensure proper drainage in fields.'
          : 'Cover crops. Store dried produce indoors. Low-lying areas may flood.',
        icon: <CloudRain size={24} weight="duotone" className="text-blue-600" />,
      });
    }

    // Check for moderate rain (40-70%)
    const moderateRainDays = forecasts.filter((f) => f.rainProbability >= 40 && f.rainProbability <= 70).length;
    if (moderateRainDays >= 3 && heavyRainDays < 2) {
      newAdvisories.push({
        type: 'info',
        titleBn: '🌦️ বৃষ্টির সম্ভাবনা',
        titleEn: '🌦️ Rain Expected',
        messageBn: `আগামী কয়েকদিন হালকা থেকে মাঝারি বৃষ্টি হতে পারে।`,
        messageEn: `Light to moderate rain expected in the coming days.`,
        actionBn: 'স্প্রে বা সার দেওয়া থেকে বিরত থাকুন। বৃষ্টির পানি ধরে রাখতে জমি প্রস্তুত করুন।',
        actionEn: 'Avoid spraying pesticides or fertilizers. Prepare fields to retain rainwater.',
        icon: <Cloud size={24} weight="duotone" className="text-gray-500" />,
      });
    }

    // Check for extreme heat (>38°C)
    const extremeHeatDays = forecasts.filter((f) => f.tempMax > 38).length;
    if (extremeHeatDays > 0) {
      newAdvisories.push({
        type: 'warning',
        titleBn: '🔥 তীব্র গরম',
        titleEn: '🔥 Extreme Heat',
        messageBn: `তাপমাত্রা ৩৮°সে এর উপরে উঠবে। ফসল ও গবাদিপশু ঝুঁকিতে।`,
        messageEn: `Temperature will exceed 38°C. Crops and livestock at risk.`,
        actionBn: 'সকাল ও সন্ধ্যায় সেচ দিন। গবাদিপশুকে ছায়ায় রাখুন ও পর্যাপ্ত পানি দিন। দিনের মাঝামাঝি মাঠে কাজ এড়িয়ে চলুন।',
        actionEn: 'Irrigate early morning and evening. Keep livestock in shade with ample water. Avoid fieldwork during midday.',
        icon: <Sun size={24} weight="duotone" className="text-orange-600" />,
      });
    }

    // Check for high heat (35-38°C)
    const highHeatDays = forecasts.filter((f) => f.tempMax > 35 && f.tempMax <= 38).length;
    if (highHeatDays >= 3 && extremeHeatDays === 0) {
      newAdvisories.push({
        type: 'info',
        titleBn: '☀️ গরম আবহাওয়া',
        titleEn: '☀️ Hot Weather',
        messageBn: `তাপমাত্রা ৩৫°সে এর উপরে থাকবে।`,
        messageEn: `Temperature will remain above 35°C.`,
        actionBn: 'নিয়মিত সেচ দিন। মালচিং করে মাটির আর্দ্রতা ধরে রাখুন।',
        actionEn: 'Provide regular irrigation. Use mulching to retain soil moisture.',
        icon: <Thermometer size={24} weight="duotone" className="text-yellow-600" />,
      });
    }

    // Check for very high humidity (>85%)
    const veryHumidDays = forecasts.filter((f) => f.humidity > 85).length;
    if (veryHumidDays >= 2) {
      newAdvisories.push({
        type: 'warning',
        titleBn: '💧 অতিরিক্ত আর্দ্রতা - রোগের ঝুঁকি',
        titleEn: '💧 High Humidity - Disease Risk',
        messageBn: `আর্দ্রতা ৮৫% এর উপরে থাকবে। ছত্রাক ও পোকামাকড়ের আক্রমণ বাড়তে পারে।`,
        messageEn: `Humidity above 85%. Increased risk of fungal diseases and pests.`,
        actionBn: 'ধানের ব্লাস্ট, শীষ পচা রোগ সতর্কতা। প্রয়োজনে ছত্রাকনাশক স্প্রে করুন। গোলাঘরে ফসল ভালোভাবে শুকিয়ে রাখুন।',
        actionEn: 'Watch for rice blast and panicle rot. Apply fungicide if needed. Ensure stored crops are well-dried.',
        icon: <Drop size={24} weight="duotone" className="text-cyan-600" />,
      });
    }

    // High humidity (80-85%)
    const humidDays = forecasts.filter((f) => f.humidity > 80 && f.humidity <= 85).length;
    if (humidDays >= 3 && veryHumidDays < 2) {
      newAdvisories.push({
        type: 'info',
        titleBn: '💨 উচ্চ আর্দ্রতা',
        titleEn: '💨 High Humidity',
        messageBn: `আর্দ্রতা ৮০% এর উপরে থাকবে। ফসল শুকানো কঠিন হবে।`,
        messageEn: `Humidity above 80%. Drying crops will be difficult.`,
        actionBn: 'ফসল শুকানোর জন্য ভালো বাতাস চলাচলের জায়গা বেছে নিন। গোলাঘরে ভেন্টিলেশন নিশ্চিত করুন।',
        actionEn: 'Choose well-ventilated areas for drying crops. Ensure good ventilation in storage.',
        icon: <Wind size={24} weight="duotone" className="text-teal-600" />,
      });
    }

    // Combined risk: Rain + High Humidity (worst for post-harvest)
    const riskyDays = forecasts.filter(
      (f) => f.rainProbability > 50 && f.humidity > 80
    ).length;
    if (riskyDays >= 2) {
      newAdvisories.push({
        type: 'warning',
        titleBn: '⚠️ ফসল সংরক্ষণে সর্বোচ্চ সতর্কতা',
        titleEn: '⚠️ Maximum Storage Caution',
        messageBn: `বৃষ্টি ও আর্দ্রতা দুটোই বেশি - ফসল নষ্ট হওয়ার ঝুঁকি।`,
        messageEn: `Both rain and humidity high - crop spoilage risk.`,
        actionBn: 'কাটা ফসল অবশ্যই উঁচু ও শুকনো জায়গায় রাখুন। পাটের বস্তা ব্যবহার করুন, প্লাস্টিক এড়িয়ে চলুন। প্রতিদিন ফসল পরীক্ষা করুন।',
        actionEn: 'Store harvested crops in elevated dry areas. Use jute bags, avoid plastic. Check crops daily.',
        icon: <ShieldWarning size={24} weight="duotone" className="text-red-600" />,
      });
    }

    // Good weather for farming activities
    const clearDays = forecasts.filter(
      (f) => f.rainProbability < 30 && f.tempMax < 35 && f.humidity < 80
    ).length;
    if (clearDays >= 3) {
      newAdvisories.push({
        type: 'success',
        titleBn: '✅ উপযুক্ত আবহাওয়া',
        titleEn: '✅ Favorable Weather',
        messageBn: 'আবহাওয়া কৃষি কাজের জন্য অনুকূল।',
        messageEn: 'Weather is favorable for farming activities.',
        actionBn: isRabiSeason 
          ? 'রবি ফসল (গম, সরিষা, আলু) বপন/রোপণের উপযুক্ত সময়। জমি তৈরি করুন।'
          : isKharifSeason
          ? 'ধান কাটা ও মাড়াই করার সেরা সময়। ফসল ভালোভাবে শুকিয়ে গুদামে রাখুন।'
          : 'বীজতলা তৈরি ও চারা রোপণের উপযুক্ত সময়।',
        actionEn: isRabiSeason
          ? 'Ideal time for Rabi crops (wheat, mustard, potato). Prepare land.'
          : isKharifSeason
          ? 'Best time for rice harvesting and threshing. Dry properly before storage.'
          : 'Good time for seedbed preparation and transplanting.',
        icon: <Leaf size={24} weight="duotone" className="text-emerald-600" />,
      });
    }

    // Good for drying
    const dryingDays = forecasts.filter(
      (f) => f.rainProbability < 20 && f.humidity < 70 && f.tempMax > 28
    ).length;
    if (dryingDays >= 2) {
      newAdvisories.push({
        type: 'success',
        titleBn: '☀️ ফসল শুকানোর আদর্শ সময়',
        titleEn: '☀️ Ideal Drying Weather',
        messageBn: 'কম বৃষ্টি, কম আর্দ্রতা - ফসল শুকানোর জন্য চমৎকার।',
        messageEn: 'Low rain, low humidity - excellent for drying crops.',
        actionBn: 'ধান, গম, ডাল শুকানোর সেরা সুযোগ। রোদে ভালোভাবে শুকিয়ে নিন।',
        actionEn: 'Best opportunity to dry rice, wheat, pulses. Sun-dry thoroughly.',
        icon: <Sun size={24} weight="duotone" className="text-amber-500" />,
      });
    }

    setAdvisories(newAdvisories);
    
    // Show toast notifications for each advisory with staggered timing
    if (newAdvisories.length > 0) {
      setHasShownToasts(true);
      showAdvisoryToasts(newAdvisories);
    }
  };

  // Function to show advisory toasts
  const showAdvisoryToasts = (advisoryList: Advisory[]) => {
    advisoryList.forEach((advisory, index) => {
      setTimeout(() => {
        const title = lang === 'bn' ? advisory.titleBn : advisory.titleEn;
        const message = lang === 'bn' ? advisory.messageBn : advisory.messageEn;
        const action = lang === 'bn' ? advisory.actionBn : advisory.actionEn;
        const actionLabel = lang === 'bn' ? 'করণীয়' : 'Action';
        
        const toastContent = (
          <div className="space-y-2">
            <p className="text-sm">{message}</p>
            <div className={`text-xs p-2 rounded-lg ${
              advisory.type === 'warning' 
                ? 'bg-amber-100 text-amber-900' 
                : advisory.type === 'success' 
                ? 'bg-emerald-100 text-emerald-900' 
                : 'bg-blue-100 text-blue-900'
            }`}>
              <span className="font-bold">{actionLabel}:</span> {action}
            </div>
          </div>
        );

        if (advisory.type === 'warning') {
          toast.warning(title, {
            description: toastContent,
            duration: 10000,
          });
        } else if (advisory.type === 'success') {
          toast.success(title, {
            description: toastContent,
            duration: 8000,
          });
        } else {
          toast.info(title, {
            description: toastContent,
            duration: 8000,
          });
        }
      }, index * 1500); // Stagger each toast by 1.5 seconds
    });
  };

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
    setAdvisories([]);

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
      
      // Generate farming advisories based on weather
      generateAdvisories(data.forecasts);
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

            {/* Farming Advisories - Button to show again */}
            {advisories.length > 0 && hasShownToasts && (
              <div className="mt-6 text-center">
                <button
                  onClick={() => showAdvisoryToasts(advisories)}
                  className="inline-flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl font-medium shadow-lg shadow-emerald-500/25 hover:shadow-xl hover:shadow-emerald-500/30 transition-all transform hover:scale-105"
                >
                  <Plant size={20} weight="duotone" />
                  {lang === 'bn' ? '🌾 কৃষি পরামর্শ আবার দেখুন' : '🌾 Show Farming Advice Again'}
                </button>
                <p className="text-xs text-gray-500 mt-2">
                  {lang === 'bn' 
                    ? `${advisories.length}টি পরামর্শ পাওয়া গেছে` 
                    : `${advisories.length} advice${advisories.length > 1 ? 's' : ''} available`}
                </p>
              </div>
            )}
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
