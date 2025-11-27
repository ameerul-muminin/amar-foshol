'use client';

import React, { useState, useEffect } from 'react';
import {
  Cloud,
  CloudRain,
  Sun,
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

interface WeatherDisplayPureProps {
  onDataFetched?: (division: string, district: string, forecasts: WeatherData[]) => void;
}

export default function WeatherDisplayPure({ onDataFetched }: WeatherDisplayPureProps) {
  const [division, setDivision] = useState<string>('ঢাকা');
  const [district, setDistrict] = useState<string>('ঢাকা');
  const [weatherData, setWeatherData] = useState<WeatherData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [locationData, setLocationData] = useState<LocationData | null>(null);

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
      const forecasts: WeatherData[] = data.forecasts.map((f: any) => ({
        date: f.date,
        tempMax: f.tempMax,
        tempMin: f.tempMin,
        humidity: f.humidity,
        rainProbability: f.rainProbability,
      }));

      setWeatherData(forecasts);

      // Notify parent component about fetched data
      if (onDataFetched) {
        onDataFetched(division, district, forecasts);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'একটি ত্রুটি ঘটেছে');
      setWeatherData([]);
    } finally {
      setLoading(false);
    }
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-2 sm:p-4 md:p-6 lg:p-8 overflow-x-hidden">
      {/* Animated background orbs */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-20 w-96 h-96 bg-emerald-200/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-blue-200/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="w-full max-w-7xl mx-auto px-0">
        {/* Header */}
        <div className="mb-8 animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-bold text-emerald-900 mb-2">আবহাওয়া পূর্বাভাস</h1>
          <p className="text-lg text-gray-600">আপনার এলাকার ৫-দিনের আবহাওয়া</p>
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
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2"
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

            {locationData && (
              <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
                <p className="text-emerald-900 font-semibold">
                  📍 {locationData.name} ({locationData.lat.toFixed(2)}°, {locationData.lon.toFixed(2)}°)
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Error State */}
        {error && (
          <Card className="mb-8 border-2 border-red-200 bg-red-50">
            <CardContent className="pt-6">
              <p className="text-red-700 font-semibold text-center">{error}</p>
              <div className="flex justify-center mt-4">
                <Button
                  onClick={fetchWeather}
                  className="bg-red-600 hover:bg-red-700 text-white"
                >
                  পুনরায় চেষ্টা করুন
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Empty State */}
        {!loading && weatherData.length === 0 && !error && (
          <Card className="mb-8 border-2 border-gray-200">
            <CardContent className="pt-12 pb-12 text-center">
              <Cloud className="w-24 h-24 mx-auto text-gray-300 mb-4 animate-bounce" />
              <p className="text-gray-600 text-lg">আবহাওয়া তথ্য দেখতে উপরে এলাকা নির্বাচন করুন</p>
            </CardContent>
          </Card>
        )}

        {/* Weather Forecast Cards */}
        {weatherData.length > 0 && (
          <div className="space-y-6">
            <h2 className="text-2xl md:text-3xl font-bold text-emerald-900 mb-4">৫-দিনের পূর্বাভাস</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {weatherData.map((weather, index) => (
                <Card
                  key={index}
                  className="border-2 border-emerald-200 shadow-md hover:shadow-lg transition-shadow animate-fade-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg text-emerald-900 font-bold">
                        {formatDateBn(new Date(weather.date))}
                      </CardTitle>
                      <div className="ml-2">
                        {getWeatherIcon(weather.rainProbability, weather.tempMax)}
                      </div>
                    </div>
                    <CardDescription className="text-sm text-gray-600">
                      {new Date(weather.date).toLocaleDateString('bn-BD', { weekday: 'short' })}
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="space-y-3">
                    {/* Temperature */}
                    <div className="flex items-center justify-between p-2 bg-orange-50 rounded-lg border border-orange-200">
                      <span className="text-sm font-semibold text-orange-900 flex items-center gap-1">
                        <Thermometer className="w-4 h-4" />
                        তাপমাত্রা
                      </span>
                      <span className="text-lg font-bold text-orange-700">
                        {formatTemperatureBn(weather.tempMax)}/{formatTemperatureBn(weather.tempMin)}°সে
                      </span>
                    </div>

                    {/* Humidity */}
                    <div className="flex items-center justify-between p-2 bg-blue-50 rounded-lg border border-blue-200">
                      <span className="text-sm font-semibold text-blue-900">আর্দ্রতা</span>
                      <span className="text-lg font-bold text-blue-700">
                        {formatPercentageBn(weather.humidity)}%
                      </span>
                    </div>

                    {/* Rain Probability */}
                    <div className="flex items-center justify-between p-2 bg-cyan-50 rounded-lg border border-cyan-200">
                      <span className="text-sm font-semibold text-cyan-900">বৃষ্টির সম্ভাবনা</span>
                      <span className="text-lg font-bold text-cyan-700">
                        {formatPercentageBn(weather.rainProbability)}%
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
