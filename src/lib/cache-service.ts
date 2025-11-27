/**
 * IndexedDB Cache Service
 * Provides offline storage and sync capabilities for weather data and advisories
 */

export interface CachedWeatherData {
  id: string;
  division: string;
  district: string;
  data: any;
  advisories: any[];
  timestamp: number;
  synced: boolean;
}

export interface SyncQueueItem {
  id: string;
  type: 'weather' | 'advisory' | 'profile';
  data: any;
  timestamp: number;
  retries: number;
  maxRetries: number;
}

const DB_NAME = 'AmarFosholDB';
const DB_VERSION = 1;
const WEATHER_STORE = 'weather_cache';
const SYNC_QUEUE_STORE = 'sync_queue';
const ADVISORY_STORE = 'advisory_cache';
const PROFILE_STORE = 'profile_cache';

let db: IDBDatabase | null = null;

/**
 * Initialize IndexedDB
 */
export async function initializeDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => {
      console.error('[Cache] DB open error:', request.error);
      reject(request.error);
    };

    request.onsuccess = () => {
      db = request.result;
      console.log('[Cache] Database initialized');
      resolve(db);
    };

    request.onupgradeneeded = (event) => {
      const database = (event.target as IDBOpenDBRequest).result;

      // Create weather cache store
      if (!database.objectStoreNames.contains(WEATHER_STORE)) {
        const weatherStore = database.createObjectStore(WEATHER_STORE, { keyPath: 'id' });
        weatherStore.createIndex('timestamp', 'timestamp', { unique: false });
        weatherStore.createIndex('location', ['division', 'district'], { unique: false });
      }

      // Create sync queue store
      if (!database.objectStoreNames.contains(SYNC_QUEUE_STORE)) {
        const syncStore = database.createObjectStore(SYNC_QUEUE_STORE, { keyPath: 'id', autoIncrement: true });
        syncStore.createIndex('type', 'type', { unique: false });
        syncStore.createIndex('timestamp', 'timestamp', { unique: false });
      }

      // Create advisory cache store
      if (!database.objectStoreNames.contains(ADVISORY_STORE)) {
        const advisoryStore = database.createObjectStore(ADVISORY_STORE, { keyPath: 'id' });
        advisoryStore.createIndex('timestamp', 'timestamp', { unique: false });
      }

      // Create profile store
      if (!database.objectStoreNames.contains(PROFILE_STORE)) {
        database.createObjectStore(PROFILE_STORE, { keyPath: 'id' });
      }

      console.log('[Cache] Object stores created');
    };
  });
}

/**
 * Get database connection
 */
async function getDB(): Promise<IDBDatabase> {
  if (db) return db;
  return initializeDB();
}

/**
 * Cache weather data
 */
export async function cacheWeatherData(
  division: string,
  district: string,
  data: any,
  advisories: any[]
): Promise<string> {
  try {
    const database = await getDB();
    const id = `${division}-${district}-${Date.now()}`;

    const cacheEntry: CachedWeatherData = {
      id,
      division,
      district,
      data,
      advisories,
      timestamp: Date.now(),
      synced: true,
    };

    return new Promise((resolve, reject) => {
      const transaction = database.transaction([WEATHER_STORE], 'readwrite');
      const store = transaction.objectStore(WEATHER_STORE);
      const request = store.add(cacheEntry);

      request.onsuccess = () => {
        console.log(`[Cache] Weather data cached: ${id}`);
        resolve(id);
      };

      request.onerror = () => {
        console.error('[Cache] Error caching weather:', request.error);
        reject(request.error);
      };
    });
  } catch (error) {
    console.error('[Cache] Error in cacheWeatherData:', error);
    throw error;
  }
}

/**
 * Get cached weather data for location
 */
export async function getCachedWeather(division: string, district: string): Promise<CachedWeatherData | null> {
  try {
    const database = await getDB();

    return new Promise((resolve, reject) => {
      const transaction = database.transaction([WEATHER_STORE], 'readonly');
      const store = transaction.objectStore(WEATHER_STORE);
      const index = store.index('location');
      const request = index.getAll([division, district]);

      request.onsuccess = () => {
        const results = request.result as CachedWeatherData[];
        if (results.length > 0) {
          // Return most recent cache entry
          const sorted = results.sort((a, b) => b.timestamp - a.timestamp);
          console.log(`[Cache] Retrieved cached weather for ${division}, ${district}`);
          resolve(sorted[0]);
        } else {
          resolve(null);
        }
      };

      request.onerror = () => {
        console.error('[Cache] Error retrieving weather:', request.error);
        reject(request.error);
      };
    });
  } catch (error) {
    console.error('[Cache] Error in getCachedWeather:', error);
    return null;
  }
}

/**
 * Get all cached weather data
 */
