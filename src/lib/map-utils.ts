export interface FarmLocation {
  id: string;
  lat: number;
  lon: number;
  cropType: 'paddy' | 'wheat' | 'vegetables';
  riskLevel: 'low' | 'medium' | 'high';
  lastUpdated: string;
}

// Minimal district bounds (example). Keys use "Division-District" as in PRD.
export const districtBounds: Record<string, { latMin: number; latMax: number; lonMin: number; lonMax: number }> = {
  'ঢাকা-ঢাকা': { latMin: 23.7, latMax: 23.9, lonMin: 90.3, lonMax: 90.5 },
  'চট্টগ্রাম-চট্টগ্রাম': { latMin: 22.2, latMax: 22.5, lonMin: 91.7, lonMax: 92.0 },
};

function randBetween(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

export const generateMockNeighbors = (district: string, count = 10) : FarmLocation[] => {
  // default to ঢাকা-ঢাকা if not found
  const key = `ঢাকা-${district}` in districtBounds ? `ঢাকা-${district}` : Object.keys(districtBounds)[0];
  // try to find a matching key either "ঢাকা-ঢাকা" or "চট্টগ্রাম-চট্টগ্রাম"
  let foundKey = key;
  for (const k of Object.keys(districtBounds)) {
    if (k.endsWith(`-${district}`)) { foundKey = k; break; }
  }

  const b = districtBounds[foundKey];
  const arr: FarmLocation[] = [];

  for (let i = 0; i < count; i++) {
    const lat = randBetween(b.latMin, b.latMax);
    const lon = randBetween(b.lonMin, b.lonMax);

    // distribute risk: 60% low, 30% medium, 10% high
    const r = Math.random();
    const risk = r < 0.6 ? 'low' : r < 0.9 ? 'medium' : 'high';

    const cropRoll = Math.random();
    const cropType = cropRoll < 0.9 ? 'paddy' : cropRoll < 0.95 ? 'wheat' : 'vegetables';

    arr.push({
      id: `farm-${i + 1}`,
      lat,
      lon,
      cropType,
      riskLevel: risk as FarmLocation['riskLevel'],
      lastUpdated: new Date(Date.now() - Math.floor(Math.random() * 1000 * 60 * 60 * 24)).toISOString(),
    });
  }

  return arr;
};

// Bangla helpers
const bnDigits = ['০','১','২','৩','৪','৫','৬','৭','৮','৯'];
export const toBanglaNum = (num: number | string) => String(num).replace(/\d/g, (d) => bnDigits[Number(d)]);

export const formatDateBn = (iso: string) => {
  try {
    const d = new Date(iso);
    const day = toBanglaNum(d.getDate());
    const month = toBanglaNum(d.getMonth() + 1);
    const year = toBanglaNum(d.getFullYear());
    return `${day}/${month}/${year}`;
  } catch {
    return iso;
  }
};

export const getCropNameBn = (crop: string) => ({ paddy: 'ধান/চাল', wheat: 'গম', vegetables: 'সবজি' } as Record<string,string>)[crop] ?? crop;
export const getRiskLevelBn = (r: string) => ({ low: 'নিম্ন (নিরাপদ)', medium: 'মধ্যম (সতর্ক)', high: 'উচ্চ (জরুরি)' } as Record<string,string>)[r] ?? r;
