import type { StoragePort } from '../ports/storage.js';

/** 显式传入 localStorage/sessionStorage；导入模块时不访问 window。 */
export function createBrowserStorage(storage: StoragePort): StoragePort {
  return {
    getItem: (key) => storage.getItem(key),
    setItem: (key, value) => storage.setItem(key, value),
    removeItem: (key) => storage.removeItem(key),
  };
}
