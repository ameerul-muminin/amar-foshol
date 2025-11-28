'use client';

import { useState } from 'react';
import { getDivisions, getDistrictsByDivision } from '@/lib/locations';
import { toBanglaNumber, formatTemperatureBn, formatPercentageBn, formatDateBn } from '@/lib/bangla-numbers';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Cloud, Droplets, Thermometer, Calendar, AlertCircle, CheckCircle, Wind, Sun, CloudRain } from 'lucide-react';

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
}

export default function WeatherTestPage() {
  const divisions = getDivisions();
  const [selectedDivision, setSelectedDivision] = useState(divisions[0]);
  const [selectedDistrict, setSelectedDistrict] = useState(
    getDistrictsByDivision(divisions[0])[0]
  );
  const [loading, setLoading] = useState(false);
  const [weatherData, setWeatherData] = useState<WeatherResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const districts = getDistrictsByDivision(selectedDivision);

  const handleDivisionChange = (value: string) => {
    setSelectedDivision(value);
    setSelectedDistrict(getDistrictsByDivision(value)[0]);
    setWeatherData(null);
    setError(null);
  };

  const handleFetchWeather = async () => {
    setLoading(true);
    setError(null);
    setWeatherData(null);

    try {
      const params = new URLSearchParams({
        division: selectedDivision,
        district: selectedDistrict,
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
    if (rain > 70) return <CloudRain className="w-8 h-8 text-blue-500" />;
    if (temp > 32) return <Sun className="w-8 h-8 text-yellow-500" />;
    return <Cloud className="w-8 h-8 text-gray-400" />;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-blue-50 to-purple-50 p-6 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-emerald-200 to-transparent rounded-full opacity-20 blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-blue-200 to-transparent rounded-full opacity-20 blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="relative">
              <Cloud className="w-14 h-14 text-emerald-600 animate-bounce" />
              <Sun className="w-6 h-6 text-yellow-500 absolute top-0 right-0 animate-spin" style={{ animationDuration: '3s' }} />
            </div>
            <h1 className="text-5xl md:text-6xl font-black bg-gradient-to-r from-emerald-600 via-blue-600 to-purple-600 bg-clip-text text-transparent drop-shadow-lg">
              আমার ফসল
            </h1>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">আবহাওয়া পূর্বাভাস</h2>
          <p className="text-gray-600 text-lg">সঠিক আবহাওয়া ডেটা দিয়ে আপনার ফসল রক্ষা করুন</p>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-4 gap-6">
          {/* Left Panel - Controls */}
          <div className="lg:col-span-1">
            <Card className="sticky top-6 border-2 border-emerald-200 shadow-lg hover:shadow-2xl transition-shadow duration-300 bg-white/95 backdrop-blur">
              <CardHeader className="bg-gradient-to-r from-emerald-500 to-blue-500 text-white rounded-t-lg">
                <CardTitle className="text-xl">📍 অবস্থান নির্বাচন</CardTitle>
                <CardDescription className="text-emerald-50">আপনার এলাকা বেছে নিন</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 pt-6">
                {/* Division Selector */}
                <div className="space-y-2 animate-fade-in" style={{ animationDelay: '0.1s' }}>
                  <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                    <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
                    বিভাগ
                  </label>
                  <Select value={selectedDivision} onValueChange={handleDivisionChange}>
                    <SelectTrigger className="border-2 border-emerald-300 hover:border-emerald-500 transition-colors">
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

                {/* District Selector */}
                <div className="space-y-2 animate-fade-in" style={{ animationDelay: '0.2s' }}>
                  <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                    <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                    জেলা
                  </label>
                  <Select value={selectedDistrict} onValueChange={setSelectedDistrict}>
                    <SelectTrigger className="border-2 border-blue-300 hover:border-blue-500 transition-colors">
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
                <Button
                  onClick={handleFetchWeather}
                  disabled={loading}
                  className="w-full mt-6 bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600 text-white font-bold py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 transform hover:scale-105 active:scale-95"
                  size="lg"
                >
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      লোড হচ্ছে...
                    </div>
                  ) : (
                    '🔍 আবহাওয়া দেখুন'
                  )}
                </Button>

                {/* Instructions */}
                {!weatherData && !error && (
                  <div className="mt-6 p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border-l-4 border-blue-500 animate-fade-in">
                    <p className="text-sm font-bold text-blue-900 mb-2">📖 ধাপগুলি:</p>
                    <ol className="text-xs text-blue-800 space-y-1 list-decimal list-inside">
                      <li>বিভাগ নির্বাচন করুন</li>
                      <li>জেলা নির্বাচন করুন</li>
                      <li>বোতাম ক্লিক করুন</li>
                    </ol>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Panel - Results */}
          <div className="lg:col-span-3 space-y-6">
            {/* Error Display */}
            {error && (
              <Card className="border-2 border-red-300 bg-gradient-to-r from-red-50 to-red-100 shadow-lg animate-fade-in">
                <CardContent className="pt-6">
                  <div className="flex gap-3">
                    <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5 animate-bounce" />
                    <div>
                      <p className="font-bold text-red-900 text-lg">⚠️ ত্রুটি</p>
                      <p className="text-red-700 text-sm mt-1">{error}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Location Info */}
            {weatherData && (
              <>
                <Card className="border-2 border-emerald-200 shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden bg-white/95 backdrop-blur animate-fade-in">
                  <CardHeader className="bg-gradient-to-r from-emerald-500 to-green-500 text-white">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <CheckCircle className="w-5 h-5" />
                      📍 অবস্থান তথ্য
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {[
                        { label: 'অক্ষাংশ', value: weatherData.location.latitude.toFixed(4), color: 'from-emerald-500' },
                        { label: 'দ্রাঘিমাংশ', value: weatherData.location.longitude.toFixed(4), color: 'from-blue-500' },
                        { label: 'সময় অঞ্চল', value: weatherData.location.timezone, color: 'from-purple-500' },
                        { label: 'আপডেট সময়', value: new Date(weatherData.lastUpdated).toLocaleTimeString('bn-BD'), color: 'from-pink-500' },
                      ].map((item, idx) => (
                        <div key={idx} className={`p-4 bg-gradient-to-br ${item.color} to-transparent opacity-90 rounded-lg border border-white/20 hover:opacity-100 transition-opacity`}>
                          <p className="text-xs text-gray-600 font-bold mb-1">{item.label}</p>
                          <p className="text-base font-mono font-bold text-gray-900">{item.value}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* 5-Day Forecast */}
                <Card className="border-2 border-blue-200 shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden bg-white/95 backdrop-blur animate-fade-in" style={{ animationDelay: '0.1s' }}>
                  <CardHeader className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Calendar className="w-5 h-5" />
                      📅 ৫ দিনের পূর্বাভাস
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                      {weatherData.forecasts.map((forecast, index) => (
                        <div
                          key={index}
                          className="group relative overflow-hidden bg-gradient-to-br from-white to-gray-50 border-2 border-gray-200 rounded-xl p-4 hover:border-emerald-400 hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer"
                          style={{ animationDelay: `${index * 0.1}s` }}
                        >
                          {/* Background accent */}
                          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/0 to-blue-500/0 group-hover:from-emerald-500/10 group-hover:to-blue-500/10 transition-colors" />

                          <div className="relative space-y-3">
                            {/* Weather Icon */}
                            <div className="flex justify-center py-2">
                              {getWeatherIcon(forecast.tempMax, forecast.rainProbability)}
                            </div>

                            {/* Date */}
                            <div className="pb-2 border-b-2 border-gray-200 text-center">
                              <p className="text-sm font-bold text-emerald-700">
                                {formatDateBn(forecast.date)}
                              </p>
                            </div>

                            {/* Temperature */}
                            <div className="space-y-2">
                              <div className="flex items-center gap-2">
                                <Thermometer className="w-4 h-4 text-red-500" />
                                <div className="flex-1">
                                  <p className="text-xs text-gray-600 font-semibold">সর্বোচ্চ</p>
                                  <p className="text-sm font-bold text-red-600">
                                    {formatTemperatureBn(forecast.tempMax)}
                                  </p>
                                </div>
                              </div>

                              <div className="flex items-center gap-2">
                                <Wind className="w-4 h-4 text-blue-500" />
                                <div className="flex-1">
                                  <p className="text-xs text-gray-600 font-semibold">সর্বনিম্ন</p>
                                  <p className="text-sm font-bold text-blue-600">
                                    {formatTemperatureBn(forecast.tempMin)}
                                  </p>
                                </div>
                              </div>
                            </div>

                            {/* Humidity & Rain */}
                            <div className="space-y-2 pt-2 border-t-2 border-gray-200">
                              <div className="flex items-center gap-2">
                                <Droplets className="w-4 h-4 text-cyan-500" />
                                <div className="flex-1">
                                  <p className="text-xs text-gray-600 font-semibold">আর্দ্রতা</p>
                                  <p className="text-sm font-bold text-cyan-600">
                                    {formatPercentageBn(forecast.humidity)}
                                  </p>
                                </div>
                              </div>

                              <div className="flex items-center gap-2">
                                <CloudRain className="w-4 h-4 text-slate-500" />
                                <div className="flex-1">
                                  <p className="text-xs text-gray-600 font-semibold">বৃষ্টি</p>
                                  <p className="text-sm font-bold text-slate-600">
                                    {formatPercentageBn(forecast.rainProbability)}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Raw JSON Data */}
                <Card className="border-2 border-gray-300 shadow-lg overflow-hidden bg-white/95 backdrop-blur animate-fade-in" style={{ animationDelay: '0.2s' }}>
                  <CardHeader className="bg-gradient-to-r from-gray-700 to-black text-white">
                    <CardTitle className="text-sm">💻 API Response (JSON)</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <pre className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto text-xs font-mono max-h-64 overflow-y-auto border border-green-500">
                      {JSON.stringify(weatherData, null, 2)}
                    </pre>
                  </CardContent>
                </Card>
              </>
            )}

            {/* Empty State */}
            {!weatherData && !loading && !error && (
              <Card className="border-2 border-dashed border-gray-300 shadow-lg hover:shadow-xl transition-shadow bg-gradient-to-br from-gray-50 to-gray-100 animate-fade-in">
                <CardContent className="pt-12 pb-12 text-center">
                  <div className="relative w-24 h-24 mx-auto mb-4">
                    <Cloud className="w-24 h-24 text-gray-300 animate-bounce" />
                  </div>
                  <p className="text-gray-600 font-bold text-lg">আপনার এলাকা নির্বাচন করুন এবং আবহাওয়া দেখুন</p>
                  <p className="text-gray-500 text-sm mt-2">বাম পক্ষ থেকে শুরু করুন 👈</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>

      {/* CSS for animations */}
      <style jsx>{`
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
          animation: fade-in 0.5s ease-out forwards;
          opacity: 0;
        }
      `}</style>
    </div>
  );
}
