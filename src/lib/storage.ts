import localforage from 'localforage';

const store = localforage.createInstance({
  name: 'amar-foshol',
  storeName: 'app_store'
});

export async function setItem<T>(key: string, value: T) {
  try {
    await store.setItem(key, value);
    return true;
  } catch (error) {
    console.error('Storage set error', error);
    return false;
  }
}

export async function getItem<T>(key: string): Promise<T | null> {
  try {
    const v = await store.getItem<T>(key);
    return v ?? null;
  } catch (error) {
    console.error('Storage get error', error);
    return null;
  }
}

export async function removeItem(key: string) {
  try {
    await store.removeItem(key);
    return true;
  } catch (error) {
    console.error('Storage remove error', error);
    return false;
  }
}

export async function clearAll() {
  try {
    await store.clear();
    return true;
  } catch (error) {
    console.error('Storage clear error', error);
    return false;
  }
}

export function isOnline() {
  return typeof navigator !== 'undefined' ? navigator.onLine : true;
}