export async function getAllCachedWeather(): Promise<CachedWeatherData[]> {
  try {
    const database = await getDB();

    return new Promise((resolve, reject) => {
      const transaction = database.transaction([WEATHER_STORE], 'readonly');
      const store = transaction.objectStore(WEATHER_STORE);
      const request = store.getAll();

      request.onsuccess = () => {
        const results = request.result as CachedWeatherData[];
        console.log(`[Cache] Retrieved ${results.length} cached weather entries`);
        resolve(results);
      };

      request.onerror = () => {
        console.error('[Cache] Error retrieving all weather:', request.error);
        reject(request.error);
      };
    });
  } catch (error) {
    console.error('[Cache] Error in getAllCachedWeather:', error);
    return [];
  }
}

/**
 * Add item to sync queue
 */
export async function addToSyncQueue(type: 'weather' | 'advisory' | 'profile', data: any): Promise<number> {
  try {
    const database = await getDB();

    const item: SyncQueueItem = {
      id: `${type}-${Date.now()}`,
      type,
      data,
      timestamp: Date.now(),
      retries: 0,
      maxRetries: 3,
    };

    return new Promise((resolve, reject) => {
      const transaction = database.transaction([SYNC_QUEUE_STORE], 'readwrite');
      const store = transaction.objectStore(SYNC_QUEUE_STORE);
      const request = store.add(item);

      request.onsuccess = () => {
        console.log(`[Cache] Added to sync queue: ${item.id}`);
        resolve(request.result as number);
      };

      request.onerror = () => {
        console.error('[Cache] Error adding to sync queue:', request.error);
        reject(request.error);
      };
    });
  } catch (error) {
    console.error('[Cache] Error in addToSyncQueue:', error);
    throw error;
  }
}

/**
 * Get items from sync queue
 */
export async function getSyncQueue(): Promise<SyncQueueItem[]> {
  try {
    const database = await getDB();

    return new Promise((resolve, reject) => {
      const transaction = database.transaction([SYNC_QUEUE_STORE], 'readonly');
      const store = transaction.objectStore(SYNC_QUEUE_STORE);
      const request = store.getAll();

      request.onsuccess = () => {
        const results = request.result as SyncQueueItem[];
        console.log(`[Cache] Retrieved ${results.length} sync queue items`);
        resolve(results);
      };

      request.onerror = () => {
        console.error('[Cache] Error retrieving sync queue:', request.error);
        reject(request.error);
      };
    });
  } catch (error) {
    console.error('[Cache] Error in getSyncQueue:', error);
    return [];
  }
}

/**
 * Remove from sync queue
 */
export async function removeFromSyncQueue(id: string): Promise<void> {
  try {
    const database = await getDB();

    return new Promise((resolve, reject) => {
      const transaction = database.transaction([SYNC_QUEUE_STORE], 'readwrite');
      const store = transaction.objectStore(SYNC_QUEUE_STORE);
      const request = store.delete(id);

      request.onsuccess = () => {
        console.log(`[Cache] Removed from sync queue: ${id}`);
        resolve();
      };

      request.onerror = () => {
        console.error('[Cache] Error removing from sync queue:', request.error);
        reject(request.error);
      };
    });
  } catch (error) {
    console.error('[Cache] Error in removeFromSyncQueue:', error);
  }
}

/**
 * Clear all cached weather
 */
export async function clearWeatherCache(): Promise<void> {
  try {
    const database = await getDB();

    return new Promise((resolve, reject) => {
      const transaction = database.transaction([WEATHER_STORE], 'readwrite');
      const store = transaction.objectStore(WEATHER_STORE);
      const request = store.clear();

      request.onsuccess = () => {
        console.log('[Cache] Weather cache cleared');
        resolve();
      };

      request.onerror = () => {
        console.error('[Cache] Error clearing weather cache:', request.error);
        reject(request.error);
      };
    });
  } catch (error) {
    console.error('[Cache] Error in clearWeatherCache:', error);
  }
}

/**
 * Clear all sync queue
 */
export async function clearSyncQueue(): Promise<void> {
  try {
    const database = await getDB();

    return new Promise((resolve, reject) => {
      const transaction = database.transaction([SYNC_QUEUE_STORE], 'readwrite');
      const store = transaction.objectStore(SYNC_QUEUE_STORE);
      const request = store.clear();

      request.onsuccess = () => {
        console.log('[Cache] Sync queue cleared');
        resolve();
      };

      request.onerror = () => {
        console.error('[Cache] Error clearing sync queue:', request.error);
        reject(request.error);
      };
    });
  } catch (error) {
    console.error('[Cache] Error in clearSyncQueue:', error);
  }
}

/**
 * Get cache statistics
 */
export async function getCacheStats(): Promise<{
  weatherCacheSize: number;
  syncQueueSize: number;
  totalSize: number;
}> {
  try {
    const weatherCache = await getAllCachedWeather();
    const syncQueue = await getSyncQueue();

    return {
      weatherCacheSize: weatherCache.length,
      syncQueueSize: syncQueue.length,
      totalSize: weatherCache.length + syncQueue.length,
    };
  } catch (error) {
    console.error('[Cache] Error getting stats:', error);
    return {
      weatherCacheSize: 0,
      syncQueueSize: 0,
      totalSize: 0,
    };
  }
}
