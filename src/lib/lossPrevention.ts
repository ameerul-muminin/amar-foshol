import localforage from 'localforage';
import { getFarmerBatches, CropBatch } from './cropBatch';

const lpStore = localforage.createInstance({ name: 'amar-foshol', storeName: 'loss_prevention' });

// Baseline expected loss rates by storage type (percent of weight lost without intervention)
const BASELINE_LOSS_RATE: Record<string, number> = {
  jute_bag: 0.07, // 7%
  silo: 0.02,     // 2%
  open_area: 0.15,// 15%
  warehouse: 0.04,// 4%
  indoor: 0.06     // 6%
};

// Compute savedKg and a normalized score for a farmer for the given month/year
export async function computeMonthlyLossPrevention(farmerId: string, month: number, year: number) {
  // month: 1-12
  const batches = await getFarmerBatches(farmerId);

  // Filter batches harvested in given month/year
  const monthBatches = batches.filter(b => {
    const d = new Date(b.harvestDate);
    return d.getMonth() + 1 === month && d.getFullYear() === year;
  });

  // total potential loss = sum(weightKg * baselineRate)
  let totalPotentialLoss = 0;
  // actual loss = sum(weightKg) for batches with status 'lost'
  let actualLoss = 0;
  // interventions count
  let interventions = 0;

  monthBatches.forEach((b: CropBatch) => {
    const rate = BASELINE_LOSS_RATE[b.storageType] ?? 0.08;
    totalPotentialLoss += b.weightKg * rate;
    if (b.status === 'lost') actualLoss += b.weightKg;
    interventions += (b.interventions?.length || 0);
  });

  // savedKg = potentialLoss - actualLoss (if actualLoss less than potential)
  let savedKg = Math.max(0, totalPotentialLoss - actualLoss);

  // small bonus from interventions (each intervention reduces loss estimate a bit)
  savedKg += interventions * 2; // 2kg credited per intervention as heuristic

  const totalWeight = monthBatches.reduce((s, b) => s + b.weightKg, 0);

  // score normalized: proportion of savedKg to totalWeight, scaled to 0-95
  const ratio = totalWeight > 0 ? Math.min(1, savedKg / totalWeight) : 0;
  const score = Math.round(Math.min(95, 50 + ratio * 45));

  const result = {
    month,
    year,
    savedKg: Math.round(savedKg),
    score,
    totalWeight,
    batchCount: monthBatches.length,
    interventions
  };

  return result;
}

export async function saveMonthlySummary(farmerId: string, month: number, year: number, data: any) {
  const key = `${farmerId}_${year}_${month}`;
  await lpStore.setItem(key, data);
}

export async function getMonthlySummaries(farmerId: string, limit = 6) {
  const items: any[] = [];
  await lpStore.iterate((value: any, key: string) => {
    if (key.startsWith(farmerId + '_')) items.push(value);
  });

  // sort by year/month desc
  items.sort((a, b) => (b.year - a.year) || (b.month - a.month));
  return items.slice(0, limit);
}
