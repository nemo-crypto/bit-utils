import type { StoragePort } from '../ports/storage.js';

/** 每个实例独立持有数据，适合 Node 示例和离线测试。 */
export class MemoryStorage implements StoragePort {
  private readonly entries = new Map<string, string>();

  getItem(key: string): string | null {
    return this.entries.get(key) ?? null;
  }

  setItem(key: string, value: string): void {
    this.entries.set(key, value);
  }

  removeItem(key: string): void {
    this.entries.delete(key);
  }
}
