/**
 * Weather API Route
 * GET /api/weather?division=ঢাকা&district=ঢাকা
 */

import { NextRequest, NextResponse } from 'next/server';
import { fetchWeatherForecast } from '@/lib/weather-api';
import { getDistrictCoordinates } from '@/lib/locations';

export async function GET(request: NextRequest) {
  try {
    // Get query parameters
    const division = request.nextUrl.searchParams.get('division');
    const district = request.nextUrl.searchParams.get('district');

    // Validate parameters
    if (!division || !district) {
      return NextResponse.json(
        {
          error: 'Missing required parameters',
          message: 'Please provide both "division" and "district" query parameters',
        },
        { status: 400 }
      );
    }

    // Get coordinates
    const coords = getDistrictCoordinates(division, district);

    // Fetch weather
    const weatherData = await fetchWeatherForecast(coords.lat, coords.lon);

    return NextResponse.json(weatherData, {
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
      },
    });
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error occurred';

    console.error('[API] Weather fetch error:', errorMessage);

    return NextResponse.json(
      {
        error: 'Failed to fetch weather data',
        message: errorMessage,
      },
      { status: 500 }
    );
  }
}
