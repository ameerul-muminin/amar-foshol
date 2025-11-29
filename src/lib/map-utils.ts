export interface FarmLocation {
  id: string; // anonymized identifier (e.g. "Farm #23")
  lat: number;
  lon: number;
  cropType: 'paddy' | 'wheat' | 'vegetables';
  riskLevel: 'low' | 'medium' | 'high';
  lastUpdated: Date; // use Date object to match PRD spec
}

// Minimal district bounds (example). Keys use "Division-District" as in PRD.
export const districtBounds: Record<string, { latMin: number; latMax: number; lonMin: number; lonMax: number }> = {
  // ঢাকা Division
  'ঢাকা-ঢাকা': { latMin: 23.7, latMax: 23.95, lonMin: 90.35, lonMax: 90.55 },
  'ঢাকা-গাজীপুর': { latMin: 23.85, latMax: 24.05, lonMin: 90.35, lonMax: 90.6 },
  'ঢাকা-নারায়ণগঞ্জ': { latMin: 23.6, latMax: 23.75, lonMin: 90.35, lonMax: 90.6 },

  // চট্টগ্রাম Division
  'চট্টগ্রাম-চট্টগ্রাম': { latMin: 22.2, latMax: 22.5, lonMin: 91.6, lonMax: 92.05 },
  'চট্টগ্রাম-কক্সবাজার': { latMin: 21.35, latMax: 21.6, lonMin: 91.9, lonMax: 92.2 },

  // রাজশাহী Division
  'রাজশাহী-রাজশাহী': { latMin: 24.3, latMax: 24.5, lonMin: 88.55, lonMax: 88.7 },

  // রংপুর Division
  'রংপুর-রংপুর': { latMin: 25.6, latMax: 25.95, lonMin: 89.1, lonMax: 89.45 },

  // সিলেট Division
  'সিলেট-সিলেট': { latMin: 24.9, latMax: 25.15, lonMin: 91.8, lonMax: 92.05 },

  // খুলনা Division
  'খুলনা-খুলনা': { latMin: 22.7, latMax: 23.0, lonMin: 89.45, lonMax: 89.75 },

  // বরিশাল Division
  'বরিশাল-বরিশাল': { latMin: 22.4, latMax: 22.8, lonMin: 90.1, lonMax: 90.6 },
};

function randBetween(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

export const generateMockNeighbors = (district: string, count?: number) : FarmLocation[] => {
  // default to 10-15 neighbors when count not provided
  const actualCount = typeof count === 'number' ? count : Math.floor(Math.random() * 6) + 10;
  // default to ঢাকা-ঢাকা if not found
  const key = `ঢাকা-${district}` in districtBounds ? `ঢাকা-${district}` : Object.keys(districtBounds)[0];
  // try to find a matching key either "ঢাকা-ঢাকা" or "চট্টগ্রাম-চট্টগ্রাম"
  let foundKey = key;
  for (const k of Object.keys(districtBounds)) {
    if (k.endsWith(`-${district}`)) { foundKey = k; break; }
  }

  const b = districtBounds[foundKey];
  const arr: FarmLocation[] = [];

  for (let i = 0; i < actualCount; i++) {
    const lat = randBetween(b.latMin, b.latMax);
    const lon = randBetween(b.lonMin, b.lonMax);

    // distribute risk: 60% low, 30% medium, 10% high
    const r = Math.random();
    const risk = r < 0.6 ? 'low' : r < 0.9 ? 'medium' : 'high';

    const cropRoll = Math.random();
    const cropType = cropRoll < 0.9 ? 'paddy' : cropRoll < 0.95 ? 'wheat' : 'vegetables';

    arr.push({
      id: `Farm #${i + 1}`,
      lat,
      lon,
      cropType,
      riskLevel: risk as FarmLocation['riskLevel'],
      lastUpdated: new Date(Date.now() - Math.floor(Math.random() * 1000 * 60 * 60 * 24)),
    });
  }

  return arr;
};

// Bangla helpers
const bnDigits = ['০','১','২','৩','৪','৫','৬','৭','৮','৯'];
export const toBanglaNum = (num: number | string) => String(num).replace(/\d/g, (d) => bnDigits[Number(d)]);

export const formatDateBn = (input: Date | string) => {
  try {
    const d = typeof input === 'string' ? new Date(input) : input;
    const day = toBanglaNum(d.getDate());
    const month = toBanglaNum(d.getMonth() + 1);
    const year = toBanglaNum(d.getFullYear());
    return `${day}/${month}/${year}`;
  } catch {
    return typeof input === 'string' ? input : input.toISOString();
  }
};

export const getCropNameBn = (crop: string) => ({ paddy: 'ধান/চাল', wheat: 'গম', vegetables: 'সবজি' } as Record<string,string>)[crop] ?? crop;
export const getRiskLevelBn = (r: string) => ({ low: 'নিম্ন (নিরাপদ)', medium: 'মধ্যম (সতর্ক)', high: 'উচ্চ (জরুরি)' } as Record<string,string>)[r] ?? r;

export const getDivisions = (): string[] => {
  const set = new Set<string>();
  for (const k of Object.keys(districtBounds)) {
    const parts = k.split('-');
    if (parts.length >= 2) set.add(parts[0]);
  }
  return Array.from(set);
};

export const getDistrictsForDivision = (division: string): string[] => {
  const out: string[] = [];
  for (const k of Object.keys(districtBounds)) {
    const parts = k.split('-');
    if (parts.length >= 2 && parts[0] === division) out.push(parts[1]);
  }
  return out;
};
