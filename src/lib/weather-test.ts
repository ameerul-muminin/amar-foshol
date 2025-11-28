/**
 * Weather API Integration Test
 * Run this to verify Open-Meteo API connection and data transformation
 */

import { fetchWeatherForecast, getWeatherCacheStats } from './weather-api';
import {
  getDistrictCoordinates,
  getDivisions,
  getDistrictsByDivision,
} from './locations';

async function runWeatherTest() {
  console.log('\n📍 Weather API Integration Test\n');

  // Test 1: Check locations data
  console.log('✅ Test 1: Bangladesh Locations Data');
  const divisions = getDivisions();
  console.log(`   Found ${divisions.length} divisions`);
  console.log(`   Divisions: ${divisions.join(', ')}`);

  const dhakDistricts = getDistrictsByDivision('ঢাকা');
  console.log(`   Dhaka Division has ${dhakDistricts.length} districts`);

  const coords = getDistrictCoordinates('ঢাকা', 'ঢাকা');
  console.log(`   Dhaka coordinates: ${coords.lat}, ${coords.lon}\n`);

  // Test 2: Fetch weather
  console.log('✅ Test 2: Open-Meteo API Weather Fetch');
  try {
    const weather = await fetchWeatherForecast(coords.lat, coords.lon);
    console.log(`   Location: ${weather.location.latitude}, ${weather.location.longitude}`);
    console.log(`   Timezone: ${weather.location.timezone}`);
    console.log(`   Forecasts: ${weather.forecasts.length} days`);

    weather.forecasts.forEach((f, i) => {
      console.log(`   Day ${i + 1}: ${f.date}`);
      console.log(`      Max: ${f.tempMax}°C, Min: ${f.tempMin}°C`);
      console.log(`      Humidity: ${f.humidity}%, Rain: ${f.rainProbability}%`);
    });
  } catch (error) {
    console.error('   ❌ Error fetching weather:', error);
  }

  // Test 3: Check cache
  console.log('\n✅ Test 3: Weather Cache');
  const cacheStats = getWeatherCacheStats();
  console.log(`   Cache size: ${cacheStats.size}`);
  console.log(`   Cached locations: ${cacheStats.keys.join(', ')}\n`);
}

// Only run if this is the main module
if (require.main === module) {
  runWeatherTest().catch(console.error);
}

export { runWeatherTest };
