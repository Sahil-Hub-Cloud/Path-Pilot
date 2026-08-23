const DB_NAME = 'pathpilot-offline';
const DB_VERSION = 1;
const STORE_NAME = 'lab-data';

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'key' });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function idbGet<T>(key: string): Promise<T | null> {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const req = store.get(key);
      req.onsuccess = () => resolve(req.result?.value ?? null);
      req.onerror = () => reject(req.error);
    });
  } catch {
    return null;
  }
}

export async function idbSet<T>(key: string, value: T): Promise<void> {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const req = store.put({ key, value, updatedAt: Date.now() });
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  } catch {
    // silent fail
  }
}

export async function idbDelete(key: string): Promise<void> {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const req = store.delete(key);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  } catch {
    // silent fail
  }
}

export async function idbGetAll(): Promise<Record<string, unknown>[]> {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const req = store.getAll();
      req.onsuccess = () => resolve(req.result || []);
      req.onerror = () => reject(req.error);
    });
  } catch {
    return [];
  }
}

export function getLabStorageKey(userId: string, labId: string, suffix: string): string {
  return `pp_${suffix}_${userId}_${labId}`;
}

export async function saveLabCode(userId: string, labId: string, files: unknown): Promise<void> {
  const key = getLabStorageKey(userId, labId, 'lab_code');
  await idbSet(key, files);
}

export async function loadLabCode(userId: string, labId: string): Promise<unknown | null> {
  const key = getLabStorageKey(userId, labId, 'lab_code');
  return idbGet(key);
}

export async function saveTerminalHistory(userId: string, labId: string, history: string): Promise<void> {
  const key = getLabStorageKey(userId, labId, 'terminal_history');
  await idbSet(key, history);
}

export async function loadTerminalHistory(userId: string, labId: string): Promise<string | null> {
  const key = getLabStorageKey(userId, labId, 'terminal_history');
  return idbGet(key);
}

export async function savePasteEvents(userId: string, labId: string, events: unknown[]): Promise<void> {
  const key = getLabStorageKey(userId, labId, 'paste_events');
  await idbSet(key, events);
}

export async function loadPasteEvents(userId: string, labId: string): Promise<unknown[]> {
  const key = getLabStorageKey(userId, labId, 'paste_events');
  return (await idbGet<unknown[]>(key)) || [];
}
