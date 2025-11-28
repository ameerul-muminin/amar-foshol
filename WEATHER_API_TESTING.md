# 🚀 Testing Weather API Locally

## Quick Start

### 1. Start the Development Server

```powershell
npm run dev
```

This will start Next.js on `http://localhost:3000`

### 2. Open the Weather Test Page

Navigate to:
```
http://localhost:3000/weather-test
```

### 3. Test the API

The test page allows you to:
- ✅ Select any Bangladesh division
- ✅ Select any district in that division
- ✅ Fetch 5-day weather forecast
- ✅ View data in Bangla with Bangla numerals
- ✅ See raw JSON response

## API Endpoints

### Get Weather Data

**Endpoint:**
```
GET http://localhost:3000/api/weather
```

**Query Parameters:**
- `division` (string, required): Division name in Bangla
- `district` (string, required): District name in Bangla

**Example Request:**
```bash
curl "http://localhost:3000/api/weather?division=ঢাকা&district=ঢাকা"
```

**Example Response:**
```json
{
  "location": {
    "latitude": 23.8103,
    "longitude": 90.4125,
    "timezone": "Asia/Dhaka"
  },
  "forecasts": [
    {
      "date": "2025-11-27",
      "tempMax": 32,
      "tempMin": 25,
      "humidity": 85,
      "rainProbability": 70
    }
  ],
  "lastUpdated": "2025-11-27T10:30:00.000Z"
}
```

## Testing with cURL (Terminal)

### Test 1: Dhaka Weather
```powershell
curl "http://localhost:3000/api/weather?division=ঢাকা&district=ঢাকা"
```

### Test 2: Chittagong Weather
```powershell
curl "http://localhost:3000/api/weather?division=চট্টগ্রাম&district=চট্টগ্রাম"
```

### Test 3: Missing Parameters (Error)
```powershell
curl "http://localhost:3000/api/weather?division=ঢাকা"
```

## Manual Testing in Browser

1. Open **DevTools** (F12)
2. Go to **Network** tab
3. Load `http://localhost:3000/weather-test`
4. Select division and district
5. Click "আবহাওয়া দেখুন"
6. Watch the `/api/weather` request in Network tab
7. Check response in **Response** tab

## Troubleshooting

### Issue: `Cannot find module '@/types/weather'`
- Make sure all files are created in `src/` directory
- Check `tsconfig.json` has proper path aliases

### Issue: `district not found in division`
- Verify the exact spelling (case-sensitive)
- Check available districts on test page

### Issue: API returns 500 error
- Check browser console for detailed error
- Ensure Open-Meteo API is accessible from your network
- Try opening `https://api.open-meteo.com/v1/forecast` directly in browser

### Issue: Numbers not showing in Bangla
- Ensure `src/lib/bangla-numbers.ts` is loaded
- Check if browser supports Bangla Unicode
- Try a different browser

## Files Created

```
src/
  app/
    weather-test/
      page.tsx          # Test page UI
    api/
      weather/
        route.ts        # API endpoint
  lib/
    weather-api.ts      # Open-Meteo integration
    locations.ts        # Bangladesh data
    bangla-numbers.ts   # Number formatting
  types/
    weather.ts          # TypeScript types
```

## Next Steps

After verifying the API works:
1. Build the Weather Display UI (A3.2)
2. Implement Smart Advisories (A3.3)
3. Add IndexedDB Caching (A3.4)

---

**Need Help?**
- Check console logs with `F12 → Console`
- Look at Network tab for API responses
- Verify all files are in correct locations
