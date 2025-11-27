import localforage from 'localforage';

// Configure localforage for crop batches
const batchStore = localforage.createInstance({
  name: 'amar-foshol',
  storeName: 'crop_batches'
});

// Storage types
export type StorageType = 
  | 'jute_bag'      // পাটের বস্তা
  | 'silo'          // সাইলো
  | 'open_area'     // খোলা জায়গা
  | 'warehouse'     // গুদামঘর
  | 'indoor';       // ঘরের ভিতর

// Crop batch status
export type BatchStatus = 'active' | 'completed' | 'lost';

// Intervention (when farmer takes action)
export interface Intervention {
  id: string;
  batchId: string;
  date: Date;
  action: string;
  actionBn: string;
  reason: string;
  reasonBn: string;
  weatherCondition?: string;
}

// Crop batch interface
export interface CropBatch {
  id: string;
  farmerId: string;
  cropType: 'paddy'; // Only paddy/rice for now
  weightKg: number;
  harvestDate: Date;
  division: string;
  divisionBn: string;
  district: string;
  districtBn: string;
  storageType: StorageType;
  status: BatchStatus;
  createdAt: Date;
  updatedAt: Date;
  interventions: Intervention[];
  notes?: string;
}

// Storage type labels
export const storageTypeLabels = {
  jute_bag: {
    en: 'Jute Bag Stack',
    bn: 'পাটের বস্তা'
  },
  silo: {
    en: 'Silo',
    bn: 'সাইলো'
  },
  open_area: {
    en: 'Open Area',
    bn: 'খোলা জায়গা'
  },
  warehouse: {
    en: 'Warehouse',
    bn: 'গুদামঘর'
  },
  indoor: {
    en: 'Indoor Storage',
    bn: 'ঘরের ভিতর'
  }
};

// Generate unique batch ID
export function generateBatchId(): string {
  return `batch_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

// Create new crop batch
export async function createCropBatch(data: {
  farmerId: string;
  cropType: 'paddy';
  weightKg: number;
  harvestDate: Date;
  division: string;
  divisionBn: string;
  district: string;
  districtBn: string;
  storageType: StorageType;
  notes?: string;
}): Promise<CropBatch> {
  try {
    const batch: CropBatch = {
      id: generateBatchId(),
      farmerId: data.farmerId,
      cropType: data.cropType,
      weightKg: data.weightKg,
      harvestDate: data.harvestDate,
      division: data.division,
      divisionBn: data.divisionBn,
      district: data.district,
      districtBn: data.districtBn,
      storageType: data.storageType,
      status: 'active',
      createdAt: new Date(),
      updatedAt: new Date(),
      interventions: [],
      notes: data.notes
    };

    // Store in localforage
    await batchStore.setItem(batch.id, batch);

    console.log('✅ Crop batch created:', batch.id);

    // Award "First Batch" badge
    try {
      const { awardBadge } = await import('./auth');
      await awardBadge(data.farmerId, 'first_batch');
    } catch (error) {
      console.error('Error awarding badge:', error);
    }

    return batch;
  } catch (error) {
    console.error('Error creating crop batch:', error);
    throw error;
  }
}

// Get all batches for a farmer
export async function getFarmerBatches(farmerId: string): Promise<CropBatch[]> {
  try {
    const batches: CropBatch[] = [];
    await batchStore.iterate((value: any, key: string) => {
      if (value.farmerId === farmerId) {
        batches.push(value);
      }
    });
    
    // Sort by creation date (newest first)
    return batches.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  } catch (error) {
    console.error('Error fetching farmer batches:', error);
    return [];
  }
}

// Get single batch by ID
export async function getBatchById(batchId: string): Promise<CropBatch | null> {
  try {
    const batch = await batchStore.getItem<CropBatch>(batchId);
    return batch;
  } catch (error) {
    console.error('Error fetching batch:', error);
    return null;
  }
}

// Update batch status
export async function updateBatchStatus(
  batchId: string, 
  status: BatchStatus
): Promise<CropBatch | null> {
  try {
    const batch = await batchStore.getItem<CropBatch>(batchId);
    if (!batch) return null;

    batch.status = status;
    batch.updatedAt = new Date();

    await batchStore.setItem(batchId, batch);
    return batch;
  } catch (error) {
    console.error('Error updating batch status:', error);
    return null;
  }
}

// Add intervention to batch
export async function addIntervention(
  batchId: string,
  intervention: Omit<Intervention, 'id' | 'batchId'>
): Promise<CropBatch | null> {
  try {
    const batch = await batchStore.getItem<CropBatch>(batchId);
    if (!batch) return null;

    const newIntervention: Intervention = {
      id: `intervention_${Date.now()}`,
      batchId: batchId,
      ...intervention
    };

    batch.interventions.push(newIntervention);
    batch.updatedAt = new Date();

    await batchStore.setItem(batchId, batch);
    return batch;
  } catch (error) {
    console.error('Error adding intervention:', error);
    return null;
  }
}

// Delete batch
export async function deleteBatch(batchId: string): Promise<boolean> {
  try {
    await batchStore.removeItem(batchId);
    return true;
  } catch (error) {
    console.error('Error deleting batch:', error);
    return false;
  }
}

// Get batch statistics for a farmer
export async function getFarmerStats(farmerId: string): Promise<{
  totalBatches: number;
  activeBatches: number;
  completedBatches: number;
  lostBatches: number;
  totalWeight: number;
  interventionCount: number;
}> {
  try {
    const batches = await getFarmerBatches(farmerId);
    
    return {
      totalBatches: batches.length,
      activeBatches: batches.filter(b => b.status === 'active').length,
      completedBatches: batches.filter(b => b.status === 'completed').length,
      lostBatches: batches.filter(b => b.status === 'lost').length,
      totalWeight: batches.reduce((sum, b) => sum + b.weightKg, 0),
      interventionCount: batches.reduce((sum, b) => sum + b.interventions.length, 0)
    };
  } catch (error) {
    console.error('Error calculating farmer stats:', error);
    return {
      totalBatches: 0,
      activeBatches: 0,
      completedBatches: 0,
      lostBatches: 0,
      totalWeight: 0,
      interventionCount: 0
    };
  }
}