'use client';

import React, { useState, useEffect } from 'react';
import {
  Cloud,
  CloudRain,
  Sun,
  Wind,
  Droplets,
  AlertCircle,
  CheckCircle,
  Thermometer,
  Calendar,
  MapPin,
  Loader,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { formatTemperatureBn, formatPercentageBn, formatDateBn } from '@/lib/bangla-numbers';
import { getDivisions, getDistrictsByDivision, getDistrictCoordinates } from '@/lib/locations';

interface WeatherData {
  date: string;
  tempMax: number;
  tempMin: number;
  humidity: number;
  rainProbability: number;
}

interface LocationData {
  name: string;
  division: string;
  district: string;
  lat: number;
  lon: number;
}

interface Advisory {
  type: 'warning' | 'info' | 'success';
  titleBn: string;
  messageBn: string;
  actionBn: string;
  icon: React.ReactNode;
}

export default function WeatherDisplay() {
  const [division, setDivision] = useState<string>('ঢাকা');
  const [district, setDistrict] = useState<string>('ঢাকা');
  const [weatherData, setWeatherData] = useState<WeatherData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [locationData, setLocationData] = useState<LocationData | null>(null);
  const [advisories, setAdvisories] = useState<Advisory[]>([]);

  const divisions = getDivisions();
  const districts = getDistrictsByDivision(division);

  // Update district when division changes
  useEffect(() => {
    const firstDistrict = districts[0];
    if (firstDistrict) {
      setDistrict(firstDistrict);
    }
  }, [division, districts]);

  // Fetch weather data
  const fetchWeather = async () => {
    if (!district || !division) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `/api/weather?division=${encodeURIComponent(division)}&district=${encodeURIComponent(district)}`
      );

      if (!response.ok) {
        throw new Error('আবহাওয়া ডেটা লোড করতে ব্যর্থ হয়েছে');
      }

      const data = await response.json();

      // Set location data
      const coords = getDistrictCoordinates(division, district);
      setLocationData({
        name: `${district}, ${division}`,
        division,
        district,
        lat: coords?.lat || 0,
        lon: coords?.lon || 0,
      });

      // Process weather data from the API response
      // The API returns { location, forecasts, lastUpdated }
      const forecasts: WeatherData[] = data.forecasts.map((f: any) => ({
        date: f.date,
        tempMax: f.tempMax,
        tempMin: f.tempMin,
        humidity: f.humidity,
        rainProbability: f.rainProbability,
      }));
      
      setWeatherData(forecasts);

      // Generate advisories
      generateAdvisories(forecasts);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'একটি ত্রুটি ঘটেছে');
      setWeatherData([]);
      setAdvisories([]);
    } finally {
      setLoading(false);
    }
  };

  // Generate advisories based on weather conditions
  const generateAdvisories = (forecasts: WeatherData[]) => {
    const newAdvisories: Advisory[] = [];

    // Check rain probability
    const rainyDays = forecasts.filter((f) => f.rainProbability > 70).length;
    if (rainyDays >= 3) {
      newAdvisories.push({
        type: 'warning',
        titleBn: 'বৃষ্টির সতর্কতা',
        messageBn: `আগামী ৫ দিনে ${rainyDays} দিন ৭০% এর বেশি বৃষ্টির সম্ভাবনা রয়েছে।`,
        actionBn: 'আজই ধান কাটুন অথবা নিরাপদ জায়গায় ঢেকে রাখুন।',
        icon: <CloudRain className="w-6 h-6" />,
      });
    }

    // Check high temperature
    const hotDays = forecasts.filter((f) => f.tempMax > 35).length;
    if (hotDays > 0) {
      newAdvisories.push({
        type: 'info',
        titleBn: 'উচ্চ তাপমাত্রা',
        messageBn: `তাপমাত্রা ${forecasts[0].tempMax}°সে পর্যন্ত উঠবে।`,
        actionBn: 'দিনের বেলা ছায়ায় রাখুন এবং বিকেলের দিকে ঢেকে দিন।',
        icon: <Sun className="w-6 h-6" />,
      });
    }

    // Check humidity
    const humidDays = forecasts.filter((f) => f.humidity > 80).length;
    if (humidDays > 0) {
      newAdvisories.push({
        type: 'warning',
        titleBn: 'উচ্চ আর্দ্রতা',
        messageBn: `আর্দ্রতা ${forecasts[0].humidity}% এর উপরে থাকবে।`,
        actionBn: 'ফসল শুকানো কঠিন হবে, ভেন্টিলেশন সহ ঘরে রাখুন।',
        icon: <Droplets className="w-6 h-6" />,
      });
    }

    // Combined risk
    const riskyDays = forecasts.filter(
      (f) => f.rainProbability > 50 && f.humidity > 75
    ).length;
    if (riskyDays > 0) {
      newAdvisories.push({
        type: 'warning',
        titleBn: 'সর্বোচ্চ ঝুঁকি',
        messageBn: `বৃষ্টি এবং আর্দ্রতা দুটোই বেশি থাকবে।`,
        actionBn: 'পাটের বস্তা উঁচু এবং বাতাসপূর্ণ জায়গায় রাখুন।',
        icon: <AlertCircle className="w-6 h-6" />,
      });
    }

    // Clear weather advisory
    const clearDays = forecasts.filter(
      (f) => f.rainProbability < 30 && f.tempMax < 35
    ).length;
    if (clearDays >= 3) {
      newAdvisories.push({
        type: 'success',
        titleBn: 'উপযুক্ত সময়',
        messageBn: 'আবহাওয়া ভালো রয়েছে।',
        actionBn: 'এখনই ফসল শুকানোর সেরা সময়।',
        icon: <CheckCircle className="w-6 h-6" />,
      });
    }

    setAdvisories(newAdvisories);
  };

  // Determine weather icon based on rain probability
  const getWeatherIcon = (rainProb: number, tempMax: number) => {
    if (rainProb > 70) {
      return <CloudRain className="w-8 h-8 text-blue-500" />;
    }
    if (rainProb > 40) {
      return <Cloud className="w-8 h-8 text-gray-400" />;
    }
    if (tempMax > 35) {
      return <Sun className="w-8 h-8 text-yellow-500" />;
    }
    return <Cloud className="w-8 h-8 text-gray-300" />;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 md:p-8">
      {/* Animated background orbs */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-20 w-96 h-96 bg-emerald-200/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-blue-200/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8 animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-bold text-emerald-900 mb-2">আবহাওয়া পূর্বাভাস</h1>
          <p className="text-lg text-gray-600">আপনার এলাকার ৫-দিনের আবহাওয়া এবং কৃষি পরামর্শ</p>
        </div>

        {/* Location Selector */}
        <Card className="mb-8 border-2 border-emerald-200 shadow-lg animate-fade-in" style={{ animationDelay: '0.1s' }}>
          <CardHeader>
            <CardTitle className="text-emerald-900 flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              আপনার এলাকা নির্বাচন করুন
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              {/* Division Select */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">বিভাগ</label>
                <Select value={division} onValueChange={setDivision}>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {divisions.map((div) => (
                      <SelectItem key={div} value={div}>
                        {div}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* District Select */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">জেলা</label>
                <Select value={district} onValueChange={setDistrict}>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {districts.map((dist) => (
                      <SelectItem key={dist} value={dist}>
                        {dist}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Fetch Button */}
              <div className="flex items-end">
                <Button
                  onClick={fetchWeather}
                  disabled={loading}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold h-10 transition-all hover:scale-105"
                >
                  {loading ? (
                    <>
                      <Loader className="w-4 h-4 mr-2 animate-spin" />
                      লোড হচ্ছে...
                    </>
                  ) : (
                    'আবহাওয়া দেখুন'
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Error Message */}
        {error && (
          <Card className="mb-8 border-2 border-red-200 bg-red-50 animate-fade-in">
            <CardContent className="pt-6 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
              <p className="text-red-800">{error}</p>
            </CardContent>
          </Card>
        )}

        {/* Location Info */}
        {locationData && !loading && (
          <Card className="mb-8 border-2 border-emerald-300 shadow-lg bg-gradient-to-r from-emerald-50 to-blue-50 animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="flex items-center gap-3">
                  <MapPin className="w-6 h-6 text-emerald-600" />
                  <div>
                    <p className="text-sm text-gray-600">অবস্থান</p>
                    <p className="text-lg font-semibold text-emerald-900">{locationData.name}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold">
                    {locationData.lat.toFixed(2).replace('.', '°')}
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">অক্ষাংশ</p>
                    <p className="text-sm font-semibold text-blue-900">{locationData.lat.toFixed(4)}°</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center text-white font-bold">
                    {locationData.lon.toFixed(2).replace('.', '°')}
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">দ্রাঘিমাংশ</p>
                    <p className="text-sm font-semibold text-purple-900">{locationData.lon.toFixed(4)}°</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Advisories */}
        {advisories.length > 0 && !loading && (
          <div className="mb-8 animate-fade-in" style={{ animationDelay: '0.3s' }}>
            <h2 className="text-2xl font-bold text-emerald-900 mb-4 flex items-center gap-2">
              <AlertCircle className="w-6 h-6" />
              কৃষি পরামর্শ
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {advisories.map((advisory, idx) => (
                <Card
                  key={idx}
                  className={`border-2 shadow-lg overflow-hidden transition-all hover:scale-105 ${
                    advisory.type === 'warning'
                      ? 'border-red-300 bg-gradient-to-br from-red-50 to-orange-50'
                      : advisory.type === 'success'
                      ? 'border-green-300 bg-gradient-to-br from-green-50 to-emerald-50'
                      : 'border-blue-300 bg-gradient-to-br from-blue-50 to-cyan-50'
                  }`}
                >
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <div
                        className={`p-2 rounded-lg ${
                          advisory.type === 'warning'
                            ? 'bg-red-200'
                            : advisory.type === 'success'
                            ? 'bg-green-200'
                            : 'bg-blue-200'
                        }`}
                      >
                        {advisory.icon}
                      </div>
                      <span
                        className={
                          advisory.type === 'warning'
                            ? 'text-red-900'
                            : advisory.type === 'success'
                            ? 'text-green-900'
                            : 'text-blue-900'
                        }
                      >
                        {advisory.titleBn}
                      </span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p
                      className={
                        advisory.type === 'warning'
                          ? 'text-red-800'
                          : advisory.type === 'success'
                          ? 'text-green-800'
                          : 'text-blue-800'
                      }
                    >
                      {advisory.messageBn}
                    </p>
                    <div className="pt-2 border-t">
                      <p className="text-sm font-semibold text-gray-600 mb-1">পদক্ষেপ:</p>
                      <p
                        className={
                          advisory.type === 'warning'
                            ? 'text-red-700 font-medium'
                            : advisory.type === 'success'
                            ? 'text-green-700 font-medium'
                            : 'text-blue-700 font-medium'
                        }
                      >
                        {advisory.actionBn}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* 5-Day Forecast */}
        {weatherData.length > 0 && !loading && (
          <div className="animate-fade-in" style={{ animationDelay: '0.4s' }}>
            <h2 className="text-2xl font-bold text-emerald-900 mb-4 flex items-center gap-2">
              <Calendar className="w-6 h-6" />
              ৫-দিনের পূর্বাভাস
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              {weatherData.map((day, idx) => {
                const date = new Date(day.date);
                const dayName = ['রবি', 'সোম', 'মঙ্গল', 'বুধ', 'বৃহ', 'শুক্র', 'শনি'][date.getDay()];
                const dayNum = String(date.getDate()).padStart(2, '0');
                const monthNames = ['জানু', 'ফেব্রু', 'মার্চ', 'এপ্রি', 'মে', 'জুন', 'জুল', 'আগ', 'সেপ্ট', 'অক্টো', 'নভে', 'ডিসে'];
                const monthName = monthNames[date.getMonth()];

                return (
                  <Card
                    key={idx}
                    className="border-2 border-emerald-200 shadow-lg hover:shadow-2xl transition-all hover:scale-105 overflow-hidden bg-gradient-to-b from-white to-emerald-50"
                  >
                    <CardHeader className="pb-3">
                      <CardTitle className="text-center text-sm font-bold text-emerald-900">
                        <div>{dayName}</div>
                        <div className="text-lg">{dayNum} {monthName}</div>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {/* Weather Icon */}
                      <div className="flex justify-center py-2">
                        {getWeatherIcon(day.rainProbability, day.tempMax)}
                      </div>

                      {/* Temperature */}
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">সর্বোচ্চ</span>
                          <span className="font-bold text-emerald-900 flex items-center gap-1">
                            <Thermometer className="w-4 h-4" />
                            {formatTemperatureBn(Math.round(day.tempMax))}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">সর্বনিম্ন</span>
                          <span className="font-semibold text-blue-700 flex items-center gap-1">
                            <Thermometer className="w-4 h-4" />
                            {formatTemperatureBn(Math.round(day.tempMin))}
                          </span>
                        </div>
                      </div>

                      {/* Humidity */}
                      <div className="pt-2 border-t">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600 flex items-center gap-1">
                            <Droplets className="w-4 h-4" />
                            আর্দ্রতা
                          </span>
                          <span className="font-semibold text-blue-600">
                            {formatPercentageBn(day.humidity)}
                          </span>
                        </div>
                      </div>

                      {/* Rain Probability */}
                      <div className="pt-2 border-t">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600 flex items-center gap-1">
                            <CloudRain className="w-4 h-4" />
                            বৃষ্টি
                          </span>
                          <span className={`font-semibold ${day.rainProbability > 70 ? 'text-red-600' : day.rainProbability > 40 ? 'text-yellow-600' : 'text-green-600'}`}>
                            {formatPercentageBn(day.rainProbability)}
                          </span>
                        </div>
                      </div>

                      {/* Risk Indicator */}
                      {day.rainProbability > 70 && day.humidity > 80 && (
                        <div className="mt-2 p-2 bg-red-100 border-l-4 border-red-500 rounded">
                          <p className="text-xs font-bold text-red-700">⚠️ উচ্চ ঝুঁকি</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        )}

        {/* Empty State */}
        {weatherData.length === 0 && !loading && !error && (
          <Card className="border-2 border-gray-300 shadow-lg">
            <CardContent className="pt-12 text-center pb-12">
              <div className="text-6xl mb-4 animate-bounce">☁️</div>
              <p className="text-xl text-gray-600 font-semibold mb-2">আবহাওয়া ডেটা লোড করুন</p>
              <p className="text-gray-500">উপরে আপনার বিভাগ এবং জেলা নির্বাচন করে "আবহাওয়া দেখুন" বোতাম ক্লিক করুন</p>
            </CardContent>
          </Card>
        )}
      </div>

      <style>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.6s ease-out forwards;
          opacity: 0;
        }
      `}</style>
    </div>
  );
}
