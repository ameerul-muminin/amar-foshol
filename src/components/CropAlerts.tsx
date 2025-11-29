'use client';

import { useState, useEffect } from 'react';
import { AlertCircle, Loader, CheckCircle } from 'lucide-react';
import { checkForAlerts } from '@/lib/crop-risk-management';
import type { Alert as AlertType } from '@/lib/crop-risk-management';

interface CropAlertProps {
  cropType?: string;
  location?: string;
  lang?: 'bn' | 'en';
  onAlertLoaded?: (alert: AlertType | null) => void;
}

export default function CropAlerts({ 
  cropType = 'potato',
  location = 'Dhaka',
  lang = 'bn',
  onAlertLoaded
}: CropAlertProps) {
  const [alert, setAlert] = useState<AlertType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedLocation, setSelectedLocation] = useState(location);
  const [selectedCrop, setSelectedCrop] = useState(cropType);

  const crops = ['potato', 'rice', 'wheat', 'maize', 'jute', 'tomato', 'brinjal', 'mustard', 'lentil', 'mango', 'banana', 'sugarcane', 'onion'];

  const cropNamesBn: Record<string, string> = {
    potato: 'আলু',
    rice: 'ধান',
    wheat: 'গম',
    maize: 'ভুট্টা',
    jute: 'পাট',
    tomato: 'টমেটো',
    brinjal: 'বেগুন',
    mustard: 'সরিষা',
    lentil: 'মসুর',
    mango: 'আম',
    banana: 'কলা',
    sugarcane: 'আখ',
    onion: 'পেঁয়াজ'
  };

  const riskColors: Record<string, string> = {
    'Critical': 'bg-red-50 border-red-300 text-red-900',
    'Medium': 'bg-yellow-50 border-yellow-300 text-yellow-900',
    'Low': 'bg-green-50 border-green-300 text-green-900'
  };

  const riskIconColors: Record<string, string> = {
    'Critical': 'text-red-500',
    'Medium': 'text-yellow-500',
    'Low': 'text-green-500'
  };

  useEffect(() => {
    loadAlert();
  }, [selectedCrop, selectedLocation]);

  const loadAlert = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await checkForAlerts(selectedCrop, selectedLocation);
      setAlert(result);
      onAlertLoaded?.(result);
    } catch (err) {
      setError(lang === 'bn' ? 'সতর্কতা লোড করতে ব্যর্থ' : 'Failed to load alert');
      console.error('Error loading alert:', err);
    } finally {
      setLoading(false);
    }
  };

  const translations = {
    bn: {
      cropRiskAlert: 'ফসলের ঝুঁকি সতর্কতা',
      selectCrop: 'ফসল নির্বাচন করুন',
      selectLocation: 'স্থান নির্বাচন করুন',
      noRisk: 'কোনো সমালোচনামূলক ঝুঁকি সনাক্ত হয়নি',
      allGood: 'আপনার ফসল নিরাপদ দেখাচ্ছে!',
      riskDetected: 'ঝুঁকি সনাক্ত হয়েছে',
      temperature: 'তাপমাত্রা',
      humidity: 'আর্দ্রতা',
      rainfall: 'বৃষ্টিপাত',
      timestamp: 'সময়',
      refresh: 'রিফ্রেশ করুন',
      location: 'স্থান',
      crop: 'ফসল'
    },
    en: {
      cropRiskAlert: 'Crop Risk Alert',
      selectCrop: 'Select Crop',
      selectLocation: 'Select Location',
      noRisk: 'No critical risk detected',
      allGood: 'Your crop looks safe!',
      riskDetected: 'Risk Detected',
      temperature: 'Temperature',
      humidity: 'Humidity',
      rainfall: 'Rainfall',
      timestamp: 'Time',
      refresh: 'Refresh',
      location: 'Location',
      crop: 'Crop'
    }
  };

  const t = translations[lang];

  return (
    <div className="w-full">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        {/* Header */}
        <h3 className="text-xl font-bold text-gray-900 mb-6">{t.cropRiskAlert}</h3>

        {/* Controls */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t.crop}
            </label>
            <select
              value={selectedCrop}
              onChange={(e) => setSelectedCrop(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
            >
              {crops.map((crop) => (
                <option key={crop} value={crop}>
                  {lang === 'bn' ? cropNamesBn[crop] : crop}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t.location}
            </label>
            <input
              type="text"
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              placeholder={lang === 'bn' ? 'যেমন: ঢাকা, সিলেট' : 'e.g., Dhaka, Sylhet'}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
            />
          </div>
        </div>

        {/* Alert Display */}
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader className="w-5 h-5 animate-spin text-emerald-500 mr-2" />
            <p className="text-gray-600">{lang === 'bn' ? 'লোড হচ্ছে...' : 'Loading...'}</p>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-300 rounded-lg p-4 text-red-900">
            <p>{error}</p>
          </div>
        ) : alert ? (
          <div className={`rounded-lg p-4 border ${riskColors[alert.riskLevel]}`}>
            <div className="flex items-start gap-3">
              <AlertCircle className={`w-6 h-6 flex-shrink-0 mt-0.5 ${riskIconColors[alert.riskLevel]}`} />
              <div className="flex-1">
                <h4 className="font-bold mb-2">
                  {lang === 'bn' ? t.riskDetected : t.riskDetected}
                </h4>
                <p className="mb-4 text-sm leading-relaxed">
                  {lang === 'bn' ? alert.messageBn : alert.message}
                </p>

                {/* Weather Details */}
                <div className="grid grid-cols-3 gap-3 text-sm bg-white/50 rounded-lg p-3 mb-3">
                  <div>
                    <p className="text-gray-600">{t.temperature}</p>
                    <p className="font-semibold">{alert.weather.temp.toFixed(1)}°C</p>
                  </div>
                  <div>
                    <p className="text-gray-600">{t.humidity}</p>
                    <p className="font-semibold">{alert.weather.humidity.toFixed(0)}%</p>
                  </div>
                  <div>
                    <p className="text-gray-600">{t.rainfall}</p>
                    <p className="font-semibold">{alert.weather.rainAmount.toFixed(1)}mm</p>
                  </div>
                </div>

                <button
                  onClick={loadAlert}
                  className="text-sm font-medium underline hover:no-underline"
                >
                  {t.refresh}
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-green-50 border border-green-300 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0" />
              <div>
                <h4 className="font-bold text-green-900 mb-1">{t.allGood}</h4>
                <p className="text-sm text-green-800">{t.noRisk}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
