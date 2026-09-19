// db.js — Camada de persistência em IndexedDB (key-value simples)
// Stores: 'config' (settings, trial), 'historico' (últimos cálculos), 'cache'

const DB_NAME = 'casillas-app';
const DB_VERSION = 1;
const STORES = ['config', 'historico', 'cache'];

let dbInstance = null;
let dbPromise = null;

export async function initDB() {
  if (dbInstance) return dbInstance;
  if (dbPromise) return dbPromise;

  dbPromise = new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);

    req.onupgradeneeded = (event) => {
      const db = event.target.result;
      STORES.forEach((name) => {
        if (!db.objectStoreNames.contains(name)) {
          db.createObjectStore(name);
        }
      });
    };

    req.onsuccess = (event) => {
      dbInstance = event.target.result;
      resolve(dbInstance);
    };

    req.onerror = () => reject(req.error);
  });

  return dbPromise;
}

export async function getDB(storeName, key) {
  const db = await initDB();
  if (!db.objectStoreNames.contains(storeName)) return null;

  return new Promise((resolve, reject) => {
    const tx = db.transaction(storeName, 'readonly');
    const store = tx.objectStore(storeName);
    const req = store.get(key);

    req.onsuccess = () => resolve(req.result ?? null);
    req.onerror = () => reject(req.error);
  });
}

export async function setDB(storeName, key, value) {
  const db = await initDB();
  if (!db.objectStoreNames.contains(storeName)) return false;

  return new Promise((resolve, reject) => {
    const tx = db.transaction(storeName, 'readwrite');
    const store = tx.objectStore(storeName);
    const req = store.put(value, key);

    req.onsuccess = () => resolve(true);
    req.onerror = () => reject(req.error);
  });
}
