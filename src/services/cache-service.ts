import type { StoragePort } from '../ports/storage.js';

export interface CacheOptions<T> {
  storage: StoragePort;
  /** 外部数据只有通过运行时校验后，才能被视为 T。 */
  isValue: (value: unknown) => value is T;
  prefix?: string;
  now?: () => number;
}

export class CacheService<T> {
  private readonly storage: StoragePort;
  private readonly isValue: (value: unknown) => value is T;
  private readonly prefix: string;
  private readonly now: () => number;

  constructor(options: CacheOptions<T>) {
    this.storage = options.storage;
    this.isValue = options.isValue;
    this.prefix = options.prefix ?? 'demo:';
    this.now = options.now ?? Date.now;
  }

  set(key: string, value: T, ttlMs: number): void {
    const expiresAt = this.now() + ttlMs;
    if (!Number.isFinite(ttlMs) || ttlMs < 0 || !Number.isFinite(expiresAt)) {
      throw new RangeError('ttlMs 必须是非负有限毫秒数，过期时间必须有效');
    }
    if (!this.isValue(value)) throw new TypeError('缓存值未通过校验');
    const encoded = JSON.stringify({ version: 1, expiresAt, value });
    // JSON 会丢弃 undefined、将 NaN 转为 null；验证实际存储的数据。
    const decoded: unknown = JSON.parse(encoded);
    if (!this.isEnvelope(decoded)) throw new TypeError('缓存值无法按契约序列化');
    this.storage.setItem(this.prefix + key, encoded);
  }

  get(key: string): T | null {
    const raw = this.storage.getItem(this.prefix + key);
    if (raw === null) return null;
    let envelope: unknown;
    try {
      envelope = JSON.parse(raw);
    } catch {
      this.remove(key);
      return null;
    }
    if (!this.isEnvelope(envelope)) {
      this.remove(key);
      return null;
    }
    const now = this.now();
    if (!Number.isFinite(now)) throw new RangeError('时钟必须返回有限毫秒数');
    if (now >= envelope.expiresAt) {
      this.remove(key);
      return null;
    }
    return envelope.value;
  }

  remove(key: string): void {
    this.storage.removeItem(this.prefix + key);
  }

  private isEnvelope(value: unknown): value is { version: 1; expiresAt: number; value: T } {
    return typeof value === 'object' && value !== null
      && 'version' in value && value.version === 1
      && 'expiresAt' in value && typeof value.expiresAt === 'number'
      && Number.isFinite(value.expiresAt)
      && 'value' in value && this.isValue(value.value);
  }
}
