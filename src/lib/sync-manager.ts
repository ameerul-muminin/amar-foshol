/**
 * Sync Manager
 * Handles syncing of offline cached data when connection is restored
 */

import {
  getSyncQueue,
  removeFromSyncQueue,
  addToSyncQueue,
  getAllCachedWeather,
  cacheWeatherData,
} from './cache-service';

export interface SyncManager {
  isSyncing: boolean;
  syncStatus: string;
  pendingItems: number;
}

class SyncService {
  private isSyncing = false;
  private syncStatus = '';
  private syncCallback: ((status: SyncManager) => void) | null = null;

  /**
   * Initialize sync service
   */
  initialize(callback: (status: SyncManager) => void) {
    this.syncCallback = callback;

    // Listen for online event
    window.addEventListener('online', () => {
      console.log('[Sync] Network restored, starting sync');
      this.performSync();
    });

    // Check periodically if we're online and have pending items
    setInterval(() => {
      if (navigator.onLine) {
        this.performSync();
      }
    }, 30000); // Check every 30 seconds
  }

  /**
   * Notify listeners of sync status
   */
  private notifySync() {
    if (this.syncCallback) {
      this.syncCallback({
        isSyncing: this.isSyncing,
        syncStatus: this.syncStatus,
        pendingItems: 0,
      });
    }
  }

  /**
   * Perform sync of all pending items
   */
  async performSync() {
    if (this.isSyncing || !navigator.onLine) {
      return;
    }

    this.isSyncing = true;
    this.syncStatus = 'সিঙ্ক শুরু হচ্ছে...';
    this.notifySync();

    try {
      const syncQueue = await getSyncQueue();

      if (syncQueue.length === 0) {
        console.log('[Sync] No items to sync');
        this.isSyncing = false;
        this.syncStatus = '';
        this.notifySync();
        return;
      }

      console.log(`[Sync] Starting sync of ${syncQueue.length} items`);

      let successCount = 0;
      let failureCount = 0;

      for (const item of syncQueue) {
        this.syncStatus = `${successCount + failureCount + 1}/${syncQueue.length} সিঙ্ক হচ্ছে`;
        this.notifySync();

        try {
          await this.syncItem(item);
          await removeFromSyncQueue(item.id);
          successCount++;
        } catch (error) {
          console.error(`[Sync] Error syncing item ${item.id}:`, error);

          if (item.retries < item.maxRetries) {
            // Retry
            item.retries++;
            await addToSyncQueue(item.type, item.data);
          }
          failureCount++;
        }
      }

      this.syncStatus = `সফল: ${successCount}, ব্যর্থ: ${failureCount}`;
      console.log(`[Sync] Sync complete. Success: ${successCount}, Failed: ${failureCount}`);

      setTimeout(() => {
        this.isSyncing = false;
        this.syncStatus = '';
        this.notifySync();
      }, 2000);
    } catch (error) {
      console.error('[Sync] Sync error:', error);
      this.isSyncing = false;
      this.syncStatus = 'সিঙ্ক ত্রুটি';
      this.notifySync();
    }
  }

  /**
   * Sync individual item
   */
  private async syncItem(item: any): Promise<void> {
    switch (item.type) {
      case 'weather':
        return this.syncWeather(item);
      case 'advisory':
        return this.syncAdvisory(item);
      case 'profile':
        return this.syncProfile(item);
      default:
        throw new Error(`Unknown sync type: ${item.type}`);
    }
  }

  /**
   * Sync weather data
   */
  private async syncWeather(item: any): Promise<void> {
    console.log('[Sync] Syncing weather:', item.data);
    // Weather data is already cached, just mark as synced
    // In a real app, this would send to server
    return new Promise((resolve) => {
      setTimeout(() => resolve(), 500);
    });
  }

  /**
   * Sync advisory data
   */
  private async syncAdvisory(item: any): Promise<void> {
    console.log('[Sync] Syncing advisory:', item.data);
    // Advisory data sync
    return new Promise((resolve) => {
      setTimeout(() => resolve(), 500);
    });
  }

  /**
   * Sync profile data
   */
  private async syncProfile(item: any): Promise<void> {
    console.log('[Sync] Syncing profile:', item.data);
    // Profile data sync
    return new Promise((resolve) => {
      setTimeout(() => resolve(), 500);
    });
  }

  /**
   * Get current sync status
   */
  getStatus(): SyncManager {
    return {
      isSyncing: this.isSyncing,
      syncStatus: this.syncStatus,
      pendingItems: 0,
    };
  }
}

// Export singleton instance
export const syncManager = new SyncService();
