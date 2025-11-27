/**
 * Open-Meteo Weather API Service
 * Fetches weather forecasts for Bangladesh locations
 */

import {
  OpenMeteoResponse,
  WeatherData,
  WeatherForecast,
} from '@/types/weather';

const OPEN_METEO_BASE_URL = 'https://api.open-meteo.com/v1/forecast';
const FORECAST_DAYS = 5;
const CACHE_DURATION_MS = 30 * 60 * 1000; // 30 minutes

interface CachedWeather {
  data: WeatherData;
  timestamp: number;
}

// In-memory cache for weather data
const weatherCache = new Map<string, CachedWeather>();

/**
 * Build the Open-Meteo API URL with required parameters
 */
function buildOpenMeteoUrl(latitude: number, longitude: number): string {
  const params = new URLSearchParams({
    latitude: latitude.toString(),
    longitude: longitude.toString(),
    daily: [
      'temperature_2m_max',
      'temperature_2m_min',
      'precipitation_probability_max',
      'relative_humidity_2m_max',
    ].join(','),
    forecast_days: FORECAST_DAYS.toString(),
    timezone: 'Asia/Dhaka',
  });

  return `${OPEN_METEO_BASE_URL}?${params.toString()}`;
}

/**
 * Generate cache key from coordinates
 */
function getCacheKey(latitude: number, longitude: number): string {
  return `${latitude.toFixed(4)},${longitude.toFixed(4)}`;
}

/**
 * Check if cached data is still valid
 */
function isCacheValid(cached: CachedWeather): boolean {
  return Date.now() - cached.timestamp < CACHE_DURATION_MS;
}

/**
 * Transform Open-Meteo API response to our format
 */
function transformApiResponse(response: OpenMeteoResponse): WeatherData {
  const forecasts: WeatherForecast[] = response.daily.time.map(
    (date: string, index: number) => ({
      date,
      tempMax: response.daily.temperature_2m_max[index],
      tempMin: response.daily.temperature_2m_min[index],
      humidity: response.daily.relative_humidity_2m_max[index],
      rainProbability: response.daily.precipitation_probability_max[index],
    })
  );

  return {
    location: {
      latitude: response.latitude,
      longitude: response.longitude,
      timezone: response.timezone,
    },
    forecasts,
    lastUpdated: new Date(),
  };
}

/**
 * Fetch weather forecast from Open-Meteo API
 * Includes caching to minimize API calls
 */
export async function fetchWeatherForecast(
  latitude: number,
  longitude: number
): Promise<WeatherData> {
  const cacheKey = getCacheKey(latitude, longitude);

  // Check cache first
  const cached = weatherCache.get(cacheKey);
  if (cached && isCacheValid(cached)) {
    console.log(`[Weather] Using cached data for ${cacheKey}`);
    return cached.data;
  }

  try {
    const url = buildOpenMeteoUrl(latitude, longitude);
    console.log(`[Weather] Fetching from Open-Meteo: ${url}`);

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(
        `Open-Meteo API error: ${response.status} ${response.statusText}`
      );
    }

    const data: OpenMeteoResponse = await response.json();
    const weatherData = transformApiResponse(data);

    // Cache the result
    weatherCache.set(cacheKey, {
      data: weatherData,
      timestamp: Date.now(),
    });

    console.log(`[Weather] Successfully fetched weather for ${cacheKey}`);
    return weatherData;
  } catch (error) {
    console.error(`[Weather] Error fetching forecast:`, error);
    throw error;
  }
}

/**
 * Clear weather cache (useful for testing or manual refresh)
 */
export function clearWeatherCache(): void {
  weatherCache.clear();
  console.log('[Weather] Cache cleared');
}

/**
 * Get cache statistics
 */
export function getWeatherCacheStats(): { size: number; keys: string[] } {
  return {
    size: weatherCache.size,
    keys: Array.from(weatherCache.keys()),
  };
}
