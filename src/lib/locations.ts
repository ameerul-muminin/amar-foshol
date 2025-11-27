/**
 * Bangladesh Divisions and Districts with Coordinates
 * Data source: Administrative divisions of Bangladesh with GPS coordinates
 */

import { DivisionsData } from '@/types/weather';

export const bangladeshLocations: DivisionsData = {
  // ঢাকা বিভাগ (Dhaka Division) - 13 districts
  ঢাকা: {
    'ঢাকা': { lat: 23.8103, lon: 90.4125 },
    'গাজীপুর': { lat: 23.9999, lon: 90.4203 },
    'নারায়ণগঞ্জ': { lat: 23.6238, lon: 90.5 },
    'মুন্সিগঞ্জ': { lat: 23.5513, lon: 90.5 },
    'শরীয়তপুর': { lat: 23.2156, lon: 90.5 },
    'রাজবাড়ী': { lat: 23.7574, lon: 89.7667 },
    'ফরিদপুর': { lat: 23.6122, lon: 89.8333 },
    'টাঙ্গাইল': { lat: 24.25, lon: 89.9167 },
    'মানিকগঞ্জ': { lat: 23.8636, lon: 90.1833 },
    'মাদারীপুর': { lat: 23.1667, lon: 90.1944 },
    'নরসিংদী': { lat: 23.9167, lon: 90.7167 },
    'টিপাইগড়': { lat: 23.8628, lon: 91.3947 },
    'কিশোরগঞ্জ': { lat: 24.4333, lon: 90.7667 },
  },

  // চট্টগ্রাম বিভাগ (Chittagong Division) - 10 districts
  চট্টগ্রাম: {
    'চট্টগ্রাম': { lat: 22.3569, lon: 91.7832 },
    'কক্সবাজার': { lat: 21.4272, lon: 92.0058 },
    'খাগরাছড়ি': { lat: 22.475, lon: 91.9833 },
    'রাঙ্গামাটি': { lat: 22.6667, lon: 92.2 },
    'বান্দরবান': { lat: 22.1667, lon: 92.2167 },
    'কুমিল্লা': { lat: 23.4636, lon: 91.1833 },
    'নোয়াখালী': { lat: 22.8292, lon: 91.0869 },
    'ফেনী': { lat: 23.0167, lon: 91.4 },
    'লক্ষ্মীপুর': { lat: 22.9428, lon: 90.8378 },
    'চাঁদপুর': { lat: 23.2186, lon: 90.6706 },
  },

  // খুলনা বিভাগ (Khulna Division) - 9 districts
  খুলনা: {
    'খুলনা': { lat: 22.8456, lon: 89.5403 },
    'বাগেরহাট': { lat: 22.6833, lon: 89.7833 },
    'সাতক্ষীরা': { lat: 22.75, lon: 89 },
    'যশোর': { lat: 23.1667, lon: 89.1667 },
    'ঝিনাইদহ': { lat: 23.3667, lon: 89.15 },
    'নড়াইল': { lat: 23.1833, lon: 89.4333 },
    'পিরোজপুর': { lat: 22.5833, lon: 89.75 },
    'মেহেরপুর': { lat: 23.7667, lon: 88.6333 },
    'কুষ্টিয়া': { lat: 23.9167, lon: 89.1167 },
  },

  // বরিশাল বিভাগ (Barisal Division) - 6 districts
  বরিশাল: {
    'বরিশাল': { lat: 22.7018, lon: 90.3635 },
    'ভোলা': { lat: 22.5833, lon: 90.6667 },
    'ঝালকাঠি': { lat: 22.6389, lon: 90.1944 },
    'পটুয়াখালী': { lat: 22.3596, lon: 90.3281 },
    'গোপালগঞ্জ': { lat: 23.0046, lon: 90.6667 },
    'বরগুনা': { lat: 22.0953, lon: 90.1122 },
  },

  // সিলেট বিভাগ (Sylhet Division) - 4 districts
  সিলেট: {
    'সিলেট': { lat: 24.8917, lon: 91.8722 },
    'মৌলভীবাজার': { lat: 24.4828, lon: 91.7675 },
    'সুনামগঞ্জ': { lat: 25.2656, lon: 91.4045 },
    'হবিগঞ্জ': { lat: 24.3744, lon: 91.2756 },
  },

  // রাজশাহী বিভাগ (Rajshahi Division) - 8 districts
  রাজশাহী: {
    'রাজশাহী': { lat: 24.3745, lon: 88.6042 },
    'নবাবগঞ্জ': { lat: 24.5933, lon: 88.2667 },
    'পাবনা': { lat: 23.95, lon: 89.25 },
    'বগুড়া': { lat: 24.85, lon: 89.3667 },
    'সিরাজগঞ্জ': { lat: 24.4556, lon: 89.7 },
    'নাটোর': { lat: 24.4269, lon: 89.0 },
    'চাঁপাইনবাবগঞ্জ': { lat: 24.5975, lon: 88.2667 },
    'জয়পুরহাট': { lat: 25.1667, lon: 89.0167 },
  },

  // রংপুর বিভাগ (Rangpur Division) - 8 districts
  রংপুর: {
    'রংপুর': { lat: 25.7439, lon: 89.2722 },
    'দিনাজপুর': { lat: 25.6217, lon: 88.6406 },
    'থানেশ্বর': { lat: 25.9333, lon: 89.55 },
    'কুড়িগ্রাম': { lat: 25.805, lon: 89.7317 },
    'লালমনিরহাট': { lat: 25.9167, lon: 89.8333 },
    'নীলফামারী': { lat: 25.4667, lon: 89.5333 },
    'গাইবান্ধা': { lat: 25.3281, lon: 89.5356 },
    'পঞ্চগড়': { lat: 26.3344, lon: 88.5546 },
  },

  // ময়মনসিংহ বিভাগ (Mymensingh Division) - 4 districts
  ময়মনসিংহ: {
    'ময়মনসিংহ': { lat: 24.7471, lon: 90.4203 },
    'নেত্রকোনা': { lat: 24.4333, lon: 90.7167 },
    'জামালপুর': { lat: 24.9417, lon: 89.9375 },
    'শেরপুর': { lat: 25.1667, lon: 90.0167 },
  },
};

/**
 * Get coordinates for a specific district
 */
export function getDistrictCoordinates(division: string, district: string) {
  if (!bangladeshLocations[division]) {
    throw new Error(`Division "${division}" not found`);
  }

  const coords = bangladeshLocations[division][district];
  if (!coords) {
    throw new Error(
      `District "${district}" not found in division "${division}"`
    );
  }

  return coords;
}

/**
 * Get all divisions
 */
export function getDivisions(): string[] {
  return Object.keys(bangladeshLocations);
}

/**
 * Get all districts in a division
 */
export function getDistrictsByDivision(division: string): string[] {
  if (!bangladeshLocations[division]) {
    throw new Error(`Division "${division}" not found`);
  }
  return Object.keys(bangladeshLocations[division]);
}
