/**
 * Weather Type Definitions
 * Interfaces for weather data from Open-Meteo API and internal use
 */

export interface WeatherForecast {
  date: string;
  tempMax: number;
  tempMin: number;
  humidity: number;
  rainProbability: number;
}

export interface WeatherData {
  location: {
    latitude: number;
    longitude: number;
    timezone: string;
  };
  forecasts: WeatherForecast[];
  lastUpdated: Date;
  isMockData?: boolean; // Flag to indicate if this is fallback/mock data
}

export interface WeatherAdvisory {
  type: 'warning' | 'info' | 'success';
  message: string;
  messageBn: string;
  action: string;
  actionBn: string;
}

/**
 * Open-Meteo API Response Types
 */
export interface OpenMeteoResponse {
  latitude: number;
  longitude: number;
  timezone: string;
  daily: {
    time: string[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    precipitation_probability_max: number[];
    relative_humidity_2m_max: number[];
  };
}

/**
 * Location Data Type
 */
export interface LocationCoordinates {
  lat: number;
  lon: number;
}

export interface DistrictData {
  [districtName: string]: LocationCoordinates;
}

export interface DivisionsData {
  [divisionName: string]: DistrictData;
}
